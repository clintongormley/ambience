import json

import pytest

from ambience_mcp import budget
from ambience_mcp.budget import _trim_list_to_fit, size_of


def test_max_result_chars_defaults():
    assert budget.max_result_chars() == budget.DEFAULT_MAX_RESULT_CHARS


def test_max_result_chars_honours_the_env_override(monkeypatch):
    monkeypatch.setenv("AMBIENCE_MCP_MAX_RESULT_CHARS", "1234")
    assert budget.max_result_chars() == 1234


@pytest.mark.parametrize("bad", ["not-a-number", "0", "-5"])
def test_max_result_chars_ignores_a_nonsense_override(monkeypatch, bad):
    monkeypatch.setenv("AMBIENCE_MCP_MAX_RESULT_CHARS", bad)
    assert budget.max_result_chars() == budget.DEFAULT_MAX_RESULT_CHARS


def test_size_of_models_the_wire_payload_not_compact_json():
    # FastMCP serializes a result ONCE, pretty-printed (indent=2), as the text
    # content block — structured output is disabled, so there is no second
    # byte-identical structuredContent copy (see _BoundedFastMCP.add_tool).
    # size_of must model that indent=2 wire form, not the compact json.dumps a
    # naive implementation would reach for.
    schemas = {f"a{i}": {"fields": {"f": "x" * 50}} for i in range(20)}
    payload = {"actions": {"schemas": schemas}}
    compact = len(json.dumps(payload))

    assert budget.size_of(payload) == len(json.dumps(payload, indent=2))
    # indent=2 still meaningfully exceeds compact for nested schemas, exactly the
    # term fit_context sheds.
    assert budget.size_of(payload) > compact * 1.5


def test_size_of_counts_a_single_emission():
    # Tools disable FastMCP structured output (see _BoundedFastMCP.add_tool), so a
    # result is serialized ONCE — the indent=2 text content block — not twice.
    payload = {"guide": "x" * 5000}
    assert size_of(payload) == len(json.dumps(payload, indent=2, default=str))


def test_cookbook_sized_guide_section_fits_after_single_emission():
    # The reported bug, pinned against the REAL shipped guide:
    # ambience_get_guide(section="Condition cookbook") returned result_too_large
    # only because size_of double-counted the (now disabled) structuredContent
    # copy. With a single emission the real cookbook section fits the budget with
    # headroom. If this FAILS, the shipped guide grew past the single-emission
    # budget — land the pagination change before relying on it.
    from pathlib import Path

    from ambience_mcp.tools import _split_guide_sections

    guide = Path(__file__).parents[2] / "custom_components/ambience/ai_guide/ambience-ai-guide.md"
    sections = _split_guide_sections(guide.read_text(encoding="utf-8"))
    payload = {
        "ambience_version": "1.1.0-rc.4",
        "sections": list(sections),
        "section": "Condition cookbook",
        "guide": sections["Condition cookbook"],
    }
    assert size_of(payload) <= budget.max_result_chars()


def test_guide_section_parts_single_chunk_when_it_fits():
    from ambience_mcp.budget import _guide_section_parts

    text = "## A\n\nalpha\n\n## B\n\nbeta"
    assert _guide_section_parts(text, fits=lambda c: True) == [text]


def test_guide_section_parts_splits_on_headings_to_fit():
    from ambience_mcp.budget import _guide_section_parts

    text = "## A\n\n" + "a" * 100 + "\n\n## B\n\n" + "b" * 100
    parts = _guide_section_parts(text, fits=lambda c: len(c) <= 130)
    assert len(parts) == 2
    assert parts[0].startswith("## A") and parts[1].startswith("## B")
    assert all(len(p) <= 130 for p in parts)


def test_guide_section_parts_never_splits_inside_a_fence():
    from ambience_mcp.budget import _guide_section_parts

    text = "## A\n\n```yaml\n# not a heading\nx: 1\n```\n\n## B\n\nb"
    parts = _guide_section_parts(text, fits=lambda c: len(c) <= 60)
    assert all(p.count("```") % 2 == 0 for p in parts)  # no fence split across parts


def test_guide_section_parts_hard_splits_an_oversized_block():
    from ambience_mcp.budget import _guide_section_parts

    text = "## A\n\n" + "\n".join(f"line{i}" for i in range(50))
    parts = _guide_section_parts(text, fits=lambda c: len(c) <= 40)
    assert len(parts) > 1
    assert all(len(p) <= 40 for p in parts)


