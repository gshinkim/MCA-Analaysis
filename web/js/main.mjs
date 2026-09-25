import { $, $$, store, fmt, flash, latestOnly, esc } from './util.mjs';
import { S } from './state.mjs';
import * as api from './api.mjs';
import { draw, initChartInteractions, showTable } from './chart.mjs';
import { renderControls, initAccordions, setOnChange } from './panel.mjs';
import { initSettings, fillModels, closeSettings, refreshEnv, refreshLocal } from './settings.mjs';
import { initChat, toggleChat, setOnModelChanged, setOnSessionDeleted, offerScratchSetup, dumpChats, loadChats, noteNoModel } from './chat.mjs';
import { initExport, initImport } from './export.mjs';
import { initSession, saveSoon, currentId, saveIdle } from './session.mjs';

const editor = $('#model');

const status = (kind, text) => {
  $('#runDot').className = 'dot' + (kind==='busy'?' busy':kind==='err'?' err':'');
  $('#runStat').textContent = text;
};

const cfg = () => ({ start:+$('#tStart').value||0, end:+$('#tEnd').value||100,
                     points:+$('#nPts').value||50 });

/* ---------------- run ----------------
   Two modes, both solved by Tellurium: a fixed window, or "keep going until the
   steady-state solver is satisfied". Nothing is computed in the browser. */
let runSeq = 0, busyTimer = null;
let steadyMode = store.get('steadyMode', false);

async function run(){
  const c = cfg();
  if(!steadyMode && c.end <= c.start) return status('err','End time must exceed start');
  const seq = ++runSeq;
  const t0 = performance.now();
  clearTimeout(busyTimer);
  busyTimer = setTimeout(()=>{ if(seq===runSeq)
    status('busy', steadyMode ? 'Solving for steady state…' : 'Running…'); }, 120);

  const r = steadyMode
    ? await api.settle({ model: editor.value, points: c.points, end: c.end })
    : await api.simulate({ model: editor.value, ...c });
  if(seq !== runSeq) return;                       // a newer run already won
  clearTimeout(busyTimer);
  S.lastRunMs = performance.now()-t0;

  if(!r.ok){
    status('err', steadyMode ? 'No steady state' : 'Tellurium error');
    $('#parseMsg').innerHTML = '<span class="err">⚠ '+esc(String(r.error).split('\n')[0])+'</span>';
    $('#zoomParse').innerHTML = '<span class="err">error</span>';
    S.result = null; draw();
    return;
  }
  S.result = r.result;
  S.hidden = new Set([...S.hidden].filter(n=>S.result.names.includes(n)));
  if(S.view && (S.view.t0 < S.result.t[0] || S.view.t1 > S.result.t.at(-1))) S.view = null;

  renderControls(editor, S.result);
  const i = S.result;
  // a rate-rule model has no reactions and no "floating species"; describe what is
  // actually plotted rather than reporting a pile of zeroes
  const bits = [];
  if(i.reactions.length) bits.push(i.reactions.length+' reactions');
  if(i.floatingSpecies.length) bits.push(i.floatingSpecies.length+' floating species');
  if(i.globalParameters.length) bits.push(i.globalParameters.length+' parameters');
  bits.push(i.names.length+(i.names.length===1?' series':' series')+' plotted');
  const summary = bits.join(' · ');
  $('#parseMsg').innerHTML = '<span class="chip">'+summary+'</span>'+
    (i.note ? ' <span class="warn">⚠ '+esc(i.note)+'</span>' : '');
  $('#zoomParse').textContent = i.reactions.length+' reactions';
  const eng = i.engine ? 'tellurium '+i.engine.tellurium : 'tellurium';
  const eig = i.stability?.eigenvalues?.length
    ? ' · max Re(λ) '+(+i.stability.maxRealPart.toPrecision(3)) : '';
  $('#plotSub').textContent = steadyMode
    ? (i.settled
        ? c.points+' pts · steady state at t≈'+(+i.settleTime.toPrecision(4))+
          ' · residual '+i.steadyStateDistance.toExponential(1)+eig+' · '+eng
        : i.unstable
          ? c.points+' pts · unstable steady state'+
            (i.stability?.oscillatory ? ' (oscillatory)' : '')+eig+' · '+eng
          : c.points+' pts · did not settle within t='+(+i.horizon.toPrecision(4))+' · '+eng)
    : c.points+' pts · t '+c.start+'–'+c.end+' · '+eng;
  $('#plotSub2').textContent = $('#plotSub').textContent;
  status(steadyMode && !i.settled ? 'err' : 'ok',
         (steadyMode
            ? (i.settled ? 'Steady state · '
                         : i.unstable ? 'Unstable — no steady state · ' : 'No settling · ')
            : 'Ready · ')+S.lastRunMs.toFixed(0)+' ms');
  if(steadyMode && i.note)
    $('#parseMsg').innerHTML = '<span class="chip">'+summary+'</span> <span class="err">'+esc(i.note)+'</span>';
  captureDefault();
  draw();
}

