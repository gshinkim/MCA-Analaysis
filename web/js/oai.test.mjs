/* node web/js/oai.test.mjs */
import assert from 'node:assert/strict';
import { thinkStream, textToolCalls, forHistory, mergeToolDeltas, callTool, toolRunner,
         toolResult } from './oai.mjs';

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

// a real tool call round-trips as the tool role
const real = { id: 'call_1', type: 'function', function: { name: 'read_file', arguments: '{}' } };
assert.deepEqual(forHistory({ content: 'x', tool_calls: [real] }),
                 { role: 'assistant', content: 'x', tool_calls: [real] });
assert.deepEqual(toolResult(real, 'read_file', 'the text'),
                 { role: 'tool', tool_call_id: 'call_1', name: 'read_file', content: 'the text' });

// a call recovered from prose must NOT go back as tool_calls / a tool role: the
// runtime that produced it has no tool API, so its template would drop both and the
// model would never see the result
const fromText = textToolCalls('<tool_call>{"name":"run_python","arguments":{"code":"1"}}</tool_call>', NAMES)[0];
assert.deepEqual(forHistory({ content: 'call it', tool_calls: [fromText] }),
                 { role: 'assistant', content: 'call it' });
const back = toolResult(fromText, 'run_python', '42');
assert.equal(back.role, 'user');
assert.match(back.content, /run_python/);
assert.match(back.content, /42/);

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

// a repeated identical call is answered from memory and told so, instead of
// letting one bad call eat the whole step budget
let runs = 0;
const guarded = toolRunner({ run_python: async () => { runs++; return 'boom'; },
                             write_file: async () => 'wrote it',
                             read_file: async () => 'v' + runs }, ['write_file']);
assert.equal(await guarded('run_python', { code: 'x' }), 'boom');
const again = await guarded('run_python', { code: 'x' });
assert.equal(runs, 1);                             // not run a second time
assert.match(again, /already called run_python/);
assert.match(again, /boom/);                       // and still shown what it returned
assert.equal(await guarded('run_python', { code: 'y' }), 'boom');  // different args do run
assert.equal(runs, 2);

// a write invalidates the memory: reading back after an edit must not replay the
// pre-edit content
const g2 = toolRunner({ read_file: async () => 'v' + runs,
                        write_file: async () => { runs++; return 'ok'; } }, ['write_file']);
assert.equal(await g2('read_file', { path: 'm' }), 'v2');
await g2('write_file', { path: 'm', content: 'z' });
assert.equal(await g2('read_file', { path: 'm' }), 'v3');   // fresh, not the cached 'v2'

console.log('ok');

/* ---------------- wire defects found by probing real local servers ---------------- */

// A tool call with empty arguments is what a small model emits when it names a tool
// and stops. Echoed back verbatim, LM Studio answers HTTP 500 and the turn dies —
// measured: arguments:"" -> 500, arguments:"{}" -> 200.
{
  const h = forHistory({ role: 'assistant', content: 'x', tool_calls: [
    { id: 'z', type: 'function', function: { name: 'run_python', arguments: '' } }] });
  assert.equal(h.tool_calls[0].function.arguments, '{}');
  const bad = forHistory({ role: 'assistant', content: 'x', tool_calls: [
    { id: 'z', type: 'function', function: { name: 'run_python', arguments: '{"code":' } }] });
  assert.equal(bad.tool_calls[0].function.arguments, '{}');   // truncated JSON is not sendable
  const good = forHistory({ role: 'assistant', content: 'x', tool_calls: [
    { id: 'z', type: 'function', function: { name: 'run_python', arguments: '{"code":"1"}' } }] });
  assert.equal(good.tool_calls[0].function.arguments, '{"code":"1"}');  // valid args untouched
}

// llama.cpp/vLLM repeat the function name on every chunk; concatenating gives
// "run_pythonrun_python", which resolves to no tool and the model retries forever.
{
  const c = [];
  mergeToolDeltas(c, [{ index: 0, id: 'x', function: { name: 'run_python', arguments: '{"co' } }]);
  mergeToolDeltas(c, [{ index: 0, function: { name: 'run_python', arguments: 'de":"1"}' } }]);
  assert.equal(c[0].function.name, 'run_python');
  assert.equal(c[0].function.arguments, '{"code":"1"}');
}

