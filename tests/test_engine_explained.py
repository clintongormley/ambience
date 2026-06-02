"""Explained evaluation: the trace primitive. Pure, no HA."""

from __future__ import annotations

from typing import Any

import pytest

from custom_components.ambience.engine import evaluate_explained, resolve


class FakeCondition:
    """Matches when predicate == snapshot; describe echoes the snapshot."""

    def __init__(self, name: str) -> None:
        self.name = name

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate == snapshot

    def describe(self, snapshot: Any) -> str | None:
        return f"value={snapshot}"


@pytest.fixture
def conditions() -> dict[str, FakeCondition]:
    return {"mode": FakeCondition("mode"), "tod": FakeCondition("tod")}


def test_winner_index_matches_resolve(conditions: dict[str, FakeCondition]) -> None:
    rules = [
        {"name": "a", "when": {"mode": "night"}},
        {"name": "b", "when": {"mode": "day"}},
    ]
    snaps = {"mode": "day", "tod": None}
    explanation = evaluate_explained(rules, snaps, conditions)
    assert explanation.winner_index == 1
    assert resolve(rules, snaps, conditions) == (1, rules[1])


def test_records_every_predicate_result(conditions: dict[str, FakeCondition]) -> None:
    rules = [{"name": "a", "when": {"mode": "day", "tod": "morning"}}]
    snaps = {"mode": "day", "tod": "morning"}
    explanation = evaluate_explained(rules, snaps, conditions, describe=True)
    rule_eval = explanation.rules[0]
    assert rule_eval.matched is True
    assert [(p.condition_key, p.passed) for p in rule_eval.predicates] == [
        ("mode", True),
        ("tod", True),
    ]
    assert rule_eval.predicates[0].detail == "value=day"


def test_short_circuits_predicates_and_rules(conditions: dict[str, FakeCondition]) -> None:
    rules = [
        {"name": "a", "when": {"mode": "night", "tod": "morning"}},
        {"name": "b", "when": {"mode": "day"}},
        {"name": "c", "when": {"mode": "day"}},
    ]
    snaps = {"mode": "day", "tod": "morning"}
    explanation = evaluate_explained(rules, snaps, conditions)
    # Rule a: first predicate fails -> only that predicate recorded.
    assert [p.condition_key for p in explanation.rules[0].predicates] == ["mode"]
    assert explanation.rules[0].evaluated is True
    assert explanation.rules[0].matched is False
    # Rule b wins; rule c is never evaluated.
    assert explanation.winner_index == 1
    assert explanation.rules[2].evaluated is False
    assert explanation.rules[2].predicates == []


def test_missing_condition_or_snapshot_fails_rule(conditions: dict[str, FakeCondition]) -> None:
    rules = [{"name": "a", "when": {"absent": "x"}}]
    explanation = evaluate_explained(rules, {"absent": None}, conditions)
    assert explanation.winner_index is None
    pred = explanation.rules[0].predicates[0]
    assert pred.passed is False
    assert pred.detail == "unavailable"


def test_no_match_returns_none(conditions: dict[str, FakeCondition]) -> None:
    rules = [{"name": "a", "when": {"mode": "night"}}]
    explanation = evaluate_explained(rules, {"mode": "day"}, conditions)
    assert explanation.winner_index is None
    assert resolve(rules, {"mode": "day"}, conditions) is None


def test_disabled_rule_is_skipped_and_later_rule_wins(
    conditions: dict[str, FakeCondition],
) -> None:
    rules = [
        {"name": "a", "when": {"mode": "day"}, "enabled": False},
        {"name": "b", "when": {"mode": "day"}},
    ]
    explanation = evaluate_explained(rules, {"mode": "day"}, conditions)
    assert explanation.winner_index == 1
    assert resolve(rules, {"mode": "day"}, conditions) == (1, rules[1])


def test_disabled_rule_recorded_as_disabled(
    conditions: dict[str, FakeCondition],
) -> None:
    rules = [{"name": "a", "when": {"mode": "day"}, "enabled": False}]
    explanation = evaluate_explained(rules, {"mode": "day"}, conditions)
    rule_eval = explanation.rules[0]
    assert rule_eval.disabled is True
    assert rule_eval.matched is False
    assert rule_eval.evaluated is False
    assert rule_eval.predicates == []
    assert explanation.winner_index is None


def test_enabled_rule_defaults_disabled_false(
    conditions: dict[str, FakeCondition],
) -> None:
    rules = [{"name": "a", "when": {"mode": "day"}}]
    explanation = evaluate_explained(rules, {"mode": "day"}, conditions)
    assert explanation.rules[0].disabled is False
