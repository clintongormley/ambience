import json

import pytest

from ambience_mcp import budget


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
    # FastMCP sends a result pretty-printed (indent=2) AND a second time as
    # structuredContent — size_of must model both, not the compact json.dumps a
    # naive implementation would reach for.
    schemas = {f"a{i}": {"fields": {"f": "x" * 50}} for i in range(20)}
    payload = {"actions": {"schemas": schemas}}
    compact = len(json.dumps(payload))

    assert budget.size_of(payload) == 2 * len(json.dumps(payload, indent=2))
    # The whole point of the fix: compact JSON meaningfully under-counts nested
    # schemas, exactly the term fit_context sheds.
    assert budget.size_of(payload) > compact * 1.5


def _context(schema_count: int, schema_size: int) -> dict:
    return {
        "ambience_ai_context": 1,
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
    # budget in tools.py before fit_result ever sees them — the boundary must
    # be a genuine no-op for them, not a second pass.
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
