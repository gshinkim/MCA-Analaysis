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

{
  const { mkdtemp, mkdir, readFile: rf } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { saveSession } = await import('./sessions.mjs');

  const runs = join(await mkdtemp(join(tmpdir(), 'mca-')), 'runs');
  await mkdir(runs, { recursive: true });

  // a real snapshot exists; a blank/whitespace-only model must not overwrite it
  // (name equals the slugged id so saveSession takes no rename branch here)
  await saveSession(runs, { id: 'proj', name: 'proj', chats: [], settings: {}, model: 'S1 -> S2; k*S1' });
  await saveSession(runs, { id: 'proj', name: 'proj', chats: [], settings: {}, model: '' });
  assert.equal(await rf(join(runs, 'proj/model.txt'), 'utf8'), 'S1 -> S2; k*S1',
    'empty model must not clobber an existing snapshot');
  await saveSession(runs, { id: 'proj', name: 'proj', chats: [], settings: {}, model: '   \n  ' });
  assert.equal(await rf(join(runs, 'proj/model.txt'), 'utf8'), 'S1 -> S2; k*S1',
    'whitespace-only model must not clobber an existing snapshot either');

  // no snapshot yet: an empty model is the legitimate new-empty-session case and still writes
  await saveSession(runs, { id: 'fresh', name: 'fresh', chats: [], settings: {}, model: '' });
  assert.equal(await rf(join(runs, 'fresh/model.txt'), 'utf8'), '',
    'empty model with no existing snapshot still creates the file');
}

console.log('sessions empty-model guard ok');

{
  const { summaryStrategy, renderRecord, trimRecord, KEEP } = await import('./sessions.mjs');
  const msgs = n => Array.from({ length: n }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user',
                                                           content: 'm' + i }));

  // short history, any runtime: a plain record, no model call is even reachable
  assert.equal(summaryStrategy(0, false), 'record');
  assert.equal(summaryStrategy(KEEP, true), 'record');
  assert.equal(summaryStrategy(KEEP, false), 'record');

  // long history + a runtime with a cheap completion endpoint: compress
  assert.equal(summaryStrategy(KEEP + 1, true), 'compress');

  // long history + no cheap completion endpoint (Claude Code): trimmed record
  assert.equal(summaryStrategy(KEEP + 1, false), 'trim');

  // renderRecord: every message present, nothing summarised away
  const rec = renderRecord(msgs(5));
  for (let i = 0; i < 5; i++) assert.match(rec, new RegExp('m' + i));
  assert.equal(renderRecord([]), '');
  // this is what would fail if renderRecord degenerated into a no-op: an empty
  // record for a non-empty history would silently lose the conversation
  assert.notEqual(renderRecord(msgs(3)), '');

  // trimRecord: short history is untouched (same as renderRecord)
  assert.equal(trimRecord(msgs(KEEP), KEEP), renderRecord(msgs(KEEP)));

  // trimRecord: long history is bounded — the whole point of 'trim' over
  // 'record' on a long Claude Code conversation. Fails if trimRecord just
  // called renderRecord on everything (no bound at all).
  const big = msgs(500);
  const full = renderRecord(big);
  const trimmed = trimRecord(big, KEEP);
  assert.ok(trimmed.length < full.length, 'trim must be shorter than the untrimmed record');
  assert.ok(trimmed.length < 4000, 'trim must not grow with history length');
  assert.match(trimmed, /m499/, 'newest message survives untrimmed');
  assert.doesNotMatch(trimmed, /\bm0\b/, 'oldest message is the one dropped');
  assert.match(trimmed, /488 earlier messages omitted/);
}

console.log('sessions summary strategy ok');

{
  const { renderThinking, THINK_CAP } = await import('./sessions.mjs');

  // no text: nothing to write, caller skips the append entirely
  assert.equal(renderThinking('prompt', ''), '');
  assert.equal(renderThinking('prompt', '   '), '');

  const now = () => new Date('2026-09-20T12:00:00.000Z');
  const block = renderThinking('What does step 3 control?', 'Because k2 is saturated...', 200, now);
  assert.match(block, /2026-09-20T12:00:00\.000Z/);
  assert.match(block, /What does step 3 control\?/);
  assert.match(block, /Because k2 is saturated/);

  // the cap actually bounds a runaway reasoning model's output
  const huge = 'x'.repeat(50000);
  const capped = renderThinking('p', huge, 1000, now);
  assert.ok(capped.length < 1200, 'capped block must stay near the cap, not grow with input');
  assert.match(capped, /truncated at 1000 characters/);

  // default cap applies when the caller does not pass one
  const defCapped = renderThinking('p', 'y'.repeat(THINK_CAP * 3), undefined, now);
  assert.ok(defCapped.length < THINK_CAP * 2, 'default cap must also bound the output');
}

console.log('sessions thinking ok');

