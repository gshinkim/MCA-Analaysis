/* Sessions on disk. One folder per session under workspace/runs/, holding the
   conversation, a snapshot of the model and settings, the rolling summary, and
   whatever files the AI wrote. The folder list IS the session list — there is no
   index to fall out of sync with the directory. */

/** Filesystem-safe name. Must stay identical to slug() in web/js/util.mjs;
    backend/sessions.test.mjs pins the two together. */
export const slug = s => String(s).replace(/[\/\\:*?"<>|\x00-\x1f]/g, '').replace(/\s+/g, '-')
                                  .replace(/^[.\-]+|[.\-]+$/g, '').slice(0, 80);
