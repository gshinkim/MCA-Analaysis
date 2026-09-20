/* node backend/sessions.test.mjs */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { slug } from './sessions.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const CASES = [
  ['Glycolysis v2',      'Glycolysis-v2'],
  ['  My/Bad:Name  ',    'MyBadName'],
  ['Untitled project',   'Untitled-project'],
  ['',                   ''],
  ['...',                ''],
  ['../../etc/passwd',   'etcpasswd'],
  ['a'.repeat(200),      'a'.repeat(80)],
];

{
  for (const [input, want] of CASES) assert.equal(slug(input), want, JSON.stringify(input));
}

{
  // the browser copy and the server copy must not drift
  const src = await readFile(join(ROOT, 'web/js/util.mjs'), 'utf8');
  const { slug: browserSlug } = await import('../web/js/util.mjs');
  assert.ok(/export const slug/.test(src), 'util.mjs must export slug');
  for (const [input, want] of CASES) assert.equal(browserSlug(input), want, 'browser: ' + input);
}

console.log('sessions slug ok');
