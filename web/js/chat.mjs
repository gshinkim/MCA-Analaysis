import { $, store, flash } from './util.mjs';
import { S } from './state.mjs';
import * as api from './api.mjs';
import { resolveModel, useWorkflow, scratchDir, openSettings } from './settings.mjs';
import { runBrowserAgent } from './agent.mjs';
import { renderMarkdown } from './md.mjs';
import { downloadChat } from './export.mjs';
import { currentId, saveSoon, setTurnBusy, openSessionById, deleteCurrent } from './session.mjs';
import { pickSession } from './sessionpicker.mjs';

const SUGGEST = [
  'Explain what this model does',
  'Which step controls the pathway flux?',
  'Compute the flux control coefficients',
];

let abort = null, onModelChanged = () => {}, onSessionDeleted = () => {};
export const setOnModelChanged = fn => { onModelChanged = fn; };
export const setOnSessionDeleted = fn => { onSessionDeleted = fn; };

const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* Conversations live only in this module: no localStorage, no file, nothing sent
   anywhere to be kept. Reload the page or close the tab and every log is gone,
   which is the whole point — the agent remembers within a session and forgets
   when it ends. */
const chats = [];
let active = null, seq = 0;
const cur = () => chats.find(c => c.id === active);

/* Sessions persist conversations to disk, so the array stops being private to this
   module. `thread` is a live DOM node and never travels; everything else does. */
export const dumpChats = () => chats.map(({ id, title, history, sessionId, log, summary }) =>
  ({ id, title, history, sessionId, log, summary }));

export function loadChats(saved){
  chats.forEach(c => c.thread.remove());
  chats.length = 0; active = null;
  for(const s of saved ?? []){
    const thread = document.createElement('div');
    thread.className = 'thread';
    $('#msgs').append(thread);
    chats.push({ ...s, thread });
    seq = Math.max(seq, s.id ?? 0);
    for(const turn of s.log ?? []){
      const d = document.createElement('div'); d.className = 'msg me';
      d.textContent = turn.q; thread.append(d);
      const a = document.createElement('div'); a.className = 'msg ai';
      a.innerHTML = renderMarkdown(turn.a || '*(no answer)*'); thread.append(a);
    }
  }
  if(!chats.length) makeChat(); else show(chats.at(-1).id);
}

function makeChat(){
  const thread = document.createElement('div');
  thread.className = 'thread';
  $('#msgs').append(thread);
  const c = { id: ++seq, title: 'New chat', thread, history: [], sessionId: null, log: [] };
  chats.push(c);
  show(c.id);
  bubble('ai','I read and edit the model in the editor, run Tellurium, and route every '+
              'analysis through the <code>mca-tellurium</code> workflow. I remember this '+
              'conversation until the page is closed.');
  return c;
}

function show(id){
  active = id;
  chats.forEach(c => { c.thread.hidden = c.id !== id; });
  renderChatPick();
  const c = cur();
  $('#sugg').hidden = !c || c.history.length > 0;
  $('#msgs').scrollTop = 1e9;
}

function renderChatPick(){
  const sel = $('#chatPick'); if(!sel) return;
  sel.textContent = '';
  chats.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = c.title; sel.append(o);
  });
  sel.value = active;
}

function bubble(who, html){
  const d=document.createElement('div'); d.className='msg '+who; d.innerHTML=html;
  (cur()?.thread ?? $('#msgs')).append(d); $('#msgs').scrollTop=1e9; return d;
}

export function toggleChat(force){
  const c=$('#chat'), on = force ?? !c.classList.contains('on');
  c.classList.toggle('on',on);
  $('#aiBtn').setAttribute('aria-expanded',on);
  $('#aiBar').style.opacity = on ? .35 : 1;
  if(on) setTimeout(()=>$('#ask').focus(),120);
}

function renderSugg(){
  const s=$('#sugg'); s.textContent='';
  SUGGEST.forEach(t=>{ const b=document.createElement('button'); b.className='btn sm'; b.textContent=t;
    b.onclick=()=>{ $('#ask').value=t; send(); }; s.append(b); });
}

