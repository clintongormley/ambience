"""scope_triggers — merge a scope's scene predicates into one TriggerSpec."""

from __future__ import annotations

from typing import Any

from custom_components.ambience.scope_triggers import (
    GROUP_DOMAIN_KEY,
    iter_predicate_specs,
    referenced_entities,
    scope_trigger_spec,
    trigger_descriptors,
)
from custom_components.ambience.triggers import EMPTY, TriggerSpec

# --- trigger_descriptors (read-only rows for the Auto-triggers display) ------


def test_descriptors_empty_spec_is_empty() -> None:
    assert trigger_descriptors(EMPTY) == []


def test_descriptors_entity_rows_sorted_with_keys() -> None:
    spec = TriggerSpec(entities=frozenset({"binary_sensor.motion", "person.bob"}))
    assert trigger_descriptors(spec) == [
        {
            "key": "entity:binary_sensor.motion",
            "kind": "entity",
            "entity_id": "binary_sensor.motion",
        },
        {"key": "entity:person.bob", "kind": "entity", "entity_id": "person.bob"},
    ]


def test_descriptors_time_group_collects_clocks_periodic_and_rollover() -> None:
    spec = TriggerSpec(clock_times=frozenset({(18, 0), (6, 30)}), has_time=True, date_rollover=True)
    assert trigger_descriptors(spec) == [
        {
            "key": "group:time",
            "kind": "time",
            "clocks": [{"hour": 6, "minute": 30}, {"hour": 18, "minute": 0}],
            "has_time": True,
            "date_rollover": True,
        }
    ]


def test_descriptors_date_rollover_only_is_a_time_group() -> None:
    rows = trigger_descriptors(TriggerSpec(date_rollover=True))
    assert [r["kind"] for r in rows] == ["time"]
    assert rows[0]["date_rollover"] is True
    assert rows[0]["clocks"] == []


def test_descriptors_sun_group_collects_events_only() -> None:
    spec = TriggerSpec(sun_events=frozenset({("sunset", 30), ("sunrise", -15)}))
    assert trigger_descriptors(spec) == [
        {
            "key": "group:sun",
            "kind": "sun",
            "suns": [{"anchor": "sunrise", "offset": -15}, {"anchor": "sunset", "offset": 30}],
        }
    ]


def test_trigger_descriptors_emit_a_domain_row_after_sun() -> None:
    spec = TriggerSpec(entities=frozenset({"person.a"}), domains=frozenset({"person"}))
    rows = trigger_descriptors(spec)
    assert [r["kind"] for r in rows] == ["entity", "domain"]
    assert rows[1] == {"key": GROUP_DOMAIN_KEY, "kind": "domain", "domains": ["person"]}


def test_descriptors_order_entities_then_time_then_sun_then_domain() -> None:
    spec = TriggerSpec(
        entities=frozenset({"person.bob"}),
        clock_times=frozenset({(7, 0)}),
        sun_events=frozenset({("dusk", 0)}),
        domains=frozenset({"person"}),
    )
    assert [r["kind"] for r in trigger_descriptors(spec)] == ["entity", "time", "sun", "domain"]


def test_descriptors_no_time_group_when_no_clocks_or_periodic() -> None:
    spec = TriggerSpec(entities=frozenset({"a.b"}))
    assert [r["kind"] for r in trigger_descriptors(spec)] == ["entity"]


def test_descriptors_opaque_is_not_a_row() -> None:
    assert trigger_descriptors(TriggerSpec(opaque=True)) == []


# --- scope_trigger_spec -----------------------------------------------------


class _FakeCondition:
    def __init__(self, spec: TriggerSpec | None) -> None:
        self._spec = spec

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return self._spec


class _NoDepsCondition:
    """A condition with no trigger_deps method -> opaque."""


class _FakeFromPredicate:
    """A condition whose trigger_deps reads the entities from the predicate's
    ``sensors`` list (mirrors how lux/occupancy derive their watch-set)."""

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return TriggerSpec(entities=frozenset(predicate.get("sensors", [])))


def test_scope_spec_merges_across_scenes() -> None:
    conditions = {
        "state": _FakeCondition(TriggerSpec(entities=frozenset({"binary_sensor.motion"}))),
        "people": _FakeCondition(TriggerSpec(entities=frozenset({"person.bob"}))),
    }
    cfg = {
        "scenes": [
            {"when": {"state": {"x": 1}}},
            {"when": {"people": {"y": 2}}},
        ]
    }
    spec = scope_trigger_spec(conditions, cfg)
    assert spec.entities == frozenset({"binary_sensor.motion", "person.bob"})


