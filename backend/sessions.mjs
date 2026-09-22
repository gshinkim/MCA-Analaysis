/* Sessions on disk. One folder per project directly under workspace/, holding the
   conversation, a snapshot of the model and settings, history.md (the agents'
   memory), and whatever files the AI wrote. The folder list IS the session list — there is no
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

/** Claim a free folder name for `want`, retrying past any that turn out to be
    taken. A cheap stat-then-use split (check "is it free", then separately
    rename/mkdir into it) leaves a TOCTOU window: another save can claim the
    name in between, and the rename/mkdir then fails with EEXIST/ENOTEMPTY.
    Closing that window by *retrying the actual claim on failure* — rather
    than trusting an earlier check — means a race is handled no differently
    than an ordinary pre-existing collision. `keep` is the folder already
    being renamed: if a generated candidate coincides with it, that's a
    no-op, not a collision. `srcDir` is renamed in if it exists on disk (an
    already-saved session); a session that was never saved claims the target
    directly via mkdir. */
async function claimId(runsRoot, want, keep, srcDir) {
  const srcExists = !!srcDir && !!(await stat(srcDir).catch(() => null));
  for (let n = 1; n < 1000; n++) {
    const id = n === 1 ? want : `${want}-${n}`;
    if (id === keep) return { id, dir: srcDir };
    const target = await sessionDir(runsRoot, id);
    try {
      if (srcExists) await rename(srcDir, target); else await mkdir(target);
      return { id, dir: target };
    } catch (err) {
      if (['EEXIST', 'ENOTEMPTY', 'ENOTDIR'].includes(err.code)) continue; // taken since the check — try the next id
      throw err;
    }
  }
  throw new Error('too many sessions named ' + want);
}

/* `fresh` is a project's first save: it claims its own folder (Untitled-project,
   Untitled-project-2, …) instead of writing into whatever already has that name.
   After that, the folder only moves when the name actually changes. */
export async function saveSession(runsRoot, { id, name, fresh = false, chats = [], settings = {}, model = '' }) {
  let dir = await sessionDir(runsRoot, id);
  const prev = fresh ? null : await readMeta(dir).catch(() => null);

  let finalId = id;
  if (fresh || (prev && prev.name !== name)) {
    const claim = await claimId(runsRoot, slug(name) || 'Untitled-project', fresh ? null : id,
                                fresh ? null : dir);
    finalId = claim.id;
    dir = claim.dir;
  }

  await mkdir(dir, { recursive: true });
  // history.md exists from the project's first save, not only after its first AI turn
  await writeFile(join(dir, HISTORY), renderHistory({ summary: '', lines: [] }), { flag: 'wx' })
    .catch(e => { if (e.code !== 'EEXIST') throw e; });
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

export async function openSession(runsRoot, id) {
  const dir = await sessionDir(runsRoot, id);
  const m = await readMeta(dir);          // no session.json means no session: let it throw
  const read = (f, d) => readFile(join(dir, f), 'utf8').catch(() => d);
  const settings = await read('settings.json', '{}');
  return {
    id, name: m.name ?? id, chats: m.chats ?? [],
    model: await read('model.txt', ''),
    settings: (() => { try { return JSON.parse(settings); } catch { return {}; } })(),
  };
}

/* Sessions share workspace/ with model.txt, settings.json and runs/. Only a folder
   holding a session.json is a session, so nothing else there can be deleted by id. */
export async function deleteSession(runsRoot, id) {
  const dir = await sessionDir(runsRoot, id);
  await readMeta(dir);
  await rm(dir, { recursive: true, force: true });
}

/* ---------------- history.md: the agents' whole memory of a project ----------------
   One line per entry (what the user asked, how the agent reasoned, what it answered),
   under a single summary. Once the file reaches COMPACT_WORDS, the AI folds the
   summary and every line into a new ~SUMMARY_WORDS summary, and the loop starts
   again — history is carried forward, and the file (and the prompt it is inlined
   into) stays bounded no matter how long the project runs. */
export const HISTORY = 'history.md';
export const COMPACT_WORDS = 1000;
export const SUMMARY_WORDS = 200;
// One entry this long is a runaway, not a turn; the fold would shrink it anyway.
const LINE_CAP = 20_000;
const SUMMARY_TAG = '**Summary so far:** ';

export const words = s => String(s ?? '').split(/\s+/).filter(Boolean).length;

export const oneLine = (s, cap = LINE_CAP) => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > cap ? t.slice(0, cap) + '…' : t;
};

export function turnLines(prompt, thinking, answer) {
  return [['user', prompt], ['thinking', thinking], ['assistant', answer]]
    .filter(([, t]) => String(t ?? '').trim())
    .map(([who, t]) => `- **${who}:** ${oneLine(t)}`);
}

export function parseHistory(text) {
  const all = String(text ?? '').split('\n').filter(l => l.trim() && !l.startsWith('# '));
  const s = all.find(l => l.startsWith(SUMMARY_TAG));
  return { summary: s ? s.slice(SUMMARY_TAG.length) : '', lines: all.filter(l => l !== s) };
}

export const renderHistory = ({ summary, lines }) =>
  ['# History', '', ...(summary ? [SUMMARY_TAG + summary, ''] : []), ...lines].join('\n') + '\n';

export function compactPrompt(summary, batch) {
  return [
    { role: 'system', content:
      'You compress the running history of a computational-biology modelling project. ' +
      `Write about ${SUMMARY_WORDS} words. Keep what the model is, what was asked, every ` +
      'number that was computed and every decision about the model — including everything ' +
      'already in the summary so far, which must carry forward. Drop pleasantries. ' +
      'No preamble — output the summary itself.' },
    { role: 'user', content:
      (summary ? 'Summary so far: ' + summary + '\n\nNewer history to fold in:\n'
               : 'History to summarise:\n') + batch.join('\n') },
  ];
}

/** Once summary + lines reach COMPACT_WORDS, fold them all into one ~SUMMARY_WORDS
    summary. `compact(summary, lines)` is the AI call. If it fails, everything stays
    as it is and the fold is retried next turn — history is never dropped to make room. */
export async function foldHistory({ summary, lines }, compact) {
  if (words(summary) + lines.reduce((n, l) => n + words(l), 0) < COMPACT_WORDS) return { summary, lines };
  // ponytail: a model that is down for many turns lets the file grow past COMPACT_WORDS; fine until it isn't
  const next = oneLine(await compact(summary, lines).catch(() => ''));
  return next ? { summary: next, lines: [] } : { summary, lines };
}

export const readHistory = dir => readFile(join(dir, HISTORY), 'utf8').catch(() => '');

export async function appendHistory(dir, newLines, compact) {
  const h = parseHistory(await readHistory(dir));
  const text = renderHistory(await foldHistory({ ...h, lines: [...h.lines, ...newLines] }, compact));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, HISTORY), text);
  return text;
}
