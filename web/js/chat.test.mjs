/* node web/js/chat.test.mjs
   No DOM: pins the replay-cap decision loadChats uses to bound how many turns
   of a restored session get rendered (the DOM-touching part can't run here). */
import assert from 'node:assert/strict';
import { replaySlice, REPLAY_CAP } from './chat.mjs';

const turn = n => ({ q: 'q'+n, a: 'a'+n });

{
  // shorter than the cap: everything comes back, nothing skipped
  const log = [turn(1), turn(2), turn(3)];
  const { turns, skipped } = replaySlice(log, 5);
  assert.deepEqual(turns, log);
  assert.equal(skipped, 0);
}

{
  // longer than the cap: exactly `cap` turns, and they are the MOST RECENT
  // ones — showing the oldest instead would hide what the user actually needs
  const log = Array.from({ length: 30 }, (_, i) => turn(i));
  const { turns, skipped } = replaySlice(log, 20);
  assert.equal(turns.length, 20);
  assert.equal(skipped, 10);
  assert.deepEqual(turns, log.slice(10));
  assert.equal(turns[0].q, 'q10');
  assert.equal(turns.at(-1).q, 'q29');
}

{
  // empty log: no turns, no crash
  const { turns, skipped } = replaySlice([], 20);
  assert.deepEqual(turns, []);
  assert.equal(skipped, 0);
}

{
  // default cap is the named constant, not a re-typed magic number
  assert.equal(REPLAY_CAP, 20);
  const log = Array.from({ length: 25 }, (_, i) => turn(i));
  const { turns, skipped } = replaySlice(log);
  assert.equal(turns.length, REPLAY_CAP);
  assert.equal(skipped, 5);
}

console.log('chat replay-cap ok');
