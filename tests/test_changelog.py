import os
import subprocess

import pytest

from bin.changelog import (
    EXEMPT_TYPES,
    _heading_name,
    _split_sections,
    commit_type,
    entry_required,
    extract_text,
    gate_ok,
    list_items,
    main,
    promote_text,
    unreleased_body,
)


def test_split_sections_separates_preamble_and_sections():
    text = "# Changelog\n\n## [Unreleased]\n\n- A.\n\n## [0.1.0] - 2026-01-01\n\n- B.\n"
    preamble, sections = _split_sections(text)
    assert preamble == "# Changelog\n\n"
    assert [h.strip() for h, _ in sections] == ["## [Unreleased]", "## [0.1.0] - 2026-01-01"]
    assert sections[0][1] == "\n- A.\n\n"
    assert sections[1][1] == "\n- B.\n"


def test_split_sections_ignores_other_heading_levels():
    # '# Changelog' (h1) and '### Fixed' (h3) are NOT section boundaries.
    text = "# Changelog\n\n## [Unreleased]\n\n### Fixed\n\n- A.\n"
    _, sections = _split_sections(text)
    assert len(sections) == 1
    assert sections[0][1] == "\n### Fixed\n\n- A.\n"


def test_heading_name_extracts_bracketed_name():
    assert _heading_name("## [Unreleased]\n") == "Unreleased"
    assert _heading_name("## [0.24.0] - 2026-06-21\n") == "0.24.0"
    assert _heading_name("## Notes\n") is None


def test_commit_type_parses_conventional_titles():
    assert commit_type("feat: add x") == "feat"
    assert commit_type("fix(sensor): y") == "fix"
    assert commit_type("feat!: breaking") == "feat"
    assert commit_type("CHORE: shout") == "chore"  # case-insensitive
    assert commit_type("no type here") is None


def test_entry_required_by_type():
    assert entry_required("feat: x") is True
    assert entry_required("fix(sensor): x") is True
    assert entry_required("perf: x") is True
    assert entry_required("chore: x") is False
    assert entry_required("ci: x") is False
    assert entry_required("docs: x") is False
    assert entry_required("garbage title") is True  # unrecognised → fail-safe


def test_exempt_types_membership():
    assert "chore" in EXEMPT_TYPES
    assert "feat" not in EXEMPT_TYPES


def test_unreleased_body_returns_section_only():
    text = "# Changelog\n\n## [Unreleased]\n\n- A.\n\n## [0.1.0] - 2026-01-01\n\n- B.\n"
    assert unreleased_body(text).strip() == "- A."
    assert "B." not in unreleased_body(text)


def test_unreleased_body_empty_when_absent():
    assert unreleased_body("# Changelog\n\n## [0.1.0] - 2026-01-01\n\n- B.\n") == ""


def test_list_items_collects_bullets_only():
    body = "### Fixed\n\n- one\n* two\n\nnot a bullet\n"
    assert list_items(body) == {"- one", "* two"}


def test_gate_ok_true_when_new_unreleased_bullet_added():
    base = "# Changelog\n\n## [Unreleased]\n"
    head = "# Changelog\n\n## [Unreleased]\n\n- New thing.\n"
    assert gate_ok(base, head) is True


def test_gate_ok_true_when_base_has_no_file():
    head = "# Changelog\n\n## [Unreleased]\n\n- First entry.\n"
    assert gate_ok(None, head) is True


def test_gate_ok_false_when_no_new_bullet():
    base = "# Changelog\n\n## [Unreleased]\n\n- Existing.\n"
    head = "# Changelog\n\n## [Unreleased]\n\n- Existing.\n"
    assert gate_ok(base, head) is False


def test_gate_ok_false_when_bullet_only_in_released_section():
    base = "# Changelog\n\n## [Unreleased]\n\n## [0.1.0] - 2026-01-01\n\n- Old.\n"
    head = "# Changelog\n\n## [Unreleased]\n\n## [0.1.0] - 2026-01-01\n\n- Old.\n- Edited.\n"
    assert gate_ok(base, head) is False


def test_promote_moves_unreleased_into_dated_section():
    text = "# Changelog\n\n## [Unreleased]\n\n### Fixed\n\n- A fix.\n"
    out = promote_text(text, "0.24.0", "2026-06-21")
    assert "## [0.24.0] - 2026-06-21" in out
    assert extract_text(out, "0.24.0") == "### Fixed\n\n- A fix."
    assert unreleased_body(out).strip() == ""  # Unreleased emptied


def test_promote_empty_unreleased_creates_empty_dated_section():
    text = "# Changelog\n\n## [Unreleased]\n"
    out = promote_text(text, "0.24.0", "2026-06-21")
    assert "## [0.24.0] - 2026-06-21" in out
    assert extract_text(out, "0.24.0") == ""  # present but empty


def test_promote_rejects_existing_version_section():
    text = "# Changelog\n\n## [Unreleased]\n\n- x\n\n## [0.24.0] - 2026-06-20\n\n- old\n"
    with pytest.raises(ValueError, match="0.24.0"):
        promote_text(text, "0.24.0", "2026-06-21")


def test_promote_requires_unreleased_section():
    text = "# Changelog\n\n## [0.1.0] - 2026-01-01\n\n- x\n"
    with pytest.raises(ValueError, match="Unreleased"):
        promote_text(text, "0.2.0", "2026-06-21")


