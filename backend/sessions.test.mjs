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

{
  const { mkdtemp, mkdir, symlink, realpath } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { sessionDir } = await import('./sessions.mjs');

  const base = await mkdtemp(join(tmpdir(), 'mca-'));
  const runs = join(base, 'runs');
  await mkdir(join(runs, 'ok'), { recursive: true });
  // tmpdir() on macOS is under a symlink (/var -> /private/var); realpath the
  // expectation the same way sessionDir() must realpath its root, so the two
  // compare like with like instead of failing on every legitimate path.
  const realRuns = await realpath(runs);

  assert.equal(await sessionDir(runs, 'ok'), join(realRuns, 'ok'));

  // a folder that does not exist yet still resolves — save() creates it
  assert.equal(await sessionDir(runs, 'fresh'), join(realRuns, 'fresh'));

  const rejects = ['..', '../..', '../escape', '/etc', 'a/../../b', '', '...', './'];
  for (const bad of rejects)
    await assert.rejects(() => sessionDir(runs, bad), /outside|empty/i, 'must reject ' + JSON.stringify(bad));

  // a symlink inside runs/ that points out of it
  await mkdir(join(base, 'outside'), { recursive: true });
  await symlink(join(base, 'outside'), join(runs, 'sneaky'), 'dir');
  await assert.rejects(() => sessionDir(runs, 'sneaky'), /outside/i, 'must reject escaping symlink');
}

console.log('sessions containment ok');

{
  const { mkdtemp, mkdir, readFile: rf } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { listSessions, saveSession } = await import('./sessions.mjs');

  const runs = join(await mkdtemp(join(tmpdir(), 'mca-')), 'runs');
  await mkdir(runs, { recursive: true });

  assert.deepEqual(await listSessions(runs), [], 'empty runs/ lists nothing');

  const a = await saveSession(runs, { id: '2026-09-20', name: 'Untitled project',
    chats: [{ id: 1, title: 'first', log: [{ q: 'hi', a: 'yo', tools: [] }], history: [] }],
    settings: { start: 0, end: 100, points: 50 }, model: 'S1 -> S2; k*S1' });
  assert.equal(a.id, '2026-09-20');

  const saved = JSON.parse(await rf(join(runs, '2026-09-20/session.json'), 'utf8'));
  assert.equal(saved.name, 'Untitled project');
  assert.equal(saved.chats[0].title, 'first');
  assert.equal(await rf(join(runs, '2026-09-20/model.txt'), 'utf8'), 'S1 -> S2; k*S1');
  assert.equal(JSON.parse(await rf(join(runs, '2026-09-20/settings.json'), 'utf8')).points, 50);

  // renaming the project renames the folder and reports the new id
  const b = await saveSession(runs, { id: '2026-09-20', name: 'Glycolysis v2',
    chats: [], settings: { start: 0, end: 100, points: 50 }, model: 'x' });
  assert.equal(b.id, 'Glycolysis-v2');
  const ids = (await listSessions(runs)).map(s => s.id);
  assert.deepEqual(ids, ['Glycolysis-v2'], 'old folder is gone, not duplicated');

  // a second session wanting the same name gets a suffix, never a silent overwrite
  const c = await saveSession(runs, { id: '2026-09-21', name: 'Glycolysis v2',
    chats: [], settings: {}, model: 'y' });
  assert.equal(c.id, 'Glycolysis-v2-2');

  // a stray folder with no session.json must not break the listing
  await mkdir(join(runs, 'junk'), { recursive: true });
  assert.equal((await listSessions(runs)).length, 2, 'junk folder skipped');
}

console.log('sessions list/save ok');

