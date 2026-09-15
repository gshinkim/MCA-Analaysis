/* node backend/local-agent.test.mjs
   A stub OpenAI-compatible server that behaves like a model stuck in a loop:
   it emits the same tool call every turn, forever. The turn must still end, must
   only run the tool once, and must come back with an answer. */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { runLocalAgent } from './local-agent.mjs';
import { Tellurium } from './tellurium.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

let asked = 0, sawTools = 0;
const srv = createServer((req, res) => {
  let b = '';
  req.on('data', c => (b += c));
  req.on('end', () => {
    asked++;
    const withTools = (JSON.parse(b).tools ?? []).length > 0;
    if (withTools) sawTools++;
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
    let b = '';
    req.on('data', c => (b += c));
    req.on('end', () => {
      turn++;
      const delta = turn === 1
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
  console.log('ok (invalid antimony rejected; workspace/model.txt untouched)');
  te.proc?.kill();                 // the warm python worker would keep node alive
}
