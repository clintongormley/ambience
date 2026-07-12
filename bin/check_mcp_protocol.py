# bin/check_mcp_protocol.py
"""Gate 1: what the backend DEMANDS of an MCP client must be installable.

The integration makes two demands over the `ambience/mcp/hello` handshake, and this
gate holds both to the same rule — *never ask a user for something they cannot get*:

1. `MCP_PROTOCOL` must have an adapter in the shipped MCP package. The `ambience-mcp`
   package ships one frozen adapter per protocol it supports (`PROTOCOLS`) and loads
   the one the backend names. If the backend names a protocol with no adapter, every
   user is told to "upgrade ambience-mcp" — to a version that cannot help them,
   because the adapter was never written.

2. `MIN_MCP_VERSION` — a hard refusal floor, checked FIRST in the client's
   `_negotiate`, so it outranks the protocol question entirely — must not name an
   `ambience-mcp` newer than the one this repo ships. `uvx` installs LATEST, so a
   floor above the newest package is a refusal whose only remedy is a version that
   does not exist. It is a one-line edit with no adapter to write and no shape to
   re-record: the easiest of all the levers to pull, and until this check the only
   one with no guardrail.

   Composed with Gate 2 (`bin/release.sh` refuses to release the backend before the
   MCP that speaks its protocol is published), this makes the declared floor always
   installable.

Cross-package, so it imports NEITHER: the backend's venv has no `ambience_mcp`, and
the MCP's has no `homeassistant`. Both Python files are parsed with `ast` and the
package version is read from `pyproject.toml` with `tomllib`.

Stdlib-only, like the other bin/check_* gates — CI's `quality` job installs nothing,
so `packaging` is not available and PEP 440 comparison is vendored below.

Run: `python -m bin.check_mcp_protocol`
"""

from __future__ import annotations

import argparse
import ast
import re
import sys
from pathlib import Path
from typing import NoReturn

ROOT = Path(__file__).resolve().parent.parent
CONST = ROOT / "custom_components" / "ambience" / "const.py"
REGISTRY = ROOT / "mcp-server" / "src" / "ambience_mcp" / "protocols" / "__init__.py"
PYPROJECT = ROOT / "mcp-server" / "pyproject.toml"


def _fail(message: str) -> NoReturn:
    print(f"check_mcp_protocol: {message}", file=sys.stderr)
    raise SystemExit(1)


# --- PEP 440 (a strict subset), vendored ------------------------------------------
# `packaging` is NOT stdlib and this gate runs on a bare interpreter (CI's `quality`
# job pip-installs nothing). A string compare will not do: `MIN_MCP_VERSION` and the
# packaged version normalise differently ("0.2.0-rc.3" vs "0.2.0rc3" are the SAME
# version), and "0.2.0rc10" < "0.2.0rc9" as strings — which would let a floor NEWER
# than the shipped package pass.
_VERSION_RE = re.compile(
    r"""^\s*v?
    (?:(?P<epoch>[0-9]+)!)?
    (?P<release>[0-9]+(?:\.[0-9]+)*)
    (?:[-_.]?(?P<pre_l>alpha|beta|preview|pre|a|b|c|rc)[-_.]?(?P<pre_n>[0-9]+)?)?
    (?:-(?P<post_n1>[0-9]+)|[-_.]?(?P<post_l>post|rev|r)[-_.]?(?P<post_n2>[0-9]+)?)?
    (?:[-_.]?(?P<dev_l>dev)[-_.]?(?P<dev_n>[0-9]+)?)?
    (?:\+(?P<local>[a-z0-9]+(?:[-_.][a-z0-9]+)*))?
    \s*$""",
    re.VERBOSE | re.IGNORECASE,
)

# PEP 440's pre-release spellings all normalise to one of a / b / rc.
_PRE_SPELLINGS = {
    "alpha": "a",
    "a": "a",
    "beta": "b",
    "b": "b",
    "c": "rc",
    "pre": "rc",
    "preview": "rc",
    "rc": "rc",
}


