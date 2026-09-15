import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, resolve, relative, dirname } from 'node:path';
import { execFile } from 'node:child_process';
import { forHistory, toolRunner, toolResult, readCompletion, fitMessages, resultCap,
         CONTEXT_DEFAULT, REPEAT_LIMIT, stripToolSyntax, missingArgs } from '../web/js/oai.mjs';
import { localSystem } from '../web/js/prompt.mjs';

/* A second agent runtime for models that are not Claude Code: anything speaking
   OpenAI-compatible /v1/chat/completions (Ollama, LM Studio, llama-server, a GGUF
   served by any of them, a hosted gateway).

   The point of this file is that it does NOT re-implement the workflow. It loads
   workflows/mca-tellurium.js and runs that exact source, supplying its own
   agent()/phase()/log(). The user's workflow drives the local model verbatim. */

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

/* ------------------------------- provider ------------------------------- */
export class Chat {
  constructor({ baseUrl, apiKey, model, contextTokens }) {
    this.url = String(baseUrl || '').replace(/\/+$/, '');
    if (!/\/v\d+$/.test(this.url)) this.url += '/v1';
    this.apiKey = apiKey; this.model = model;
    // What the runtime loaded the model with, not what the weights allow: LM
    // Studio and Ollama both default well below the maximum.
    this.ctx = Number(contextTokens) > 0 ? Number(contextTokens) : CONTEXT_DEFAULT;
  }

  /* Always streams. A slow local model can sit well past Node's 300s fetch
     header timeout before its first byte, which surfaces to the user as a bare
     "network error"; streaming returns headers immediately and then keeps the
     body flowing, so the connection never idles out. It also lets thinking and
     tokens reach the UI as they are produced. */
  // A 27B reasoning model routinely spends more than 4k tokens thinking; capping
  // there truncated the answer mid-tool-call, which reads as "it cannot call tools".
  async complete({ messages, tools, schema, signal, onStream, maxTokens }) {
    // Asking for more than the window holds is not a bigger answer, it is a
    // truncated prompt. Leave room for the reply inside the same budget.
    const fitted = fitMessages(messages, this.ctx);
    const cap = Math.max(256, Math.min(maxTokens ?? 4096, this.ctx >> 1));
    const body = { model: this.model, messages: fitted, max_tokens: cap,
                   temperature: 0.2, stream: true };
    if (tools?.length) body.tools = tools;
    else body.tool_choice = 'none';        // a server that honours it cannot emit a call
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

    const msg = await readCompletion(res, {
      onStream, toolNames: (tools ?? []).map(t => t.function?.name) });
    if (!msg.tool_calls?.length && msg.finish === 'length') onStream?.({ type: 'log',
      text: this.model + ' hit its token limit before finishing - the answer is cut off.' });
    return msg;
  }
}

/* --------------------------------- tools --------------------------------- */
// Tools that change the project. A repeat of any call is replayed from memory
// (see toolRunner), so anything that writes has to invalidate that memory.
const WRITES = ['write_file', 'run_python', 'run_mca_workflow'];

/* Tools that produce a number. Reading the model is not computing with it: a model
   that reads `k=0.4` and then reports a flux of 1.2 worked it out in its head, which
   is the one thing the agent is not allowed to do. The answer is still shown — it is
   labelled, so the user knows nothing behind the number was checked. */
const COMPUTES = new Set(['run_python', 'run_mca_workflow']);
const hasNumber = t => /\d/.test(String(t ?? ''));

/* A model that has not read the tellurium Skill invents the API and burns a step
   per guess — measured: five attempts at loadAntimonyModel / Simulator / SBMLReader
   before one worked. The traceback alone never points anywhere; this does. */
const apiHint = stderr => /AttributeError|ImportError|ModuleNotFoundError|NameError/.test(stderr || '')
  && /tellurium|roadrunner|antimony|\bte\b/i.test(stderr || '')
  ? '\n\n[hint] That is not the documented API. Call load_skill("tellurium") and route ' +
    'from its tables to the right reference before writing this script again — guessing ' +
    'another attribute name will fail the same way.'
  : '';

