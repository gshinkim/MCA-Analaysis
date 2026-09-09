import { $ } from './util.mjs';

/* The browser cannot hand back a real filesystem path from <input type=file>,
   so this browses the server's filesystem and returns the absolute path. */

let resolveFn = null, cur = null, filter = '', picked = null;

function ensureDom(){
  if($('#fp')) return;
  const d=document.createElement('div');
  d.id='fp'; d.className='fp'; d.setAttribute('role','dialog'); d.setAttribute('aria-label','Choose a file');
  d.innerHTML=`
    <div class="fp-hd">
      <strong id="fpTitle">Choose a file</strong>
      <span class="sp" style="flex:1"></span>
      <button class="btn icon ghost sm" id="fpClose" aria-label="Cancel">✕</button>
    </div>
    <div class="fp-path"><button class="btn sm ghost" id="fpUp">↑ Up</button><code id="fpCur"></code></div>
    <div class="fp-list" id="fpList" tabindex="0"></div>
    <div class="fp-ft">
      <code id="fpSel" class="hint"></code>
      <span class="sp" style="flex:1"></span>
      <button class="btn sm" id="fpCancel">Cancel</button>
      <button class="btn sm primary" id="fpOk" disabled>Choose</button>
    </div>`;
  document.body.append(d);
  $('#fpClose').onclick = $('#fpCancel').onclick = () => close(null);
  $('#fpOk').onclick = () => close(picked);
  $('#fpUp').onclick = () => { if(cur?.parent) load(cur.parent); };
}

function close(v){
  $('#fp')?.classList.remove('on');
  $('#scrim').classList.remove('on');
  const f=resolveFn; resolveFn=null; picked=null;
  f?.(v);
}

async function load(path){
  const q = new URLSearchParams();
  if(path) q.set('path', path);
  if(filter) q.set('ext', filter);
  const r = await fetch('/api/fs?'+q).then(r=>r.json());
  if(r.error){ $('#fpList').innerHTML='<p class="hint" style="padding:12px">'+r.error+'</p>'; return; }
  cur = r; picked = null;
  $('#fpCur').textContent = r.path;
  $('#fpSel').textContent = '';
  $('#fpOk').disabled = true;
  $('#fpUp').disabled = !r.parent;
  const L=$('#fpList'); L.textContent='';
  if(!r.entries.length) L.innerHTML='<p class="hint" style="padding:12px">Nothing here'+(filter?' matching '+filter:'')+'.</p>';
  for(const e of r.entries){
    const b=document.createElement('button');
    b.className='fp-row'; b.type='button';
    b.innerHTML = (e.dir?'<span class="fp-ic">📁</span>':'<span class="fp-ic">📄</span>')+
                  '<span class="fp-nm"></span>';
    b.querySelector('.fp-nm').textContent = e.name;
    b.onclick = () => {
      if(e.dir) return load(e.path);
      [...L.children].forEach(c=>c.classList.remove('sel'));
      b.classList.add('sel'); picked = e.path;
      $('#fpSel').textContent = e.path; $('#fpOk').disabled = false;
    };
    b.ondblclick = () => { if(!e.dir){ picked=e.path; close(picked); } };
    L.append(b);
  }
}

/** pickFile({title, ext, start}) → absolute path, or null if cancelled. */
export function pickFile({ title='Choose a file', ext='', start=null } = {}){
  ensureDom();
  filter = ext;
  $('#fpTitle').textContent = title;
  $('#fp').classList.add('on');
  $('#scrim').classList.add('on');
  load(start);
  return new Promise(r => { resolveFn = r; });
}
