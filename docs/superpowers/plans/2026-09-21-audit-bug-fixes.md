# Audit Bug Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix every verified bug in audit1.txt, audit2.txt, audit3.txt with the smallest root-cause change.

**Architecture:** Tasks are split by file ownership so they can run in parallel without two agents editing the same file. Cross-task contracts are listed under Interfaces.

**Tech Stack:** Node (ESM, `node --test`), Python 3 Tellurium worker, vanilla browser JS.

**Spec:** `audit1.txt`, `audit2.txt`, `audit3.txt` (repo root). IDs below: `A1-3` = audit1 item 3, `A2-4`, `A3-17`, etc.

## Global Constraints

- Match the surrounding style: terse, comment only the non-obvious, no new dependencies.
- Do NOT commit. The working tree holds the user's own uncommitted WIP in the same files.
- Do NOT touch `workspace/model.txt` or `workspace/settings.json` (A2-5: user's local data; restore before committing, not now).
- Safe test command (the two session-route tests boot the server and write the real `workspace/`):
  `ls backend/*.test.mjs web/js/*.test.mjs | grep -v "sessions-routes\|sessions-memory" | xargs node --test`
  Baseline: 13 files pass.
- Every non-trivial fix leaves one small assertion-based test in the matching existing `*.test.mjs` (or a new one next to it).

## Triage — not fixed, with reason (receiving-code-review pushback)

| ID | Decision |
|---|---|
| A3-11 timeout SIGKILLs shared worker | Keep. The worker is single-threaded and serial: other calls are queued behind the runaway anyway, and killing the process is the only way to stop a stuck CVODE call. |
| A1-9 (python rule half) | Claude Code checks each subcommand of a compound command separately, so `curl … \| sh; …/python` does not pass on the python rule. Only the `cat`/`ls` half is fixed. |
| A3-31 symlink out of jail | `run_python` is unsandboxed Python in the same folder; a realpath check buys nothing. |
| A1-24 CSV quoting | Names are `\w`-only from Tellurium; no failing input exists. |
| A2-5 workspace data | User data, handled at commit time (see constraints). |
| A2-12 unconfirmed `reasoning` field | Unconfirmed, no failing host known. |
| A1-14 renamed project loses turn memory | Mostly removed by A1-1 (Stop now kills the run) plus the "skip if session.json is gone" guard in Task 4. |
| A3-32 | Covered by A1-1 + A1-10. |

---

### Task 0 (controller, before dispatch): shared `esc`

**Files:** Modify `web/js/util.mjs`

- [ ] Add after `store`:

```js
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
```

---

### Task 1: server.mjs — hosted surface, static traversal, Stop, turn ordering

**Files:** Modify `backend/server.mjs`. Test: new `backend/static.test.mjs` only if a pure helper is extracted; otherwise verify with curl against a scratch-port server (PORT=5199) and kill it after.

Fixes: A1-1, A1-3, A1-4, A1-5, A1-6, A1-14 (guard is in Task 4), A2-2/A3-24, A2-6, A2-7/A3-27, A3-4, A3-5, A3-7, A3-18 (server half), A3-21 (server half).

**Interfaces (Produces):**
- `GET /api/settings` → `{start,end,points}` (reads `workspace/settings.json`, falls back to `{start:0,end:100,points:50}`).
- `POST /api/info` body `{model}` → `te.call('info', {model})` result as-is (`{ok, result|error}`).
- `POST /api/probe` stays, returns 400 when HOSTED.

- [ ] **Hosted guards.** At the top of `GET /api/fs` and `POST /api/probe`: `if (HOSTED) return json(res, 400, { error: 'not available on a hosted deployment' });`. In `PUT /api/model` and `PUT /api/settings`: `if (HOSTED) return json(res, 200, { version: 0 });` / `{ ok: true }` (no-op: in hosted mode the editor holds the model; stops cross-visitor leaks).
- [ ] **Static traversal (A1-6).** In `serveStatic` replace the prefix check:

```js
const base = root === ROOT ? join(ROOT, top) : WEB;
if (!file.startsWith(base + sep)) return json(res, 403, { error: 'forbidden' });
```
  (import `sep` from `node:path`). `/agents/..%2fworkspace%2fsettings.json` must now 403; `/skills/mca/SKILL.md` and `/app.css` still 200.
- [ ] **Project id must be a real project (A2-7, A3-27, A3-5).** Replace `modelFile`:

```js
const modelFile = async project => {
  if (!project) return MODEL_FILE;
  const dir = await sessionDir(WORK, project);
  if (!existsSync(join(dir, 'session.json'))) throw Object.assign(new Error('no such project: ' + project), { status: 400 });
  return join(dir, 'model.txt');
};
```
  and in the top-level catch use `json(res, e.status || 500, …)`. Also make `sessionDir` throws from `modelFile` map to 400 (wrap: `catch (e) { e.status ??= 400; throw e; }` inside modelFile around `sessionDir`).
  In `POST /api/chat`: `if (sessionDirId) { try { sdir = await sessionDir(WORK, sessionDirId); } catch (e) { return json(res, 400, { error: 'Project: ' + e.message }); } }` — no silent fallback to the default model.
- [ ] **User's working folder wins (A3-7).** In `/api/chat`: `if (sdir) { await mkdir(sdir, { recursive: true }); if (!scratchDir) scratch = sdir; }`.
- [ ] **Serialize events and model pushes (A2-2, A3-24, A3-4).**

```js
let pq = Promise.resolve();
const pushModel = () => (pq = pq.then(async () => {
  const now = await readFile(mfile, 'utf8').catch(() => null);
  if (now == null || now === shown) return;
  shown = now;
  if (editorEcho(mfile, now)) return;
  send({ type: 'model_changed', src: now, version: await modelVersion(mfile) });
}));
```
  Rename the existing `onEvent` body to `handle`, and pass `onEvent = raw => (eq = eq.then(() => handle(raw)).catch(e => console.error('[event]', e)))` with `let eq = Promise.resolve()`. Inside `handle`, before `send(ev)`: `if (ev?.type === 'result') await pushModel();` so `model_changed` always precedes `result`.
- [ ] **Editor echo only for recent writes (A2-6).** Store `{src, t: Date.now()}`; `const editorEcho = (file, src) => (editorWrote.get(file) ?? []).some(w => w.src === src && Date.now() - w.t < 5000);`.
- [ ] **Stop actually stops (A1-1).** Replace `req.on('close', …)` with `res.on('close', () => { clearInterval(ka); unwatch(); if (!res.writableFinished) run.kill(); });`.
- [ ] **GET /api/settings, POST /api/info** as in Interfaces (`/api/info` rejects empty model with 400 like `/api/simulate`).
- [ ] **Env allowlist (A3-23)** lives in Task 4 (agent.mjs); nothing here.
- [ ] Verify: run safe tests; boot `PORT=5199 node backend/server.mjs &`, curl `/agents/..%2fworkspace%2fsettings.json` (403), `/skills/mca/SKILL.md` (200), `/api/settings` (JSON), `PUT /api/model` with `{"src":"x","project":"runs"}` (400); kill the server. Restore `workspace/model.txt` if the curl touched it (it must not).

---

### Task 2: Tellurium bridge and worker

**Files:** Modify `backend/tellurium.mjs`, `backend/py/te_worker.py`.

Fixes: A1-2, A1-7, A1-20, A1-21, A1-22/A3-2, A3-3, A3-28.

- [ ] `tellurium.mjs`: `JSON.stringify({ ...payload, id, op })`; in `'exit'` add `this.buf = '';`; add `p.on('error', e => console.error('[te] spawn failed:', e.message));` and `p.stdin.on('error', () => {});` (exit handler already fails pending calls); on JSON parse failure `console.error('[te] unparseable reply:', line.slice(0, 200));` instead of a silent `continue`.
- [ ] `te_worker.py`: add and use for both replies (`json.dumps(clean(...), allow_nan=False)`):

```python
import math
def clean(o):
    if isinstance(o, float):
        return o if math.isfinite(o) else None
    if isinstance(o, dict):
        return {k: clean(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [clean(v) for v in o]
    return o
```
- [ ] Error reply drops `trace`; write it to stderr instead: `sys.stderr.write(traceback.format_exc()); sys.stderr.flush()`.
- [ ] `load()`: after `resetToOrigin()`, `if r.conservedMoietyAnalysis: r.conservedMoietyAnalysis = False` (no leak between ops).
- [ ] `do_mca`: `r.conservedMoietyAnalysis = True` before `steadyState()`; after it, `if dist > 1e-4: raise ValueError("steady-state solver did not converge (residual %.3g); control coefficients are only defined at a steady state" % dist)`.
- [ ] Verify with the venv (skip if `.venv/bin/python` is missing, say so):

```bash
printf '%s\n' '{"id":1,"op":"info","model":"S1 -> S2; k*S1\nk = 1; z = 1/0; S1 = 1"}' '{"id":2,"op":"mca","model":"$X -> S1; k1*X\nS1 -> $Y; k2*S1\nk1=1; k2=0.5; X=1"}' | .venv/bin/python backend/py/te_worker.py
```
  Expected: line 1 parses as JSON with `"z": null`; line 2 `ok: true` with `fluxControl`. Then run safe tests.

---

### Task 3: local agent, shared OAI helpers, hosted browser chat

**Files:** Modify `backend/local-agent.mjs`, `web/js/oai.mjs`, `web/js/localai.mjs`. Tests: `backend/local-agent.test.mjs`, `web/js/oai.test.mjs`.

Fixes: A1-8/A3-30, A3-8, A2-4, A2-10, A2-11, A2-12(fragile post), A2-8, A1-11/A3-9, A3-10.

**Interfaces (Produces):** `export const cutoffNudge = (msg, hasTools) => [assistantMsg, userMsg]` in `oai.mjs` — the two messages `Chat.complete` currently appends for a thinking-only cut-off (move the text verbatim from local-agent.mjs:89-95).

- [ ] **jail (A1-8, A3-30):** `const inside = (abs, dir) => abs === dir || abs.startsWith(dir + sep);` and use it for both roots (import `sep`). `write_file` additionally must land in `scratch` or be the model file: `if (!inside(abs, scratch) && abs !== join(root, modelPath)) throw new Error('write_file may only write the model or into the working folder: ' + path);`. Test: `../<rootname>-evil/x` rejected for read_file; writing `backend/x.mjs` rejected.
- [ ] **load_skill (A3-8):** `if (!/^[\w-]+$/.test(String(name))) throw new Error('unknown skill: ' + name);`. Test: `../../etc` rejected.
- [ ] **cap after detection (A2-4):** move `const cap = …` and `const tools = makeTools(…)` inside the async IIFE, after `await chat.detectContext();`.
- [ ] **detectContext (A2-10):** separate lookups; skip `/api/show` when `/api/ps` answered:

```js
const live = await ask('/api/ps').then(j => j.models?.find(m => m.name === this.model || m.model === this.model)?.context_length).catch(() => 0);
const n = live > 0 ? live : await ask('/api/show', { model: this.model })
  .then(j => Number(/(?:^|\n)\s*num_ctx\s+(\d+)/.exec(j.parameters ?? '')?.[1])).catch(() => 0);
if (n > 0) this.ctx = n;
```
- [ ] **post() (A2-12):** `get body() { return Readable.toWeb(res); },` instead of the eager property.
- [ ] **gate refusals count as repeats (A2-11):** at both call sites (`toolRunner` loop ~l.310 and outer loop ~l.519): `const gate = skillGate(tools.loaded, name); if (gate) run.repeats++; const out = lacks(name, args) ?? gate ?? await run(name, args);`.
- [ ] **cutoffNudge:** export from oai.mjs; `Chat.complete` uses `fitMessages([...messages, ...cutoffNudge(msg, tools?.length)], this.ctx, cap)`.
- [ ] **fitMessages stage 2 (A2-8):** shorten `m.role === 'tool' || (m.role === 'user' && String(m.content ?? '').startsWith('Result of '))`. Test in oai.test.mjs: a text-mode `Result of x:` long message is shortened, not dropped.
- [ ] **localChat (A1-11, A3-9, A3-10):** `const cap = replyTokens(ctx, replyPct);` use `fitMessages(messages, ctx, cap)` and `max_tokens: cap`. Add a `retried` param; after `readCompletion`, if `!retried && msg.finish === 'length' && !msg.tool_calls?.length && !msg.content`, log `model + ' was cut off while thinking; asking it for its next move.'` and return `second.content || second.tool_calls?.length ? second : msg` where `second = await localChat({ ...args, retried: true, messages: [...messages, ...cutoffNudge(msg, tools?.length)] })` (take `args` as the whole parameter object).
- [ ] **localai.probe(baseUrl, apiKey):** pass `{ headers: apiKey ? { authorization: 'Bearer ' + apiKey } : {} }` as `init` to `ping`.
- [ ] Run safe tests.

---

### Task 4: Claude runtime args, sessions/history

**Files:** Modify `backend/agent.mjs`, `backend/sessions.mjs`. Tests: `backend/agent-args.test.mjs`, `backend/sessions.test.mjs`.

Fixes: A1-9 (cat/ls), A3-22, A3-23, A3-6, A1-14 (guard), A3-12.

- [ ] Remove `'Bash(cat:*)', 'Bash(ls:*)'` (Read/Glob/Grep cover them, scoped by `--add-dir`). Update agent-args.test if it pins them.
- [ ] `summaryBlock`: replace "Treat it as established, and do not re-derive it." with "It is not a tool result: a number from it may be stale, and the live model may have changed since. Any number you report this turn comes from a tool call you make this turn."
- [ ] `runAgent` env: `env: { ...process.env, MAX_THINKING_TOKENS: String(env.MAX_THINKING_TOKENS ?? '6000') }` (only that key is a caller override).
- [ ] `sessions.mjs` — serialize history per folder and never recreate a deleted project:

```js
const locks = new Map();
const serial = (dir, fn) => { const p = (locks.get(dir) ?? Promise.resolve()).then(fn, fn); locks.set(dir, p.catch(() => {})); return p; };
const rawHistory = dir => readFile(join(dir, HISTORY), 'utf8').catch(() => '');
export const readHistory = dir => serial(dir, () => rawHistory(dir));
export const appendHistory = (dir, newLines, compact) => serial(dir, async () => {
  if (!existsSync(join(dir, META))) return '';        // project deleted or renamed mid-turn
  const h = parseHistory(await rawHistory(dir));
  const text = renderHistory(await foldHistory({ ...h, lines: [...h.lines, ...newLines] }, compact));
  await writeFile(join(dir, HISTORY), text);
  return text;
});
```
  (The next turn's `readHistory` now waits for the previous append.) Check any internal `readHistory` caller inside sessions.mjs uses `rawHistory` if it runs inside `serial`.
- [ ] `saveSession`: default `settings` to `undefined`; `if (settings) await writeFile(join(dir,'settings.json'), …)`.
- [ ] Tests (sessions.test.mjs): two concurrent `appendHistory` calls on a temp project keep both lines; `appendHistory` on a dir without session.json does not create history.md. Run safe tests.

---

### Task 5: frontend turn lifecycle, editor, saves

**Files:** Modify `web/js/api.mjs`, `web/js/chat.mjs`, `web/js/main.mjs`, `web/js/session.mjs`, `web/js/util.mjs` (latestOnly only). Test: `web/js/util.test.mjs`.

Fixes: A1-10/A3-16, A3-14, A3-15, A1-23/A2-3, A2-1, A2-9, A3-18 (client), A3-25, A1-15/A3-26 (main.mjs lines).

**Interfaces (Consumes):** `GET /api/settings`, `POST /api/info` (Task 1); `esc` (Task 0).
**Produces:** `api.getSettings()`, `api.info(model)`, `export const saveIdle = () => chain.catch(() => {})` in session.mjs.

- [ ] `api.mjs`: AbortError on fetch → `onEvent({type:'closed'})`; add `getSettings` and `info = model => post('/api/info', { model })`.
- [ ] `chat.mjs` done/closed: only log when `!failed && (body || ev.type === 'done')` (still set `logged = true`). A stopped-before-start or fatal turn is not persisted.
- [ ] `main.mjs`:
  - `let editing = false;` set true in the editor `input` handler, false at the start of `commit()`. `setOnModelChanged(src => { if (src === editor.value) return; if (editing) return status('err', 'AI edited the model while you were typing — kept your text'); editor.value = src; run(); });`
  - `commit()`: `await saveIdle();` first (a rename/first save in flight must land before the PUT), then `const [put] = await Promise.all([api.putModel(editor.value, currentId()), run(), api.putSettings(cfg())]); if (put?.error) status('err', 'Model not saved: ' + put.error);`
  - boot: after `getModel`, `const st = await api.getSettings().catch(() => null); if (st?.points) { tStart/tEnd/nPts = st }`.
  - escape `r.error` (l.45) and `i.note` (l.65, l.86) with `esc`.
- [ ] `util.mjs` latestOnly: `do { again = false; try { await fn(); } catch (e) { console.error(e); } } while (again);`. Test: a throwing first run still runs the queued follow-up.
- [ ] Run safe tests.

---

### Task 6: frontend widgets, settings, browser agent

**Files:** Modify `web/js/panel.mjs`, `web/js/settings.mjs`, `web/js/chart.mjs`, `web/js/filepicker.mjs`, `web/js/md.mjs`, `web/js/agent.mjs`, `web/js/prompt.mjs`. Tests: new `web/js/panel.test.mjs`, `web/js/md.test.mjs`.

Fixes: A1-13/A3-20, A1-12, A1-15/A3-13/A3-26, A1-16, A1-17, A1-18, A1-19, A3-17, A3-19, A3-21, A3-29.

**Consumes:** `esc` (Task 0), `api.info` (Task 5), `POST /api/probe` (Task 1).

- [ ] `panel.mjs` `writeOnly`: escape the id, match only a whole-statement numeric literal at statement start, never inside a comment, and don't append when the id is otherwise defined:

```js
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function writeOnly(editor, name, v){
  const n = reEsc(name), t = editor.value;
  const re = new RegExp('((?:^|;)[ \\t]*\\$?' + n + '[ \\t]*=[ \\t]*)(-?\\d*\\.?\\d+(?:[eE][-+]?\\d+)?)(?=[ \\t]*(?:;|//|#|$))', 'm');
  if (re.test(t)) editor.value = t.replace(re, (m, a) => a + numText(v));
  else if (!new RegExp('(?:^|;)[ \\t]*\\$?' + n + '[ \\t]*:?=', 'm').test(t))
    editor.value = t.replace(/\s*$/, '') + '\n' + name + ' = ' + numText(v);
}
```
  panel.test.mjs (import only `writeOnly`; if importing panel.mjs touches `document`, guard or move the pure part): `k1 = 2*k2` unchanged; `k1 := x` unchanged; `// k1 = 5\nk1 = 1` edits line 2; `k1 = 1; k2 = 3` edits k1 only; `J.1 = 2` works.
- [ ] `settings.mjs`:
  - probe: non-hosted → `fetch('/api/probe', {method:'POST', body: JSON.stringify({baseUrl, apiKey})})` and map `{ok, models, error}` to the existing ok/bad rendering; hosted → `probeLocal(baseUrl, apiKey)` (Task 3 adds the `apiKey` param).
  - endpoints keyed by base URL, not index: option value `'ep:'+e.base+'|'+m`; resolve with `const i = model.indexOf('|'); const ep = s.endpoints.find(e => e.base === model.slice(0, i));`.
  - `auto:` guard: `if (i < 0) return { runtime:'claude-code', model:'opus' };` and add `contextTokens` from the LOCAL entry whose `s.localCfg[L.url]` (trailing slashes stripped) equals the base.
  - `fillModels`: only persist when the stored selection is present or is not an `auto:` one: `if (opts.some(o => o.v === cur) || !cur.startsWith('auto:')) store.set('modelSel', …)`.
  - escape `r.error` in chooseScratch and every `detail`/`label` in `renderEnv` with `esc`.
- [ ] `chart.mjs`: `esc(n)` in legend, table header, tooltip.
- [ ] `filepicker.mjs` and `sessionpicker.mjs`: `esc(r.error)`; replace `if($('#fp')) return` / `if($('#sp')) return` with a module `let built = false; … if (built) return; built = true;`.
- [ ] `md.mjs`: keep `id` but namespace it: every SVG `id` value becomes `'md-' + v`, and `url(#x)` / `href="#x"` values become `url(#md-x)` / `#md-x`. md.test: `<svg><g id="sp"/></svg>` renders with `id="md-sp"`, and `marker-end="url(#a)"` becomes `url(#md-a)`.
- [ ] `web/js/agent.mjs`: cache — `const p = fetch(...)…; cache.set(url, p); p.catch(() => cache.delete(url));`. `write_model` gate uses `api.info(antimony)` instead of `simulate`.
- [ ] `prompt.mjs` RULES: "Get them from Tellurium in \`run_python\`:" → "Get them from Tellurium with your tools:".
- [ ] Run safe tests.

---

## Final verification (controller)

- [ ] Safe test suite green.
- [ ] Dispatch one code reviewer over the full diff against this plan; fix Critical/Important findings.
- [ ] `git diff --stat` summary; no commit.
