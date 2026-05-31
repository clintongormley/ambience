"""Explained evaluation: the trace primitive. Pure, no HA."""

from __future__ import annotations

from typing import Any

import pytest

from custom_components.ambience.engine import evaluate_explained, resolve


class FakeMatcher:
    """Matches when predicate == snapshot; describe echoes the snapshot."""

    def __init__(self, name: str) -> None:
        self.name = name

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate == snapshot

    def describe(self, snapshot: Any) -> str | None:
        return f"value={snapshot}"


@pytest.fixture
def matchers() -> dict[str, FakeMatcher]:
    return {"mode": FakeMatcher("mode"), "tod": FakeMatcher("tod")}


def test_winner_index_matches_resolve(matchers: dict[str, FakeMatcher]) -> None:
    rules = [
        {"name": "a", "when": {"mode": "night"}},
        {"name": "b", "when": {"mode": "day"}},
    ]
    snaps = {"mode": "day", "tod": None}
    explanation = evaluate_explained(rules, snaps, matchers)
    assert explanation.winner_index == 1
    assert resolve(rules, snaps, matchers) == (1, rules[1])


def test_records_every_predicate_result(matchers: dict[str, FakeMatcher]) -> None:
    rules = [{"name": "a", "when": {"mode": "day", "tod": "morning"}}]
    snaps = {"mode": "day", "tod": "morning"}
    explanation = evaluate_explained(rules, snaps, matchers, describe=True)
    rule_eval = explanation.rules[0]
    assert rule_eval.matched is True
    assert [(p.matcher_key, p.passed) for p in rule_eval.predicates] == [
        ("mode", True),
        ("tod", True),
    ]
    assert rule_eval.predicates[0].detail == "value=day"


def test_short_circuits_predicates_and_rules(matchers: dict[str, FakeMatcher]) -> None:
    rules = [
        {"name": "a", "when": {"mode": "night", "tod": "morning"}},
        {"name": "b", "when": {"mode": "day"}},
        {"name": "c", "when": {"mode": "day"}},
    ]
    snaps = {"mode": "day", "tod": "morning"}
    explanation = evaluate_explained(rules, snaps, matchers)
    # Rule a: first predicate fails -> only that predicate recorded.
    assert [p.matcher_key for p in explanation.rules[0].predicates] == ["mode"]
    assert explanation.rules[0].evaluated is True
    assert explanation.rules[0].matched is False
    # Rule b wins; rule c is never evaluated.
    assert explanation.winner_index == 1
    assert explanation.rules[2].evaluated is False
    assert explanation.rules[2].predicates == []


def test_missing_matcher_or_snapshot_fails_rule(matchers: dict[str, FakeMatcher]) -> None:
    rules = [{"name": "a", "when": {"absent": "x"}}]
    explanation = evaluate_explained(rules, {"absent": None}, matchers)
    assert explanation.winner_index is None
    pred = explanation.rules[0].predicates[0]
    assert pred.passed is False
    assert pred.detail == "unavailable"


def test_no_match_returns_none(matchers: dict[str, FakeMatcher]) -> None:
    rules = [{"name": "a", "when": {"mode": "night"}}]
    explanation = evaluate_explained(rules, {"mode": "day"}, matchers)
    assert explanation.winner_index is None
    assert resolve(rules, {"mode": "day"}, matchers) is None