let commitT;
async function commit(){
  clearTimeout(commitT);
  editing = false;
  // A rename or first save still in flight must land before the model PUT below,
  // or the PUT can hit the old folder id (rename) or the shared default file
  // (first save not yet claimed its id).
  await saveIdle();
  // simulate at once; the save to disk runs alongside instead of in front of it
  const [put] = await Promise.all([api.putModel(editor.value, currentId()), run(), api.putSettings(cfg())]);
  if(put?.error) status('err', 'Model not saved: ' + put.error);
  // Direct edits (editor input, tStart/tEnd/nPts) all funnel through here, same as
  // a chat turn or a rename — without this, editing a session's model without ever
  // sending a chat message never reaches its runs/ snapshot (worthSaving still
  // guards against creating a folder for a session with no completed turns).
  saveSoon();
}

// sliders re-simulate on every movement, not on release (see latestOnly)
setOnChange(latestOnly(commit));

/* ---------------- project name ----------------
   Click the breadcrumb and type. Read back as textContent everywhere, so a paste
   that smuggles markup can only ever be text. Not persisted: every fresh load
   starts at PROJ_DEF, and only opening a saved session (setAll) sets it from disk.
   `lastCommitted` is in-memory only, for the Escape-to-revert handler. */
const proj = $('#projName');
const PROJ_DEF = 'Untitled project';
const projName = () => proj.textContent.replace(/\s+/g,' ').trim() || PROJ_DEF;
let lastCommitted = PROJ_DEF;
function setProjName(n, save = true){
  proj.textContent = n || PROJ_DEF;
  if(save) lastCommitted = projName();
}
setProjName(PROJ_DEF, false);
proj.addEventListener('keydown', e=>{
  if(e.key==='Enter'){ e.preventDefault(); proj.blur(); }
  if(e.key==='Escape'){ setProjName(lastCommitted, false); proj.blur(); }
});
proj.addEventListener('blur', ()=>{ setProjName(projName()); saveSoon(); });

/* ---------------- default config: captured once, replaced only on request ---------------- */
const snapshot = () => ({ src: editor.value, ...cfg() });
function captureDefault(){
  if(S.defaultCfg) return;
  S.defaultCfg = snapshot(); store.set('default', S.defaultCfg);
}
$('#setDefault').onclick = ()=>{
  S.defaultCfg = snapshot(); store.set('default', S.defaultCfg);
  flash($('#setDefault'), 'Saved ✓');
};
$('#resetAll').onclick = ()=>{
  if(!S.defaultCfg) return flash($('#resetAll'),'No default yet');
  editor.value = S.defaultCfg.src;
  $('#tStart').value=S.defaultCfg.start; $('#tEnd').value=S.defaultCfg.end; $('#nPts').value=S.defaultCfg.points;
  S.view=null; commit();
};

/* ---------------- editor ---------------- */
let deb;
// True from a keystroke until commit() picks it up: an AI edit arriving in that
// window must not replace what the user is typing (see setOnModelChanged).
let editing = false;
editor.addEventListener('input', ()=>{
  editing = true;
  status('busy','Editing…');
  clearTimeout(deb); deb=setTimeout(commit, 300);
});
$('#rerunBtn').onclick = ()=>{ clearTimeout(deb); clearTimeout(commitT); commit(); };
$('#zoomRerun').onclick = ()=>$('#rerunBtn').click();

/* ---------------- full-screen editor / plot ---------------- */
function zoomEditor(force){
  const w=$('#editorWrap'), on = force ?? !w.classList.contains('zoom');
  w.classList.toggle('zoom',on);
  $('#scrim').classList.toggle('on', on || $('#settings').classList.contains('on'));
  $('#zoomBtn').setAttribute('aria-expanded',on);
  if(on) setTimeout(()=>editor.focus(),80);
  setTimeout(draw,60);
}
function zoomPlot(force){
  const c=$('#plotCard'), on = force ?? !c.classList.contains('zoom');
  c.classList.toggle('zoom',on);
  $('#scrim').classList.toggle('on', on || $('#settings').classList.contains('on'));
  $('#plotZoomBtn').setAttribute('aria-expanded',on);
  setTimeout(draw,60);
}
$('#zoomBtn').onclick=()=>zoomEditor();
$('#zoomDone').onclick=()=>zoomEditor(false);
$('#plotZoomBtn').onclick=()=>zoomPlot();
$('#plotZoomDone').onclick=()=>zoomPlot(false);
$('#scrim').onclick=()=>{ if(document.querySelector('#fp')?.classList.contains('on')) return;
  zoomEditor(false); zoomPlot(false); closeSettings(); };

/* ---------------- side panel ---------------- */
function togglePanel(force){
  const w=$('#work'), on = force ?? !w.classList.contains('panel-open');
  w.classList.toggle('panel-open',on);
  $('#panelBtn').textContent = on?'Hide side panel':'Open side panel';
  $('#panelBtn').setAttribute('aria-expanded',on);
  store.set('panel',on);
  setTimeout(draw,240);
}
/* steady-state mode */
function setSteady(on){
  steadyMode = on;
  $('#steadyBtn').setAttribute('aria-pressed', on);
  $$('#tStart, #tEnd').forEach(el=>{ el.disabled = on; el.title = on
    ? 'Ignored in steady-state mode — Tellurium chooses the horizon' : ''; });
  $('#tEnd').closest('div').querySelector('.lb').textContent = on ? 'End (auto)' : 'End';
  store.set('steadyMode', on);
  S.view = null;
  run();
}
$('#steadyBtn').onclick = ()=> setSteady($('#steadyBtn').getAttribute('aria-pressed')!=='true');

