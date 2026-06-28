"""OccupancyCondition — presence/occupancy binary_sensors, with optional `for`."""

from __future__ import annotations

from datetime import UTC, datetime

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.occupancy import (
    OccupancyCondition,
    OccupancySnapshot,
)
from custom_components.ambience.triggers import EMPTY, DurationGate


def _snap(sensors=None, now=None, names=None, tenure=None) -> OccupancySnapshot:
    return OccupancySnapshot(
        now=now or datetime(2026, 5, 25, 12, 0, tzinfo=UTC),
        sensors=sensors or {},
        names=names or {},
        tenure=tenure,
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


def test_contains_at_least_longer_inner_is_more_specific() -> None:
    m = OccupancyCondition()
    short = {"sensors": ["binary_sensor.a"], "quant": "any", "for": {"s": 30}}
    long = {"sensors": ["binary_sensor.a"], "quant": "any", "for": {"s": 60}}
    # at_least (default): held >= 60 ⊆ held >= 30.
    assert m.contains(short, long) is True
    assert m.contains(long, short) is False


def test_contains_less_than_shorter_inner_is_more_specific() -> None:
    m = OccupancyCondition()
    short = {
        "sensors": ["binary_sensor.a"],
        "quant": "any",
        "for": {"s": 30},
        "for_mode": "less_than",
    }
    long = {
        "sensors": ["binary_sensor.a"],
        "quant": "any",
        "for": {"s": 60},
        "for_mode": "less_than",
    }
    # less_than inverts: held < 30 ⊆ held < 60 (shorter threshold = more specific).
    assert m.contains(long, short) is True
    assert m.contains(short, long) is False


def test_contains_false_when_for_mode_differs() -> None:
    m = OccupancyCondition()
    at_least = {"sensors": ["binary_sensor.a"], "quant": "any", "for": {"s": 30}}
    less_than = {
        "sensors": ["binary_sensor.a"],
        "quant": "any",
        "for": {"s": 30},
        "for_mode": "less_than",
    }
    # Different comparators don't nest.
    assert m.contains(at_least, less_than) is False
    assert m.contains(less_than, at_least) is False


def test_contains_ungated_outer_contains_gated_inner() -> None:
    m = OccupancyCondition()
    ungated = {"sensors": ["binary_sensor.a"], "quant": "any"}
    gated = {
        "sensors": ["binary_sensor.a"],
        "quant": "any",
        "for": {"s": 30},
        "for_mode": "less_than",
    }
    # An outer with no duration gate constrains nothing on that axis.
    assert m.contains(ungated, gated) is True
    assert m.contains(gated, ungated) is False


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
    m = OccupancyCondition()
    pred = {"sensors": ["binary_sensor.a"], "for": {"h": 0, "m": 5, "s": 0}}
    spec = m.trigger_deps(pred)
    assert spec.entities == frozenset({"binary_sensor.a"})
    # Single predicate-level gate; entity named because there's one sensor.
    assert spec.duration_gates == frozenset(
        {
            DurationGate(
                key=m._gate_key(pred),
                seconds=300.0,
                label=m._gate_label(pred),
                entity_id="binary_sensor.a",
            )
        }
    )


def test_trigger_deps_multi_sensor_gate_has_no_single_entity() -> None:
    m = OccupancyCondition()
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "for": {"m": 5}}
    spec = m.trigger_deps(pred)
    gate = next(iter(spec.duration_gates))
    assert gate.entity_id is None
    assert gate.key == m._gate_key(pred)


def test_trigger_deps_no_for_has_no_gates() -> None:
    spec = OccupancyCondition().trigger_deps({"sensors": ["binary_sensor.a"]})
    assert spec.duration_gates == frozenset()


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


# --- predicate tenure (engine-tracked `for:` clock) --------------------


