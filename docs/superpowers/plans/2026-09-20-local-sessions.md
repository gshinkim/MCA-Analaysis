# Local Sessions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every working session a folder under `workspace/runs/` holding its chats, model, settings and the AI's scratch files — saveable, re-openable, and deletable.

**Architecture:** `workspace/model.txt` stays the single live model the agent reads and writes; a session folder holds a *snapshot* of it plus `session.json`, `summary.md` and the AI's own files. All session logic lands in one new backend module (`backend/sessions.mjs`) and one new frontend module (`web/js/session.mjs`); `server.mjs` gains four exact-match routes and no router changes. Rolling memory is a real file both runtimes read.

**Tech Stack:** Node ≥18 (`node:http`, `node:fs/promises`, no dependencies), vanilla ES modules in the browser, no build step, no framework.

**Spec:** `docs/superpowers/specs/2026-09-20-sessions-design.md`

## Global Constraints

- **No dependencies.** This project has no `package.json` and no `node_modules`. Node stdlib and browser platform APIs only.
- **Tests are plain scripts.** No test framework. A test file is `import assert from 'node:assert/strict'`, bare `{ … }` blocks, and a final `console.log('<name> ok')`. Run as `node path/to/file.test.mjs`. Exit code 0 means pass. Follow `web/js/oai.test.mjs` and `backend/local-agent.test.mjs`.
- **Local only.** Every route added here returns HTTP 400 when `HOSTED` is true, matching `/api/scratch` (`backend/server.mjs:209`). Every new UI control is hidden when `S.env.hosted`.
- **`workspace/model.txt` is the live model.** Never repoint the agent at a session folder's `model.txt`. Session open *copies into* the live file.
- **The session list is derived from `readdir`.** Never add an index file.
- **Folder creation is lazy** — first chat turn or first explicit save, never on page load.
- **Default retention is 12 messages** before compaction.
- **ES module style:** 2-space indent, single quotes, semicolons, matching surrounding files.

---

### Task 1: Shared `slug()`

`slug()` lives in `web/js/export.mjs:57` and already does filesystem-safe munging. Folder names need identical behavior server-side. Move it to `util.mjs` for the browser, add a copy in the new backend module, and pin the two together with a table test.

**Files:**
- Modify: `web/js/util.mjs` (append)
- Modify: `web/js/export.mjs:57-58` (delete local copy, import instead)
- Create: `backend/sessions.mjs`
- Create: `backend/sessions.test.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: `slug(s: string) => string` exported from **both** `web/js/util.mjs` and `backend/sessions.mjs`. Strips `/ \ : * ? " < > |` and control characters, collapses whitespace runs to `-`, trims leading/trailing dots and dashes, caps at 80 chars. May return `''`.

- [ ] **Step 1: Write the failing test**

Create `backend/sessions.test.mjs`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node backend/sessions.test.mjs`
Expected: FAIL — `Cannot find module './sessions.mjs'`

- [ ] **Step 3: Write minimal implementation**

Create `backend/sessions.mjs`:

```js
/* Sessions on disk. One folder per session under workspace/runs/, holding the
   conversation, a snapshot of the model and settings, the rolling summary, and
   whatever files the AI wrote. The folder list IS the session list — there is no
   index to fall out of sync with the directory. */

/** Filesystem-safe name. Must stay identical to slug() in web/js/util.mjs;
    backend/sessions.test.mjs pins the two together. */