$('#panelBtn').onclick=()=>togglePanel();
$('#closePanel').onclick=()=>togglePanel(false);
['tStart','tEnd','nPts'].forEach(id=>$('#'+id).addEventListener('input',()=>{
  clearTimeout(commitT); commitT=setTimeout(commit,150);
}));

/* ---------------- theme, shortcuts ---------------- */
const applyTheme = t => { t ? document.documentElement.setAttribute('data-theme',t)
                            : document.documentElement.removeAttribute('data-theme'); draw(); };
$('#themeBtn').onclick=()=>{
  const cur=document.documentElement.getAttribute('data-theme');
  const dark = cur ? cur==='dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  const next = dark?'light':'dark'; store.set('theme',next); applyTheme(next);
};
$('#helpBtn').onclick=()=>alert(
  '⌘/Ctrl + ⏎   rerun\n⌘/Ctrl + B   toggle side panel\nScroll on plot  zoom time axis\nDrag plot     pan (when zoomed)\nEsc           close overlays');
addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){ e.preventDefault(); $('#rerunBtn').click(); }
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='b'){ e.preventDefault(); togglePanel(); }
  if(e.key==='Escape'){
    if(!$('#tablePage').hidden) return showTable(false);
    if($('#editorWrap').classList.contains('zoom')) return zoomEditor(false);
    if($('#plotCard').classList.contains('zoom')) return zoomPlot(false);
    closeSettings();
    if($('#chat').classList.contains('on')) toggleChat(false);
  }
});

/* ---------------- boot ---------------- */
// the AI's edits arrive while its turn is still running; one that matches what the
// editor already shows changes nothing, so it must not reset the cursor either.
// A user who is mid-keystroke wins outright — the AI's edit is dropped, not queued,
// since applying it after the fact would still clobber whatever they typed next.
setOnModelChanged(src=>{
  if(src === editor.value) return;
  if(editing) return status('err', 'AI edited the model while you were typing — kept your text');
  editor.value = src; run();
});
// a deleted session's name must not survive to regenerate the folder it named
setOnSessionDeleted(()=> setProjName(PROJ_DEF));

(async function boot(){
  const savedTheme = store.get('theme',null); if(savedTheme) applyTheme(savedTheme);
  matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>draw());

  initAccordions(); initSettings(); initChartInteractions(); initChat(); initExport();
  initSession({
    getName: projName,
    getModel: () => editor.value,
    getSettings: cfg,
    getChats: dumpChats,
    setAll: s => {
      setProjName(s.name, true);
      // Deliberately not cleared when empty: that would diverge from
      // workspace/model.txt, which the server also leaves alone on an empty
      // snapshot (backend/server.mjs's own `if (s.model)` skip). Diverging the
      // editor from the live file on disk is worse than the alternative below.
      if(s.model) editor.value = s.model;
      if(s.settings?.points){ $('#tStart').value = s.settings.start ?? 0;
                              $('#tEnd').value = s.settings.end ?? 100;
                              $('#nPts').value = s.settings.points; }
      loadChats(s.chats);
      // The editor above was left showing whatever project was open before —
      // flag it, so the user is never silently shown another project's model
      // while believing it belongs to the session they just opened.
      if(!s.model) noteNoModel();
      S.view = null; run();
    },
  });
  initImport((text, name) => {                 // loading a file replaces the live model
    editor.value = text;
    setProjName(name.replace(/\.(ant|txt|antimony)$/i,''));
    S.view = null; commit();
  });
  fillModels();
  togglePanel(store.get('panel',true));

  S.defaultCfg = store.get('default', null);
  $('#steadyBtn').setAttribute('aria-pressed', steadyMode);
  $$('#tStart, #tEnd').forEach(el=>{ el.disabled = steadyMode; });
  const m = await api.getModel();
  editor.value = m.src;

  // workspace/settings.json is the last-committed simulation window; without this
  // a reload with no session open falls back to the HTML defaults while the file
  // (and whatever the AI reads) still has the real one.
  const st = await api.getSettings().catch(() => null);
  if(st?.points){ $('#tStart').value = st.start ?? 0; $('#tEnd').value = st.end ?? 100; $('#nPts').value = st.points; }

  refreshLocal();          // whatever is already running here lands in the picker

  api.getEnv().then(e=>{
    // the picker is built before this resolves, and on a hosted deployment the
    // built-in Claude models must drop out of it
    S.env = e; refreshEnv(); fillModels(); offerScratchSetup();
    if(e.hosted) ['#newProject','#loadSession','#delProjects'].forEach(s => $(s).hidden = true);
    if(!e.telluriumInstalled) status('err','Tellurium not installed — run: bash setup.sh');
    if(e.claude.error) $('#aiBar').title = e.claude.error;
  });

  run();
})();