def version_key(raw: object, *, what: str) -> tuple:
    """A sort key for a PEP 440 version string. Fails loudly on anything it cannot
    parse — a gate that cannot read one of the two values it compares must never
    shrug and pass.

    Ordering (PEP 440 §"Summary of permitted suffixes and relative ordering"):
    dev < pre < final < post, with the release segment's trailing zeros stripped so
    `1.0` == `1.0.0`. Pinned to real `packaging.version.Version` by a differential
    test (`tests/test_check_mcp_protocol.py`), because this gate and the MCP runtime
    that enforces the same floor MUST agree: the runtime uses `packaging`, and any
    ordering this vendored subset gets differently is a floor that passes the gate
    and then refuses users.

    A LOCAL segment (`1.2.3+local`) is refused outright rather than ignored. Ignoring
    it is precisely where the two implementations diverge — `packaging` orders
    `1.0.0 < 1.0.0+local`, so a floor of `0.2.0-rc.3+dirty` against a packaged
    `0.2.0-rc.3` would pass a gate that dropped the segment and then make the runtime
    refuse EVERY client. It is also unreleasable: PyPI rejects local versions, so a
    floor carrying one names a build no user can install.
    """
    match = _VERSION_RE.match(raw) if isinstance(raw, str) else None
    if match is None:
        _fail(f"{what} is not a PEP 440 version: {raw!r}")
    if match["local"]:
        _fail(
            f"{what} has a PEP 440 local version segment: {raw!r}.\n"
            f"  A local version (the `+...` suffix) cannot be uploaded to PyPI, so no "
            f"user can ever install it — and the MCP client compares the floor with "
            f"real `packaging` ordering, where {raw!r} is NEWER than the same version "
            f"without the suffix. A floor like this refuses every client.\n"
            f"  Use the plain release version (probably a stale editable/dirty-tree "
            f"build leaking into the value)."
        )

    epoch = int(match["epoch"] or 0)
    release = tuple(int(part) for part in match["release"].split("."))
    while len(release) > 1 and release[-1] == 0:
        release = release[:-1]

    pre_letter = match["pre_l"]
    pre = (_PRE_SPELLINGS[pre_letter.lower()], int(match["pre_n"] or 0)) if pre_letter else None
    has_post = match["post_n1"] is not None or match["post_l"] is not None
    post = int(match["post_n1"] or match["post_n2"] or 0) if has_post else None
    dev = int(match["dev_n"] or 0) if match["dev_l"] else None

    if pre is None and post is None and dev is not None:
        pre_key = (-1, "", 0)  # a bare dev release sorts BEFORE any pre-release
    elif pre is None:
        pre_key = (1, "", 0)  # a final release sorts AFTER every pre-release
    else:
        pre_key = (0, *pre)
    post_key = -1 if post is None else post
    dev_key = (1, 0) if dev is None else (0, dev)  # a dev release sorts first
    return (epoch, release, pre_key, post_key, dev_key)


# --- extraction --------------------------------------------------------------------
def _module_level_assignments(tree: ast.Module, name: str) -> list[ast.Assign | ast.AnnAssign]:
    """Every DIRECT module-level assignment to `name`, in source order.

    Not `ast.walk`, which is breadth-first and so does not reflect execution order
    once nesting (an `if`, a function, a class) is involved. For module-level code,
    source order IS execution order, so "last of the direct module-level statements"
    is the assignment Python actually binds at runtime. A same-named assignment
    nested inside a function or class body is ignored: it is not the module constant.

    Reporting a stale earlier assignment could over-report (e.g. the supported
    protocol set) and let a real mismatch pass silently, which is the one thing a
    gate must never do.
    """
    found: list[ast.Assign | ast.AnnAssign] = []
    for node in tree.body:
        target = None
        if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
            target = node.target.id
        elif isinstance(node, ast.Assign) and len(node.targets) == 1:
            first = node.targets[0]
            target = first.id if isinstance(first, ast.Name) else None
        elif isinstance(node, ast.Assign):
            for candidate in node.targets:
                if isinstance(candidate, ast.Name) and candidate.id == name:
                    target = candidate.id
        if target == name and node.value is not None:
            found.append(node)
    return found


def _last_value(path: Path, name: str) -> ast.expr:
    """The expression bound to `name` by the LAST module-level assignment to it."""
    matches = _module_level_assignments(ast.parse(path.read_text()), name)
    if not matches:
        _fail(f"no {name} found in {path}")
    return matches[-1].value


def find_mcp_protocol(path: Path) -> int:
    """The integer assigned to MCP_PROTOCOL in const.py."""
    value = _last_value(path, "MCP_PROTOCOL")
    if not isinstance(value, ast.Constant) or not isinstance(value.value, int):
        _fail(f"MCP_PROTOCOL in {path} is not an integer literal")
    return int(value.value)


def find_min_mcp_version(path: Path) -> str:
    """The string assigned to MIN_MCP_VERSION in const.py.

    Must be a plain string literal: this value is broadcast to every MCP client as a
    hard refusal floor, and a gate cannot read a floor it has to execute code to
    compute.
    """
    value = _last_value(path, "MIN_MCP_VERSION")
    if not isinstance(value, ast.Constant) or not isinstance(value.value, str):
        _fail(f"MIN_MCP_VERSION in {path} is not a string literal")
    return str(value.value)


