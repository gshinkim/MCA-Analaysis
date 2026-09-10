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

function bubble(who, html){
  const d=document.createElement('div'); d.className='msg '+who; d.innerHTML=html;
  $('#msgs').append(d); $('#msgs').scrollTop=1e9; return d;
}

export function toggleChat(force){
  const c=$('#chat'), on = force ?? !c.classList.contains('on');
  c.classList.toggle('on',on);
  $('#aiBtn').setAttribute('aria-expanded',on);
  $('#aiBar').style.opacity = on ? .35 : 1;
  if(on) setTimeout(()=>$('#ask').focus(),120);
}

function renderSugg(){
  const s=$('#sugg'); s.textContent=''; s.hidden=false;
  SUGGEST.forEach(t=>{ const b=document.createElement('button'); b.className='btn sm'; b.textContent=t;
    b.onclick=()=>{ $('#ask').value=t; send(); }; s.append(b); });
}

function send(){
  const v=$('#ask').value.trim();
  if(!v || abort) return;
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
  let body = '', lastPhase = '', thoughts = '';

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
      if(ev.type==='session'){ S.sessionId = ev.sessionId; return; }
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
        if(ev.ms) { const m=document.createElement('div'); m.className='meta';
                    m.textContent = (ev.ms/1000).toFixed(1)+'s · '+(ev.turns??0)+' turns'; wrap.append(m); }
        return;
      }
      if(ev.type==='model_changed'){ onModelChanged(ev.src); return; }
      if(ev.type==='fatal'){ text.innerHTML = '<span class="err">'+esc(ev.error)+'</span>'; return; }
      if(ev.type==='done' || ev.type==='closed'){
        if(thoughts && !think.classList.contains('done')){
          const secs = Math.max(1, Math.round((Date.now()-started)/1000));
          tkLabel.textContent = 'Thought for '+secs+'s';
          think.classList.add('done');
        }
        if(!body && ev.type==='done' && ev.code) text.innerHTML =
          '<span class="err">The agent exited with code '+ev.code+'. Check the server log.</span>';
        abort=null; $('#send').textContent='Send'; $('#msgs').scrollTop=1e9;
      }
  };

  if(rt.runtime === 'openai' && S.env?.hosted){
    // Hosted: this server is not the user's machine, so it cannot reach their model
    // runtime. The agent runs in the page instead — which is why a hosted setup still
    // needs the model server to allow this origin. Locally we never take that path.
    const a = runBrowserAgent({
      cfg: rt.chatCfg, prompt: v, useWorkflow: useWorkflow(),
      getModel: () => $('#model').value,
      setModel: src => { $('#model').value = src;
                         $('#model').dispatchEvent(new Event('input',{bubbles:true})); },
      onEvent: handle,
    });
    abort = () => a.kill();
  } else {
    abort = api.chat({ message: v, sessionId: S.sessionId, ...rt, useWorkflow: useWorkflow() }, handle);
  }
}

export function initChat(){
  $('#aiBtn').onclick   = ()=>toggleChat();
  $('#chatRail').onclick= ()=>toggleChat(true);
  $('#chatClose').onclick=()=>toggleChat(false);
  $('#send').onclick = ()=>{ if(abort){ abort(); abort=null; $('#send').textContent='Send'; } else send(); };
  $('#ask').addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); } });
  $('#ask').addEventListener('input',e=>{
    e.target.style.height='auto'; e.target.style.height=Math.min(110,e.target.scrollHeight)+'px'; });
  renderSugg();
  bubble('ai','I read and edit the model in the editor, run Tellurium, and route every analysis '+
              'through the <code>mca-tellurium</code> workflow.');
}
