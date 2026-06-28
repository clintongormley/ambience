"""The AI-docs generator: keeps the knowledge pack's code-derived sections in
sync with the conditions/actions actually shipped, so a release can never ship
stale authoring docs (enforced by `make ai-docs-check`)."""

from __future__ import annotations

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


def test_bundle_format_reference_states_supported_version() -> None:
    from custom_components.ambience.const import AI_BUNDLE_VERSION

    out = gen_ai_docs.render_bundle_format(AI_BUNDLE_VERSION)
    assert out.startswith(GENERATED_BANNER)
    assert GENERATED_END in out
    # The supported format number and the field the skill checks must appear.
    assert str(AI_BUNDLE_VERSION) in out
    assert "ambience_ai_bundle" in out


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
