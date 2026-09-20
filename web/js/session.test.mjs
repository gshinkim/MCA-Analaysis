/* node web/js/session.test.mjs
   No DOM and no server: the id rules are the part worth pinning. */
import assert from 'node:assert/strict';
import { slug } from './util.mjs';
import { S } from './state.mjs';
import { defaultId, worthSaving, initSession, saveSoon, deleteCurrent } from './session.mjs';

{
  // an unnamed project is filed under the date; a named one under its name
  assert.match(defaultId('Untitled project', new Date('2026-09-20T10:00:00Z')), /^2026-09-20$/);
  assert.match(defaultId('', new Date('2026-09-20T10:00:00Z')), /^2026-09-20$/);
  assert.equal(defaultId('Glycolysis v2', new Date('2026-09-20T10:00:00Z')), 'Glycolysis-v2');
  // a name that slugs away to nothing falls back to the date too
  assert.match(defaultId('...', new Date('2026-09-20T10:00:00Z')), /^2026-09-20$/);
  assert.equal(slug('Glycolysis v2'), 'Glycolysis-v2');
}

{
  // no folder yet and nothing completed: a delete's async 'closed' path must
  // not resurrect the folder it just removed
  assert.equal(worthSaving(null, [{ log: [] }]), false);
  assert.equal(worthSaving(null, []), false);
  // no folder yet, but a turn completed: first-save lazy creation proceeds
  assert.equal(worthSaving(null, [{ log: [{ q: 'x', a: 'y' }] }]), true);
  // an existing session always saves, even mid-edit with empty chats
  assert.equal(worthSaving('Glycolysis-v2', []), true);
}

{
  // THE GHOST BUG: a chat turn (or a model edit) arms an 800ms saveSoon() debounce
  // for the CURRENT session. Before that timer fires, the user deletes the session
  // and confirms — while the delete's own fetch is still in flight. If the armed
  // save is merely left alone (or flushed), it fires for the OLD id and recreates
  // the very folder the user just deleted. deleteCurrent() must CANCEL the pending
  // save, not flush it, and must not let one get armed again until the delete
  // settles. This drives the REAL exported deleteCurrent()/saveSoon(), not a pure
  // helper standing in for them.
  initSession({ getName: () => 'Bob Smith', getModel: () => 'model text', getSettings: () => ({}),
                getChats: () => [{ log: [{ q: 'x', a: 'y' }] }], setAll: () => {} });

  const calls = [];
  let releaseDelete;
  const deleteGate = new Promise(r => { releaseDelete = r; });
  globalThis.fetch = (path, opts) => {
    calls.push({ path, body: opts?.body ? JSON.parse(opts.body) : null });
    if (path === '/api/sessions/delete')
      return deleteGate.then(() => ({ json: async () => ({ ok: true }) }));
    return Promise.resolve({ json: async () => ({ id: 'bob-smith' }) });
  };

  S.sessionDirId = 'bob-smith';
  saveSoon();                                     // arms the 800ms debounce, as a finished turn would
  const delP = deleteCurrent();                    // fires the delete; its fetch is still pending below
  saveSoon();                                      // a stray re-arm attempt mid-delete must also be refused
  await new Promise(r => setTimeout(r, 900));       // let the debounce window pass while delete is in flight
  assert.equal(calls.some(c => c.path === '/api/sessions/save'), false,
    'a pending (or re-armed) save must never fire while its session is being deleted');

  releaseDelete();
  const delResult = await delP;
  assert.equal(delResult.ok, true);
  assert.equal(S.sessionDirId, null, 'the deleted id must be cleared');

  await new Promise(r => setTimeout(r, 900));       // nothing lands late after the delete settles either
  assert.equal(calls.some(c => c.path === '/api/sessions/save'), false,
    'no stale save may land after the delete has completed');

  delete globalThis.fetch;
}

{
  // THE REENTRANCY GAP: two overlapping deleteCurrent() calls — reachable because
  // the delete button's click handler is async and nothing disables it while a
  // delete is in flight, so a user can accept two confirm() dialogs before the
  // first fetch resolves. A plain boolean `deleting` flag lets the FIRST call's
  // finally clear it while the SECOND call's post() is still pending, reopening
  // the window for saveSoon() to arm a save that resurrects the folder. Must be
  // a counter: only the LAST delete to settle may re-enable saving. Drives the
  // REAL exported deleteCurrent()/saveSoon(), not a pure helper standing in.
  initSession({ getName: () => 'Bob Smith', getModel: () => 'model text', getSettings: () => ({}),
                getChats: () => [{ log: [{ q: 'x', a: 'y' }] }], setAll: () => {} });

  const calls = [];
  let releaseDelete1, releaseDelete2;
  const gate1 = new Promise(r => { releaseDelete1 = r; });
  const gate2 = new Promise(r => { releaseDelete2 = r; });
  let deleteCallCount = 0;
  globalThis.fetch = (path, opts) => {
    calls.push({ path, body: opts?.body ? JSON.parse(opts.body) : null });
    if (path === '/api/sessions/delete') {
      deleteCallCount++;
      const gate = deleteCallCount === 1 ? gate1 : gate2;
      return gate.then(() => ({ json: async () => ({ ok: true }) }));
    }
    return Promise.resolve({ json: async () => ({ id: 'bob-smith' }) });
  };

  S.sessionDirId = 'bob-smith';
  const del1 = deleteCurrent();   // first overlapping delete, fetch pending
  const del2 = deleteCurrent();   // second, fired before the first settles

  releaseDelete1();
  await del1;                     // first delete resolves; the SECOND's fetch is still pending
  saveSoon();                     // fired in the reentrancy gap — must still be blocked
  await new Promise(r => setTimeout(r, 900));   // let the debounce window pass

  assert.equal(calls.some(c => c.path === '/api/sessions/save'), false,
    'no save may fire while a second overlapping delete is still in flight');

  releaseDelete2();
  await del2;

  await new Promise(r => setTimeout(r, 900));
  assert.equal(calls.some(c => c.path === '/api/sessions/save'), false,
    'no save may land after both deletes settle either');

  delete globalThis.fetch;
}

console.log('session id ok');
