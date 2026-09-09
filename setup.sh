#!/usr/bin/env bash
# One-time setup: a Python that Tellurium supports, plus the .claude asset mirror.
set -euo pipefail
cd "$(dirname "$0")"

PY=""
for c in python3.12 python3.11 python3.10; do command -v "$c" >/dev/null 2>&1 && { PY="$c"; break; }; done
if [ -z "$PY" ]; then
  echo "Need Python 3.10-3.12 for Tellurium (roadrunner has no wheels for 3.13+)."
  echo "  brew install python@3.12"
  exit 1
fi

[ -d .venv ] || "$PY" -m venv .venv
./.venv/bin/python -m pip install -q --upgrade pip
./.venv/bin/python -m pip install -q tellurium
./.venv/bin/python -c "import tellurium as te; print('tellurium', te.__version__)"

# Claude Code resolves agents/skills/workflows under .claude/. Symlinks, not copies,
# so anything dropped into skills/ is live on the next agent turn. Recreated here
# because a zip download or a Windows clone will not preserve them.
mkdir -p .claude workspace/runs
for d in skills agents workflows; do
  rm -rf ".claude/$d"
  ln -s "../$d" ".claude/$d" 2>/dev/null || cp -R "$d" ".claude/$d"
done

command -v claude >/dev/null 2>&1 || echo "WARNING: the 'claude' CLI is not on PATH — the AI panel will not run."
echo "Setup complete.  Start with:  ./run.sh"
