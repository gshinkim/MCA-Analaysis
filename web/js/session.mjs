import { S } from './state.mjs';
import { slug } from './util.mjs';

/* A project is a folder under workspace/. It is created on the first touch (an edit,
   a rename, a chat) — never on page load, so a project opened and closed untouched
   leaves nothing behind. */

const DEFAULT_NAME = 'Untitled project';

const post = (path, body) => fetch(path, { method: 'POST',
  headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

export const listSessions = () => fetch('/api/sessions').then(r => r.json())
  .then(r => r.sessions ?? []).catch(() => []);

let getName = () => DEFAULT_NAME, getModel = () => '', getSettings = () => ({}),
    getChats = () => [], setAll = () => {};

/** Wire the module to the page once, at boot, rather than importing main.mjs back. */
export function initSession(hooks) { ({ getName, getModel, getSettings, getChats, setAll } = hooks); }

export const currentId = () => S.sessionDirId;

/* Nothing has been touched and no folder exists: saving would create a folder for
   an untouched project. Also what stops a just-deleted project coming back from a
   stray save — deleteCurrent() clears `touched` along with the folder id. */
let touched = false;
export const touch = () => { touched = true; };
export const worthSaving = (sessionDirId, isTouched) => sessionDirId != null || !!isTouched;

/* Saves run one at a time: two first-saves in flight together would each claim a
   folder, leaving a stray Untitled-project-2 behind. */
let chain = Promise.resolve();
export const saveNow = () => (chain = chain.then(doSave, doSave));

async function doSave() {
  if (S.env?.hosted) return null;
  if (!worthSaving(S.sessionDirId, touched)) return null;
  const fresh = S.sessionDirId == null;
  const id = S.sessionDirId ?? (slug(getName()) || slug(DEFAULT_NAME));
  const r = await post('/api/sessions/save', { id, fresh, name: getName(), chats: getChats(),
                                               settings: getSettings(), model: getModel() });
  if (r.id) S.sessionDirId = r.id;      // a new folder or a rename comes back with its name
  return r;
}

/* Autosave is debounced, and deferred while a turn is running: renaming the folder
   out from under a running agent breaks the absolute paths it is holding. `deleting`
   blocks a save from being armed (or re-armed) while deleteCurrent() is in flight —
   without it, a save timer set just before delete(), or one set by a stray caller
   DURING the delete's own await, can fire after the folder is gone and recreate it.
   It's a COUNTER, not a boolean: the confirm() button isn't disabled fast enough to
   rule out two overlapping deleteCurrent() calls, and with a boolean the FIRST
   call's finally would clear it while the SECOND call's post() is still pending,
   reopening the window. Only the last delete to settle may re-enable saving. */
let t = null, busy = false, pending = false, scheduled = false, deleting = 0;
export function saveSoon() {
  if (deleting > 0) return;             // a delete is in flight — never arm a save for it
  touch();                              // every caller is a user action
  clearTimeout(t);
  scheduled = true;
  t = setTimeout(() => { scheduled = false; if (busy) { pending = true; return; } saveNow(); }, 800);
}
export function setTurnBusy(on) {
  busy = on;
  if (!on && pending && deleting === 0) { pending = false; saveNow(); }
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

/** Start a new, untouched Untitled project — what a page reload used to be for.
    The old project's pending save lands in ITS folder first; nothing is created
    for the new one until it is touched. */
export async function newProject() {
  await flushPending();
  S.sessionDirId = null;
  touched = false;
}

/** Delete any saved project. Deleting the open one also forgets it, so the page is
    back to an untouched Untitled project that will not recreate the folder. */
export async function deleteSessionById(id) {
  if (!id) return { ok: true };
  const isCurrent = id === S.sessionDirId;
  if (isCurrent) {
    deleting++;                         // block saveSoon()/setTurnBusy() from arming a save until this settles
    cancelPending();                    // a save already armed for THIS id must not race the delete below
  }
  try {
    const r = await post('/api/sessions/delete', { id });
    if (!r.error && isCurrent) { S.sessionDirId = null; touched = false; }
    return r;
  } finally {
    if (isCurrent) deleting--;
  }
}

export const deleteCurrent = () => deleteSessionById(S.sessionDirId);