function send(){
  const v=$('#ask').value.trim();
  if(!v || abort) return;
  const c = cur() ?? makeChat();
  if(!c.history.length){                       // name the conversation by its opening line
    c.title = v.length > 34 ? v.slice(0,33)+'…' : v;
    renderChatPick();
  }
  bubble('me', esc(v));
  $('#ask').value=''; $('#ask').style.height='auto';
  $('#sugg').hidden=true;
  $('#send').textContent='Stop';
  setTurnBusy(true);

  const sel = store.get('modelSel','cc:opus');
  const rt  = resolveModel(sel);
  const wrap = bubble('ai','');
  const phase = document.createElement('div'); phase.className='tools'; wrap.append(phase);

  // native <details>: free keyboard access, free open/close state, no JS
  const think = document.createElement('details'); think.className='think'; think.hidden = true;
  think.innerHTML = '<summary><span class="tk-dot"></span><span class="tk-label">Thinking</span>'+
                    '<span class="tk-time"></span></summary><div class="tk-body"></div>';
  wrap.append(think);
  const tkBody = think.querySelector('.tk-body');
  const tkLabel = think.querySelector('.tk-label');
  const tkTime = think.querySelector('.tk-time');

  const text = document.createElement('div'); text.className='txt'; wrap.append(text);
  // its own line: status used to be written into `text`, so one 'log' event
  // mid-stream erased everything the model had already said
  const stat = document.createElement('div'); stat.className='stat-line'; wrap.append(stat);
  const seen = new Set(), chips = new Map();
  const started = Date.now();
  let body = '', lastPhase = '', thoughts = '', failed = false, logged = false;

  const addTool = t => {
    const label = t.name==='Workflow'    ? 'workflow: mca-tellurium'
                : t.name==='run_python' || t.name==='python' ? 'python'
                : t.name==='load_skill'  ? 'skill: '+(t.input?.name ?? '?')
                : t.name==='Skill'       ? 'skill: '+(t.input?.skill ?? '?')
                : t.name==='read_file'   ? 'read'
                : t.name==='write_file'  ? 'write'
                : t.name==='Bash'        ? 'bash'
                : t.name.toLowerCase();
    // A repeated call used to render as the same single chip, so a model looping
    // ten times on one tool looked identical to one that worked first time.
    const prev = chips.get(label);
    if(prev){ prev.n++; prev.el.textContent = label+' ×'+prev.n; return; }
    const c=document.createElement('span'); c.className='tool'; c.textContent=label; phase.append(c);
    chips.set(label, { el:c, n:1 });
    seen.add(label);
  };
  const status = t => { stat.innerHTML = '<span class="thinking">'+esc(t)+'</span>'; };
  const clearStatus = () => { stat.textContent=''; };
  status(useWorkflow() ? 'Starting the model-scientist agent…'
                       : 'Starting the model-scientist agent (workflow off)…');

  const handle = ev => {
      if(ev.type==='session'){ c.sessionId = ev.sessionId; S.sessionId = ev.sessionId; return; }
      if(ev.type==='init'){ status('Agent started…'); return; }
      if(ev.type==='workflow_start'){ status('Running mca-tellurium…'); return; }
      if(ev.type==='workflow_done'){ status('Workflow finished, composing the answer…'); return; }
      if(ev.type==='phase'){
        if(ev.phase && !seen.has('phase:'+ev.phase)){
          seen.add('phase:'+ev.phase);
          const c=document.createElement('span'); c.className='tool phase';
          c.textContent=ev.phase; phase.append(c);
        }
        // Each stage reasons from a fresh context, so without a heading the panel
        // reads as one model repeating itself instead of seven stages making progress.
        if(ev.phase && ev.phase !== lastPhase && thoughts){
          thoughts += '\n\n— '+ev.phase+' —\n';
          tkBody.textContent = thoughts;
        }
        lastPhase = ev.phase || lastPhase;
        status(ev.phase ? 'Phase: '+ev.phase : 'Working…');
        return;
      }
      if(ev.type==='log'){ status(ev.text); return; }
      if(ev.type==='heartbeat'){
        const m=Math.floor(ev.seconds/60), sec=ev.seconds%60;
        status((lastPhase?'Phase: '+lastPhase+' · ':'Working · ')+(m?m+'m ':'')+sec+'s');
        return;
      }
      if(ev.type==='tools'){
        ev.tools.forEach(t=>addTool(t));
        body=''; text.textContent='';    // preamble before a tool call is not the answer
        $('#msgs').scrollTop=1e9; return;
      }
      if(ev.type==='unthink'){
        // the model's template pre-opened <think>: what streamed as the answer
        // was really the scratchpad, so move it into the thinking panel
        thoughts += body; body=''; text.textContent='';
        think.hidden=false; tkBody.textContent=thoughts; return;
      }
      if(ev.type==='thinking'){
        // a whole block repeats what the deltas already streamed
        if(ev.whole && thoughts.includes(ev.text.trim().slice(0,60))) return;
        if(ev.tools) ev.tools.forEach(t=>addTool(t));
        // streamed deltas concatenate; only whole blocks get a separator, or every
        // token lands on its own line
        thoughts += (ev.whole && thoughts && !thoughts.endsWith('\n') ? '\n\n' : '') + ev.text;
        think.hidden = false;
        tkBody.textContent = thoughts;
        if(think.open) $('#msgs').scrollTop=1e9;
        return;
      }
      if(ev.type==='delta'){ body += ev.text; text.textContent = body; clearStatus();
                             $('#msgs').scrollTop=1e9; return; }
      if(ev.type==='result'){
        if(ev.text) body = ev.text;
        clearStatus();
        if(body) text.innerHTML = renderMarkdown(body);
        else text.textContent = '(no answer returned)';
        if(thoughts){
          const secs = Math.max(1, Math.round((Date.now()-started)/1000));
          tkLabel.textContent = 'Thought for '+(secs>=60 ? Math.floor(secs/60)+'m '+(secs%60)+'s' : secs+'s');
          tkTime.textContent = '';
          think.classList.add('done');
        }
        if(ev.unverified && body){
          const w=document.createElement('div'); w.className='meta warn';
          w.textContent='No computation was run this turn — any number above came from '+
                        'the model, not from Tellurium.';
          wrap.append(w);
        }
        if(ev.noTools && body){
          // a model that answers a question about the model without ever reading it
          const w=document.createElement('div'); w.className='meta warn';
          w.textContent='No tools were called — nothing here was checked against the '+
                        'model or Tellurium.';
          wrap.append(w);
        }
        if(ev.ms) { const m=document.createElement('div'); m.className='meta';
                    m.textContent = (ev.ms/1000).toFixed(1)+'s · '+(ev.turns??0)+' turns'; wrap.append(m); }
        return;
      }
      if(ev.type==='model_changed'){ onModelChanged(ev.src); return; }
      if(ev.type==='compacted'){ c.summary = ev.summary; return; }
      if(ev.type==='fatal'){
        failed = true; text.innerHTML = '<span class="err">'+esc(ev.error)+'</span>'; return; }
      if(ev.type==='done' || ev.type==='closed'){
        // 'done' (agent) and 'closed' (stream end) both arrive on the server path
        clearStatus();
        if(body && !text.innerHTML.trim()) text.innerHTML = renderMarkdown(body);
        if(!logged){
          logged = true;
          c.log.push({ q: v, a: body, tools: [...seen].filter(x => !x.startsWith('phase:')) });
          const acts = [...seen].filter(x => !x.startsWith('phase:'));
          c.history.push({ role:'user', content: v });
          c.history.push({ role:'assistant', content: (body || '(no answer)') +
            (acts.length ? '\n\n[tools used this turn: '+acts.join(', ')+']' : '') });
          // ponytail: last 12 messages; the system prompt is already ~8k tokens.
          // Summarise instead if conversations need to run longer than that.
          if(c.history.length > 12) c.history.splice(0, c.history.length - 12);
        }
        if(thoughts && !think.classList.contains('done')){
          const secs = Math.max(1, Math.round((Date.now()-started)/1000));
          tkLabel.textContent = 'Thought for '+secs+'s';
          think.classList.add('done');
        }
        if(!body && !failed && ev.type==='done' && ev.code) text.innerHTML =
          '<span class="err">The agent exited with code '+ev.code+'. Check the server log.</span>';
        abort=null; $('#send').textContent='Send'; $('#msgs').scrollTop=1e9;
        setTurnBusy(false); saveSoon();
      }
  };

  if(rt.runtime === 'openai' && S.env?.hosted){
    // Hosted: this server is not the user's machine, so it cannot reach their model
    // runtime. The agent runs in the page instead — which is why a hosted setup still
    // needs the model server to allow this origin. Locally we never take that path.
    const a = runBrowserAgent({
      cfg: rt.chatCfg, prompt: v, history: c.history, useWorkflow: useWorkflow(),
      getModel: () => $('#model').value,
      setModel: src => { $('#model').value = src;
                         $('#model').dispatchEvent(new Event('input',{bubbles:true})); },
      onEvent: handle,
    });
    abort = () => a.kill();
  } else {
    abort = api.chat({ message: v, sessionId: c.sessionId, history: c.history,
                       sessionDirId: currentId(), resume: !!c.sessionId,
                       ...rt, scratchDir: scratchDir(), useWorkflow: useWorkflow() }, handle);
  }
}

