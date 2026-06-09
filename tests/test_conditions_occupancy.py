"""OccupancyCondition — presence/occupancy binary_sensors, with optional `for`."""

from __future__ import annotations

from datetime import UTC, datetime

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.occupancy import (
    OccupancyCondition,
    OccupancySnapshot,
)
from custom_components.ambience.triggers import EMPTY


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


async def test_snapshot_with_entities_captures_only_referenced(hass: HomeAssistant) -> None:
    hass.states.async_set("binary_sensor.lounge", "on", {"friendly_name": "Lounge"})
    hass.states.async_set("binary_sensor.bedroom", "off")
    snap = await OccupancyCondition().snapshot(hass, entities=frozenset({"binary_sensor.lounge"}))
    assert set(snap.sensors) == {"binary_sensor.lounge"}
    assert "binary_sensor.bedroom" not in snap.sensors


async def test_snapshot_with_entities_does_not_scan_the_domain(
    hass: HomeAssistant, monkeypatch
) -> None:
    hass.states.async_set("binary_sensor.lounge", "on")

    def _tripwire(*_args, **_kwargs):
        raise AssertionError("snapshot must not call hass.states.async_all when entities given")

    monkeypatch.setattr(type(hass.states), "async_all", _tripwire)
    snap = await OccupancyCondition().snapshot(hass, entities=frozenset({"binary_sensor.lounge"}))
    assert set(snap.sensors) == {"binary_sensor.lounge"}


async def test_snapshot_with_entities_skips_missing(hass: HomeAssistant) -> None:
    snap = await OccupancyCondition().snapshot(hass, entities=frozenset({"binary_sensor.ghost"}))
    assert snap.sensors == {}


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


def test_negate_inverts_simple_match() -> None:
    snap = _snap({"binary_sensor.a": _s("on")})
    pred = {"sensors": ["binary_sensor.a"], "occupied": True, "quant": "any"}
    assert OccupancyCondition().matches(pred, snap) is True
    assert OccupancyCondition().matches({**pred, "negate": True}, snap) is False


def test_negate_not_vacant_for_differs_from_occupied_for() -> None:
    # Sensor is ON, but only for 5 min, with a 20 min `for` gate.
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    changed = datetime(2026, 5, 25, 11, 55, tzinfo=UTC)  # 5 min ago
    snap = _snap({"binary_sensor.a": ("on", changed)}, now=now)
    m = OccupancyCondition()
    twenty = {"h": 0, "m": 20, "s": 0}
    # "NOT (vacant for >=20m)": it is on, so vacant-for-20m is false -> negate true.
    not_vacant_for = {
        "sensors": ["binary_sensor.a"],
        "occupied": False,
        "for": twenty,
        "negate": True,
    }
    # "occupied for >=20m": on, but held only 5m -> false.
    occupied_for = {"sensors": ["binary_sensor.a"], "occupied": True, "for": twenty}
    assert m.matches(not_vacant_for, snap) is True
    assert m.matches(occupied_for, snap) is False


def test_negate_unavailable_is_not_a_match() -> None:
    # "not occupied" (negate over the default occupied=True) must NOT become true
    # when the sensor is unavailable. Unobservable is a miss even under negate —
    # negating "couldn't tell" must not manufacture a match.
    snap = _snap({"binary_sensor.a": _s("unavailable")})
    pred = {"sensors": ["binary_sensor.a"], "negate": True}
    assert OccupancyCondition().matches(pred, snap) is False


def test_negate_any_unobservable_when_one_sensor_unavailable() -> None:
    # "not (any occupied)": one sensor observably off, one unavailable. We cannot
    # be sure the unavailable one isn't occupied, so the whole match is
    # unobservable -> miss (not True).
    snap = _snap({"binary_sensor.a": _s("off"), "binary_sensor.b": _s("unavailable")})
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "quant": "any", "negate": True}
    assert OccupancyCondition().matches(pred, snap) is False


