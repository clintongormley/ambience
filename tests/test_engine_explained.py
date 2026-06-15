"""Explained evaluation: the trace primitive. Pure, no HA."""

from __future__ import annotations

from typing import Any

import pytest

from custom_components.ambience.engine import evaluate_explained, resolve


class FakeCondition:
    """Matches when predicate == snapshot; describe echoes the snapshot.

    Deliberately omits the optional `trigger_deps` — tracing must tolerate that
    (see test_condition_without_trigger_deps_yields_empty_entity_ids)."""

    def __init__(self, name: str) -> None:
        self.name = name

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate == snapshot

    def describe(self, snapshot: Any, predicate=None) -> str | None:
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


def test_detail_is_scoped_to_the_scene_predicate_not_the_shared_snapshot() -> None:
    """Regression: a scene referencing one sensor must get a verdict for THAT
    sensor, not a dump of every sensor in the shared per-condition snapshot."""
    from datetime import UTC, datetime

    from custom_components.ambience.conditions.occupancy import (
        OccupancyCondition,
        OccupancySnapshot,
    )

    changed = datetime(2026, 5, 25, 11, 0, tzinfo=UTC)
    # The shared snapshot is the union of sensors across ALL scenes (here 3).
    snap = OccupancySnapshot(
        now=datetime(2026, 5, 25, 12, 0, tzinfo=UTC),
        sensors={
            "binary_sensor.bed": ("off", changed),
            "binary_sensor.lounge": ("on", changed),
            "binary_sensor.bath": ("on", changed),
        },
        names={
            "binary_sensor.bed": "Bedroom 1 Bed Presence",
            "binary_sensor.lounge": "Lounge",
            "binary_sensor.bath": "Bathroom",
        },
    )
    scenes = [{"name": "Bed mode", "when": {"occupancy": {"sensors": ["binary_sensor.bed"]}}}]
    explanation = evaluate_explained(
        scenes, {"occupancy": snap}, {"occupancy": OccupancyCondition()}, describe=True
    )
    detail = explanation.scenes[0].predicates[0].detail
    # Only the referenced sensor — no "1 of 3 active (Lounge, Bathroom)" pool dump.
    assert detail == "Bedroom 1 Bed Presence: off ✗"


def test_records_entity_ids_from_trigger_deps_when_describing() -> None:
    """Each described predicate carries the entity_ids its condition references,
    sourced from the condition's own trigger_deps — so the trace can link them."""
    from datetime import UTC, datetime

    from custom_components.ambience.conditions.occupancy import (
        OccupancyCondition,
        OccupancySnapshot,
    )

    changed = datetime(2026, 5, 25, 11, 0, tzinfo=UTC)
    snap = OccupancySnapshot(
        now=datetime(2026, 5, 25, 12, 0, tzinfo=UTC),
        sensors={
            "binary_sensor.bed": ("off", changed),
            "binary_sensor.bath": ("on", changed),
        },
        names={"binary_sensor.bed": "Bed", "binary_sensor.bath": "Bath"},
    )
    scenes = [
        {
            "name": "Two sensors",
            "when": {"occupancy": {"sensors": ["binary_sensor.bath", "binary_sensor.bed"]}},
        }
    ]
    explanation = evaluate_explained(
        scenes, {"occupancy": snap}, {"occupancy": OccupancyCondition()}, describe=True
    )
    pred = explanation.scenes[0].predicates[0]
    # Sorted for deterministic output (trigger_deps returns an unordered set).
    assert pred.entity_ids == ("binary_sensor.bath", "binary_sensor.bed")


def test_condition_without_trigger_deps_yields_empty_entity_ids() -> None:
    """`trigger_deps` is an optional condition method (see protocols.py); a
    condition that omits it must trace as having no linkable entities, not crash."""

    class NoDeps:
        def matches(self, predicate: Any, snapshot: Any) -> bool:
            return predicate == snapshot

        def describe(self, snapshot: Any, predicate: Any = None) -> str | None:
            return f"value={snapshot}"

    scenes = [{"name": "a", "when": {"mode": "day"}}]
    explanation = evaluate_explained(scenes, {"mode": "day"}, {"mode": NoDeps()}, describe=True)
    pred = explanation.scenes[0].predicates[0]
    assert pred.passed is True
    assert pred.entity_ids == ()


def test_skips_trigger_deps_lookup_when_predicate_has_no_detail() -> None:
    """A predicate with no detail has nothing to link, so the (sometimes
    expensive — e.g. a template re-render) trigger_deps lookup is skipped even
    while tracing. The always-on trace path makes this matter in production."""
    from custom_components.ambience.triggers import TriggerSpec

    calls: list[Any] = []

    class NoDetail:
        def matches(self, predicate: Any, snapshot: Any) -> bool:
            return True

        def describe(self, snapshot: Any, predicate: Any = None) -> str | None:
            return None  # like template/script — never rendered

        def trigger_deps(self, predicate: Any) -> TriggerSpec:
            calls.append(predicate)  # would be the expensive call
            return TriggerSpec(entities=frozenset({"sensor.x"}))

    scenes = [{"name": "a", "when": {"tmpl": {"template": "{{ true }}"}}}]
    explanation = evaluate_explained(
        scenes, {"tmpl": object()}, {"tmpl": NoDetail()}, describe=True
    )
    pred = explanation.scenes[0].predicates[0]
    assert pred.entity_ids == ()
    assert calls == []  # trigger_deps never invoked — nothing to link


def test_entity_ids_empty_when_not_describing(conditions: dict[str, FakeCondition]) -> None:
    """entity_ids is trace-only; the hot path (describe=False) leaves it empty
    and never calls trigger_deps."""
    scenes = [{"name": "a", "when": {"mode": "day"}}]
    explanation = evaluate_explained(scenes, {"mode": "day"}, conditions)
    assert explanation.scenes[0].predicates[0].entity_ids == ()


def test_unavailable_predicate_has_no_entity_ids(conditions: dict[str, FakeCondition]) -> None:
    scenes = [{"name": "a", "when": {"absent": "x"}}]
    explanation = evaluate_explained(scenes, {"absent": None}, conditions, describe=True)
    pred = explanation.scenes[0].predicates[0]
    assert pred.detail == "unavailable"
    assert pred.entity_ids == ()


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


def test_trace_records_unconfigured_reason() -> None:
    from datetime import date

    from custom_components.ambience.conditions.day import DayCondition, DaySnapshot

    day = DayCondition()  # hass=None → _day_config() reports no workday sensor
    snap = DaySnapshot(
        today=date(2026, 6, 15),
        weekday=0,
        days_in_month=30,
        workday_state=None,
        month_workdays=None,
    )
    scenes = [
        {"when": {"day": {"include": [{"kind": "workday"}]}}, "actions": []},
        {"when": {}, "actions": []},
    ]
    explanation = evaluate_explained(scenes, {"day": snap}, {"day": day}, describe=True)
    p0 = explanation.scenes[0].predicates[0]
    assert p0.passed is False
    assert "workday sensor" in (p0.detail or "")
    assert explanation.winner_index == 1
