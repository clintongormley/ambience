# bin/check_mcp_protocol.py
"""Gate 1: MCP_PROTOCOL must have an adapter in the shipped MCP package.

The integration declares one protocol integer (`MCP_PROTOCOL`); the `ambience-mcp`
package ships one frozen adapter per protocol it supports (`PROTOCOLS`). If the
backend names a protocol with no adapter, every user is told to "upgrade
ambience-mcp" — to a version that cannot help them, because the adapter was never
written.

Cross-package, so it imports NEITHER: the backend's venv has no `ambience_mcp`, and
the MCP's has no `homeassistant`. Both files are parsed with `ast`.

Stdlib-only, like the other bin/check_* gates. Run: `python -m bin.check_mcp_protocol`
"""

from __future__ import annotations

import argparse
import ast
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONST = ROOT / "custom_components" / "ambience" / "const.py"
REGISTRY = ROOT / "mcp-server" / "src" / "ambience_mcp" / "protocols" / "__init__.py"


def _fail(message: str) -> None:
    print(f"check_mcp_protocol: {message}", file=sys.stderr)
    raise SystemExit(1)


def find_mcp_protocol(path: Path) -> int:
    """The integer assigned to MCP_PROTOCOL in const.py.

    Only DIRECT module-level statements (`tree.body`) are considered, in source
    order — not `ast.walk`, which is breadth-first and so does not reflect
    execution order once nesting (an `if`, a function, a class) is involved. For
    module-level code, source order IS execution order, so "last of the direct
    module-level statements" is the assignment Python actually binds at runtime.
    A same-named assignment nested inside a function or class body is ignored:
    it is not the module constant.
    """
    tree = ast.parse(path.read_text())
    matches = []
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "MCP_PROTOCOL":
                    matches.append(node)
    if not matches:
        _fail(f"no MCP_PROTOCOL found in {path}")
    last = matches[-1]
    if not isinstance(last.value, ast.Constant) or not isinstance(last.value.value, int):
        _fail(f"MCP_PROTOCOL in {path} is not an integer literal")
    return int(last.value.value)


def find_protocols(path: Path) -> set[int]:
    """The keys of the PROTOCOLS dict in protocols/__init__.py.

    Only DIRECT module-level statements (`tree.body`) are considered, in source
    order — see find_mcp_protocol for why that (and not `ast.walk`) is required
    for "last assignment wins" to actually match what Python binds at runtime.
    Reporting a stale earlier assignment could over-report the supported set and
    let a real mismatch pass silently, which is the one thing a gate must never do.
    """
    tree = ast.parse(path.read_text())
    matches = []
    for node in tree.body:
        target = None
        if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
            target = node.target.id
        elif isinstance(node, ast.Assign) and len(node.targets) == 1:
            first = node.targets[0]
            target = first.id if isinstance(first, ast.Name) else None
        if target == "PROTOCOLS" and node.value is not None:
            matches.append(node)
    if not matches:
        _fail(f"no PROTOCOLS found in {path}")
    last = matches[-1]
    if not isinstance(last.value, ast.Dict):
        _fail(f"PROTOCOLS in {path} is not a dict literal")
    keys = set()
    for key in last.value.keys:
        if not isinstance(key, ast.Constant) or not isinstance(key.value, int):
            _fail(f"PROTOCOLS in {path} has a non-integer key")
        keys.add(int(key.value))
    return keys


def main(argv: list[str] | None = None) -> int:
    # A bare main() (as called by test_the_real_repo_passes, and by __main__ below
    # when invoked with no flags) must run against the real CONST/REGISTRY, not
    # whatever sys.argv happens to hold under the current interpreter (e.g.
    # pytest's own CLI args) — so an explicit [] default, not argparse's implicit
    # "None means sys.argv[1:]" fallback.
    parser = argparse.ArgumentParser()
    parser.add_argument("--const", default=CONST, type=Path)
    parser.add_argument("--registry", default=REGISTRY, type=Path)
    args = parser.parse_args(argv if argv is not None else [])
    protocol = find_mcp_protocol(args.const)
    adapters = find_protocols(args.registry)
    if protocol not in adapters:
        _fail(
            f"the integration declares MCP_PROTOCOL={protocol}, but the MCP package "
            f"only ships adapters for {sorted(adapters)}.\n"
            f"  Write mcp-server/src/ambience_mcp/protocols/v{protocol}.py and register "
            f"it in PROTOCOLS, or revert the MCP_PROTOCOL bump.\n"
            f"  Shipping this would tell every user to upgrade ambience-mcp to a "
            f"version that cannot help them."
        )
    print(f"check_mcp_protocol: MCP_PROTOCOL={protocol}, adapters={sorted(adapters)} ✓")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
