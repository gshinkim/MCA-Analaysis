import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, resolve, relative, dirname } from 'node:path';
import { execFile } from 'node:child_process';
import { thinkStream, textToolCalls, mergeToolDeltas, forHistory, TEXT_TOOL_PROTOCOL }
  from '../web/js/oai.mjs';

/* A second agent runtime for models that are not Claude Code: anything speaking
   OpenAI-compatible /v1/chat/completions (Ollama, LM Studio, llama-server, a GGUF
   served by any of them, a hosted gateway).

   The point of this file is that it does NOT re-implement the workflow. It loads
   workflows/mca-tellurium.js and runs that exact source, supplying its own
   agent()/phase()/log(). The user's workflow drives the local model verbatim. */

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const stripFrontmatter = md => md.replace(/^---\n[\s\S]*?\n---\n/, '').trim();

/* ------------------------------- provider ------------------------------- */
export class Chat {
  constructor({ baseUrl, apiKey, model }) {
    this.url = String(baseUrl || '').replace(/\/+$/, '');
    if (!/\/v\d+$/.test(this.url)) this.url += '/v1';
    this.apiKey = apiKey; this.model = model;
  }

  /* Always streams. A slow local model can sit well past Node's 300s fetch
     header timeout before its first byte, which surfaces to the user as a bare
     "network error"; streaming returns headers immediately and then keeps the
     body flowing, so the connection never idles out. It also lets thinking and
     tokens reach the UI as they are produced. */
  // A 27B reasoning model routinely spends more than 4k tokens thinking; capping
  // there truncated the answer mid-tool-call, which reads as "it cannot call tools".
  async complete({ messages, tools, schema, signal, onStream, maxTokens = 16384 }) {
    const body = { model: this.model, messages, max_tokens: maxTokens, temperature: 0.2, stream: true };
    if (tools?.length) body.tools = tools;
    if (schema) body.response_format = {
      type: 'json_schema', json_schema: { name: 'result', strict: true, schema } };

    let res;
    try {
      res = await fetch(this.url + '/chat/completions', {
        method: 'POST', signal,
        headers: { 'content-type': 'application/json',
                   ...(this.apiKey ? { authorization: 'Bearer ' + this.apiKey } : {}) },
        body: JSON.stringify(body),
      });
    } catch (e) {
      if (e?.name === 'AbortError') throw e;
      throw new Error(`cannot reach ${this.url} — ${e.message}. Is the server running, ` +
                      `and is the URL right? (Ollama: http://localhost:11434, LM Studio: http://localhost:1234)`);
    }
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`${this.model} @ ${this.url}: HTTP ${res.status} ${t.slice(0, 300)}`);
    }
    if (!res.body) throw new Error('no response body from ' + this.url);

    let reasoning = '', finish = '';
    const think = thinkStream(onStream);
    const calls = [];
    const dec = new TextDecoder();
    let buf = '';
    for await (const chunk of res.body) {
      buf += dec.decode(chunk, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') continue;
        let d;
        try { d = JSON.parse(payload); } catch { continue; }
        if (d.error) throw new Error(String(d.error.message ?? d.error));
        const ch = d.choices?.[0];
        if (!ch) continue;
        if (ch.finish_reason) finish = ch.finish_reason;
        const delta = ch.delta ?? ch.message ?? {};
        const th = delta.reasoning ?? delta.reasoning_content;
        if (th) { reasoning += th; onStream?.({ type: 'thinking', text: th }); }
        if (delta.content) think.push(delta.content);  // splits inline <think> as it streams
        mergeToolDeltas(calls, delta.tool_calls);
      }
    }
    const split = think.end();
    const msg = { role: 'assistant', content: split.content,
                  reasoning: [reasoning, split.reasoning].filter(Boolean).join('\n') || undefined };
    let tc = calls.filter(Boolean);
    // a model whose runtime has no tool API writes the call as prose; take it anyway
    if (!tc.length) tc = textToolCalls(split.content, (tools ?? []).map(t => t.function?.name));
    if (tc.length) msg.tool_calls = tc;
    else if (finish === 'length') onStream?.({ type: 'log',
      text: this.model + ' hit its token limit before finishing - the answer is cut off.' });
    return msg;
  }
}

