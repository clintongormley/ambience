"""scope_triggers — enumerate a scope's watches, filter disabled ones."""

from __future__ import annotations

from typing import Any

from custom_components.ambience.scope_triggers import (
    filter_spec,
    scope_trigger_spec,
    trigger_descriptors,
)
from custom_components.ambience.triggers import EMPTY, TriggerSpec


# --- trigger_descriptors ----------------------------------------------------


def test_descriptors_empty_spec_is_empty() -> None:
    assert trigger_descriptors(EMPTY) == []


def test_descriptors_entity_rows_sorted_with_keys() -> None:
    spec = TriggerSpec(entities=frozenset({"binary_sensor.motion", "person.bob"}))
    rows = trigger_descriptors(spec)
    assert rows == [
        {
            "key": "entity:binary_sensor.motion",
            "kind": "entity",
            "entity_id": "binary_sensor.motion",
        },
        {"key": "entity:person.bob", "kind": "entity", "entity_id": "person.bob"},
    ]


def test_descriptors_clock_sun_rollover_hastime() -> None:
    spec = TriggerSpec(
        clock_times=frozenset({(18, 0), (6, 30)}),
        sun_events=frozenset({("sunset", 30), ("sunrise", -15)}),
        date_rollover=True,
        has_time=True,
    )
    rows = trigger_descriptors(spec)
    assert {"key": "clock:06:30", "kind": "clock", "hour": 6, "minute": 30} in rows
    assert {"key": "clock:18:00", "kind": "clock", "hour": 18, "minute": 0} in rows
    assert {"key": "sun:sunrise:-15", "kind": "sun", "anchor": "sunrise", "offset": -15} in rows
    assert {"key": "sun:sunset:30", "kind": "sun", "anchor": "sunset", "offset": 30} in rows
    assert {"key": "date_rollover", "kind": "date_rollover"} in rows
    assert {"key": "has_time", "kind": "has_time"} in rows
    # clock rows are sorted ascending
    clock_keys = [r["key"] for r in rows if r["kind"] == "clock"]
    assert clock_keys == ["clock:06:30", "clock:18:00"]


def test_descriptors_opaque_is_not_a_row() -> None:
    assert trigger_descriptors(TriggerSpec(opaque=True)) == []


# --- filter_spec ------------------------------------------------------------


def test_filter_drops_disabled_entity_and_its_duration() -> None:
    spec = TriggerSpec(
        entities=frozenset({"binary_sensor.motion", "person.bob"}),
        entity_durations=frozenset({("binary_sensor.motion", 60.0), ("person.bob", 5.0)}),
    )
    out = filter_spec(spec, {"entity:binary_sensor.motion"})
    assert out.entities == frozenset({"person.bob"})
    assert out.entity_durations == frozenset({("person.bob", 5.0)})


def test_filter_drops_clock_and_sun() -> None:
    spec = TriggerSpec(
        clock_times=frozenset({(18, 0), (6, 30)}),
        sun_events=frozenset({("sunset", 30), ("sunrise", -15)}),
    )
    out = filter_spec(spec, {"clock:18:00", "sun:sunrise:-15"})
    assert out.clock_times == frozenset({(6, 30)})
    assert out.sun_events == frozenset({("sunset", 30)})


def test_filter_clears_rollover_and_hastime_keeps_opaque() -> None:
    spec = TriggerSpec(date_rollover=True, has_time=True, opaque=True)
    out = filter_spec(spec, {"date_rollover", "has_time"})
    assert out.date_rollover is False
    assert out.has_time is False
    assert out.opaque is True


def test_filter_no_disabled_is_identity() -> None:
    spec = TriggerSpec(entities=frozenset({"a.b"}), has_time=True)
    assert filter_spec(spec, set()) == spec


# --- scope_trigger_spec -----------------------------------------------------


class _FakeMatcher:
    def __init__(self, spec: TriggerSpec | None) -> None:
        self._spec = spec

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return self._spec


class _NoDepsMatcher:
    """A matcher with no trigger_deps method -> opaque."""


def test_scope_spec_merges_across_rules() -> None:
    matchers = {
        "state": _FakeMatcher(TriggerSpec(entities=frozenset({"binary_sensor.motion"}))),
        "people": _FakeMatcher(TriggerSpec(entities=frozenset({"person.bob"}))),
    }
    cfg = {
        "rules": [
            {"when": {"state": {"x": 1}}},
            {"when": {"people": {"y": 2}}},
        ]
    }
    spec = scope_trigger_spec(matchers, cfg)
    assert spec.entities == frozenset({"binary_sensor.motion", "person.bob"})


def test_scope_spec_skips_wildcard_and_unknown_matcher() -> None:
    matchers = {"state": _FakeMatcher(TriggerSpec(entities=frozenset({"a.b"})))}
    cfg = {
        "rules": [
            {"when": {"state": None, "ghost": {"z": 1}}},  # wildcard + unknown
            {"when": {"state": {"x": 1}}},
        ]
    }
    spec = scope_trigger_spec(matchers, cfg)
    assert spec.entities == frozenset({"a.b"})


def test_scope_spec_missing_trigger_deps_is_opaque() -> None:
    matchers = {"script": _NoDepsMatcher()}
    cfg = {"rules": [{"when": {"script": {"script": "script.s"}}}]}
    spec = scope_trigger_spec(matchers, cfg)
    assert spec.opaque is True
