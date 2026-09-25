import { $, $$, store, numText } from './util.mjs';
import { S } from './state.mjs';

/* The model text is the single source of truth. A slider rewrites the assignment
   in the source; the source is then re-simulated and everything re-reads from it. */

let ctlSig = '', ctl = {}, onChange = () => {};
export const setOnChange = fn => { onChange = fn; };

const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Rewrites `name = <lone number>` in place, and only that shape: a whole
   statement (right after the start of the source or a `;`), whose right-hand
   side is nothing but a number, not inside a comment. An expression
   (`k1 = 2*k2`) or an assignment rule (`k1 := ...`) is left untouched instead
   of corrupted, and a name is regex-escaped before use since Antimony ids can
   contain regex metacharacters (`J.1`). */
export function writeOnly(editor, name, v){
  const n = reEsc(name), t = editor.value;
  const re = new RegExp('((?:^|;)[ \\t]*(?:(?:const|var|species|compartment|parameter|formula)[ \\t]+)*\\$?' + n + '[ \\t]*=[ \\t]*)(-?\\d*\\.?\\d+(?:[eE][-+]?\\d+)?)(?=[ \\t]*(?:;|//|#|$))', 'm');
  if (re.test(t)) editor.value = t.replace(re, (m, a) => a + numText(v));
  else if (!new RegExp('(?:^|;)[ \\t]*(?:(?:const|var|species|compartment|parameter|formula)[ \\t]+)*\\$?' + n + '[ \\t]*:?=', 'm').test(t))
    editor.value = t.replace(/\s*$/, '') + '\n' + name + ' = ' + numText(v);
}

function makeSlider(editor, key, name, value){
  const wrap=document.createElement('div'); wrap.className='krow';
  const hi=Math.max(Math.abs(value)*2, 1);
  wrap.innerHTML =
    '<div class="top"><span class="nm"></span><input type="number" step="any"></div>'+
    '<input type="range" min="0" max="'+hi+'" step="'+(hi/200)+'">';
  wrap.querySelector('.nm').textContent = name;
  const num=wrap.querySelector('input[type=number]'), rng=wrap.querySelector('input[type=range]');
  num.value=numText(value); rng.value=value;
  num.setAttribute('aria-label',name); rng.setAttribute('aria-label',name+' slider');
  const push = v => { writeOnly(editor, name, v); onChange(); };
  rng.oninput = ()=>{ num.value=numText(rng.value); push(+rng.value); };
  num.oninput = ()=>{ const v=+num.value; if(num.value===''||!isFinite(v)) return;
                      if(v>+rng.max) rng.max=v*1.5; rng.value=v; push(v); };
  ctl[key]={rng,num};
  return wrap;
}

/** Build the panel from what Tellurium reported about the loaded model. */
export function renderControls(editor, info){
  const params = info.globalParameters ?? [], bs = info.boundarySpecies ?? [],
        floats = info.floatingSpecies ?? [], vals = info.values ?? {};
  const sig=[...params, ...bs.map(n=>'b:'+n), ...floats.map(n=>'i:'+n)].join(',');
  if(sig === ctlSig) return syncControls(vals);       // same names → keep the DOM, update values
  ctlSig=sig; ctl={};
  const kl=$('#kList'), il=$('#icList'), bl=$('#bList');
  kl.textContent=''; il.textContent=''; bl.textContent='';
  if(!params.length) kl.innerHTML='<p class="hint" style="margin:0">No parameters in this model.</p>';
  params.forEach(n=> kl.append(makeSlider(editor, n, n, vals[n] ?? 0)));
  $('#bSect').hidden = !bs.length;
  bs.forEach(n=> bl.append(makeSlider(editor, 'b:'+n, n, vals[n] ?? 0)));
  if(!floats.length) il.innerHTML='<p class="hint" style="margin:0">No floating species.</p>';
  floats.forEach(n=> il.append(makeSlider(editor, 'i:'+n, n, vals['init:'+n] ?? vals[n] ?? 0)));
  $('#nK').textContent = params.length || '';
  $('#nB').textContent = bs.length || '';
  $('#nI').textContent = floats.length || '';
}

function syncControls(vals){
  for(const k in ctl){
    const {rng,num}=ctl[k];
    const name = k.startsWith('i:')||k.startsWith('b:') ? k.slice(2) : k;
    // an initial condition is init:<id>; vals[<id>] is where the species ENDED,
    // which would silently walk the slider to the final concentration
    const v = k.startsWith('i:') ? vals['init:'+name] : vals[name];
    if(v===undefined || !isFinite(v)) continue;
    if(document.activeElement===rng || document.activeElement===num) continue;  // don't fight the user
    if(v > +rng.max) rng.max = Math.abs(v)*1.5;
    rng.value=v; num.value=numText(v);
  }
}

export function initAccordions(){
  $$('.acc-tog').forEach(t=>{
    const body=document.getElementById(t.getAttribute('aria-controls'));
    const open=v=>{ t.setAttribute('aria-expanded',v); body.hidden=!v; store.set('acc.'+body.id,v); };
    open(store.get('acc.'+body.id,false));
    t.onclick=()=>open(t.getAttribute('aria-expanded')!=='true');
  });
}