def test_negate_any_true_when_all_observably_vacant() -> None:
    # "not (any occupied)": every sensor observably off -> definitely not
    # occupied -> the negation is a real, observable True.
    snap = _snap({"binary_sensor.a": _s("off"), "binary_sensor.b": _s("off")})
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "quant": "any", "negate": True}
    assert OccupancyCondition().matches(pred, snap) is True


def test_negate_with_empty_sensors_stays_wildcard() -> None:
    # No constraint to negate: a wildcard stays a wildcard.
    assert OccupancyCondition().matches({"sensors": [], "negate": True}, _snap()) is True


def test_validate_accepts_negate() -> None:
    OccupancyCondition().validate_predicate({"sensors": ["binary_sensor.a"], "negate": True})


def test_validate_rejects_non_bool_negate() -> None:
    with pytest.raises(ValueError):
        OccupancyCondition().validate_predicate({"sensors": ["binary_sensor.a"], "negate": "yes"})


def test_contains_conservative_when_either_side_negates() -> None:
    m = OccupancyCondition()
    plain = {"sensors": ["binary_sensor.a"], "quant": "any"}
    neg = {"sensors": ["binary_sensor.a"], "quant": "any", "negate": True}
    assert m.contains(neg, plain) is False
    assert m.contains(plain, neg) is False
    assert m.contains(neg, neg) is False


def test_describe_counts_active() -> None:
    snap = _snap(
        {"binary_sensor.a": _s("on"), "binary_sensor.b": _s("off")},
        names={"binary_sensor.a": "Lounge", "binary_sensor.b": "Hall"},
    )
    # No predicate = the whole-snapshot summary (used by snapshots_described).
    assert OccupancyCondition().describe(snap) == "1 of 2 active (Lounge)"
    assert OccupancyCondition().describe(snap, None) == "1 of 2 active (Lounge)"


def test_describe_predicate_scopes_to_referenced_sensor() -> None:
    # The shared snapshot holds many sensors, but a scene referencing only one
    # must get a verdict for THAT sensor, not the whole pool.
    snap = _snap(
        {
            "binary_sensor.a": _s("on"),
            "binary_sensor.b": _s("off"),
            "binary_sensor.c": _s("on"),
        },
        names={
            "binary_sensor.a": "Lounge",
            "binary_sensor.b": "Bed",
            "binary_sensor.c": "Hall",
        },
    )
    assert OccupancyCondition().describe(snap, {"sensors": ["binary_sensor.b"]}) == "Bed: off ✗"
    assert OccupancyCondition().describe(snap, {"sensors": ["binary_sensor.a"]}) == "Lounge: on ✓"


def test_describe_predicate_quant_all_lists_each_in_order() -> None:
    snap = _snap(
        {"binary_sensor.a": _s("on"), "binary_sensor.b": _s("off")},
        names={"binary_sensor.a": "Lounge", "binary_sensor.b": "Hall"},
    )
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "quant": "all"}
    assert OccupancyCondition().describe(snap, pred) == "all of: Lounge: on ✓, Hall: off ✗"


def test_describe_predicate_quant_any_lists_each_in_order() -> None:
    snap = _snap(
        {"binary_sensor.a": _s("off"), "binary_sensor.b": _s("on")},
        names={"binary_sensor.a": "Kitchen", "binary_sensor.b": "Lounge"},
    )
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "quant": "any"}
    assert OccupancyCondition().describe(snap, pred) == "any of: Kitchen: off ✗, Lounge: on ✓"


def test_describe_predicate_vacant_inverts_marks() -> None:
    # occupied: false means an "off" sensor is the match.
    snap = _snap({"binary_sensor.a": _s("off")}, names={"binary_sensor.a": "Lounge"})
    pred = {"sensors": ["binary_sensor.a"], "occupied": False}
    assert OccupancyCondition().describe(snap, pred) == "Lounge: off ✓"


def test_describe_predicate_missing_sensor_not_found() -> None:
    snap = _snap({}, names={})
    pred = {"sensors": ["binary_sensor.gone"]}
    assert OccupancyCondition().describe(snap, pred) == "binary_sensor.gone: not found ✗"


