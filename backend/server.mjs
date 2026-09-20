import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat, readdir, access } from 'node:fs/promises';
import { constants as FS } from 'node:fs';
import { existsSync } from 'node:fs';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile, spawn } from 'node:child_process';
import { Tellurium } from './tellurium.mjs';
import { runAgent, toUiEvent } from './agent.mjs';
import { runLocalAgent, Chat } from './local-agent.mjs';
import { homedir } from 'node:os';
import { listSessions, saveSession, openSession, deleteSession,
         sessionDir, readSummary, writeSummary, buildTurn, summaryPrompt,
         summaryStrategy, trimRecord, appendThinking } from './sessions.mjs';

const ROOT = normalize(join(dirname(fileURLToPath(import.meta.url)), '..'));
const WEB = join(ROOT, 'web');
const WORK = join(ROOT, 'workspace');
const MODEL_FILE = join(WORK, 'model.txt');
const RUNS = join(WORK, 'runs');
const SETTINGS_FILE = join(WORK, 'settings.json');
const PORT = Number(process.env.PORT || 5173);
const HOST = process.env.HOST || '127.0.0.1';
// Hosted: Tellurium only. AI runs in the user's browser (local models on their
// machine, hosted models with their own key), so no keys and no code execution here.
const HOSTED = process.env.MCA_HOSTED === '1';

const te = new Tellurium(ROOT);

const DEFAULT_MODEL = `// Linear pathway — the classic MCA test case
$Xo -> S1;  k1*Xo - k2*S1
 S1 -> S2;  k3*S1 - k4*S2
 S2 -> $X1; k5*S2

Xo = 10;  X1 = 0
S1 = 0;   S2 = 0

k1 = 0.5;  k2 = 0.1
k3 = 0.4;  k4 = 0.1
k5 = 0.3
`;

const MIME = { '.md': 'text/markdown; charset=utf-8', '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

const json = (res, code, body) => {
  const s = JSON.stringify(body);
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8',
                        'content-length': Buffer.byteLength(s), 'cache-control': 'no-store' });
  res.end(s);
};

async function body(req, limit = 4e6) {
  const chunks = []; let n = 0;
  for await (const c of req) { n += c.length; if (n > limit) throw new Error('payload too large'); chunks.push(c); }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new Error('invalid JSON body'); }
}

async function ensureWorkspace() {
  await mkdir(join(WORK, 'runs'), { recursive: true });
  if (!existsSync(MODEL_FILE)) await writeFile(MODEL_FILE, DEFAULT_MODEL);
  if (!existsSync(SETTINGS_FILE))
    await writeFile(SETTINGS_FILE, JSON.stringify({ start: 0, end: 100, points: 50 }, null, 2));
}

/* Where the AI does its work. Default is the install's own scratch folder; the user
   can point it anywhere they can write. Only the AI's scratch moves — the live model
   and the simulation settings stay in workspace/ either way. */
async function resolveScratch(dir) {
  if (!dir) return RUNS;
  const p = normalize(String(dir));
  if (!p.startsWith('/')) throw new Error('the working folder must be an absolute path');
  const st = await stat(p).catch(() => null);
  if (!st) throw new Error('no such folder: ' + p);
  if (!st.isDirectory()) throw new Error('not a folder: ' + p);
  await access(p, FS.W_OK).catch(() => { throw new Error('cannot write to: ' + p); });
  return p;
}

const modelVersion = async () => { try { return (await stat(MODEL_FILE)).mtimeMs; } catch { return 0; } };

const which = cmd => new Promise(r =>
  execFile('sh', ['-lc', `command -v ${cmd}`], (e, out) => r(e ? null : out.trim())));
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* Ask an OpenAI-compatible server what it serves. Done here rather than in the
   page: the browser reaching localhost needs OLLAMA_ORIGINS or a CORS setting on
   the model server plus Chrome's local-network prompt, and this server needs
   none of it. */