def test_guide_section_parts_keeps_every_chunk_within_budget_across_a_fence():
    from ambience_mcp.budget import _guide_section_parts

    # One ## block bigger than budget forces the line-level hard fallback. A long
    # prose line leaves `cur` just under budget; the fence-open line still fits,
    # but the fence BODY pushes the chunk over — and a fence must never be broken.
    # Regression: the hard fallback flushed only BEFORE a plain line, never before
    # a fence it had already entered, so it emitted an over-budget chunk even
    # though every line and the whole fence each fit on their own.
    fence = "```\n" + "\n".join("cccc" for _ in range(3)) + "\n```"
    text = "## A\n" + "p" * 50 + "\n" + fence + "\ntail"
    parts = _guide_section_parts(text, fits=lambda c: len(c) <= 60)
    assert all(len(p) <= 60 for p in parts), [len(p) for p in parts]


def _context(schema_count: int, schema_size: int) -> dict:
    return {
        "catalog": {"entity_summary": {"total": 3}},
        "actions": {
            "exposed": [{"id": f"light.a{i}"} for i in range(schema_count)],
            "schemas": {
                f"light.a{i}": {"fields": {"f": "x" * schema_size}} for i in range(schema_count)
            },
        },
    }


def test_fit_context_leaves_a_payload_under_budget_untouched():
    context = _context(2, 10)

    assert budget.fit_context(context, budget=10_000) == context


def test_fit_context_sheds_schemas_until_it_fits_and_says_which():
    context = _context(10, 500)
    assert budget.size_of(context) > 2_000

    fitted = budget.fit_context(context, budget=2_000)

    assert budget.size_of(fitted) <= 2_000
    assert fitted["schemas_omitted"]  # announced, never silent
    kept = set(fitted["actions"]["schemas"])
    omitted = set(fitted["schemas_omitted"])
    assert kept.isdisjoint(omitted)
    assert kept | omitted == set(context["actions"]["schemas"])


def test_fit_context_does_not_mutate_the_input():
    context = _context(10, 500)
    before = json.dumps(context)

    budget.fit_context(context, budget=2_000)

    assert json.dumps(context) == before


def test_fit_context_sheds_every_schema_if_it_still_does_not_fit():
    context = _context(5, 5_000)

    fitted = budget.fit_context(context, budget=100)

    assert fitted["actions"]["schemas"] == {}
    assert len(fitted["schemas_omitted"]) == 5


def test_fit_context_with_no_schemas_to_shed_returns_what_it_has():
    # Nothing left to drop — better an oversized honest result than a crash.
    context = {"catalog": {"x": "y" * 5_000}}

    fitted = budget.fit_context(context, budget=100)

    assert fitted == context


def _linear_context_reference(context: dict, limit: int) -> dict:
    """The original one-schema-at-a-time shed loop `fit_context` replaced with a
    bisection, kept as the behavioural oracle — mirrors `_linear_trim_reference`
    below for `_trim_list_to_fit`. Same shedding order (biggest schema first,
    fewest schemas dropped for the bytes reclaimed), just walked linearly instead
    of bisected."""
    if size_of(context) <= limit:
        return context
    actions = context.get("actions")
    schemas = actions.get("schemas") if isinstance(actions, dict) else None
    if not isinstance(schemas, dict) or not schemas:
        return context
    ordered = sorted(schemas, key=lambda k: size_of(schemas[k]), reverse=True)

    def candidate(shed: int) -> dict:
        dropped = set(ordered[:shed])
        return {
            **context,
            "actions": {
                **actions,
                "schemas": {k: v for k, v in schemas.items() if k not in dropped},
            },
            "schemas_omitted": sorted(ordered[:shed]),
        }

    shed = 1
    while True:
        result = candidate(shed)
        if size_of(result) <= limit or shed >= len(ordered):
            return result
        shed += 1


@pytest.mark.parametrize("limit", [100, 200, 1_000, 2_000, 5_000, 50_000])
def test_fit_context_matches_the_linear_reference(limit):
    context = _context(30, 200)

    assert budget.fit_context(context, budget=limit) == _linear_context_reference(context, limit)


@pytest.mark.parametrize("limit", [0, 1, 10, 50, 100])
def test_fit_context_matches_the_linear_reference_at_extreme_limits(limit):
    # Limits small enough that nothing (or almost nothing) fits — the
    # boundary where the bisection's `hi` bound (shedding EVERY schema) is
    # never verified to fit, so the "honest oversized result" path is what
    # gets exercised here rather than a found fitting shed count.
    context = _context(12, 300)

    assert budget.fit_context(context, budget=limit) == _linear_context_reference(context, limit)


def _uneven_context(sizes: list[int | None], keys: list[str] | None = None) -> dict:
    """Like `_context`, but each schema's size (and optionally key) is given
    explicitly, so tests can build wildly uneven shapes — a huge schema next
    to tiny or empty ones, long key names on tiny values, etc. `None` means an
    empty-dict value."""
    schemas = {}
    for i, size in enumerate(sizes):
        key = keys[i] if keys else f"light.a{i}"
        schemas[key] = {} if size is None else {"fields": {"f": "x" * size}}
    return {
        "catalog": {"entity_summary": {"total": len(sizes)}},
        "actions": {"exposed": [{"id": k} for k in schemas], "schemas": schemas},
    }


