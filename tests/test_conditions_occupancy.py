"""OccupancyCondition — presence/occupancy binary_sensors, with optional `for`."""

from __future__ import annotations

from datetime import UTC, datetime

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.occupancy import (
    OccupancyCondition,
    OccupancySnapshot,
)


def _snap(sensors=None, now=None, names=None) -> OccupancySnapshot:
    return OccupancySnapshot(
        now=now or datetime(2026, 5, 25, 12, 0, tzinfo=UTC),
        sensors=sensors or {},
        names=names or {},
    )


def _s(state: str) -> tuple[str, datetime]:
    return (state, datetime(2026, 5, 25, 11, 0, tzinfo=UTC))


def test_protocol_fields() -> None:
    m = OccupancyCondition()
    assert m.name == "occupancy"
    assert m.input == "occupancy_predicate"
    assert m.priority == 915
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


async def test_snapshot_captures_only_binary_sensors(hass: HomeAssistant) -> None:
    hass.states.async_set("binary_sensor.lounge", "on", {"friendly_name": "Lounge"})
    hass.states.async_set("light.x", "on")
    snap = await OccupancyCondition().snapshot(hass)
    assert snap.sensors["binary_sensor.lounge"][0] == "on"
    assert isinstance(snap.sensors["binary_sensor.lounge"][1], datetime)
    assert snap.names["binary_sensor.lounge"] == "Lounge"
    assert "light.x" not in snap.sensors


def test_matches_none_is_true() -> None:
    assert OccupancyCondition().matches(None, _snap()) is True


def test_matches_empty_sensors_is_true() -> None:
    assert OccupancyCondition().matches({"sensors": []}, _snap()) is True


def test_occupied_any_one_on() -> None:
    snap = _snap({"binary_sensor.a": _s("off"), "binary_sensor.b": _s("on")})
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "occupied": True, "quant": "any"}
    assert OccupancyCondition().matches(pred, snap) is True


def test_occupied_all_requires_every_sensor_on() -> None:
    snap = _snap({"binary_sensor.a": _s("on"), "binary_sensor.b": _s("off")})
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "occupied": True, "quant": "all"}
    assert OccupancyCondition().matches(pred, snap) is False


def test_vacant_all_requires_every_sensor_off() -> None:
    snap = _snap({"binary_sensor.a": _s("off"), "binary_sensor.b": _s("off")})
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "occupied": False, "quant": "all"}
    assert OccupancyCondition().matches(pred, snap) is True


def test_unavailable_sensor_is_unobservable() -> None:
    snap = _snap({"binary_sensor.a": _s("unavailable")})
    pred = {"sensors": ["binary_sensor.a"], "occupied": True, "quant": "any"}
    assert OccupancyCondition().matches(pred, snap) is False


def test_for_duration_not_yet_held() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    changed = datetime(2026, 5, 25, 11, 58, tzinfo=UTC)  # 2 min ago
    snap = _snap({"binary_sensor.a": ("on", changed)}, now=now)
    pred = {"sensors": ["binary_sensor.a"], "occupied": True, "for": {"h": 0, "m": 5, "s": 0}}
    assert OccupancyCondition().matches(pred, snap) is False


def test_for_duration_held_long_enough() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    changed = datetime(2026, 5, 25, 11, 50, tzinfo=UTC)  # 10 min ago
    snap = _snap({"binary_sensor.a": ("on", changed)}, now=now)
    pred = {"sensors": ["binary_sensor.a"], "occupied": True, "for": {"h": 0, "m": 5, "s": 0}}
    assert OccupancyCondition().matches(pred, snap) is True


def test_describe_counts_active() -> None:
    snap = _snap(
        {"binary_sensor.a": _s("on"), "binary_sensor.b": _s("off")},
        names={"binary_sensor.a": "Lounge", "binary_sensor.b": "Hall"},
    )
    assert OccupancyCondition().describe(snap) == "1 of 2 active (Lounge)"


def test_validate_accepts_valid_and_none() -> None:
    m = OccupancyCondition()
    m.validate_predicate(None)
    m.validate_predicate(
        {
            "sensors": ["binary_sensor.a"],
            "occupied": False,
            "quant": "all",
            "for": {"h": 0, "m": 5, "s": 0},
        }
    )


@pytest.mark.parametrize(
    "bad",
    [
        {"sensors": ["light.x"]},
        {"sensors": "binary_sensor.a"},
        {"quant": "some"},
        {"occupied": "yes"},
        {"for": {"h": -1}},
    ],
)
def test_validate_rejects(bad) -> None:
    with pytest.raises(ValueError):
        OccupancyCondition().validate_predicate(bad)


def test_trigger_deps_watches_sensors_and_durations() -> None:
    pred = {"sensors": ["binary_sensor.a"], "for": {"h": 0, "m": 5, "s": 0}}
    spec = OccupancyCondition().trigger_deps(pred)
    assert spec.entities == frozenset({"binary_sensor.a"})
    assert spec.entity_durations == frozenset({("binary_sensor.a", 300.0)})


def test_contains_any_subset_is_more_specific() -> None:
    m = OccupancyCondition()
    outer = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "quant": "any"}
    inner = {"sensors": ["binary_sensor.a"], "quant": "any"}
    # inner (only a) ⊆ outer (a,b): any-a implies any-(a,b)
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_requires_same_polarity_and_quant() -> None:
    m = OccupancyCondition()
    a = {"sensors": ["binary_sensor.a"], "occupied": True, "quant": "any"}
    b = {"sensors": ["binary_sensor.a"], "occupied": False, "quant": "any"}
    assert m.contains(a, b) is False
    c = {"sensors": ["binary_sensor.a"], "quant": "all"}
    assert m.contains(a, c) is False


def test_contains_longer_for_is_more_specific() -> None:
    m = OccupancyCondition()
    outer = {"sensors": ["binary_sensor.a"], "for": {"h": 0, "m": 1, "s": 0}}
    inner = {"sensors": ["binary_sensor.a"], "for": {"h": 0, "m": 5, "s": 0}}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_empty_sensors_is_a_wildcard_matching_matches() -> None:
    # Empty/absent `sensors` matches every world-state (see matches()), so its
    # match-set is the universe. `contains` must agree: a wildcard outer
    # contains any inner (regardless of polarity/quant); a wildcard inner (the
    # universe) is only contained by another wildcard.
    m = OccupancyCondition()
    # The UI emits {sensors: [], quant: "all"} when the picker is cleared after
    # choosing "all" — the previously-broken case.
    assert m.contains({"sensors": [], "quant": "all"}, {"sensors": ["binary_sensor.a"]}) is True
    # Wildcard outer ignores polarity/quant differences.
    assert (
        m.contains(
            {"sensors": [], "occupied": False},
            {"sensors": ["binary_sensor.a"], "occupied": True},
        )
        is True
    )
    # A constrained outer cannot contain the universe (wildcard inner).
    assert m.contains({"sensors": ["binary_sensor.a"]}, {"sensors": []}) is False
    # Two wildcards: universe ⊆ universe.
    assert m.contains({"sensors": []}, {"sensors": []}) is True
