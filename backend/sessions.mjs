/* Sessions on disk. One folder per session under workspace/runs/, holding the
   conversation, a snapshot of the model and settings, the rolling summary, and
   whatever files the AI wrote. The folder list IS the session list — there is no
   index to fall out of sync with the directory. */

/** Filesystem-safe name. Must stay identical to slug() in web/js/util.mjs;
    backend/sessions.test.mjs pins the two together. */
export const slug = s => String(s).replace(/[\/\\:*?"<>|\x00-\x1f]/g, '').replace(/\s+/g, '-')
                                  .replace(/^[.\-]+|[.\-]+$/g, '').slice(0, 80);

import { realpath, readFile, writeFile, mkdir, readdir, rename, stat, rm } from 'node:fs/promises';
import { resolve, sep, join } from 'node:path';

/* A session id is a folder name derived from something the user typed, and
   deleteSession() removes a tree. Resolve it and prove it is inside runs/ before
   anything touches the filesystem — including through a symlink, which resolve()
   alone does not see.

   The root itself is realpathed first, not just the candidate: on macOS tmpdir()
   lives under /var, which is itself a symlink to /private/var, so a non-realpathed
   root would reject every legitimate path underneath it.

   slug() already strips most traversal (slug('..') is '', slug('a/../../b')
   collapses to something with no '/' left in it), so a slugged name alone can
   never resolve outside root — it silently maps a traversal attempt onto some
   other, harmless folder instead of rejecting it. The raw id is checked too, so
   an id that reads like an escape attempt is refused outright rather than quietly
   redirected. Belt (raw-id check) and suspenders (slugged-name check). */
export async function sessionDir(runsRoot, id) {
  const name = slug(id);
  if (!name) throw new Error('empty session name');
  const root = await realpath(runsRoot).catch(() => resolve(runsRoot));

  const rawDir = resolve(root, String(id));
  if (rawDir === root || !(rawDir + sep).startsWith(root + sep))
    throw new Error('session path outside runs/');

  const dir = resolve(root, name);
  if (dir === root || !dir.startsWith(root + sep)) throw new Error('session path outside runs/');
  // an existing entry may be a symlink out of the tree; a missing one cannot be
  const real = await realpath(dir).catch(() => null);
  if (real && real !== dir && !real.startsWith(root + sep)) throw new Error('session path outside runs/');
  return dir;
}

const META = 'session.json';
const readMeta = async dir => JSON.parse(await readFile(join(dir, META), 'utf8'));

export async function listSessions(runsRoot) {
  const entries = await readdir(runsRoot, { withFileTypes: true }).catch(() => []);
  const out = [];
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith('.')) continue;
    // a folder the AI made by hand, or one half-written: skip it rather than fail
    const m = await readMeta(join(runsRoot, e.name)).catch(() => null);
    if (!m) continue;
    out.push({ id: e.name, name: m.name ?? e.name, created: m.created ?? 0,
               updated: m.updated ?? 0, turns: (m.chats ?? []).reduce((n, c) => n + (c.log?.length ?? 0), 0) });
  }
  return out.sort((a, b) => b.updated - a.updated);
}

/** First free folder name for `want`, ignoring `keep` (the folder being renamed). */
async function freeId(runsRoot, want, keep) {
  for (let n = 1; n < 1000; n++) {
    const id = n === 1 ? want : `${want}-${n}`;
    if (id === keep) return id;
    if (!await stat(join(runsRoot, id)).catch(() => null)) return id;
  }
  throw new Error('too many sessions named ' + want);
}

// the frontend's placeholder title for a session nobody has named yet
// (web/js/main.mjs PROJ_DEF); a session still carrying it should keep its
// date-stamped id rather than being renamed to a folder called Untitled-project
const DEFAULT_NAME = 'Untitled project';

export async function saveSession(runsRoot, { id, name, chats = [], settings = {}, model = '' }) {
  let dir = await sessionDir(runsRoot, id);
  const prev = await readMeta(dir).catch(() => null);

  // the project name is the folder name; a rename moves the folder with it
  const want = slug(name) || id;
  let finalId = id;
  if (name !== DEFAULT_NAME && want !== id) {
    finalId = await freeId(runsRoot, want, id);
    const target = await sessionDir(runsRoot, finalId);
    if (await stat(dir).catch(() => null)) await rename(dir, target);
    dir = target;
  }

  await mkdir(dir, { recursive: true });
  const now = Date.now();
  await writeFile(join(dir, META), JSON.stringify(
    { name, created: prev?.created ?? now, updated: now, chats }, null, 2));
  // An empty snapshot is sometimes just a bad read (the editor caught mid-clear), not a
  // real "delete my model". Never let it clobber a real one that's already on disk — but
  // an empty model still writes when there's no existing snapshot (a genuinely new,
  // still-empty session).
  const existingModel = await readFile(join(dir, 'model.txt'), 'utf8').catch(() => null);
  if (model?.trim() || !existingModel?.trim()) await writeFile(join(dir, 'model.txt'), model);
  await writeFile(join(dir, 'settings.json'), JSON.stringify(settings, null, 2));
  return { id: finalId };
}

export const SUMMARY = 'summary.md';

export async function openSession(runsRoot, id) {
  const dir = await sessionDir(runsRoot, id);
  const m = await readMeta(dir);          // no session.json means no session: let it throw
  const read = (f, d) => readFile(join(dir, f), 'utf8').catch(() => d);
  const settings = await read('settings.json', '{}');
  return {
    id, name: m.name ?? id, chats: m.chats ?? [],
    model: await read('model.txt', ''),
    summary: await read(SUMMARY, ''),
    settings: (() => { try { return JSON.parse(settings); } catch { return {}; } })(),
  };
}

export async function deleteSession(runsRoot, id) {
  await rm(await sessionDir(runsRoot, id), { recursive: true, force: true });
}

export const readSummary = async dir => readFile(join(dir, SUMMARY), 'utf8').catch(() => '');
export const writeSummary = async (dir, text) => {
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, SUMMARY), text);
};

export const KEEP = 12;

/** Newest `keep` messages stay; everything older is what gets folded into the summary. */
export function splitHistory(history, keep = KEEP) {
  const h = history ?? [];
  if (h.length <= keep) return { fold: [], recent: h.slice() };
  return { fold: h.slice(0, h.length - keep), recent: h.slice(h.length - keep) };
}

/* Carrying the previous summary back in is the whole point: each pass compresses
   summary + the next batch into one summary, so memory of turn 1 survives turn 90
   instead of falling off the end. */
export function summaryPrompt(prevSummary, fold) {
  const transcript = (fold ?? []).map(m => `${m.role}: ${m.content}`).join('\n\n');
  return [
    { role: 'system', content:
      'You compress the memory of a computational-biology modelling session. Write ' +
      'notes to your future self: what the model is, what was asked, what was computed ' +
      'and what the numbers were. Keep every quantitative result and every decision ' +
      'about the model. Drop pleasantries and restatements. Prose or bullets, under ' +
      '400 words, no preamble — output the notes themselves.' },
    { role: 'user', content:
      (prevSummary?.trim()
        ? 'Notes so far:\n\n' + prevSummary.trim() + '\n\n---\n\nNewer turns to fold in:\n\n'
        : 'Turns to summarise:\n\n') + transcript },
  ];
}