@pytest.mark.parametrize(
    "sizes",
    [
        [5000, 0, 0, 0],
        [5000, 1, 1, 1, 1],
        [0, 0, 0, 5000],
        [200, 100, 50, 25, 12, 6, 3, 1, 0],
        [None, None, None, 3000],
        [3000, None, None],
    ],
)
@pytest.mark.parametrize("limit", [10, 100, 500, 1_000, 5_000, 50_000])
def test_fit_context_matches_the_linear_reference_with_wildly_uneven_schema_sizes(sizes, limit):
    # `ordered` sorts biggest-first, so a real payload can shed one huge
    # schema and be left with several tiny (or empty-dict) ones — the shape
    # most likely to stress the monotonicity the bisection relies on.
    context = _uneven_context(sizes)

    assert budget.fit_context(context, budget=limit) == _linear_context_reference(context, limit)


def test_fit_context_matches_the_linear_reference_with_tiny_values_and_long_keys():
    # A long key name on a tiny (or empty) value is the adversarial case for
    # the CONTRACT `fit_context` relies on: shedding that entry frees almost
    # no bytes from `schemas`, while its long name still costs bytes in
    # `schemas_omitted`. The key's own bytes appear (and cancel) in both
    # places regardless of length, so this must still match the oracle.
    context = _uneven_context([0, 0, 0, 5000], keys=["z" * 200, "z" * 150, "z" * 100, "a"])

    for limit in (10, 100, 500, 1_000, 5_000, 50_000):
        assert budget.fit_context(context, budget=limit) == _linear_context_reference(
            context, limit
        )


def _context_candidate_sizes(context: dict) -> list[int]:
    """size_of(candidate(shed)) for every shed from 1 to len(ordered), using
    the exact same construction fit_context itself uses internally."""
    actions = context["actions"]
    schemas = actions["schemas"]
    ordered = sorted(schemas, key=lambda k: size_of(schemas[k]), reverse=True)
    sizes = []
    for shed in range(1, len(ordered) + 1):
        dropped = set(ordered[:shed])
        candidate = {
            **context,
            "actions": {
                **actions,
                "schemas": {k: v for k, v in schemas.items() if k not in dropped},
            },
            "schemas_omitted": sorted(ordered[:shed]),
        }
        sizes.append(size_of(candidate))
    return sizes


# The guard beyond the docs: pin the actual invariant fit_context's bisection
# depends on (see its inline "CONTRACT this relies on" comment in budget.py)
# — size_of(candidate(shed)) strictly decreases as shed increases, with no
# exceptions anywhere in range. If a future edit changes what `candidate`
# carries (e.g. a per-schema summary alongside the omitted name) in a way
# that stops dominating the shed entry's own bytes, this should fail here,
# loudly and by name, instead of the bisection silently diverging from the
# linear oracle.
@pytest.mark.parametrize("schema_size", [0, 1, 5, 50, 500, 5_000])
@pytest.mark.parametrize("schema_count", [2, 3, 5, 10, 30, 60])
def test_context_candidate_size_is_strictly_monotonic_as_shed_increases(schema_count, schema_size):
    context = _context(schema_count, schema_size)

    sizes = _context_candidate_sizes(context)

    for smaller_shed_size, larger_shed_size in zip(sizes, sizes[1:], strict=False):
        assert larger_shed_size < smaller_shed_size


def test_context_candidate_size_is_strictly_monotonic_with_uneven_sizes_and_long_keys():
    # Same property, but for the adversarial uneven-sizes/long-keys shapes
    # above, where the "removed value's bytes dominate the added key's
    # bytes" argument is closest to the margin.
    context = _uneven_context([5000, 1, 1, 1, 1])
    sizes = _context_candidate_sizes(context)
    for smaller_shed_size, larger_shed_size in zip(sizes, sizes[1:], strict=False):
        assert larger_shed_size < smaller_shed_size

    context = _uneven_context([0, 0, 0, 5000], keys=["z" * 200, "z" * 150, "z" * 100, "a"])
    sizes = _context_candidate_sizes(context)
    for smaller_shed_size, larger_shed_size in zip(sizes, sizes[1:], strict=False):
        assert larger_shed_size < smaller_shed_size


def _entities(count: int, size: int) -> dict:
    return {
        "entities": [{"entity_id": f"light.l{i:04d}", "name": "n" * size} for i in range(count)],
        "total_matches": 500,
        "offset": 100,
        "returned": count,
        "cursor": 100 + count,
        "truncated": True,
    }


def test_fit_entities_leaves_a_page_under_budget_untouched():
    result = _entities(3, 10)

    assert budget.fit_entities(result, budget=10_000) == result


