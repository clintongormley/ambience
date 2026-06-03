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
    scenes = [
        {"name": "a", "when": {"mode": "night"}},
        {"name": "b", "when": {"mode": "day"}},
    ]
    snaps = {"mode": "day", "tod": None}
    explanation = evaluate_explained(scenes, snaps, conditions)
    assert explanation.winner_index == 1
    assert resolve(scenes, snaps, conditions) == (1, scenes[1])


def test_records_every_predicate_result(conditions: dict[str, FakeCondition]) -> None:
    scenes = [{"name": "a", "when": {"mode": "day", "tod": "morning"}}]
    snaps = {"mode": "day", "tod": "morning"}
    explanation = evaluate_explained(scenes, snaps, conditions, describe=True)
    scene_eval = explanation.scenes[0]
    assert scene_eval.matched is True
    assert [(p.condition_key, p.passed) for p in scene_eval.predicates] == [
        ("mode", True),
        ("tod", True),
    ]
    assert scene_eval.predicates[0].detail == "value=day"


def test_short_circuits_predicates_and_scenes(conditions: dict[str, FakeCondition]) -> None:
    scenes = [
        {"name": "a", "when": {"mode": "night", "tod": "morning"}},
        {"name": "b", "when": {"mode": "day"}},
        {"name": "c", "when": {"mode": "day"}},
    ]
    snaps = {"mode": "day", "tod": "morning"}
    explanation = evaluate_explained(scenes, snaps, conditions)
    # Scene a: first predicate fails -> only that predicate recorded.
    assert [p.condition_key for p in explanation.scenes[0].predicates] == ["mode"]
    assert explanation.scenes[0].evaluated is True
    assert explanation.scenes[0].matched is False
    # Scene b wins; scene c is never evaluated.
    assert explanation.winner_index == 1
    assert explanation.scenes[2].evaluated is False
    assert explanation.scenes[2].predicates == []


def test_missing_condition_or_snapshot_fails_scene(conditions: dict[str, FakeCondition]) -> None:
    scenes = [{"name": "a", "when": {"absent": "x"}}]
    explanation = evaluate_explained(scenes, {"absent": None}, conditions)
    assert explanation.winner_index is None
    pred = explanation.scenes[0].predicates[0]
    assert pred.passed is False
    assert pred.detail == "unavailable"


def test_no_match_returns_none(conditions: dict[str, FakeCondition]) -> None:
    scenes = [{"name": "a", "when": {"mode": "night"}}]
    explanation = evaluate_explained(scenes, {"mode": "day"}, conditions)
    assert explanation.winner_index is None
    assert resolve(scenes, {"mode": "day"}, conditions) is None


def test_disabled_scene_is_skipped_and_later_scene_wins(
    conditions: dict[str, FakeCondition],
) -> None:
    scenes = [
        {"name": "a", "when": {"mode": "day"}, "enabled": False},
        {"name": "b", "when": {"mode": "day"}},
    ]
    explanation = evaluate_explained(scenes, {"mode": "day"}, conditions)
    assert explanation.winner_index == 1
    assert resolve(scenes, {"mode": "day"}, conditions) == (1, scenes[1])


def test_disabled_scene_recorded_as_disabled(
    conditions: dict[str, FakeCondition],
) -> None:
    scenes = [{"name": "a", "when": {"mode": "day"}, "enabled": False}]
    explanation = evaluate_explained(scenes, {"mode": "day"}, conditions)
    scene_eval = explanation.scenes[0]
    assert scene_eval.disabled is True
    assert scene_eval.matched is False
    assert scene_eval.evaluated is False
    assert scene_eval.predicates == []
    assert explanation.winner_index is None


def test_enabled_scene_defaults_disabled_false(
    conditions: dict[str, FakeCondition],
) -> None:
    scenes = [{"name": "a", "when": {"mode": "day"}}]
    explanation = evaluate_explained(scenes, {"mode": "day"}, conditions)
    assert explanation.scenes[0].disabled is False
