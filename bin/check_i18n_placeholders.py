"""Check that the bundled en/es strings agree on interpolation placeholders.

Each `localize()` string may carry `{name}`-style tokens that i18n.ts fills in at
runtime. If a translation drops, duplicates or renames a token (e.g. en has
`{n} scene(s)` but es has `{m} escena(s)`), the placeholder silently fails to
substitute for that locale. This gate compares the placeholder *multiset* of
every key across en and es (order doesn't matter, count does) and also flags any
key present in only one locale.

Usage: python -m bin.check_i18n_placeholders [--root PATH]
Exits non-zero (listing the offenders) on any mismatch. Stdlib-only.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from bin._i18n_bundle import parse_locales, placeholder_tokens


def find_issues(locales: dict[str, dict[str, str]]) -> list[str]:
    """Human-readable descriptions of en/es bundle drift: keys present in only one
    locale, and keys whose placeholder-token multisets differ."""
    en = locales.get("en", {})
    es = locales.get("es", {})
    issues: list[str] = []
    for key in sorted(en.keys() - es.keys()):
        issues.append(f"{key}: present in en but missing from es")
    for key in sorted(es.keys() - en.keys()):
        issues.append(f"{key}: present in es but missing from en")
    for key in sorted(en.keys() & es.keys()):
        en_tok = placeholder_tokens(en[key])
        es_tok = placeholder_tokens(es[key])
        if en_tok != es_tok:
            issues.append(f"{key}: en placeholders {en_tok} != es placeholders {es_tok}")
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
        print("i18n placeholder drift between en and es:")
        for issue in issues:
            print(f"  - {issue}")
        return 1
    print("i18n placeholder check OK (en/es placeholders match)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
