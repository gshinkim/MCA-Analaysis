/* node --test web/js/localai.test.mjs

   The bug this covers: LM Studio was not running, nothing was listening on 1234,
   and Connect answered "The browser blocked the request to your machine. Click
   Connect again and choose Allow on the local network prompt." Clicking Allow
   could never help — there was no server on the other end. A refused connection
   and a blocked one are both an instant TypeError, so "failed in under 50ms" was
   never enough on its own to blame the browser. */
import assert from 'node:assert/strict';

/** Browser globals probe() reads. Set before importing the module under test. */
const setPage = origin => { globalThis.location = { origin }; };
const setPermission = state => Object.defineProperty(globalThis, 'navigator', {
  value: { permissions: { query: async () => ({ state }) } }, configurable: true });
/** Nothing listening: fetch rejects immediately, exactly as a refused port does. */
const refuseAll = () => { globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); }; };

setPage('http://127.0.0.1:5173');
setPermission('prompt');
refuseAll();

const { probe, samePageSpace } = await import('./localai.mjs');

/* ---- the address-space test itself ---- */
{
  assert.equal(samePageSpace('http://localhost:1234', 'http://127.0.0.1:5173'), true,
    'loopback page to loopback server is one space');
  assert.equal(samePageSpace('http://127.0.0.1:11434', 'http://localhost:5173'), true,
    'either spelling of loopback counts');
  assert.equal(samePageSpace('http://localhost:1234', 'https://atlas.example.com'), false,
    'a hosted page reaching loopback does cross a space');
  assert.equal(samePageSpace('http://192.168.1.9:1234', 'http://127.0.0.1:5173'), false,
    'the LAN is not the loopback space');
  // '' rather than undefined: an undefined argument takes the default, which is
  // the real page origin, so it would not exercise this guard at all.
  assert.equal(samePageSpace('http://localhost:1234', ''), false,
    'with no page origin, claim nothing');
  assert.equal(samePageSpace('not a url', 'http://127.0.0.1:5173'), false,
    'an unparseable target is not a space claim either');
  console.log('address space ok');
}

/* ---- a closed port on a local page is reported as unreachable, not as a
       permission the user could grant ---- */
{
  const r = await probe('http://localhost:1234');
  assert.notEqual(r.status, 'permission',
    'nothing is listening: telling the user to click Allow is a dead end');
  assert.equal(r.status, 'cors');
  assert.match(r.detail, /not running/, 'says the server may simply not be up');
  assert.ok(r.cmds?.some(c => /LM Studio/i.test(c.app)), 'offers the command that starts it');
  console.log('closed port on a loopback page ok');
}

/* ---- a hosted page really is gated, and still says so ---- */
{
  setPage('https://atlas.example.com');
  const r = await probe('http://localhost:1234');
  assert.equal(r.status, 'permission',
    'crossing into loopback from a hosted page is exactly what the prompt is for');
  console.log('hosted page still reports the prompt ok');
}

/* ---- an explicit denial outranks everything, on any page ---- */
{
  setPage('http://127.0.0.1:5173');
  setPermission('denied');
  const r = await probe('http://localhost:1234');
  assert.equal(r.status, 'permission');
  assert.match(r.detail, /Site settings/, 'points at the setting that is actually blocking');
  console.log('explicit denial ok');
}

console.log('localai.test.mjs ok');
