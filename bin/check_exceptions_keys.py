"""Validate that every backend exceptions key referenced in code exists in
strings.json's `exceptions` section (and flag unused ones).

User-facing errors are raised via AmbienceError / service_validation_error /
LastCategoryError / CategoryInUseError (translation_key is the first positional
string) and rendered via render_en(key). A key with no `exceptions.<key>` entry
renders as the bare key — untranslatable. A Repairs issue's `translation_key=`
(inside `async_create_issue(...)`) names an `issues.<key>` entry instead and is
checked against that section. Stdlib-only so CI needs no deps.

Usage: python -m bin.check_exceptions_keys [--component PATH]
Exits non-zero (listing keys) when a referenced key is missing from exceptions.
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
# field, HA's own `translation_key=`. One keyword-literal rule covers them all:
# a `key="..."` / `*_key="..."` literal names an exceptions key wherever it
# appears, so a new delegating helper needs no new pattern here.
_KWARG_RE = re.compile(r'\b[a-z0-9_]*key="([a-z0-9_]+)"')


def _split_issue_calls(text: str) -> tuple[str, set[str]]:
    """Blank every `async_create_issue(...)` call out of `text` and return the
    remainder alongside the issue keys those calls named. Repairs issues are the
    one `translation_key=` that does not live under `exceptions`, so the
    keyword rule must not see them."""
    keys: set[str] = set()
    for node in ast.walk(ast.parse(text)):
        if not isinstance(node, ast.Call):
            continue
        func = node.func
        name = func.attr if isinstance(func, ast.Attribute) else getattr(func, "id", None)
        if name != "async_create_issue":
            continue
        segment = ast.get_source_segment(text, node)
        if segment:
            text = text.replace(segment, " " * len(segment), 1)
        for kw in node.keywords:
            if (
                kw.arg == "translation_key"
                and isinstance(kw.value, ast.Constant)
                and isinstance(kw.value.value, str)
            ):
                keys.add(kw.value.value)
    return text, keys


def used_keys(text: str) -> set[str]:
    """Every exceptions key referenced via a carrier call in a .py source text."""
    text, _ = _split_issue_calls(text)
    return set(_USED_RE.findall(text)) | set(_KWARG_RE.findall(text))


def issue_keys(text: str) -> set[str]:
    """Every `issues.*` key a Repairs `async_create_issue` call names."""
    return _split_issue_calls(text)[1]


def defined_keys(strings: dict) -> set[str]:
    """The keys under strings.json `exceptions`."""
    return set(strings.get("exceptions", {}).keys())


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--component", default="custom_components/ambience", type=Path)
    args = parser.parse_args([] if argv is None else argv)
    strings = json.loads((args.component / "strings.json").read_text())
    defined = defined_keys(strings)
    defined_issues = set(strings.get("issues", {}).keys())
    used: set[str] = set()
    issues: set[str] = set()
    for py in sorted(args.component.rglob("*.py")):
        text = py.read_text()
        used |= used_keys(text)
        issues |= issue_keys(text)
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
        missing |= missing_issues
    if unused:
        print("warning: exceptions keys defined but not referenced by any carrier call:")
        for k in sorted(unused):
            print(f"  - {k}")
    if missing:
        print("Exceptions key check FAILED", file=sys.stderr)
        return 1
    print(f"Exceptions key check OK ({len(used)} key(s))")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
