"""Layla as a warm worker for backend/router.mjs: one JSON line in {id, state, questions},
one line out {id, ok, result: {skill: P(needed)}} — the same answer shape as Jev."""
import json, os, sys

from laya import Agent

agent = Agent(os.path.join(os.path.dirname(os.path.abspath(__file__)), "checkpoint"))
print("READY", file=sys.stderr, flush=True)
for line in sys.stdin:
    m = json.loads(line)
    try:
        a = agent.predict(m["state"], m["questions"])["answers"]
        out = {"id": m["id"], "ok": True, "result": {k: v["noul"] for k, v in a.items()}}
    except Exception as e:
        out = {"id": m["id"], "ok": False, "error": str(e)}
    print(json.dumps(out), flush=True)