/* --------------------------------- tools --------------------------------- */
function makeTools(root, emit) {
  const jail = p => {
    const abs = resolve(root, p || '.');
    if (!abs.startsWith(root)) throw new Error('path escapes the project: ' + p);
    return abs;
  };
  const py = join(root, '.venv/bin/python');

  const impl = {
    async load_skill({ name }) {
      const md = await readFile(join(root, 'skills', name, 'SKILL.md'), 'utf8');
      const files = await readdir(join(root, 'skills', name), { recursive: true })
        .catch(() => []);
      return md + '\n\n--- files in this skill (read with read_file) ---\n' +
        files.filter(f => f.endsWith('.md')).map(f => 'skills/' + name + '/' + f).join('\n');
    },
    async read_file({ path }) {
      const t = await readFile(jail(path), 'utf8');
      return t.length > 60000 ? t.slice(0, 60000) + '\n…[truncated]' : t;
    },
    async write_file({ path, content }) {
      const abs = jail(path);
      await mkdir(dirname(abs), { recursive: true });
      await writeFile(abs, content);
      return 'wrote ' + relative(root, abs) + ' (' + content.length + ' bytes)';
    },
    async list_dir({ path }) {
      return (await readdir(jail(path), { withFileTypes: true }))
        .map(d => (d.isDirectory() ? d.name + '/' : d.name)).join('\n');
    },
    async run_python({ code }) {
      const file = join(root, 'workspace/runs', 'run-' + Date.now() + '.py');
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, code);
      emit({ type: 'tools', tools: [{ name: 'python', input: { file: relative(root, file) } }] });
      return await new Promise(res => {
        execFile(py, [file], { cwd: root, timeout: 180000, maxBuffer: 8e6 },
          (err, out, errOut) => res(
            (out || '') + (errOut ? '\n[stderr]\n' + errOut : '') +
            (err && !out && !errOut ? '\n[failed] ' + err.message : '') || '(no output)'));
      });
    },
  };

  const schemas = [
    ['load_skill', 'Load a Skill and list its reference files. Use before making any domain claim.',
      { name: { type: 'string', enum: ['mca', 'tellurium', 'mca-tellurium'] } }, ['name']],
    ['read_file', 'Read a file in the project (e.g. a Skill reference, or workspace/model.txt).',
      { path: { type: 'string' } }, ['path']],
    ['write_file', 'Write a file in the project. Edit the live model at workspace/model.txt.',
      { path: { type: 'string' }, content: { type: 'string' } }, ['path', 'content']],
    ['list_dir', 'List a directory in the project.', { path: { type: 'string' } }, ['path']],
    ['run_python', 'Run Python with Tellurium available. Print what you need; only stdout comes back.',
      { code: { type: 'string' } }, ['code']],
  ];

  return {
    impl,
    defs: schemas.map(([name, description, properties, required]) => ({
      type: 'function',
      function: { name, description, parameters: { type: 'object', properties, required } },
    })),
  };
}

/* ------------------------------- agent loop ------------------------------- */
async function toolLoop({ chat, system, prompt, tools, schema, emit, signal,
                          maxSteps = 12, stageMs = 900000 }) {
  const messages = [{ role: 'system', content: system }, { role: 'user', content: prompt }];
  const t0 = Date.now();
  // A local 27B running seven sequential stages is slow but not dead — say so.
  const beat = setInterval(() => emit({ type: 'heartbeat', seconds: Math.round((Date.now()-t0)/1000) }), 15000);
  try {
  for (let step = 0; step < maxSteps; step++) {
    if (signal?.aborted) throw new Error('aborted');
    if (Date.now() - t0 > stageMs) {
      emit({ type: 'log', text: 'stage exceeded its time budget; forcing an answer' });
      break;
    }
    // Ask for the schema only once the model has stopped calling tools; many local
    // models cannot emit a tool call and a constrained JSON object in one turn.
    const m = await chat.complete({ messages, tools: tools.defs, signal,
      onStream: ev => { if (ev.type === 'thinking') emit(ev); } });
    messages.push(forHistory(m));
    const calls = m.tool_calls ?? [];
    if (!calls.length) {
      if (!schema) return m.content ?? '';
      return await constrain({ chat, messages, schema, emit, signal });
    }
    for (const c of calls) {
      const name = c.function?.name;
      let args = {};
      try { args = JSON.parse(c.function?.arguments || '{}'); } catch {}
      emit({ type: 'tools', tools: [{ name, input: args }] });
      let out;
      try { out = await tools.impl[name](args); }
      catch (e) { out = 'ERROR: ' + e.message; }
      messages.push({ role: 'tool', tool_call_id: c.id, name,
                      content: String(out).slice(0, 40000) });
    }
  }
  if (!schema) return '(the model kept calling tools without answering)';
  return await constrain({ chat, messages, schema, emit, signal });
  } finally { clearInterval(beat); }
}

