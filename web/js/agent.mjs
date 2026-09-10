import { localChat } from './localai.mjs';
import { forHistory, TEXT_TOOL_PROTOCOL, callTool } from './oai.mjs';
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

const RUNTIME = `
## Runtime

You are running inside MCA Atlas, in the user's browser. Your tools are:
load_skill, read_reference, read_model, write_model, simulate, steady_state,
mca, list_skills - and nothing else.

Everything below this section was written for a different runtime and names tools
that do not exist here. Translate as you read; calling any of the left-hand names
fails:

    Read / Write / Edit on workspace/model.txt  ->  read_model / write_model
    Read on a Skill reference file              ->  read_reference
    Skill                                       ->  load_skill  (then route from
                                                    that Skill's own tables)
    Workflow                                    ->  run_mca_workflow
    Bash, Glob, Grep                            ->  no equivalent; say so instead

"workspace/model.txt" and "the live model" mean the same thing: read_model gives
you its current text, write_model replaces it.

THE LIVE MODEL is the Antimony source in the user's editor. read_model returns it;
write_model replaces it and is how the user sees your change.

You cannot execute arbitrary code. Every number comes from simulate, steady_state
or mca, which run real Tellurium (libroadrunner) on the server. If an analysis
needs something those three cannot give you, say so rather than estimating it.

${TEXT_TOOL_PROTOCOL}
`.trim();

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

async function loop({ chat, system, prompt, tk, schema, emit, signal, maxSteps = 14, stream }){
  const messages = [{ role:'system', content: system }, { role:'user', content: prompt }];
  for (let i = 0; i < maxSteps; i++){
    if (signal?.aborted) throw new Error('aborted');
    const m = await chat({ messages, tools: tk.defs, onStream: stream });
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
      const out = await callTool(tk.impl, name, args);
      messages.push({ role:'tool', tool_call_id: c.id, name, content: String(out).slice(0, 30000) });
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
      const base = strip(await text('/agents/model-scientist.md')) + '\n\n' + RUNTIME +
        '\n\n## The live model, as of this message\n\n' +
        'You can see it; never ask whether a model exists.\n\n```\n' + (await getModel()).trim() + '\n```';

      const runWorkflow = async ({ question, needsNumbers = true }) => {
        emit({ type:'workflow_start' });
        const src = await text('/workflows/mca-tellurium.js');
        const body = src.replace(/^\s*export\s+const\s+meta\s*=/m, 'const meta =');
        const agent = async (p, opts = {}) => {
          emit({ type:'phase', phase: opts.phase, label: opts.label });
          return loop({ chat, system: base, prompt: p, tk, schema: opts.schema, emit,
                        signal: ctrl.signal,
                        stream: ev => { if (ev.type === 'thinking') emit(ev); } });
        };
        const out = await new AsyncFunction('agent','phase','log','args', body)(
          agent,
          t => emit({ type:'phase', phase: t }),
          t => emit({ type:'log', text: String(t) }),
          { question, model: await getModel(), needsNumbers, workdir: '(browser)' });
        emit({ type:'workflow_done' });
        return JSON.stringify(out).slice(0, 30000);
      };

      const system = base + (useWorkflow
        ? '\n\nYou also have run_mca_workflow. Every analysis that needs numbers MUST go ' +
          'through it. Answer directly only for trivial questions.'
        : '\n\n## Workflow disabled\n\nThe mca-tellurium workflow is off because the user ' +
          'turned it off - it is slow. Do not ask for it back and do not refuse the work. ' +
          'Analyse directly, keeping every other rule: read the model first, load_skill ' +
          'before any domain claim, every number from simulate/steady_state/mca.');

      const all = { impl: { ...tk.impl, run_mca_workflow: runWorkflow },
        defs: useWorkflow ? [...tk.defs, { type:'function', function:{
          name:'run_mca_workflow',
          description:'Run the enforced mca-tellurium workflow (frame → plan → execute → validate → interpret → audit).',
          parameters:{ type:'object', properties:{
            question:{type:'string'}, needsNumbers:{type:'boolean'} }, required:['question'] } } }]
          : tk.defs };

      const messages = [{ role:'system', content: system }, ...history,
                        { role:'user', content: prompt }];
      let final = '', usedTools = false;
      for (let i = 0; i < 14; i++){
        if (ctrl.signal.aborted) break;
        const m = await chat({ messages, tools: all.defs, onStream: emit });
        messages.push(forHistory(m));
        const calls = m.tool_calls ?? [];
        if (!calls.length){ final = m.content ?? ''; break; }
        usedTools = true;
        for (const c of calls){
          const name = c.function?.name;
          let a = {}; try { a = JSON.parse(c.function?.arguments || '{}'); } catch {}
          emit({ type:'tools', tools:[{ name: name === 'run_mca_workflow' ? 'Workflow' : name, input: a }] });
          const out = await callTool(all.impl, name, a);
          messages.push({ role:'tool', tool_call_id: c.id, name, content: String(out).slice(0, 30000) });
        }
      }
      emit({ type:'result', text: final || '(no final answer)', isError: !final, noTools: !usedTools });
      emit({ type:'done', code: 0 });
    } catch (e) {
      emit({ type:'fatal', error: String(e.message || e) });
      emit({ type:'done', code: 1 });
    }
  })();

  return { kill: () => ctrl.abort() };
}
