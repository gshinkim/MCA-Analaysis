/* node backend/sessions-memory.test.mjs
   Boots the real server (like sessions-routes.test.mjs) and a stub OpenAI-compatible
   server (like local-agent.test.mjs), then drives several REAL turns through the real
   /api/chat SSE endpoint — not the pure summaryStrategy/buildTurn helpers those other
   files already pin. Every prior bug in this feature (five so far) passed a 13/13
   green suite of pure-helper tests while the real call site did something else; this
   is the test that actually walks the call site.

   It reproduces what the client (web/js/chat.mjs) does around a turn: sends the
   in-memory history, and on a 'compacted' event trims that history to the last 12
   messages exactly the way chat.mjs's handler does — no earlier, no later. */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, rm, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORK = join(ROOT, 'workspace');
const PORT = 5197;
const url = p => `http://127.0.0.1:${PORT}${p}`;
const SID = 'test-memory-cycle';                 // must not collide with real user data
const SDIR = join(WORK, 'runs', SID);
const SUMMARY_PATH = join(SDIR, 'summary.md');

const beforeModel = await readFile(join(WORK, 'model.txt'), 'utf8').catch(() => '');
const beforeSettings = await readFile(join(WORK, 'settings.json'), 'utf8').catch(() => '');
await rm(SDIR, { recursive: true, force: true });   // in case a previous failed run left it

/* A stub OpenAI-compatible server. Two kinds of request land on it:
   - a turn request (has `tools`): answer immediately, echoing the live user prompt
     back — the model never calls a tool, so the turn ends in one step.
   - a compaction request (no `tools`, only Chat.complete's plain completion): echo
     the WHOLE prompt it was given back as the "compressed" summary. Real compression
     would be concise; echoing is what lets this test see, mechanically, whether a
     later turn's prevSummary text (and the marker inside it) survived into the next
     compaction untouched — which is exactly what defect 2 destroyed. */
let compressCalls = 0, turnCalls = 0;
const stub = createServer((req, res) => {
  let b = '';
  req.on('data', c => (b += c));
  req.on('end', () => {
    let body; try { body = JSON.parse(b); } catch { body = {}; }
    const lastUser = [...(body.messages ?? [])].reverse().find(m => m.role === 'user');
    let content;
    if (body.tools?.length) { turnCalls++; content = 'Answered: ' + (lastUser?.content ?? ''); }
    else { compressCalls++; content = 'SUMMARY: ' + (lastUser?.content ?? ''); }
    res.writeHead(200, { 'content-type': 'text/event-stream' });
    res.end('data: ' + JSON.stringify({ choices: [{ delta: { content } }] }) + '\n\ndata: [DONE]\n\n');
  });
});
await new Promise(r => stub.listen(0, '127.0.0.1', r));
const stubUrl = 'http://127.0.0.1:' + stub.address().port;

const srv = spawn('node', [join(ROOT, 'backend/server.mjs')],
                  { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
const up = async () => { for (let i = 0; i < 60; i++) {
  if (await fetch(url('/api/health')).then(() => true).catch(() => false)) return;
  await new Promise(r => setTimeout(r, 150)); } throw new Error('server never came up'); };

/* Drives one real turn through /api/chat and collects every SSE event. */
async function chatTurn(history, message) {
  const res = await fetch(url('/api/chat'), { method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message, sessionId: null, sessionDirId: SID, resume: false,
      runtime: 'openai', chatCfg: { baseUrl: stubUrl, model: 'stub' }, history,
      useWorkflow: false }) });
  if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error('chat failed: ' + (j.error ?? res.status)); }
  // Read until the connection actually closes, not just until a 'done' frame is
  // seen on the wire: server.mjs sends that frame BEFORE it awaits writing
  // summary.md/thinking.md, and only calls res.end() once that write settles.
  // Stopping early races the assertions below against the server's own disk write.
  const events = [];
  const rd = res.body.getReader(), dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { value, done } = await rd.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n\n')) >= 0) {
      const frame = buf.slice(0, i); buf = buf.slice(i + 2);
      for (const line of frame.split('\n')) {
        if (!line.startsWith('data:')) continue;
        try { events.push(JSON.parse(line.slice(5).trim())); } catch {}
      }
    }
  }
  return events;
}

