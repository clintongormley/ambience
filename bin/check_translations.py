"""Validate translation files stay in sync with strings.json (the HA source of truth).

Usage: python -m bin.check_translations [--component PATH]
Exits non-zero (and prints drift) if any translations/<locale>.json key set
differs from strings.json. Shipped locales (en, es) must match exactly; other
locales may omit keys (untranslated) but must not introduce unknown keys.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

SHIPPED_LOCALES = ("en", "es")


def flatten_keys(obj: dict, prefix: str = "") -> set[str]:
    keys: set[str] = set()
    for key, value in obj.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            keys |= flatten_keys(value, path)
        else:
            keys.add(path)
    return keys


def compare_keys(source: dict, target: dict) -> tuple[set[str], set[str]]:
    src, tgt = flatten_keys(source), flatten_keys(target)
    return src - tgt, tgt - src


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--component",
        default="custom_components/ambience",
        type=Path,
    )
    args = parser.parse_args(argv)
    source = json.loads((args.component / "strings.json").read_text())
    translations = sorted((args.component / "translations").glob("*.json"))
    failed = False
    for path in translations:
        target = json.loads(path.read_text())
        missing, extra = compare_keys(source, target)
        if extra:
            failed = True
            print(f"ERROR {path.name}: unknown keys not in strings.json: {sorted(extra)}")
        # Shipped locales (en, es) are generated/maintained and must be complete.
        if path.stem in SHIPPED_LOCALES and missing:
            failed = True
            print(f"ERROR {path.name}: missing keys present in strings.json: {sorted(missing)}")
        elif missing:
            print(f"INFO  {path.name}: {len(missing)} untranslated key(s)")
    if failed:
        print("Translation check FAILED", file=sys.stderr)
        return 1
    print(f"Translation check OK ({len(translations)} file(s))")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