def test_occupancy_for_survives_sensor_handover_with_tenure() -> None:
    """any-of [s1, s2] occupied for 20m: a handover (s1 off, s2 on) keeps the
    gate's tenure because 'any occupied' held continuously."""
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"sensors": ["binary_sensor.s1", "binary_sensor.s2"], "quant": "any", "for": {"m": 20}}
    key = m._gate_key(pred)
    # s2 just turned on 1m ago (s1 off); 'any occupied' has held 20m per tenure.
    snap = _snap(
        {
            "binary_sensor.s1": ("off", now - timedelta(minutes=1)),
            "binary_sensor.s2": ("on", now - timedelta(minutes=1)),
        },
        now=now,
        tenure={key: now - timedelta(minutes=20)},
    )
    assert m.matches(pred, snap) is True
    # Legacy clock (no tenure): s2 only on 1m → not held → miss.
    snap_legacy = _snap(
        {
            "binary_sensor.s1": ("off", now - timedelta(minutes=1)),
            "binary_sensor.s2": ("on", now - timedelta(minutes=1)),
        },
        now=now,
    )
    assert m.matches(pred, snap_legacy) is False


def test_occupancy_negate_wraps_the_gated_match() -> None:
    """negate inverts the *gated* inner verdict: NOT(vacant for 20m) is False
    once the vacancy tenure matures, True before it does."""
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"sensors": ["binary_sensor.a"], "occupied": False, "for": {"m": 20}, "negate": True}
    key = m._gate_key(pred)
    snap_off = {"binary_sensor.a": ("off", now - timedelta(minutes=1))}
    # Vacancy has matured (tenure 20m): inner 'vacant for 20m' True → negate False.
    assert m.matches(pred, _snap(snap_off, now, tenure={key: now - timedelta(minutes=20)})) is False
    # Vacancy not matured (tenure 5m): inner False → negate True.
    assert m.matches(pred, _snap(snap_off, now, tenure={key: now - timedelta(minutes=5)})) is True


def test_occupancy_gate_key_excludes_negate() -> None:
    m = OccupancyCondition()
    base = {"sensors": ["binary_sensor.a"], "occupied": False, "for": {"m": 20}}
    assert m._gate_key(base) == m._gate_key({**base, "negate": True})
    # But polarity and quant DO change the key.
    assert m._gate_key(base) != m._gate_key({**base, "occupied": True})
    assert m._gate_key(base) != m._gate_key({**base, "quant": "all"})


def test_occupancy_gate_states_pre_negate_instant_and_anchor() -> None:
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "sensors": ["binary_sensor.a", "binary_sensor.b"],
        "quant": "any",
        "for": {"m": 20},
        "negate": True,
    }
    key = m._gate_key(pred)
    snap = _snap(
        {
            "binary_sensor.a": ("on", now - timedelta(minutes=50)),
            "binary_sensor.b": ("off", now - timedelta(minutes=10)),
        },
        now=now,
    )
    gs = m.gate_states(pred, snap)
    # Pre-negate 'any occupied' is True; anchor = latest referenced change (10m).
    assert gs == {key: (True, now - timedelta(minutes=10))}


def test_occupancy_gate_states_empty_without_for_or_sensors() -> None:
    m = OccupancyCondition()
    assert m.gate_states({"sensors": ["binary_sensor.a"]}, _snap()) == {}  # no for
    assert m.gate_states({"sensors": [], "for": {"m": 5}}, _snap()) == {}  # wildcard
    assert m.gate_states("not-a-dict", _snap()) == {}  # non-dict guard


def test_occupancy_unobservable_stays_unobservable_under_tenure() -> None:
    """A None inner verdict (unavailable sensor) must stay a miss through the
    gate and negate, never inverting into a spurious match."""
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"sensors": ["binary_sensor.a"], "for": {"m": 5}, "negate": True}
    key = m._gate_key(pred)
    snap = _snap(
        {"binary_sensor.a": ("unavailable", now)},
        now=now,
        tenure={key: now - timedelta(minutes=10)},
    )
    assert m.matches(pred, snap) is False


def test_occupancy_describe_tenure_mode() -> None:
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"sensors": ["binary_sensor.a"], "occupied": True, "for": {"m": 20}}
    key = m._gate_key(pred)
    snap = _snap(
        {"binary_sensor.a": ("on", now - timedelta(minutes=1))},
        now=now,
        names={"binary_sensor.a": "Lounge"},
        tenure={key: now - timedelta(minutes=25)},
    )
    line = m.describe(snap, pred)
    assert "held 25m" in line
    # Not-held variant.
    snap2 = _snap(
        {"binary_sensor.a": ("off", now - timedelta(minutes=1))},
        now=now,
        names={"binary_sensor.a": "Lounge"},
        tenure={},
    )
    assert "not held" in m.describe(snap2, pred)


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


