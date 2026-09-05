"""LuxCondition — illuminance sensors against named or inline numeric bands."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.lux import LuxCondition, LuxSnapshot
from custom_components.ambience.errors import AmbienceError
from custom_components.ambience.lux_ranges import BUILTIN_LUX_RANGES


def _cond(ranges=None) -> LuxCondition:
    return LuxCondition(range_lookup=lambda: ranges or BUILTIN_LUX_RANGES)


def _snap(sensors=None, names=None, non_numeric=None) -> LuxSnapshot:
    return LuxSnapshot(sensors=sensors or {}, names=names or {}, non_numeric=non_numeric or {})


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


async def test_snapshot_with_entities_captures_only_referenced(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "sensor.lounge", "320", {"device_class": "illuminance", "friendly_name": "Lounge"}
    )
    hass.states.async_set("sensor.bedroom", "12", {"device_class": "illuminance"})
    snap = await LuxCondition().snapshot(hass, entities=frozenset({"sensor.lounge"}))
    assert snap.sensors == {"sensor.lounge": 320.0}
    assert "sensor.bedroom" not in snap.sensors


async def test_snapshot_with_entities_does_not_scan_the_domain(
    hass: HomeAssistant, monkeypatch
) -> None:
    """With a referenced set supplied, snapshot must target entities directly and
    never enumerate the whole sensor domain (the point of the change)."""
    hass.states.async_set("sensor.lounge", "320", {"device_class": "illuminance"})

    def _tripwire(*_args, **_kwargs):
        raise AssertionError("snapshot must not call hass.states.async_all when entities given")

    monkeypatch.setattr(type(hass.states), "async_all", _tripwire)
    snap = await LuxCondition().snapshot(hass, entities=frozenset({"sensor.lounge"}))
    assert snap.sensors == {"sensor.lounge": 320.0}


async def test_snapshot_with_entities_skips_missing(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.temp", "21", {"device_class": "temperature"})
    # sensor.ghost is referenced but absent; sensor.temp was chosen deliberately,
    # so it is snapshotted despite its non-illuminance device_class.
    snap = await LuxCondition().snapshot(hass, entities=frozenset({"sensor.ghost", "sensor.temp"}))
    assert snap.sensors == {"sensor.temp": 21.0}


async def test_snapshot_with_entities_keeps_sensor_without_device_class(
    hass: HomeAssistant,
) -> None:
    """An explicitly referenced sensor is the user's deliberate choice, so it is
    snapshotted (and matched) whatever device_class it declares — or doesn't."""
    hass.states.async_set("sensor.hallway_lux", "42", {"friendly_name": "Hallway Lux"})
    snap = await LuxCondition().snapshot(hass, entities=frozenset({"sensor.hallway_lux"}))
    assert snap.sensors == {"sensor.hallway_lux": 42.0}
    assert snap.names["sensor.hallway_lux"] == "Hallway Lux"
    pred = {"sensors": ["sensor.hallway_lux"], "min": 0, "max": 100}
    assert _cond().matches(pred, snap) is True


async def test_snapshot_referenced_non_numeric_state_gets_reason(
    hass: HomeAssistant,
) -> None:
    """A referenced sensor whose state is not a number can't be banded, so the
    predicate misses and the trace says why instead of reading 'not found'."""
    hass.states.async_set("sensor.hallway_lux", "foo", {"friendly_name": "Hallway Lux"})
    snap = await LuxCondition().snapshot(hass, entities=frozenset({"sensor.hallway_lux"}))
    assert snap.sensors == {"sensor.hallway_lux": None}
    pred = {"sensors": ["sensor.hallway_lux"], "min": 0, "max": 100}
    m = _cond()
    assert m.matches(pred, snap) is False
    reason = m.unconfigured_reason(pred, snap)
    assert reason == "Hallway Lux ('foo') does not report a number"


async def test_snapshot_unavailable_sensor_gets_no_non_numeric_reason(
    hass: HomeAssistant,
) -> None:
    """`unavailable`/`unknown` is a transient outage, not a misconfigured sensor."""
    hass.states.async_set("sensor.hallway_lux", "unavailable", {})
    hass.states.async_set("sensor.porch_lux", "unknown", {})
    snap = await LuxCondition().snapshot(
        hass, entities=frozenset({"sensor.hallway_lux", "sensor.porch_lux"})
    )
    assert snap.non_numeric == {}
    pred = {"sensors": ["sensor.hallway_lux", "sensor.porch_lux"], "min": 0, "max": 100}
    assert _cond().unconfigured_reason(pred, snap) is None


