import { $ } from './util.mjs';

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

  return { status: 'cors', detail:
    'Could not reach ' + baseUrl + '. Either the server is not running, or it is not ' +
    'allowing this site. Start it with the origin allowed:\n' +
    '  Ollama:      OLLAMA_ORIGINS=' + location.origin + ' ollama serve\n' +
    '  LM Studio:   enable CORS in the server settings\n' +
    '  llama.cpp:   llama-server -m model.gguf --port 8080 --cors' };
}

/** Chat completions against the user's own machine, streamed. */
export async function localChat({ baseUrl, apiKey, model, messages, tools, schema, signal, onStream }){
  const base = baseUrl.replace(/\/+$/,'');
  const url = (/\/v\d+$/.test(base) ? base : base + '/v1') + '/chat/completions';
  const body = { model, messages, stream: true, max_tokens: 4096, temperature: 0.2 };
  if (tools?.length) body.tools = tools;
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

  let content = '', reasoning = '';
  const calls = [];
  const rd = res.body.getReader(), dec = new TextDecoder();
  let buf = '';
  for(;;){
    const { done, value } = await rd.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0){
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line.startsWith('data:')) continue;
      const p = line.slice(5).trim();
      if (p === '[DONE]') continue;
      let d; try { d = JSON.parse(p); } catch { continue; }
      if (d.error) throw new Error(String(d.error.message ?? d.error));
      const delta = d.choices?.[0]?.delta ?? {};
      const think = delta.reasoning ?? delta.reasoning_content;
      if (think) { reasoning += think; onStream?.({ type:'thinking', text: think }); }
      if (delta.content) { content += delta.content; onStream?.({ type:'delta', text: delta.content }); }
      for (const tc of delta.tool_calls ?? []){
        const k = tc.index ?? calls.length;
        calls[k] ??= { id: tc.id || 'call_'+k, type:'function', function:{ name:'', arguments:'' } };
        if (tc.id) calls[k].id = tc.id;
        if (tc.function?.name) calls[k].function.name += tc.function.name;
        if (tc.function?.arguments) calls[k].function.arguments += tc.function.arguments;
      }
    }
  }
  // some servers leave the scratchpad inline instead of in `reasoning`
  if (content.includes('<think>')){
    const parts = [];
    content = content.replace(/<think>([\s\S]*?)<\/think>/g, (_, x) => { parts.push(x); return ''; }).trim();
    if (parts.length) reasoning = [reasoning, ...parts].filter(Boolean).join('\n');
  }
  const msg = { role:'assistant', content, reasoning: reasoning || undefined };
  const tc = calls.filter(Boolean);
  if (tc.length) msg.tool_calls = tc;
  return msg;
}