export const slug = s => String(s).replace(/[\/\\:*?"<>|\x00-\x1f]/g, '').replace(/\s+/g, '-')
                                  .replace(/^[.\-]+|[.\-]+$/g, '').slice(0, 80);
```

Append to `web/js/util.mjs`:

```js
/** Filesystem-safe name, for filenames and session folder names alike. Must stay
    identical to slug() in backend/sessions.mjs — backend/sessions.test.mjs pins them. */
export const slug = s => String(s).replace(/[\/\\:*?"<>|\x00-\x1f]/g, '').replace(/\s+/g, '-')
                                  .replace(/^[.\-]+|[.\-]+$/g, '').slice(0, 80);
```

In `web/js/export.mjs`, delete lines 55-58 (the comment and the local `const slug`) and add `slug` to the existing import on line 1:

```js
import { $, css, fmt, slug } from './util.mjs';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node backend/sessions.test.mjs`
Expected: PASS — prints `sessions slug ok`

Also confirm nothing that imported the old `slug` broke:
Run: `node web/js/oai.test.mjs && node web/js/util.test.mjs && node web/js/md.test.mjs`
Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add web/js/util.mjs web/js/export.mjs backend/sessions.mjs backend/sessions.test.mjs
git commit -m "Share one slug between the browser and the server

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Path containment

A session id is a user-typed project name turned into a path, and `delete` removes a directory tree. This is the one part of the feature that does not get the lazy treatment.

**Files:**
- Modify: `backend/sessions.mjs`
- Modify: `backend/sessions.test.mjs`

**Interfaces:**
- Consumes: `slug` from Task 1
- Produces: `sessionDir(runsRoot: string, id: string) => Promise<string>` — resolves to an absolute path strictly inside `runsRoot`, throws `Error` otherwise. Resolves symlinks before checking.

- [ ] **Step 1: Write the failing test**

Append to `backend/sessions.test.mjs`, before the final `console.log`:

```js
{
  const { mkdtemp, mkdir, symlink } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { sessionDir } = await import('./sessions.mjs');

  const base = await mkdtemp(join(tmpdir(), 'mca-'));
  const runs = join(base, 'runs');
  await mkdir(join(runs, 'ok'), { recursive: true });

  assert.equal(await sessionDir(runs, 'ok'), join(runs, 'ok'));

  // a folder that does not exist yet still resolves — save() creates it
  assert.equal(await sessionDir(runs, 'fresh'), join(runs, 'fresh'));

  const rejects = ['..', '../..', '../escape', '/etc', 'a/../../b', '', '...', './'];
  for (const bad of rejects)
    await assert.rejects(() => sessionDir(runs, bad), /outside|empty/i, 'must reject ' + JSON.stringify(bad));

  // a symlink inside runs/ that points out of it
  await mkdir(join(base, 'outside'), { recursive: true });
  await symlink(join(base, 'outside'), join(runs, 'sneaky'), 'dir');
  await assert.rejects(() => sessionDir(runs, 'sneaky'), /outside/i, 'must reject escaping symlink');
}

console.log('sessions containment ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node backend/sessions.test.mjs`
Expected: FAIL — `sessionDir is not a function`

- [ ] **Step 3: Write minimal implementation**

Append to `backend/sessions.mjs`:

```js
import { realpath } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

/* A session id is a folder name derived from something the user typed, and
   deleteSession() removes a tree. Resolve it and prove it is inside runs/ before
   anything touches the filesystem — including through a symlink, which resolve()
   alone does not see. */
export async function sessionDir(runsRoot, id) {
  const name = slug(id);
  if (!name) throw new Error('empty session name');
  const root = resolve(runsRoot);
  const dir = resolve(root, name);
  if (dir === root || !dir.startsWith(root + sep)) throw new Error('session path outside runs/');
  // an existing entry may be a symlink out of the tree; a missing one cannot be
  const real = await realpath(dir).catch(() => null);
  if (real && real !== dir && !real.startsWith(root + sep)) throw new Error('session path outside runs/');
  return dir;
}
```

Note: `slug('..')` already returns `''` (dots are trimmed), and `slug('a/../../b')` returns `'ab'`, so most traversal dies at the slug. The `startsWith` check is the belt to that suspenders — keep both.

- [ ] **Step 4: Run test to verify it passes**

Run: `node backend/sessions.test.mjs`
Expected: PASS — prints both `sessions slug ok` and `sessions containment ok`

- [ ] **Step 5: Commit**

```bash
git add backend/sessions.mjs backend/sessions.test.mjs
git commit -m "Prove a session path is inside runs/ before touching it

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: List and save sessions

**Files:**
- Modify: `backend/sessions.mjs`
- Modify: `backend/sessions.test.mjs`

**Interfaces:**
- Consumes: `sessionDir` from Task 2
- Produces:
  - `listSessions(runsRoot) => Promise<Array<{id, name, created, updated, turns}>>`, newest `updated` first. Folders without a readable `session.json` are skipped, not thrown on.
  - `saveSession(runsRoot, {id, name, chats, settings, model}) => Promise<{id}>` — creates the folder, writes `session.json`, `model.txt`, `settings.json`. When `slug(name)` differs from `id`, renames the folder first and returns the new id (with a `-2`, `-3`… suffix on collision).

- [ ] **Step 1: Write the failing test**

Append to `backend/sessions.test.mjs`, before the final `console.log`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node backend/sessions.test.mjs`
Expected: FAIL — `listSessions is not a function`

- [ ] **Step 3: Write minimal implementation**

Add to the imports at the top of `backend/sessions.mjs`:

```js
import { readFile, writeFile, mkdir, readdir, rename, stat } from 'node:fs/promises';
```

Append to `backend/sessions.mjs`:

```js
const META = 'session.json';
const readMeta = async dir => JSON.parse(await readFile(join(dir, META), 'utf8'));

export async function listSessions(runsRoot) {
  const entries = await readdir(runsRoot, { withFileTypes: true }).catch(() => []);
  const out = [];
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith('.')) continue;
    // a folder the AI made by hand, or one half-written: skip it rather than fail
    const m = await readMeta(join(runsRoot, e.name)).catch(() => null);
    if (!m) continue;
    out.push({ id: e.name, name: m.name ?? e.name, created: m.created ?? 0,
               updated: m.updated ?? 0, turns: (m.chats ?? []).reduce((n, c) => n + (c.log?.length ?? 0), 0) });
  }
  return out.sort((a, b) => b.updated - a.updated);
}

/** First free folder name for `want`, ignoring `keep` (the folder being renamed). */
async function freeId(runsRoot, want, keep) {
  for (let n = 1; n < 1000; n++) {
    const id = n === 1 ? want : `${want}-${n}`;
    if (id === keep) return id;
    if (!await stat(join(runsRoot, id)).catch(() => null)) return id;
  }
  throw new Error('too many sessions named ' + want);
}

export async function saveSession(runsRoot, { id, name, chats = [], settings = {}, model = '' }) {
  let dir = await sessionDir(runsRoot, id);
  const prev = await readMeta(dir).catch(() => null);

  // the project name is the folder name; a rename moves the folder with it
  const want = slug(name) || id;
  let finalId = id;
  if (want !== id) {
    finalId = await freeId(runsRoot, want, id);
    const target = await sessionDir(runsRoot, finalId);
    if (await stat(dir).catch(() => null)) await rename(dir, target);
    dir = target;
  }

  await mkdir(dir, { recursive: true });
  const now = Date.now();
  await writeFile(join(dir, META), JSON.stringify(
    { name, created: prev?.created ?? now, updated: now, chats }, null, 2));
  await writeFile(join(dir, 'model.txt'), model);
  await writeFile(join(dir, 'settings.json'), JSON.stringify(settings, null, 2));
  return { id: finalId };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node backend/sessions.test.mjs`
Expected: PASS — prints `sessions list/save ok` after the earlier lines

- [ ] **Step 5: Commit**

```bash
git add backend/sessions.mjs backend/sessions.test.mjs
git commit -m "List sessions from the directory, save one into its folder

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Open and delete sessions

**Files:**
- Modify: `backend/sessions.mjs`
- Modify: `backend/sessions.test.mjs`

**Interfaces:**
- Consumes: `sessionDir`, `saveSession` from Tasks 2-3
- Produces:
  - `openSession(runsRoot, id) => Promise<{id, name, chats, settings, model, summary}>` — reads the folder. Missing `model.txt`/`settings.json`/`summary.md` come back as `''`/`{}`/`''` rather than throwing.
  - `deleteSession(runsRoot, id) => Promise<void>` — removes that one folder recursively.

- [ ] **Step 1: Write the failing test**

Append to `backend/sessions.test.mjs`, before the final `console.log`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node backend/sessions.test.mjs`
Expected: FAIL — `openSession is not a function`

- [ ] **Step 3: Write minimal implementation**

Add `rm` to the `node:fs/promises` import in `backend/sessions.mjs`, then append:

```js
export const SUMMARY = 'summary.md';

export async function openSession(runsRoot, id) {
  const dir = await sessionDir(runsRoot, id);
  const m = await readMeta(dir);          // no session.json means no session: let it throw
  const read = (f, d) => readFile(join(dir, f), 'utf8').catch(() => d);
  const settings = await read('settings.json', '{}');
  return {
    id, name: m.name ?? id, chats: m.chats ?? [],
    model: await read('model.txt', ''),
    summary: await read(SUMMARY, ''),
    settings: (() => { try { return JSON.parse(settings); } catch { return {}; } })(),
  };
}

export async function deleteSession(runsRoot, id) {
  await rm(await sessionDir(runsRoot, id), { recursive: true, force: true });
}

export const readSummary = async dir => readFile(join(dir, SUMMARY), 'utf8').catch(() => '');
export const writeSummary = async (dir, text) => {
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, SUMMARY), text);
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node backend/sessions.test.mjs`
Expected: PASS — all four `ok` lines print

- [ ] **Step 5: Commit**

```bash
git add backend/sessions.mjs backend/sessions.test.mjs
git commit -m "Open a session back, delete one folder and only that folder

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Wire the four routes

**Files:**
- Modify: `backend/server.mjs:9-10` (imports), `backend/server.mjs:136` (routes table)
- Create: `backend/sessions-routes.test.mjs`

**Interfaces:**
- Consumes: `listSessions`, `saveSession`, `openSession`, `deleteSession` from Tasks 3-4
- Produces: HTTP routes `GET /api/sessions`, `POST /api/sessions/save`, `POST /api/sessions/open`, `POST /api/sessions/delete`. Each refuses with 400 when `HOSTED`. `open` copies the snapshot into `workspace/model.txt` and `workspace/settings.json`.

- [ ] **Step 1: Write the failing test**

Create `backend/sessions-routes.test.mjs`:

```js
/* node backend/sessions-routes.test.mjs
   Boots the real server on a spare port against the real workspace, exercises the
   four session routes over HTTP, then puts the workspace back exactly as it was. */
import assert from 'node:assert/strict';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORK = join(ROOT, 'workspace');
const PORT = 5199;
const url = p => `http://127.0.0.1:${PORT}${p}`;
const post = (p, b) => fetch(url(p), { method: 'POST', headers: { 'content-type': 'application/json' },
                                       body: JSON.stringify(b) }).then(r => r.json());

const beforeModel = await readFile(join(WORK, 'model.txt'), 'utf8').catch(() => '');
const beforeSettings = await readFile(join(WORK, 'settings.json'), 'utf8').catch(() => '');

const srv = spawn('node', [join(ROOT, 'backend/server.mjs')],
                  { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
const up = async () => { for (let i = 0; i < 60; i++) {
  if (await fetch(url('/api/health')).then(() => true).catch(() => false)) return;
  await new Promise(r => setTimeout(r, 150)); } throw new Error('server never came up'); };

try {
  await up();

  await post('/api/sessions/save', { id: 'test-abc', name: 'Test ABC',
    chats: [{ id: 1, title: 'hello', log: [], history: [] }],
    settings: { start: 0, end: 7, points: 11 }, model: 'A -> B; k*A' });

  const list = await fetch(url('/api/sessions')).then(r => r.json());
  assert.ok(list.sessions.some(s => s.id === 'test-abc'), 'saved session is listed');

  // the live model moves on, then opening the session brings the snapshot back
  await fetch(url('/api/model'), { method: 'PUT', headers: { 'content-type': 'application/json' },
                                   body: JSON.stringify({ src: 'something else entirely' }) });
  const opened = await post('/api/sessions/open', { id: 'test-abc' });
  assert.equal(opened.model, 'A -> B; k*A');
  assert.equal(opened.settings.points, 11);
  assert.equal(opened.chats[0].title, 'hello');
  assert.equal(await readFile(join(WORK, 'model.txt'), 'utf8'), 'A -> B; k*A',
               'open copies the snapshot into the live model');

  const bad = await post('/api/sessions/delete', { id: '../..' });
  assert.ok(bad.error, 'traversal is refused');

  await post('/api/sessions/delete', { id: 'test-abc' });
  const after = await fetch(url('/api/sessions')).then(r => r.json());
  assert.ok(!after.sessions.some(s => s.id === 'test-abc'), 'deleted session is gone');
} finally {
  srv.kill();
  await rm(join(WORK, 'runs/test-abc'), { recursive: true, force: true });
  if (beforeModel) await writeFile(join(WORK, 'model.txt'), beforeModel);
  if (beforeSettings) await writeFile(join(WORK, 'settings.json'), beforeSettings);
}

console.log('session routes ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node backend/sessions-routes.test.mjs`
Expected: FAIL — `list.sessions` is undefined (route returns 404 JSON)

- [ ] **Step 3: Write minimal implementation**

In `backend/server.mjs`, add after line 10:

```js
import { listSessions, saveSession, openSession, deleteSession } from './sessions.mjs';
```

Add these four entries to the `routes` object (`backend/server.mjs:136`), after `'POST /api/scratch'`:

```js
  /* Sessions. One folder each under workspace/runs/; the directory listing is the
     session list. Hosted deployments have no local folder to keep them in. */
  'GET /api/sessions': async (req, res) => {
    if (HOSTED) return json(res, 400, { error: 'sessions are local-only' });
    await ensureWorkspace();
    json(res, 200, { sessions: await listSessions(RUNS) });
  },

  'POST /api/sessions/save': async (req, res) => {
    if (HOSTED) return json(res, 400, { error: 'sessions are local-only' });
    const { id, name, chats, settings, model } = await body(req);
    if (!id) return json(res, 400, { error: 'id is required' });
    await ensureWorkspace();
    try { json(res, 200, await saveSession(RUNS, { id, name, chats, settings, model })); }
    catch (e) { json(res, 400, { error: String(e.message || e) }); }
  },

  'POST /api/sessions/open': async (req, res) => {
    if (HOSTED) return json(res, 400, { error: 'sessions are local-only' });
    const { id } = await body(req);
    await ensureWorkspace();
    let s;
    try { s = await openSession(RUNS, id); }
    catch (e) { return json(res, 400, { error: String(e.message || e) }); }
    // the snapshot becomes the live model the agent reads and the editor shows
    if (s.model) await writeFile(MODEL_FILE, s.model);
    if (s.settings && Object.keys(s.settings).length)
      await writeFile(SETTINGS_FILE, JSON.stringify(s.settings, null, 2));
    json(res, 200, { ...s, version: await modelVersion() });
  },

  'POST /api/sessions/delete': async (req, res) => {
    if (HOSTED) return json(res, 400, { error: 'sessions are local-only' });
    const { id } = await body(req);
    try { await deleteSession(RUNS, id); json(res, 200, { ok: true }); }
    catch (e) { json(res, 400, { error: String(e.message || e) }); }
  },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node backend/sessions-routes.test.mjs`
Expected: PASS — prints `session routes ok`

- [ ] **Step 5: Commit**

```bash
git add backend/server.mjs backend/sessions-routes.test.mjs
git commit -m "Four routes for sessions, refused on hosted

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Fix the Claude resume bug

`STARTED` in `backend/agent.mjs:86` is an in-memory `Set`. After a server restart, resuming a Claude session takes the `--session-id` branch with a UUID the CLI has already claimed, and the turn fails. Loading a session from disk makes this reachable in ordinary use.

The argument list is built inline inside `runAgent`, which spawns a process — untestable as written. Extract the pure part first.

**Files:**
- Modify: `backend/agent.mjs:86-125`
- Create: `backend/agent-args.test.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: `buildArgs({root, prompt, sid, resuming, model, useWorkflow, liveModel, scratch, summary}) => string[]`, exported from `backend/agent.mjs`. `runAgent` gains a `resume: boolean` option meaning "this id came from disk, trust it".

- [ ] **Step 1: Write the failing test**

Create `backend/agent-args.test.mjs`:

```js
/* node backend/agent-args.test.mjs */
import assert from 'node:assert/strict';
import { buildArgs } from './agent.mjs';

const base = { root: '/tmp/app', prompt: 'hi', sid: 'abc-123', model: '',
               useWorkflow: true, liveModel: '', scratch: '', summary: '' };

{
  const fresh = buildArgs({ ...base, resuming: false });
  assert.ok(fresh.includes('--session-id'), 'a new session claims its id');
  assert.ok(!fresh.includes('--resume'));
}

{
  const again = buildArgs({ ...base, resuming: true });
  assert.ok(again.includes('--resume'), 'a known session resumes');
  assert.ok(!again.includes('--session-id'), 'an id may only be claimed once');
  assert.equal(again[again.indexOf('--resume') + 1], 'abc-123');
}

{
  // the rolling summary must reach the model without needing a tool call
  const withSummary = buildArgs({ ...base, resuming: true, summary: 'Step 3 holds the control.' });
  const appended = withSummary[withSummary.indexOf('--append-system-prompt') + 1];
  assert.match(appended, /Step 3 holds the control\./);
}

{
  const none = buildArgs({ ...base, resuming: false, summary: '' });
  const appended = none[none.indexOf('--append-system-prompt') + 1];
  assert.doesNotMatch(appended, /earlier in this session/i, 'no empty summary block');
}

console.log('agent args ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node backend/agent-args.test.mjs`
Expected: FAIL — `buildArgs is not a function`

- [ ] **Step 3: Write minimal implementation**

In `backend/agent.mjs`, add a summary block next to the existing `scratchBlock` (around line 80):

```js
/* The rolling memory of everything older than the last twelve messages. Inlined
   rather than pointed at: a model that has to call a tool to find its own memory
   is a model that will sometimes not bother. */
export const summaryBlock = text => !text?.trim() ? '' : `

## What happened earlier in this session

This is your own compressed record of the turns before the ones you can see.
Treat it as established, and do not re-derive it.

${text.trim()}
`;
```

Replace the body of `runAgent` (`backend/agent.mjs:90-125`) so the argument list is a separate, pure function:

```js
export function buildArgs({ root, prompt, sid, resuming, model, useWorkflow = true,
                            liveModel = '', scratch = '', summary = '' }) {
  const args = [
    '-p', prompt,
    '--agent', AGENT,
    '--output-format', 'stream-json',
    '--verbose',
    '--include-partial-messages',
    '--forward-subagent-text',            // surface the workflow subagents' reasoning too
    // A session id may only be *claimed* once; continuing one is --resume.
    ...(resuming ? ['--resume', sid] : ['--session-id', sid]),
    '--setting-sources', 'project',
    '--permission-mode', 'acceptEdits',
    '--permission-prompts', 'none',
    // Narrow, not bypassed: the agent may run the project's own venv python and
    // read/edit files in the project, and nothing else. Widen only deliberately.
    '--allowedTools',
    'Skill', ...(useWorkflow ? ['Workflow'] : []), 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'TodoWrite',
    'Bash(./.venv/bin/python:*)', 'Bash(.venv/bin/python:*)', 'Bash(cat:*)', 'Bash(ls:*)',
    // The agent writes scripts to the working folder by absolute path, so it runs the
    // venv by absolute path too — often after a `cd`. A plain absolute-path rule never
    // matches (the path is quoted: spaces, parentheses); the leading * does.
    `Bash(*${root}/.venv/bin/python*)`,
    '--append-system-prompt', SYSTEM_APPEND + (scratch ? scratchBlock(scratch) : '') +
                              liveModelBlock(liveModel) + summaryBlock(summary) +
                              (useWorkflow ? '' : '\n\n' + NO_WORKFLOW),
    '--settings', JSON.stringify({ enableWorkflows: useWorkflow }),
    '--add-dir', root,
    ...(scratch && !scratch.startsWith(root) ? ['--add-dir', scratch] : []),
  ];
  if (model) args.push('--model', model);
  return args;
}

export function runAgent({ root, prompt, sessionId, model, env = {}, useWorkflow = true,
                          liveModel = '', scratch = '', summary = '', resume = false, onEvent }) {
  /* STARTED only knows about this process's own runs. A session loaded from disk
     was claimed by an earlier run of this server, so the caller says so with
     `resume` — without it the CLI is handed an id it has already claimed and the
     turn dies on a restart. */
  const resuming = !!sessionId && (resume || STARTED.has(sessionId));
  const sid = resuming ? sessionId : randomUUID();
  STARTED.add(sid);
  const args = buildArgs({ root, prompt, sid, resuming, model, useWorkflow,
                           liveModel, scratch, summary });

  const proc = spawn('claude', args, {
```

The rest of `runAgent` — from `cwd: root,` onward — is unchanged.

- [ ] **Step 4: Run test to verify it passes**

Run: `node backend/agent-args.test.mjs`
Expected: PASS — prints `agent args ok`

- [ ] **Step 5: Commit**

```bash
git add backend/agent.mjs backend/agent-args.test.mjs
git commit -m "Resume a session the CLI already claimed in an earlier run

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Compaction — the pure half

The loop: 12 messages → summarise → summary + next 12 → re-summarise. Split the decision (pure, tested here) from the model call (Task 8).

**Files:**
- Modify: `backend/sessions.mjs`
- Modify: `backend/sessions.test.mjs`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `splitHistory(history, keep = 12) => {fold, recent}` — `fold` is everything beyond the newest `keep`, `recent` is the newest `keep`. When `history.length <= keep`, `fold` is `[]`.
  - `summaryPrompt(prevSummary, fold) => Array<{role, content}>` — the messages that ask a model to fold `fold` into `prevSummary`.

- [ ] **Step 1: Write the failing test**

Append to `backend/sessions.test.mjs`, before the final `console.log`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node backend/sessions.test.mjs`
Expected: FAIL — `splitHistory is not a function`

- [ ] **Step 3: Write minimal implementation**

Append to `backend/sessions.mjs`:

```js
export const KEEP = 12;

/** Newest `keep` messages stay; everything older is what gets folded into the summary. */
export function splitHistory(history, keep = KEEP) {
  const h = history ?? [];
  if (h.length <= keep) return { fold: [], recent: h.slice() };
  return { fold: h.slice(0, h.length - keep), recent: h.slice(h.length - keep) };
}

/* Carrying the previous summary back in is the whole point: each pass compresses
   summary + the next batch into one summary, so memory of turn 1 survives turn 90
   instead of falling off the end. */
export function summaryPrompt(prevSummary, fold) {
  const transcript = (fold ?? []).map(m => `${m.role}: ${m.content}`).join('\n\n');
  return [
    { role: 'system', content:
      'You compress the memory of a computational-biology modelling session. Write ' +
      'notes to your future self: what the model is, what was asked, what was computed ' +
      'and what the numbers were. Keep every quantitative result and every decision ' +
      'about the model. Drop pleasantries and restatements. Prose or bullets, under ' +
      '400 words, no preamble — output the notes themselves.' },
    { role: 'user', content:
      (prevSummary?.trim()
        ? 'Notes so far:\n\n' + prevSummary.trim() + '\n\n---\n\nNewer turns to fold in:\n\n'
        : 'Turns to summarise:\n\n') + transcript },
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node backend/sessions.test.mjs`
Expected: PASS — five `ok` lines

- [ ] **Step 5: Commit**

```bash
git add backend/sessions.mjs backend/sessions.test.mjs
git commit -m "Decide what to compress, separately from asking a model to do it

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Compaction — the model call, and both runtimes reading `summary.md`

**Files:**
- Modify: `backend/server.mjs` (the `POST /api/chat` handler, `backend/server.mjs:254-302`)
- Modify: `backend/local-agent.mjs` (accept and inject `summary`)
- Modify: `web/js/prompt.mjs:105` (`localSystem` already takes `extra`; confirm it reaches the system message)
- Modify: `backend/sessions-routes.test.mjs`

**Interfaces:**
- Consumes: `splitHistory`, `summaryPrompt`, `readSummary`, `writeSummary` from Tasks 4 and 7; `runAgent({summary})` from Task 6
- Produces: `POST /api/chat` accepts `sessionId` naming a *session folder* via a new `sessionDirId` field, reads `summary.md` before the turn, injects it into whichever runtime runs, and after the turn compacts when `history.length > 12`, rewriting `summary.md`. Emits SSE `{type:'compacted', summary}` so the page can show it.

- [ ] **Step 1: Write the failing test**

Append to `backend/sessions-routes.test.mjs`, inside the `try` block before the delete assertions:

```js
  // summary.md is read back by openSession, so a compacted session carries memory
  {
    const { writeSummary, splitHistory } = await import('./sessions.mjs');
    await writeSummary(join(WORK, 'runs/test-abc'), 'Step 3 holds the control.');
    const reopened = await post('/api/sessions/open', { id: 'test-abc' });
    assert.match(reopened.summary, /Step 3 holds the control\./,
                 'open returns the rolling summary');
    assert.equal(splitHistory(Array.from({ length: 13 }, () => ({ role: 'user', content: 'x' })))
                   .recent.length, 12);
  }
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node backend/sessions-routes.test.mjs`
Expected: FAIL — `reopened.summary` is `undefined` if Task 4 is not in place; if it is, this passes and the remaining work is the injection below, verified in Step 4 by hand.

- [ ] **Step 3: Write minimal implementation**

In `backend/server.mjs`, extend the imports added in Task 5:

```js
import { listSessions, saveSession, openSession, deleteSession,
         sessionDir, readSummary, writeSummary, splitHistory, summaryPrompt } from './sessions.mjs';
```

In the `POST /api/chat` handler, destructure the new field (`backend/server.mjs:255`):

```js
    const { message, sessionId, sessionDirId, model, env, runtime, chatCfg, history,
            scratchDir, useWorkflow = true, resume = false } = await body(req);
```

After `const before = await readFile(MODEL_FILE, 'utf8').catch(()=> '');` add:

```js
    // The session's own folder is where its memory and its scratch both live.
    let sdir = null;
    if (sessionDirId) sdir = await sessionDir(RUNS, sessionDirId).catch(() => null);
    const summary = sdir ? await readSummary(sdir) : '';
    if (sdir) { await mkdir(sdir, { recursive: true }); scratch = sdir; }
```

Change `let scratch;` to `let scratch = RUNS;` so the assignment above is legal, and leave the existing `resolveScratch` block as the fallback when `sessionDirId` is absent.

Pass `summary` into both runtimes:

```js
    const run = runtime === 'openai'
      ? runLocalAgent({ root: ROOT, prompt: message, history: history || [], chatCfg,
                        useWorkflow, liveModel: before, te, scratch, summary, onEvent })
      : runAgent({ root: ROOT, prompt: message, sessionId, model, env: env || {},
                   useWorkflow, liveModel: before, scratch, summary, resume, onEvent });
```

Compact inside `onEvent`, in the `raw.type === 'done'` branch, before `res.end()`:

```js
        if (raw.type === 'done') {
          // compare content, not mtime — the editor autosaves during a turn
          const after = await readFile(MODEL_FILE, 'utf8').catch(()=> '');
          if (after !== before) send({ type: 'model_changed', src: after, version: await modelVersion() });

          /* Roll the memory forward: anything past the newest twelve messages is
             folded into summary.md by whichever model the user is already using, so
             turn 1 still exists at turn 90. One cheap call per twelve turns. */
          if (sdir && runtime === 'openai' && (history?.length ?? 0) > 12) {
            const { fold } = splitHistory(history);
            if (fold.length) try {
              const { Chat } = await import('./local-agent.mjs');
              const chat = new Chat(chatCfg);
              const msg = await chat.complete({ messages: summaryPrompt(summary, fold),
                                                maxTokens: 900 });
              if (msg.content?.trim()) {
                await writeSummary(sdir, msg.content.trim());
                send({ type: 'compacted', summary: msg.content.trim() });
              }
            } catch (e) { console.error('[compact]', e.message); }  // never fail the turn
          }

          clearInterval(ka);
          if (!res.writableEnded) res.end();
        }
```

In `backend/local-agent.mjs`, thread `summary` through `runLocalAgent` into the system prompt. Find the `localSystem({...})` call and add the summary to its `extra`:

```js
export function runLocalAgent({ root, prompt, history = [], chatCfg, useWorkflow = true,
                                liveModel = '', te, scratch, summary = '', onEvent }) {
```

and where `localSystem` is built:

```js
  const memory = !summary.trim() ? '' : [
    '', '## What happened earlier in this session', '',
    'Your own compressed record of the turns before the ones you can see.',
    'Treat it as established; do not re-derive it.', '', summary.trim(), '',
  ].join('\n');
  // ...then append `memory` to whatever string is already passed as `extra`
```

Verify `Chat` is exported from `backend/local-agent.mjs` — it is declared `export class Chat` at line 19, so the dynamic import above resolves.

- [ ] **Step 4: Run tests and verify by hand**

Run: `node backend/sessions.test.mjs && node backend/sessions-routes.test.mjs && node backend/local-agent.test.mjs && node backend/agent-args.test.mjs`
Expected: all PASS

Then verify injection end to end, since no unit test covers a live model:

```bash
./run.sh
```

Open `http://127.0.0.1:5173`, pick a local model, send 14 short messages in one chat, then confirm:

```bash
cat "workspace/runs/$(ls -t workspace/runs | head -1)/summary.md"
```

Expected: a paragraph of notes about the conversation, not an empty file.

- [ ] **Step 5: Commit**

```bash
git add backend/server.mjs backend/local-agent.mjs backend/sessions-routes.test.mjs
git commit -m "One summary file, folded forward every twelve turns, read by both runtimes

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Client session state

**Files:**
- Create: `web/js/session.mjs`
- Modify: `web/js/chat.mjs` (export chat state, accept restored chats)
- Modify: `web/js/state.mjs` (add `sessionDirId`)

**Interfaces:**
- Consumes: the four routes from Task 5
- Produces:
  - `web/js/session.mjs` exports `listSessions()`, `saveNow()`, `openSessionById(id)`, `deleteCurrent()`, `currentId()`, `setProjectNameGetter(fn)`, `saveSoon()`.
  - `web/js/chat.mjs` exports `dumpChats() => Array`, `loadChats(arr)`, `currentSummary()`, `setSummary(text)`.
  - `S.sessionDirId` holds the folder id of the live session, or `null` before the folder exists.

- [ ] **Step 1: Write the failing test**

Create `web/js/session.test.mjs`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node web/js/session.test.mjs`
Expected: FAIL — `Cannot find module './session.mjs'`

- [ ] **Step 3: Write minimal implementation**

Add to `web/js/state.mjs` inside `S`:

```js
  sessionDirId: null,    // folder under workspace/runs for this session, once it exists
```

Create `web/js/session.mjs`:

```js
import { S } from './state.mjs';
import { slug } from './util.mjs';

/* A session is a folder under workspace/runs/. The folder is created lazily — on
   the first save, not on page load — so refreshing the page does not litter runs/
   with empty dated folders. */

const DEFAULT_NAME = 'Untitled project';

/** Folder name for a project: its slug, or today's date while it is still unnamed. */
export function defaultId(projectName, now = new Date()) {
  const s = slug(projectName ?? '');
  if (!s || s === slug(DEFAULT_NAME)) {
    const p = n => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
  }
  return s;
}

const post = (path, body) => fetch(path, { method: 'POST',
  headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

export const listSessions = () => fetch('/api/sessions').then(r => r.json())
  .then(r => r.sessions ?? []).catch(() => []);

let getName = () => DEFAULT_NAME, getModel = () => '', getSettings = () => ({}),
    getChats = () => [], setAll = () => {};

/** Wire the module to the page once, at boot, rather than importing main.mjs back. */
export function initSession(hooks) { ({ getName, getModel, getSettings, getChats, setAll } = hooks); }

export const currentId = () => S.sessionDirId;

export async function saveNow() {
  if (S.env?.hosted) return null;
  const id = S.sessionDirId ?? defaultId(getName());
  const r = await post('/api/sessions/save', { id, name: getName(), chats: getChats(),
                                               settings: getSettings(), model: getModel() });
  if (r.id) S.sessionDirId = r.id;      // a rename comes back with the new folder name
  return r;
}

/* Autosave is debounced, and deferred while a turn is running: renaming the folder
   out from under a running agent breaks the absolute paths it is holding. */
let t = null, busy = false, pending = false;
export function saveSoon() {
  clearTimeout(t);
  t = setTimeout(() => { if (busy) { pending = true; return; } saveNow(); }, 800);
}
export function setTurnBusy(on) {
  busy = on;
  if (!on && pending) { pending = false; saveNow(); }
}

export async function openSessionById(id) {
  const r = await post('/api/sessions/open', { id });
  if (r.error) throw new Error(r.error);
  S.sessionDirId = r.id ?? id;
  setAll(r);                            // editor, settings, chats, project name
  return r;
}

export async function deleteCurrent() {
  const id = S.sessionDirId;
  if (!id) return { ok: true };
  const r = await post('/api/sessions/delete', { id });
  if (!r.error) S.sessionDirId = null;
  return r;
}
```

In `web/js/chat.mjs`, expose the conversation array. Add after `const cur = () => chats.find(c => c.id === active);` (line 26):

```js
/* Sessions persist conversations to disk, so the array stops being private to this
   module. `thread` is a live DOM node and never travels; everything else does. */
export const dumpChats = () => chats.map(({ id, title, history, sessionId, log, summary }) =>
  ({ id, title, history, sessionId, log, summary }));

export function loadChats(saved){
  chats.forEach(c => c.thread.remove());
  chats.length = 0; active = null;
  for(const s of saved ?? []){
    const thread = document.createElement('div');
    thread.className = 'thread';
    $('#msgs').append(thread);
    chats.push({ ...s, thread });
    seq = Math.max(seq, s.id ?? 0);
    for(const turn of s.log ?? []){
      const d = document.createElement('div'); d.className = 'msg me';
      d.textContent = turn.q; thread.append(d);
      const a = document.createElement('div'); a.className = 'msg ai';
      a.innerHTML = renderMarkdown(turn.a || '*(no answer)*'); thread.append(a);
    }
  }
  if(!chats.length) makeChat(); else show(chats.at(-1).id);
}
```

Also, in `send()`, pass the session folder and mark the turn busy. Change the `api.chat` call (line 258):

```js
    abort = api.chat({ message: v, sessionId: c.sessionId, history: c.history,
                       sessionDirId: currentId(), resume: !!c.sessionId,
                       ...rt, scratchDir: scratchDir(), useWorkflow: useWorkflow() }, handle);
```

and handle the new event in `handle`, next to the other `ev.type` branches:

```js
      if(ev.type==='compacted'){ c.summary = ev.summary; return; }
```

Add the imports `import { currentId, saveSoon, setTurnBusy } from './session.mjs';` at the top of `chat.mjs`, call `setTurnBusy(true)` where `$('#send').textContent='Stop';` happens, and `setTurnBusy(false); saveSoon();` in the `done`/`closed` branch alongside `abort=null`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node web/js/session.test.mjs`
Expected: PASS — prints `session id ok`

- [ ] **Step 5: Commit**

```bash
git add web/js/session.mjs web/js/session.test.mjs web/js/chat.mjs web/js/state.mjs
git commit -m "Conversations leave this tab: dump, restore, and autosave a session

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: The session picker

A re-skin of `.fp` (`web/app.css:321`) — already a centered box with `border-radius:14px` and a scrolling list. The only new CSS is the search row.

**Files:**
- Create: `web/js/sessionpicker.mjs`
- Modify: `web/app.css` (append)

**Interfaces:**
- Consumes: `listSessions()` from Task 9
- Produces: `pickSession() => Promise<string|null>` — resolves to a session id, or `null` if cancelled. Most recent row is selected when it opens.

- [ ] **Step 1: Write the failing test**

This is DOM-only glue with no branching logic worth a harness; the filter predicate is the one exception. Create `web/js/sessionpicker.test.mjs`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node web/js/sessionpicker.test.mjs`
Expected: FAIL — `Cannot find module './sessionpicker.mjs'`

- [ ] **Step 3: Write minimal implementation**

Create `web/js/sessionpicker.mjs`:

```js
import { $ } from './util.mjs';
import { listSessions } from './session.mjs';

/* The file picker's box, relabelled: same centered card, same scrolling list, a
   search field where the path row was. Reusing .fp means no second modal to keep
   in visual sync with the first. */

let resolveFn = null, rows = [], picked = null;

/** Name or id, case-insensitively. Exported so it can be tested without a DOM. */
export const matches = (s, q) => {
  const n = String(q ?? '').trim().toLowerCase();
  return !n || String(s.name ?? '').toLowerCase().includes(n)
            || String(s.id ?? '').toLowerCase().includes(n);
};

function ensureDom(){
  if($('#sp')) return;
  const d = document.createElement('div');
  d.id = 'sp'; d.className = 'fp'; d.setAttribute('role','dialog');
  d.setAttribute('aria-label','Open a session');
  d.innerHTML = `
    <div class="fp-hd">
      <strong>Open a session</strong>
      <span class="sp" style="flex:1"></span>
      <button class="btn icon ghost sm" id="spClose" aria-label="Cancel">✕</button>
    </div>
    <div class="fp-path"><input id="spQ" class="sp-q" type="search" placeholder="Search sessions…"
      autocomplete="off" spellcheck="false" aria-label="Search sessions"></div>
    <div class="fp-list" id="spList" tabindex="0"></div>
    <div class="fp-ft">
      <code id="spSel" class="hint"></code>
      <span class="sp" style="flex:1"></span>
      <button class="btn sm" id="spCancel">Cancel</button>
      <button class="btn sm primary" id="spOk" disabled>Open</button>
    </div>`;
  document.body.append(d);
  $('#spClose').onclick = $('#spCancel').onclick = () => close(null);
  $('#spOk').onclick = () => close(picked);
  $('#spQ').oninput = render;
}

function close(v){
  $('#sp')?.classList.remove('on');
  $('#scrim').classList.remove('on');
  const f = resolveFn; resolveFn = null; picked = null;
  f?.(v);
}

const when = ms => !ms ? '' : new Date(ms).toLocaleString();

function render(){
  const L = $('#spList'); L.textContent = '';
  const shown = rows.filter(r => matches(r, $('#spQ').value));
  if(!shown.length){
    L.innerHTML = '<p class="hint" style="padding:12px">No sessions'+
                  ($('#spQ').value.trim() ? ' matching that.' : ' yet.')+'</p>';
    $('#spOk').disabled = true; return;
  }
  shown.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'fp-row'; b.type = 'button';
    b.innerHTML = '<span class="fp-ic">🗂</span><span class="fp-nm"></span>'+
                  '<span class="sp" style="flex:1"></span><span class="hint sp-when"></span>';
    b.querySelector('.fp-nm').textContent = s.name || s.id;
    b.querySelector('.sp-when').textContent = when(s.updated);
    const choose = () => {
      [...L.children].forEach(c => c.classList.remove('sel'));
      b.classList.add('sel'); picked = s.id;
      $('#spSel').textContent = s.id; $('#spOk').disabled = false;
    };
    b.onclick = choose;
    b.ondblclick = () => { choose(); close(picked); };
    L.append(b);
    if(i === 0) choose();               // the list is newest-first, so this is the most recent
  });
}

/** pickSession() → a session id, or null if cancelled. */
export async function pickSession(){
  ensureDom();
  $('#spQ').value = '';
  $('#sp').classList.add('on');
  $('#scrim').classList.add('on');
  rows = await listSessions();
  render();
  setTimeout(() => $('#spQ').focus(), 60);
  return new Promise(r => { resolveFn = r; });
}
```

Append to `web/app.css`:

```css
/* --- session picker: the file picker's box with a search row --- */
.sp-q{flex:1;background:var(--bg);color:var(--ink);border:1px solid var(--border);
  border-radius:7px;padding:6px 9px;font:13px inherit;outline:none}
.sp-q:focus{box-shadow:0 0 0 2px var(--accent);border-color:transparent}
.sp-when{font-size:11px;color:var(--muted);flex:none;font-variant-numeric:tabular-nums}
.fp-row.sel .sp-when{color:var(--accent-ink);opacity:.8}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node web/js/sessionpicker.test.mjs`
Expected: PASS — prints `session picker filter ok`

- [ ] **Step 5: Commit**

```bash
git add web/js/sessionpicker.mjs web/js/sessionpicker.test.mjs web/app.css
git commit -m "A session picker, wearing the file picker's clothes

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11: The buttons, and the rename rule

**Files:**
- Modify: `web/index.html:200-209` (chat header)
- Modify: `web/app.css` (append — the red button)
- Modify: `web/js/main.mjs` (boot wiring, `setAll` hook, rename triggers a save)
- Modify: `web/js/chat.mjs` (`initChat` binds the two buttons)

**Interfaces:**
- Consumes: everything from Tasks 9-10
- Produces: `#openSession` and `#delSession` in the chat header, both hidden when `S.env.hosted`.

- [ ] **Step 1: Write the failing test**

There is no DOM harness in this project, so this task's gate is the end-to-end check in Step 4. Before writing code, add the regression that *can* be tested — that a rename produces a new folder id and the old one stops existing. Append to `backend/sessions.test.mjs` before the final `console.log`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node backend/sessions.test.mjs`
Expected: PASS if Task 3 is complete (this pins existing behaviour against regression from the wiring below). If it fails, Task 3 is incomplete — fix that first.

- [ ] **Step 3: Write minimal implementation**

In `web/index.html`, add two buttons in the chat header after `#newChat` (line 203):

```html
    <button class="btn icon ghost sm" id="openSession" aria-label="Open a saved session"
            title="Open a saved session">🗂</button>
    <button class="btn icon sm danger" id="delSession" aria-label="Delete this session"
            title="Delete this session and its folder">🗑</button>
```

Append to `web/app.css`:

```css
/* the only irreversible control in the app; it should look like one */
.btn.danger{background:var(--crit);color:#fff;border-color:transparent}
.btn.danger:hover{filter:brightness(1.08)}
```

In `web/js/chat.mjs`, inside `initChat()`:

```js
  $('#openSession').onclick = async () => {
    const id = await pickSession();
    if(!id) return;
    try { await openSessionById(id); }
    catch(e){ alert('Could not open that session: ' + e.message); }
  };
  $('#delSession').onclick = async () => {
    const id = currentId();
    if(!id) return flash($('#delSession'), '—');
    if(!confirm('Delete this session?\n\nThis removes workspace/runs/' + id +
                ' and everything in it — the conversation, the model snapshot and every '+
                'file the AI wrote. This cannot be undone.')) return;
    const r = await deleteCurrent();
    if(r.error) return alert('Could not delete: ' + r.error);
    loadChats([]);
  };
```

with the imports `import { pickSession } from './sessionpicker.mjs';` and `import { openSessionById, deleteCurrent, currentId, saveNow } from './session.mjs';`.

In `web/js/main.mjs`, wire the hooks in `boot()` after `initChat()`:

```js
  initSession({
    getName: projName,
    getModel: () => editor.value,
    getSettings: cfg,
    getChats: dumpChats,
    setAll: s => {
      setProjName(s.name, true);
      if(s.model) editor.value = s.model;
      if(s.settings?.points){ $('#tStart').value = s.settings.start ?? 0;
                              $('#tEnd').value = s.settings.end ?? 100;
                              $('#nPts').value = s.settings.points; }
      loadChats(s.chats);
      S.view = null; run();
    },
  });
```

and make a rename save (so the folder follows the name). In the `blur` handler (`web/js/main.mjs:124`):

```js
proj.addEventListener('blur', ()=>{ setProjName(projName()); saveSoon(); });
```

Hide both buttons on hosted, in the `api.getEnv().then(...)` block (`web/js/main.mjs:248`):

```js
    if(e.hosted) ['#openSession','#delSession'].forEach(s => $(s).hidden = true);
```

Add the imports `import { initSession, saveSoon } from './session.mjs';` and extend the chat import to `import { initChat, toggleChat, setOnModelChanged, offerScratchSetup, dumpChats, loadChats } from './chat.mjs';`.

- [ ] **Step 4: Run the full suite, then verify end to end**

Run every test:

```bash
for f in backend/*.test.mjs web/js/*.test.mjs; do echo "── $f"; node "$f" || exit 1; done
```

Expected: every file prints its `ok` line, exit 0.

Then the real thing:

```bash
./run.sh
```

At `http://127.0.0.1:5173`, walk the whole feature and confirm each:

1. Click "Untitled project", type `Glycolysis v2`, press Enter. Ask the AI one question.
2. `ls workspace/runs/` → a single `Glycolysis-v2` folder, no `2026-09-20` left behind.
3. `ls workspace/runs/Glycolysis-v2/` → `session.json`, `model.txt`, `settings.json`, plus whatever the AI wrote.
4. Reload the page, click 🗂 → the session is listed and preselected. Open it → the model, the settings and the conversation all come back.
5. Rename to `TCA cycle`, wait a second → the folder is now `TCA-cycle`, the old name is gone.
6. Click 🗑, confirm → `ls workspace/runs/` shows the folder gone and no sibling touched.

- [ ] **Step 5: Commit**

```bash
git add web/index.html web/app.css web/js/main.mjs web/js/chat.mjs backend/sessions.test.mjs
git commit -m "Open and delete a session from the chat header

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
|---|---|
| Disk layout | 3, 4 |
| Session id, collisions, lazy creation | 3, 9 |
| `slug()` shared | 1 |
| Four routes | 5 |
| Containment | 2, verified again in 5 |
| Rolling summary (file, both runtimes, who writes it) | 7, 8 |
| Rename renames the folder | 3, 11 |
| Rename deferred during a turn | 9 (`setTurnBusy`) |
| `STARTED` resume bug | 6 |
| Session picker | 10 |
| Delete / Open buttons, hidden on hosted | 11 |
| Tests: containment, slug agreement, compaction, round trip | 2, 1, 7, 5 |

No spec requirement is unclaimed.

**Type consistency:** `slug`, `sessionDir`, `listSessions`, `saveSession`, `openSession`, `deleteSession`, `readSummary`, `writeSummary`, `splitHistory`, `summaryPrompt`, `KEEP` all originate in `backend/sessions.mjs` and keep those names everywhere. Client side: `defaultId`, `initSession`, `saveNow`, `saveSoon`, `setTurnBusy`, `openSessionById`, `deleteCurrent`, `currentId`, `listSessions`, plus `dumpChats`/`loadChats` in `chat.mjs` and `matches`/`pickSession` in `sessionpicker.mjs`. Session id is a string everywhere; `settings` is `{start, end, points}` everywhere.

**Known seam:** Task 8 compacts only on the `runtime === 'openai'` path. The Claude path *reads* `summary.md` (Task 6, `summaryBlock`) but relies on `--resume` for within-machine memory and so writes no summary of its own. This is deliberate — writing one would cost an extra `claude -p` per twelve turns — and it means a Claude session moved to another machine starts from whatever summary a local model last wrote, or none. Revisit if that bites.

## Not in this plan

The thinking-box bug. Three runtimes with three different reasoning paths (`web/js/oai.mjs:26` parses `<think>` tags and `reasoning` deltas; `backend/local-agent.mjs:225,252` filters `onStream` down to `type === 'thinking'` and so drops the `unthink` event `web/js/chat.mjs:168` needs; `backend/agent.mjs:128` depends on `MAX_THINKING_TOKENS`) and a report spanning both 4B local models and Claude — most likely more than one cause. It gets its own investigation once this lands.
