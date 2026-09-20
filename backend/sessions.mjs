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
  const srcExists = !!(await stat(srcDir).catch(() => null));
  for (let n = 1; n < 1000; n++) {
    const id = n === 1 ? want : `${want}-${n}`;
    if (id === keep) return { id, dir: srcDir };
    const target = await sessionDir(runsRoot, id);
    try {
      if (srcExists) await rename(srcDir, target); else await mkdir(target);
      return { id, dir: target };
    } catch (err) {
      if (err.code === 'EEXIST' || err.code === 'ENOTEMPTY') continue; // taken since the check — try the next id
      throw err;
    }
  }
  throw new Error('too many sessions named ' + want);
}

// the frontend's placeholder title for a session nobody has named yet
// (web/js/main.mjs PROJ_DEF); a session still carrying it should keep its
// date-stamped id rather than being renamed to a folder called Untitled-project
const DEFAULT_NAME = 'Untitled project';
// case/whitespace-insensitive: 'untitled project', 'Untitled Project' and
// ' Untitled project ' are all still semantically the unnamed placeholder even
// though saveSession is a server API and nothing guarantees the frontend's
// exact casing/trim reaches it
const isPlaceholder = name => String(name ?? '').trim().toLowerCase() === DEFAULT_NAME.toLowerCase();