async function probeOai(baseUrl, apiKey, ms = 6000) {
  let url = String(baseUrl || '').replace(/\/+$/, '');
  if (!url) return { ok: false, error: 'no URL' };
  if (!/\/v\d+$/.test(url)) url += '/v1';
  try {
    const r = await fetch(url + '/models', { signal: AbortSignal.timeout(ms),
      headers: apiKey ? { authorization: 'Bearer ' + apiKey } : {} });
    if (!r.ok) return { ok: false, error: 'HTTP ' + r.status + ' from ' + url };
    const j = await r.json();
    return { ok: true, url, models: (j.data ?? j.models ?? []).map(m => m.id ?? m.name).filter(Boolean) };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
}

// Where a local runtime listens if you installed it and changed nothing.
const OLLAMA = 'http://127.0.0.1:11434';
const KNOWN = [
  { kind: 'Ollama',    base: OLLAMA },
  { kind: 'LM Studio', base: 'http://127.0.0.1:1234' },
  { kind: 'llama.cpp', base: 'http://127.0.0.1:8080' },
  { kind: 'vLLM',      base: 'http://127.0.0.1:8000' },
];

/* ------------------------------- static ------------------------------- */
// The browser agent loads its prompt, workflow and Skills over HTTP, so these
// three folders are served read-only alongside web/.
const ASSET_DIRS = ['agents', 'skills', 'workflows'];

async function serveStatic(req, res, urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p === '/') p = '/index.html';
  const top = p.split('/')[1];
  const root = ASSET_DIRS.includes(top) ? ROOT : WEB;
  const file = normalize(join(root, p));
  if (!file.startsWith(root)) return json(res, 403, { error: 'forbidden' });
  if (root === ROOT && !/\.(md|js|json)$/.test(file)) return json(res, 403, { error: 'forbidden' });
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream',
                         'cache-control': 'no-cache' });
    res.end(data);
  } catch { json(res, 404, { error: 'not found: ' + p }); }
}

