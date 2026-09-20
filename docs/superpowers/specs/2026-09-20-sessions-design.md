# Local sessions — design

**Date:** 2026-09-20
**Status:** approved, pending implementation plan

Local-only. The hosted path (`MCA_HOSTED=1`) is explicitly out of scope: every
route below refuses when `HOSTED` is set, the same way `/api/scratch` already
does (`backend/server.mjs:209`).

## Problem

Three things the app already does are each stored somewhere different, and none
of them survive a reload:

- the live Antimony lives in `workspace/model.txt` (server-side, one file, no history)
- simulation settings live in `workspace/settings.json`
- conversations live **only in memory** in `web/js/chat.mjs:24` — closing the tab loses them

Meanwhile the AI writes its scripts and results flat into `workspace/runs/`, so
every session's output piles into one directory with no way to tell whose is
whose, and no way to delete one session's work without deleting all of it.

A session should be one folder holding all four.

## Already built — not in scope

Verified by reading the source and running the naming logic directly:

- **Editable project name** — `web/index.html:21` (contenteditable breadcrumb),
  `web/js/main.mjs:109-124` (Enter / Escape / blur, persisted to localStorage,
  defaults to "Untitled project").
- **`.ant` download uses the project name** — `web/js/export.mjs:61-70`.
  `"Glycolysis v2"` → `Glycolysis-v2.ant`; still-unnamed falls back to the
  model's own id, then to a timestamp.

Neither needs work. They are listed here so the plan does not rebuild them.

## Disk layout

`workspace/model.txt` **remains the live model.** The agent reads and writes it,
and `server.mjs:273-287` diffs it before/after a turn to emit `model_changed`.
That plumbing is untouched. A session folder holds a *snapshot* plus scratch:

```
workspace/runs/<session-id>/
  session.json    { name, created, updated, chats: [...] }
  summary.md      rolling compressed memory (see below)
  model.txt       snapshot of the Antimony
  settings.json   { start, end, points }
  fcc_scan.py     the AI's own files
  results.csv
```

**Session id is the folder name** — `slug(projectName)`, or `YYYY-MM-DD` while
the name is still "Untitled project". A collision appends `-2`, `-3`, …

**The session list is `readdir` + read each `session.json`.** No index file: an
index is a second source of truth that can disagree with the directory, and
directories are already a list.

**Folder creation is lazy** — on the first chat turn or first explicit save, not
on page load. Eager creation would leave an empty dated folder behind on every
refresh.

`slug()` currently lives in `web/js/export.mjs:57` and already does the exact
filesystem-safe munging folder names need. It moves to `web/js/util.mjs` and is
imported by both callers. The server needs its own copy (it cannot import a
browser module for this); the two must agree, which the tests below pin.

## Server API

`routes` in `backend/server.mjs:136` is an exact-match `"METHOD /path"` table
with no path parameters. Ids therefore travel in the body and the router is
unchanged.

| Route | Body | Does |
|---|---|---|
| `GET /api/sessions` | — | list, newest `updated` first |
| `POST /api/sessions/save` | `{id, name, chats, settings, model}` | renames the folder if `name` changed, then writes `session.json`, `model.txt`, `settings.json` |
| `POST /api/sessions/open` | `{id}` | copies snapshot → `workspace/model.txt`; returns `{name, chats, settings, model}` |
| `POST /api/sessions/delete` | `{id}` | recursively removes that one folder |

### Containment

`delete` and `open` take a user-controlled name and turn it into a path. Both
resolve the candidate and assert the result is strictly inside `RUNS` before
touching anything, rejecting `..`, absolute paths and symlinks that escape.
`resolveScratch` (`server.mjs:69`) is the existing pattern to follow.

This is the one place in this design that does not get the lazy treatment. A
recursive delete driven by a typed string is exactly where a traversal bug costs
a directory that is not ours.

## Rolling summary

The loop the user specified:

```
12 messages → summarise → summary + next 12 → re-summarise → …
```

State is `summary.md` (a file in the session folder) plus the last ≤12 messages.
On overflow, the messages falling off the end are folded into the existing
summary and the file is rewritten. The model is shown `summary` + `recent`.

**Both runtimes read the same file.** This is what makes it a file rather than
an in-memory string or a stream event:

- **Claude Code** — the file's text is inlined into `--append-system-prompt` via
  a new `summaryBlock(text)`, alongside the existing `scratchBlock` and
  `liveModelBlock` (`backend/agent.mjs:80,42,117`). Inlined rather than
  pointed at, so no tool call is needed and no model can skip it.
- **Local / OpenAI** — same text through the `extra` parameter that
  `localSystem({...})` already accepts (`web/js/prompt.mjs:105`).

**Who writes it:** one extra completion to the *currently selected* model, with
tools and workflow off, asking only for a compression. The local path reuses
`Chat.complete`; the Claude path is one short `claude -p`. Both already exist —
no new runtime. This costs one cheap call per 12 turns, and is the reason
compaction is triggered explicitly rather than on every turn.

**Why Claude Code needs it at all**, given `--resume` carries its own memory:
`--resume` is per-machine CLI state and does not survive loading a session on a
different machine, or after the CLI's own session store is cleared.
`summary.md` is the portable memory; `--resume` remains an optimisation on top.

## Rename

Renaming the project renames the folder. Two consequences:

1. **A rename during a running turn is deferred until the turn ends.** The agent
   holds absolute paths into that folder mid-flight.
2. **Bug, in scope:** `STARTED` in `backend/agent.mjs:86` is an in-memory `Set`.
   After a server restart, resuming a Claude session takes the `--session-id`
   branch with a UUID the CLI has already claimed, and fails. Loading a session
   from disk makes this reachable in ordinary use. Fix: a session id that came
   from disk is treated as resumable.

## UI

**Session picker** — a re-skin of the existing `.fp` modal (`web/app.css:321`),
which is already a centered box with `border-radius:14px` and a scrolling list.
The path row becomes a search `<input>` filtering on name; one row per session
showing name and date; most recent selected on open. New CSS: the search row
only.

**Delete Session** — a red button in the chat header beside `#newChat`
(`web/index.html:203`), behind a confirm. It is the only destructive control in
the app and the only irreversible one.

**Open Session** — beside it, opening the picker.

Both are hidden when `S.env.hosted` — there is no local folder to act on.

## Testing

The existing suites are plain `node --test` files next to their subject
(`backend/local-agent.test.mjs`, `web/js/oai.test.mjs`). Same pattern, no new
framework:

- **Containment** — `../`, an absolute path, a symlink pointing outside `RUNS`,
  and a name that slugs to empty are each rejected by `delete` and `open`.
- **Slug agreement** — the browser `slug()` and the server's copy produce
  identical output across the same input table, including the collision suffix.
- **Compaction** — 13 messages in produces a summary plus exactly 12 retained;
  running it twice folds the prior summary in rather than discarding it.
- **Round trip** — save a session, mutate the live model, open the session,
  assert the model, settings and chats all come back.

## Out of scope

- Hosted deployments (every route refuses under `HOSTED`).
- The thinking-box bug. It is a separate investigation across three runtimes
  with probably more than one cause, and is tracked on its own.
- Sharing, syncing or exporting a session as an archive.
