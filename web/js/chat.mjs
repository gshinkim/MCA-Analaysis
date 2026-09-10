import { $, store } from './util.mjs';
import { S } from './state.mjs';
import * as api from './api.mjs';
import { resolveModel, useWorkflow } from './settings.mjs';
import { runBrowserAgent } from './agent.mjs';

const SUGGEST = [
  'Explain what this model does',
  'Which step controls the pathway flux?',
  'Compute the flux control coefficients',
];

let abort = null, onModelChanged = () => {};
export const setOnModelChanged = fn => { onModelChanged = fn; };

const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* Conversations live only in this module: no localStorage, no file, nothing sent
   anywhere to be kept. Reload the page or close the tab and every log is gone,
   which is the whole point — the agent remembers within a session and forgets
   when it ends. */
const chats = [];
let active = null, seq = 0;
const cur = () => chats.find(c => c.id === active);

function makeChat(){
  const thread = document.createElement('div');
  thread.className = 'thread';
  $('#msgs').append(thread);
  const c = { id: ++seq, title: 'New chat', thread, history: [], sessionId: null };
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
  const seen = new Set();
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
    if(seen.has(label)) return;
    seen.add(label);
    const c=document.createElement('span'); c.className='tool'; c.textContent=label; phase.append(c);
  };
  const status = t => { text.innerHTML = '<span class="thinking">'+t+'</span>'; };
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
      if(ev.type==='delta'){ body += ev.text; text.textContent = body; $('#msgs').scrollTop=1e9; return; }
      if(ev.type==='result'){
        if(ev.text) body = ev.text;
        text.textContent = body || '(no answer returned)';
        if(thoughts){
          const secs = Math.max(1, Math.round((Date.now()-started)/1000));
          tkLabel.textContent = 'Thought for '+(secs>=60 ? Math.floor(secs/60)+'m '+(secs%60)+'s' : secs+'s');
          tkTime.textContent = '';
          think.classList.add('done');
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
      if(ev.type==='fatal'){
        failed = true; text.innerHTML = '<span class="err">'+esc(ev.error)+'</span>'; return; }
      if(ev.type==='done' || ev.type==='closed'){
        // 'done' (agent) and 'closed' (stream end) both arrive on the server path
        if(!logged){
          logged = true;
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
                       ...rt, useWorkflow: useWorkflow() }, handle);
  }
}

export function initChat(){
  $('#aiBtn').onclick   = ()=>toggleChat();
  $('#chatRail').onclick= ()=>toggleChat(true);
  $('#chatClose').onclick=()=>toggleChat(false);
  $('#newChat').onclick = ()=>{ if(abort){ abort(); abort=null; $('#send').textContent='Send'; }
                               makeChat(); $('#ask').focus(); };
  $('#chatPick').onchange = e => { if(abort){ abort(); abort=null; $('#send').textContent='Send'; }
                                   show(+e.target.value); };
  $('#send').onclick = ()=>{ if(abort){ abort(); abort=null; $('#send').textContent='Send'; } else send(); };
  $('#ask').addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); } });
  $('#ask').addEventListener('input',e=>{
    e.target.style.height='auto'; e.target.style.height=Math.min(110,e.target.scrollHeight)+'px'; });
  renderSugg();
  makeChat();
}
