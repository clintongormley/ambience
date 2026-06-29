"""Check that each inline localize() English fallback matches the bundled value.

Every `localize(hass, "ui.key", "fallback")` carries an inline English fallback
that renders when the bundle lookup misses (older HA, a missing key). If that
fallback drifts from the `en` value in i18n-data.ts, the two disagree on what the
"same" string says — invisible at runtime until the fallback path is hit. This
gate compares every literal localize() fallback to its `en` bundle value (for
keys the bundle defines; inline-only keys are out of scope).

Dynamic calls (a variable key or fallback, e.g. from a lookup table) are skipped
— only literal key+fallback pairs are checked. Both quote styles and escapes are
handled, so `'Edit "{name}"'` and the bundle's single-quoted value compare equal.

Usage: python -m bin.check_i18n_fallbacks [--root PATH]
Exits non-zero (listing the offenders) on any mismatch. Stdlib-only.
"""

from __future__ import annotations

import argparse
import re
import sys
from collections.abc import Iterator
from pathlib import Path

from bin._i18n_bundle import decode_string_body, parse_locales

# localize(<hass>, "<key>", "<fallback>", ...) with either quote style for the
# two string literals, tolerant of newlines between arguments. A non-literal
# (variable) key or fallback simply doesn't match, so dynamic calls are skipped.
# The string body is `\\.` (an escape) OR a char that is neither the delimiter
# quote nor a backslash — the two alternatives are disjoint, which keeps matching
# linear (no catastrophic backtracking).
_LOCALIZE_RE = re.compile(
    r"localize\(\s*[^,]+?,\s*"
    r"([\"'])((?:\\.|(?!\1)[^\\])*)\1"  # key:      group 1 quote, group 2 body
    r"\s*,\s*"
    r"([\"'])((?:\\.|(?!\3)[^\\])*)\3",  # fallback: group 3 quote, group 4 body
    re.DOTALL,
)


def localize_calls(text: str) -> Iterator[tuple[str, str]]:
    """Yield (key, decoded_fallback) for every localize() call with a literal key
    and a literal fallback in a TypeScript source text."""
    for m in _LOCALIZE_RE.finditer(text):
        yield decode_string_body(m.group(2)), decode_string_body(m.group(4))


def find_mismatches(en: dict[str, str], files: dict[str, str]) -> list[str]:
    """Descriptions of every inline localize() fallback that disagrees with its
    `en` bundle value. Keys absent from the bundle are skipped (inline-only)."""
    out: list[str] = []
    for name in sorted(files):
        for key, fallback in localize_calls(files[name]):
            if key in en and fallback != en[key]:
                out.append(f"{name}: localize({key!r}) fallback {fallback!r} != bundle {en[key]!r}")
    return out


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
    en = parse_locales((src / "i18n-data.ts").read_text())["en"]
    files = {
        str(p.relative_to(src)): p.read_text()
        for p in sorted(src.rglob("*.ts"))
        if p.name != "i18n-data.ts"
    }
    mismatches = find_mismatches(en, files)
    if mismatches:
        print("inline localize() fallbacks that drifted from the en bundle:")
        for line in mismatches:
            print(f"  - {line}")
        return 1
    print("i18n fallback check OK (inline fallbacks match the bundle)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
