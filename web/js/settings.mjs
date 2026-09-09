import { $, $$, store } from './util.mjs';
import { S } from './state.mjs';
import { pickFile } from './filepicker.mjs';
import { probe as probeLocal, permissionState } from './localai.mjs';

/* Two agent runtimes:
   - claude-code : spawns the Claude Code CLI; real Skill/Workflow tools.
   - openai      : any OpenAI-compatible server (Ollama, LM Studio, llama-server,
                   a gateway). The backend runs workflows/mca-tellurium.js itself
                   against that endpoint, so a plain GGUF drives the same workflow. */

const BUILTIN = [
  { id:'opus',   t:'Claude Opus 5' },
  { id:'sonnet', t:'Claude Sonnet 5' },
  { id:'haiku',  t:'Claude Haiku 4.5' },
];
const DEF = { endpoints: [], local:'none', useWorkflow: true, localCfg:{
  olUrl:'http://localhost:11434', lmUrl:'http://localhost:1234', ggufPath:'', ggufUrl:'http://localhost:8080' } };

export const settings = () => ({ ...DEF, ...store.get('settings', {}),
                                 localCfg: { ...DEF.localCfg, ...(store.get('settings',{}).localCfg||{}) } });

let draft = null;

/* ---- what the chat layer needs to start a turn ---- */
export const useWorkflow = () => settings().useWorkflow !== false;

export function resolveModel(sel){
  const s = settings();
  if(!sel || sel.startsWith('cc:'))
    return { runtime:'claude-code', model: sel ? sel.slice(3) : 'opus' };
  const [kind, ...rest] = sel.split(':');
  const model = rest.join(':');
  if(kind==='ep'){
    const i = +model.split('|')[0], name = model.split('|').slice(1).join('|');
    const ep = s.endpoints[i];
    return ep ? { runtime:'openai', chatCfg:{ baseUrl: ep.base, apiKey: ep.key, model: name } }
              : { runtime:'claude-code', model:'opus' };
  }
  if(kind==='ollama')   return { runtime:'openai', chatCfg:{ baseUrl: s.localCfg.olUrl,   model } };
  if(kind==='lmstudio') return { runtime:'openai', chatCfg:{ baseUrl: s.localCfg.lmUrl,   model } };
  if(kind==='gguf')     return { runtime:'openai', chatCfg:{ baseUrl: s.localCfg.ggufUrl, model: model||'local' } };
  return { runtime:'claude-code', model:'opus' };
}

export function modelOptions(){
  const s=settings();
  // Hosted runs Tellurium only; the Claude Code runtime needs the local CLI, so
  // offering it there would just fail on send.
  const out = S.env?.hosted ? [] : BUILTIN.map(b=>({ v:'cc:'+b.id, t:b.t }));
  s.endpoints.forEach((e,i)=>(e.models||'').split(',').map(m=>m.trim()).filter(Boolean)
    .forEach(m=>out.push({ v:'ep:'+i+'|'+m, t:(e.name||'Endpoint')+' · '+m })));
  const local = s.localCfg;
  if(s.local==='ollama')   (local.olModels||'').split(',').map(m=>m.trim()).filter(Boolean)
    .forEach(m=>out.push({ v:'ollama:'+m, t:'Ollama · '+m }));
  if(s.local==='lmstudio') (local.lmModels||'').split(',').map(m=>m.trim()).filter(Boolean)
    .forEach(m=>out.push({ v:'lmstudio:'+m, t:'LM Studio · '+m }));
  if(s.local==='gguf'){
    // the id the server serves, not the filename — a strict server 404s on a filename
    const served = (local.ggufModels||'').split(',').map(m=>m.trim()).filter(Boolean);
    if(served.length) served.forEach(m=>out.push({ v:'gguf:'+m, t:'Local · '+m }));
    else if(local.ggufPath)
      out.push({ v:'gguf:'+local.ggufPath.split('/').pop(), t:'GGUF · '+local.ggufPath.split('/').pop() });
  }
  return out;
}

