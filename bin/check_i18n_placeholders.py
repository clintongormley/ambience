"""Check that the bundled translations agree with `en` on interpolation placeholders.

Each `localize()` string may carry `{name}`-style tokens that i18n.ts fills in at
runtime. If a translation drops, duplicates or renames a token (e.g. en has
`{n} scene(s)` but es has `{m} escena(s)`), the placeholder silently fails to
substitute for that locale. This gate compares, for EVERY non-`en` locale in the
bundle, the placeholder *multiset* of every key against `en` (order doesn't
matter, count does) and also flags any key present in only one of the two. `en`
is the reference, so this doubles as a completeness gate: a shipped locale
missing an `en` key is reported.

Usage: python -m bin.check_i18n_placeholders [--root PATH]
Exits non-zero (listing the offenders) on any mismatch. Stdlib-only.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from bin._i18n_bundle import parse_locales, placeholder_tokens


def find_issues(locales: dict[str, dict[str, str]]) -> list[str]:
    """Human-readable descriptions of bundle drift against `en`: for every non-`en`
    locale, keys present in only one of the two, and keys whose placeholder-token
    multisets differ."""
    en = locales.get("en", {})
    issues: list[str] = []
    for locale in sorted(locales):
        if locale == "en":
            continue
        other = locales[locale]
        for key in sorted(en.keys() - other.keys()):
            issues.append(f"{key}: present in en but missing from {locale}")
        for key in sorted(other.keys() - en.keys()):
            issues.append(f"{key}: present in {locale} but missing from en")
        for key in sorted(en.keys() & other.keys()):
            en_tok = placeholder_tokens(en[key])
            other_tok = placeholder_tokens(other[key])
            if en_tok != other_tok:
                issues.append(
                    f"{key}: en placeholders {en_tok} != {locale} placeholders {other_tok}"
                )
    return issues


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="repo root (default: this script's repo)",
    )
    args = parser.parse_args(argv)
    text = (args.root / "frontend" / "src" / "i18n-data.ts").read_text()
    issues = find_issues(parse_locales(text))
    if issues:
        print("i18n placeholder drift against en:")
        for issue in issues:
            print(f"  - {issue}")
        return 1
    print("i18n placeholder check OK (all locales match en placeholders)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