function makeTools(root, emit, te, cap = resultCap()) {
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
      return t.length > cap ? t.slice(0, cap) + '\n…[truncated — read a narrower path]' : t;
    },
    async write_file({ path, content }) {
      const abs = jail(path);
      // The live model is the text in the user's editor. Antimony that does not load
      // would replace it with something broken they cannot get back, so it is checked
      // first — the same gate web/js/agent.mjs already applies to write_model.
      if (te && abs === join(root, 'workspace/model.txt')) {
        const r = await te.call('info', { model: String(content ?? '') });
        if (!r.ok) return 'REJECTED — that Antimony does not load: ' + r.error +
          '\nThe live model is unchanged. Fix it and call write_file again.';
      }
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
            ((out || '') + (errOut ? '\n[stderr]\n' + errOut : '') +
             (err && !out && !errOut ? '\n[failed] ' + err.message : '') || '(no output)')
            + apiHint(errOut)));
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
                          maxSteps = 12, stageMs = 900000, cap = resultCap() }) {
  const messages = [{ role: 'system', content: system }, { role: 'user', content: prompt }];
  const t0 = Date.now();
  const run = toolRunner(tools.impl, WRITES);
  const lacks = missingArgs(tools.defs);
  // A local 27B running seven sequential stages is slow but not dead — say so.
  const beat = setInterval(() => emit({ type: 'heartbeat', seconds: Math.round((Date.now()-t0)/1000) }), 15000);
  try {
  for (let step = 0; step < maxSteps; step++) {
    if (signal?.aborted) throw new Error('aborted');
    // Out of steps or out of time: ask once more with NO tools, so the model has to
    // answer. Breaking out here instead handed the stage back empty, which is what
    // the user saw as the agent going round in circles and then saying nothing.
    const stuck = run.repeats >= REPEAT_LIMIT;
    const wrapUp = step === maxSteps - 1 || Date.now() - t0 > stageMs || stuck;
    if (wrapUp) emit({ type: 'log', text: stuck
      ? 'same call repeated ' + run.repeats + 'x; answering with what it has'
      : 'stage is out of ' + (step === maxSteps - 1 ? 'steps' : 'time') +
        '; answering with what it has' });
    // Ask for the schema only once the model has stopped calling tools; many local
    // models cannot emit a tool call and a constrained JSON object in one turn.
    const m = await chat.complete({ messages, tools: wrapUp ? undefined : tools.defs, signal,
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
      const out = lacks(name, args) ?? await run(name, args);
      messages.push(toolResult(c, name, String(out).slice(0, cap)));
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
export async function runWorkflowFile({ root, chat, args, emit, signal, te }) {
  const src = await readFile(join(root, 'workflows/mca-tellurium.js'), 'utf8');
  const body = src.replace(/^\s*export\s+const\s+meta\s*=/m, 'const meta =');
  const cap = resultCap(chat.ctx);
  const system = localSystem({ tools: TOOL_NAMES, liveModel: args?.model ?? '', howToRun: HOW_TO_RUN });
  const tools = makeTools(root, emit, te, cap);

  const agent = async (prompt, opts = {}) => {
    emit({ type: 'phase', phase: opts.phase, label: opts.label });
    return toolLoop({ chat, system, prompt, tools, schema: opts.schema, emit, signal, cap });
  };
  const phase = title => emit({ type: 'phase', phase: title });
  const log = msg => emit({ type: 'log', text: String(msg) });

  const fn = new AsyncFunction('agent', 'phase', 'log', 'args', body);
  return await fn(agent, phase, log, args);
}

const TOOL_NAMES = ['load_skill', 'read_file', 'write_file', 'list_dir', 'run_python'];

const HOW_TO_RUN = `THE LIVE MODEL is \`workspace/model.txt\`. Write that file to change what the user sees.

\`run_python\` is your shell: it runs a Python script with tellurium, roadrunner, numpy
and scipy importable, and returns only stdout — so print everything you need. Scripts
are kept in workspace/runs/. There is no separate terminal; run_python is it.`;

/* Handed to the workflow, which otherwise tells every stage to "run it with Bash". */
const EXEC_NOTE =
  'Run the computation with `run_python`: one self-contained script, printing every ' +
  'number you will report. Only stdout comes back. Save it with `write_file` under ' +
  'workspace/runs/ first if you want the script kept as the reproducibility record.';

/* ------------------------------ the outer turn ------------------------------ */
export function runLocalAgent({ root, prompt, history = [], chatCfg, useWorkflow = true,
                               liveModel = '', te, onEvent }) {
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
  const cap = resultCap(chat.ctx);
  const tools = makeTools(root, emit, te, cap);

  (async () => {
    try {
      const system = localSystem({
        tools: useWorkflow ? [...TOOL_NAMES, 'run_mca_workflow'] : TOOL_NAMES,
        liveModel, howToRun: HOW_TO_RUN,
        extra: useWorkflow
          ? '\n## The workflow\n\nAnything needing numbers — control, elasticities, control ' +
            'coefficients, steady state in a control context — MUST go through `run_mca_workflow`. ' +
            'Answer directly only for questions that need no computation.'
          : '\n## The workflow is off\n\nThe user turned the seven-stage workflow off because it ' +
            'is slow. Do not ask for it back and do not refuse the work — do the analysis yourself, ' +
            'keeping every rule above.',
      });

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
          // The model names the workflow and often supplies no question. It is
          // always this turn's question, so use it rather than failing the stage.
          question = String(question ?? '').trim() || prompt;
          emit({ type: 'workflow_start' });
          const model = await readFile(join(root, 'workspace/model.txt'), 'utf8').catch(() => '');
          const out = await runWorkflowFile({
            root, chat, emit, te, signal: ctrl.signal,
            args: { question, model, needsNumbers, workdir: 'workspace/runs', exec: EXEC_NOTE },
          });
          emit({ type: 'workflow_done' });
          return JSON.stringify(out).slice(0, cap);
        },
      }, defs: useWorkflow ? [...tools.defs, wfDef] : tools.defs };

      const messages = [{ role: 'system', content: system }, ...history,
                        { role: 'user', content: prompt }];
      const run = toolRunner(allTools.impl, WRITES);
      const lacks = missingArgs(allTools.defs);
      let final = '', usedTools = false, computed = false;
      const STEPS = 14;
      for (let step = 0; step < STEPS; step++) {
        if (ctrl.signal.aborted) break;
        // ...or as soon as it is plainly stuck: a repeated call warned about twice
        // will be repeated a third time, and each one costs a step.
        const stuck = run.repeats >= REPEAT_LIMIT;
        if (stuck) emit({ type: 'log', text: 'same call repeated; asking for the answer' });
        const wrapUp = step === STEPS - 1 || stuck;
        const m = await chat.complete({ messages, tools: wrapUp ? undefined : allTools.defs,
          signal: ctrl.signal, onStream: emit }); // outer turn: thinking and tokens both
        messages.push(forHistory(m));
        const calls = m.tool_calls ?? [];
        if (!calls.length) { final = stripToolSyntax(m.content); break; }
        usedTools = true;
        for (const c of calls) {
          const name = c.function?.name;
          let a = {};
          try { a = JSON.parse(c.function?.arguments || '{}'); } catch {}
          if (name !== 'run_mca_workflow') emit({ type: 'tools', tools: [{ name, input: a }] });
          else emit({ type: 'tools', tools: [{ name: 'Workflow', input: { workflow: 'mca-tellurium' } }] });
          if (COMPUTES.has(name)) computed = true;
          const out = lacks(name, a) ?? await run(name, a);
          messages.push(toolResult(c, name, String(out).slice(0, cap)));
        }
      }
      emit({ type: 'result', text: final || '(the model produced no final answer)',
             isError: !final, noTools: !usedTools, unverified: !computed && hasNumber(final) });
      emit({ type: 'done', code: 0 });
    } catch (e) {
      emit({ type: 'fatal', error: String(e.message || e) });
      emit({ type: 'done', code: 1 });
    }
  })();

  return { kill: () => ctrl.abort() };
}
