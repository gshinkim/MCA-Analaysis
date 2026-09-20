export const S = {
  result: null,          // last simulation from the backend
  hidden: new Set(),     // series toggled off in the legend
  view: null,            // {t0,t1} chart zoom window, null = fit all
  geom: null,            // last chart geometry, for wheel/pan maths
  panning: false,
  lastRunMs: 0,
  env: null,             // /api/env
  local: null,           // /api/local/scan — runtimes found on this machine
  sessionId: null,       // agent session, kept so the chat has memory
  defaultCfg: null,      // frozen default config
  sessionDirId: null,    // folder under workspace/runs for this session, once it exists
};
