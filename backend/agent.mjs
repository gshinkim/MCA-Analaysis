import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';

/* The agent runtime is the Claude Code CLI, because that is what the project's
   assets are written against: agents/model-scientist.md is a subagent definition
   and workflows/mca-tellurium.js calls agent()/phase()/Skill. Re-implementing
   those semantics against a raw chat API would be a second, worse runtime.
   .claude/{agents,skills,workflows} symlink to the real folders, so anything the
   user drops in skills/ is picked up on the next turn with no restart. */

const AGENT = 'model-scientist';
const WORKFLOW = 'mca-tellurium';

export const SYSTEM_APPEND = `
You are running inside MCA Atlas, a web workbench for metabolic control analysis.

THE LIVE MODEL is the file workspace/model.txt, in Antimony format. It is the exact
text shown in the user's editor. To change what the user sees, edit that file with
Edit or Write - the UI reloads it when your turn ends. Never describe an edit you
did not make to that file.

Simulation settings the user has set live in workspace/settings.json
({start, end, points}); honour them when you simulate unless asked otherwise.

Tellurium is installed at ./.venv/bin/python (tellurium, roadrunner, numpy, scipy).
Always invoke it as ./.venv/bin/python - the system python3 does NOT have tellurium.
Write scratch scripts under workspace/runs/ so the user can inspect them afterwards.

Route every analysis through the ${WORKFLOW} workflow, per your agent definition.
`.trim();

/* The model is pasted in, not just pointed at: an agent that asks "is there a model?"
   when one is sitting in the editor is useless. It must still re-read the file before
   editing, because the user may have typed since this prompt was built. */
export const liveModelBlock = src => !src?.trim() ? `

The live model file workspace/model.txt is currently EMPTY. If the user asks for a
model, write one there yourself - do not ask them to supply one.` : `

## The live model, as of this message

This is the current content of workspace/model.txt. You can see it; never ask the
user whether a model exists or to paste one. Re-read the file before editing it,
since the user may have typed since.

\`\`\`
${src.trim()}
\`\`\``;

/* Workflows off: the orchestration is skipped, the scientific discipline is not. */
export const NO_WORKFLOW = `
## Workflow disabled for this session

The Workflow tool is NOT available and the ${WORKFLOW} workflow will not run. The
user turned it off deliberately, because the full seven-stage sequence is slow.
Do not ask for it back and do not refuse the work.

Do the analysis directly instead, and keep every other rule in your definition:
inspect the model before any claim about it, load the \`mca\` and \`tellurium\` Skills
with the Skill tool before asserting anything either of them is the authority on,
compute nothing from memory - every number still comes from a Tellurium run you
performed - and still say how well supported each part of your answer is.

Be proportionate: a short question gets a short, direct answer.
`.trim();

// Sessions this process actually started. A id is claimed once with --session-id
// and continued with --resume; guessing wrong is an immediate exit(1).
const STARTED = new Set();

export function runAgent({ root, prompt, sessionId, model, env = {}, useWorkflow = true,
                          liveModel = '', onEvent }) {
  const resuming = !!sessionId && STARTED.has(sessionId);
  const sid = resuming ? sessionId : randomUUID();
  STARTED.add(sid);
  const args = [
    '-p', prompt,
    '--agent', AGENT,
    '--output-format', 'stream-json',
    '--verbose',
    '--include-partial-messages',
    '--forward-subagent-text',            // surface the workflow subagents' reasoning too
    // A session id may only be *claimed* once; continuing one is --resume.
    ...(resuming ? ['--resume', sid] : ['--session-id', sid]),
    '--setting-sources', 'project',
    '--permission-mode', 'acceptEdits',
    '--permission-prompts', 'none',
    // Narrow, not bypassed: the agent may run the project's own venv python and
    // read/edit files in the project, and nothing else. Widen only deliberately.
    '--allowedTools',
    'Skill', ...(useWorkflow ? ['Workflow'] : []), 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'TodoWrite',
    'Bash(./.venv/bin/python:*)', 'Bash(.venv/bin/python:*)', 'Bash(cat:*)', 'Bash(ls:*)',
    '--append-system-prompt', SYSTEM_APPEND + liveModelBlock(liveModel) +
                              (useWorkflow ? '' : '\n\n' + NO_WORKFLOW),
    '--settings', JSON.stringify({ enableWorkflows: useWorkflow }),
    '--add-dir', root,
  ];
  if (model) args.push('--model', model);

  const proc = spawn('claude', args, {
    cwd: root,
    // extended thinking is off by default in print mode; the UI has a place to show it
    env: { MAX_THINKING_TOKENS: '6000', ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let buf = '';
  proc.stdout.setEncoding('utf8');
  proc.stdout.on('data', d => {
    buf += d;
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i); buf = buf.slice(i + 1);
      if (!line.trim()) continue;
      try { onEvent(JSON.parse(line)); }
      catch { /* a non-JSON line from the CLI is noise, not a turn */ }
    }
  });
  proc.stderr.setEncoding('utf8');
  proc.stderr.on('data', d => onEvent({ type: 'stderr', text: String(d) }));
  proc.on('error', e => onEvent({ type: 'fatal', error: e.code === 'ENOENT'
    ? 'The `claude` CLI was not found on PATH. Install Claude Code, or pick a different runtime in Settings.'
    : e.message }));
  proc.on('close', code => onEvent({ type: 'done', code, sessionId: sid }));

  return { sessionId: sid, kill: () => proc.kill('SIGTERM') };
}

/* Flatten the CLI's stream-json into the few event shapes the UI actually renders. */
export function toUiEvent(ev) {
  if (ev.type === 'stderr' || ev.type === 'fatal' || ev.type === 'done') return ev;
  if (ev.type === 'system' && ev.subtype === 'init')
    return { type: 'init', model: ev.model, tools: ev.tools, agents: ev.agents, sessionId: ev.session_id };
  if (ev.type === 'stream_event') {
    const d = ev.event?.delta;
    if (d?.type === 'text_delta' && d.text) return { type: 'delta', text: d.text };
    if (d?.type === 'thinking_delta' && d.thinking) return { type: 'thinking', text: d.thinking };
    return null;
  }
  if (ev.type === 'assistant') {
    const out = [];
    let thought = '';
    for (const c of ev.message?.content ?? []) {
      if (c.type === 'tool_use') out.push({ name: c.name, input: c.input });
      else if (c.type === 'thinking' && c.thinking) thought += c.thinking;
    }
    // whole-block thinking; the UI drops it if the deltas already delivered it
    if (thought) return { type: 'thinking', text: thought, whole: true,
                          tools: out.length ? out : undefined };
    return out.length ? { type: 'tools', tools: out } : null;
  }
  if (ev.type === 'user') {
    const c = ev.message?.content?.find?.(x => x.type === 'tool_result');
    if (c) return { type: 'tool_result', isError: !!c.is_error };
    return null;
  }
  if (ev.type === 'result')
    return { type: 'result', text: ev.result, isError: ev.is_error,
             ms: ev.duration_ms, cost: ev.total_cost_usd, turns: ev.num_turns };
  return null;
}
