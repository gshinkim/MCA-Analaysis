import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat, readdir, access } from 'node:fs/promises';
import { constants as FS } from 'node:fs';
import { existsSync, watch } from 'node:fs';
import { join, extname, normalize, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile, spawn } from 'node:child_process';
import { Tellurium } from './tellurium.mjs';
import { runAgent, toUiEvent } from './agent.mjs';
import { runLocalAgent, Chat } from './local-agent.mjs';
import { SKILL_NOTE } from '../web/js/prompt.mjs';
import { route, jev, laya, active, questions, logLine, hintLine, autoBlock } from './router.mjs';
import { homedir } from 'node:os';
import { listSessions, saveSession, openSession, deleteSession,
         sessionDir, readHistory, appendHistory, compressHistory, holdDir, turnLines,
         compactPrompt } from './sessions.mjs';

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

/* One history.md fold: ~1000 words -> ~200, by the model the user is already using.
   Claude Code has no plain completion endpoint, so it gets a one-shot `claude -p`. */
async function compactWith({ runtime, chatCfg, model }, summary, batch) {
  const [sys, user] = compactPrompt(summary, batch);
  // No maxTokens: the reply budget covers thinking too, and at 800 a thinking model
  // spent it all thinking — measured: bonsai-27b failed every fold (and the cutoff
  // retry) this way and history.md grew to 3,688 words. Uncapped it thought ~1,500
  // words, then wrote the ~200-word summary.
  // Thinking off where the server allows it: a summary needs none, and it is what made
  // a fold take ~5 min on bonsai-27b (LM Studio honours reasoning_effort 'none':
  // measured 0.6 s vs 29 s on a one-line summary). A server that rejects the field
  // gets the plain request.
  if (runtime === 'openai') {
    const chat = new Chat(chatCfg);
    const msg = await chat.complete({ messages: [sys, user], extra: { reasoning_effort: 'none' } })
      .catch(() => chat.complete({ messages: [sys, user] }));
    return msg.content;
  }
  return new Promise((ok, fail) => {
    const p = spawn('claude', ['-p', user.content, '--append-system-prompt', sys.content,
                               '--setting-sources', 'project', ...(model ? ['--model', model] : [])],
                    { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] });
    let out = '';
    p.stdout.setEncoding('utf8').on('data', d => (out += d));
    const t = setTimeout(() => p.kill(), 120_000);
    p.on('error', fail);
    p.on('close', code => { clearTimeout(t); code === 0 ? ok(out) : fail(new Error('claude -p exited ' + code)); });
  });
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

/* A project's model lives in its own folder: the editor, the agent and its Python
   all read and write workspace/<project>/model.txt. workspace/model.txt is only the
   default, for the page before any project exists. The browser names the project
   on every call rather than the server remembering which one is open. */
const modelFile = async project => {
  if (!project) return MODEL_FILE;
  let dir;
  try { dir = await sessionDir(WORK, project); }
  catch (e) { e.status ??= 400; throw e; }
  if (!existsSync(join(dir, 'session.json')))
    throw Object.assign(new Error('no such project: ' + project), { status: 400 });
  return join(dir, 'model.txt');
};
// What the editor itself last wrote, per file: the turn's watcher must not echo the
// user's own edits back (a stale echo would snap a dragged slider back). Only a
// *recent* write counts — an old one must not suppress a later AI write that
// happens to land on the same text.
const editorWrote = new Map();
const noteEditorWrite = (file, src) => {
  const seen = editorWrote.get(file) ?? [];
  seen.push({ src, t: Date.now() }); if (seen.length > 20) seen.shift();
  editorWrote.set(file, seen);
};
const editorEcho = (file, src) =>
  (editorWrote.get(file) ?? []).some(w => w.src === src && Date.now() - w.t < 5000);
const modelVersion = async (file = MODEL_FILE) => { try { return (await stat(file)).mtimeMs; } catch { return 0; } };

const which = cmd => new Promise(r =>
  execFile('sh', ['-lc', `command -v ${cmd}`], (e, out) => r(e ? null : out.trim())));
const sleep = ms => new Promise(r => setTimeout(r, ms));
// LM Studio installs its CLI here and only adds it to PATH if you let it.
const lmsBin = async () => (await which('lms')) ??
  (existsSync(join(homedir(), '.lmstudio/bin/lms')) ? join(homedir(), '.lmstudio/bin/lms') : null);

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

