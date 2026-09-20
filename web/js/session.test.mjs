/* node web/js/session.test.mjs
   No DOM and no server: the id rules are the part worth pinning. */
import assert from 'node:assert/strict';
import { slug } from './util.mjs';
import { defaultId } from './session.mjs';

{
  // an unnamed project is filed under the date; a named one under its name
  assert.match(defaultId('Untitled project', new Date('2026-09-20T10:00:00Z')), /^2026-09-20$/);
  assert.match(defaultId('', new Date('2026-09-20T10:00:00Z')), /^2026-09-20$/);
  assert.equal(defaultId('Glycolysis v2', new Date('2026-09-20T10:00:00Z')), 'Glycolysis-v2');
  // a name that slugs away to nothing falls back to the date too
  assert.match(defaultId('...', new Date('2026-09-20T10:00:00Z')), /^2026-09-20$/);
  assert.equal(slug('Glycolysis v2'), 'Glycolysis-v2');
}

console.log('session id ok');
