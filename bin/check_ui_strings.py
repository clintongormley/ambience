"""Validate the frontend's ui.* localize keys against the bundled i18n data.

The panel's custom strings can't live in strings.json (hassfest forbids custom
top-level keys), so they are bundled in frontend/src/i18n-data.ts and every
`localize(hass, "ui.<key>", fallback)` call is expected to have a bundle entry.
A key that exists only as an inline English fallback still renders, so this
drift is invisible at runtime — but the string can never be translated.

Usage: python -m bin.check_ui_strings [--root PATH]
Exits non-zero (listing the keys) when a used ui.* key is missing from the
bundle. Bundle keys that no source file references are reported as warnings
only. Stdlib-only, so CI needs no dependencies to run it.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from bin._i18n_bundle import parse_locales

# A quoted ui.* literal, e.g. "ui.close" or "ui.sun.elevation". Dynamic keys
# (template literals) are out of scope — the bundle check covers literals only.
_USED_RE = re.compile(r'"(ui\.[A-Za-z0-9_.]+)"')


def bundle_keys(text: str) -> set[str]:
    """The flattened `ui.*` key set of an i18n-data.ts source text (the `en`
    locale — all shipped locales share the same key set). Reads the bundle via the shared
    recursive-descent parser in `_i18n_bundle` rather than a second brace-walk."""
    locales = parse_locales(text)
    en = locales.get("en") or next(iter(locales.values()), {})
    return {key for key in en if key.startswith("ui.")}


def used_keys(text: str) -> set[str]:
    """Every quoted ui.* literal in a TypeScript source text."""
    return set(_USED_RE.findall(text))


def compare(used: set[str], bundled: set[str]) -> tuple[set[str], set[str]]:
    """(missing-from-bundle, bundled-but-unreferenced)."""
    return used - bundled, bundled - used


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="repo root (default: this script's repo)",
    )
    args = parser.parse_args(argv)
    src = args.root / "frontend" / "src"
    bundled = bundle_keys((src / "i18n-data.ts").read_text())
    used: set[str] = set()
    for ts_file in sorted(src.rglob("*.ts")):
        used |= used_keys(ts_file.read_text())
    missing, unused = compare(used, bundled)
    if missing:
        print("ui keys used by localize() but missing from i18n-data.ts:")
        for key in sorted(missing):
            print(f"  - {key}")
    if unused:
        print("warning: bundled ui keys no source file references:")
        for key in sorted(unused):
            print(f"  - {key}")
    if missing:
        return 1
    print(f"UI string check OK ({len(used)} key(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