/* The log is the markdown the model actually sent, not a scrape of the rendered
   DOM: what gets saved is the source, so it re-renders anywhere. */
function exportChat(){
  const c = cur();
  if(!c?.log.length) return flash($('#chatSave'), '—');
  const proj = document.querySelector('#projName')?.textContent.trim() || 'MCA Atlas';
  const out = ['# ' + proj + ' — ' + c.title, '', '*' + new Date().toLocaleString() + '*', ''];
  for(const t of c.log){
    out.push('## ' + t.q, '', t.a || '*(no answer)*', '');
    if(t.tools.length) out.push('`tools: ' + t.tools.join(', ') + '`', '');
  }
  downloadChat(proj, out.join('\n'));
}

/* Asked once, on a local install, before the AI has written anything anywhere.
   Declining is a real answer: the default folder inside the app works fine. */
export function offerScratchSetup(){
  if(S.env?.hosted || scratchDir() || store.get('scratchAsked', false)) return;
  const d = bubble('ai', 'Before I run anything \u2014 where should I keep my work? '+
    'Every script, table and result I produce goes in one folder of your choosing, '+
    'so it lands with your other files instead of inside the app.');
  const row = document.createElement('div');
  row.className = 'tools'; row.style.marginTop = '8px';
  const pick = document.createElement('button');
  pick.className = 'btn sm primary'; pick.textContent = 'Choose a folder\u2026';
  pick.onclick = () => { store.set('scratchAsked', true); row.remove(); openSettings(); };
  const skip = document.createElement('button');
  skip.className = 'btn sm ghost'; skip.textContent = 'Use the default';
  skip.onclick = () => { store.set('scratchAsked', true); row.remove(); };
  row.append(pick, skip); d.append(row);
}

