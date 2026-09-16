import { localChat } from './localai.mjs';
import { forHistory, toolRunner, toolResult, resultCap, CONTEXT_DEFAULT,
         REPEAT_LIMIT, stripToolSyntax, missingArgs, stepBudget } from './oai.mjs';
import { localSystem } from './prompt.mjs';
import * as api from './api.mjs';

/* The agent, running in the page. Inference happens on the user's machine; the
   numbers come from Tellurium on the server. It does NOT re-implement the
   workflow: it fetches workflows/mca-tellurium.js and runs that exact source,
   supplying its own agent()/phase()/log().

   The tool surface is deliberately typed - simulate/steady_state/mca, not
   "run this Python" - so a hosted deployment never executes model-authored code. */

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const strip = md => md.replace(/^---\n[\s\S]*?\n---\n/, '').trim();

const cache = new Map();
const text = async url => {
  if (!cache.has(url)) cache.set(url, fetch(url).then(r => {
    if (!r.ok) throw new Error('could not load ' + url + ' (HTTP ' + r.status + ')');
    return r.text();
  }));
  return cache.get(url);
};

const TOOL_NAMES = ['list_skills', 'load_skill', 'read_reference', 'read_model',
                    'write_model', 'simulate', 'steady_state', 'mca'];

const HOW_TO_RUN = `THE LIVE MODEL is the Antimony in the user's editor: \`read_model\` returns it,
\`write_model\` replaces it, and that is how the user sees your change.

You cannot execute code here — there is no shell and no Python. Every number comes
from \`simulate\`, \`steady_state\` or \`mca\`, which run real Tellurium (libroadrunner)
on the server. If an analysis needs something those three cannot give, say so plainly
rather than estimating it.`;

/* The workflow otherwise tells every stage to write a script and run it with Bash,
   which this runtime has no way to do. */
const EXEC_NOTE =
  'Compute with the `simulate`, `steady_state` and `mca` tools — they run real ' +
  'Tellurium on the server. There is no shell here, so there is no script to write ' +
  'or save: report the numbers those tools return. If the plan needs something they ' +
  'cannot do, say so in "error" instead of approximating it.';

// Tools that change the project; a repeat of any call is replayed from memory
// (see toolRunner), so anything that writes has to invalidate that memory.
const WRITES = ['write_model', 'run_mca_workflow'];

/* Tools that produce a number. Reading the model is not computing with it. */
const COMPUTES = new Set(['simulate', 'steady_state', 'mca', 'run_mca_workflow']);
const hasNumber = t => /\d/.test(String(t ?? ''));

function tools(getModel, setModel, emit){
  const impl = {
    list_skills: async () => (await text('/skills/index.json')).toString(),
    load_skill: async ({ name }) => {
      const md = await text('/skills/' + name + '/SKILL.md');
      return md + '\n\n(Use read_reference with a path from this Skill to load a reference file.)';
    },
    read_reference: async ({ path }) => {
      if (!/^skills\/[\w.\-\/]+\.md$/.test(path)) throw new Error('only skills/**.md may be read');
      return text('/' + path);
    },
    read_model: async () => getModel(),
    write_model: async ({ antimony }) => {
      if (!antimony?.trim()) throw new Error('antimony is empty');
      const r = await api.simulate({ model: antimony, start: 0, end: 10, points: 5 });
      if (!r.ok) return 'REJECTED - that model does not load: ' + r.error +
                        '\nThe live model is unchanged. Fix it and call write_model again.';
      setModel(antimony);
      return 'saved; the editor now shows this model';
    },
    simulate: async ({ antimony, start = 0, end = 100, points = 200 }) => {
      const r = await api.simulate({ model: antimony ?? await getModel(), start, end, points });
      if (!r.ok) return 'ERROR: ' + r.error;
      const d = r.result;
      const head = d.names.join('\t');
      const rows = d.t.map((tv,i) => [tv, ...d.cols.map(c=>c[i])]
        .map(v => Number(v).toPrecision(6)).join('\t'));
      const keep = rows.length > 60 ? rows.filter((_,i)=> i % Math.ceil(rows.length/60) === 0) : rows;
      return (d.note ? 'NOTE: ' + d.note + '\n' : '') +
             'time\t' + head + '\n' + keep.join('\n');
    },
    steady_state: async ({ antimony }) => {
      const r = await api.steady({ model: antimony ?? await getModel() });
      if (!r.ok) return 'ERROR: ' + r.error;
      return JSON.stringify(r.result, null, 1);
    },
    mca: async ({ antimony }) => {
      const r = await api.mca({ model: antimony ?? await getModel() });
      if (!r.ok) return 'ERROR: ' + r.error;
      return JSON.stringify(r.result, null, 1);
    },
  };

  const S = (name, description, properties, required = []) => ({
    type: 'function', function: { name, description,
      parameters: { type: 'object', properties, required } } });

  const defs = [
    S('list_skills', 'List the Skills available in this project.', {}),
    S('load_skill', 'Load a Skill before making any claim it is the authority on.',
      { name: { type:'string', enum:['mca','tellurium','mca-tellurium'] } }, ['name']),
    S('read_reference', 'Read one reference file named by a Skill, e.g. skills/mca/references/x.md.',
      { path: { type:'string' } }, ['path']),
    S('read_model', 'Read the live Antimony model from the editor.', {}),
    S('write_model', 'Replace the live model. Rejected if it does not load.',
      { antimony: { type:'string' } }, ['antimony']),
    S('simulate', 'Time course from real Tellurium. Omit antimony to use the live model.',
      { antimony:{type:'string'}, start:{type:'number'}, end:{type:'number'}, points:{type:'number'} }),
    S('steady_state', 'Steady state: residual, concentrations, fluxes, Jacobian eigenvalues.',
      { antimony:{type:'string'} }),
    S('mca', 'Scaled flux/concentration control coefficients, elasticities, summation residuals.',
      { antimony:{type:'string'} }),
  ];
  return { impl, defs };
}

