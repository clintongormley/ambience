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
import os
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


def unreleased_body(text: str) -> str:
    _, sections = _split_sections(text)
    for heading, body in sections:
        if _heading_name(heading) == "Unreleased":
            return body
    return ""


def list_items(body: str) -> set[str]:
    return {line.strip() for line in body.splitlines() if line.strip().startswith(("-", "*"))}


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
            out.append(heading)  # "## [Unreleased]\n"
            out.append("\n")  # empty Unreleased body
            out.append(f"## [{version}] - {day}\n")
            # Trailing blank line so a following section heading stays separated
            # (valid Markdown / Keep a Changelog). EOF newline normalised below.
            out.append(f"\n{moved}\n\n" if moved else "\n")
        else:
            out.append(heading)
            out.append(body)
    # Exactly one trailing newline at EOF, regardless of branch.
    return "".join(out).rstrip("\n") + "\n"


def _git_show(ref: str, path: str) -> str | None:
    """Return file contents at a git ref, or None if absent there.

    Scrubs GIT_* from the environment so the lookup resolves against the current
    working directory's repo, not an inherited GIT_DIR/GIT_WORK_TREE — which a
    git hook (e.g. pre-push running pytest) sets to a different repo.
    """
    env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}
    result = subprocess.run(
        ["git", "show", f"{ref}:{path}"], capture_output=True, text=True, env=env
    )
    return result.stdout if result.returncode == 0 else None


def _cmd_check(args: argparse.Namespace) -> int:
    if not entry_required(args.title):
        print(f"changelog: '{commit_type(args.title)}' PR is exempt; no entry required.")
        return 0
    head_text = _git_show(args.head, args.path) or ""
    base_text = _git_show(args.base, args.path)
    if gate_ok(base_text, head_text):
        print("changelog: found a new entry under [Unreleased].")
        return 0
    print(
        "changelog: a user-facing PR must add an entry under '## [Unreleased]' in "
        f"{args.path}. Add one, or retitle the PR with a non-user-facing type "
        f"({', '.join(sorted(EXEMPT_TYPES))}).",
        file=sys.stderr,
    )
    return 1


def _cmd_promote(args: argparse.Namespace) -> int:
    path = Path(args.path)
    day = args.date or date.today().isoformat()
    try:
        new_text = promote_text(path.read_text(), args.version, day)
    except ValueError as exc:
        print(f"changelog: {exc}", file=sys.stderr)
        return 1
    path.write_text(new_text)
    print(f"changelog: promoted [Unreleased] -> [{args.version}] - {day}")
    return 0


def _cmd_extract(args: argparse.Namespace) -> int:
    body = extract_text(Path(args.path).read_text(), args.version)
    if body is None:
        print(f"changelog: no [{args.version}] section in {args.path}", file=sys.stderr)
        return 1
    if body:
        print(body)
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="changelog")
    parser.add_argument("--path", default="CHANGELOG.md")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_check = sub.add_parser("check")
    p_check.add_argument("--title", required=True)
    p_check.add_argument("--base", required=True)
    p_check.add_argument("--head", required=True)

    p_promote = sub.add_parser("promote")
    p_promote.add_argument("version")
    p_promote.add_argument("--date", default=None)

    p_extract = sub.add_parser("extract")
    p_extract.add_argument("version")

    args = parser.parse_args(argv)
    return {"check": _cmd_check, "promote": _cmd_promote, "extract": _cmd_extract}[args.cmd](args)


if __name__ == "__main__":
    sys.exit(main())
