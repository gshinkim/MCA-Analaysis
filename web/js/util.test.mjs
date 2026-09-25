/* node web/js/util.test.mjs
   The slider bug: runs were debounced and each newer one discarded the last, so a
   steady drag drew nothing until the slider was let go. Every movement must run at
   once, and movements that arrive mid-run must still end in a run of the latest. */
import assert from 'node:assert/strict';
import { latestOnly } from './util.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---- the first movement runs immediately, not after a quiet gap ---- */
{
  let runs = 0;
  const f = latestOnly(async () => { runs++; await sleep(50); });
  f();
  assert.equal(runs, 1, 'a movement starts its run synchronously');
  console.log('immediate run ok');
}

/* ---- movements during a run collapse into ONE follow-up, which sees the latest value ---- */
{
  let value = 0; const seen = [];
  const f = latestOnly(async () => { seen.push(value); await sleep(40); });
  f();                                        // runs with 0
  for (value = 1; value <= 20; value++) f();  // 20 movements while it runs
  value = 20;
  await sleep(150);
  assert.deepEqual(seen, [0, 20], 'one follow-up run, with the latest value');
  console.log('mid-run movements collapse to the latest ok');
}

/* ---- a steady drag keeps producing runs the whole way through ---- */
{
  let runs = 0;
  const f = latestOnly(async () => { runs++; await sleep(30); });
  const t0 = performance.now();
  while (performance.now() - t0 < 400) { f(); await sleep(8); }
  assert.ok(runs >= 8, `a 400ms drag with 30ms runs should run continuously, got ${runs}`);
  console.log('continuous drag keeps running ok (' + runs + ' runs in 400ms)');
}

/* ---- a run that throws does not wedge the slider ---- */
{
  let runs = 0;
  const f = latestOnly(async () => { runs++; throw new Error('tellurium error'); });
  await f().catch(() => {});
  await f().catch(() => {});
  assert.equal(runs, 2, 'the next movement still runs after a failed one');
  console.log('recovers after an error ok');
}

/* ---- a queued follow-up still runs when the run ahead of it throws ---- */
{
  let runs = 0, secondRan = false;
  const f = latestOnly(async () => {
    runs++;
    if (runs === 1) throw new Error('boom');
    secondRan = true;
  });
  f();                                         // starts, will throw
  f();                                         // queued while the first is in flight
  await sleep(20);
  assert.equal(runs, 2, 'the first call still ran once');
  assert.equal(secondRan, true, 'the queued follow-up still ran after the throw');
  console.log('queued follow-up survives a throw ok');
}

console.log('util.test.mjs ok');
