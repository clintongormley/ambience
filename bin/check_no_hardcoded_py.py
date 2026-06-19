"""Forbid hardcoded user-facing error messages on the backend.

User-facing errors must be translatable: raised via a translation carrier
(AmbienceError / service_validation_error / LastCategoryError /
CategoryInUseError) whose first arg is the translation_key STRING LITERAL,
never a raw HomeAssistantError/ServiceValidationError with an English message,
and never connection.send_error(..., "English"). _LOGGER and vol.Invalid
(schema layer) are out of scope. A node line carrying `# i18n-ignore` is skipped.

Usage: python -m bin.check_no_hardcoded_py [--component PATH]
Exits non-zero (listing sites) on any violation. Stdlib-only.
"""

from __future__ import annotations

import argparse
import ast
import sys
from pathlib import Path

_CARRIERS = {"AmbienceError", "service_validation_error", "LastCategoryError", "CategoryInUseError"}
_RAW_EXC = {"HomeAssistantError", "ServiceValidationError"}


def _func_name(call: ast.Call) -> str | None:
    f = call.func
    if isinstance(f, ast.Name):
        return f.id
    if isinstance(f, ast.Attribute):
        return f.attr
    return None


def _is_str_const(node: ast.AST) -> bool:
    return isinstance(node, ast.Constant) and isinstance(node.value, str)


def _is_str_literal_or_fstring(node: ast.AST) -> bool:
    # A plain string literal OR an f-string (ast.JoinedStr) — both are hardcoded
    # English prose; an f-string just interpolates runtime values into it.
    return _is_str_const(node) or isinstance(node, ast.JoinedStr)


def violations(source: str, filename: str = "<src>") -> list[str]:
    try:
        tree = ast.parse(source)
    except SyntaxError as e:  # pragma: no cover - defensive
        return [f"{filename}: syntax error: {e}"]
    lines = source.splitlines()

    def ignored(node: ast.AST) -> bool:
        lo = getattr(node, "lineno", None)
        hi = getattr(node, "end_lineno", lo) or lo
        if lo is None:
            return False
        return any("i18n-ignore" in lines[i - 1] for i in range(lo, hi + 1) if 0 < i <= len(lines))

    out: list[str] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            name = _func_name(node)
            if name in _CARRIERS and not ignored(node):
                if not (node.args and _is_str_const(node.args[0])):
                    out.append(
                        f"{filename}:{node.lineno}: {name} translation_key must be a string literal"
                    )
            elif (
                name == "send_error"
                and isinstance(node.func, ast.Attribute)
                and not ignored(node)
                and len(node.args) >= 3
                and _is_str_literal_or_fstring(node.args[2])
            ):
                out.append(
                    f"{filename}:{node.lineno}: hardcoded message in send_error;"
                    " raise a carrier or use send_ambience_error"
                )
        if (
            isinstance(node, ast.Raise)
            and isinstance(node.exc, ast.Call)
            and _func_name(node.exc) in _RAW_EXC
            and not ignored(node)
            and any(_is_str_literal_or_fstring(a) for a in node.exc.args)
        ):
            out.append(
                f"{filename}:{node.lineno}: hardcoded message in {_func_name(node.exc)};"
                " use AmbienceError/service_validation_error"
            )
    return out


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--component", default="custom_components/ambience", type=Path)
    args = parser.parse_args([] if argv is None else argv)
    found: list[str] = []
    for py in sorted(args.component.rglob("*.py")):
        found += violations(py.read_text(), str(py.relative_to(args.component.parent)))
    if found:
        print("hardcoded user-facing error messages (must use a translation carrier):")
        for v in found:
            print(f"  - {v}")
        print("No-hardcoded (py) check FAILED", file=sys.stderr)
        return 1
    print("No-hardcoded (py) check OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