def find_package_version(path: Path) -> str:
    """`[project] version` from mcp-server/pyproject.toml — the ambience-mcp this
    repo ships, i.e. the newest one a user could possibly `uvx` once it is released.

    `tomllib` is imported HERE, not at module scope: it is stdlib only from 3.11, and
    `bin/release.sh` extracts MCP_PROTOCOL through this script's `--print-protocol`
    with whatever `python3` is on the releaser's PATH (on macOS that can still be the
    3.9 in /usr/bin). That path never reads the TOML, and must not die trying to
    import a module it does not use.
    """
    import tomllib

    try:
        data = tomllib.loads(path.read_text())
    except tomllib.TOMLDecodeError as exc:
        _fail(f"could not parse {path}: {exc}")
    version = data.get("project", {}).get("version")
    if not isinstance(version, str):
        _fail(f"no [project] version string found in {path}")
    return version


def find_protocols(path: Path) -> set[int]:
    """The keys of the PROTOCOLS dict in protocols/__init__.py."""
    value = _last_value(path, "PROTOCOLS")
    if not isinstance(value, ast.Dict):
        _fail(f"PROTOCOLS in {path} is not a dict literal")
    keys = set()
    for key in value.keys:
        if not isinstance(key, ast.Constant) or not isinstance(key.value, int):
            _fail(f"PROTOCOLS in {path} has a non-integer key")
        keys.add(int(key.value))
    return keys


# --- the gate ----------------------------------------------------------------------
def _check_adapter_exists(protocol: int, adapters: set[int]) -> None:
    if protocol not in adapters:
        _fail(
            f"the integration declares MCP_PROTOCOL={protocol}, but the MCP package "
            f"only ships adapters for {sorted(adapters)}.\n"
            f"  Write mcp-server/src/ambience_mcp/protocols/v{protocol}.py and register "
            f"it in PROTOCOLS, or revert the MCP_PROTOCOL bump.\n"
            f"  Shipping this would tell every user to upgrade ambience-mcp to a "
            f"version that cannot help them."
        )


def _check_floor_is_installable(floor: str, packaged: str) -> None:
    floor_key = version_key(floor, what="MIN_MCP_VERSION")
    packaged_key = version_key(packaged, what="mcp-server/pyproject.toml [project] version")
    if floor_key > packaged_key:
        _fail(
            f"the integration declares MIN_MCP_VERSION={floor!r}, but the ambience-mcp "
            f"in this repo is {packaged!r}.\n"
            f"  MIN_MCP_VERSION is a HARD REFUSAL: every client below it is told, on "
            f"every tool call, to upgrade ambience-mcp. `uvx` installs LATEST, so a "
            f"floor above the newest package is advice no user can follow — the exact "
            f"deadlock the release gate exists to prevent.\n"
            f"  Lower MIN_MCP_VERSION in custom_components/ambience/const.py, or raise "
            f"the version in mcp-server/pyproject.toml and publish that ambience-mcp "
            f"FIRST (tag mcp-v<version>)."
        )


def main(argv: list[str] | None = None) -> int:
    # A bare main() (as called by test_the_real_repo_passes, and by __main__ below
    # when invoked with no flags) must run against the real CONST/REGISTRY, not
    # whatever sys.argv happens to hold under the current interpreter (e.g.
    # pytest's own CLI args) — so an explicit [] default, not argparse's implicit
    # "None means sys.argv[1:]" fallback.
    parser = argparse.ArgumentParser()
    parser.add_argument("--const", default=CONST, type=Path)
    parser.add_argument("--registry", default=REGISTRY, type=Path)
    parser.add_argument("--pyproject", default=PYPROJECT, type=Path)
    parser.add_argument(
        "--print-protocol",
        action="store_true",
        help=(
            "print MCP_PROTOCOL and exit. bin/release.sh's Gate 2 uses this so there "
            "is exactly ONE parser of the constant — two that disagree is a seam."
        ),
    )
    args = parser.parse_args(argv if argv is not None else [])

    protocol = find_mcp_protocol(args.const)
    if args.print_protocol:
        print(protocol)
        return 0

    adapters = find_protocols(args.registry)
    _check_adapter_exists(protocol, adapters)
    floor = find_min_mcp_version(args.const)
    packaged = find_package_version(args.pyproject)
    _check_floor_is_installable(floor, packaged)

    print(
        f"check_mcp_protocol: MCP_PROTOCOL={protocol}, adapters={sorted(adapters)}, "
        f"MIN_MCP_VERSION={floor} <= ambience-mcp {packaged} ✓"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