{
  const { buildTurn, renderRecord } = await import('./sessions.mjs');
  // "_end" suffix so 'msg1_end' is never a substring of 'msg10_end' etc. — plain
  // numeric suffixes would make the duplication check below pass by accident.
  const msgs = n => Array.from({ length: n }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user',
                                                           content: 'msg' + i + '_end' }));

  // short history, no prior summary: nothing folded, nothing injected, the
  // whole conversation is still live
  {
    const t = buildTurn(msgs(4), '', 12);
    assert.equal(t.inject, '');
    assert.equal(t.messages.length, 4);
    assert.deepEqual(t.fold, []);
  }

  // long history: only the newest `keep` go to the model; the rest fold away
  {
    const t = buildTurn(msgs(20), '', 12);
    assert.equal(t.messages.length, 12);
    assert.equal(t.messages.at(-1).content, 'msg19_end', 'newest message must be present');
    assert.ok(!t.messages.some(m => m.content === 'msg7_end'), 'oldest folded message must be gone');
    assert.equal(t.fold.length, 8);
    assert.equal(t.fold[0].content, 'msg0_end');
  }

  // THE DUPLICATION TEST — the regression guard. A prior summary that (correctly)
  // describes only the folded-away turns must never share content with the live
  // message window. If buildTurn ever regresses to rendering the whole history
  // into `inject` (defect 1), messages from the live window would show up in
  // both places and this fails.
  {
    const history = msgs(20);
    const { fold } = buildTurn(history, '', 12);
    const priorSummary = renderRecord(fold);
    const t = buildTurn(history, priorSummary, 12);
    const messageText = t.messages.map(m => m.content).join('\n');
    for (const m of history)
      assert.ok(!(t.inject.includes(m.content) && messageText.includes(m.content)),
        m.content + ' must not appear in both inject and messages');
    // sanity: the guard above isn't vacuous — inject does have real content
    assert.match(t.inject, /msg0_end/);
  }

  // empty history: no crash, nothing to send or fold or inject
  {
    const t = buildTurn([], '', 12);
    assert.deepEqual(t.messages, []);
    assert.deepEqual(t.fold, []);
    assert.equal(t.inject, '');
    const t2 = buildTurn(undefined, undefined, 12);
    assert.deepEqual(t2.messages, []);
    assert.deepEqual(t2.fold, []);
    assert.equal(t2.inject, '');
  }
}

console.log('sessions buildTurn ok');

{
  // THE 'trim' DUPLICATION TEST — defect 1 regression guard. server.mjs's 'trim'
  // strategy (no cheap completion endpoint, e.g. Claude Code) must record
  // trimRecord(fold), never trimRecord(history): the full history includes the
  // live window, and injecting that back next turn while it is also sent as
  // `messages` is exactly what sent a local model into a loop. This fails if
  // 'trim' is ever repointed at the full history instead of the fold.
  const { buildTurn, trimRecord, KEEP } = await import('./sessions.mjs');
  const msgs = n => Array.from({ length: n }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user',
                                                           content: 'msg' + i + '_end' }));
  const history = msgs(20);

  // turn N: nothing injected yet, `fold` is what just aged out
  const turnN = buildTurn(history, '', KEEP);
  assert.equal(turnN.fold.length, 8);

  // the fix: summary.md is written from the fold, bounded — never the full history
  const summaryFixed = trimRecord(turnN.fold, KEEP);
  // the bug being guarded against: writing the full history instead
  const summaryBuggy = trimRecord(history, KEEP);

  // turn N+1 (same conversation, nothing new sent yet): what actually gets
  // injected and what actually gets sent live
  const turnNext = buildTurn(history, summaryFixed, KEEP);
  const messageText = turnNext.messages.map(m => m.content).join('\n');

  for (const m of history)
    assert.ok(!(turnNext.inject.includes(m.content) && messageText.includes(m.content)),
      m.content + ' must not appear in both inject and messages (fixed trim)');
  assert.match(turnNext.inject, /msg0_end/, 'sanity: the fixed summary has real content');

  // and this is the failure the fix prevents: using the full history reproduces
  // the exact overlap the invariant forbids
  const turnNextBuggy = buildTurn(history, summaryBuggy, KEEP);
  const messageTextBuggy = turnNextBuggy.messages.map(m => m.content).join('\n');
  const overlapsWhenBuggy = history.some(m =>
    turnNextBuggy.inject.includes(m.content) && messageTextBuggy.includes(m.content));
  assert.ok(overlapsWhenBuggy,
    'sanity: trimRecord(history) must reproduce the duplication this test guards against');
}

console.log('sessions trim-strategy no-overlap ok');