export function initChat(){
  $('#chatSave').onclick = exportChat;
  $('#aiBtn').onclick   = ()=>toggleChat();
  $('#chatRail').onclick= ()=>toggleChat(true);
  $('#chatClose').onclick=()=>toggleChat(false);
  $('#newChat').onclick = ()=>{ if(abort){ abort(); abort=null; $('#send').textContent='Send'; }
                               makeChat(); $('#ask').focus(); };
  $('#openSession').onclick = async () => {
    const id = await pickSession();
    if(!id) return;
    if(abort){ abort(); abort=null; $('#send').textContent='Send'; }
    try { await openSessionById(id); }
    catch(e){ alert('Could not open that session: ' + e.message); }
  };
  $('#delSession').onclick = async () => {
    const id = currentId();
    if(!id) return flash($('#delSession'), '—');
    if(!confirm('Delete this session?\n\nThis removes workspace/runs/' + id +
                ' and everything in it — the conversation, the model snapshot and every '+
                'file the AI wrote. This cannot be undone.')) return;
    if(abort){ abort(); abort=null; $('#send').textContent='Send'; }
    const r = await deleteCurrent();
    if(r.error) return alert('Could not delete: ' + r.error);
    onSessionDeleted();          // back to a clean Untitled project — nothing left to regenerate it
    loadChats([]);
  };
  $('#chatPick').onchange = e => { if(abort){ abort(); abort=null; $('#send').textContent='Send'; }
                                   show(+e.target.value); };
  $('#send').onclick = ()=>{ if(abort){ abort(); abort=null; $('#send').textContent='Send'; } else send(); };
  $('#ask').addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); } });
  $('#ask').addEventListener('input',e=>{
    e.target.style.height='auto'; e.target.style.height=Math.min(110,e.target.scrollHeight)+'px'; });
  renderSugg();
  makeChat();
}
