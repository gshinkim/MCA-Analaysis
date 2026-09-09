export const $  = s => document.querySelector(s);
export const $$ = s => [...document.querySelectorAll(s)];
export const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

export const SERIES = ['--s1','--s2','--s3','--s4','--s5','--s6','--s7','--s8'];

export const store = {
  get:(k,d)=>{ try{ return JSON.parse(localStorage.getItem('mca.'+k)) ?? d }catch{ return d } },
  set:(k,v)=>{ try{ localStorage.setItem('mca.'+k, JSON.stringify(v)) }catch{} },
};

const SVG = 'http://www.w3.org/2000/svg';
export const el = (n,a={}) => { const e=document.createElementNS(SVG,n);
  for(const k in a) e.setAttribute(k,a[k]); return e; };

export const fmt = v =>
  Math.abs(v)>=1000 || (Math.abs(v)<0.01 && v!==0)
    ? v.toExponential(2)
    : (+v.toFixed(3)).toLocaleString();

export const numText = v => String(+(+v).toPrecision(6));

export function ticks(lo,hi,n){
  const raw=(hi-lo)/n, mag=Math.pow(10,Math.floor(Math.log10(raw||1)));
  const step=([1,2,2.5,5,10].find(m=>m*mag>=raw) ?? 10)*mag;
  const out=[]; for(let v=Math.ceil(lo/step)*step; v<=hi+step*1e-9; v+=step) out.push(+v.toFixed(10));
  return out;
}

export function flash(btn, text, ms=900){
  const old=btn.textContent; btn.textContent=text; btn.disabled=true;
  setTimeout(()=>{ btn.textContent=old; btn.disabled=false; }, ms);
}