/* -------------------------------- api --------------------------------- */
const routes = {
  'GET /api/health': async (req, res) => json(res, 200, { ok: te.installed }),

  'GET /api/env': async (req, res) => {
    const [ver, claude, skills] = await Promise.all([
      te.versions(),
      which('claude'),
      readdir(join(ROOT, 'skills')).catch(() => []),
    ]);
    json(res, 200, {
      hosted: HOSTED,
      tellurium: te.installed ? ver : { error: 'not installed — run: bash setup.sh' },
      telluriumInstalled: te.installed,
      claude: claude ? { path: claude } : { error: 'claude CLI not found on PATH' },
      agent: existsSync(join(ROOT, 'agents/model-scientist.md')) ? 'model-scientist' : null,
      workflow: existsSync(join(ROOT, 'workflows/mca-tellurium.js')) ? 'mca-tellurium' : null,
      skills: skills.filter(s => !s.startsWith('.')),
    });
  },

  'GET /api/model': async (req, res) => {
    await ensureWorkspace();
    json(res, 200, { src: await readFile(MODEL_FILE, 'utf8'), version: await modelVersion() });
  },

  'PUT /api/model': async (req, res) => {
    const { src } = await body(req);
    if (typeof src !== 'string') return json(res, 400, { error: 'src must be a string' });
    await ensureWorkspace();
    await writeFile(MODEL_FILE, src);
    json(res, 200, { version: await modelVersion() });
  },

  'PUT /api/settings': async (req, res) => {
    const s = await body(req);
    await ensureWorkspace();
    await writeFile(SETTINGS_FILE, JSON.stringify(s, null, 2));
    json(res, 200, { ok: true });
  },

  'POST /api/simulate': async (req, res) => {
    const q = await body(req);
    if (!q.model?.trim()) return json(res, 400, { ok: false, error: 'model is empty' });
    json(res, 200, await te.call('simulate', q));
  },
  'POST /api/steady': async (req, res) => json(res, 200, await te.call('steadyState', await body(req))),
  'POST /api/settle': async (req, res) => json(res, 200, await te.call('settle', await body(req), 120000)),
  'POST /api/mca':    async (req, res) => json(res, 200, await te.call('mca', await body(req), 120000)),

  /* Directory listing for the local-model file picker. The browser cannot give a
     real path from <input type=file>, so the server browses instead. */
  'GET /api/fs': async (req, res) => {
    const u = new URL(req.url, 'http://x');
    const want = u.searchParams.get('path');
    const dir = want ? normalize(want) : homedir();
    const filter = (u.searchParams.get('ext') || '').split(',').filter(Boolean);
    let entries;
    try { entries = await readdir(dir, { withFileTypes: true }); }
    catch (e) { return json(res, 400, { error: e.code === 'ENOENT' ? 'no such folder' : e.message, path: dir }); }
    const dirs = [], files = [];
    for (const d of entries) {
      if (d.name.startsWith('.')) continue;
      if (d.isDirectory()) dirs.push({ name: d.name, dir: true, path: join(dir, d.name) });
      else if (!filter.length || filter.some(x => d.name.toLowerCase().endsWith(x)))
        files.push({ name: d.name, dir: false, path: join(dir, d.name) });
    }
    const sort = (a, b) => a.name.localeCompare(b.name);
    json(res, 200, { path: dir, parent: dir === '/' ? null : dirname(dir),
                     home: homedir(), entries: [...dirs.sort(sort), ...files.sort(sort)] });
  },

  'POST /api/scratch': async (req, res) => {
    const { dir } = await body(req);
    if (HOSTED) return json(res, 400, { ok: false,
      error: 'This deployment runs Tellurium only; there is no local folder to write to.' });
    try { json(res, 200, { ok: true, dir: await resolveScratch(dir), default: RUNS }); }
    catch (e) { json(res, 200, { ok: false, error: String(e.message || e) }); }
  },

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

  /* Probe an OpenAI-compatible endpoint and list the models it serves. */
  'POST /api/probe': async (req, res) => {
    const { baseUrl, apiKey } = await body(req);
    if (!baseUrl) return json(res, 400, { ok: false, error: 'baseUrl is required' });
    const r = await probeOai(baseUrl, apiKey);
    json(res, 200, r.ok ? r : { ...r, error: r.error + ' — is the server running?' });
  },

  /* Every local runtime already listening, found without the user configuring
     anything. This is what makes a local model plug-and-play: the page picks a
     model from here and the turn is proxied through this server, so the model
     server never sees a browser origin and never needs a CORS flag. */
  'GET /api/local/scan': async (req, res) => {
    if (HOSTED) return json(res, 200, { hosted: true, servers: [], ollama: null });
    const servers = (await Promise.all(KNOWN.map(async k => {
      const r = await probeOai(k.base, '', 1500);
      return r.ok ? { ...k, models: r.models } : null;
    }))).filter(Boolean);
    json(res, 200, { hosted: false, servers, ollama: await which('ollama') });
  },

  /* Start Ollama for the user instead of telling them to open a terminal. */
  'POST /api/local/start': async (req, res) => {
    if (HOSTED) return json(res, 400, { ok: false, error: 'not available on a hosted deployment' });
    const up = await probeOai(OLLAMA, '', 1200);
    if (up.ok) return json(res, 200, { ok: true, already: true, models: up.models });
    const bin = await which('ollama');
    if (!bin) return json(res, 200, { ok: false,
      error: 'Ollama is not installed on this machine. Install it from https://ollama.com/download, then press Start again.' });
    spawn(bin, ['serve'], { detached: true, stdio: 'ignore' }).unref();
    for (let i = 0; i < 15; i++) {
      await sleep(400);
      const r = await probeOai(OLLAMA, '', 1000);
      if (r.ok) return json(res, 200, { ok: true, models: r.models });
    }
    json(res, 200, { ok: false, error: 'started ollama, but nothing came up on port 11434' });
  },

  /* Server-sent events: one agent turn, streamed. */
  'POST /api/chat': async (req, res) => {
    const { message, sessionId, sessionDirId, model, env, runtime, chatCfg, history,
            scratchDir, useWorkflow = true, resume = false } = await body(req);
    if (!message?.trim()) return json(res, 400, { error: 'message is empty' });
    if (HOSTED) return json(res, 400, { error:
      'This deployment runs Tellurium only. Pick a local model in Settings — it runs on ' +
      'your machine and talks to this site directly.' });
    // A misconfigured endpoint used to surface in the browser as a bare "network
    // error"; say what is actually wrong, over SSE, so the chat can show it.
    if (runtime === 'openai' && !chatCfg?.baseUrl)
      return json(res, 400, { error:
        'No server URL for this model. Open Settings → Local models, set the URL ' +
        '(Ollama: http://localhost:11434, LM Studio: http://localhost:1234), press ' +
        '"Test & list models", then Save.' });
    await ensureWorkspace();
    let scratch = RUNS;
    try { scratch = await resolveScratch(scratchDir); }
    catch (e) { return json(res, 400, { error: 'Working folder: ' + e.message +
      ' — pick another in Settings, or clear it to use the default.' }); }
    const before = await readFile(MODEL_FILE, 'utf8').catch(()=> '');

    // The session's own folder is where its memory and its scratch both live.
    let sdir = null;
    if (sessionDirId) sdir = await sessionDir(RUNS, sessionDirId).catch(() => null);
    const summary = sdir ? await readSummary(sdir) : '';
    if (sdir) { await mkdir(sdir, { recursive: true }); scratch = sdir; }

    // The client now sends its whole history (it no longer pre-truncates), so this
    // is the one place that splits it: `recent` is what the model sees as live
    // messages, `fold` is what just aged out of that window (compressed/recorded
    // into summary.md below), and `inject` is what goes in the system prompt this
    // turn — the summary already on disk, never the live window. Mixing the two
    // (a turn's content present in both) is exactly the contradiction that sent a
    // local model into a loop: told a turn was old and settled while also handed
    // it live.
    const { messages: recent, fold, inject } = buildTurn(history, summary);

    res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8',
                         'cache-control': 'no-cache', connection: 'keep-alive',
                         'x-accel-buffering': 'no' });
    const send = o => { if (!res.writableEnded) res.write(`data: ${JSON.stringify(o)}\n\n`); };
    const ka = setInterval(() => { if (!res.writableEnded) res.write(': ping\n\n'); }, 15000);

    // Accumulated across the whole turn, written to thinking.md when it ends. Mirrors
    // the dedup web/js/chat.mjs does for the same whole-vs-delta duplication: a
    // whole-block re-send (Claude Code's final assistant message) repeats what the
    // deltas already streamed, so drop it rather than doubling the text on disk.
    let thoughts = '';

    const onEvent = async raw => {
        const ev = runtime === 'openai' ? raw : toUiEvent(raw);
        if (ev) send(ev);
        if (ev?.type === 'thinking' && ev.text &&
            !(ev.whole && thoughts.includes(ev.text.trim().slice(0, 60))))
          thoughts += (ev.whole && thoughts && !thoughts.endsWith('\n') ? '\n\n' : '') + ev.text;
        if (raw.type === 'done') {
          // compare content, not mtime — the editor autosaves during a turn
          const after = await readFile(MODEL_FILE, 'utf8').catch(()=> '');
          if (after !== before) send({ type: 'model_changed', src: after, version: await modelVersion() });

          /* summary.md is written every turn a session folder exists, for every
             runtime — but only ever describes turns that just folded OUT of the
             live window (`fold`, above), never the window itself. 'record'
             (nothing folded yet, short history) writes nothing: the whole
             conversation is still live, so there is nothing to remember on its
             behalf yet. 'compress' folds `fold` into the running summary through
             the model already in use when there's a cheap completion endpoint for
             it (OpenAI-compatible). 'trim' (Claude Code, no cheap completion
             endpoint) is the one deliberate exception — the file is Claude Code's
             only portable memory when --resume isn't available, so it keeps a
             bounded verbatim record including recent turns by design. */
          if (sdir) try {
            const strategy = summaryStrategy(history?.length, runtime === 'openai' && !!chatCfg);
            if (strategy === 'compress') {
              if (fold.length) {
                const chat = new Chat(chatCfg);
                const msg = await chat.complete({ messages: summaryPrompt(summary, fold),
                                                  maxTokens: 900 });
                if (msg.content?.trim()) {
                  await writeSummary(sdir, msg.content.trim());
                  send({ type: 'compacted', summary: msg.content.trim() });
                }
              }
            } else if (strategy === 'trim') {
              await writeSummary(sdir, trimRecord(history));
            } else {
              // ponytail: skipped the "still all in context" human note the design
              // doc allows here — nothing folded means nothing to inject, and the
              // file existing (even empty) is what "always exists" requires. Add
              // the note if a human reading the folder needs it.
              await writeSummary(sdir, '');
            }
          } catch (e) { console.error('[summary]', e.message); }  // never fail the turn

          // Same rule: persisting the turn's reasoning must never fail the turn.
          if (sdir && thoughts.trim()) try { await appendThinking(sdir, message, thoughts); }
          catch (e) { console.error('[thinking]', e.message); }

          clearInterval(ka);
          if (!res.writableEnded) res.end();
        }
      };

    // any throw from here on must still reach the browser as an SSE frame
    process.nextTick(() => {});
    const run = runtime === 'openai'
      ? runLocalAgent({ root: ROOT, prompt: message, history: recent, chatCfg,
                        useWorkflow, liveModel: before, te, scratch, summary: inject, onEvent })
      : runAgent({ root: ROOT, prompt: message, sessionId, model, env: env || {},
                   useWorkflow, liveModel: before, scratch, summary: inject, resume, onEvent });
    send({ type: 'session', sessionId: run.sessionId ?? sessionId ?? null, runtime: runtime || 'claude-code' });
    req.on('close', () => { clearInterval(ka); run.kill(); });
  },
};