def test_fit_entities_drops_rows_and_repoints_the_cursor_at_the_first_dropped():
    result = _entities(50, 200)

    fitted = budget.fit_entities(result, budget=3_000)

    assert budget.size_of(fitted) <= 3_000
    kept = fitted["returned"]
    assert 0 < kept < 50
    assert fitted["entities"] == result["entities"][:kept]
    # The next page must start at the first row we dropped — nothing unreachable.
    assert fitted["cursor"] == result["offset"] + kept
    assert fitted["truncated"] is True


def test_fit_entities_cursor_is_none_when_the_trimmed_page_reaches_the_end():
    result = {
        "entities": [{"entity_id": f"light.l{i}", "name": "n" * 5} for i in range(3)],
        "total_matches": 3,
        "offset": 0,
        "returned": 3,
        "cursor": None,
        "truncated": False,
    }

    fitted = budget.fit_entities(result, budget=100_000)

    assert fitted["cursor"] is None
    assert fitted["truncated"] is False


def test_fit_entities_with_no_rows_returns_what_it_has():
    result = {
        "entities": [],
        "total_matches": 0,
        "offset": 0,
        "returned": 0,
        "cursor": None,
        "truncated": False,
    }

    assert budget.fit_entities(result, budget=1) == result


def test_fit_entities_floors_at_one_row_instead_of_livelocking():
    # A single row bigger than the whole budget must still be served — trimming
    # to zero rows would re-point the cursor at the caller's own offset, and a
    # conforming pagination client would fetch the identical empty page forever.
    result = {
        "entities": [{"entity_id": "light.huge", "name": "x" * 500}],
        "total_matches": 500,
        "offset": 100,
        "returned": 1,
        "cursor": 101,
        "truncated": True,
    }

    fitted = budget.fit_entities(result, budget=50)

    assert fitted["returned"] == 1
    assert fitted["entities"] == result["entities"]  # the oversized row is served, not dropped
    assert fitted["cursor"] == result["offset"] + 1
    assert fitted["cursor"] > result["offset"]  # must advance past the caller's own offset
    assert fitted["truncated"] is True


def test_fit_entities_paging_always_makes_progress_past_an_oversized_row():
    # Simulate a client that pages forward using whatever cursor fit_entities hands
    # back. If the cursor ever equals the offset it was given, the client is stuck
    # re-fetching the same page forever.
    first = {
        "entities": [{"entity_id": "light.huge", "name": "x" * 500}],
        "total_matches": 500,
        "offset": 100,
        "returned": 1,
        "cursor": 101,
        "truncated": True,
    }

    fitted = budget.fit_entities(first, budget=50)
    assert fitted["cursor"] != first["offset"]

    # Feed the returned cursor forward as the next page's offset.
    second = {**first, "offset": fitted["cursor"], "cursor": fitted["cursor"] + 1}
    fitted2 = budget.fit_entities(second, budget=50)

    assert fitted2["cursor"] != second["offset"]
    assert fitted2["cursor"] > second["offset"]


def test_fit_entities_does_not_mutate_the_input():
    result = _entities(50, 200)
    before = json.dumps(result)

    budget.fit_entities(result, budget=3_000)

    assert json.dumps(result) == before


def _traces(count: int, size: int) -> dict:
    return {"traces": [{"unit": f"u{i}", "reason": "x" * size} for i in range(count)]}


def test_fit_traces_leaves_a_list_under_budget_untouched():
    result = _traces(3, 10)

    assert budget.fit_traces(result, budget=10_000) == result


def test_fit_traces_drops_from_the_end_and_announces_what_was_dropped():
    result = _traces(50, 200)

    fitted = budget.fit_traces(result, budget=3_000)

    assert budget.size_of(fitted) <= 3_000
    kept = fitted["returned"]
    assert 0 < kept < 50
    assert fitted["traces"] == result["traces"][:kept]  # dropped from the END
    assert fitted["omitted"] == 50 - kept
    assert fitted["omitted"] > 0
    assert "notice" in fitted and fitted["notice"]  # announced, never silent


def test_fit_traces_omits_nothing_and_no_notice_when_it_already_fits():
    result = _traces(3, 10)

    fitted = budget.fit_traces(result, budget=10_000)

    assert fitted == result
    assert "omitted" not in fitted
    assert "notice" not in fitted


def test_fit_traces_with_no_traces_returns_what_it_has():
    result = {"traces": []}

    assert budget.fit_traces(result, budget=1) == result


def test_fit_traces_floors_at_one_trace_instead_of_returning_nothing():
    result = _traces(1, 5_000)

    fitted = budget.fit_traces(result, budget=50)

    assert fitted["returned"] == 1
    assert fitted["traces"] == result["traces"]  # the oversized trace is served, not dropped
    # Nothing was actually omitted (there was only ever one trace) — omitted: 0
    # and notice: None would be noise, so both keys are suppressed entirely.
    assert "omitted" not in fitted
    assert "notice" not in fitted