def test_scope_spec_skips_wildcard_and_unknown_condition() -> None:
    conditions = {"state": _FakeCondition(TriggerSpec(entities=frozenset({"a.b"})))}
    cfg = {
        "scenes": [
            {"when": {"state": None, "ghost": {"z": 1}}},  # wildcard + unknown
            {"when": {"state": {"x": 1}}},
        ]
    }
    spec = scope_trigger_spec(conditions, cfg)
    assert spec.entities == frozenset({"a.b"})


def test_scope_spec_missing_trigger_deps_is_opaque() -> None:
    conditions = {"script": _NoDepsCondition()}
    cfg = {"scenes": [{"when": {"script": {"script": "script.s"}}}]}
    spec = scope_trigger_spec(conditions, cfg)
    assert spec.opaque is True


def test_scope_spec_skips_disabled_scene() -> None:
    """A scene with ``enabled: False`` contributes no watches — a disabled scene
    can never win, so its predicates must not wake the scope."""
    conditions = {
        "state": _FakeCondition(TriggerSpec(entities=frozenset({"binary_sensor.motion"})))
    }
    cfg = {"scenes": [{"enabled": False, "when": {"state": {"x": 1}}}]}
    spec = scope_trigger_spec(conditions, cfg)
    assert spec.entities == frozenset()


def test_scope_spec_disabled_scene_excluded_enabled_kept() -> None:
    conditions = {
        "state": _FakeCondition(TriggerSpec(entities=frozenset({"binary_sensor.motion"}))),
        "people": _FakeCondition(TriggerSpec(entities=frozenset({"person.bob"}))),
    }
    cfg = {
        "scenes": [
            {"enabled": False, "when": {"state": {"x": 1}}},
            {"when": {"people": {"y": 2}}},
        ]
    }
    spec = scope_trigger_spec(conditions, cfg)
    assert spec.entities == frozenset({"person.bob"})


def test_iter_predicate_specs_skips_disabled_keeps_scene_index() -> None:
    """``iter_predicate_specs`` skips disabled scenes entirely; the scene_index of
    surviving scenes stays aligned with their position in ``cfg['scenes']``."""
    conditions = {
        "state": _FakeCondition(TriggerSpec(entities=frozenset({"binary_sensor.motion"}))),
        "people": _FakeCondition(TriggerSpec(entities=frozenset({"person.bob"}))),
    }
    cfg = {
        "scenes": [
            {"enabled": False, "when": {"state": {"x": 1}}},
            {"when": {"people": {"y": 2}}},
        ]
    }
    out = list(iter_predicate_specs(conditions, cfg))
    assert [(idx, key) for idx, key, _ in out] == [(1, "people")]


# --- referenced_entities ----------------------------------------------------


def test_referenced_entities_unions_per_condition_across_scenes_and_scopes() -> None:
    conditions = {
        "lux": _FakeCondition(TriggerSpec(entities=frozenset({"sensor.lounge"}))),
        "people": _FakeCondition(TriggerSpec(entities=frozenset({"person.bob"}))),
    }
    cfg_a = {"scenes": [{"when": {"lux": {"x": 1}}}]}
    cfg_b = {"scenes": [{"when": {"lux": {"y": 2}}}, {"when": {"people": {"z": 3}}}]}
    # Different scopes contribute different scenes; the same condition unions.
    by_condition = referenced_entities(conditions, [cfg_a, cfg_b])
    assert by_condition == {
        "lux": frozenset({"sensor.lounge"}),
        "people": frozenset({"person.bob"}),
    }


def test_referenced_entities_unions_distinct_entities_for_same_condition() -> None:
    # Two lux scenes naming different sensors -> the union of both. A realistic
    # condition derives its entities from the predicate, so use a stub that does.
    cond = _FakeFromPredicate()
    cfg = {
        "scenes": [
            {"when": {"lux": {"sensors": ["sensor.a"]}}},
            {"when": {"lux": {"sensors": ["sensor.b"]}}},
        ]
    }
    assert referenced_entities({"lux": cond}, [cfg]) == {"lux": frozenset({"sensor.a", "sensor.b"})}


def test_referenced_entities_excludes_disabled_scenes() -> None:
    conditions = {"lux": _FakeCondition(TriggerSpec(entities=frozenset({"sensor.lounge"})))}
    cfg = {"scenes": [{"enabled": False, "when": {"lux": {"x": 1}}}]}
    assert referenced_entities(conditions, [cfg]) == {}


def test_referenced_entities_omits_conditions_with_no_entity_refs() -> None:
    # A condition whose trigger_deps carries no entities (e.g. a wildcard lux
    # predicate) is absent from the result — callers treat absent as "nothing".
    conditions = {"lux": _FakeCondition(TriggerSpec(entities=frozenset()))}
    cfg = {"scenes": [{"when": {"lux": {"sensors": []}}}]}
    assert referenced_entities(conditions, [cfg]) == {}