def test_describe_predicate_empty_sensors_is_wildcard() -> None:
    snap = _snap({"binary_sensor.a": _s("on")}, names={"binary_sensor.a": "Lounge"})
    assert OccupancyCondition().describe(snap, {"sensors": []}) == "any sensor (no constraint)"


def test_describe_predicate_negate_wraps_body() -> None:
    snap = _snap({"binary_sensor.a": _s("on")}, names={"binary_sensor.a": "Lounge"})
    pred = {"sensors": ["binary_sensor.a"], "negate": True}
    assert OccupancyCondition().describe(snap, pred) == "not(Lounge: on ✓)"


def test_describe_predicate_for_shows_elapsed_and_requirement() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    on_25m = ("on", datetime(2026, 5, 25, 11, 35, tzinfo=UTC))  # held 25m -> meets ≥20m
    on_5m = ("on", datetime(2026, 5, 25, 11, 55, tzinfo=UTC))  # held 5m -> too short
    snap = _snap(
        {"binary_sensor.a": on_25m, "binary_sensor.b": on_5m},
        now=now,
        names={"binary_sensor.a": "Lounge", "binary_sensor.b": "Hall"},
    )
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "quant": "all", "for": {"m": 20}}
    assert (
        OccupancyCondition().describe(snap, pred)
        == "all of: Lounge: on 25m ✓, Hall: on 5m ✗ (for ≥20m)"
    )


def test_describe_predicate_for_single_sensor() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    on_5m = ("on", datetime(2026, 5, 25, 11, 55, tzinfo=UTC))
    snap = _snap({"binary_sensor.bed": on_5m}, now=now, names={"binary_sensor.bed": "Bed"})
    pred = {"sensors": ["binary_sensor.bed"], "for": {"m": 20}}
    assert OccupancyCondition().describe(snap, pred) == "Bed: on 5m ✗ (for ≥20m)"


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


def test_matches_non_dict_is_false() -> None:
    assert OccupancyCondition().matches("not-a-dict", _snap()) is False


def test_matches_missing_sensor_is_unobservable_miss() -> None:
    # A referenced sensor absent from the snapshot is unobservable (_holds -> None),
    # which collapses to a miss rather than manufacturing a match.
    assert OccupancyCondition().matches({"sensors": ["binary_sensor.gone"]}, _snap()) is False


def test_describe_non_dict_predicate_is_none() -> None:
    assert OccupancyCondition().describe(_snap(), "not-a-dict") is None


def test_describe_snapshot_no_sensors() -> None:
    assert OccupancyCondition().describe(_snap()) == "no occupancy sensors"


def test_describe_snapshot_zero_active() -> None:
    snap = _snap(
        {"binary_sensor.a": _s("off"), "binary_sensor.b": _s("off")},
        names={"binary_sensor.a": "Lounge", "binary_sensor.b": "Hall"},
    )
    assert OccupancyCondition().describe(snap) == "0 of 2 active"


def test_validate_non_dict_predicate_raises() -> None:
    with pytest.raises(ValueError, match="occupancy predicate must be a dict"):
        OccupancyCondition().validate_predicate("not-a-dict")


def test_trigger_deps_non_dict_is_empty() -> None:
    assert OccupancyCondition().trigger_deps("not-a-dict") is EMPTY


def test_is_constraining_only_when_sensors_present() -> None:
    m = OccupancyCondition()
    assert m.is_constraining({"sensors": ["binary_sensor.a"]}) is True
    assert m.is_constraining({"sensors": []}) is False
    assert m.is_constraining("not-a-dict") is False


def test_contains_non_dict_is_false() -> None:
    m = OccupancyCondition()
    assert m.contains("x", {"sensors": ["binary_sensor.a"]}) is False
    assert m.contains({"sensors": ["binary_sensor.a"]}, "x") is False


def test_contains_all_over_more_sensors_within_all_over_fewer() -> None:
    # all-(a,b) is implied by all-(a,b,c): the larger "all" set is the more
    # specific match-set, so inner ⊆ outer.
    m = OccupancyCondition()
    outer = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "quant": "all"}
    inner = {
        "sensors": ["binary_sensor.a", "binary_sensor.b", "binary_sensor.c"],
        "quant": "all",
    }
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