def test_fit_traces_does_not_mutate_the_input():
    result = _traces(50, 200)
    before = json.dumps(result)

    budget.fit_traces(result, budget=3_000)

    assert json.dumps(result) == before


# fit_result: the terminal backstop under fit_context/fit_entities/fit_traces,
# applied to EVERY tool's result at the server boundary (see test_server.py for
# the wiring-level proof). Unlike those three shape-aware strategies, fit_result
# no longer trims anything — a still-oversized result is replaced by a small,
# bounded error object. See fit_result's docstring for why: a generic top-level
# trim can silently truncate a list a write path treats as complete (data
# loss), or shed a small audit list while the real bulk sits untouched
# elsewhere, or simply fail to reach a nested bulk at all.


def test_fit_result_leaves_an_already_small_result_untouched():
    result = {"scenes": [{"name": "A"}], "other": "x"}

    assert budget.fit_result(result, budget=10_000) == result


def test_fit_result_never_ships_a_truncated_get_scope_shaped_result():
    # get_scope has no fit_* strategy of its own. Before this fix, fit_result
    # trimmed its `scenes` list — but ambience_apply_write treats a scope's
    # scene list as the COMPLETE set to persist, so a model that carried
    # forward a truncated `scenes` (per the documented get_scope-then-
    # apply_write workflow) would silently DELETE the scenes it never saw.
    # The fix: never trim, always replace with the bounded error object.
    result = {"scenes": [{"name": f"s{i}", "actions": "x" * 200} for i in range(50)]}

    fitted = budget.fit_result(result, budget=3_000)

    assert budget.size_of(fitted) <= 3_000
    assert fitted["error"] == "result_too_large"
    assert "scenes" not in fitted  # never a short, carry-forward-able scene list
    assert fitted["size_chars"] > 3_000
    assert fitted["budget_chars"] == 3_000
    assert fitted["message"]  # announced, never silent


def test_fit_result_never_mangles_a_get_guide_shaped_result():
    # get_guide's real bulk is the `guide` text (a string, not a list); its
    # `sections` list is the table of contents. The old generic trim cut
    # `sections` (the only top-level list) because it didn't understand that
    # `guide` was the actual bulk — shrinking the table of contents while the
    # result stayed oversized. Now it's the bounded error object instead.
    result = {
        "sections": ["Config schema", "Condition cookbook", "Cookbook", "Diagnostics"],
        "guide": "x" * 5_000,
    }

    fitted = budget.fit_result(result, budget=1_000)

    assert budget.size_of(fitted) <= 1_000
    assert fitted["error"] == "result_too_large"
    assert "sections" not in fitted  # the table of contents is never mangled
    assert "guide" not in fitted


def test_fit_result_bounds_a_preview_write_shaped_result_with_a_huge_nested_diff():
    # preview_write's bulk can live inside a nested dict (`diff.added/removed/
    # updated`), unreachable by a top-level-only pass — the old code returned
    # it unchanged and still over budget, so boundedness was never actually
    # structural for this shape. Now it comes back as the bounded error object.
    result = {"diff": {"added": [{"x": "y" * 5_000}] * 5}, "confirm_token": "abc"}

    fitted = budget.fit_result(result, budget=50)

    assert budget.size_of(fitted) <= 2_000  # small and bounded, not the oversized original
    assert fitted["error"] == "result_too_large"
    assert "diff" not in fitted


def test_fit_result_returns_non_dict_results_unchanged():
    assert budget.fit_result([1, 2, 3], budget=1) == [1, 2, 3]
    assert budget.fit_result("just a string", budget=1) == "just a string"


def test_fit_result_is_a_no_op_for_results_already_fitted_upstream():
    # fit_context/fit_entities/fit_traces already brought these shapes within
    # budget in the protocol adapter (protocols/v1.py) before fit_result ever
    # sees them — the boundary must be a genuine no-op for them, not a second pass.
    context = _context(2, 10)
    entities = _entities(3, 10)
    traces = _traces(3, 10)

    assert budget.fit_result(context, budget=10_000) == context
    assert budget.fit_result(entities, budget=10_000) == entities
    assert budget.fit_result(traces, budget=10_000) == traces


def test_fit_result_does_not_mutate_the_input():
    result = {"scenes": [{"name": f"s{i}", "x": "y" * 200} for i in range(50)]}
    before = json.dumps(result)

    budget.fit_result(result, budget=3_000)

    assert json.dumps(result) == before