{
  const { mkdtemp, mkdir, writeFile: wf, stat: st } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { openSession, deleteSession, saveSession } = await import('./sessions.mjs');

  const base = await mkdtemp(join(tmpdir(), 'mca-'));
  const runs = join(base, 'runs');
  await mkdir(runs, { recursive: true });

  await saveSession(runs, { id: 'demo', name: 'Demo', chats: [{ id: 1, title: 't' }],
    settings: { start: 0, end: 5, points: 9 }, model: 'S1 -> S2; k*S1' });
  await wf(join(runs, 'demo/summary.md'), 'Earlier: we found step 3 holds the control.');
  await wf(join(runs, 'demo/scan.py'), 'print(1)');

  const s = await openSession(runs, 'demo');
  assert.equal(s.name, 'Demo');
  assert.equal(s.model, 'S1 -> S2; k*S1');
  assert.equal(s.settings.points, 9);
  assert.equal(s.chats[0].title, 't');
  assert.match(s.summary, /step 3/);

  // a folder with only a session.json must still open
  await mkdir(join(runs, 'bare'), { recursive: true });
  await wf(join(runs, 'bare/session.json'), JSON.stringify({ name: 'Bare', chats: [] }));
  const bare = await openSession(runs, 'bare');
  assert.equal(bare.model, '');
  assert.deepEqual(bare.settings, {});
  assert.equal(bare.summary, '');

  // delete takes the folder and its contents, and nothing else
  await deleteSession(runs, 'demo');
  assert.equal(await st(join(runs, 'demo')).catch(() => null), null, 'demo folder gone');
  assert.ok(await st(join(runs, 'bare')).catch(() => null), 'bare folder untouched');

  for (const bad of ['..', '../..', '/etc'])
    await assert.rejects(() => deleteSession(runs, bad), /outside|empty/i, 'delete must reject ' + bad);
  assert.ok(await st(runs).catch(() => null), 'runs/ itself survives');
}

console.log('sessions open/delete ok');

{
  const { splitHistory, summaryPrompt } = await import('./sessions.mjs');
  const msgs = n => Array.from({ length: n }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user',
                                                           content: 'm' + i }));

  // under the cap nothing is folded away
  const small = splitHistory(msgs(12));
  assert.deepEqual(small.fold, []);
  assert.equal(small.recent.length, 12);

  // 13 in: one folds out, exactly 12 are kept, and the newest is still last
  const over = splitHistory(msgs(13));
  assert.equal(over.fold.length, 1);
  assert.equal(over.fold[0].content, 'm0');
  assert.equal(over.recent.length, 12);
  assert.equal(over.recent.at(-1).content, 'm12');

  const wide = splitHistory(msgs(30));
  assert.equal(wide.fold.length, 18);
  assert.equal(wide.recent.length, 12);

  // the prior summary is carried in, not discarded — this is what makes it a loop
  const p = summaryPrompt('Step 3 holds the control.', msgs(2));
  const all = p.map(m => m.content).join('\n');
  assert.match(all, /Step 3 holds the control\./, 'prior summary is folded in');
  assert.match(all, /m0/, 'the messages falling off are included');

  const first = summaryPrompt('', msgs(2));
  assert.doesNotMatch(first.map(m => m.content).join('\n'), /undefined|null/);
}

console.log('sessions compaction ok');

{
  const { mkdtemp, mkdir, stat: st } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { saveSession, listSessions } = await import('./sessions.mjs');

  const runs = join(await mkdtemp(join(tmpdir(), 'mca-')), 'runs');
  await mkdir(runs, { recursive: true });

  const { id: first } = await saveSession(runs, { id: '2026-09-20', name: 'Untitled project',
                                                  chats: [], settings: {}, model: 'm' });
  const { id: renamed } = await saveSession(runs, { id: first, name: 'Glycolysis v2',
                                                    chats: [], settings: {}, model: 'm' });
  assert.equal(renamed, 'Glycolysis-v2');
  assert.equal(await st(join(runs, first)).catch(() => null), null, 'the dated folder is gone');
  assert.deepEqual((await listSessions(runs)).map(s => s.id), ['Glycolysis-v2']);
}

console.log('sessions rename ok');

console.log('sessions slug ok');
