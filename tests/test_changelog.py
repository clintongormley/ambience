from bin.changelog import (
    EXEMPT_TYPES,
    _heading_name,
    _split_sections,
    commit_type,
    entry_required,
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
