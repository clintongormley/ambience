"""Validate the frontend's ui.* localize keys against the bundled i18n data.

The panel's custom strings can't live in strings.json (hassfest forbids custom
top-level keys), so they are bundled in frontend/src/i18n-data.ts and every
`localize(hass, "ui.<key>", fallback)` call is expected to have a bundle entry.
A key that exists only as an inline English fallback still renders, so this
drift is invisible at runtime — but the string can never be translated.

Usage: python -m bin.check_ui_strings [--root PATH]
Exits non-zero (listing the keys) when a used ui.* key is missing from the
bundle. Bundle keys that no source file references are reported as warnings
only; a key matching the static head of an interpolated template literal
(e.g. `ui.history_action_${action}`) counts as referenced, so only truly
dynamic keys with no static prefix are out of scope — a bare `ui.` head (no
characters between the dot and `${`) does NOT count as a prefix claim, since
it would match every bundled key and silence this check entirely. Stdlib-only,
so CI needs no dependencies to run it.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from bin._i18n_bundle import parse_locales

# A quoted or backtick ui.* literal with no interpolation, e.g. "ui.close" or
# `ui.sun.elevation`. A template literal with an interpolated `${...}` segment
# is matched separately by _PREFIX_RE, since its full key isn't statically known.
_USED_RE = re.compile(r'["`](ui\.[A-Za-z0-9_.]+)["`]')
# The static head of an interpolated template literal: `ui.history_action_${...}`
# claims every bundled key starting with "ui.history_action_". Requires at
# least one character after "ui." (`+`, not `*`) — a bare `ui.${x}` head would
# otherwise yield the prefix "ui.", which every bundled key starts with,
# silently disabling the unreferenced-key check.
_PREFIX_RE = re.compile(r"`(ui\.[A-Za-z0-9_.]+)\$\{")


def bundle_keys(text: str) -> set[str]:
    """The flattened `ui.*` key set of an i18n-data.ts source text (the `en`
    locale — all shipped locales share the same key set). Reads the bundle via the shared
    recursive-descent parser in `_i18n_bundle` rather than a second brace-walk."""
    locales = parse_locales(text)
    en = locales.get("en") or next(iter(locales.values()), {})
    return {key for key in en if key.startswith("ui.")}


def used_keys(text: str) -> set[str]:
    """Every quoted or backtick ui.* literal (no interpolation) in a TypeScript
    source text."""
    return set(_USED_RE.findall(text))


def used_prefixes(text: str) -> set[str]:
    """The static prefixes of interpolated ui.* template literals."""
    return set(_PREFIX_RE.findall(text))


def compare(
    used: set[str], bundled: set[str], prefixes: set[str] = frozenset()
) -> tuple[set[str], set[str]]:
    """(missing-from-bundle, bundled-but-unreferenced); a bundled key matching a
    template-literal prefix counts as referenced."""
    unused = {k for k in bundled - used if not any(k.startswith(p) for p in prefixes)}
    return used - bundled, unused


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
    prefixes: set[str] = set()
    for ts_file in sorted(src.rglob("*.ts")):
        text = ts_file.read_text()
        used |= used_keys(text)
        prefixes |= used_prefixes(text)
    missing, unused = compare(used, bundled, prefixes=prefixes)
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
