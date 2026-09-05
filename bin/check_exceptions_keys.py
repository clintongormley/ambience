"""Validate that every backend exceptions key referenced in code exists in
strings.json's `exceptions` section (and flag unused ones).

User-facing errors are raised via AmbienceError / service_validation_error /
LastCategoryError / CategoryInUseError (translation_key is the first positional
string) and rendered via render_en(key). A key with no `exceptions.<key>` entry
renders as the bare key — untranslatable. Stdlib-only so CI needs no deps.

Usage: python -m bin.check_exceptions_keys [--component PATH]
Exits non-zero (listing keys) when a referenced key is missing from exceptions.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from bin._i18n_carriers import CARRIERS as _CARRIERS

# A carrier call with a string-literal first arg: Carrier("the_key" ...
_USED_RE = re.compile(r"\b(?:" + "|".join(_CARRIERS) + r')\(\s*"([a-z0-9_]+)"')

# A helper that raises on its caller's behalf takes the key as a `key=` literal
# instead of a first positional arg, so its call sites need matching separately.
_KWARG_RE = re.compile(r'\bvalidate_entity_ids\((?:[^()]|\([^()]*\))*?key="([a-z0-9_]+)"')

# The scope-kind table (scopes.py) carries each kind's "scope is gone" key as a
# `not_found_key=` field, and scopes.not_found_error raises on its caller's
# behalf — so the table literal is the reference.
_FIELD_RE = re.compile(r'\bnot_found_key="([a-z0-9_]+)"')


def used_keys(text: str) -> set[str]:
    """Every exceptions key referenced via a carrier call in a .py source text."""
    return set(_USED_RE.findall(text)) | set(_KWARG_RE.findall(text)) | set(_FIELD_RE.findall(text))


def defined_keys(strings: dict) -> set[str]:
    """The keys under strings.json `exceptions`."""
    return set(strings.get("exceptions", {}).keys())


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--component", default="custom_components/ambience", type=Path)
    args = parser.parse_args([] if argv is None else argv)
    strings = json.loads((args.component / "strings.json").read_text())
    defined = defined_keys(strings)
    used: set[str] = set()
    for py in sorted(args.component.rglob("*.py")):
        used |= used_keys(py.read_text())
    missing = used - defined
    unused = defined - used
    if missing:
        print("exceptions keys referenced in code but missing from strings.json:")
        for k in sorted(missing):
            print(f"  - {k}")
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