/* Two large local models do not fit in GPU memory together (LM Studio then fails
   with "Compute error." mid-reply), so picking a model unloads every other one
   loaded in Ollama or LM Studio. No keep = unload everything (a Claude model).
   ponytail: only the default ports in KNOWN; a runtime moved elsewhere is left alone. */
const hostOf = u => String(u || '').replace(/\/v\d+\/?$/, '').replace(/\/+$/, '').replace('//localhost', '//127.0.0.1');
const LMSTUDIO = KNOWN.find(k => k.kind === 'LM Studio').base;
async function ejectOthers(keepBase = '', keepModel = '') {
  const keep = (base, ...names) => hostOf(keepBase) === base &&
    names.some(n => n === keepModel || n === keepModel + ':latest');
  const call = (url, body) => fetch(url, { method: body ? 'POST' : 'GET', signal: AbortSignal.timeout(3000),
    headers: { 'content-type': 'application/json' }, body: body && JSON.stringify(body) })
    .then(r => r.json()).catch(() => ({}));
  const gone = [];
  for (const m of (await call(OLLAMA + '/api/ps')).models ?? [])
    if (!keep(OLLAMA, m.name, m.model)) {
      await call(OLLAMA + '/api/generate', { model: m.name, keep_alive: 0 }); gone.push('Ollama ' + m.name);
    }
  for (const m of (await call(LMSTUDIO + '/api/v1/models')).models ?? [])
    for (const i of m.loaded_instances ?? [])
      if (!keep(LMSTUDIO, m.key, i.id)) {
        await call(LMSTUDIO + '/api/v1/models/unload', { instance_id: i.id }); gone.push('LM Studio ' + i.id);
      }
  if (gone.length) console.log('[eject]', gone.join(', '));
  return gone;
}

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
  const base = root === ROOT ? join(ROOT, top) : WEB;
  if (!file.startsWith(base + sep)) return json(res, 403, { error: 'forbidden' });
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
      skills: skills.filter(s => !s.includes('.')),   // folders only, not index.json
    });
  },

  'GET /api/model': async (req, res) => {
    await ensureWorkspace();
    const file = await modelFile(new URL(req.url, 'http://x').searchParams.get('project'));
    json(res, 200, { src: await readFile(file, 'utf8').catch(() => ''), version: await modelVersion(file) });
  },

  'PUT /api/model': async (req, res) => {
    // Hosted: no-op. There's one Tellurium worker shared by every visitor, so
    // persisting a model here would leak one visitor's draft into another's page;
    // the editor already holds the model client-side.
    if (HOSTED) return json(res, 200, { version: 0 });
    const { src, project } = await body(req);
    if (typeof src !== 'string') return json(res, 400, { error: 'src must be a string' });
    await ensureWorkspace();
    const file = await modelFile(project);
    noteEditorWrite(file, src);
    await writeFile(file, src);
    json(res, 200, { version: await modelVersion(file) });
  },

  'PUT /api/settings': async (req, res) => {
    if (HOSTED) return json(res, 200, { ok: true });
    const s = await body(req);
    await ensureWorkspace();
    await writeFile(SETTINGS_FILE, JSON.stringify(s, null, 2));
    json(res, 200, { ok: true });
  },

  'GET /api/settings': async (req, res) => {
    await ensureWorkspace();
    let s;
    try { s = JSON.parse(await readFile(SETTINGS_FILE, 'utf8')); }
    catch { s = { start: 0, end: 100, points: 50 }; }
    json(res, 200, s);
  },

  'POST /api/simulate': async (req, res) => {
    const q = await body(req);
    if (!q.model?.trim()) return json(res, 400, { ok: false, error: 'model is empty' });
    json(res, 200, await te.call('simulate', q));
  },
  'POST /api/info': async (req, res) => {
    const q = await body(req);
    if (!q.model?.trim()) return json(res, 400, { ok: false, error: 'model is empty' });
    json(res, 200, await te.call('info', q));
  },
  'POST /api/steady': async (req, res) => json(res, 200, await te.call('steadyState', await body(req))),
  'POST /api/settle': async (req, res) => json(res, 200, await te.call('settle', await body(req), 120000)),
  'POST /api/mca':    async (req, res) => json(res, 200, await te.call('mca', await body(req), 120000)),

  /* Directory listing for the local-model file picker. The browser cannot give a
     real path from <input type=file>, so the server browses instead. */
  'GET /api/fs': async (req, res) => {
    if (HOSTED) return json(res, 400, { error: 'not available on a hosted deployment' });
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

  /* Sessions. One folder per project directly under workspace/; the directory
     listing is the session list. Hosted deployments have no local folder to keep them in. */
  'GET /api/sessions': async (req, res) => {
    if (HOSTED) return json(res, 400, { error: 'sessions are local-only' });
    await ensureWorkspace();
    json(res, 200, { sessions: await listSessions(WORK) });
  },

  'POST /api/sessions/save': async (req, res) => {
    if (HOSTED) return json(res, 400, { error: 'sessions are local-only' });
    const { id, name, fresh, chats, settings, model } = await body(req);
    if (!id) return json(res, 400, { error: 'id is required' });
    await ensureWorkspace();
    try { json(res, 200, await saveSession(WORK, { id, name, fresh, chats, settings, model })); }
    catch (e) { json(res, 400, { error: String(e.message || e) }); }
  },

  'POST /api/sessions/open': async (req, res) => {
    if (HOSTED) return json(res, 400, { error: 'sessions are local-only' });
    const { id } = await body(req);
    await ensureWorkspace();
    let s;
    try { s = await openSession(WORK, id); }
    catch (e) { return json(res, 400, { error: String(e.message || e) }); }
    // the project's own model.txt is what the editor shows and the agent edits;
    // nothing is copied over the default workspace/model.txt any more
    if (s.settings && Object.keys(s.settings).length)
      await writeFile(SETTINGS_FILE, JSON.stringify(s.settings, null, 2));
    json(res, 200, { ...s, version: await modelVersion(await modelFile(s.id)) });
  },

  'POST /api/sessions/delete': async (req, res) => {
    if (HOSTED) return json(res, 400, { error: 'sessions are local-only' });
    const { id } = await body(req);
    try { await deleteSession(WORK, id); json(res, 200, { ok: true }); }
    catch (e) { json(res, 400, { error: String(e.message || e) }); }
  },

  /* Probe an OpenAI-compatible endpoint and list the models it serves. */
  'POST /api/probe': async (req, res) => {
    if (HOSTED) return json(res, 400, { error: 'not available on a hosted deployment' });
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
    json(res, 200, { hosted: false, servers, ollama: await which('ollama'), lmstudio: await lmsBin() });
  },

  'POST /api/local/eject': async (req, res) => {
    if (HOSTED) return json(res, 200, { ejected: [] });
    const { baseUrl, model } = await body(req);
    json(res, 200, { ejected: await ejectOthers(baseUrl, model) });
  },

  /* Start Ollama and LM Studio's server for the user instead of telling them to
     open a terminal. LM Studio's app running is not enough: its models only reach
     the picker once its server listens on 1234, and nothing here could start it. */
  'POST /api/local/start': async (req, res) => {
    if (HOSTED) return json(res, 400, { ok: false, error: 'not available on a hosted deployment' });
    const [ol, lms] = await Promise.all([which('ollama'), lmsBin()]);
    if (!ol && !lms) return json(res, 200, { ok: false,
      error: 'Neither Ollama nor LM Studio is installed. Install one (https://ollama.com/download or https://lmstudio.ai), then press Start again.' });
    const bring = async (bin, base, args) => {
      if (!bin) return undefined;                 // not installed: nothing to start
      const up = await probeOai(base, '', 1200);
      if (up.ok) return up.models;
      spawn(bin, args, { detached: true, stdio: 'ignore' }).unref();
      for (let i = 0; i < 25; i++) {
        await sleep(400);
        const r = await probeOai(base, '', 1000);
        if (r.ok) return r.models;
      }
      return null;
    };
    const got = await Promise.all([bring(ol, OLLAMA, ['serve']), bring(lms, LMSTUDIO, ['server', 'start'])]);
    if (!got.some(Array.isArray))
      return json(res, 200, { ok: false, error: 'started the local servers, but nothing came up on 11434 or 1234' });
    json(res, 200, { ok: true, models: got.filter(Array.isArray).flat() });
  },

  /* The Settings "Test" button: one fixed routing call to the chosen provider, which
     should say tellurium. For Layla it also warms the worker (the model load). */
  'POST /api/router/test': async (req, res) => {
    if (HOSTED) return json(res, 400, { ok: false, error: 'not available on a hosted deployment' });
    const { key, provider } = await body(req);
    if (provider !== 'laya' && !key) return json(res, 400, { ok: false, error: 'the key is empty' });
    const t0 = Date.now();
    const state = { request: 'simulate this model for 100 seconds', loaded: [], recent: [],
                    model: 'has model', step: 0 };
    try {
      const p = provider === 'laya' ? await laya({ root: ROOT, state, questions: await questions(ROOT) })
        : await jev({ key, questions: await questions(ROOT), signal: AbortSignal.timeout(10000), state });
      json(res, 200, { ok: true, ms: Date.now() - t0, p });
    } catch (e) {
      json(res, 200, { ok: false, error: e?.name === 'TimeoutError' ? 'Jev timed out' : String(e?.message || e) });
    }
  },

  /* Server-sent events: one agent turn, streamed. */
  'POST /api/chat': async (req, res) => {
    const { message, sessionId, sessionDirId, model, env, runtime, chatCfg,
            scratchDir, useWorkflow = true, resume = false, router: routerCfg } = await body(req);
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
    // a model picked mid-session: free the GPU of the one it replaces before loading this one
    if (runtime === 'openai') await ejectOthers(chatCfg.baseUrl, chatCfg.model).catch(() => {});
    let scratch = RUNS;
    try { scratch = await resolveScratch(scratchDir); }
    catch (e) { return json(res, 400, { error: 'Working folder: ' + e.message +
      ' — pick another in Settings, or clear it to use the default.' }); }

    // The project's own folder is where its memory (history.md) and its scratch live.
    // history.md is the whole memory: it goes in the system prompt, and the model gets
    // no separate message history — one copy of each turn, never two.
    let sdir = null;
    if (sessionDirId) {
      try { sdir = await sessionDir(WORK, sessionDirId); }
      catch (e) { return json(res, 400, { error: 'Project: ' + e.message }); }
    }
    if (sdir && !existsSync(join(sdir, 'session.json'))) return json(res, 400, { error: 'no such project: ' + sessionDirId });
    const memory = sdir ? await readHistory(sdir) : '';
    // A working folder the user picked in Settings wins over the project's own
    // folder; the project folder is only the fallback scratch.
    if (sdir && !scratchDir) scratch = sdir;
    // in a project the agent edits that project's model, not the default one
    const mfile = sdir ? join(sdir, 'model.txt') : MODEL_FILE;
    const modelPath = relative(ROOT, mfile);
    const before = await readFile(mfile, 'utf8').catch(()=> '');

    res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8',
                         'cache-control': 'no-cache', connection: 'keep-alive',
                         'x-accel-buffering': 'no' });
    const send = o => { if (!res.writableEnded) res.write(`data: ${JSON.stringify(o)}\n\n`); };
    const ka = setInterval(() => { if (!res.writableEnded) res.write(': ping\n\n'); }, 15000);
    /* A local model turn runs for many minutes with nobody touching the Mac, and idle
       sleep cut one mid-step — measured (pmset -g log): display off 19:03:41, idle
       sleep 19:05:55; Chrome dropped the stream as "network error" and the run was
       killed. Hold off idle sleep for the turn only (-w: never outlives the server;
       the display may still sleep). */
    const awake = process.platform === 'darwin' && !HOSTED
      ? spawn('caffeinate', ['-i', '-w', String(process.pid)], { stdio: 'ignore' }).on('error', () => {})
      : null;
    const done = () => { clearInterval(ka); awake?.kill(); };

    /* The AI's edits to the model reach the editor as they happen, not when the turn
       ends: a local 27B turn runs for many minutes, and a turn that is stopped or cut
       off by a restart never ends at all — so its edits never showed. The folder is
       watched rather than the file, because a write that replaces the file (a rename
       into place) ends a watch on the file itself. */
    // Serialized: fs.watch fires without waiting for the previous push's read, and
    // 'result' also needs a push before it can send — two unserialized callers would
    // race and could deliver an older read last.
    let shown = before;
    let pq = Promise.resolve();
    const pushModel = () => (pq = pq.then(async () => {
      const now = await readFile(mfile, 'utf8').catch(() => null);
      if (now == null || now === shown) return;
      shown = now;
      if (editorEcho(mfile, now)) return;   // the user's own recent edit
      send({ type: 'model_changed', src: now, version: await modelVersion(mfile) });
    }));
    let watcher = null;
    try { watcher = watch(dirname(mfile), (e, name) => { if (!name || name === 'model.txt') pushModel(); }); }
    catch (e) { console.error('[watch]', e.message); }
    const unwatch = () => { watcher?.close(); watcher = null; };

    // Accumulated across the whole turn, appended to history.md when it ends. A
    // whole-block re-send (Claude Code's final assistant message) repeats what the
    // deltas already streamed, so drop it rather than doubling the text.
    let thoughts = '', answer = '';

    // Events also arrive out of order relative to each other (each onEvent call is
    // its own async invocation), so they're queued too: 'result' must not reach the
    // browser before the model_changed push it triggers below.
    let eq = Promise.resolve();
    const onEvent = raw => (eq = eq.then(() => handle(raw)).catch(e => console.error('[event]', e)));
    const handle = async raw => {
        const ev = runtime === 'openai' ? raw : toUiEvent(raw);
        if (ev?.type === 'result') await pushModel();
        if (ev) send(ev);
        if (ev?.type === 'thinking' && ev.text &&
            !(ev.whole && thoughts.includes(ev.text.trim().slice(0, 60))))
          thoughts += (ev.whole && thoughts && !thoughts.endsWith('\n') ? '\n\n' : '') + ev.text;
        if (ev?.type === 'delta' && ev.text) answer += ev.text;
        if (ev?.type === 'result' && ev.text) answer = ev.text;
        if (raw.type === 'done') {
          // one last look, in case the final write landed after the watcher's last event
          unwatch();
          await pushModel();

          /* Persisting memory must never fail the turn. Every turn that ends — answered,
             cut off, failed or stopped — is written at once; the fold then runs in the
             background, so neither the chat nor the next turn waits for the model. */
          if (sdir) try {
            await appendHistory(sdir, turnLines(message, thoughts, answer));
          } catch (e) { console.error('[history]', e.message); }
          await release();
          if (sdir) compressHistory(sdir, (sum, batch) => compactWith({ runtime, chatCfg, model }, sum, batch))
            .catch(e => console.error('[history fold]', e.message));

          done();
          if (!res.writableEnded) res.end();
        }
      };

    // The Skill router (backend/router.mjs), if switched on in Settings. The local
    // agent routes at every step itself; the Claude CLI runs its own tool loop, so it
    // is routed once, here, before the turn. The key is never logged.
    const router = active(routerCfg)
      ? s => route({ cfg: routerCfg, root: ROOT, request: message, hasModel: !!before.trim(), ...s })
      : null;
    let routed = '';
    if (router && runtime !== 'openai') {
      const r = await router({});
      send({ type: 'log', text: logLine(r) });
      routed = hintLine(r.hint) + await autoBlock(r.auto, ROOT);
    }

    // The awaits above (readHistory can wait behind a prior turn's compaction) can
    // outlast the client; 'close' has then already fired, so never start the agent.
    if (res.destroyed) { done(); unwatch(); return; }

    // The project may be renamed while this turn runs: hold its folder so the old path
    // keeps working (sessions.mjs holdDir) until the turn's history is written.
    const release = sdir ? holdDir(sdir) : async () => {};

    // any throw from here on must still reach the browser as an SSE frame
    process.nextTick(() => {});
    const run = runtime === 'openai'
      ? runLocalAgent({ root: ROOT, prompt: message + SKILL_NOTE, chatCfg, router,
                        useWorkflow, liveModel: before, modelPath, te, scratch, summary: memory, onEvent })
      : runAgent({ root: ROOT, prompt: message + SKILL_NOTE + routed, sessionId, model, env: env || {},
                   useWorkflow, liveModel: before, modelPath, scratch, summary: memory, resume, onEvent });
    send({ type: 'session', sessionId: run.sessionId ?? sessionId ?? null, runtime: runtime || 'claude-code' });
    // req 'close' fires once the body is read (long before the client disconnects);
    // res 'close' is what actually tracks the SSE connection. writableFinished is
    // true when we ended it ourselves (the 'done' branch above), so a normal finish
    // doesn't also kill an already-finished run.
    res.on('close', () => { done(); unwatch(); if (!res.writableFinished) run.kill(); });
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
    if (!res.headersSent) json(res, e.status || 500, { error: String(e.message || e) });
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