# fit_preview: preview_write's shape-aware strategy. Replacing a whole scope
# lists every scene TWICE (once removed, once added), which can bust the
# budget on a perfectly normal "redo my scenes" request. Unlike fit_entities/
# fit_traces this never drops an ENTRY — only the scene BODY — because the
# diff is the surface a human approves a destructive write from.


def _preview_scene(prefix: str, i: int, size: int) -> dict:
    return {"name": f"{prefix}{i}", "category": "c", "actions": "x" * size}


def _preview(added: int, removed: int, updated: int, size: int) -> dict:
    diff = {
        "added": [_preview_scene("a", i, size) for i in range(added)],
        "removed": [_preview_scene("r", i, size) for i in range(removed)],
        "updated": [
            {
                "before": {**_preview_scene("u", i, size), "when": {"lux": 1}},
                "after": {**_preview_scene("u", i, size), "when": {"lux": 2}},
            }
            for i in range(updated)
        ],
    }
    return {
        "valid": True,
        "errors": None,
        "unknown_categories": [],
        "creating_categories": [],
        "diff": diff,
        "confirm_token": "tok-abc123",
    }


def test_fit_preview_leaves_a_small_result_untouched():
    result = _preview(1, 1, 1, 10)

    assert budget.fit_preview(result, budget=10_000) == result


def test_fit_preview_summarises_when_over_budget_without_dropping_any_entry():
    result = _preview(20, 20, 5, 300)
    full_diff = result["diff"]
    full_names = {s["name"] for s in full_diff["added"]} | {s["name"] for s in full_diff["removed"]}
    assert budget.size_of(result) > 8_000  # sanity: this case really is over budget

    fitted = budget.fit_preview(result, budget=8_000)

    assert budget.size_of(fitted) <= 8_000
    assert fitted["diff_summarised"] is True
    assert fitted["notice"]  # announced, never silent
    # The property that must never regress: every changed scene is still
    # listed, by name — only the bodies were elided.
    assert len(fitted["diff"]["added"]) == len(full_diff["added"])
    assert len(fitted["diff"]["removed"]) == len(full_diff["removed"])
    assert len(fitted["diff"]["updated"]) == len(full_diff["updated"])
    summarised_names = {e["name"] for e in fitted["diff"]["added"]} | {
        e["name"] for e in fitted["diff"]["removed"]
    }
    assert summarised_names == full_names


def test_fit_preview_preserves_the_confirm_token_and_gate_fields_untouched():
    result = _preview(20, 20, 5, 300)
    # The two newest fields on the human's approval surface: an existing category
    # being overwritten (updating_categories, top-level like its unknown/creating
    # siblings), and evaluation order being re-derived (order_note, INSIDE diff —
    # see diff.py's diff_scopes/summarise_diff). Neither has a guard elsewhere
    # against being dropped when fit_preview trims the payload.
    result["updating_categories"] = [{"before": {"id": "c"}, "after": {"id": "c", "name": "C2"}}]
    result["diff"]["order_note"] = "some scenes were resubmitted without their order fields"

    fitted = budget.fit_preview(result, budget=3_000)

    assert fitted["confirm_token"] == result["confirm_token"]
    assert fitted["valid"] == result["valid"]
    assert fitted["errors"] == result["errors"]
    assert fitted["unknown_categories"] == result["unknown_categories"]
    assert fitted["creating_categories"] == result["creating_categories"]
    assert fitted["updating_categories"] == result["updating_categories"]
    assert fitted["diff"]["order_note"] == result["diff"]["order_note"]


def test_fit_preview_updated_entries_carry_explicitly_authored_priority_and_pinned():
    # Inverted: priority/pinned are evaluation-order fields the backend HONOURS
    # on import, so when the AFTER scene states them explicitly a change here
    # must survive summarisation, not be swallowed — see diff.py's _ORDER_FIELDS
    # and tests/test_diff.py::test_a_priority_swap_is_a_visible_update.
    before = {
        "name": "Evening",
        "category": "c",
        "actions": "off " * 100,
        "priority": 5,
        "pinned": True,
    }
    after = {
        "name": "Evening",
        "category": "c",
        "actions": "on " * 100,
        "priority": 99,
        "pinned": False,
    }
    result = {
        "valid": True,
        "errors": None,
        "unknown_categories": [],
        "creating_categories": [],
        "diff": {"added": [], "removed": [], "updated": [{"before": before, "after": after}]},
        "confirm_token": "tok",
    }

    fitted = budget.fit_preview(result, budget=50)

    entry = fitted["diff"]["updated"][0]
    assert entry["changed_fields"] == ["actions", "pinned", "priority"]


def test_fit_preview_handles_an_unnamed_scene_without_crashing():
    result = _preview(0, 0, 0, 0)
    result["diff"] = {
        "added": [{"category": "c", "actions": "x" * 5_000}],
        "removed": [],
        "updated": [],
    }

    fitted = budget.fit_preview(result, budget=50)

    assert fitted["diff"]["added"] == [{"name": None, "category": "c", "index": 0}]