async function loop({ chat, system, prompt, tk, schema, emit, signal, maxSteps = 14, stream, cap = resultCap() }){
  const messages = [{ role:'system', content: system }, { role:'user', content: prompt }];
  const run = toolRunner(tk.impl, WRITES);
  const lacks = missingArgs(tk.defs);
  for (let i = 0; i < maxSteps; i++){
    if (signal?.aborted) throw new Error('aborted');
    // On the last step ask with no tools, so the stage ends in an answer rather than
    // in "(kept calling tools without answering)".
    const stuck = run.repeats >= REPEAT_LIMIT;
    const wrapUp = i === maxSteps - 1 || stuck;
    if (wrapUp) emit({ type:'log', text: stuck
      ? 'same call repeated; answering with what it has'
      : 'stage is out of steps; answering with what it has' });
    const m = await chat({ messages, tools: wrapUp ? undefined : tk.defs, onStream: stream });
    messages.push(forHistory(m));
    const calls = m.tool_calls ?? [];
    if (!calls.length){
      if (!schema) return m.content ?? '';
      return constrain({ chat, messages, schema, emit, signal });
    }
    for (const c of calls){
      const name = c.function?.name;
      let args = {}; try { args = JSON.parse(c.function?.arguments || '{}'); } catch {}
      emit({ type:'tools', tools:[{ name, input: args }] });
      const out = lacks(name, args) ?? await run(name, args);
      messages.push(toolResult(c, name, String(out).slice(0, cap)));
    }
  }
  return schema ? constrain({ chat, messages, schema, emit, signal }) : '(kept calling tools without answering)';
}

async function constrain({ chat, messages, schema, emit, signal }){
  const ask = { role:'user', content:
    'Now output ONLY a JSON object matching this stage\'s schema. No prose, no code fences.' };
  const quiet = ev => { if (ev.type === 'thinking') emit(ev); };
  for (let a = 0; a < 3; a++){
    let m;
    try { m = await chat({ messages:[...messages, ask], schema, onStream: quiet }); }
    catch { m = await chat({ messages:[...messages, ask], onStream: quiet }); }
    const p = parse(m.content);
    if (p && typeof p === 'object') return fill(p, schema);
    messages.push(forHistory(m), { role:'user', content:'That was not valid JSON. Output the object only.' });
  }
  return fill({}, schema);
}

function parse(t){
  if (!t) return null;
  const s = String(t).replace(/^\s*```(?:json)?/i,'').replace(/```\s*$/,'').trim();
  try { return JSON.parse(s); } catch {}
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b+1)); } catch {} }
  return null;
}
function fill(o, schema){
  for (const k of schema.required ?? []){
    if (o[k] != null) continue;
    const t = schema.properties?.[k]?.type;
    o[k] = t === 'array' ? [] : t === 'boolean' ? false : t === 'object' ? {} : '';
  }
  return o;
}

