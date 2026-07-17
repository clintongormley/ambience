#!/usr/bin/env bash
# Print the path of a Python interpreter that has the integration's deps.
#
# Single source of truth for every backend gate that runs `python -m bin.*` —
# the Makefile's $(PYTHON) and bin/release.sh's AI-docs step both resolve their
# interpreter through here instead of trusting a bare `python`/`python3`.
#
# Why this exists: a dev shell frequently has mcp-server/.venv ACTIVATED
# (VIRTUAL_ENV), which puts an interpreter with NONE of the integration's deps at
# the front of PATH. Bare `python`/`python3` then resolves to it and every gate
# dies at `import homeassistant` / `import yaml` — while the identical command
# works in CI, where python3 has the deps. Rather than make each gate special-case
# that, they all ask here for one that can actually import the deps.
#
# Search order, first qualifying candidate wins:
#   1. $PYTHON            — explicit override (also how `make PYTHON=… <t>` flows in)
#   2. python3            — CI, and a dev shell whose active venv is the right one
#   3. ~/.venv/bin/python — the backend venv this repo's tests/tooling use, the one
#                           the activated mcp-server/.venv shadows
# Fails CLOSED (non-zero, message on stderr, nothing on stdout) if none qualify,
# so a downstream `$(PYTHON) -m bin.*` never runs against a broken interpreter.
#
# The probed module is `homeassistant` (the integration's headline dep; anything
# that has it also has pyyaml, which HA requires). It is overridable via
# PY_WITH_DEPS_PROBE purely as a TEST seam — the same override idiom release.sh
# uses for BUILD_CMD / AI_DOCS_CMD / MCP_PYPI_CHECK_CMD — so the selection logic
# can be exercised without a second, deps-less interpreter to hand.
set -euo pipefail

probe_module="${PY_WITH_DEPS_PROBE:-homeassistant}"
# find_spec locates the module without importing it, so the probe stays fast
# (no multi-second `import homeassistant`) while still proving it is importable.
probe="import importlib.util, sys; sys.exit(0 if importlib.util.find_spec(\"${probe_module}\") else 1)"

for candidate in "${PYTHON:-}" python3 "$HOME/.venv/bin/python"; do
  [ -n "$candidate" ] || continue
  command -v "$candidate" >/dev/null 2>&1 || continue
  if "$candidate" -c "$probe" >/dev/null 2>&1; then
    command -v "$candidate"
    exit 0
  fi
done

echo "error: no Python with the integration's deps (${probe_module}) found." >&2
echo "  Tried \$PYTHON, python3, ~/.venv/bin/python. Install the deps" >&2
echo "  (pip install -e '.[test]') or set PYTHON=/path/to/python." >&2
exit 1
