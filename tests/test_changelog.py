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
