"""UnavailableCondition — match when any listed entity is unavailable/unknown/absent."""

from __future__ import annotations

from datetime import UTC, datetime

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.unavailable import (
    UnavailableCondition,
    UnavailableSnapshot,
)
from custom_components.ambience.errors import AmbienceError
from custom_components.ambience.triggers import EMPTY


def _snap(present=None, names=None, now=None) -> UnavailableSnapshot:
    return UnavailableSnapshot(
        now=now or datetime(2026, 6, 15, 12, 0, tzinfo=UTC),
        present=present or {},
        names=names or {},
    )


def test_protocol_fields() -> None:
    m = UnavailableCondition()
    assert m.name == "unavailable"
    assert m.input == "unavailable_predicate"
    assert m.priority == 980
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


def test_matches_none_is_true() -> None:
    assert UnavailableCondition().matches(None, _snap()) is True


def test_matches_non_dict_is_false() -> None:
    assert UnavailableCondition().matches("x", _snap()) is False


def test_matches_true_when_one_entity_unavailable() -> None:
    snap = _snap({"binary_sensor.a": "on", "binary_sensor.b": "unavailable"})
    pred = {"entities": ["binary_sensor.a", "binary_sensor.b"]}
    assert UnavailableCondition().matches(pred, snap) is True


def test_matches_true_when_one_entity_unknown() -> None:
    snap = _snap({"binary_sensor.a": "unknown"})
    assert UnavailableCondition().matches({"entities": ["binary_sensor.a"]}, snap) is True


def test_matches_true_when_entity_absent() -> None:
    snap = _snap({"binary_sensor.a": "on"})  # b not present at all
    pred = {"entities": ["binary_sensor.a", "binary_sensor.ghost"]}
    assert UnavailableCondition().matches(pred, snap) is True


def test_matches_false_when_all_present_and_observable() -> None:
    snap = _snap({"binary_sensor.a": "on", "binary_sensor.b": "off"})
    pred = {"entities": ["binary_sensor.a", "binary_sensor.b"]}
    assert UnavailableCondition().matches(pred, snap) is False


def test_matches_empty_entities_is_false() -> None:
    assert UnavailableCondition().matches({"entities": []}, _snap()) is False


async def test_snapshot_reads_any_domain_and_records_absent_implicitly(
    hass: HomeAssistant,
) -> None:
    hass.states.async_set("binary_sensor.a", "on", {"friendly_name": "A"})
    hass.states.async_set("remote.b", "unavailable")
    snap = await UnavailableCondition().snapshot(
        hass, entities=frozenset({"binary_sensor.a", "remote.b", "light.ghost"})
    )
    assert snap.present == {"binary_sensor.a": "on", "remote.b": "unavailable"}
    assert "light.ghost" not in snap.present
    assert snap.names["binary_sensor.a"] == "A"


@pytest.mark.parametrize(
    "predicate,key",
    [
        ({"entities": []}, "unavailable_pick_entity"),
        ({"entities": "x"}, "unavailable_pick_entity"),
        ({}, "unavailable_pick_entity"),
        ({"entities": [""]}, "entity_id_invalid"),
        ({"entities": ["light."]}, "entity_id_invalid"),  # domain prefix alone
        ({"entities": ["light.Bad Id"]}, "entity_id_invalid"),
        ({"entities": [42]}, "entity_id_invalid"),
    ],
)
def test_validate_rejects_empty_and_bad(predicate, key) -> None:
    with pytest.raises(AmbienceError) as exc:
        UnavailableCondition().validate_predicate(predicate)
    assert exc.value.translation_key == key


def test_validate_accepts_none_and_valid() -> None:
    m = UnavailableCondition()
    m.validate_predicate(None)
    m.validate_predicate({"entities": ["binary_sensor.a", "light.b"]})


def test_trigger_deps_returns_entities() -> None:
    spec = UnavailableCondition().trigger_deps({"entities": ["binary_sensor.a", "light.b"]})
    assert spec.entities == frozenset({"binary_sensor.a", "light.b"})
    assert UnavailableCondition().trigger_deps(None) is EMPTY


def test_is_constraining() -> None:
    m = UnavailableCondition()
    assert m.is_constraining({"entities": ["binary_sensor.a"]}) is True
    assert m.is_constraining({"entities": []}) is False
    assert m.is_constraining(None) is False


def test_order_key() -> None:
    m = UnavailableCondition()
    assert m.order_key({"entities": ["binary_sensor.z", "binary_sensor.a"]}) == "binary_sensor.a"
    assert m.order_key(None) == ""


def test_contains_subset() -> None:
    m = UnavailableCondition()
    outer = {"entities": ["binary_sensor.a", "binary_sensor.b"]}
    inner = {"entities": ["binary_sensor.a"]}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False
    assert m.contains({"entities": []}, inner) is False


def test_describe_marks_each_entity() -> None:
    snap = _snap(
        {"binary_sensor.a": "on", "binary_sensor.b": "unavailable"},
        names={"binary_sensor.a": "A", "binary_sensor.b": "B"},
    )
    out = UnavailableCondition().describe(
        snap, {"entities": ["binary_sensor.a", "binary_sensor.b"]}
    )
    assert "A: on ✗" in out
    assert "B: unavailable ✓" in out


def test_describe_marks_absent_entity_as_missing() -> None:
    snap = _snap({"binary_sensor.a": "on"}, names={"binary_sensor.a": "A"})
    out = UnavailableCondition().describe(snap, {"entities": ["binary_sensor.a", "light.ghost"]})
    assert "A: on ✗" in out
    assert "light.ghost: missing ✓" in out


def test_describe_snapshot_summary() -> None:
    snap = _snap({"binary_sensor.a": "on", "binary_sensor.b": "unavailable"})
    out = UnavailableCondition().describe(snap)
    assert "1 of 2 unavailable" in out


def test_describe_snapshot_all_available() -> None:
    snap = _snap({"binary_sensor.a": "on", "binary_sensor.b": "off"})
    out = UnavailableCondition().describe(snap)
    assert out == "0 of 2 unavailable"


def test_describe_snapshot_empty() -> None:
    out = UnavailableCondition().describe(_snap())
    assert out == "no entities"


def test_describe_non_dict_predicate_is_none() -> None:
    assert UnavailableCondition().describe(_snap(), "not-a-dict") is None


def test_describe_empty_entities_predicate() -> None:
    assert UnavailableCondition().describe(_snap(), {"entities": []}) == "no entities"


def test_validate_rejects_non_dict() -> None:
    with pytest.raises(AmbienceError) as exc:
        UnavailableCondition().validate_predicate("not-a-dict")
    assert exc.value.translation_key == "unavailable_malformed"


def test_trigger_deps_empty_entities_list_is_empty() -> None:
    assert UnavailableCondition().trigger_deps({"entities": []}) is EMPTY


def test_contains_non_dict_is_false() -> None:
    m = UnavailableCondition()
    assert m.contains("x", {"entities": ["binary_sensor.a"]}) is False
    assert m.contains({"entities": ["binary_sensor.a"]}, "x") is False
