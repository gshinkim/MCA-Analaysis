/* node web/js/session.test.mjs
   No DOM and no server: the id rules are the part worth pinning. */
import assert from 'node:assert/strict';
import { slug } from './util.mjs';
import { defaultId, worthSaving } from './session.mjs';

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

console.log('session id ok');
