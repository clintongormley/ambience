"""scope_triggers — merge a scope's rule predicates into one TriggerSpec."""

from __future__ import annotations

from typing import Any

from custom_components.ambience.scope_triggers import iter_predicate_specs, scope_trigger_spec
from custom_components.ambience.triggers import TriggerSpec

# --- scope_trigger_spec -----------------------------------------------------


class _FakeCondition:
    def __init__(self, spec: TriggerSpec | None) -> None:
        self._spec = spec

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return self._spec


class _NoDepsCondition:
    """A condition with no trigger_deps method -> opaque."""


def test_scope_spec_merges_across_rules() -> None:
    conditions = {
        "state": _FakeCondition(TriggerSpec(entities=frozenset({"binary_sensor.motion"}))),
        "people": _FakeCondition(TriggerSpec(entities=frozenset({"person.bob"}))),
    }
    cfg = {
        "rules": [
            {"when": {"state": {"x": 1}}},
            {"when": {"people": {"y": 2}}},
        ]
    }
    spec = scope_trigger_spec(conditions, cfg)
    assert spec.entities == frozenset({"binary_sensor.motion", "person.bob"})


def test_scope_spec_skips_wildcard_and_unknown_condition() -> None:
    conditions = {"state": _FakeCondition(TriggerSpec(entities=frozenset({"a.b"})))}
    cfg = {
        "rules": [
            {"when": {"state": None, "ghost": {"z": 1}}},  # wildcard + unknown
            {"when": {"state": {"x": 1}}},
        ]
    }
    spec = scope_trigger_spec(conditions, cfg)
    assert spec.entities == frozenset({"a.b"})


def test_scope_spec_missing_trigger_deps_is_opaque() -> None:
    conditions = {"script": _NoDepsCondition()}
    cfg = {"rules": [{"when": {"script": {"script": "script.s"}}}]}
    spec = scope_trigger_spec(conditions, cfg)
    assert spec.opaque is True


def test_scope_spec_skips_disabled_rule() -> None:
    """A rule with ``enabled: False`` contributes no watches — a disabled rule
    can never win, so its predicates must not wake the scope."""
    conditions = {
        "state": _FakeCondition(TriggerSpec(entities=frozenset({"binary_sensor.motion"})))
    }
    cfg = {"rules": [{"enabled": False, "when": {"state": {"x": 1}}}]}
    spec = scope_trigger_spec(conditions, cfg)
    assert spec.entities == frozenset()


def test_scope_spec_disabled_rule_excluded_enabled_kept() -> None:
    conditions = {
        "state": _FakeCondition(TriggerSpec(entities=frozenset({"binary_sensor.motion"}))),
        "people": _FakeCondition(TriggerSpec(entities=frozenset({"person.bob"}))),
    }
    cfg = {
        "rules": [
            {"enabled": False, "when": {"state": {"x": 1}}},
            {"when": {"people": {"y": 2}}},
        ]
    }
    spec = scope_trigger_spec(conditions, cfg)
    assert spec.entities == frozenset({"person.bob"})


def test_iter_predicate_specs_skips_disabled_keeps_rule_index() -> None:
    """``iter_predicate_specs`` skips disabled rules entirely; the rule_index of
    surviving rules stays aligned with their position in ``cfg['rules']``."""
    conditions = {
        "state": _FakeCondition(TriggerSpec(entities=frozenset({"binary_sensor.motion"}))),
        "people": _FakeCondition(TriggerSpec(entities=frozenset({"person.bob"}))),
    }
    cfg = {
        "rules": [
            {"enabled": False, "when": {"state": {"x": 1}}},
            {"when": {"people": {"y": 2}}},
        ]
    }
    out = list(iter_predicate_specs(conditions, cfg))
    assert [(idx, key) for idx, key, _ in out] == [(1, "people")]