// a name genuinely split across chunks must still assemble
{
  const c = [];
  mergeToolDeltas(c, [{ index: 0, function: { name: 'run_' } }]);
  mergeToolDeltas(c, [{ index: 0, function: { name: 'python' } }]);
  assert.equal(c[0].function.name, 'run_python');
}

// some servers resend the whole argument object every chunk
{
  const c = [];
  mergeToolDeltas(c, [{ index: 0, id: 'x', function: { name: 'read_file', arguments: '{"path":"a"}' } }]);
  mergeToolDeltas(c, [{ index: 0, function: { arguments: '{"path":"a"}' } }]);
  assert.equal(c[0].function.arguments, '{"path":"a"}');
}

// no `index` field: fragments continue the call being built instead of each
// becoming a new half-argument call
{
  const c = [];
  mergeToolDeltas(c, [{ id: 'y', function: { name: 'read_file', arguments: '{"path"' } }]);
  mergeToolDeltas(c, [{ function: { arguments: ':"a"}' } }]);
  assert.equal(c.length, 1);
  assert.equal(c[0].function.arguments, '{"path":"a"}');
}

// two distinct calls with no index still separate, because each names a tool
{
  const c = [];
  mergeToolDeltas(c, [{ function: { name: 'read_file', arguments: '{"path":"a"}' } }]);
  mergeToolDeltas(c, [{ function: { name: 'list_dir', arguments: '{"path":"b"}' } }]);
  assert.equal(c.length, 2);
}

// Qwen/Hermes templates emit this XML shape; it parsed as nothing, so the loop
// treated a tool call as the final answer
{
  const r = textToolCalls(
    '<tool_call>\n<function=run_python>\n<parameter=code>print(1)</parameter>\n</function>\n</tool_call>',
    ['run_python']);
  assert.equal(r.length, 1);
  assert.equal(r[0].function.name, 'run_python');
  assert.deepEqual(JSON.parse(r[0].function.arguments), { code: 'print(1)' });
}

/* ------------------------------- the budget ------------------------------- */
/* Settings -> Budget moves these. The defaults must reproduce exactly what the
   code hardcoded before there was a setting, or every existing install changes
   behaviour the moment it updates. */
{
  const { replyTokens, resultCap, stepBudget, BUDGET } = await import('./oai.mjs');
  for (const ctx of [2048, 8192, 32768]) {
    assert.equal(replyTokens(ctx), ctx >> 1, 'default reply share is half the window');
    assert.equal(resultCap(ctx), Math.max(1500, Math.round(ctx * 3.5 / 4)),
      'default result cap is a quarter of the window');
  }
  assert.equal(stepBudget(), BUDGET.steps, 'default step budget');
  // a share is a share: the same setting means the same thing at any window size
  assert.equal(replyTokens(8192, 25), 2048, 'reply share applied');
  assert.equal(replyTokens(32768, 25), 8192, 'the same share on a bigger window');
  // out-of-range settings are clamped, never sent to a server as nonsense
  assert.equal(replyTokens(8192, 500), replyTokens(8192, 90), 'reply share clamped high');
  assert.equal(replyTokens(8192, 1), replyTokens(8192, 10), 'reply share clamped low');
  assert.equal(stepBudget(9999), 40, 'steps clamped high');
  assert.equal(stepBudget(0), BUDGET.steps, 'zero means "unset", not "no steps"');
  // a reply may never be so small the model cannot answer at all
  assert.ok(replyTokens(512, 10) >= 256, 'reply floor holds on a tiny window');
  console.log('budget ok');
}

console.log('oai.test.mjs ok');

/* ---------------- streaming + context budget ---------------- */
import { readCompletion, fitMessages, resultCap, estTokens } from './oai.mjs';

const streamOf = (...chunks) => ({
  body: {
    getReader() {
      let i = 0;
      const enc = new TextEncoder();
      return { read: async () => (i < chunks.length
        ? { done: false, value: enc.encode(chunks[i++]) }
        : { done: true }) };
    },
  },
});