export async function saveSession(runsRoot, { id, name, chats = [], settings = {}, model = '' }) {
  let dir = await sessionDir(runsRoot, id);
  const prev = await readMeta(dir).catch(() => null);

  // the project name is the folder name; a rename moves the folder with it
  const want = slug(name) || id;
  let finalId = id;
  if (!isPlaceholder(name) && want !== id) {
    const claim = await claimId(runsRoot, want, id, dir);
    finalId = claim.id;
    dir = claim.dir;
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

export const THINKING = 'thinking.md';
// Chars of reasoning kept per turn. Bounds a runaway reasoning model — not a token
// budget, just a ceiling so one turn can't write an unbounded file to disk.
export const THINK_CAP = 8000;
// Chars kept for the WHOLE file. Without this, appendFile grows thinking.md by up
// to THINK_CAP every single turn forever. 200,000 is ~25 turns at the per-turn cap
// — enough that a human reviewing a session still finds real recent context, small
// enough that opening the file in an editor stays instant.
export const THINKING_TOTAL_CAP = 200_000;

const DROPPED_NOTE = '_(earlier reasoning was dropped to keep this file bounded)_\n\n';

/** Split thinking.md's text into its `## <timestamp> — <prompt>` blocks (the
    heading renderThinking emits), each running up to the next heading or EOF.
    Strips the dropped-note line first, if present, so it is never mistaken
    for part of a block. Pure — no I/O. */
function thinkingBlocks(text) {
  const body = text.startsWith(DROPPED_NOTE) ? text.slice(DROPPED_NOTE.length) : text;
  return body.split(/(?=^## )/m).filter(b => b.trim());
}

/** Bound thinking.md to `cap` total characters by dropping the OLDEST whole
    blocks — never the newest (`newBlock`, always kept in full even if that
    alone exceeds `cap`), never mid-block. Once anything has ever been
    dropped, a note is kept at the top saying so — recomputed fresh each
    call, so it is never duplicated by repeated trims. Pure — no I/O. */
export function boundThinking(existingText, newBlock, cap = THINKING_TOTAL_CAP) {
  const had = String(existingText ?? '').startsWith(DROPPED_NOTE);
  const blocks = [...thinkingBlocks(existingText ?? ''), newBlock];
  let noteNeeded = had;
  while (blocks.length > 1 && blocks.join('').length + (noteNeeded ? DROPPED_NOTE.length : 0) > cap) {
    blocks.shift();
    noteNeeded = true;
  }
  return (noteNeeded ? DROPPED_NOTE : '') + blocks.join('');
}

/** One turn's block for thinking.md: a heading naming the turn (timestamp + the
    user's prompt, trimmed), then the model's reasoning, capped. Pure — no I/O —
    so the cap and formatting are testable without a filesystem. */
export function renderThinking(prompt, text, cap = THINK_CAP, now = () => new Date()) {
  const body = String(text ?? '').trim();
  if (!body) return '';
  const clipped = body.length > cap
    ? body.slice(0, cap) + `\n\n_(truncated at ${cap} characters)_` : body;
  const p = String(prompt ?? '').trim().replace(/\s+/g, ' ').slice(0, 120) || '(no prompt)';
  return `## ${now().toISOString()} — ${p}\n\n${clipped}\n`;
}

/** Append one turn's thinking to thinking.md, then bound the WHOLE file to
    `totalCap`, dropping the oldest blocks first (see boundThinking). Never
    throws into the caller's turn on its own — server.mjs still wraps this the
    way it wraps writeSummary. */
export async function appendThinking(dir, prompt, text, cap = THINK_CAP,
                                      totalCap = THINKING_TOTAL_CAP, now = () => new Date()) {
  const block = renderThinking(prompt, text, cap, now);
  if (!block) return;
  await mkdir(dir, { recursive: true });
  const existing = await readFile(join(dir, THINKING), 'utf8').catch(() => '');
  await writeFile(join(dir, THINKING), boundThinking(existing, block + '\n', totalCap));
}

export const KEEP = 12;

/** Newest `keep` messages stay; everything older is what gets folded into the summary. */
export function splitHistory(history, keep = KEEP) {
  const h = history ?? [];
  if (h.length <= keep) return { fold: [], recent: h.slice() };
  return { fold: h.slice(0, h.length - keep), recent: h.slice(h.length - keep) };
}

/** The one place that decides what a turn sends the model and what backs it up.
    `messages` is the live window (last `keep`) — send this, not the full history.
    `fold` is what just aged out of the window — the caller compresses/records this
    into summary.md at the end of the turn, for NEXT turn's `summaryText`.
    `inject` is what goes in the system prompt THIS turn: the summary already on
    disk, describing only turns folded in *earlier* turns — never the live window,
    which is exactly the contradiction that sent a local model into a loop (it was
    told a turn was old and settled while also being handed it live). Empty until
    something has actually folded. Pure — no I/O — so the invariant is testable
    without a filesystem or a model call. */
export function buildTurn(history, summaryText, keep = KEEP) {
  const { fold, recent } = splitHistory(history, keep);
  return { messages: recent, fold, inject: (summaryText ?? '').trim() };
}

/** Plain, no-model record of a conversation: every message, oldest first, no
    compression. Cheap enough to write on every turn — this is what summary.md
    gets when there's nothing worth spending a model call on yet, or no cheap
    completion endpoint to spend it on (the Claude Code runtime). */
export function renderRecord(history) {
  return (history ?? []).map(m => `**${m.role}:** ${m.content}`).join('\n\n');
}

/** Same record, but bounded: the newest `keep` messages verbatim, older ones
    collapsed to a one-line count. Used on a long conversation when there's no
    cheap completion endpoint to compress it (Claude Code) — the alternative,
    shelling out to `claude -p` for a compression pass, costs a whole extra
    agent turn per twelve messages, so we trim instead of compress. */
export function trimRecord(history, keep = KEEP) {
  const h = history ?? [];
  if (h.length <= keep) return renderRecord(h);
  const dropped = h.length - keep;
  return `_(${dropped} earlier message${dropped === 1 ? '' : 's'} omitted — this runtime ` +
    `has no cheap compression step)_\n\n` + renderRecord(h.slice(h.length - keep));
}

/** What summary.md should get this turn:
    - 'record'   — short history, any runtime: plain record, no model call.
    - 'compress' — long history, a runtime with a cheap completion endpoint
                   (OpenAI-compatible, chatCfg usable): the existing
                   summaryPrompt/Chat.complete compaction.
    - 'trim'     — long history, no cheap completion endpoint (Claude Code):
                   bounded plain record instead. */
export function summaryStrategy(historyLength, canCompress) {
  if ((historyLength ?? 0) <= KEEP) return 'record';
  return canCompress ? 'compress' : 'trim';
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
