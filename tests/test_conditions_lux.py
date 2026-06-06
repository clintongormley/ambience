"""LuxCondition — illuminance sensors against named or inline numeric bands."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.lux import LuxCondition, LuxSnapshot
from custom_components.ambience.lux_ranges import BUILTIN_LUX_RANGES


def _cond(ranges=None) -> LuxCondition:
    return LuxCondition(range_lookup=lambda: ranges or BUILTIN_LUX_RANGES)


def _snap(sensors=None, names=None) -> LuxSnapshot:
    return LuxSnapshot(sensors=sensors or {}, names=names or {})


def test_protocol_fields() -> None:
    m = LuxCondition()
    assert m.name == "lux"
    assert m.input == "lux"
    assert m.priority == 775
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


def test_priority_is_below_state_so_it_never_dominates() -> None:
    # The whole point: ambient light is a low-priority environmental signal,
    # unlike a state condition (950) which would outrank almost everything.
    assert LuxCondition().priority < 800


async def test_snapshot_captures_only_illuminance_sensors(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "sensor.lounge", "320", {"device_class": "illuminance", "friendly_name": "Lounge"}
    )
    hass.states.async_set("sensor.temp", "21", {"device_class": "temperature"})
    snap = await LuxCondition().snapshot(hass)
    assert snap.sensors["sensor.lounge"] == 320.0
    assert snap.names["sensor.lounge"] == "Lounge"
    assert "sensor.temp" not in snap.sensors


async def test_snapshot_non_numeric_value_is_none(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.lounge", "unavailable", {"device_class": "illuminance"})
    snap = await LuxCondition().snapshot(hass)
    assert snap.sensors["sensor.lounge"] is None


def test_matches_none_is_true() -> None:
    assert _cond().matches(None, _snap()) is True


def test_matches_empty_sensors_is_true() -> None:
    assert _cond().matches({"sensors": []}, _snap()) is True


def test_named_range_match() -> None:
    snap = _snap({"sensor.a": 5.0})
    assert _cond().matches({"sensors": ["sensor.a"], "range": "dark"}, snap) is True
    assert _cond().matches({"sensors": ["sensor.a"], "range": "bright"}, snap) is False


def test_inline_band_match() -> None:
    snap = _snap({"sensor.a": 120.0})
    assert _cond().matches({"sensors": ["sensor.a"], "min": 50, "max": 300}, snap) is True
    assert _cond().matches({"sensors": ["sensor.a"], "min": 200, "max": 300}, snap) is False


def test_half_open_boundaries() -> None:
    m = _cond()
    # dim = [10, 50): 10 included, 50 excluded.
    assert m.matches({"sensors": ["sensor.a"], "range": "dim"}, _snap({"sensor.a": 10.0})) is True
    assert m.matches({"sensors": ["sensor.a"], "range": "dim"}, _snap({"sensor.a": 50.0})) is False


def test_open_ended_bands() -> None:
    m = _cond()
    # very_bright = [1000, inf)
    bright_snap = _snap({"sensor.a": 5000.0})
    assert m.matches({"sensors": ["sensor.a"], "range": "very_bright"}, bright_snap) is True
    # dark = (-inf, 10)
    assert m.matches({"sensors": ["sensor.a"], "max": 10}, _snap({"sensor.a": 0.0})) is True


def test_quant_any_vs_all() -> None:
    m = _cond()
    snap = _snap({"sensor.a": 5.0, "sensor.b": 500.0})
    any_dark = {"sensors": ["sensor.a", "sensor.b"], "range": "dark", "quant": "any"}
    all_dark = {"sensors": ["sensor.a", "sensor.b"], "range": "dark", "quant": "all"}
    assert m.matches(any_dark, snap) is True
    assert m.matches(all_dark, snap) is False


def test_unobservable_sensor_never_holds() -> None:
    snap = _snap({"sensor.a": None})
    assert _cond().matches({"sensors": ["sensor.a"], "range": "dark"}, snap) is False


async def test_snapshot_non_finite_value_is_none(hass: HomeAssistant) -> None:
    # float("nan") succeeds but NaN fails every band comparison, which would make
    # it match *every* band — treat non-finite readings as unobservable.
    hass.states.async_set("sensor.lounge", "nan", {"device_class": "illuminance"})
    hass.states.async_set("sensor.hall", "inf", {"device_class": "illuminance"})
    snap = await LuxCondition().snapshot(hass)
    assert snap.sensors["sensor.lounge"] is None
    assert snap.sensors["sensor.hall"] is None


def test_nan_reading_does_not_match_any_band() -> None:
    snap = _snap({"sensor.a": float("nan")})
    assert _cond().matches({"sensors": ["sensor.a"], "range": "dark"}, snap) is False
    assert _cond().matches({"sensors": ["sensor.a"], "min": 0}, snap) is False


def test_unknown_range_is_a_non_match_not_a_crash() -> None:
    # A scene may reference a range the user later hides/deletes. matches() must
    # not raise (that would abort the whole scope's evaluation) — it fails the
    # scene instead, like an unobservable sensor.
    assert (
        _cond().matches({"sensors": ["sensor.a"], "range": "nope"}, _snap({"sensor.a": 5.0}))
        is False
    )


def test_describe_lists_readings() -> None:
    snap = _snap(
        {"sensor.a": 320.0, "sensor.b": 8.0},
        names={"sensor.a": "Lounge", "sensor.b": "Hall"},
    )
    assert _cond().describe(snap) == "Hall 8 lx, Lounge 320 lx"


def test_describe_no_sensors() -> None:
    assert _cond().describe(_snap()) == "no lux sensors"


def test_validate_accepts_valid_and_none() -> None:
    m = _cond()
    m.validate_predicate(None)
    m.validate_predicate({"sensors": ["sensor.a"], "range": "dark"})
    m.validate_predicate({"sensors": ["sensor.a"], "min": 10, "max": 50, "quant": "all"})
    m.validate_predicate({"sensors": ["sensor.a"], "max": 10})


@pytest.mark.parametrize(
    "bad",
    [
        {"sensors": "sensor.a"},  # not a list
        {"sensors": ["light.x"]},  # not a sensor
        {"sensors": ["sensor.a"], "quant": "some"},  # bad quant
        {"sensors": ["sensor.a"], "range": "dark", "min": 5},  # range AND inline band
        {"sensors": ["sensor.a"], "range": 5},  # range not a string
        {"sensors": ["sensor.a"], "min": 50, "max": 10},  # min >= max
        {"sensors": ["sensor.a"], "min": -1},  # negative
    ],
)
def test_validate_rejects(bad) -> None:
    with pytest.raises(ValueError):
        _cond().validate_predicate(bad)


def test_validate_rejects_unknown_range_id() -> None:
    # Save-time check (mirrors time_of_day rejecting unknown periods); runtime
    # matches() stays tolerant for ranges hidden after the scene was saved.
    with pytest.raises(ValueError, match="unknown lux range"):
        _cond().validate_predicate({"sensors": ["sensor.a"], "range": "nope"})


def test_trigger_deps_watches_sensors() -> None:
    spec = _cond().trigger_deps({"sensors": ["sensor.a", "sensor.b"], "range": "dark"})
    assert spec.entities == frozenset({"sensor.a", "sensor.b"})


def test_contains_inner_band_within_outer_band() -> None:
    m = _cond()
    outer = {"sensors": ["sensor.a"], "min": 0, "max": 1000}
    inner = {"sensors": ["sensor.a"], "min": 100, "max": 500}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_open_outer_contains_bounded_inner() -> None:
    m = _cond()
    outer = {"sensors": ["sensor.a"], "min": 100}  # [100, inf)
    inner = {"sensors": ["sensor.a"], "min": 200, "max": 500}
    assert m.contains(outer, inner) is True


def test_contains_requires_same_quant() -> None:
    m = _cond()
    a = {"sensors": ["sensor.a"], "min": 0, "max": 1000, "quant": "any"}
    b = {"sensors": ["sensor.a"], "min": 0, "max": 1000, "quant": "all"}
    assert m.contains(a, b) is False


def test_contains_any_sensor_subset() -> None:
    m = _cond()
    outer = {"sensors": ["sensor.a", "sensor.b"], "min": 0, "max": 100, "quant": "any"}
    inner = {"sensors": ["sensor.a"], "min": 0, "max": 100, "quant": "any"}
    assert m.contains(outer, inner) is True


def test_contains_named_ranges_resolved() -> None:
    m = _cond()
    # bright = [300, 1000) is within [0, 2000)
    outer = {"sensors": ["sensor.a"], "min": 0, "max": 2000}
    inner = {"sensors": ["sensor.a"], "range": "bright"}
    assert m.contains(outer, inner) is True


def test_contains_empty_outer_is_wildcard() -> None:
    m = _cond()
    assert m.contains({"sensors": []}, {"sensors": ["sensor.a"], "range": "dark"}) is True
    assert m.contains({"sensors": ["sensor.a"], "range": "dark"}, {"sensors": []}) is False