/** Force the structured object the workflow stage declared. */
async function constrain({ chat, messages, schema, emit, signal }) {
  const ask = { role: 'user', content:
    'Now output ONLY a JSON object matching the required schema for this stage. No prose, no code fences.' };
  for (let attempt = 0; attempt < 3; attempt++) {
    let m;
    const quiet = { onStream: ev => { if (ev.type === 'thinking') emit(ev); } };
    try { m = await chat.complete({ messages: [...messages, ask], schema, signal, ...quiet }); }
    catch (e) {
      if (e?.name === 'AbortError') throw e;
      m = await chat.complete({ messages: [...messages, ask], signal, ...quiet }); // no json_schema support
    }
    const parsed = parseLoose(m.content);
    if (parsed && typeof parsed === 'object') return fill(parsed, schema);
    messages.push(forHistory(m),
                  { role: 'user', content: 'That was not valid JSON. Output the JSON object only.' });
  }
  return fill({}, schema);            // never crash the workflow on a weak model
}

function parseLoose(text) {
  if (!text) return null;
  const t = String(text).replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/, '').trim();
  try { return JSON.parse(t); } catch {}
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch {} }
  return null;
}

/** A missing required field must not throw inside the workflow's own template strings. */
function fill(obj, schema) {
  for (const k of schema.required ?? []) {
    if (obj[k] !== undefined && obj[k] !== null) continue;
    const t = schema.properties?.[k]?.type;
    obj[k] = t === 'array' ? [] : t === 'boolean' ? false : t === 'object' ? {} : '';
  }
  return obj;
}

/* --------------------------- the workflow, verbatim --------------------------- */
export async function runWorkflowFile({ root, chat, args, emit, signal }) {
  const src = await readFile(join(root, 'workflows/mca-tellurium.js'), 'utf8');
  const body = src.replace(/^\s*export\s+const\s+meta\s*=/m, 'const meta =');
  const system = stripFrontmatter(await readFile(join(root, 'agents/model-scientist.md'), 'utf8'))
    + '\n\n' + RUNTIME_NOTE;
  const tools = makeTools(root, emit);

  const agent = async (prompt, opts = {}) => {
    emit({ type: 'phase', phase: opts.phase, label: opts.label });
    return toolLoop({ chat, system, prompt, tools, schema: opts.schema, emit, signal });
  };
  const phase = title => emit({ type: 'phase', phase: title });
  const log = msg => emit({ type: 'log', text: String(msg) });

  const fn = new AsyncFunction('agent', 'phase', 'log', 'args', body);
  return await fn(agent, phase, log, args);
}

const RUNTIME_NOTE = `
## Runtime

You are running inside MCA Atlas on a local model runtime. You have exactly these
tools: load_skill, read_file, write_file, list_dir, run_python. There is no Skill
tool and no Workflow tool here - where your instructions say "call the Skill tool",
call load_skill instead, and route from that Skill's own tables.

THE LIVE MODEL is workspace/model.txt in Antimony. It is the text in the user's
editor. Change what the user sees by writing that file.

run_python already has tellurium, roadrunner, numpy and scipy importable. Only
stdout comes back, so print everything you need. Scripts are kept in workspace/runs/.

${TEXT_TOOL_PROTOCOL}
`.trim();

