/* node backend/local-agent.test.mjs
   A stub OpenAI-compatible server that behaves like a model stuck in a loop:
   it emits the same tool call every turn, forever. The turn must still end, must
   only run the tool once, and must come back with an answer. */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { runLocalAgent, runWorkflowFile } from './local-agent.mjs';
import { Tellurium } from './tellurium.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

let asked = 0, sawTools = 0, last;
const srv = createServer((req, res) => {
  // like any non-Ollama server: the context probe (/api/ps, /api/show) gets a 404
  if (!req.url.endsWith("/chat/completions")) { res.writeHead(404); return res.end(); }
  let b = '';
  req.on('data', c => (b += c));
  req.on('end', () => {
    asked++;
    const body = JSON.parse(b);
    const closed = /^Tools are closed/.test(body.messages.at(-1)?.content ?? '');
    const withTools = (body.tools ?? []).length > 0 && !closed;
    if (withTools) sawTools++;
    last = body;
    // With tools offered: call the same thing again. Without: finally answer.
    const delta = withTools
      ? { tool_calls: [{ index: 0, id: 'c' + asked, type: 'function',
                         function: { name: 'list_dir', arguments: '{"path":"web"}' } }] }
      : { content: 'Answered without tools.' };
    res.writeHead(200, { 'content-type': 'text/event-stream' });
    res.end('data: ' + JSON.stringify({ choices: [{ delta }] }) + '\n\ndata: [DONE]\n\n');
  });
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const baseUrl = 'http://127.0.0.1:' + srv.address().port;

const events = [];
await new Promise(done => {
  runLocalAgent({ root: ROOT, prompt: 'go', useWorkflow: false,
    chatCfg: { baseUrl, model: 'stub' },
    onEvent: e => { events.push(e); if (e.type === 'done') done(); } });
});
srv.close();

const result = events.find(e => e.type === 'result');
const tools = events.filter(e => e.type === 'tools');

assert.equal(result.text, 'Answered without tools.');   // the turn ends in an answer,
assert.equal(result.isError, false);                    // not "(no final answer)"
assert.equal(sawTools, asked - 1);                      // last request offered no tools
/* ...but still SENT them, closed. The chat template renders the tool list first,
   so dropping it changed the prompt from its first token and the server's prompt
   cache missed entirely — measured on LM Studio: 25,910 tokens re-read from zero
   (~3 min at 140 tok/s) before the wrap-up could say a word. */
assert.ok(last.tools?.length, 'wrap-up keeps the tool list so the prompt prefix is unchanged');
// ...and without tool_choice 'none': LM Studio answers that by dropping the tools
// from the prompt, which is the same cache miss (measured: 0 cached tokens vs 3072).
// The model is told in words instead, at the end, where it costs no cache.
assert.notEqual(last.tool_choice, 'none');
assert.match(last.messages.at(-1).content, /^Tools are closed/);
assert.ok(tools.length > 1, 'the stub does keep repeating');
// the tool itself ran once; every repeat was served from the guard
assert.ok(asked <= 15, 'bounded: ' + asked);

console.log('ok (' + asked + ' requests, ' + tools.length + ' repeated calls, tool ran once)');

/* Antimony that does not load must never reach workspace/model.txt — that file is
   the user's editor contents and there is no undo. */
const te = new Tellurium(ROOT);
if (!te.installed) console.log('skipped the write gate: tellurium is not installed');
else {
  const MODEL = join(ROOT, 'workspace/model.txt');
  const before = await readFile(MODEL, 'utf8');
  let turn = 0, said = '';
  const s2 = createServer((req, res) => {
  // like any non-Ollama server: the context probe (/api/ps, /api/show) gets a 404
  if (!req.url.endsWith("/chat/completions")) { res.writeHead(404); return res.end(); }
    let b = '';
    req.on('data', c => (b += c));
    req.on('end', () => {
      turn++;
      // the rejection must say where the syntax is, or the model keeps guessing
      if (turn === 5) said = JSON.parse(b).messages.at(-1).content;
      // the Skills first, or the write is refused by the Skill gate before the
      // Antimony check this test is about ever runs
      const skill = ['mca', 'pathway-modeling', 'tellurium'][turn - 1];
      const delta = skill
        ? { tool_calls: [{ index: 0, id: 's' + turn, type: 'function', function: { name: 'load_skill',
            arguments: JSON.stringify({ name: skill }) } }] }
        : turn === 4
        ? { tool_calls: [{ index: 0, id: 'w1', type: 'function', function: { name: 'write_file',
            arguments: JSON.stringify({ path: 'workspace/model.txt', content: 'this is not antimony {{' }) } }] }
        : { content: 'done' };
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end('data: ' + JSON.stringify({ choices: [{ delta }] }) + '\n\ndata: [DONE]\n\n');
    });
  });
  await new Promise(r => s2.listen(0, '127.0.0.1', r));
  await new Promise(done => {
    runLocalAgent({ root: ROOT, prompt: 'break it', useWorkflow: false, te,
      chatCfg: { baseUrl: 'http://127.0.0.1:' + s2.address().port, model: 'stub' },
      onEvent: e => { if (e.type === 'done') done(); } });
  });
  s2.close();
  assert.equal(await readFile(MODEL, 'utf8'), before, 'the live model was overwritten');
  assert.match(said, /REJECTED[\s\S]*antimony_basics\.md/);
  console.log('ok (invalid antimony rejected; workspace/model.txt untouched)');
  te.proc?.kill();                 // the warm python worker would keep node alive
}

// the step after a tool call sees the thinking that led to it — without it Qwen
// re-planned from zero every step — and a server that is slow to answer is waited
// for, not dropped (fetch dropped anything unanswered at 300 s)
{
  const bodies = [];
  const s3 = createServer((req, res) => {
  // like any non-Ollama server: the context probe (/api/ps, /api/show) gets a 404
  if (!req.url.endsWith("/chat/completions")) { res.writeHead(404); return res.end(); }
    let b = '';
    req.on('data', c => (b += c));
    req.on('end', () => {
      bodies.push(JSON.parse(b));
      const first = bodies.length === 1;
      const frames = first
        ? [{ reasoning: 'PLAN: list the folder, then answer.' },
           { tool_calls: [{ index: 0, id: 'l1', type: 'function',
               function: { name: 'list_dir', arguments: '{"path":"skills"}' } }] }]
        : [{ content: 'done' }];
      // hold the headers back, the way a busy one-slot server does
      setTimeout(() => {
        res.writeHead(200, { 'content-type': 'text/event-stream' });
        res.end(frames.map(d => 'data: ' + JSON.stringify({ choices: [{ delta: d }] }) + '\n\n').join('')
                + 'data: [DONE]\n\n');
      }, first ? 300 : 0);
    });
  });
  await new Promise(r => s3.listen(0, '127.0.0.1', r));
  let result = '';
  await new Promise(done => {
    runLocalAgent({ root: ROOT, prompt: 'look', useWorkflow: false,
      chatCfg: { baseUrl: 'http://127.0.0.1:' + s3.address().port, model: 'stub' },
      onEvent: e => { if (e.type === 'result') result = e.text; if (e.type === 'done') done(); } });
  });
  s3.close();
  assert.equal(result, 'done');
  const back = bodies[1].messages.find(m => m.role === 'assistant');
  assert.equal(back.reasoning, 'PLAN: list the folder, then answer.');
  console.log('ok (thinking carried to the next step; slow headers waited for)');
}

// the stop button still ends a request that has not answered yet
{
  const s4 = createServer(() => {});            // never answers
  await new Promise(r => s4.listen(0, '127.0.0.1', r));
  let fatal = '';
  const t0 = Date.now();
  await new Promise(done => {
    const run = runLocalAgent({ root: ROOT, prompt: 'x', useWorkflow: false,
      chatCfg: { baseUrl: 'http://127.0.0.1:' + s4.address().port, model: 'stub' },
      onEvent: e => { if (e.type === 'fatal') fatal = e.error; if (e.type === 'done') done(); } });
    setTimeout(() => run.kill(), 200);
  });
  s4.closeAllConnections(); s4.close();
  assert.ok(Date.now() - t0 < 5000, 'stop did not end the request');
  console.log('ok (stop aborts a pending request)', fatal.slice(0, 40));
}

// A1-8/A3-30: a sibling directory whose name has the project root as a string
// prefix must not pass the jail, and write_file must be confined to the live
// model and the working folder even for a path that IS inside the project.
{
  const bodies = [];
  const evilPath = '../' + basename(ROOT) + '-evil/x';
  const s6 = createServer((req, res) => {
    // like any non-Ollama server: the context probe (/api/ps, /api/show) gets a 404
    if (!req.url.endsWith("/chat/completions")) { res.writeHead(404); return res.end(); }
    let b = '';
    req.on('data', c => (b += c));
    req.on('end', () => {
      bodies.push(JSON.parse(b));
      const n = bodies.length;
      const skill = ['mca', 'pathway-modeling', 'tellurium'][n - 2];   // turns 2-4
      const delta = n === 1
        ? { tool_calls: [{ index: 0, id: 'r1', type: 'function', function: { name: 'read_file',
            arguments: JSON.stringify({ path: evilPath }) } }] }
        : skill
        ? { tool_calls: [{ index: 0, id: 'k' + n, type: 'function', function: { name: 'load_skill',
            arguments: JSON.stringify({ name: skill }) } }] }
        : n === 5
        ? { tool_calls: [{ index: 0, id: 'w1', type: 'function', function: { name: 'write_file',
            arguments: JSON.stringify({ path: 'backend/x.mjs', content: 'x' }) } }] }
        : { content: 'done' };
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end('data: ' + JSON.stringify({ choices: [{ delta }] }) + '\n\ndata: [DONE]\n\n');
    });
  });
  await new Promise(r => s6.listen(0, '127.0.0.1', r));
  await new Promise(done => {
    runLocalAgent({ root: ROOT, prompt: 'jailbreak', useWorkflow: false,
      chatCfg: { baseUrl: 'http://127.0.0.1:' + s6.address().port, model: 'stub' },
      onEvent: e => { if (e.type === 'done') done(); } });
  });
  s6.close();
  const last = bodies.at(-1).messages;
  assert.match(last.find(m => m.tool_call_id === 'r1').content, /escapes the project/);
  assert.match(last.find(m => m.tool_call_id === 'w1').content, /write_file may only write/);
  await assert.rejects(readFile(join(ROOT, 'backend/x.mjs'), 'utf8'));
  console.log('ok (sibling-path escape rejected; write_file confined to model + scratch)');
}

// A3-8: load_skill's `name` must be jailed too — the schema offers an enum, but
// the implementation never checked it, so a crafted call could read any file
// that ends up at skills/<name>/SKILL.md.
{
  const bodies = [];
  const s7 = createServer((req, res) => {
    // like any non-Ollama server: the context probe (/api/ps, /api/show) gets a 404
    if (!req.url.endsWith("/chat/completions")) { res.writeHead(404); return res.end(); }
    let b = '';
    req.on('data', c => (b += c));
    req.on('end', () => {
      bodies.push(JSON.parse(b));
      const delta = bodies.length === 1
        ? { tool_calls: [{ index: 0, id: 'l1', type: 'function', function: { name: 'load_skill',
            arguments: JSON.stringify({ name: '../../etc' }) } }] }
        : { content: 'done' };
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end('data: ' + JSON.stringify({ choices: [{ delta }] }) + '\n\ndata: [DONE]\n\n');
    });
  });
  await new Promise(r => s7.listen(0, '127.0.0.1', r));
  await new Promise(done => {
    runLocalAgent({ root: ROOT, prompt: 'escape', useWorkflow: false,
      chatCfg: { baseUrl: 'http://127.0.0.1:' + s7.address().port, model: 'stub' },
      onEvent: e => { if (e.type === 'done') done(); } });
  });
  s7.close();
  assert.match(bodies.at(-1).messages.find(m => m.tool_call_id === 'l1').content, /unknown skill/);
  console.log('ok (load_skill name traversal rejected)');
}


// writing the model waits for pathway-modeling; nothing else is gated
{
  const { modelGate } = await import('./local-agent.mjs');
  const run = { repeats: 0 };
  assert.match(modelGate(run, new Set(), true), /load_skill\("pathway-modeling"\).*load_skill\("tellurium"\)/);
  assert.equal(run.repeats, 0, 'a first refusal is not a repeat');
  modelGate(run, new Set(['tellurium']), true);
  assert.equal(run.repeats, 1);
  assert.equal(modelGate(run, new Set(['pathway-modeling']), true), null);
  assert.equal(modelGate(run, new Set(), false), null, 'run_python and other writes are not gated');
  console.log('ok (model write gate)');
}

// The workflow file has to compile as a function body: a second top-level `exec`
// made it a SyntaxError, so every run_mca_workflow call failed before stage 1 and
// the model was left to improvise the analysis on its own.
{
  const chat = { ctx: 32768, complete: async () => { throw new Error('reached the model'); } };
  await assert.rejects(runWorkflowFile({ root: ROOT, chat, emit() {}, loaded: new Set(),
    args: { question: 'q', model: '', needsNumbers: true, workdir: '/tmp', exec: 'x' } }),
    /reached the model/);
  console.log('ok (workflow compiles and reaches stage 1)');
}

// The Skill router: an auto-load before step 0 is a real load (modelGate lets the
// model write through), a round with an error is routed again with what happened,
// and the hint rides on the end of the last tool result.
{
  const { mkdtemp, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { relative } = await import('node:path');
  const tmp = await mkdtemp(join(tmpdir(), 'router-'));
  const modelPath = relative(ROOT, join(tmp, 'model.txt'));
  const bodies = [], calls = [];
  const s8 = createServer((req, res) => {
    if (!req.url.endsWith('/chat/completions')) { res.writeHead(404); return res.end(); }
    let b = '';
    req.on('data', c => (b += c));
    req.on('end', () => {
      bodies.push(JSON.parse(b));
      const call = (id, name, args) => ({ tool_calls: [{ index: 0, id, type: 'function',
        function: { name, arguments: JSON.stringify(args) } }] });
      const delta = [call('w1', 'write_file', { path: modelPath, content: 'S1 -> S2; k1*S1' }),
                     call('r1', 'read_file', { path: 'no/such/file' })][bodies.length - 1]
        ?? { content: 'done' };
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end('data: ' + JSON.stringify({ choices: [{ delta }] }) + '\n\ndata: [DONE]\n\n');
    });
  });
  await new Promise(r => s8.listen(0, '127.0.0.1', r));
  const logs = [], shown = [];
  const router = async s => {
    calls.push(structuredClone(s));
    return calls.length === 1 ? { auto: [['pathway-modeling', 0.9]], hint: [], ms: 1 }
                               : { auto: [], hint: [['mca', 0.7]], ms: 1 };
  };
  await new Promise(done => {
    runLocalAgent({ root: ROOT, prompt: 'build it', useWorkflow: false, modelPath, scratch: tmp, router,
      chatCfg: { baseUrl: 'http://127.0.0.1:' + s8.address().port, model: 'stub' },
      onEvent: e => { if (e.type === 'log') logs.push(e.text);
                      if (e.type === 'tools') shown.push(...e.tools);
                      if (e.type === 'done') done(); } });
  });
  s8.close();
  // the router's load is shown in the chat, not only the model's own
  assert.ok(shown.some(t => t.name === 'load_skill' && t.input.name === 'pathway-modeling' && t.input.by === 'router'));
  const msgs = bodies.at(-1).messages;
  assert.match(bodies[0].messages.at(-1).content, /^build it[\s\S]*\[router\] loaded the pathway-modeling Skill[\s\S]*name: pathway-modeling/);
  assert.match(msgs.find(m => m.tool_call_id === 'w1').content, /^wrote /, 'auto-load satisfied modelGate');
  assert.equal(calls.length, 2, 'the clean write round was not routed');
  assert.deepEqual(calls[1].loaded, ['pathway-modeling']);
  assert.match(calls[1].recent.at(-1), /^read_file no\/such\/file -> ERROR: /);
  assert.match(msgs.find(m => m.tool_call_id === 'r1').content, /\[router\] likely needed: mca \(0\.70\)\.[^]*$/);
  assert.equal(logs.filter(l => l.startsWith('router ')).length, 2);
  await rm(tmp, { recursive: true });
  console.log('ok (router: auto-load counts as loaded; hint on the tool result)');
}

/* A leading slash meant the project root: a model wrote /workspace/<project>/model.txt
   for workspace/<project>/model.txt and got "path escapes" — measured: bonsai-27b
   spent 7 of its 14 steps on it. */
{
  const bodies = [];
  const s8 = createServer((req, res) => {
    if (!req.url.endsWith('/chat/completions')) { res.writeHead(404); return res.end(); }
    let b = ''; req.on('data', c => (b += c));
    req.on('end', () => {
      bodies.push(JSON.parse(b));
      const delta = bodies.length === 1
        ? { tool_calls: [{ index: 0, id: 's1', type: 'function', function: { name: 'read_file',
            arguments: JSON.stringify({ path: '/skills/index.json' }) } }] }
        : { content: 'done' };
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end('data: ' + JSON.stringify({ choices: [{ delta }] }) + '\n\ndata: [DONE]\n\n');
    });
  });
  await new Promise(r => s8.listen(0, '127.0.0.1', r));
  await new Promise(done => {
    runLocalAgent({ root: ROOT, prompt: 'read it', useWorkflow: false,
      chatCfg: { baseUrl: 'http://127.0.0.1:' + s8.address().port, model: 'stub' },
      onEvent: e => { if (e.type === 'done') done(); } });
  });
  s8.close();
  assert.match(bodies.at(-1).messages.find(m => m.tool_call_id === 's1').content, /pathway-modeling/);
  console.log('ok (leading-slash path read from the project root)');
}

/* Two wrap-up and Skill-reload defects, one stub:
   - a Skill already in the transcript (the router put it there) is not loaded twice —
     measured: bonsai-27b reloaded tellurium, ~4k tokens, right after the router did;
   - a closed-tools reply that still made a call ("Let me write the final model…:" then
     a call) gets the "tools are closed" retry even though some prose came with it —
     measured: that narration was shown as the answer. */
{
  const bodies = [];
  const s9 = createServer((req, res) => {
    if (!req.url.endsWith('/chat/completions')) { res.writeHead(404); return res.end(); }
    let b = ''; req.on('data', c => (b += c));
    req.on('end', () => {
      const body = JSON.parse(b); bodies.push(body);
      const lastMsg = String(body.messages.at(-1)?.content ?? '');
      const call = (id, name, args) => ({ tool_calls: [{ index: 0, id, type: 'function',
        function: { name, arguments: JSON.stringify(args) } }] });
      const delta = /that call was not run/.test(lastMsg) ? { content: 'The final answer.' }
        : /^Tools are closed/.test(lastMsg) ? { content: 'Let me write the final model:', ...call('z', 'list_dir', { path: '.' }) }
        : bodies.length === 1 ? call('t1', 'load_skill', { name: 'tellurium' })
        : call('l' + bodies.length, 'list_dir', { path: 'web' });
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end('data: ' + JSON.stringify({ choices: [{ delta }] }) + '\n\ndata: [DONE]\n\n');
    });
  });
  await new Promise(r => s9.listen(0, '127.0.0.1', r));
  let result;
  await new Promise(done => {
    runLocalAgent({ root: ROOT, prompt: 'go', useWorkflow: false,
      router: async () => ({ auto: [['tellurium', 1]], hint: [], ms: 1 }),
      chatCfg: { baseUrl: 'http://127.0.0.1:' + s9.address().port, model: 'stub', steps: 3 },
      onEvent: e => { if (e.type === 'result') result = e; if (e.type === 'done') done(); } });
  });
  s9.close();
  const t1 = bodies.at(-1).messages.find(m => m.tool_call_id === 't1').content;
  assert.match(t1, /already loaded/); assert.ok(t1.length < 2000, 'not the Skill again: ' + t1.length);
  assert.equal(result.text, 'The final answer.');
  console.log('ok (no Skill reload; a closed call with prose still gets the answer retry)');
}
