import { $, $$, store, flash } from './util.mjs';
import { S } from './state.mjs';
import * as api from './api.mjs';
import { pickFile } from './filepicker.mjs';
import { probe as probeLocal, permissionState } from './localai.mjs';
import { BUDGET, BUDGET_LIMITS, CONTEXT_DEFAULT, replyTokens, resultCap,
         stepBudget } from './oai.mjs';

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
const DEF = { endpoints: [], useWorkflow: true, scratchDir: '', budget: { ...BUDGET }, localCfg:{
  olUrl:'http://localhost:11434', lmUrl:'http://localhost:1234', ggufPath:'', ggufUrl:'http://localhost:8080' } };

/* Every local server the settings pane can hold. This used to be a radio group, so
   only one could be configured at a time and choosing Ollama hid the LM Studio
   models you had already connected. They are independent servers; there is no
   reason to pick. */
const LOCAL = [
  { id:'ollama',   label:'Ollama',      url:'olUrl',   models:'olModels',   ctx:'olCtx',
    ph:'http://localhost:11434' },
  { id:'lmstudio', label:'LM Studio',   url:'lmUrl',   models:'lmModels',   ctx:'lmCtx',
    ph:'http://localhost:1234' },
  { id:'gguf',     label:'llama.cpp / GGUF server', url:'ggufUrl', models:'ggufModels', ctx:'ggufCtx',
    ph:'http://localhost:8080' },
];

export const settings = () => ({ ...DEF, ...store.get('settings', {}),
                                 budget:   { ...BUDGET,        ...(store.get('settings',{}).budget||{}) },
                                 localCfg: { ...DEF.localCfg, ...(store.get('settings',{}).localCfg||{}) } });

let draft = null;

/* ---- what the chat layer needs to start a turn ---- */
export const useWorkflow = () => settings().useWorkflow !== false;
/* '' means the install's own workspace/runs — the server resolves the default, so
   the page never has to know an absolute path it did not choose. */
export const scratchDir = () => settings().scratchDir || '';

export function resolveModel(sel){
  const s = settings();
  if(!sel || sel.startsWith('cc:'))
    return { runtime:'claude-code', model: sel ? sel.slice(3) : 'opus' };
  const [kind, ...rest] = sel.split(':');
  const model = rest.join(':');
  // 'auto:<baseUrl>|<model>' — a runtime found by /api/local/scan, nothing saved
  if(kind==='auto'){
    const i = model.lastIndexOf('|');
    return { runtime:'openai', chatCfg:{ baseUrl: model.slice(0,i), model: model.slice(i+1),
                                         ...s.budget } };
  }
  const L = LOCAL.find(l => l.id === kind);
  if(L) return { runtime:'openai', chatCfg:{
    baseUrl: s.localCfg[L.url], model: model || 'local',
    contextTokens: +s.localCfg[L.ctx] || undefined, ...s.budget } };
  if(kind==='ep'){
    const i = +model.split('|')[0], name = model.split('|').slice(1).join('|');
    const ep = s.endpoints[i];
    return ep ? { runtime:'openai', chatCfg:{ baseUrl: ep.base, apiKey: ep.key, model: name,
                                              contextTokens: +ep.ctx || undefined, ...s.budget } }
              : { runtime:'claude-code', model:'opus' };
  }
  return { runtime:'claude-code', model:'opus' };
}