async def test_snapshot_without_entities_still_filters_by_device_class(
    hass: HomeAssistant,
) -> None:
    """The unhinted full-domain scan has no user choice to honour, so it keeps the
    illuminance filter rather than snapshotting every sensor in the house."""
    hass.states.async_set("sensor.temp", "21", {"device_class": "temperature"})
    hass.states.async_set("sensor.plain", "7", {})
    hass.states.async_set("sensor.lounge", "320", {"device_class": "illuminance"})
    snap = await LuxCondition().snapshot(hass)
    assert snap.sensors == {"sensor.lounge": 320.0}


async def test_snapshot_with_empty_entities_captures_nothing(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.lounge", "320", {"device_class": "illuminance"})
    snap = await LuxCondition().snapshot(hass, entities=frozenset())
    assert snap.sensors == {}


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


def test_describe_predicate_scopes_to_referenced_sensor() -> None:
    # The shared snapshot holds several sensors; a scene referencing one must
    # get a verdict for that one, with the target band stated so a miss reads.
    snap = _snap(
        {"sensor.a": 5.0, "sensor.b": 320.0, "sensor.c": 8.0},
        names={"sensor.a": "Lounge", "sensor.b": "Bed", "sensor.c": "Hall"},
    )
    pred = {"sensors": ["sensor.b"], "min": 0, "max": 10}
    assert _cond().describe(snap, pred) == "want 0-10 lx; Bed: 320 lx ✗"
    pred_ok = {"sensors": ["sensor.a"], "min": 0, "max": 10}
    assert _cond().describe(snap, pred_ok) == "want 0-10 lx; Lounge: 5 lx ✓"


def test_describe_predicate_quant_all_lists_each_in_order() -> None:
    snap = _snap(
        {"sensor.a": 150.0, "sensor.b": 50.0},
        names={"sensor.a": "Lounge", "sensor.b": "Hall"},
    )
    pred = {"sensors": ["sensor.a", "sensor.b"], "min": 100, "quant": "all"}
    assert _cond().describe(snap, pred) == "want ≥100 lx; all of: Lounge: 150 lx ✓, Hall: 50 lx ✗"


def test_describe_predicate_max_only_band() -> None:
    snap = _snap({"sensor.a": 320.0}, names={"sensor.a": "Lounge"})
    pred = {"sensors": ["sensor.a"], "max": 500}
    assert _cond().describe(snap, pred) == "want <500 lx; Lounge: 320 lx ✓"


def test_describe_predicate_missing_sensor_not_found() -> None:
    pred = {"sensors": ["sensor.gone"], "min": 0, "max": 10}
    assert _cond().describe(_snap(), pred) == "want 0-10 lx; sensor.gone: not found ✗"


def test_describe_predicate_unavailable_sensor_says_unavailable() -> None:
    # Sensor IS in the snapshot but its reading is non-finite (e.g. "unavailable").
    snap = _snap({"sensor.dim": None}, names={"sensor.dim": "Dim"})
    pred = {"sensors": ["sensor.dim"], "min": 0, "max": 10}
    assert _cond().describe(snap, pred) == "want 0-10 lx; Dim: unavailable ✗"


def test_describe_predicate_empty_sensors_is_wildcard() -> None:
    snap = _snap({"sensor.a": 5.0}, names={"sensor.a": "Lounge"})
    assert _cond().describe(snap, {"sensors": []}) == "any sensor (no constraint)"


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
    ],
)
def test_validate_rejects_value_error(bad) -> None:
    with pytest.raises(ValueError):
        _cond().validate_predicate(bad)


def test_validate_rejects_negative_min() -> None:
    with pytest.raises(AmbienceError) as exc:
        _cond().validate_predicate({"sensors": ["sensor.a"], "min": -1})
    assert exc.value.translation_key == "lux_negative"


def test_lux_validate_predicate_allows_unknown_range() -> None:
    LuxCondition(range_lookup=lambda: {}).validate_predicate(
        {"sensors": ["sensor.x"], "range": "gone"}
    )  # must not raise


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


