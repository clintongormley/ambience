"""The AI-docs generator: keeps the knowledge pack's code-derived sections in
sync with the conditions/actions actually shipped, so a release can never ship
stale authoring docs (enforced by `make ai-docs-check`)."""

from __future__ import annotations

import pathlib

from bin import gen_ai_docs

# The conditions registered in __init__.py — discovery must find exactly these.
EXPECTED_CONDITIONS = {
    "time_of_day",
    "day",
    "lux",
    "weather",
    "sun",
    "state",
    "occupancy",
    "people",
    "unavailable",
    "script",
    "template",
}

GENERATED_BANNER = "<!-- AUTO-GENERATED"
GENERATED_END = "<!-- END GENERATED -->"


def test_discover_conditions_finds_every_builtin() -> None:
    found = {c["name"] for c in gen_ai_docs.discover_conditions()}
    assert found == EXPECTED_CONDITIONS


def test_discovered_conditions_carry_help_metadata() -> None:
    by_name = {c["name"]: c for c in gen_ai_docs.discover_conditions()}
    people = by_name["people"]
    assert people["description"]
    assert people["predicate_help"]
    assert people["input"] == "people_predicate"
    assert isinstance(people["priority"], int)


def test_condition_reference_is_marked_generated_and_lists_all() -> None:
    out = gen_ai_docs.render_condition_reference(gen_ai_docs.discover_conditions())
    assert out.startswith(GENERATED_BANNER)
    assert GENERATED_END in out
    for name in EXPECTED_CONDITIONS:
        assert name in out


def test_condition_reference_sorted_by_priority_desc() -> None:
    conditions = gen_ai_docs.discover_conditions()
    out = gen_ai_docs.render_condition_reference(conditions)
    # Highest priority (evaluated first) appears first — unavailable(980) before
    # weather(700).
    assert out.index("unavailable") < out.index("weather")


def test_compatibility_reference_states_version_format_and_update_steps() -> None:
    from custom_components.ambience.const import AI_BUNDLE_VERSION

    out = gen_ai_docs.render_compatibility(AI_BUNDLE_VERSION, "0.31")
    assert out.startswith(GENERATED_BANNER)
    assert GENERATED_END in out
    # The built-for version (major.minor) the skill compares against.
    assert "0.31" in out
    assert "ambience_version" in out
    # The supported bundle format (structural backstop) + the field name.
    assert str(AI_BUNDLE_VERSION) in out
    assert "ambience_ai_bundle" in out
    # The exact update command the skill hands to the user.
    assert "/plugin marketplace update ambience" in out


def test_ambience_minor_reads_manifest() -> None:
    minor = gen_ai_docs.ambience_minor()
    # Looks like "MAJOR.MINOR".
    assert minor.count(".") == 1
    assert all(part.isdigit() for part in minor.split("."))


def test_assemble_portable_doc_concatenates_parts_under_one_banner() -> None:
    doc = gen_ai_docs.assemble_portable_doc(
        [("Schema", "schema body"), ("Cookbook", "cookbook body")]
    )
    assert doc.startswith(GENERATED_BANNER)
    assert "schema body" in doc
    assert "cookbook body" in doc
    # Section titles become headings so the reader can navigate.
    assert "# Schema" in doc
    assert "# Cookbook" in doc


def test_guide_section_titles_are_stable_and_never_call_the_guide_a_bundle() -> None:
    """The section titles are an API: the MCP server serves the guide by section
    and an AI passes these names back to `ambience_get_guide(section=...)`, so a
    rename breaks callers. They must also keep "bundle" for the user's *data* —
    the guide/pack is the documentation, and conflating the two is what makes an
    AI think it already holds a guide it has never read.
    """
    titles = [title for title, _ in gen_ai_docs._PORTABLE_PARTS]
    assert titles == [
        "Compatibility",
        "Config schema",
        "Import format",
        "Condition reference",
        "Condition cookbook",
        "Actions",
        "Action reference",
        "Reading a diagnostic bundle",
    ]


def test_the_shipped_guide_has_exactly_one_h1_per_section() -> None:
    """Gate the ARTIFACT, not just the inputs. `_drop_leading_h1` strips only a
    *leading* H1, so a curated part that ever grows a second, mid-body H1 would
    silently become a phantom section in the guide — and the MCP server, which
    splits the guide on its H1s to serve it section by section, would start
    offering it. Nothing else catches that.
    """
    guide = (
        pathlib.Path(__file__).parent.parent
        / "custom_components/ambience/ai_guide/ambience-ai-guide.md"
    ).read_text(encoding="utf-8")

    # Fence-aware: the guide's YAML examples are full of `#` comments.
    h1s, in_fence = [], False
    for line in guide.splitlines():
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
        elif not in_fence and line.startswith("# "):
            h1s.append(line[2:].strip())

    expected = ["Ambience — AI authoring & diagnosis guide"] + [
        title for title, _ in gen_ai_docs._PORTABLE_PARTS
    ]
    assert h1s == expected


def test_assemble_portable_doc_drops_a_parts_own_h1() -> None:
    """Each part file opens with its own H1, and the assembler adds the section
    title as an H1 too. Emitting both leaves two consecutive H1s — which reads as
    an empty section to anything that splits the guide on top-level headings
    (the MCP server serves the guide section by section this way)."""
    doc = gen_ai_docs.assemble_portable_doc(
        [("Config schema", "# Ambience configuration schema (overview)\n\nschema body")]
    )
    assert "# Config schema" in doc
    assert "# Ambience configuration schema (overview)" not in doc
    assert "schema body" in doc
    # Exactly one top-level heading for the part (plus the guide's own title).
    assert [ln for ln in doc.splitlines() if ln.startswith("# ")] == [
        "# Ambience — AI authoring & diagnosis guide",
        "# Config schema",
    ]


def test_assemble_portable_doc_keeps_subheadings_and_fenced_comments() -> None:
    """Only a *leading* H1 is dropped: `##` structure and `#` comments inside
    YAML fences must survive untouched."""
    body = "# Import format\n\n## The envelope\n\n```yaml\n# --- Block 1 ---\nx: 1\n```"
    doc = gen_ai_docs.assemble_portable_doc([("Import format", body)])
    assert "## The envelope" in doc
    assert "# --- Block 1 ---" in doc