// a final frame with no trailing newline used to be dropped — and it is the one
// carrying the tool call
{
  const m = await readCompletion(streamOf(
    'data: {"choices":[{"delta":{"content":"hi"}}]}\n',
    'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"id":"a","function":{"name":"read_file","arguments":"{\\"path\\":\\"m\\"}"}}]}}]}'));
  assert.equal(m.tool_calls?.length, 1);
  assert.equal(m.tool_calls[0].function.name, 'read_file');
}

// a server that ignores stream:true returns one plain JSON body
{
  const m = await readCompletion(streamOf(
    '{"choices":[{"message":{"content":"the answer"},"finish_reason":"stop"}]}'));
  assert.equal(m.content, 'the answer');
  assert.equal(m.finish, 'stop');
}

// a tool call written inside <think> is still a tool call
{
  const m = await readCompletion(streamOf(
    'data: {"choices":[{"delta":{"content":"<think><tool_call>{\\"name\\":\\"read_file\\",\\"arguments\\":{\\"path\\":\\"m\\"}}</tool_call></think>"}}]}\n'),
    { toolNames: ['read_file'] });
  assert.equal(m.tool_calls?.length, 1);
}

// the budget: a transcript that outgrows the window is trimmed, never leaving a
// tool result whose call was cut away
{
  const big = 'x'.repeat(40000);
  const msgs = [{ role:'system', content:'sys' },
    { role:'user', content:'q' },
    { role:'assistant', content:'', tool_calls:[{id:'1',type:'function',function:{name:'read_file',arguments:'{}'}}] },
    { role:'tool', tool_call_id:'1', content: big },
    { role:'user', content:'follow up' }];
  const fit = fitMessages(msgs, 8192);
  assert.equal(fit[0].role, 'system');
  assert.ok(estTokens(fit) <= 8192);
  assert.notEqual(fit[1].role, 'tool');
  assert.ok(resultCap(8192) < 40000 && resultCap(8192) > 1500);
}

/* Trimming may never hand back a request with no user turn. Two big tool results
   (loading two Skills) outgrow the window, and dropping the oldest messages ate
   the question itself: the server answered HTTP 500 "no user query found in
   messages" and the turn died. The question is what the request is FOR, so it is
   pinned the way the system message is. */
{
  const big = 'x'.repeat(40000);
  const msgs = [
    { role:'system', content:'sys '.repeat(1200) },
    { role:'user', content:'build an oscillating model' },
    { role:'assistant', content:'', tool_calls:[{id:'1',type:'function',
      function:{name:'load_skill',arguments:'{"name":"pathway-modeling"}'}}] },
    { role:'tool', tool_call_id:'1', content: big },
    { role:'assistant', content:'', tool_calls:[{id:'2',type:'function',
      function:{name:'load_skill',arguments:'{"name":"tellurium"}'}}] },
    { role:'tool', tool_call_id:'2', content: big },
  ];
  // the reserve the runtime really passes is replyTokens(ctx) — half the window
  const fit = fitMessages(msgs, 8192, 4096);
  assert.ok(fit.some(m => m.role === 'user'), 'the question survives trimming');
  assert.equal(fit.find(m => m.role === 'user').content, 'build an oscillating model');
  assert.equal(fit[0].role, 'system', 'system still leads');
  assert.notEqual(fit[1]?.role, 'tool', 'still never orphans a result');
}
console.log('stream + budget ok');

/* ---------------- repeat escalation + leaked tool syntax ---------------- */
import { REPEAT_LIMIT, stripToolSyntax } from './oai.mjs';
{
  const r = toolRunner({ run_python: async () => 'boom' }, ['run_python']);
  assert.equal(r.repeats, 0);
  await r('run_python', { code: 'x' });
  assert.equal(r.repeats, 0);                 // first call is not a repeat
  await r('run_python', { code: 'x' });
  await r('run_python', { code: 'x' });
  assert.equal(r.repeats, 2);                 // caller can now force an answer
  assert.ok(r.repeats >= REPEAT_LIMIT);
  await r('run_python', { code: 'different' });
  assert.equal(r.repeats, 0);                 // progress resets it
}
{
  assert.equal(stripToolSyntax('<tool_call>{"name":"x"}</tool_call>'), '');
  assert.equal(stripToolSyntax('<function=run_python><parameter=code>1</parameter></function>'), '');
  assert.equal(stripToolSyntax('Flux is 1.2.'), 'Flux is 1.2.');
}
console.log('repeat escalation ok');