def test_matches_non_dict_is_false() -> None:
    assert _cond().matches("not-a-dict", _snap()) is False


def test_describe_non_dict_predicate_is_none() -> None:
    assert _cond().describe(_snap(), "not-a-dict") is None


def test_describe_predicate_unknown_range_reports_it() -> None:
    snap = _snap({"sensor.a": 5.0}, names={"sensor.a": "Lounge"})
    pred = {"sensors": ["sensor.a"], "range": "nope"}
    assert _cond().describe(snap, pred) == "unknown lux range: 'nope'"


def test_describe_predicate_unbounded_band_omits_want() -> None:
    # No min/max/range: the band is open at both ends (_fmt_band -> ""), so there
    # is nothing to state — describe shows just the reading.
    snap = _snap({"sensor.a": 320.0}, names={"sensor.a": "Lounge"})
    assert _cond().describe(snap, {"sensors": ["sensor.a"]}) == "Lounge: 320 lx ✓"


def test_validate_non_dict_predicate_raises() -> None:
    with pytest.raises(ValueError, match="lux predicate must be a dict"):
        _cond().validate_predicate("not-a-dict")


def test_validate_accepts_inline_band_without_sensors() -> None:
    # `sensors` absent (None): the per-entry loop is skipped; the inline band
    # still validates.
    _cond().validate_predicate({"min": 10, "max": 50})


def test_trigger_deps_non_dict_is_empty() -> None:
    assert _cond().trigger_deps("not-a-dict").entities == frozenset()


def test_is_constraining_only_when_sensors_present() -> None:
    m = _cond()
    assert m.is_constraining({"sensors": ["sensor.a"]}) is True
    assert m.is_constraining({"sensors": []}) is False
    assert m.is_constraining("not-a-dict") is False


def test_contains_non_dict_is_false() -> None:
    m = _cond()
    assert m.contains("x", {"sensors": ["sensor.a"]}) is False
    assert m.contains({"sensors": ["sensor.a"]}, "x") is False


def test_contains_unknown_range_is_false() -> None:
    # A referenced range that no longer resolves means containment can't be
    # proven — be conservative.
    m = _cond()
    outer = {"sensors": ["sensor.a"], "range": "nope"}
    inner = {"sensors": ["sensor.a"], "min": 0, "max": 10}
    assert m.contains(outer, inner) is False


def test_contains_all_over_more_sensors_within_all_over_fewer() -> None:
    m = _cond()
    outer = {"sensors": ["sensor.a", "sensor.b"], "min": 0, "max": 100, "quant": "all"}
    inner = {
        "sensors": ["sensor.a", "sensor.b", "sensor.c"],
        "min": 0,
        "max": 100,
        "quant": "all",
    }
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


# ---------------------------------------------------------------------------
# unconfigured_reason — lines 133-138
# ---------------------------------------------------------------------------


def test_unconfigured_reason_dangling_range_returns_reason() -> None:
    """A range id that is no longer in the lookup → descriptive reason string."""
    m = LuxCondition(range_lookup=lambda: {})
    snap = _snap()
    reason = m.unconfigured_reason({"sensors": ["sensor.a"], "range": "gone"}, snap)
    assert reason is not None
    assert "gone" in reason


def test_unconfigured_reason_known_range_returns_none() -> None:
    """A range id that IS in the lookup → None."""
    from custom_components.ambience.lux_ranges import BUILTIN_LUX_RANGES

    m = LuxCondition(range_lookup=lambda: BUILTIN_LUX_RANGES)
    snap = _snap()
    assert m.unconfigured_reason({"sensors": ["sensor.a"], "range": "dark"}, snap) is None


def test_unconfigured_reason_no_range_key_returns_none() -> None:
    """A predicate without a 'range' key (inline band) → None."""
    m = LuxCondition(range_lookup=lambda: {})
    snap = _snap()
    assert m.unconfigured_reason({"sensors": ["sensor.a"], "min": 0, "max": 100}, snap) is None


def test_unconfigured_reason_non_string_rid_returns_none() -> None:
    """A non-string range id is not flagged as dangling."""
    m = LuxCondition(range_lookup=lambda: {})
    snap = _snap()
    # range is an integer, not a string — must not flag it
    assert m.unconfigured_reason({"sensors": ["sensor.a"], "range": 42}, snap) is None