export function fillModels(){
  const opts=modelOptions(), cur=store.get('modelSel','cc:opus');
  [$('#modelPick'),$('#modelPick2')].forEach(sel=>{
    sel.textContent='';
    opts.forEach(o=>{ const e=document.createElement('option'); e.value=o.v; e.textContent=o.t; sel.append(e); });
    if(!opts.length){
      const e=document.createElement('option');
      e.value=''; e.textContent='No model — open Settings'; sel.append(e);
    }
    sel.value = opts.some(o=>o.v===cur) ? cur : (opts[0]?.v ?? '');
  });
  store.set('modelSel', $('#modelPick').value);
}

/* ---- endpoints tab ---- */
/* Probes straight from the browser — that is the whole point: the request has to
   come from the page so the browser can prompt for local network access, and so
   the model server sees this site's origin. */
async function probe(baseUrl, apiKey, into){
  into.className='probe'; into.textContent='Connecting…';
  const r = await probeLocal(baseUrl);
  if(r.status==='ok'){
    into.className='probe ok';
    into.textContent = '✓ '+r.detail+(r.models?.length ? ': '+r.models.join(', ') : '');
    return r.models;
  }
  into.className='probe bad';
  into.textContent = (r.status==='permission' ? '⚠ ' : '✕ ')+r.detail;
  return null;
}

function renderEndpoints(){
  const L=$('#keyList'); L.textContent='';
  draft.endpoints.forEach((k,i)=>{
    const d=document.createElement('div'); d.className='keyrow';
    d.innerHTML=
      '<div><label class="lb">Label</label><input class="field" data-f="name"></div>'+
      '<div><label class="lb">Models (comma-sep)</label><input class="field" data-f="models"></div>'+
      '<button class="btn sm ghost" title="Remove">✕</button>'+
      '<div class="full"><label class="lb">Base URL</label><input class="field" data-f="base" placeholder="http://localhost:1234"></div>'+
      '<div class="full"><label class="lb">API key (optional)</label><input class="field" type="password" data-f="key"></div>'+
      '<div class="full"><button class="btn sm">Test connection</button><div class="probe"></div></div>';
    d.querySelectorAll('[data-f]').forEach(inp=>{
      inp.value=k[inp.dataset.f]||''; inp.oninput=()=>{ k[inp.dataset.f]=inp.value; };
    });
    d.querySelector('button').onclick=()=>{ draft.endpoints.splice(i,1); renderEndpoints(); };
    const test=d.querySelectorAll('button')[1], out=d.querySelector('.full .probe');
    test.onclick=async()=>{ const m=await probe(k.base,k.key,out);
      if(m?.length){ k.models=m.join(', '); renderEndpoints(); } };
    L.append(d);
  });
  if(!draft.endpoints.length)
    L.innerHTML='<p class="hint" style="margin:0 0 12px">No custom endpoints. Built-in Claude models are always available.</p>';
}

/* ---- local models tab ---- */
function renderLocal(){
  $$('input[name=loc]').forEach(r=>{ r.checked=r.value===draft.local;
    r.onchange=()=>{ draft.local=r.value; renderLocal(); }; });
  const c=$('#locCfg'); c.textContent='';
  const cfg=draft.localCfg;

  const field=(lb,key,ph)=>{
    const d=document.createElement('div'); d.style.marginBottom='10px';
    d.innerHTML='<label class="lb">'+lb+'</label><input class="field">';
    const i=d.querySelector('input'); i.placeholder=ph||''; i.value=cfg[key]||'';
    i.oninput=()=>{ cfg[key]=i.value; }; c.append(d); return i;
  };
  const server=(lb,urlKey,modelsKey,ph)=>{
    const url=field(lb,urlKey,ph);
    const row=document.createElement('div'); row.style.marginBottom='10px';
    row.innerHTML='<button class="btn sm">Connect to this server</button><div class="probe"></div>';
    const out=row.querySelector('.probe');
    row.querySelector('button').onclick=async()=>{
      const m=await probe(url.value,'',out);
      if(m?.length){ cfg[modelsKey]=m.join(', '); const f=c.querySelector('[data-models]'); if(f) f.value=cfg[modelsKey]; } };
    c.append(row);
    const ms=field('Models (comma-sep)',modelsKey,'filled in by Connect');
    ms.dataset.models='1'; ms.value=cfg[modelsKey]||'';
  };

  if(draft.local==='ollama')   server('Ollama server URL','olUrl','olModels','http://localhost:11434');
  if(draft.local==='lmstudio') server('LM Studio server URL','lmUrl','lmModels','http://localhost:1234');
  if(draft.local==='gguf'){
    const d=document.createElement('div'); d.style.marginBottom='10px';
    d.innerHTML='<label class="lb">GGUF file</label><div class="browse">'+
                '<input class="field" placeholder="/path/to/model.Q4_K_M.gguf">'+
                '<button class="btn sm">Browse…</button></div>';
    const inp=d.querySelector('input'); inp.value=cfg.ggufPath||'';
    inp.oninput=()=>{ cfg.ggufPath=inp.value; };
    d.querySelector('button').onclick=async()=>{
      const p=await pickFile({ title:'Choose a .gguf model', ext:'.gguf' });
      if(p){ cfg.ggufPath=p; inp.value=p; }
    };
    c.append(d);
    server('Server URL that is serving it','ggufUrl','ggufModels','http://localhost:8080');
    const note=document.createElement('p'); note.className='hint';
    note.innerHTML='A .gguf file is weights, not a server. Serve it first, then point the URL above at it:<br>'+
      '<code>llama-server -m &lt;file&gt; --port 8080</code> &nbsp;or&nbsp; <code>lms load &lt;file&gt;</code>';
    c.append(note);
  }
}

