/* node --test web/js/util.test.mjs
   The slider bug: a plain trailing debounce never fires while the input keeps
   coming, so dragging a slider only re-simulated on mouse-up. */
import assert from 'node:assert/strict';
import { coalesce } from './util.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Drive a burst of calls at `every` ms for `ms`, the way a held slider does. */
async function drag(fn, ms, every = 8) {
  const t0 = performance.now();
  while (performance.now() - t0 < ms) { fn(); await sleep(every); }
}

/* ---- the regression: a continuous stream must still produce runs ---- */
{
  let runs = 0;
  const f = coalesce(() => runs++, () => ({ wait: 30, max: 100 }));
  await drag(f, 500);
  assert.ok(runs >= 3, `a 500ms drag at a 100ms ceiling should run repeatedly, got ${runs}`);
  assert.ok(runs <= 25, `...but must still coalesce, got ${runs}`);
  console.log('continuous input keeps running ok (' + runs + ' runs in 500ms)');
}

/* ---- and it must still coalesce a burst, which is the point of debouncing ---- */
{
  let runs = 0;
  const f = coalesce(() => runs++, () => ({ wait: 30, max: 1000 }));
  for (let i = 0; i < 50; i++) f();          // 50 calls in one synchronous tick
  assert.equal(runs, 0, 'nothing runs synchronously');
  await sleep(120);
  assert.equal(runs, 1, 'a burst inside the ceiling collapses to one run');
  console.log('burst coalescing ok');
}

/* ---- a quiet gap still produces the trailing run ---- */
{
  let runs = 0;
  const f = coalesce(() => runs++, () => ({ wait: 20, max: 1000 }));
  f();
  await sleep(100);
  assert.equal(runs, 1, 'trailing edge fires once input stops');
  f();
  await sleep(100);
  assert.equal(runs, 2, 'the next burst is independent');
  console.log('trailing edge ok');
}

/* ---- the ceiling is measured from the OLDEST pending call, not the newest ---- */
{
  const seen = [];
  const f = coalesce(() => seen.push(performance.now()), () => ({ wait: 500, max: 80 }));
  const t0 = performance.now();
  await drag(f, 300);
  // with wait(500) > max(80) the trailing timer can never win; only the ceiling can
  assert.ok(seen.length >= 2, `ceiling must fire without the trailing timer, got ${seen.length}`);
  assert.ok(seen[0] - t0 < 200, 'the first run comes at the ceiling, not at the end');
  console.log('ceiling beats the trailing timer ok');
}

console.log('util.test.mjs ok');