# --- for_mode: "less_than" (held LESS than `for`) -----------------------


def test_occupancy_less_than_tenure_within_window_matches() -> None:
    """for_mode less_than over engine tenure: the gated verdict is True only
    while the instant test has held for LESS than `for`."""
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "sensors": ["binary_sensor.a"],
        "occupied": True,
        "for": {"m": 20},
        "for_mode": "less_than",
    }
    key = m._gate_key(pred)
    snap = _snap(
        {"binary_sensor.a": ("on", now - timedelta(minutes=1))},
        now=now,
        tenure={key: now - timedelta(minutes=5)},  # held 5m < 20m
    )
    assert m.matches(pred, snap) is True


def test_occupancy_less_than_tenure_beyond_window_does_not_match() -> None:
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "sensors": ["binary_sensor.a"],
        "occupied": True,
        "for": {"m": 20},
        "for_mode": "less_than",
    }
    key = m._gate_key(pred)
    snap = _snap(
        {"binary_sensor.a": ("on", now - timedelta(minutes=1))},
        now=now,
        tenure={key: now - timedelta(minutes=25)},  # held 25m >= 20m
    )
    assert m.matches(pred, snap) is False


def test_occupancy_less_than_tenure_exact_boundary_does_not_match() -> None:
    """Boundary is exclusive: holding for exactly `for` is no longer within."""
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "sensors": ["binary_sensor.a"],
        "occupied": True,
        "for": {"m": 20},
        "for_mode": "less_than",
    }
    key = m._gate_key(pred)
    snap = _snap(
        {"binary_sensor.a": ("on", now - timedelta(minutes=1))},
        now=now,
        tenure={key: now - timedelta(minutes=20)},  # held exactly 20m
    )
    assert m.matches(pred, snap) is False


def test_occupancy_less_than_survives_sensor_handover_within_window() -> None:
    """less_than over a handover: 'any occupied' has held only 5m (a fresh tenure
    that survived s1→s2), so the <20m window still matches even though each
    sensor's own last_changed is recent."""
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "sensors": ["binary_sensor.s1", "binary_sensor.s2"],
        "quant": "any",
        "for": {"m": 20},
        "for_mode": "less_than",
    }
    key = m._gate_key(pred)
    # s1 off, s2 just on 1m ago; 'any occupied' tenure has held 5m (< 20m).
    snap = _snap(
        {
            "binary_sensor.s1": ("off", now - timedelta(minutes=1)),
            "binary_sensor.s2": ("on", now - timedelta(minutes=1)),
        },
        now=now,
        tenure={key: now - timedelta(minutes=5)},
    )
    assert m.matches(pred, snap) is True
    # Same handover but the tenure has matured past the window → miss.
    snap_matured = _snap(
        {
            "binary_sensor.s1": ("off", now - timedelta(minutes=1)),
            "binary_sensor.s2": ("on", now - timedelta(minutes=1)),
        },
        now=now,
        tenure={key: now - timedelta(minutes=30)},
    )
    assert m.matches(pred, snap_matured) is False


def test_occupancy_for_mode_absent_or_at_least_is_unchanged() -> None:
    """Regression: absent for_mode (and explicit "at_least") behaves as today —
    matches only once the tenure has held AT LEAST `for`."""
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    base = {"sensors": ["binary_sensor.a"], "occupied": True, "for": {"m": 20}}
    key = m._gate_key(base)
    matured = _snap(
        {"binary_sensor.a": ("on", now - timedelta(minutes=1))},
        now=now,
        tenure={key: now - timedelta(minutes=25)},  # held 25m >= 20m
    )
    fresh = _snap(
        {"binary_sensor.a": ("on", now - timedelta(minutes=1))},
        now=now,
        tenure={key: now - timedelta(minutes=5)},  # held 5m < 20m
    )
    # absent for_mode == at_least: matured matches, fresh does not.
    assert m.matches(base, matured) is True
    assert m.matches(base, fresh) is False
    # explicit at_least is identical.
    at_least = {**base, "for_mode": "at_least"}
    assert m.matches(at_least, matured) is True
    assert m.matches(at_least, fresh) is False