export function modelOptions(){
  const s=settings();
  // Hosted runs Tellurium only; the Claude Code runtime needs the local CLI, so
  // offering it there would just fail on send.
  const out = S.env?.hosted ? [] : BUILTIN.map(b=>({ v:'cc:'+b.id, t:b.t }));
  // found on this machine, no settings needed — listed after the built-ins so a
  // scan never silently changes which model is selected
  (S.local?.servers ?? []).forEach(sv => sv.models.forEach(m =>
    out.push({ v:'auto:'+sv.base+'|'+m, t: sv.kind+' · '+m })));
  s.endpoints.forEach((e,i)=>(e.models||'').split(',').map(m=>m.trim()).filter(Boolean)
    .forEach(m=>out.push({ v:'ep:'+i+'|'+m, t:(e.name||'Endpoint')+' · '+m })));
  const local = s.localCfg;
  // every server that has models, all at once — the picker is the only place they meet
  LOCAL.forEach(L => (local[L.models]||'').split(',').map(m=>m.trim()).filter(Boolean)
    .forEach(m => out.push({ v:L.id+':'+m, t:L.label+' · '+m })));
  // a GGUF path with no served id: the server names it, so fall back to the filename
  if(!(local.ggufModels||'').trim() && local.ggufPath){
    const f = local.ggufPath.split('/').pop();
    out.push({ v:'gguf:'+f, t:'GGUF · '+f });
  }
  // two servers can serve a model of the same name; keep the first, drop exact dupes
  const seen = new Set();
  return out.filter(o => !seen.has(o.v) && seen.add(o.v));
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

/* ---- what is already running on this machine ---- */
/* The server does the looking, so a local model needs no CORS flag, no
   OLLAMA_ORIGINS, and no browser local-network prompt: press nothing, and if
   Ollama or LM Studio is up its models are simply in the picker. */
export async function refreshLocal(){
  try { S.local = await api.scanLocal(); }
  catch(e){ S.local = null; console.warn('local model scan failed:', e); }
  fillModels(); renderFound();
  return S.local;
}

function renderFound(){
  const box = $('#locFound'); if(!box) return;
  const L = S.local, up = L?.servers ?? [];
  const n = up.reduce((a,s)=>a+s.models.length, 0);
  const detail =
      L?.hosted ? 'This is a hosted deployment — it cannot see your machine. Use the settings below.'
    : n         ? up.map(s=>s.kind+' ('+s.models.length+')').join(', ') +
                  ' — already in the model picker, nothing to configure.'
    : up.length ? up.map(s=>s.kind).join(', ')+' is running but serves no model yet.'
    : L?.ollama ? 'Ollama is installed but not running.'
    :             'Nothing found. Install Ollama, then press Start.';
  box.innerHTML =
    '<div class="envrow"><span class="dot'+(n?'':' err')+'"></span><b>On this machine</b>'+
    '<span class="hint" style="margin:0">'+detail+'</span></div>'+
    (L?.hosted ? '' :
      '<div style="margin:8px 0 4px"><button class="btn sm" id="locStart">'+
      (n ? 'Rescan' : 'Start Ollama')+'</button> <span class="probe" id="locMsg"></span></div>')+
    (!L?.hosted && !n ?
      '<p class="hint">A model still has to exist locally: <code>ollama pull qwen3:8b</code>.</p>' : '');
  const b = $('#locStart'); if(!b) return;
  b.onclick = async () => {
    const msg = $('#locMsg'); msg.className='probe'; msg.textContent='Starting…'; b.disabled=true;
    const r = await api.startLocal().catch(e=>({ ok:false, error:String(e.message||e) }));
    if(!r.ok){ b.disabled=false; msg.className='probe bad'; msg.textContent='✕ '+r.error; return; }
    await refreshLocal();                       // re-renders this whole block
    const m = $('#locMsg'); if(m){ m.className='probe ok';
      m.textContent = r.models?.length ? '✓ '+r.models.length+' model'+(r.models.length===1?'':'s')+' ready'
                                       : '✓ running — now pull a model'; }
  };
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
  // one labelled, copyable line per app — running them together as prose helped nobody
  (r.cmds ?? []).forEach(c=>{
    const row=document.createElement('div'); row.className='cmd';
    row.innerHTML='<b></b><code></code><button class="btn sm ghost">Copy</button>'+
                  (c.note ? '<span class="note"></span>' : '');
    row.querySelector('b').textContent=c.app;
    row.querySelector('code').textContent=c.cmd;
    if(c.note) row.querySelector('.note').textContent=c.note;
    row.querySelector('button').onclick=async e=>{
      try{ await navigator.clipboard.writeText(c.cmd); flash(e.target,'Copied'); }
      catch{ getSelection().selectAllChildren(row.querySelector('code')); }
    };
    into.append(row);
  });
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
/* Every server is rendered; there is no "which one" any more. Connect as many as
   you run and all of their models land in the picker together. */
function renderLocal(){
  const c=$('#locCfg'); c.textContent='';
  const cfg=draft.localCfg;

  const field=(parent,lb,key,ph,type)=>{
    const d=document.createElement('div'); d.style.marginBottom='10px';
    d.innerHTML='<label class="lb"></label><input class="field">';
    d.querySelector('label').textContent=lb;
    const i=d.querySelector('input');
    i.placeholder=ph||''; i.value=cfg[key]||''; if(type) i.type=type;
    i.oninput=()=>{ cfg[key]=i.value; }; parent.append(d); return i;
  };

  LOCAL.forEach(L=>{
    const box=document.createElement('div'); box.className='keyrow'; box.style.display='block';
    const h=document.createElement('b'); h.textContent=L.label; h.style.display='block';
    h.style.marginBottom='8px'; box.append(h);

    const url=field(box,'Server URL',L.url,L.ph);
    if(L.id==='gguf'){
      const d=document.createElement('div'); d.style.marginBottom='10px';
      d.innerHTML='<label class="lb">GGUF file (optional)</label><div class="browse">'+
                  '<input class="field" placeholder="/path/to/model.Q4_K_M.gguf">'+
                  '<button class="btn sm">Browse…</button></div>';
      const inp=d.querySelector('input'); inp.value=cfg.ggufPath||'';
      inp.oninput=()=>{ cfg.ggufPath=inp.value; };
      d.querySelector('button').onclick=async()=>{
        const p=await pickFile({ title:'Choose a .gguf model', ext:'.gguf' });
        if(p){ cfg.ggufPath=p; inp.value=p; } };
      box.append(d);
    }

    const row=document.createElement('div'); row.style.marginBottom='10px';
    row.innerHTML='<button class="btn sm">Connect</button><div class="probe"></div>';
    const out=row.querySelector('.probe');
    box.append(row);
    const ms=field(box,'Models (comma-sep)',L.models,'filled in by Connect');
    // The one number that decides whether a local model can work at all: the window
    // the runtime loaded it with, which is usually far below what the weights allow.
    slider(box, { label:'Context window (tokens)', range:[512, 131072], log:true, snap:256,
      get:()=>+cfg[L.ctx] || CONTEXT_DEFAULT, set:v=>{ cfg[L.ctx]=v; },
      note:v=>'What '+L.label+' loaded the model with \u2014 not what the weights allow. '+
              'The system prompt plus one tool result has to fit inside it.' });
    row.querySelector('button').onclick=async()=>{
      const m=await probe(url.value,'',out);
      if(m?.length){ cfg[L.models]=m.join(', '); ms.value=cfg[L.models]; } };
    c.append(box);
  });

  const note=document.createElement('p'); note.className='hint';
  note.innerHTML='A .gguf file is weights, not a server — serve it first: '+
    '<code>llama-server -m &lt;file&gt; --port 8080</code> or <code>lms load &lt;file&gt;</code>.<br>'+
    'Context window matters: the system prompt plus one tool result has to fit inside it. '+
    'Below about 8k, expect short answers and repeated tool calls.';
  c.append(note);
}

/* ---- sliders ---- */
/* One labelled slider: a range and a number box that drive the same value. Both
   write on `input`, never on `change`, so the readout under the control follows
   the thumb while it is being dragged rather than jumping when it is released.
   `log` is for the context window — on a linear track from 512 to 131072 every
   size anyone actually loads sits in the first centimetre. */
const budgetNotes = [];

function slider(parent, o){
  const d=document.createElement('div'); d.className='krow';
  d.innerHTML='<div class="top"><span class="nm"></span><input type="number"></div>'+
              '<input type="range"><p class="hint" style="margin:3px 0 0"></p>';
  d.querySelector('.nm').textContent=o.label;
  const num=d.querySelector('input[type=number]'), rng=d.querySelector('input[type=range]'),
        note=d.querySelector('.hint');
  const [lo,hi]=o.range, step=o.step||1, snap=o.snap||1;
  const toR   = v => o.log ? Math.round(1000*Math.log(v/lo)/Math.log(hi/lo)) : v;
  const fromR = r => o.log ? Math.round(lo*Math.pow(hi/lo, r/1000)/snap)*snap : +r;
  const clamp = v => Math.min(hi, Math.max(lo, Math.round(v/step)*step));
  num.min=lo; num.max=hi; num.step=step;
  rng.min=o.log?0:lo; rng.max=o.log?1000:hi; rng.step=o.log?1:step;
  num.setAttribute('aria-label',o.label); rng.setAttribute('aria-label',o.label+' slider');
  const show = () => { note.textContent = o.note ? o.note(clamp(o.get())) : ''; };
  const set = (v, dragging) => {
    v=clamp(v); o.set(v); num.value=v; if(!dragging) rng.value=toR(v);
    show(); budgetNotes.forEach(f=>f());
  };
  rng.value=toR(clamp(o.get())); num.value=clamp(o.get()); show();
  rng.oninput=()=>set(fromR(+rng.value), true);
  num.oninput=()=>{ if(num.value!=='' && isFinite(+num.value)) set(+num.value); };
  parent.append(d);
  return show;
}

/* The window of whichever model is selected right now, read from the unsaved
   draft so the token counts below the sliders track the context slider live. */
function draftCtx(){
  const sel = String(store.get('modelSel','') || '');
  const [kind, ...rest] = sel.split(':');
  const L = LOCAL.find(l => l.id === kind);
  if(L) return +draft.localCfg[L.ctx] || CONTEXT_DEFAULT;
  if(kind === 'ep') return +draft.endpoints[+rest.join(':').split('|')[0]]?.ctx || CONTEXT_DEFAULT;
  /* Nothing local is selected — a Claude model, or nothing yet. Size the numbers
     against the biggest window configured instead of the default, so dragging the
     context slider in the other tab is visibly connected to these. */
  const all = [...LOCAL.map(L => +draft.localCfg[L.ctx]), ...draft.endpoints.map(e => +e.ctx)]
    .filter(v => v > 0);
  return all.length ? Math.max(...all) : CONTEXT_DEFAULT;
}

const n = v => Math.round(v).toLocaleString();

/* ---- budget tab ---- */
function renderBudget(){
  const c=$('#budgetBox'); c.textContent='';
  budgetNotes.length=0;
  const b=draft.budget;

  budgetNotes.push(slider(c, {
    label:'Reply length', range:BUDGET_LIMITS.replyPct,
    get:()=>b.replyPct, set:v=>{ b.replyPct=v; },
    note:v=>'\u2248'+n(replyTokens(draftCtx(), v))+' tokens of '+n(draftCtx())+
            ' for thinking and answer together \u2014 the rest holds the prompt and the '+
            'transcript. '+v+'% of the window (default '+BUDGET.replyPct+'%).' }));

  budgetNotes.push(slider(c, {
    label:'Tool result cap', range:BUDGET_LIMITS.resultPct,
    get:()=>b.resultPct, set:v=>{ b.resultPct=v; },
    note:v=>n(resultCap(draftCtx(), v))+' characters of any one tool result reach the model; '+
            'the rest is cut. '+v+'% of the window (default '+BUDGET.resultPct+'%).' }));

  budgetNotes.push(slider(c, {
    label:'Tool steps', range:BUDGET_LIMITS.steps,
    get:()=>b.steps, set:v=>{ b.steps=v; },
    note:v=>stepBudget(v)+' tool calls before the agent is made to answer with what it has; '+
            'a workflow stage gets '+Math.max(2, stepBudget(v)-2)+'. Default '+BUDGET.steps+'.' }));

  const note=document.createElement('p'); note.className='hint';
  const against=document.createElement('p'); against.className='hint';
  against.style.margin='0 0 10px';
  budgetNotes.push(()=>{ against.innerHTML='Sized against a <b>'+n(draftCtx())+
    '</b>-token window.'; });
  budgetNotes.at(-1)();
  c.prepend(against);
  note.innerHTML='Shares of the context window, not fixed token counts, so one setting means '+
    'the same thing on an 8k model and a 128k one. Reply length and the result cap come out of '+
    'the same window: raise one and the transcript is trimmed sooner. The window itself is per '+
    'server \u2014 <b>Local models</b> tab.';
  c.append(note);
}

/* ---- drawer ---- */
export function openSettings(){
  draft = structuredClone(settings());
  renderEndpoints(); renderLocal(); renderBudget(); renderEnv(); renderFound(); renderScratch();
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

/* ---- the AI's working folder (local installs only; hosted has no filesystem) ---- */
function renderScratch(){
  const row = $('#scratchRow');
  row.hidden = !!S.env?.hosted;
  if(row.hidden) return;
  $('#scratchPath').textContent = draft.scratchDir || 'Default — workspace/runs in the app folder';
  $('#scratchPath').title = draft.scratchDir || '';
  $('#scratchMsg').textContent = '';
}

async function chooseScratch(){
  const dir = await pickFile({ title: 'Choose the AI\u2019s working folder', dirs: true,
                               start: draft.scratchDir || null });
  if(!dir) return;
  // check it before saving: a folder that cannot be written to should fail here,
  // not halfway through the first turn that tries to use it
  const r = await fetch('/api/scratch', { method:'POST',
    headers:{'content-type':'application/json'}, body: JSON.stringify({ dir }) })
    .then(r=>r.json()).catch(e=>({ ok:false, error:String(e.message||e) }));
  if(!r.ok){ $('#scratchMsg').innerHTML = '<span class="err">'+r.error+'</span>'; return; }
  draft.scratchDir = r.dir;
  renderScratch();
  $('#scratchMsg').textContent = 'Checked and writable. Save to apply.';
}

export function initSettings(){
  $('#settingsBtn').onclick=openSettings;
  $('#settingsClose').onclick=closeSettings;
  $('#settingsCancel').onclick=closeSettings;
  $('#scratchPick').onclick = chooseScratch;
  $('#scratchClear').onclick = ()=>{ draft.scratchDir=''; renderScratch(); };
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
