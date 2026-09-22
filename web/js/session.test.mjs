/* node web/js/session.test.mjs
   No DOM and no server: the id rules are the part worth pinning. */
import assert from 'node:assert/strict';
import { slug } from './util.mjs';
import { S } from './state.mjs';
import { worthSaving, initSession, saveSoon, saveNow, deleteCurrent, newProject } from './session.mjs';

{
  // untouched and never saved: closing the page must leave nothing behind
  assert.equal(worthSaving(null, false), false);
  // the first touch saves; an existing project always saves
  assert.equal(worthSaving(null, true), true);
  assert.equal(worthSaving('Glycolysis-v2', false), true);
  assert.equal(slug('Untitled project'), 'Untitled-project');
}

{
  // THE "NOTHING SAVES" BUG: editing the model or renaming (no chat turn at all)
  // must create the project's folder. The first save is `fresh` so the server
  // claims a new folder instead of writing into another project's.
  let name = 'Untitled project';
  initSession({ getName: () => name, getModel: () => 'S1 -> S2; k*S1', getSettings: () => ({}),
                getChats: () => [], setAll: () => {} });
  const calls = [];
  globalThis.fetch = (path, opts) => {
    const body = JSON.parse(opts.body);
    calls.push(body);
    return Promise.resolve({ json: async () => ({ id: body.fresh ? 'Untitled-project-2' : body.id }) });
  };
  S.sessionDirId = null;
  assert.equal(await saveNow(), null, 'untouched: no save');
  saveSoon();                                       // what a model edit / rename does
  saveNow();                                        // lands while the debounced one is pending: only ONE may be fresh
  await new Promise(r => setTimeout(r, 900));
  assert.deepEqual(calls.map(c => [c.id, c.fresh]),
                   [['Untitled-project', true], ['Untitled-project-2', false]]);
  assert.equal(S.sessionDirId, 'Untitled-project-2');
  delete globalThis.fetch;
  S.sessionDirId = null;
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

{
  // NEW PROJECT: the old project's pending edit lands in ITS folder, then the page is an
  // untouched Untitled project that creates nothing until it is touched
  initSession({ getName: () => 'Untitled project', getModel: () => 'm', getSettings: () => ({}),
                getChats: () => [], setAll: () => {} });
  const calls = [];
  globalThis.fetch = (path, opts) => { const b = JSON.parse(opts.body); calls.push(b);
    return Promise.resolve({ json: async () => ({ id: b.fresh ? 'Untitled-project-3' : b.id }) }); };
  S.sessionDirId = 'Old-project';
  saveSoon();                                       // an edit, still inside the debounce
  await newProject();
  assert.deepEqual(calls.map(c => c.id), ['Old-project'], 'pending save flushed to the old folder');
  assert.equal(S.sessionDirId, null);
  assert.equal(await saveNow(), null, 'untouched new project: no folder');
  saveSoon();
  await new Promise(r => setTimeout(r, 900));
  assert.deepEqual(calls.at(-1), { ...calls.at(-1), fresh: true, id: 'Untitled-project' });
  assert.equal(S.sessionDirId, 'Untitled-project-3');
  delete globalThis.fetch;
  S.sessionDirId = null;
}

console.log('session id ok');