def test_extract_returns_none_for_missing_section():
    assert extract_text("# Changelog\n\n## [Unreleased]\n", "9.9.9") is None


def test_promote_preserves_trailing_released_section_with_blank_line():
    text = (
        "# Changelog\n\n## [Unreleased]\n\n### Fixed\n\n- A new fix.\n\n"
        "## [0.23.0] - 2026-06-21\n\n### Added\n\n- Old feature.\n"
    )
    out = promote_text(text, "0.24.0", "2026-06-21")
    # A blank line must separate the promoted section's content from the next heading.
    assert "- A new fix.\n\n## [0.23.0]" in out
    assert "- A new fix.\n## [0.23.0]" not in out
    assert extract_text(out, "0.24.0") == "### Fixed\n\n- A new fix."
    assert extract_text(out, "0.23.0") == "### Added\n\n- Old feature."
    assert "\n\n\n" not in out  # no triple-blank anywhere


def _git(*args, cwd):
    env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}
    return subprocess.run(
        ["git", *args], cwd=cwd, env=env, check=True, capture_output=True, text=True
    )


def _git_repo(tmp_path):
    _git("init", "-q", "-b", "main", cwd=tmp_path)
    _git("config", "user.email", "t@test", cwd=tmp_path)
    _git("config", "user.name", "t", cwd=tmp_path)
    return tmp_path


def _commit_changelog(repo, content, msg):
    (repo / "CHANGELOG.md").write_text(content)
    _git("add", "CHANGELOG.md", cwd=repo)
    _git("commit", "--allow-empty", "-qm", msg, cwd=repo)
    return _git("rev-parse", "HEAD", cwd=repo).stdout.strip()


# --- promote / extract via main() on a tmp file ---


def test_main_promote_then_extract(tmp_path, monkeypatch, capsys):
    cl = tmp_path / "CHANGELOG.md"
    cl.write_text("# Changelog\n\n## [Unreleased]\n\n- A change.\n")
    monkeypatch.chdir(tmp_path)
    assert main(["promote", "0.3.0", "--date", "2026-06-21"]) == 0
    assert "## [0.3.0] - 2026-06-21" in cl.read_text()
    capsys.readouterr()
    assert main(["extract", "0.3.0"]) == 0
    assert capsys.readouterr().out.strip() == "- A change."


def test_main_extract_missing_section_exits_1(tmp_path, monkeypatch):
    (tmp_path / "CHANGELOG.md").write_text("# Changelog\n\n## [Unreleased]\n")
    monkeypatch.chdir(tmp_path)
    assert main(["extract", "9.9.9"]) == 1


def test_main_promote_duplicate_exits_1(tmp_path, monkeypatch):
    (tmp_path / "CHANGELOG.md").write_text(
        "# Changelog\n\n## [Unreleased]\n\n## [0.3.0] - 2026-06-20\n\n- old\n"
    )
    monkeypatch.chdir(tmp_path)
    assert main(["promote", "0.3.0"]) == 1


# --- check via main() against a real git repo ---


def test_main_check_passes_on_new_entry(tmp_path, monkeypatch):
    repo = _git_repo(tmp_path)
    base = _commit_changelog(repo, "# Changelog\n\n## [Unreleased]\n", "base")
    head = _commit_changelog(repo, "# Changelog\n\n## [Unreleased]\n\n- New.\n", "entry")
    monkeypatch.chdir(repo)
    assert main(["check", "--title", "feat: thing", "--base", base, "--head", head]) == 0


def test_main_check_fails_when_required_and_no_entry(tmp_path, monkeypatch):
    repo = _git_repo(tmp_path)
    base = _commit_changelog(repo, "# Changelog\n\n## [Unreleased]\n", "base")
    head = _commit_changelog(repo, "# Changelog\n\n## [Unreleased]\n", "noop")
    monkeypatch.chdir(repo)
    assert main(["check", "--title", "fix: thing", "--base", base, "--head", head]) == 1


def test_main_check_exempt_title_passes_without_entry(tmp_path, monkeypatch):
    repo = _git_repo(tmp_path)
    base = _commit_changelog(repo, "# Changelog\n\n## [Unreleased]\n", "base")
    head = _commit_changelog(repo, "# Changelog\n\n## [Unreleased]\n", "noop")
    monkeypatch.chdir(repo)
    assert main(["check", "--title", "chore: bump", "--base", base, "--head", head]) == 0


def test_main_check_ignores_inherited_git_dir(tmp_path, monkeypatch):
    """_git_show must scrub GIT_* and resolve the cwd repo, not an inherited
    GIT_DIR — otherwise the gate breaks when pytest runs inside a git hook."""
    repo = _git_repo(tmp_path)
    base = _commit_changelog(repo, "# Changelog\n\n## [Unreleased]\n", "base")
    head = _commit_changelog(repo, "# Changelog\n\n## [Unreleased]\n\n- New.\n", "entry")
    monkeypatch.chdir(repo)
    # A bogus inherited GIT_DIR would send `git show` to the wrong repo without
    # the scrub; the gate must still see the new entry and pass.
    monkeypatch.setenv("GIT_DIR", str(tmp_path / "nonexistent.git"))
    assert main(["check", "--title", "feat: x", "--base", base, "--head", head]) == 0