/** One turn. Returns { kill }. Events mirror the server runtime's shapes. */
export function runBrowserAgent({ cfg, prompt, history = [], getModel, setModel, useWorkflow = true, onEvent }){
  const ctrl = new AbortController();
  const emit = onEvent;
  const chat = ({ messages, tools, schema, onStream }) =>
    localChat({ ...cfg, messages, tools, schema, signal: ctrl.signal, onStream });

  (async () => {
    try {
      const tk = tools(getModel, setModel, emit);
      const cap = resultCap(cfg?.contextTokens, cfg?.resultPct);
      const STEPS = stepBudget(cfg?.steps);
      const base = localSystem({ tools: TOOL_NAMES, liveModel: await getModel(),
                                 howToRun: HOW_TO_RUN });

      const runWorkflow = async ({ question, needsNumbers = true }) => {
        question = String(question ?? '').trim() || prompt;   // it is always this turn's question
        emit({ type:'workflow_start' });
        const src = await text('/workflows/mca-tellurium.js');
        const body = src.replace(/^\s*export\s+const\s+meta\s*=/m, 'const meta =');
        const agent = async (p, opts = {}) => {
          emit({ type:'phase', phase: opts.phase, label: opts.label });
          return loop({ chat, system: base, prompt: p, tk, schema: opts.schema, emit,
                        signal: ctrl.signal, cap, maxSteps: Math.max(2, STEPS - 2),
                        stream: ev => { if (ev.type === 'thinking') emit(ev); } });
        };
        const out = await new AsyncFunction('agent','phase','log','args', body)(
          agent,
          t => emit({ type:'phase', phase: t }),
          t => emit({ type:'log', text: String(t) }),
          { question, model: await getModel(), needsNumbers,
            workdir: '(not used — there is no filesystem here)', exec: EXEC_NOTE });
        emit({ type:'workflow_done' });
        return JSON.stringify(out).slice(0, cap);
      };

      const system = base + (useWorkflow
        ? '\n\n## The workflow\n\nYou also have `run_mca_workflow`. Every analysis that needs ' +
          'numbers MUST go through it. Answer directly only for questions needing no computation.'
        : '\n\n## The workflow is off\n\nThe user turned it off because it is slow. Do not ask ' +
          'for it back and do not refuse the work — analyse directly, keeping every rule above.');

      const all = { impl: { ...tk.impl, run_mca_workflow: runWorkflow },
        defs: useWorkflow ? [...tk.defs, { type:'function', function:{
          name:'run_mca_workflow',
          description:'Run the enforced mca-tellurium workflow (frame → plan → execute → validate → interpret → audit).',
          parameters:{ type:'object', properties:{
            question:{type:'string'}, needsNumbers:{type:'boolean'} }, required:['question'] } } }]
          : tk.defs };

      const messages = [{ role:'system', content: system }, ...history,
                        { role:'user', content: prompt }];
      const run = toolRunner(all.impl, WRITES);
      const lacks = missingArgs(all.defs);
      let final = '', usedTools = false, computed = false;
      for (let i = 0; i < STEPS; i++){
        if (ctrl.signal.aborted) break;
        const stuck = run.repeats >= REPEAT_LIMIT;
        if (stuck) emit({ type:'log', text:'same call repeated; asking for the answer' });
        const wrapUp = i === STEPS - 1 || stuck;
        const m = await chat({ messages, tools: wrapUp ? undefined : all.defs, onStream: emit });
        messages.push(forHistory(m));
        const calls = m.tool_calls ?? [];
        if (!calls.length){ final = stripToolSyntax(m.content); break; }
        usedTools = true;
        for (const c of calls){
          const name = c.function?.name;
          let a = {}; try { a = JSON.parse(c.function?.arguments || '{}'); } catch {}
          emit({ type:'tools', tools:[{ name: name === 'run_mca_workflow' ? 'Workflow' : name, input: a }] });
          if (COMPUTES.has(name)) computed = true;
          const out = lacks(name, a) ?? await run(name, a);
          messages.push(toolResult(c, name, String(out).slice(0, cap)));
        }
      }
      emit({ type:'result', text: final || '(no final answer)', isError: !final,
             noTools: !usedTools, unverified: !computed && hasNumber(final) });
      emit({ type:'done', code: 0 });
    } catch (e) {
      emit({ type:'fatal', error: String(e.message || e) });
      emit({ type:'done', code: 1 });
    }
  })();

  return { kill: () => ctrl.abort() };
}