def test_fit_preview_with_no_diff_key_returns_what_it_has():
    result = {"other": "x" * 5_000}

    assert budget.fit_preview(result, budget=100) == result


def test_fit_preview_leaves_a_still_oversized_summary_for_fit_result_to_bound():
    # Pathological: thousands of changed scenes, so even the summarised diff
    # doesn't fit. fit_preview must not grow a second truncation path here —
    # it hands back the (still oversized) summary, and fit_result, the
    # terminal backstop, is the one that replaces it with the bounded error.
    result = _preview(2_000, 0, 0, 10)

    fitted = budget.fit_preview(result, budget=50)

    assert fitted["diff_summarised"] is True
    assert len(fitted["diff"]["added"]) == 2_000
    assert budget.size_of(fitted) > 50

    final = budget.fit_result(fitted, budget=50)

    assert final["error"] == "result_too_large"


def test_fit_preview_does_not_mutate_the_input():
    result = _preview(20, 20, 5, 300)
    before = json.dumps(result)

    budget.fit_preview(result, budget=3_000)

    assert json.dumps(result) == before


def _linear_trim_reference(result, key, limit, derive_fields):
    """The original one-dump-per-drop loop, kept as the behavioural oracle."""
    rows = result.get(key)
    if not isinstance(rows, list) or not rows:
        return result
    kept = list(rows)
    while True:
        candidate = {**result, key: kept, **derive_fields(len(kept))}
        if size_of(candidate) <= limit or len(kept) <= 1:
            return candidate
        kept.pop()


@pytest.mark.parametrize("limit", [200, 1_000, 5_000, 50_000])
def test_trim_matches_the_linear_reference(limit):
    rows = [{"entity_id": f"light.l{i}", "name": "x" * (i % 37)} for i in range(120)]
    result = {"entities": rows, "total_matches": 500, "offset": 40}

    def derive(kept_len):
        next_cursor = 40 + kept_len
        more = next_cursor < 500
        return {"returned": kept_len, "cursor": next_cursor if more else None, "truncated": more}

    assert _trim_list_to_fit(result, "entities", limit, derive) == _linear_trim_reference(
        result, "entities", limit, derive
    )


@pytest.mark.parametrize("limit", [200, 1_000, 5_000, 50_000])
def test_trim_matches_the_linear_reference_at_the_entities_cursor_flip_boundary(limit):
    # The test above (total_matches=500, offset=40, n=120) never actually
    # reaches total_matches, so `more` is True at every kept_len including the
    # top — the cursor-flips-to-null / truncated-flips-to-False discontinuity
    # (kept_len == len(rows), the same kind of on/off flip fit_traces's
    # notice hits) is never exercised for entities. Setting
    # total_matches == offset + n makes it flip exactly at the top.
    rows = [{"entity_id": f"light.l{i}", "name": "x" * (i % 37)} for i in range(120)]
    result = {"entities": rows, "total_matches": 160, "offset": 40}  # 160 == 40 + 120

    def derive(kept_len):
        next_cursor = 40 + kept_len
        more = next_cursor < 160
        return {"returned": kept_len, "cursor": next_cursor if more else None, "truncated": more}

    assert _trim_list_to_fit(result, "entities", limit, derive) == _linear_trim_reference(
        result, "entities", limit, derive
    )


def test_trim_returns_a_result_that_fits_or_a_single_row():
    rows = [{"entity_id": f"light.l{i}", "blob": "y" * 400} for i in range(80)]
    result = {"entities": rows, "total_matches": 80, "offset": 0}
    fitted = _trim_list_to_fit(result, "entities", 3_000, lambda n: {"returned": n})
    assert len(fitted["entities"]) >= 1
    assert size_of(fitted) <= 3_000 or len(fitted["entities"]) == 1


def _traces_derive_fields(total):
    """A faithful reproduction of `fit_traces`'s own `derive_fields`: the
    ~150-char `notice` is present for every `kept_len < total` and ABSENT at
    `kept_len == total` — the on/off field the bisection must not be fooled
    by. `total` is `len(rows)` here, exactly as it is inside `fit_traces`
    (there is no separate "total_matches" for traces, unlike entities)."""

    def derive(kept_len):
        omitted = total - kept_len
        if not omitted:
            return {"returned": kept_len}
        notice = (
            f"Showing {kept_len} of {total} traces; the oldest {omitted} were "
            "omitted to fit the result budget. Call again with a smaller limit to see "
            "a different slice."
        )
        return {"returned": kept_len, "omitted": omitted, "notice": notice}

    return derive


