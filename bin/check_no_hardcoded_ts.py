"""Forbid hardcoded user-facing strings in the frontend.

All visible text must go through localize(). This heuristic flags:
 (1) static title/aria-label/placeholder/alt attributes with a quoted literal
     (not a ${...} expression);
 (2) text nodes inside html templates: a tag-close `>` (not part of `=>`)
     followed by literal letters.

To keep the signal clean the scanner first strips comments (line + block,
URL-safe) and `css`...`` template bodies — neither carries user-facing prose,
and both are riddled with `>` (JSDoc arrows, comparisons, CSS combinators) that
would otherwise mis-fire. It also skips a `>` preceded by whitespace (a `a > b`
comparison or a `> div` CSS child combinator) and a TS generic close such as
`<Def>` / `<Def extends Foo>` (not an HTML tag).

An ALLOWLIST exempts genuine non-prose (code tokens). A line carrying
`i18n-ignore` is skipped. Stdlib-only.

Usage: python -m bin.check_no_hardcoded_ts [--root PATH]
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# Genuine non-prose literals that are intentionally not translated.
ALLOWLIST: set[str] = {
    "entity_id",  # placeholder: literal entity-id syntax
    "{{ is_state('binary_sensor.guests','on') }}",  # placeholder: example Jinja template
    "lx",  # unit symbol for lux (like °C / %); a code token, not translatable prose
}

_ATTR_RE = re.compile(r'\b(title|aria-label|placeholder|alt)="([^"]*)"')
# A tag-close `>` not preceded by `=`/`!`/`<`/`>` (excludes =>, >=, <=, >>) nor by
# whitespace (excludes `a > b` comparisons and `> div` CSS combinators), then
# optional spaces, then a run starting with a letter, up to < or ${ or newline.
_TEXT_RE = re.compile(r"(?<![=!<>\s])>[ \t]*([A-Za-z][^<>\n$]*)")
# The inner content of a `<...>` run, captured to classify it as a TS generic.
_BRACKET_RE = re.compile(r"<([^<>]*)>$")
# Type-param content: only identifier / type chars (no `=`, `/`, `"` that mark an
# HTML tag with attributes). Comma and `extends` are the type-param-list markers.
_TYPE_CONTENT_RE = re.compile(r"^[\w$.,\[\] ]+(?:extends[\w$.,\[\] ]+)?$")


def _strip_noise(source: str) -> str:
    """Blank out block comments, line comments (URL-safe), and css`` template
    bodies, preserving line numbers so positions still map back to the source."""

    def blank(m: re.Match[str]) -> str:
        return "\n" * m.group(0).count("\n")

    s = re.sub(r"/\*.*?\*/", blank, source, flags=re.S)  # block / JSDoc comments
    s = re.sub(r"(?<![:/])//[^\n]*", "", s)  # // line comments, not URL `://`
    s = re.sub(r"\bcss`.*?`", blank, s, flags=re.S)  # styled-template bodies
    return s


def _is_generic_close(scanned: str, gt_pos: int) -> bool:
    """True if the `>` at gt_pos closes a TS generic (e.g. `<Def>`,
    `<Def extends Foo>`) rather than an HTML tag — judged from the `<...>` run
    ending at this `>` on its line. A lowercase HTML tag (`<div>`) is NOT a
    generic; a PascalCase param, or any `extends`/comma type-param list, is."""
    line_start = scanned.rfind("\n", 0, gt_pos) + 1
    m = _BRACKET_RE.search(scanned[line_start : gt_pos + 1])
    if not m:
        return False
    inner = m.group(1)
    if not _TYPE_CONTENT_RE.fullmatch(inner):
        return False
    # PascalCase param (`<Def>`), or a type-param-list marker (`extends`/comma).
    return inner[:1].isupper() or inner[:1] in "_$" or "extends" in inner or "," in inner


def violations(source: str, filename: str = "<src>") -> list[str]:
    scanned = _strip_noise(source)
    lines = source.splitlines()

    def line_of(pos: int) -> int:
        return scanned.count("\n", 0, pos) + 1

    def ignored(line_no: int) -> bool:
        return 0 < line_no <= len(lines) and "i18n-ignore" in lines[line_no - 1]

    out: list[str] = []
    for m in _ATTR_RE.finditer(scanned):
        val = m.group(2)
        if val.startswith("${") or not re.search(r"[A-Za-z]{2,}", val) or val in ALLOWLIST:
            continue
        ln = line_of(m.start())
        if not ignored(ln):
            out.append(f'{filename}:{ln}: hardcoded attribute {m.group(1)}="{val}"')
    for m in _TEXT_RE.finditer(scanned):
        if _is_generic_close(scanned, m.start()):
            continue
        text = m.group(1).strip()
        if len(re.findall(r"[A-Za-z]", text)) < 2 or text in ALLOWLIST:
            continue
        ln = line_of(m.start())
        if not ignored(ln):
            out.append(f'{filename}:{ln}: hardcoded text node "{text}"')
    return out


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default="frontend/src", type=Path)
    args = parser.parse_args([] if argv is None else argv)
    found: list[str] = []
    for ts in sorted(args.root.rglob("*.ts")):
        found += violations(ts.read_text(), str(ts))
    if found:
        print("hardcoded user-facing strings (wrap in localize() or allowlist if non-prose):")
        for v in found:
            print(f"  - {v}")
        print("No-hardcoded (ts) check FAILED", file=sys.stderr)
        return 1
    print("No-hardcoded (ts) check OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
