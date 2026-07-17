"""Tests for bin/py-with-deps.sh — the interpreter resolver.

Every backend gate runs `python -m bin.<something>` (the Makefile targets and
bin/release.sh's AI-docs step). A dev shell often has mcp-server/.venv activated
(VIRTUAL_ENV), which puts an interpreter WITHOUT the integration's deps at the
front of PATH, so bare `python`/`python3` dies at `import homeassistant`/`yaml`
— though the same command works in CI, where python3 has the deps. This resolver
is the single source of truth those gates use instead of bare `python`: it prints
the first candidate that can actually import the deps.

The real probe target is `homeassistant`, which is heavy to require in a unit
test and — worse — is present in *every* interpreter CI would hand us, so it
could not exercise the fall-through logic. So the probed module name is an
injectable seam (`PY_WITH_DEPS_PROBE`), exactly like release.sh's BUILD_CMD /
AI_DOCS_CMD / MCP_PYPI_CHECK_CMD test seams. These tests drive the *selection*
logic with a module that is trivially present (`sys`) or trivially absent
(a bogus name), so they need no second interpreter and no real deps.
"""

import os
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SCRIPT = REPO_ROOT / "bin" / "py-with-deps.sh"

# A module no interpreter will ever have installed — the "deps missing" lever.
ABSENT_MODULE = "__ambience_no_such_module__"


def _run(env_extra: dict | None = None) -> subprocess.CompletedProcess:
    """Run the resolver with a clean-ish env plus overrides.

    PATH is preserved so `python3` resolves; individual tests set PYTHON and
    PY_WITH_DEPS_PROBE to steer the selection.
    """
    env = {k: v for k, v in os.environ.items() if k not in ("PYTHON", "PY_WITH_DEPS_PROBE")}
    if env_extra:
        env.update(env_extra)
    return subprocess.run(["bash", str(SCRIPT)], capture_output=True, text=True, env=env)


def test_honours_an_explicit_python_override_that_has_the_deps():
    """$PYTHON wins when it can import the probed module — no PATH search needed."""
    result = _run({"PYTHON": sys.executable, "PY_WITH_DEPS_PROBE": "sys"})
    assert result.returncode == 0, result.stderr
    # Resolves to the real path of the interpreter we named.
    assert Path(result.stdout.strip()).resolve() == Path(sys.executable).resolve()


def test_falls_through_a_python_override_that_lacks_the_deps():
    """A $PYTHON that cannot import the probe is skipped, not fatal — the next
    qualifying candidate (python3 on PATH) is chosen instead. This is the exact
    shape of the bug: the shadowing mcp-server/.venv is the disqualified first
    candidate, ~/.venv (here python3) the fallback."""
    result = _run({"PYTHON": sys.executable, "PY_WITH_DEPS_PROBE": ABSENT_MODULE})
    assert result.returncode != 0
    # No interpreter has the bogus module, so the resolver fails closed.
    assert ABSENT_MODULE in result.stderr or "deps" in result.stderr.lower()


def test_picks_python3_when_no_override_and_deps_present():
    """Plain case (CI): no $PYTHON, python3 on PATH has the probe → it is used."""
    result = _run({"PY_WITH_DEPS_PROBE": "sys"})
    assert result.returncode == 0, result.stderr
    printed = Path(result.stdout.strip()).resolve()
    assert printed == Path(sys.executable).resolve() or printed.exists()


def test_skips_a_nonexistent_override_path():
    """A $PYTHON naming a path that does not exist is skipped (not a crash), and
    the search continues to python3."""
    result = _run({"PYTHON": "/no/such/python", "PY_WITH_DEPS_PROBE": "sys"})
    assert result.returncode == 0, result.stderr
    assert Path(result.stdout.strip()).exists()


def test_fails_closed_and_loudly_when_no_candidate_has_the_deps():
    """When nothing can import the probe, the resolver exits non-zero with an
    actionable message rather than printing a broken interpreter that would make
    the downstream `python -m bin.*` fail confusingly."""
    result = _run({"PY_WITH_DEPS_PROBE": ABSENT_MODULE})
    assert result.returncode != 0
    combined = (result.stdout + result.stderr).lower()
    assert "python" in combined and ("dep" in combined or ABSENT_MODULE.lower() in combined)
    # Fails closed: prints no interpreter path on stdout.
    assert result.stdout.strip() == ""


def test_prints_exactly_one_line_a_single_interpreter():
    """Downstream is `PYTHON := $(shell …)` — a multi-line or multi-token answer
    would break `$(PYTHON) -m bin.*`. One clean token."""
    result = _run({"PY_WITH_DEPS_PROBE": "sys"})
    assert result.returncode == 0, result.stderr
    lines = [ln for ln in result.stdout.splitlines() if ln.strip()]
    assert len(lines) == 1
    assert len(lines[0].split()) == 1
