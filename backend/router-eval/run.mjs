/* JEV_API_KEY=sk-... node backend/router-eval/run.mjs
   Every labelled case through Jev: per-Skill precision and recall at the hint (0.50)
   and auto-load (0.85) thresholds, against a free keyword baseline, plus latency and
   input tokens. Pass bars: recall >= 0.8 at 0.50; precision >= 0.9 at 0.85; p50 < 600 ms.
   Only Skills not already loaded are scored — the router never asks about the others. */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jev, questions } from '../router.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const key = process.env.JEV_API_KEY;
if (!key) { console.error('set JEV_API_KEY'); process.exit(1); }

const cases = (await readFile(join(HERE, 'cases.jsonl'), 'utf8')).trim().split('\n').map(l => JSON.parse(l));
const qs = await questions(join(HERE, '../..'));
const skills = Object.keys(qs);

// The baseline Jev has to beat: free, instant, nothing leaves the machine.
const KEYWORDS = {
  tellurium: /simulat|antimony|tellurium|roadrunner|steady.state|time.course|plot|sbml|scan|eigen|jacobian|bistab|fit|attributeerror|nameerror|rejected/i,
  mca: /control coeff|elasticit|rate.limit|summation|connectivity|branch.point|\bmca\b|loop gain|control of|ultrasensitiv/i,
  'pathway-modeling': /build|write .*model|add .*(enzyme|feedback|moiety)|rate law|stoichiometr|mass.action|michaelis|stochastic|gillespie|jacobian|stable|fit|estimat|motif|toggle|gene expression|refused/i,
};

let tokens = 0;
const counting = async (url, init) => {
  const r = await fetch(url, init);
  r.clone().json().then(j => { tokens += j.usage?.input_tokens ?? 0; }).catch(() => {});
  return r;
};

const rows = [], ms = [];
for (const c of cases) {
  const ask = Object.fromEntries(Object.entries(qs).filter(([k]) => !c.state.loaded.includes(k)));
  const t0 = Date.now();
  let p = {};
  try { p = await jev({ key, state: c.state, questions: ask, fetch: counting, signal: AbortSignal.timeout(10000) }); }
  catch (e) { console.error('case failed:', c.state.request.slice(0, 50), '—', e.message); continue; }
  ms.push(Date.now() - t0);
  const text = c.state.request + ' ' + c.state.recent.join(' ');
  for (const k of Object.keys(ask))
    rows.push({ k, need: c.need.includes(k), p: p[k] ?? 0, kw: KEYWORDS[k]?.test(text) ?? false,
                req: c.state.request });
}

const score = (rs, hit) => {
  const tp = rs.filter(r => r.need && hit(r)).length, fp = rs.filter(r => !r.need && hit(r)).length,
        fn = rs.filter(r => r.need && !hit(r)).length;
  const f = (a, b) => b ? (a / b).toFixed(2) : '  - ';
  return `P ${f(tp, tp + fp)} R ${f(tp, tp + fn)}`;
};
console.log('skill'.padEnd(18), 'jev @0.50'.padEnd(16), 'jev @0.85'.padEnd(16), 'keywords');
for (const k of [...skills, 'ALL']) {
  const rs = k === 'ALL' ? rows : rows.filter(r => r.k === k);
  console.log(k.padEnd(18), score(rs, r => r.p >= 0.5).padEnd(16), score(rs, r => r.p >= 0.85).padEnd(16),
              score(rs, r => r.kw));
}
ms.sort((a, b) => a - b);
console.log(`\n${ms.length}/${cases.length} cases, p50 ${ms[ms.length >> 1]} ms, ` +
            `p90 ${ms[Math.floor(ms.length * 0.9)]} ms, ${tokens} input tokens ` +
            `(~$${(tokens * 0.042 / 1e6).toFixed(5)})`);

const wrong = rows.filter(r => r.need !== r.p >= 0.5);
if (wrong.length) {
  console.log('\nmisses at 0.50:');
  for (const r of wrong) console.log(` ${r.need ? 'FN' : 'FP'} ${r.k.padEnd(17)} ${r.p.toFixed(2)}  ${r.req.slice(0, 70)}`);
}