/* ------------------------------ the outer turn ------------------------------ */
export function runLocalAgent({ root, prompt, history = [], chatCfg, useWorkflow = true,
                               liveModel = '', onEvent }) {
  const ctrl = new AbortController();
  const emit = o => onEvent(o);
  if (!chatCfg?.baseUrl || !chatCfg?.model) {
    queueMicrotask(() => {
      emit({ type: 'fatal', error: 'This model has no server URL or model name. ' +
        'Open Settings → Local models, fill them in, press "Test & list models", then Save.' });
      emit({ type: 'done', code: 1 });
    });
    return { kill(){} };
  }
  const chat = new Chat(chatCfg);
  const tools = makeTools(root, emit);

  (async () => {
    try {
      const base = stripFrontmatter(
        await readFile(join(root, 'agents/model-scientist.md'), 'utf8')) + '\n\n' + RUNTIME_NOTE +
        (liveModel.trim()
          ? `\n\n## The live model, as of this message\n\nThis is the current content of ` +
            `workspace/model.txt. You can see it; never ask the user whether a model exists ` +
            `or to paste one. Re-read the file before editing it.\n\n\`\`\`\n${liveModel.trim()}\n\`\`\``
          : `\n\nworkspace/model.txt is currently EMPTY. If the user asks for a model, ` +
            `write one there yourself - do not ask them to supply one.`);
      const system = base + (useWorkflow
        ? `\n\nYou also have run_mca_workflow. Every analysis - anything about control, ` +
          `elasticities, control coefficients, steady state in a control context, or any ` +
          `claim needing numbers - MUST go through it. Answer directly only for trivial ` +
          `questions that need no computation.`
        : `\n\n## Workflow disabled for this session\n\n` +
          `The mca-tellurium workflow is NOT available - the user turned it off because the ` +
          `seven-stage sequence is slow. Do not ask for it back and do not refuse the work.\n\n` +
          `Do the analysis directly and keep every other rule: read the model before any claim ` +
          `about it, load_skill('mca') / load_skill('tellurium') before asserting anything they ` +
          `are the authority on, compute nothing from memory - every number comes from a ` +
          `run_python call you made - and say how well supported each part of your answer is. ` +
          `Be proportionate: a short question gets a short, direct answer.`);

      const wfDef = { type: 'function', function: {
        name: 'run_mca_workflow',
        description: 'Run the enforced mca-tellurium workflow (MCA frame → Tellurium plan → ' +
                     'execute → validate → interpret → audit). Use for any analysis.',
        parameters: { type: 'object', properties: {
          question: { type: 'string', description: 'the question, stated fully and standalone' },
          needsNumbers: { type: 'boolean' },
        }, required: ['question'] } } };

      const allTools = { impl: {
        ...tools.impl,
        run_mca_workflow: async ({ question, needsNumbers = true }) => {
          emit({ type: 'workflow_start' });
          const model = await readFile(join(root, 'workspace/model.txt'), 'utf8').catch(() => '');
          const out = await runWorkflowFile({
            root, chat, emit, signal: ctrl.signal,
            args: { question, model, needsNumbers, workdir: 'workspace/runs' },
          });
          emit({ type: 'workflow_done' });
          return JSON.stringify(out).slice(0, 40000);
        },
      }, defs: useWorkflow ? [...tools.defs, wfDef] : tools.defs };

      const messages = [{ role: 'system', content: system }, ...history,
                        { role: 'user', content: prompt }];
      let final = '';
      for (let step = 0; step < 14; step++) {
        if (ctrl.signal.aborted) break;
        const m = await chat.complete({ messages, tools: allTools.defs, signal: ctrl.signal,
          onStream: emit });                       // outer turn: thinking and tokens both
        messages.push(forHistory(m));
        const calls = m.tool_calls ?? [];
        if (!calls.length) { final = m.content ?? ''; break; }
        for (const c of calls) {
          const name = c.function?.name;
          let a = {};
          try { a = JSON.parse(c.function?.arguments || '{}'); } catch {}
          if (name !== 'run_mca_workflow') emit({ type: 'tools', tools: [{ name, input: a }] });
          else emit({ type: 'tools', tools: [{ name: 'Workflow', input: { workflow: 'mca-tellurium' } }] });
          let out;
          try { out = await allTools.impl[name](a); }
          catch (e) { out = 'ERROR: ' + e.message; }
          messages.push({ role: 'tool', tool_call_id: c.id, name,
                          content: String(out).slice(0, 40000) });
        }
      }
      emit({ type: 'result', text: final || '(the model produced no final answer)', isError: !final });
      emit({ type: 'done', code: 0 });
    } catch (e) {
      emit({ type: 'fatal', error: String(e.message || e) });
      emit({ type: 'done', code: 1 });
    }
  })();

  return { kill: () => ctrl.abort() };
}