/* ---- drawer ---- */
export function openSettings(){
  draft = structuredClone(settings());
  renderEndpoints(); renderLocal(); renderEnv();
  $('#wfToggle').checked = draft.useWorkflow !== false;
  $('#wfToggle').onchange = e => { draft.useWorkflow = e.target.checked; };
  $('#settings').classList.add('on'); $('#scrim').classList.add('on');
  $('#settingsBtn').setAttribute('aria-expanded','true');
  $('#saveMsg').textContent='';
  setTimeout(()=>$('#settingsClose').focus(),80);
}
export function closeSettings(){
  $('#settings').classList.remove('on');
  if(!$('#editorWrap').classList.contains('zoom') && !$('#plotCard').classList.contains('zoom')
     && !$('#fp')?.classList.contains('on'))
    $('#scrim').classList.remove('on');
  $('#settingsBtn').setAttribute('aria-expanded','false');
}

function renderEnv(){
  const e=S.env, box=$('#envBox');
  if(!e){ box.innerHTML='<p class="hint" style="margin:0">Checking…</p>'; return; }
  const row=(ok,label,detail)=>
    '<div class="envrow"><span class="dot '+(ok?'':'err')+'"></span><b>'+label+'</b>'+
    '<span class="hint" style="margin:0">'+detail+'</span></div>';
  box.innerHTML =
    row(e.telluriumInstalled,'Tellurium',
        e.telluriumInstalled ? 'v'+e.tellurium.tellurium+' · roadrunner '+e.tellurium.roadrunner+
                               ' · python '+e.tellurium.python : (e.tellurium.error||'not installed'))+
    row(!e.claude.error,'Claude Code CLI', e.claude.error || e.claude.path)+
    row(!!e.agent,'Agent', e.agent ? 'agents/'+e.agent+'.md' : 'agents/model-scientist.md missing')+
    row(!!e.workflow,'Workflow', e.workflow ? 'workflows/'+e.workflow+'.js' : 'workflows/mca-tellurium.js missing')+
    row(e.skills.length>0,'Skills', e.skills.length ? e.skills.join(', ') : 'none found in skills/');
}
export const refreshEnv = renderEnv;

export function initSettings(){
  $('#settingsBtn').onclick=openSettings;
  $('#settingsClose').onclick=closeSettings;
  $('#settingsCancel').onclick=closeSettings;
  $('#addKey').onclick=()=>{ draft.endpoints.push({name:'',base:'',key:'',models:''}); renderEndpoints(); };
  $('#saveSettings').onclick=()=>{
    store.set('settings',draft); fillModels();
    $('#saveMsg').textContent='Saved'; setTimeout(closeSettings,350);
  };
  $$('.tab').forEach(t=>t.onclick=()=>{
    $$('.tab').forEach(o=>o.setAttribute('aria-selected', o===t));
    $$('[data-panel]').forEach(p=>{ p.hidden = p.dataset.panel!==t.dataset.tab; });
  });
  [$('#modelPick'),$('#modelPick2')].forEach(s=>s.onchange=()=>{
    store.set('modelSel',s.value); $('#modelPick').value=s.value; $('#modelPick2').value=s.value;
  });
}
