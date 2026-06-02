"""Rule engine is pure: no HA, no I/O. Every `when` key is a condition name."""

from __future__ import annotations

from typing import Any

import pytest

from custom_components.ambience.engine import resolve


class FakeCondition:
    """Test double — matches when predicate == snapshot."""

    def __init__(self, name: str) -> None:
        self.name = name

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate == snapshot


@pytest.fixture
def conditions() -> dict[str, FakeCondition]:
    return {
        "mode": FakeCondition("mode"),
        "tod": FakeCondition("tod"),
        "wx": FakeCondition("wx"),
    }


def test_empty_rule_list_returns_none(conditions: dict[str, FakeCondition]) -> None:
    assert resolve([], {"mode": "movie", "tod": "evening"}, conditions) is None


def test_single_key_match(conditions: dict[str, FakeCondition]) -> None:
    rules = [{"when": {"mode": "movie"}, "actions": []}]
    result = resolve(rules, {"mode": "movie"}, conditions)
    assert result is not None
    idx, rule = result
    assert idx == 0
    assert rule is rules[0]


def test_key_mismatch_skips_rule(conditions: dict[str, FakeCondition]) -> None:
    rules = [{"when": {"mode": "reading"}, "actions": []}]
    assert resolve(rules, {"mode": "movie"}, conditions) is None


def test_none_predicate_is_wildcard(conditions: dict[str, FakeCondition]) -> None:
    rules = [{"when": {"mode": None}, "actions": []}]
    assert resolve(rules, {"mode": "movie"}, conditions) is not None


def test_absent_key_is_wildcard(conditions: dict[str, FakeCondition]) -> None:
    rules = [{"when": {}, "actions": []}]
    assert resolve(rules, {"mode": "movie"}, conditions) is not None


def test_condition_predicate_match(conditions: dict[str, FakeCondition]) -> None:
    rules = [{"when": {"mode": "movie", "tod": "evening"}, "actions": []}]
    result = resolve(rules, {"mode": "movie", "tod": "evening"}, conditions)
    assert result is not None
    assert result[0] == 0


def test_condition_predicate_mismatch(conditions: dict[str, FakeCondition]) -> None:
    rules = [{"when": {"mode": "movie", "tod": "evening"}, "actions": []}]
    assert resolve(rules, {"mode": "movie", "tod": "morning"}, conditions) is None


def test_first_match_wins(conditions: dict[str, FakeCondition]) -> None:
    rules = [
        {"when": {"mode": "movie", "tod": "morning"}, "actions": []},
        {"when": {"mode": "movie"}, "actions": []},
        {"when": {"mode": "movie", "tod": "evening"}, "actions": []},
    ]
    result = resolve(rules, {"mode": "movie", "tod": "evening"}, conditions)
    assert result is not None
    assert result[0] == 1  # the wildcard rule comes before the specific evening rule


def test_unknown_condition_skips_rule(conditions: dict[str, FakeCondition]) -> None:
    rules = [
        {"when": {"mode": "movie", "unknown": "x"}, "actions": []},
        {"when": {"mode": "movie"}, "actions": []},
    ]
    result = resolve(rules, {"mode": "movie"}, conditions)
    assert result is not None
    assert result[0] == 1


def test_none_snapshot_skips_rule(conditions: dict[str, FakeCondition]) -> None:
    rules = [
        {"when": {"mode": "movie", "tod": "evening"}, "actions": []},
        {"when": {"mode": "movie"}, "actions": []},
    ]
    result = resolve(rules, {"mode": "movie", "tod": None}, conditions)
    assert result is not None
    assert result[0] == 1


def test_predicate_none_is_wildcard(conditions: dict[str, FakeCondition]) -> None:
    rules = [{"when": {"mode": "movie", "tod": None}, "actions": []}]
    result = resolve(rules, {"mode": "movie", "tod": "anything"}, conditions)
    assert result is not None


def test_missing_condition_skips_constrained_rule(
    conditions: dict[str, FakeCondition],
) -> None:
    # If a condition isn't in the conditions dict, a rule constraining it cannot match.
    no_mode = {k: v for k, v in conditions.items() if k != "mode"}
    rules = [
        {"when": {"mode": "movie"}, "actions": []},
        {"when": {}, "actions": []},
    ]
    result = resolve(rules, {"mode": "movie"}, no_mode)
    assert result is not None
    assert result[0] == 1


def test_engine_routes_through_script_condition() -> None:
    """A rule whose `when.script` predicate matches the script snapshot fires."""
    from custom_components.ambience.conditions.script import (
        ScriptCondition,
        ScriptSnapshot,
        _cache_key,
    )
    from custom_components.ambience.engine import resolve

    conditions = {"script": ScriptCondition()}
    key_yes = _cache_key("script.yes", {})
    key_no = _cache_key("script.no", {})
    snap = ScriptSnapshot(results={key_yes: True, key_no: False})

    rules = [
        {"name": "n", "when": {"script": {"script": "script.no"}}, "actions": []},
        {"name": "y", "when": {"script": {"script": "script.yes"}}, "actions": []},
    ]
    match = resolve(rules, {"script": snap}, conditions)
    assert match is not None
    idx, rule = match
    assert idx == 1
    assert rule["name"] == "y"