{
  // DEFECT 1 — the placeholder guard must be case/whitespace-insensitive, not an
  // exact string match against DEFAULT_NAME. A name that is semantically still
  // "the unnamed placeholder" (different case, or padded with whitespace) must
  // not trigger a folder rename; a genuinely new name still must.
  const { mkdtemp, mkdir, stat: st } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { saveSession } = await import('./sessions.mjs');

  const runs = join(await mkdtemp(join(tmpdir(), 'mca-')), 'runs');
  await mkdir(runs, { recursive: true });

  await saveSession(runs, { id: '2026-09-20', name: 'Untitled project',
    chats: [], settings: {}, model: 'm' });

  const lower = await saveSession(runs, { id: '2026-09-20', name: 'untitled project',
    chats: [], settings: {}, model: 'm' });
  assert.equal(lower.id, '2026-09-20', 'lowercase placeholder must not rename the folder');
  assert.equal(await st(join(runs, 'Untitled-project')).catch(() => null), null,
    'no rename must have happened for lowercase placeholder');

  const padded = await saveSession(runs, { id: '2026-09-20', name: ' Untitled project ',
    chats: [], settings: {}, model: 'm' });
  assert.equal(padded.id, '2026-09-20', 'padded placeholder must not rename the folder');
  assert.equal(await st(join(runs, 'Untitled-project')).catch(() => null), null,
    'no rename must have happened for padded placeholder');

  const real = await saveSession(runs, { id: '2026-09-20', name: 'Glycolysis v2',
    chats: [], settings: {}, model: 'm' });
  assert.equal(real.id, 'Glycolysis-v2', 'a genuinely new name must still rename the folder');
}

console.log('sessions placeholder guard ok');

{
  // DEFECT 2 — TOCTOU between freeId's stat check and the caller's rename/mkdir.
  // Simulate the chosen id being taken between the check and the use: saveSession
  // must retry onto the next free id rather than throwing EEXIST/ENOTEMPTY.
  const { mkdtemp, mkdir } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { saveSession } = await import('./sessions.mjs');

  const runs = join(await mkdtemp(join(tmpdir(), 'mca-')), 'runs');
  await mkdir(runs, { recursive: true });

  // Two already-saved sessions, both about to be renamed to the same new name
  // at (near) the same time. freeId's stat check happens for both before either
  // has claimed the name — this IS the TOCTOU window from the defect report:
  // both see 'Glycolysis-v2' as free, both attempt to claim it, and whichever
  // loses the race must retry onto the next free id rather than throwing
  // EEXIST/ENOTEMPTY out of saveSession.
  await saveSession(runs, { id: 'a', name: 'a', chats: [], settings: {}, model: 'm' });
  await saveSession(runs, { id: 'b', name: 'b', chats: [], settings: {}, model: 'm' });

  const [ra, rb] = await Promise.all([
    saveSession(runs, { id: 'a', name: 'Glycolysis v2', chats: [], settings: {}, model: 'm' }),
    saveSession(runs, { id: 'b', name: 'Glycolysis v2', chats: [], settings: {}, model: 'm' }),
  ]);
  assert.notEqual(ra.id, rb.id, 'two concurrent renames to the same name must not collide');
  assert.deepEqual([ra.id, rb.id].sort(), ['Glycolysis-v2', 'Glycolysis-v2-2'],
    'the loser of the race must land on the next free id, not throw');
}

console.log('sessions rename retry ok');

{
  // DEFECT 3 — thinking.md must be bounded across the whole file, not just per
  // block. Append enough blocks to exceed the cap and assert: the file stays
  // under the cap, the newest block survives in full, the oldest is gone, no
  // block is cut mid-way, and the "earlier reasoning dropped" note appears
  // exactly once even after repeated trims.
  const { mkdtemp, mkdir, readFile: rf } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { appendThinking, THINKING } = await import('./sessions.mjs');

  const runs = join(await mkdtemp(join(tmpdir(), 'mca-')), 'runs');
  const dir = join(runs, 'demo');
  await mkdir(dir, { recursive: true });

  const totalCap = 5000; // small total-file cap so the test doesn't need thousands of appends
  const now = i => () => new Date(Date.UTC(2026, 8, 20, 12, i));
  // each block is a few hundred chars; append enough to exceed `totalCap` several times over
  for (let i = 0; i < 40; i++)
    await appendThinking(dir, 'turn ' + i, 'reasoning '.repeat(30), undefined, totalCap, now(i));

  const text = await rf(join(dir, THINKING), 'utf8');
  assert.ok(text.length <= totalCap * 1.2, 'file must stay bounded near the cap, not grow unboundedly: ' + text.length);
  assert.match(text, /turn 39/, 'the newest block must survive in full');
  assert.doesNotMatch(text, /turn 0\b/, 'the oldest block must have been dropped');
  // no block cut mid-way: every remaining '## ' heading must be followed by a
  // complete block ending before the next heading or EOF — approximate by
  // checking headings and bodies pair up (no heading with no reasoning text after it)
  const blocks = text.split(/(?=^## )/m).filter(b => b.trim());
  for (const b of blocks.filter(b => b.startsWith('## ')))
    assert.match(b, /reasoning( reasoning)*/, 'block must not be cut mid-way: ' + b.slice(0, 60));
  const dropNotes = text.match(/earlier reasoning was dropped/gi) ?? [];
  assert.equal(dropNotes.length, 1, 'the drop note must appear exactly once, not duplicated on every trim');
}

console.log('sessions thinking cap ok');

console.log('sessions slug ok');
