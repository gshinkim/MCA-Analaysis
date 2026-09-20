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

/** The folder id this session will land in, even before any save has happened —
    the same fallback saveNow() uses. Turn 1 needs this so the server has an sdir
    to write summary.md/thinking.md into from the very first turn, instead of only
    from the second turn onward once currentId() finally has a real value. */
export const pendingId = () => S.sessionDirId ?? defaultId(getName());

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
   out from under a running agent breaks the absolute paths it is holding. `deleting`
   blocks a save from being armed (or re-armed) while deleteCurrent() is in flight —
   without it, a save timer set just before delete(), or one set by a stray caller
   DURING the delete's own await, can fire after the folder is gone and recreate it. */
let t = null, busy = false, pending = false, scheduled = false, deleting = false;
export function saveSoon() {
  if (deleting) return;                 // the current session is being deleted — never arm a save for it
  clearTimeout(t);
  scheduled = true;
  t = setTimeout(() => { scheduled = false; if (busy) { pending = true; return; } saveNow(); }, 800);
}
export function setTurnBusy(on) {
  busy = on;
  if (!on && pending && !deleting) { pending = false; saveNow(); }
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

/* Same triggers as flushPending, but CANCELS instead of flushing: used by
   deleteCurrent(), where writing the folder back out is exactly the opposite of
   what the user just asked for ("I deleted it and it comes back"). */
function cancelPending() {
  clearTimeout(t);
  scheduled = false; pending = false;
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
  deleting = true;                      // block saveSoon()/setTurnBusy() from arming a save until this settles
  cancelPending();                      // a save already armed for THIS id must not race the delete below
  try {
    const r = await post('/api/sessions/delete', { id });
    if (!r.error) S.sessionDirId = null;
    return r;
  } finally {
    deleting = false;
  }
}
