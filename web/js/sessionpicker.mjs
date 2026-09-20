import { $ } from './util.mjs';
import { listSessions } from './session.mjs';

/* The file picker's box, relabelled: same centered card, same scrolling list, a
   search field where the path row was. Reusing .fp means no second modal to keep
   in visual sync with the first. */

let resolveFn = null, rows = [], picked = null;

/** Name or id, case-insensitively. Exported so it can be tested without a DOM. */
export const matches = (s, q) => {
  const n = String(q ?? '').trim().toLowerCase();
  return !n || String(s.name ?? '').toLowerCase().includes(n)
            || String(s.id ?? '').toLowerCase().includes(n);
};

function ensureDom(){
  if($('#sp')) return;
  const d = document.createElement('div');
  d.id = 'sp'; d.className = 'fp'; d.setAttribute('role','dialog');
  d.setAttribute('aria-label','Open a session');
  d.innerHTML = `
    <div class="fp-hd">
      <strong>Open a session</strong>
      <span class="sp" style="flex:1"></span>
      <button class="btn icon ghost sm" id="spClose" aria-label="Cancel">✕</button>
    </div>
    <div class="fp-path"><input id="spQ" class="sp-q" type="search" placeholder="Search sessions…"
      autocomplete="off" spellcheck="false" aria-label="Search sessions"></div>
    <div class="fp-list" id="spList" tabindex="0"></div>
    <div class="fp-ft">
      <code id="spSel" class="hint"></code>
      <span class="sp" style="flex:1"></span>
      <button class="btn sm" id="spCancel">Cancel</button>
      <button class="btn sm primary" id="spOk" disabled>Open</button>
    </div>`;
  document.body.append(d);
  $('#spClose').onclick = $('#spCancel').onclick = () => close(null);
  $('#spOk').onclick = () => close(picked);
  $('#spQ').oninput = render;
}

function close(v){
  $('#sp')?.classList.remove('on');
  $('#scrim').classList.remove('on');
  const f = resolveFn; resolveFn = null; picked = null;
  f?.(v);
}

const when = ms => !ms ? '' : new Date(ms).toLocaleString();

function render(){
  const L = $('#spList'); L.textContent = '';
  const shown = rows.filter(r => matches(r, $('#spQ').value));
  if(!shown.length){
    L.innerHTML = '<p class="hint" style="padding:12px">No sessions'+
                  ($('#spQ').value.trim() ? ' matching that.' : ' yet.')+'</p>';
    $('#spOk').disabled = true; return;
  }
  shown.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'fp-row'; b.type = 'button';
    b.innerHTML = '<span class="fp-ic">🗂</span><span class="fp-nm"></span>'+
                  '<span class="sp" style="flex:1"></span><span class="hint sp-when"></span>';
    b.querySelector('.fp-nm').textContent = s.name || s.id;
    b.querySelector('.sp-when').textContent = when(s.updated);
    const choose = () => {
      [...L.children].forEach(c => c.classList.remove('sel'));
      b.classList.add('sel'); picked = s.id;
      $('#spSel').textContent = s.id; $('#spOk').disabled = false;
    };
    b.onclick = choose;
    b.ondblclick = () => { choose(); close(picked); };
    L.append(b);
    if(i === 0) choose();               // the list is newest-first, so this is the most recent
  });
}

/** pickSession() → a session id, or null if cancelled. */
export async function pickSession(){
  ensureDom();
  $('#spQ').value = '';
  $('#sp').classList.add('on');
  $('#scrim').classList.add('on');
  rows = await listSessions();
  render();
  setTimeout(() => $('#spQ').focus(), 60);
  return new Promise(r => { resolveFn = r; });
}
