# bin/changelog.py
"""Maintain CHANGELOG.md: gate PRs, promote [Unreleased] at release, extract a version's notes.

Stdlib-only (runs in dependency-free CI jobs). Runnable two ways:
  python -m bin.changelog ...        # CI gate, cwd = repo root
  python3 path/to/bin/changelog.py   # invoked by bin/release.sh

Usage:
  python -m bin.changelog check --title "<pr title>" --base <ref> --head <ref>
  python -m bin.changelog promote <version> [--date YYYY-MM-DD]
  python -m bin.changelog extract <version>
"""

from __future__ import annotations

import re

EXEMPT_TYPES = frozenset({"chore", "ci", "test", "build", "refactor", "docs", "style"})

_TYPE_RE = re.compile(r"^(?P<type>[a-z]+)(?:\([^)]*\))?!?:", re.IGNORECASE)
_HEADING_RE = re.compile(r"^##\s+\[([^\]]+)\]")


def _split_sections(text: str) -> tuple[str, list[tuple[str, str]]]:
    """Split into (preamble, [(heading_line, body), …]).

    A section starts at a '## ' line and runs until the next '## ' line. Lines
    before the first '## ' are the preamble. Other heading levels (# / ###) are
    body, not boundaries.
    """
    preamble: list[str] = []
    sections: list[list[str]] = []  # [heading_line, [body lines]]
    current: list | None = None
    for line in text.splitlines(keepends=True):
        if line.startswith("## "):
            current = [line, []]
            sections.append(current)
        elif current is None:
            preamble.append(line)
        else:
            current[1].append(line)
    return "".join(preamble), [(h, "".join(b)) for h, b in sections]


def _heading_name(heading: str) -> str | None:
    m = _HEADING_RE.match(heading)
    return m.group(1) if m else None


def commit_type(title: str) -> str | None:
    m = _TYPE_RE.match(title.strip())
    return m.group("type").lower() if m else None


def entry_required(title: str) -> bool:
    """A changelog entry is required unless the title's type is exempt.

    Unrecognised titles (no conventional-commit type) require an entry — fail-safe,
    and it surfaces malformed titles.
    """
    return commit_type(title) not in EXEMPT_TYPES


def unreleased_body(text: str) -> str:
    _, sections = _split_sections(text)
    for heading, body in sections:
        if _heading_name(heading) == "Unreleased":
            return body
    return ""


def list_items(body: str) -> set[str]:
    return {
        line.strip()
        for line in body.splitlines()
        if line.strip().startswith(("-", "*"))
    }


def gate_ok(base_text: str | None, head_text: str) -> bool:
    """True when head's [Unreleased] has at least one list item base's lacks."""
    base_items = list_items(unreleased_body(base_text)) if base_text is not None else set()
    head_items = list_items(unreleased_body(head_text))
    return bool(head_items - base_items)


def extract_text(text: str, version: str) -> str | None:
    _, sections = _split_sections(text)
    for heading, body in sections:
        if _heading_name(heading) == version:
            return body.strip()
    return None


def promote_text(text: str, version: str, day: str) -> str:
    """Move [Unreleased]'s body into a new '## [version] - day' section below it,
    leaving [Unreleased] empty. Raises ValueError on a duplicate version section
    or a missing [Unreleased] section."""
    preamble, sections = _split_sections(text)
    names = [_heading_name(h) for h, _ in sections]
    if version in names:
        raise ValueError(f"CHANGELOG.md already has a [{version}] section")
    if "Unreleased" not in names:
        raise ValueError("CHANGELOG.md has no [Unreleased] section")

    out = [preamble]
    for heading, body in sections:
        if _heading_name(heading) == "Unreleased":
            moved = body.strip("\n")
            out.append(heading)                       # "## [Unreleased]\n"
            out.append("\n")                          # empty Unreleased body
            out.append(f"## [{version}] - {day}\n")
            # Trailing blank line so a following section heading stays separated
            # (valid Markdown / Keep a Changelog). EOF newline normalised below.
            out.append(f"\n{moved}\n\n" if moved else "\n")
        else:
            out.append(heading)
            out.append(body)
    # Exactly one trailing newline at EOF, regardless of branch.
    return "".join(out).rstrip("\n") + "\n"