def test_occupancy_less_than_legacy_clock_uses_holds() -> None:
    """Without engine tenure the legacy per-sensor last_changed clock applies:
    less_than matches while elapsed < `for`, misses once elapsed >= `for`."""
    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "sensors": ["binary_sensor.a"],
        "occupied": True,
        "for": {"m": 20},
        "for_mode": "less_than",
    }
    # On for 5m (< 20m) → within → match.
    within = _snap({"binary_sensor.a": ("on", datetime(2026, 5, 25, 11, 55, tzinfo=UTC))}, now=now)
    assert m.matches(pred, within) is True
    # On for 25m (>= 20m) → past → miss.
    past = _snap({"binary_sensor.a": ("on", datetime(2026, 5, 25, 11, 35, tzinfo=UTC))}, now=now)
    assert m.matches(pred, past) is False


def test_occupancy_less_than_negate_inverts() -> None:
    """NOT(occupied for <20m) is False while within the window, True outside it."""
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "sensors": ["binary_sensor.a"],
        "occupied": True,
        "for": {"m": 20},
        "for_mode": "less_than",
        "negate": True,
    }
    key = m._gate_key(pred)
    # Inner less_than True (held 5m) → negate False.
    within = _snap(
        {"binary_sensor.a": ("on", now - timedelta(minutes=1))},
        now=now,
        tenure={key: now - timedelta(minutes=5)},
    )
    assert m.matches(pred, within) is False
    # Inner less_than False (held 25m) → negate True.
    past = _snap(
        {"binary_sensor.a": ("on", now - timedelta(minutes=1))},
        now=now,
        tenure={key: now - timedelta(minutes=25)},
    )
    assert m.matches(pred, past) is True


def test_validate_accepts_for_mode() -> None:
    m = OccupancyCondition()
    m.validate_predicate({"sensors": ["binary_sensor.a"], "for_mode": "less_than"})
    m.validate_predicate({"sensors": ["binary_sensor.a"], "for_mode": "at_least"})
    m.validate_predicate({"sensors": ["binary_sensor.a"]})  # absent is fine


def test_validate_rejects_bad_for_mode() -> None:
    with pytest.raises(ValueError):
        OccupancyCondition().validate_predicate(
            {"sensors": ["binary_sensor.a"], "for_mode": "sometimes"}
        )


def test_describe_for_mode_less_than_renders_for_lt() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    on_5m = ("on", datetime(2026, 5, 25, 11, 55, tzinfo=UTC))
    snap = _snap({"binary_sensor.bed": on_5m}, now=now, names={"binary_sensor.bed": "Bed"})
    pred = {"sensors": ["binary_sensor.bed"], "for": {"m": 20}, "for_mode": "less_than"}
    assert OccupancyCondition().describe(snap, pred) == "Bed: on 5m ✓ (for <20m)"


def test_describe_for_mode_at_least_renders_for_ge() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    on_5m = ("on", datetime(2026, 5, 25, 11, 55, tzinfo=UTC))
    snap = _snap({"binary_sensor.bed": on_5m}, now=now, names={"binary_sensor.bed": "Bed"})
    pred = {"sensors": ["binary_sensor.bed"], "for": {"m": 20}, "for_mode": "at_least"}
    assert OccupancyCondition().describe(snap, pred) == "Bed: on 5m ✗ (for ≥20m)"


def test_describe_for_mode_less_than_tenure_mode() -> None:
    from datetime import timedelta

    m = OccupancyCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "sensors": ["binary_sensor.a"],
        "occupied": True,
        "for": {"m": 20},
        "for_mode": "less_than",
    }
    key = m._gate_key(pred)
    snap = _snap(
        {"binary_sensor.a": ("on", now - timedelta(minutes=1))},
        now=now,
        names={"binary_sensor.a": "Lounge"},
        tenure={key: now - timedelta(minutes=5)},
    )
    line = m.describe(snap, pred)
    assert "for <20m" in line
    assert "held 5m" in line