@pytest.mark.parametrize("limit", [50, 200, 236, 300, 400, 455, 500, 510, 600, 5_000, 50_000])
@pytest.mark.parametrize("n_rows", [1, 2, 3, 4, 5, 8, 15, 30])
def test_trim_matches_the_linear_reference_for_the_traces_shaped_on_off_notice(n_rows, limit):
    # Unlike the entities-shaped derive above (only cursor DIGITS change size),
    # this derive_fields flips a ~150-char field on/off exactly at the top
    # boundary (kept_len == len(rows)) — the discontinuity the bisection must
    # not miss. Sweeping both n_rows and limit across the boundary covers the
    # discontinuity itself, not just one lucky value.
    rows = [{"t": ""} for _ in range(n_rows)]
    result = {"traces": rows}
    derive = _traces_derive_fields(n_rows)

    assert _trim_list_to_fit(result, "traces", limit, derive) == _linear_trim_reference(
        result, "traces", limit, derive
    )


def test_trim_matches_the_linear_reference_at_the_reviewers_counterexample():
    # Pinned regression for the CRITICAL finding on task 13: bisection assumed
    # payload size grows monotonically with kept rows, but fit_traces's
    # derive_fields is an ON/OFF field (the notice) that is ABSENT at
    # kept_len == total and PRESENT for every kept_len < total — a
    # discontinuity at the top boundary, not the "few chars" nudge the old
    # comment described. Dropping from 3 rows (no notice) to 2 rows (notice
    # appears) INCREASES the total size, so a bisection that only ever
    # corrects downward can land on 1 row and never look back at 3, which
    # fits all along.
    rows = [{"t": ""}, {"t": ""}, {"t": ""}]
    result = {"traces": rows}
    derive = _traces_derive_fields(3)

    fast = _trim_list_to_fit(result, "traces", 455, derive)
    slow = _linear_trim_reference(result, "traces", 455, derive)

    assert fast == slow
    assert len(fast["traces"]) == 3  # the linear oracle keeps every row here


# The guard beyond the docs: pin the actual invariant the bisection in
# _trim_list_to_fit depends on (see its inline "CONTRACT this relies on"
# comment in budget.py) — below the top boundary, size strictly decreases as
# kept_len shrinks by one — for BOTH real derive_fields shapes. If a future
# edit adds a fatter conditional field to either one, this should fail here,
# loudly and by name, instead of the trim silently diverging from the linear
# oracle the way the reviewer's counterexample above did.


def _below_top_sizes(result, key, derive_fields, n_rows):
    """size_of(candidate(k)) for k = 1..n_rows, replicating exactly the
    candidate `_trim_list_to_fit` itself measures — not a stand-in shape."""
    rows = result[key]
    return [size_of({**result, key: rows[:k], **derive_fields(k)}) for k in range(1, n_rows + 1)]


@pytest.mark.parametrize("row_size", [0, 1, 5, 40, 200])
@pytest.mark.parametrize("n_rows", [2, 3, 5, 10, 30, 60, 100])
def test_traces_derive_fields_size_is_strictly_monotonic_below_the_top(n_rows, row_size):
    rows = [{"unit": f"u{i}", "reason": "x" * row_size} for i in range(n_rows)]
    result = {"traces": rows}
    derive = _traces_derive_fields(n_rows)

    sizes = _below_top_sizes(result, "traces", derive, n_rows)
    # Drop the top (kept_len == n_rows) — its on/off `notice` discontinuity
    # is sanctioned and separately covered by the reviewer's-counterexample
    # and traces-shaped-on-off-notice tests above; this test is only about
    # the range where no such discontinuity is allowed.
    below_top = sizes[:-1]
    for smaller_kept_size, larger_kept_size in zip(below_top, below_top[1:], strict=False):
        assert smaller_kept_size < larger_kept_size


@pytest.mark.parametrize("row_size", [0, 1, 5, 40, 200])
@pytest.mark.parametrize("n_rows", [2, 3, 5, 10, 30, 60, 100])
def test_entities_derive_fields_size_is_strictly_monotonic_below_the_top(n_rows, row_size):
    offset = 40
    # total_matches kept comfortably above offset + n_rows so the top-of-range
    # cursor-flip discontinuity (covered separately by the entities-cursor-
    # flip-boundary test above) never lands inside the range checked here.
    total = offset + n_rows + 1_000
    rows = [{"entity_id": f"light.l{i}", "name": "x" * row_size} for i in range(n_rows)]
    result = {"entities": rows, "total_matches": total, "offset": offset}

    def derive(kept_len):
        next_cursor = offset + kept_len
        more = next_cursor < total
        return {"returned": kept_len, "cursor": next_cursor if more else None, "truncated": more}

    sizes = _below_top_sizes(result, "entities", derive, n_rows)
    below_top = sizes[:-1]
    for smaller_kept_size, larger_kept_size in zip(below_top, below_top[1:], strict=False):
        assert smaller_kept_size < larger_kept_size
