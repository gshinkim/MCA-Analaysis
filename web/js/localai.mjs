import { readCompletion, fitMessages, CONTEXT_DEFAULT, replyTokens } from './oai.mjs';

/* Reaching a model server on the user's own machine from a hosted https page.
   Chrome 141+ gates this behind the Local Network Access permission, which only
   prompts on a user gesture — so the "Connect" button is not decoration, it is
   the mechanism. Three things can go wrong and they look identical from JS, so
   probe() distinguishes them explicitly. */

export const LOOPBACK = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

/** 127.0.0.1 is the `loopback` space, not `local`; annotating it `local` fails. */
function spaceFor(url){
  try { return LOOPBACK.test(new URL(url).origin) ? 'loopback' : 'local'; }
  catch { return undefined; }
}

async function ping(base, path, init = {}){
  const url = base.replace(/\/+$/,'') + path;
  const space = spaceFor(url);
  const opts = { ...init, ...(space ? { targetAddressSpace: space } : {}) };
  try {
    return { ok: true, res: await fetch(url, opts) };
  } catch (e) {
    // a mis-annotated address space rejects instantly; retry unannotated once
    if (space) { try { return { ok: true, res: await fetch(url, init) }; } catch {} }
    return { ok: false, error: e };
  }
}

export async function permissionState(){
  try { return (await navigator.permissions.query({ name: 'local-network-access' })).state; }
  catch { return 'unsupported'; }
}

/**
 * One command per runtime that makes it accept this site — a terminal command for
 * each, not a paragraph mixing all three. `origin` is this exact deployment, so the
 * Ollama line can be pasted as-is.
 */
export const corsCommands = (origin = location.origin) => [
  { app: 'Ollama', cmd: `OLLAMA_ORIGINS=${origin} ollama serve`,
    note: 'Quit the Ollama menu-bar app first — it holds port 11434.' },
  { app: 'LM Studio', cmd: 'lms server start --cors',
    note: 'Or: Developer tab → enable CORS, then start the server.' },
  { app: 'llama.cpp', cmd: 'llama-server -m model.gguf --port 8080 --cors',
    note: 'Point --port at whatever URL you set above.' },
];

/**
 * Diagnose a local model server. MUST be called from a click: the browser only
 * shows the Local Network Access prompt during a user gesture.
 * @returns {{status:'ok'|'permission'|'cors'|'offline'|'http', models?:string[], detail:string}}
 */
export async function probe(baseUrl){
  if (!baseUrl) return { status: 'offline', detail: 'No server URL set.' };
  const before = await permissionState();
  const t0 = performance.now();
  const r = await ping(baseUrl, '/v1/models');
  const ms = performance.now() - t0;

  if (r.ok && r.res.ok) {
    const j = await r.res.json().catch(() => ({}));
    const models = (j.data ?? j.models ?? []).map(m => m.id ?? m.name).filter(Boolean);
    return { status: 'ok', models,
             detail: models.length ? models.length + ' model' + (models.length===1?'':'s') + ' available'
                                   : 'connected, but the server lists no models' };
  }
  if (r.ok) return { status: 'http', detail: 'Server answered HTTP ' + r.res.status +
                                             '. Is that the right URL for an OpenAI-compatible API?' };

  const after = await permissionState();
  if (after === 'denied')
    return { status: 'permission', detail:
      'Local network access is blocked for this site. Click the icon at the left of the ' +
      'address bar → Site settings → allow "Local network access", then try again.' };
  if (before === 'prompt' && after === 'prompt' && ms < 50)
    return { status: 'permission', detail:
      'The browser blocked the request to your machine. Click Connect again and choose ' +
      'Allow on the "local network" prompt.' };

  return { status: 'cors', cmds: corsCommands(),
    detail: 'Could not reach ' + baseUrl + '. It is either not running, or not allowing ' +
            'this site. Run the one for your app, then press Connect again.' };
}

/** Chat completions against the user's own machine, streamed. */
export async function localChat({ baseUrl, apiKey, model, messages, tools, schema, signal,
                                  onStream, contextTokens, replyPct }){
  const base = baseUrl.replace(/\/+$/,'');
  const url = (/\/v\d+$/.test(base) ? base : base + '/v1') + '/chat/completions';
  // Sized to the window the runtime actually loaded, not to the weights' maximum:
  // asking for more than it holds truncates the prompt instead of lengthening the
  // answer, and that truncation is what made the model repeat itself.
  const ctx = Number(contextTokens) > 0 ? Number(contextTokens) : CONTEXT_DEFAULT;
  const body = { model, messages: fitMessages(messages, ctx), stream: true,
                 max_tokens: replyTokens(ctx, replyPct), temperature: 0.2 };
  if (tools?.length) body.tools = tools;
  else body.tool_choice = 'none';          // a server that honours it cannot emit a call
  if (schema) body.response_format = { type:'json_schema',
                                       json_schema:{ name:'result', strict:true, schema } };
  const space = spaceFor(url);
  const res = await fetch(url, {
    method: 'POST', signal,
    ...(space ? { targetAddressSpace: space } : {}),
    headers: { 'content-type':'application/json',
               ...(apiKey ? { authorization: 'Bearer ' + apiKey } : {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(model + ': HTTP ' + res.status + ' ' + (await res.text().catch(()=>'')).slice(0,200));
  if (!res.body) throw new Error('no response body from ' + url);

  const msg = await readCompletion(res, {
    onStream, toolNames: (tools ?? []).map(t => t.function?.name) });
  if (!msg.tool_calls?.length && msg.finish === 'length') onStream?.({ type:'log',
    text: model + ' hit its token limit before finishing — the answer is cut off.' });
  return msg;
}
