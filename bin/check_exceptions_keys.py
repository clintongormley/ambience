"""Validate that every backend exceptions key referenced in code exists in
strings.json's `exceptions` section (and flag unused ones).

User-facing errors are raised via AmbienceError / service_validation_error /
LastCategoryError / CategoryInUseError (translation_key is the first positional
string) and rendered via render_en(key). A key with no `exceptions.<key>` entry
renders as the bare key — untranslatable. A Repairs issue's `translation_key=`
(inside `async_create_issue(...)`) names an `issues.<key>` entry instead and is
checked against that section. Stdlib-only so CI needs no deps.

Usage: python -m bin.check_exceptions_keys [--component PATH]
Exits non-zero (listing keys) when a referenced key is missing from its section.
"""

from __future__ import annotations

import argparse
import ast
import json
import re
import sys
from pathlib import Path

from bin._i18n_carriers import CARRIERS as _CARRIERS

# A carrier call with a string-literal first arg: Carrier("the_key" ...
_USED_RE = re.compile(r"\b(?:" + "|".join(_CARRIERS) + r')\(\s*"([a-z0-9_]+)"')

# A key handed to something that raises on the caller's behalf — the
# `key=` argument of validate_entity_ids, the scope table's `not_found_key=`
# field, HA's own `translation_key=`. One keyword-name rule covers them all, so
# a new delegating helper needs no new pattern here: a `key=` / `*_key=` string
# literal names an exceptions key, with the single exception of a Repairs call's
# `translation_key=`, which names an `issues.<key>` entry and is checked against
# that section instead.
_KWARG_NAME_RE = re.compile(r"[a-z0-9_]*key")

# The Repairs helper whose `translation_key=` is an issues key, not an exceptions one.
_ISSUE_FUNC = "async_create_issue"


def _call_name(node: ast.Call) -> str | None:
    """The called function's bare name: `ir.async_create_issue` -> `async_create_issue`."""
    func = node.func
    return func.attr if isinstance(func, ast.Attribute) else getattr(func, "id", None)


def scan(text: str) -> tuple[set[str], set[str]]:
    """The (exceptions keys, Repairs issue keys) a .py source text references.

    A `key=` / `*_key=` string literal on any call names an exceptions key,
    except on `async_create_issue(...)`, where `translation_key=` names an
    issues key; both sets come from the parsed tree, so a call nested inside a
    Repairs call is still read and a comment that repeats a call is not. Only
    LITERAL keys are visible — one passed via a constant or variable is not
    reported, and so is not checked against strings.json.
    """
    exceptions: set[str] = set(_USED_RE.findall(text))
    issues: set[str] = set()
    for node in ast.walk(ast.parse(text)):
        if not isinstance(node, ast.Call):
            continue
        is_issue_call = _call_name(node) == _ISSUE_FUNC
        for kw in node.keywords:
            if kw.arg is None or not _KWARG_NAME_RE.fullmatch(kw.arg):
                continue
            if not (isinstance(kw.value, ast.Constant) and isinstance(kw.value.value, str)):
                continue
            target = issues if is_issue_call and kw.arg == "translation_key" else exceptions
            target.add(kw.value.value)
    return exceptions, issues


def used_keys(text: str) -> set[str]:
    """Every exceptions key referenced via a carrier call in a .py source text."""
    return scan(text)[0]


def issue_keys(text: str) -> set[str]:
    """Every `issues.*` key a Repairs `async_create_issue` call names."""
    return scan(text)[1]


def defined_keys(strings: dict, section: str = "exceptions") -> set[str]:
    """The keys under a strings.json section — `exceptions` unless asked otherwise."""
    return set(strings.get(section, {}).keys())


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--component", default="custom_components/ambience", type=Path)
    args = parser.parse_args([] if argv is None else argv)
    strings = json.loads((args.component / "strings.json").read_text())
    defined = defined_keys(strings)
    defined_issues = defined_keys(strings, "issues")
    used: set[str] = set()
    issues: set[str] = set()
    for py in sorted(args.component.rglob("*.py")):
        py_used, py_issues = scan(py.read_text())
        used |= py_used
        issues |= py_issues
    missing = used - defined
    missing_issues = issues - defined_issues
    unused = defined - used
    if missing:
        print("exceptions keys referenced in code but missing from strings.json:")
        for k in sorted(missing):
            print(f"  - {k}")
    if missing_issues:
        print("issue keys referenced in code but missing from strings.json `issues`:")
        for k in sorted(missing_issues):
            print(f"  - {k}")
    if unused:
        print("warning: exceptions keys defined but not referenced by any carrier call:")
        for k in sorted(unused):
            print(f"  - {k}")
    if missing or missing_issues:
        print("Exceptions/issues key check FAILED", file=sys.stderr)
        return 1
    # Both counts, because the gate covers both sections: a bare total would not
    # say which one a number came from.
    print(
        f"Exceptions/issues key check OK "
        f"({len(used)} exceptions key(s), {len(issues)} issue key(s))"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
