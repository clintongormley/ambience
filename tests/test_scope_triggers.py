"""scope_triggers — merge a scope's scene predicates into one TriggerSpec."""

from __future__ import annotations

from typing import Any

from custom_components.ambience.scope_triggers import (
    iter_predicate_specs,
    referenced_entities,
    scope_trigger_spec,
)
from custom_components.ambience.triggers import TriggerSpec

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
