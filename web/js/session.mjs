import { S } from './state.mjs';
import { slug } from './util.mjs';

/* A session is a folder under workspace/runs/. The folder is created lazily — on
   the first save, not on page load — so refreshing the page does not litter runs/
   with empty dated folders. */

const DEFAULT_NAME = 'Untitled project';

/** Folder name for a project: its slug, or today's date while it is still unnamed. */
export function defaultId(projectName, now = new Date()) {
  const s = slug(projectName ?? '');
  if (!s || s === slug(DEFAULT_NAME)) {
    const p = n => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
  }
  return s;
}

const post = (path, body) => fetch(path, { method: 'POST',
  headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

export const listSessions = () => fetch('/api/sessions').then(r => r.json())
  .then(r => r.sessions ?? []).catch(() => []);

let getName = () => DEFAULT_NAME, getModel = () => '', getSettings = () => ({}),
    getChats = () => [], setAll = () => {};

/** Wire the module to the page once, at boot, rather than importing main.mjs back. */
export function initSession(hooks) { ({ getName, getModel, getSettings, getChats, setAll } = hooks); }

export const currentId = () => S.sessionDirId;

/** No folder exists yet, and nothing in any chat is worth creating one for.
    Guards saveNow against recreating a just-deleted session: once a turn
    completes, its chat gets a log entry and saving proceeds normally. */
export function worthSaving(sessionDirId, chats) {
  return sessionDirId != null || (chats ?? []).some(c => c?.log?.length > 0);
}

export async function saveNow() {
  if (S.env?.hosted) return null;
  if (!worthSaving(S.sessionDirId, getChats())) return null;
  const id = S.sessionDirId ?? defaultId(getName());
  const r = await post('/api/sessions/save', { id, name: getName(), chats: getChats(),
                                               settings: getSettings(), model: getModel() });
  if (r.id) S.sessionDirId = r.id;      // a rename comes back with the new folder name
  return r;
}

/* Autosave is debounced, and deferred while a turn is running: renaming the folder
   out from under a running agent breaks the absolute paths it is holding. */
let t = null, busy = false, pending = false, scheduled = false;
export function saveSoon() {
  clearTimeout(t);
  scheduled = true;
  t = setTimeout(() => { scheduled = false; if (busy) { pending = true; return; } saveNow(); }, 800);
}
export function setTurnBusy(on) {
  busy = on;
  if (!on && pending) { pending = false; saveNow(); }
}

/* A debounce still outstanding (or deferred behind a busy turn) targets whoever
   S.sessionDirId is RIGHT NOW. Call this before that changes, or the save either
   never happens (the old session silently loses its last turn/rename) or fires
   after the switch and re-saves the wrong, now-current session. */
async function flushPending() {
  if (!scheduled && !pending) return;
  clearTimeout(t);
  scheduled = false; pending = false;
  await saveNow();
}

export async function openSessionById(id) {
  await flushPending();                 // save whatever was pending for the OLD session first
  const r = await post('/api/sessions/open', { id });
  if (r.error) throw new Error(r.error);
  S.sessionDirId = r.id ?? id;
  setAll(r);                            // editor, settings, chats, project name
  return r;
}

export async function deleteCurrent() {
  const id = S.sessionDirId;
  if (!id) return { ok: true };
  const r = await post('/api/sessions/delete', { id });
  if (!r.error) S.sessionDirId = null;
  return r;
}
