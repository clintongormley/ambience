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
    """The integer assigned to MCP_PROTOCOL in const.py."""
    tree = ast.parse(path.read_text())
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "MCP_PROTOCOL":
                    if not isinstance(node.value, ast.Constant) or not isinstance(
                        node.value.value, int
                    ):
                        _fail(f"MCP_PROTOCOL in {path} is not an integer literal")
                    return int(node.value.value)
    _fail(f"no MCP_PROTOCOL found in {path}")
    raise AssertionError("unreachable")  # _fail always exits


def find_protocols(path: Path) -> set[int]:
    """The keys of the PROTOCOLS dict in protocols/__init__.py."""
    tree = ast.parse(path.read_text())
    for node in ast.walk(tree):
        target = None
        if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
            target = node.target.id
        elif isinstance(node, ast.Assign) and len(node.targets) == 1:
            first = node.targets[0]
            target = first.id if isinstance(first, ast.Name) else None
        if target != "PROTOCOLS" or node.value is None:
            continue
        if not isinstance(node.value, ast.Dict):
            _fail(f"PROTOCOLS in {path} is not a dict literal")
        keys = set()
        for key in node.value.keys:
            if not isinstance(key, ast.Constant) or not isinstance(key.value, int):
                _fail(f"PROTOCOLS in {path} has a non-integer key")
            keys.add(int(key.value))
        return keys
    _fail(f"no PROTOCOLS found in {path}")
    raise AssertionError("unreachable")


def main() -> int:
    protocol = find_mcp_protocol(CONST)
    adapters = find_protocols(REGISTRY)
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
    raise SystemExit(main())
