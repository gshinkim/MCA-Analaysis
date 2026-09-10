/* node web/js/oai.test.mjs */
import assert from 'node:assert/strict';
import { thinkStream, textToolCalls, forHistory, mergeToolDeltas, callTool } from './oai.mjs';

const run = chunks => {
  const ev = [];
  const ts = thinkStream(e => ev.push(e));
  chunks.forEach(c => ts.push(c));
  return { ...ts.end(), thought: ev.filter(e => e.type === 'thinking').map(e => e.text).join(''),
           said: ev.filter(e => e.type === 'delta').map(e => e.text).join('') };
};

// inline <think>, split across chunk boundaries mid-tag
let r = run(['<th', 'ink>weigh', 'ing it</thi', 'nk>The answer.']);
assert.equal(r.content, 'The answer.');
assert.equal(r.reasoning, 'weighing it');
assert.equal(r.thought, 'weighing it');            // reached the thinking panel while streaming
assert.equal(r.said, 'The answer.');               // and never the answer bubble

// Qwen's template pre-opens the tag: a close arrives with no open
const ev = [];
{ const ts = thinkStream(e => ev.push(e));
  ['step one', ' step two</think>', 'Flux control sits in step 1.'].forEach(c => ts.push(c));
  r = ts.end(); }
assert.equal(r.reasoning, 'step one step two');
assert.equal(r.content, 'Flux control sits in step 1.');
assert.ok(ev.some(e => e.type === 'unthink'));     // tells the UI to move what it showed

// no tags at all: everything is the answer
r = run(['plain ', 'answer']);
assert.equal(r.content, 'plain answer');
assert.equal(r.reasoning, undefined);
assert.equal(r.thought, '');

const NAMES = ['load_skill', 'run_python'];
// Qwen/Hermes text form
assert.deepEqual(textToolCalls('<tool_call>{"name":"load_skill","arguments":{"name":"mca"}}</tool_call>', NAMES)
  .map(c => [c.function.name, c.function.arguments]), [['load_skill', '{"name":"mca"}']]);
// Gemma-style fenced JSON, with prose around it
assert.equal(textToolCalls('Sure, I will look it up.\n```json\n{"name": "load_skill", "parameters": {"name": "tellurium"}}\n```', NAMES)[0]
  .function.arguments, '{"name":"tellurium"}');
// bare object, no fence
assert.equal(textToolCalls('{"name":"run_python","arguments":{"code":"print(1)"}}', NAMES)[0].function.name, 'run_python');
// prose containing unrelated JSON is not a call
assert.deepEqual(textToolCalls('The steady state is {"S1": 3.2} as computed.', NAMES), []);
// a real answer is not a call
assert.deepEqual(textToolCalls('Step 1 holds most of the control.', NAMES), []);

// history carries no bookkeeping fields
assert.deepEqual(forHistory({ role: 'assistant', content: 'x', reasoning: 'y', finish_reason: 'stop' }),
                 { role: 'assistant', content: 'x' });

// an object-valued `arguments` must not stringify as [object Object]
assert.equal(mergeToolDeltas([], [{ index: 0, id: 'a', function: { name: 'run_python', arguments: { code: '1' } } }])[0]
  .function.arguments, '{"code":"1"}');

// a tool name the model invented must come back naming what does exist, not a
// TypeError about impl[name] — the model has to be able to recover from it
const impl = { read_model: async () => 'the model', boom: async () => { throw new Error('kaboom'); } };
const miss = await callTool(impl, 'Read', {});
assert.match(miss, /no tool called "Read"/);
assert.match(miss, /read_model/);                  // tells it what to call instead
assert.equal(await callTool(impl, 'read_model', {}), 'the model');
assert.equal(await callTool(impl, 'boom', {}), 'ERROR: kaboom');

console.log('ok');
