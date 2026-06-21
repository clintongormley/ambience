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

import argparse
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

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