def test_unconfigured_reason_numeric_sensor_returns_none() -> None:
    """A referenced sensor that does report a number → no reason."""
    m = LuxCondition(range_lookup=lambda: {})
    snap = _snap(sensors={"sensor.a": 5.0})
    assert m.unconfigured_reason({"sensors": ["sensor.a"], "min": 0, "max": 100}, snap) is None


def test_unconfigured_reason_ignores_unreferenced_non_numeric_sensor() -> None:
    """Only the sensors THIS predicate references can explain its miss."""
    m = LuxCondition(range_lookup=lambda: {})
    snap = _snap(sensors={"sensor.b": None}, non_numeric={"sensor.b": "foo"})
    assert m.unconfigured_reason({"sensors": ["sensor.a"], "min": 0, "max": 100}, snap) is None


def test_unconfigured_reason_non_numeric_falls_back_to_entity_id() -> None:
    """No friendly_name in the snapshot → the reason names the entity_id."""
    m = LuxCondition(range_lookup=lambda: {})
    snap = _snap(sensors={"sensor.a": None}, non_numeric={"sensor.a": "foo"})
    reason = m.unconfigured_reason({"sensors": ["sensor.a"]}, snap)
    assert reason == "sensor.a ('foo') does not report a number"


def test_unconfigured_reason_none_predicate_returns_none() -> None:
    """None predicate (match-anything) → None."""
    m = LuxCondition(range_lookup=lambda: {})
    assert m.unconfigured_reason(None, _snap()) is None


def test_unconfigured_reason_non_dict_predicate_returns_none() -> None:
    """Non-dict predicate → None (no 'range' key possible)."""
    m = LuxCondition(range_lookup=lambda: {})
    assert m.unconfigured_reason("not-a-dict", _snap()) is None


# ---------------------------------------------------------------------------
# negate — "is not" inverts the whole match (mirrors occupancy)
# ---------------------------------------------------------------------------


def test_validate_accepts_negate_bool() -> None:
    _cond().validate_predicate({"sensors": ["sensor.a"], "range": "dark", "negate": True})


def test_validate_rejects_non_bool_negate() -> None:
    with pytest.raises(ValueError, match="negate"):
        _cond().validate_predicate({"sensors": ["sensor.a"], "range": "dark", "negate": "yes"})


def test_matches_negate_inverts_single_sensor() -> None:
    m = _cond()
    pred = {"sensors": ["sensor.a"], "range": "dark", "negate": True}
    # 5 lx IS dark -> "is not dark" is False
    assert m.matches(pred, _snap({"sensor.a": 5.0})) is False
    # 500 lx is NOT dark -> "is not dark" is True
    assert m.matches(pred, _snap({"sensor.a": 500.0})) is True


def test_matches_negate_keeps_unobservable_a_miss() -> None:
    # An unobservable sensor must not be flipped into a spurious "is not" match.
    pred = {"sensors": ["sensor.a"], "range": "dark", "negate": True}
    assert _cond().matches(pred, _snap({"sensor.a": None})) is False


def test_matches_negate_with_quant_all() -> None:
    # a dark, b bright -> "all dark" is False -> "not all dark" is True
    snap = _snap({"sensor.a": 5.0, "sensor.b": 500.0})
    pred = {"sensors": ["sensor.a", "sensor.b"], "range": "dark", "quant": "all", "negate": True}
    assert _cond().matches(pred, snap) is True


def test_contains_negated_predicate_never_nests() -> None:
    m = _cond()
    outer = {"sensors": ["sensor.a"], "min": 0, "max": 1000, "negate": True}
    inner = {"sensors": ["sensor.a"], "min": 100, "max": 500}
    assert m.contains(outer, inner) is False
    # inner negated: a complement does not nest under the band/sensor lattice.
    assert m.contains(inner, {**inner, "negate": True}) is False


def test_describe_predicate_negate_wraps_in_not() -> None:
    snap = _snap({"sensor.a": 500.0}, names={"sensor.a": "Lounge"})
    pred = {"sensors": ["sensor.a"], "min": 0, "max": 10, "negate": True}
    assert _cond().describe(snap, pred) == "want 0-10 lx; not(Lounge: 500 lx ✗)"