try {
  await up();

  /* Runs one real turn, mirroring chat.mjs's bookkeeping around it: push the new
     exchange onto `hist` after the turn, trimming first if (and only if) the server
     actually folded something this turn — exactly what the 'compacted' handler does,
     no earlier and no later (trimming before the fold is what caused the loop bug
     buildTurn's own test guards against). Returns whether this turn compacted. */
  async function runTurn(hist, label, marker) {
    const message = `${label} question, remember ${marker}`;
    const events = await chatTurn(hist, message);
    const fatal = events.find(e => e.type === 'fatal');
    assert.ok(!fatal, label + ' must not fail: ' + fatal?.error);
    const compactedEv = events.filter(e => e.type === 'compacted');
    const resultEv = events.find(e => e.type === 'result');
    if (compactedEv.length && hist.length > 12) hist.splice(0, hist.length - 12);
    hist.push({ role: 'user', content: message });
    hist.push({ role: 'assistant', content: resultEv?.text ?? '' });
    return compactedEv.length > 0;
  }

  // ---- cycle 1: grow a conversation past KEEP(12) until it compacts ----
  let hist1 = [];
  let turn = 0, recordTurnsCycle1 = 0, compacted1 = false;
  while (!compacted1 && turn < 40) {
    turn++;
    compacted1 = await runTurn(hist1, 'cycle1-turn' + turn, 'CYCLE-MARK-1');
    if (!compacted1) recordTurnsCycle1++;

    // DEFECT 1 — the client now sends sessionDirId (pendingId()) before any save has
    // ever happened, so the very first turn of a brand-new session must already have
    // written summary.md. Before the fix, sdir was null on turn 1 and nothing at all
    // was written here.
    if (turn === 1) {
      const st = await stat(SUMMARY_PATH).catch(() => null);
      assert.ok(st, 'Defect 1: the first turn of a fresh session must write summary.md');
    }
  }
  assert.ok(compacted1, 'cycle 1 never compacted within 40 turns');
  const afterCycle1 = await readFile(SUMMARY_PATH, 'utf8');
  assert.ok(afterCycle1.trim().length > 0, 'summary.md must be non-empty right after cycle 1');
  assert.match(afterCycle1, /CYCLE-MARK-1\b/, 'cycle 1 must fold in its own content');

  // ---- a NEW chat thread in the SAME session folder ----
  // This is the real trigger for defect 2, not just "the very next turn": a session
  // folder's summary.md is shared by the whole session, but `history` belongs to one
  // chat thread (web/js/chat.mjs's `c.history` — see makeChat()/the chat picker).
  // Starting a second thread sends a short (<=12) history against a sdir that already
  // holds cycle 1's compressed memory — exactly the 'record' branch that used to wipe
  // summary.md unconditionally. If it does, cycle 2's compression call below reads an
  // empty prevSummary and CYCLE-MARK-1 is gone for good.
  let hist2 = [];
  turn = 0;
  let recordTurnsCycle2 = 0, compacted2 = false;
  while (!compacted2 && turn < 40) {
    turn++;
    compacted2 = await runTurn(hist2, 'cycle2-turn' + turn, 'CYCLE-MARK-2');
    if (!compacted2) recordTurnsCycle2++;
  }
  assert.ok(compacted2, 'cycle 2 never compacted within 40 turns');
  // sanity: the defect only bites if a 'record' turn actually ran against a
  // non-empty summary.md in between — make sure this test isn't vacuous
  assert.ok(recordTurnsCycle2 >= 1,
    'sanity: the new thread must take at least one record-strategy turn before it ' +
    'compacts, or this test never exercises defect 2 at all');

  const afterCycle2 = await readFile(SUMMARY_PATH, 'utf8');
  assert.ok(afterCycle2.trim().length > 0, 'summary.md must be non-empty right after cycle 2');
  // DEFECT 2 regression guard: cycle 1's content must still be represented.
  assert.match(afterCycle2, /CYCLE-MARK-1\b/,
    'Defect 2 regression: content compressed in cycle 1 must still be represented after ' +
    'cycle 2 — it must not have been wiped by an intervening record-strategy turn');
  assert.match(afterCycle2, /CYCLE-MARK-2\b/, 'cycle 2 must also fold in its own content');

  assert.ok(compressCalls >= 2, 'the stub must have served at least 2 compression calls');
  assert.ok(turnCalls >= 2, 'the stub must have served real turn requests too');

  console.log('sessions memory ok (' + recordTurnsCycle1 + '+' + recordTurnsCycle2 +
              ' record turns, ' + turnCalls + ' turns, ' + compressCalls + ' compression calls)');
} finally {
  srv.kill();
  stub.close();
  await rm(SDIR, { recursive: true, force: true });
  if (beforeModel) await writeFile(join(WORK, 'model.txt'), beforeModel);
  if (beforeSettings) await writeFile(join(WORK, 'settings.json'), beforeSettings);
}