const server = createServer(async (req, res) => {
  const url = req.url || '/';
  const key = `${req.method} ${url.split('?')[0]}`;
  const handler = routes[key];
  try {
    if (handler) await handler(req, res);
    else if (req.method === 'GET') await serveStatic(req, res, url);
    else json(res, 404, { error: 'no route for ' + key });
  } catch (e) {
    console.error(key, e);
    if (!res.headersSent) json(res, 500, { error: String(e.message || e) });
    else res.end();
  }
});

// A crash here reaches the browser as an unexplained "network error"; log and stay up.
process.on('uncaughtException', e => console.error('[uncaught]', e));
process.on('unhandledRejection', e => console.error('[unhandled]', e));

await ensureWorkspace();
server.listen(PORT, HOST, async () => {
  const v = await te.versions();
  console.log(`MCA Atlas  →  http://${HOST}:${PORT}${HOSTED ? '  (hosted mode: Tellurium only)' : ''}`);
  console.log(te.installed ? `  tellurium ${v.tellurium} · roadrunner ${v.roadrunner} · python ${v.python}`
                           : '  tellurium NOT installed — run: bash setup.sh');
  console.log(HOSTED ? '  agent runs in the browser; no keys or code execution on this server'
                     : '  agent: model-scientist · workflow: mca-tellurium');
});
