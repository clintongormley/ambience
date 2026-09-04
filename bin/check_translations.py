"""Validate translation files stay in sync with strings.json (the HA source of truth).

Usage: python -m bin.check_translations [--component PATH]
Exits non-zero (and prints drift) if any translations/<locale>.json key set
differs from strings.json, or if a translated string's `{token}` interpolation
placeholders don't match strings.json. Shipped locales (en, es, pt, fr) must
match keys exactly; other locales may omit keys (untranslated) but must not
introduce unknown keys. Placeholder integrity is checked for every *shared* key
of every locale — a renamed/dropped token breaks (or crashes) substitution at
runtime whether or not the locale is shipped.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from bin._i18n_bundle import flatten_items, placeholder_tokens

SHIPPED_LOCALES = ("en", "es", "pt", "fr")


def flatten_keys(obj: dict, prefix: str = "") -> set[str]:
    return set(flatten_items(obj, prefix))


def compare_keys(source: dict, target: dict) -> tuple[set[str], set[str]]:
    src, tgt = flatten_keys(source), flatten_keys(target)
    return src - tgt, tgt - src


def placeholder_mismatches(source_items: dict[str, str], target_items: dict[str, str]) -> list[str]:
    """For keys shared by source (strings.json) and target, the `{token}` placeholder
    multisets that differ — the tokens HA substitutes at runtime. Order doesn't
    matter, count does. Both args are already flattened (dot-joined key -> value) so
    the caller can flatten the source once. Keys present in only one side are the
    key check's concern, not this one, so they're skipped here."""
    issues: list[str] = []
    for key in sorted(source_items.keys() & target_items.keys()):
        src_tok, tgt_tok = (
            placeholder_tokens(source_items[key]),
            placeholder_tokens(target_items[key]),
        )
        if src_tok != tgt_tok:
            issues.append(f"{key}: strings.json placeholders {src_tok} != {tgt_tok}")
    return issues


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--component",
        default="custom_components/ambience",
        type=Path,
    )
    args = parser.parse_args(argv)
    source = json.loads((args.component / "strings.json").read_text())
    source_items = flatten_items(source)  # flattened once, reused for every locale
    src_keys = set(source_items)
    translations = sorted((args.component / "translations").glob("*.json"))
    failed = False
    for path in translations:
        target_items = flatten_items(json.loads(path.read_text()))
        tgt_keys = set(target_items)
        missing, extra = src_keys - tgt_keys, tgt_keys - src_keys
        if extra:
            failed = True
            print(f"ERROR {path.name}: unknown keys not in strings.json: {sorted(extra)}")
        # Shipped locales (en, es) are generated/maintained and must be complete.
        if path.stem in SHIPPED_LOCALES and missing:
            failed = True
            print(f"ERROR {path.name}: missing keys present in strings.json: {sorted(missing)}")
        elif missing:
            print(f"INFO  {path.name}: {len(missing)} untranslated key(s)")
        # Placeholder integrity: checked for every locale's shared keys, since a
        # broken {token} crashes substitution at runtime regardless of shipping.
        for issue in placeholder_mismatches(source_items, target_items):
            failed = True
            print(f"ERROR {path.name}: {issue}")
    if failed:
        print("Translation check FAILED", file=sys.stderr)
        return 1
    print(f"Translation check OK ({len(translations)} file(s))")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
