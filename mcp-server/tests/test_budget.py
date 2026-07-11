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
