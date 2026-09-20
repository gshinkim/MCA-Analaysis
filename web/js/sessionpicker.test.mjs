/* node web/js/sessionpicker.test.mjs */
import assert from 'node:assert/strict';
import { matches } from './sessionpicker.mjs';

const rows = [
  { id: 'Glycolysis-v2', name: 'Glycolysis v2' },
  { id: '2026-09-20',    name: 'Untitled project' },
  { id: 'TCA-cycle',     name: 'TCA cycle' },
];

{
  assert.deepEqual(rows.filter(r => matches(r, '')).map(r => r.id),
                   ['Glycolysis-v2', '2026-09-20', 'TCA-cycle'], 'empty query keeps everything');
  assert.deepEqual(rows.filter(r => matches(r, 'gly')).map(r => r.id), ['Glycolysis-v2']);
  assert.deepEqual(rows.filter(r => matches(r, 'GLY')).map(r => r.id), ['Glycolysis-v2'],
                   'case-insensitive');
  assert.deepEqual(rows.filter(r => matches(r, '2026')).map(r => r.id), ['2026-09-20'],
                   'the id is searchable too, not just the name');
  assert.deepEqual(rows.filter(r => matches(r, 'zzz')).map(r => r.id), []);
}

console.log('session picker filter ok');
