"""Read frontend/src/i18n-data.ts into per-locale flat key->value maps.

Shared by the i18n drift gates (placeholder parity, fallback parity). The panel's
strings can't live in strings.json (hassfest forbids custom top-level keys), so
they're a TypeScript object literal:

    export const AMBIENCE_STRINGS_BY_LOCALE = { en: { ... }, es: { ... } };

This is a tiny recursive-descent reader for that constrained subset — nested
objects, double/single-quoted string leaves, `//` and `/* */` comments, trailing
commas and empty `{}`. Stdlib-only, so CI needs no Node to read the bundle.
"""

from __future__ import annotations

import re

_IDENT = re.compile(r"[A-Za-z0-9_$]+")
# Interpolation token, mirroring i18n.ts's runtime interpolator (/\{(\w+)\}/g):
# `{name}` is a token, a bare `{}` is not.
_TOKEN = re.compile(r"\{(\w+)\}")

# JS string escapes that map to a different char; any other `\X` (e.g. \", \', \\,
# \/) decodes to X itself.
_ESCAPE = {"n": "\n", "t": "\t", "r": "\r", "b": "\b", "f": "\f"}


def decode_string_body(body: str) -> str:
    """Decode the body of a JS string literal (the text between its quotes) into the
    actual string value, so a single-quoted `'Edit \"{name}\"'` and a
    double-quoted `\"Edit \\\"{name}\\\"\"` compare equal. Used for both bundle
    values and inline `localize()` fallbacks."""
    if "\\" not in body:
        return body
    out: list[str] = []
    i = 0
    while i < len(body):
        c = body[i]
        if c == "\\" and i + 1 < len(body):
            nxt = body[i + 1]
            out.append(_ESCAPE.get(nxt, nxt))
            i += 2
        else:
            out.append(c)
            i += 1
    return "".join(out)


class _Reader:
    """A cursor over the bundle text with just enough JS-literal parsing."""

    def __init__(self, text: str, pos: int) -> None:
        self.s = text
        self.i = pos

    def _skip(self) -> None:
        """Advance past whitespace, separating commas and // or /* */ comments."""
        s, n = self.s, len(self.s)
        while self.i < n:
            c = s[self.i]
            if c in " \t\r\n,":
                self.i += 1
            elif s.startswith("//", self.i):
                nl = s.find("\n", self.i)
                self.i = n if nl == -1 else nl + 1
            elif s.startswith("/*", self.i):
                end = s.find("*/", self.i)
                self.i = n if end == -1 else end + 2
            else:
                break

    def _string(self) -> str:
        """Read a quoted string leaf at the cursor (either quote style), returning
        its decoded value. A `\\`-escape never terminates the string."""
        s = self.s
        quote = s[self.i]
        self.i += 1
        start = self.i
        while self.i < len(s):
            c = s[self.i]
            if c == "\\":
                self.i += 2
                continue
            if c == quote:
                body = s[start : self.i]
                self.i += 1
                return decode_string_body(body)
            self.i += 1
        raise ValueError("unterminated string in i18n bundle")

    def _key(self) -> str:
        if self.s[self.i] in "\"'":
            return self._string()
        m = _IDENT.match(self.s, self.i)
        if m is None:
            raise ValueError(f"expected an object key at offset {self.i}")
        self.i = m.end()
        return m.group(0)

    def object(self) -> dict:
        """Parse the object literal at the cursor (which must be on `{`).

        Bundle values are only ever strings or nested objects; any other value
        type (number, boolean, array) raises rather than being silently
        mis-parsed, so a malformed bundle fails the gate loudly instead of
        yielding a wrong verdict."""
        if self.i >= len(self.s) or self.s[self.i] != "{":
            raise ValueError(f"expected '{{' at offset {self.i}")
        self.i += 1
        obj: dict = {}
        while True:
            self._skip()
            if self.i >= len(self.s):
                raise ValueError("unterminated object in i18n bundle")
            if self.s[self.i] == "}":
                self.i += 1
                return obj
            key = self._key()
            self._skip()
            if self.i >= len(self.s) or self.s[self.i] != ":":
                raise ValueError(f"expected ':' after key {key!r} at offset {self.i}")
            self.i += 1
            self._skip()
            if self.i >= len(self.s):
                raise ValueError(f"missing value for key {key!r} in i18n bundle")
            char = self.s[self.i]
            if char == "{":
                obj[key] = self.object()
            elif char in "\"'":
                obj[key] = self._string()
            else:
                raise ValueError(
                    f"unsupported value for key {key!r} at offset {self.i} "
                    "(expected a string or nested object)"
                )


def _flatten(obj: dict, prefix: str = "") -> dict[str, str]:
    flat: dict[str, str] = {}
    for k, v in obj.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            flat.update(_flatten(v, key))
        else:
            flat[key] = v
    return flat


def parse_locales(text: str) -> dict[str, dict[str, str]]:
    """Map each locale (en, es, ...) to its flattened key->value dict.

    Keys are dot-joined to the form `localize()` uses: `ui.close`,
    `day_summary.workday`, `weekday.0`. Empty objects contribute no keys."""
    anchor = text.index("AMBIENCE_STRINGS_BY_LOCALE")
    brace = text.index("{", anchor)
    top = _Reader(text, brace).object()
    return {locale: _flatten(block) for locale, block in top.items()}


def placeholder_tokens(value: str) -> list[str]:
    """The interpolation tokens in a string as a sorted multiset (so two strings
    with the same tokens in any order compare equal), mirroring i18n.ts."""
    return sorted(_TOKEN.findall(value))
