/* Wire quirks of OpenAI-compatible servers, shared by the browser runtime
   (web/js/localai.mjs) and the server runtime (backend/local-agent.mjs).
   Pure: no DOM, no node builtins, so both can import it. */

const OPEN = '<think>', CLOSE = '</think>';

/** Longest tail of s that could be the beginning of a think tag. */
const partial = s => {
  for (let n = Math.min(CLOSE.length - 1, s.length); n > 0; n--) {
    const t = s.slice(-n);
    if (OPEN.startsWith(t) || CLOSE.startsWith(t)) return n;
  }
  return 0;
};

/**
 * Split reasoning from answer *while it streams*.
 *
 * Ollama puts the scratchpad in a `reasoning` delta, but llama.cpp, LM Studio and
 * any plain GGUF leave it inline as <think>…</think>. Splitting only once the
 * stream ended (what this used to do) meant the whole scratchpad streamed into the
 * answer bubble and the thinking panel never opened at all. Qwen's chat template
 * also pre-opens the tag, so </think> can arrive with no <think> — text before a
 * first unmatched close is reasoning.
 */
export function thinkStream(onStream) {
  let buf = '', inThink = false, sawTag = false, content = '', reasoning = '';
  const out = (text, think) => {
    if (!text) return;
    if (think) { reasoning += text; onStream?.({ type: 'thinking', text }); }
    else { content += text; onStream?.({ type: 'delta', text }); }
  };
  return {
    push(chunk) {
      buf += chunk;
      for (;;) {
        const o = buf.indexOf(OPEN), c = buf.indexOf(CLOSE);
        if (o < 0 && c < 0) break;
        if (o >= 0 && (c < 0 || o < c)) {
          out(buf.slice(0, o), inThink);
          buf = buf.slice(o + OPEN.length); inThink = true; sawTag = true;
        } else {
          // an unmatched close: the template pre-opened <think>, so everything
          // already streamed as answer was really thinking. Say so and move it.
          if (!sawTag && content) {
            reasoning += content; content = '';
            onStream?.({ type: 'unthink' });
          }
          out(buf.slice(0, c), inThink || !sawTag);
          buf = buf.slice(c + CLOSE.length); inThink = false; sawTag = true;
        }
      }
      const keep = partial(buf);          // a tag may be split across two chunks
      out(buf.slice(0, buf.length - keep), inThink);
      buf = keep ? buf.slice(-keep) : '';
    },
    end() {
      out(buf, inThink); buf = '';
      return { content: content.trim(), reasoning: reasoning.trim() || undefined };
    },
  };
}

/* Every shape a model uses when it writes a tool call as prose instead of emitting
   one: <tool_call> tags (Qwen, Hermes), a fenced block (Gemma's template, most
   text protocols), or a bare object. */
const BLOB = /<tool_call>([\s\S]*?)<\/tool_call>|```(?:json|tool_call|tool_code)?\s*([\s\S]*?)```/g;

/**
 * Recover tool calls a model wrote as text.
 *
 * Gemma-class models have no tool tokens. The server prompts the schemas in text
 * and the model answers with a JSON blob, which arrives as ordinary content with
 * no `tool_calls` — so the agent loop reads it as "done, no tools" and the model
 * looks like it simply cannot call anything. Only names the caller offers are
 * accepted, so ordinary prose that happens to contain JSON is never mistaken for
 * a call.
 */
export function textToolCalls(content, names) {
  if (!content || !names?.length) return [];
  const known = new Set(names);
  const out = [];
  const add = v => {
    for (const o of Array.isArray(v) ? v : [v]) {
      const name = o?.name ?? o?.tool ?? o?.tool_name ?? o?.function?.name;
      if (!known.has(name)) continue;
      const a = o.arguments ?? o.parameters ?? o.args ?? o.input ?? o.function?.arguments ?? {};
      out.push({ id: 'text_' + out.length, type: 'function',
                 function: { name, arguments: typeof a === 'string' ? a : JSON.stringify(a) } });
    }
  };
  const blobs = [];
  for (const m of String(content).matchAll(BLOB)) blobs.push(m[1] ?? m[2]);
  blobs.push(content);                                     // an unfenced bare object
  for (const b of blobs) {
    const t = String(b).trim();
    const a = Math.min(...['{', '['].map(c => (t.indexOf(c) + 1 || Infinity)) ) - 1;
    const z = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
    if (!(a >= 0 && z > a)) continue;
    try { add(JSON.parse(t.slice(a, z + 1))); } catch { continue; }
    if (out.length) return out;                            // first blob that parses wins
  }
  return out;
}

/** The tool-call protocol for a model whose runtime gives it no tool API. */
export const TEXT_TOOL_PROTOCOL = `
## If you cannot emit a tool call

Some runtimes give you no tool API. If you cannot emit a real tool call, write one
as text instead, alone on its own lines, and stop:

<tool_call>{"name": "<tool>", "arguments": {"<arg>": "<value>"}}</tool_call>

It is executed and the result comes back like any other tool result. Never describe
a call you did not make, and never invent its output.`.trim();

/** Strip our own bookkeeping before a message goes back to the server.
    `reasoning` and `finish_reason` are not part of the chat schema; echoing prior
    thinking also degrades tool calling on Qwen-family models. */
export const forHistory = m => ({
  role: 'assistant',
  content: m.content ?? '',
  ...(m.tool_calls?.length ? { tool_calls: m.tool_calls } : {}),
});

/** Streamed tool-call deltas, accumulated. Some servers send `arguments` as an
    object rather than a JSON string; concatenating that yields "[object Object]". */
export function mergeToolDeltas(calls, deltas) {
  for (const tc of deltas ?? []) {
    const k = tc.index ?? calls.length;
    calls[k] ??= { id: tc.id || 'call_' + k, type: 'function', function: { name: '', arguments: '' } };
    if (tc.id) calls[k].id = tc.id;
    if (tc.function?.name) calls[k].function.name += tc.function.name;
    const a = tc.function?.arguments;
    if (a != null && a !== '') calls[k].function.arguments += typeof a === 'string' ? a : JSON.stringify(a);
  }
  return calls;
}

/**
 * Run a tool by name, and when the model invents one, say what actually exists.
 *
 * The agent definition tells the model to call Read, Write, Edit, Skill and
 * Workflow; the local runtimes offer read_model/write_model/simulate/... instead.
 * A model that follows the prose got back "impl[name] is not a function", which
 * names neither the problem nor the fix, so it had no way to recover.
 */
export async function callTool(impl, name, args) {
  const fn = impl?.[name];
  if (typeof fn !== 'function')
    return `ERROR: there is no tool called "${name}" here. Your tools are: ` +
           Object.keys(impl ?? {}).join(', ') + '. Call one of those instead.';
  try { return await fn(args); }
  catch (e) { return 'ERROR: ' + (e?.message ?? e); }
}
