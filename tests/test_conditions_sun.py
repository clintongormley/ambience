"""SunCondition — elevation + azimuth angular-position predicate."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.sun import (
    SunCondition,
    SunSnapshot,
    _in_arc,
    _sector_label,
)
from custom_components.ambience.errors import AmbienceError


def _snap(elevation: float | None = 0.0, azimuth: float | None = 180.0) -> SunSnapshot:
    return SunSnapshot(elevation=elevation, azimuth=azimuth)


# ── protocol fields ──────────────────────────────────────────────────────────


def test_protocol_fields() -> None:
    m = SunCondition()
    assert m.name == "sun"
    assert m.input == "sun_predicate"
    assert m.priority == 750
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


# ── snapshot ─────────────────────────────────────────────────────────────────


async def test_snapshot_reads_elevation_and_azimuth(hass: HomeAssistant) -> None:
    hass.states.async_set("sun.sun", "above_horizon", {"elevation": 23.4, "azimuth": 187.6})
    snap = await SunCondition().snapshot(hass)
    assert snap.elevation == 23.4
    assert snap.azimuth == 187.6


async def test_snapshot_missing_entity(hass: HomeAssistant) -> None:
    snap = await SunCondition().snapshot(hass)
    assert snap.elevation is None
    assert snap.azimuth is None


async def test_snapshot_missing_attributes(hass: HomeAssistant) -> None:
    hass.states.async_set("sun.sun", "above_horizon", {})
    snap = await SunCondition().snapshot(hass)
    assert snap.elevation is None
    assert snap.azimuth is None


async def test_snapshot_unavailable(hass: HomeAssistant) -> None:
    hass.states.async_set("sun.sun", "unavailable", {})
    snap = await SunCondition().snapshot(hass)
    assert snap.elevation is None
    assert snap.azimuth is None


# ── matches: wildcards ───────────────────────────────────────────────────────


def test_matches_none_is_wildcard() -> None:
    assert SunCondition().matches(None, _snap()) is True


def test_matches_non_dict_is_false() -> None:
    assert SunCondition().matches(42, _snap()) is False


# ── matches: elevation ───────────────────────────────────────────────────────


def test_matches_elevation_above() -> None:
    m = SunCondition()
    pred = {"elevation": {"min": 10}}
    assert m.matches(pred, _snap(elevation=20)) is True
    assert m.matches(pred, _snap(elevation=5)) is False
    assert m.matches(pred, _snap(elevation=10)) is True  # inclusive


def test_matches_elevation_below() -> None:
    m = SunCondition()
    pred = {"elevation": {"max": 30}}
    assert m.matches(pred, _snap(elevation=20)) is True
    assert m.matches(pred, _snap(elevation=40)) is False
    assert m.matches(pred, _snap(elevation=30)) is True  # inclusive


def test_matches_elevation_between() -> None:
    m = SunCondition()
    pred = {"elevation": {"min": 0, "max": 30}}
    assert m.matches(pred, _snap(elevation=15)) is True
    assert m.matches(pred, _snap(elevation=-5)) is False
    assert m.matches(pred, _snap(elevation=35)) is False


def test_matches_elevation_missing_snapshot_is_false() -> None:
    assert SunCondition().matches({"elevation": {"min": 0}}, _snap(elevation=None)) is False


# ── matches: azimuth ─────────────────────────────────────────────────────────


def test_matches_azimuth_single_sector() -> None:
    m = SunCondition()
    pred = {"azimuth": {"sectors": ["S"]}}
    assert m.matches(pred, _snap(azimuth=180)) is True
    assert m.matches(pred, _snap(azimuth=270)) is False


def test_matches_azimuth_multiple_sectors() -> None:
    m = SunCondition()
    pred = {"azimuth": {"sectors": ["W", "SW"]}}
    assert m.matches(pred, _snap(azimuth=270)) is True  # W
    assert m.matches(pred, _snap(azimuth=225)) is True  # SW
    assert m.matches(pred, _snap(azimuth=90)) is False  # E


def test_matches_azimuth_custom_range() -> None:
    m = SunCondition()
    pred = {"azimuth": {"ranges": [{"from": 200, "to": 250}]}}
    assert m.matches(pred, _snap(azimuth=225)) is True
    assert m.matches(pred, _snap(azimuth=260)) is False


def test_matches_azimuth_wraparound_range() -> None:
    m = SunCondition()
    pred = {"azimuth": {"ranges": [{"from": 350, "to": 20}]}}
    assert m.matches(pred, _snap(azimuth=355)) is True
    assert m.matches(pred, _snap(azimuth=10)) is True
    assert m.matches(pred, _snap(azimuth=0)) is True
    assert m.matches(pred, _snap(azimuth=100)) is False


def test_matches_azimuth_north_sector_wraps() -> None:
    m = SunCondition()
    pred = {"azimuth": {"sectors": ["N"]}}
    assert m.matches(pred, _snap(azimuth=0)) is True
    assert m.matches(pred, _snap(azimuth=350)) is True
    assert m.matches(pred, _snap(azimuth=10)) is True
    assert m.matches(pred, _snap(azimuth=90)) is False


def test_matches_azimuth_sectors_or_ranges_union() -> None:
    m = SunCondition()
    pred = {"azimuth": {"sectors": ["S"], "ranges": [{"from": 60, "to": 70}]}}
    assert m.matches(pred, _snap(azimuth=180)) is True  # sector
    assert m.matches(pred, _snap(azimuth=65)) is True  # range
    assert m.matches(pred, _snap(azimuth=300)) is False


def test_matches_azimuth_missing_snapshot_is_false() -> None:
    assert SunCondition().matches({"azimuth": {"sectors": ["S"]}}, _snap(azimuth=None)) is False


# ── matches: combined AND ────────────────────────────────────────────────────


def test_matches_elevation_and_azimuth_anded() -> None:
    m = SunCondition()
    pred = {"elevation": {"max": 20}, "azimuth": {"sectors": ["W"]}}
    assert m.matches(pred, _snap(elevation=15, azimuth=270)) is True
    assert m.matches(pred, _snap(elevation=15, azimuth=180)) is False  # wrong azimuth
    assert m.matches(pred, _snap(elevation=30, azimuth=270)) is False  # too high


# ── validate_predicate ───────────────────────────────────────────────────────


def test_validate_accepts_none() -> None:
    SunCondition().validate_predicate(None)


def test_validate_accepts_well_formed() -> None:
    m = SunCondition()
    m.validate_predicate({"elevation": {"min": 0, "max": 30}})
    m.validate_predicate({"azimuth": {"sectors": ["W", "SW"]}})
    m.validate_predicate({"azimuth": {"ranges": [{"from": 350, "to": 20}]}})
    m.validate_predicate({"elevation": {"min": 10}, "azimuth": {"sectors": ["S"]}})


@pytest.mark.parametrize(
    "predicate,key",
    [
        (42, "sun_predicate_not_object"),
        ("nope", "sun_predicate_not_object"),
        ({}, "sun_needs_axis"),  # empty — must have elevation or azimuth
        ({"elevation": {"min": -100}}, "sun_elevation_out_of_range"),  # below -90
        ({"elevation": {"max": 100}}, "sun_elevation_out_of_range"),  # above 90
        ({"elevation": {"min": 30, "max": 10}}, "sun_elevation_min_above_max"),
        ({"elevation": {"min": "hot"}}, "sun_elevation_not_number"),
        ({"elevation": {}}, "sun_elevation_needs_bound"),  # neither bound
        ({"elevation": "high"}, "sun_elevation_not_object"),
        ({"azimuth": {}}, "sun_azimuth_needs_sector_or_range"),
        ({"azimuth": "south"}, "sun_azimuth_not_object"),
        ({"azimuth": {"sectors": ["X"]}}, "sun_azimuth_unknown_sector"),  # bad label
        ({"azimuth": {"sectors": "S"}}, "sun_azimuth_sectors_not_list"),
        ({"azimuth": {"ranges": "bad"}}, "sun_azimuth_ranges_not_list"),
        # 360 is out of [0, 360)
        ({"azimuth": {"ranges": [{"from": 0, "to": 360}]}}, "sun_azimuth_out_of_range"),
        ({"azimuth": {"ranges": [{"from": -1, "to": 90}]}}, "sun_azimuth_out_of_range"),
        ({"azimuth": {"ranges": [{"from": 0}]}}, "sun_azimuth_bound_not_number"),  # missing to
        ({"azimuth": {"ranges": ["not-a-dict"]}}, "sun_azimuth_range_not_object"),
    ],
)
def test_validate_rejects(predicate, key) -> None:
    with pytest.raises(AmbienceError) as exc:
        SunCondition().validate_predicate(predicate)
    assert exc.value.translation_key == key


# ── describe ─────────────────────────────────────────────────────────────────


def test_describe_includes_elevation_azimuth_and_nearest_sector() -> None:
    out = SunCondition().describe(_snap(elevation=23, azimuth=187))
    assert out is not None
    assert "23" in out
    assert "187" in out
    assert "S" in out  # 187° → South sector


def test_describe_nearest_sector_wraps_north() -> None:
    assert "N" in SunCondition().describe(_snap(elevation=5, azimuth=359))


def test_describe_none_when_no_data() -> None:
    assert SunCondition().describe(_snap(elevation=None, azimuth=None)) is None


def test_describe_elevation_only() -> None:
    """Only elevation present — azimuth branch is skipped (covers 115->117 miss)."""
    out = SunCondition().describe(_snap(elevation=15, azimuth=None))
    assert out is not None
    assert "15" in out
    assert "azimuth" not in out


def test_describe_azimuth_only() -> None:
    """Only azimuth present — elevation branch is skipped (covers 117->120 miss)."""
    out = SunCondition().describe(_snap(elevation=None, azimuth=90))
    assert out is not None
    assert "90" in out
    assert "elevation" not in out


# ── contains: elevation ──────────────────────────────────────────────────────


def test_contains_elevation_interval_nesting() -> None:
    m = SunCondition()
    above0 = {"elevation": {"min": 0}}
    above10 = {"elevation": {"min": 10}}
    above30 = {"elevation": {"min": 30}}
    assert m.contains(above0, above10) is True
    assert m.contains(above10, above30) is True
    assert m.contains(above30, above0) is False


def test_contains_elevation_band_within_band() -> None:
    m = SunCondition()
    wide = {"elevation": {"min": 0, "max": 40}}
    narrow = {"elevation": {"min": 10, "max": 30}}
    assert m.contains(wide, narrow) is True
    assert m.contains(narrow, wide) is False


def test_contains_absent_elevation_is_full_range() -> None:
    m = SunCondition()
    # outer with no elevation key contains any elevation constraint
    assert (
        m.contains(
            {"azimuth": {"sectors": ["S"]}},
            {"elevation": {"min": 10}, "azimuth": {"sectors": ["S"]}},
        )
        is True
    )
    # inner with no elevation key is NOT contained by a bounded outer
    assert (
        m.contains(
            {"elevation": {"min": 10}, "azimuth": {"sectors": ["S"]}},
            {"azimuth": {"sectors": ["S"]}},
        )
        is False
    )


# ── contains: azimuth ────────────────────────────────────────────────────────


def test_contains_azimuth_sector_within_range() -> None:
    m = SunCondition()
    outer = {"azimuth": {"ranges": [{"from": 150, "to": 210}]}}
    inner = {"azimuth": {"sectors": ["S"]}}  # 157.5–202.5
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_azimuth_union() -> None:
    m = SunCondition()
    outer = {"azimuth": {"sectors": ["S", "SW"]}}
    inner = {"azimuth": {"sectors": ["SW"]}}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_azimuth_wraparound() -> None:
    m = SunCondition()
    outer = {"azimuth": {"ranges": [{"from": 340, "to": 30}]}}
    inner = {"azimuth": {"ranges": [{"from": 350, "to": 20}]}}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_absent_azimuth_is_full_circle() -> None:
    m = SunCondition()
    full = {"elevation": {"min": 0}}  # no azimuth key
    bounded = {"elevation": {"min": 0}, "azimuth": {"sectors": ["S"]}}
    assert m.contains(full, bounded) is True
    assert m.contains(bounded, full) is False


def test_contains_combined() -> None:
    m = SunCondition()
    outer = {"elevation": {"min": 0, "max": 40}, "azimuth": {"sectors": ["S", "SW", "W"]}}
    inner = {"elevation": {"min": 10, "max": 30}, "azimuth": {"sectors": ["SW"]}}
    assert m.contains(outer, inner) is True


def test_contains_disjoint_azimuth() -> None:
    m = SunCondition()
    assert m.contains({"azimuth": {"sectors": ["S"]}}, {"azimuth": {"sectors": ["N"]}}) is False


# ── order_key ────────────────────────────────────────────────────────────────


def test_order_key_uses_elevation_min() -> None:
    m = SunCondition()
    assert m.order_key({"elevation": {"min": 10}}) == 10
    assert m.order_key({"elevation": {"min": -5, "max": 5}}) == -5


def test_order_key_absent_elevation_min_is_neg_inf() -> None:
    m = SunCondition()
    assert m.order_key({"azimuth": {"sectors": ["S"]}}) == float("-inf")
    assert m.order_key({"elevation": {"max": 30}}) == float("-inf")


# ── trigger_deps ──────────────────────────────────────────────────────────────


def test_trigger_deps_watches_sun_entity_for_elevation() -> None:
    spec = SunCondition().trigger_deps({"elevation": {"min": 10}})
    assert spec.entities == frozenset({"sun.sun"})
    assert spec.duration_gates == frozenset()


def test_trigger_deps_watches_sun_entity_for_azimuth() -> None:
    spec = SunCondition().trigger_deps({"azimuth": {"sectors": ["S"]}})
    assert spec.entities == frozenset({"sun.sun"})


def test_trigger_deps_none_or_garbage_is_empty() -> None:
    from custom_components.ambience.triggers import EMPTY

    assert SunCondition().trigger_deps(None) == EMPTY
    assert SunCondition().trigger_deps("garbage") == EMPTY
    assert SunCondition().trigger_deps({}) == EMPTY


# ── _in_arc: non-numeric bounds ──────────────────────────────────────────────


def test_in_arc_non_numeric_lo_returns_false() -> None:
    """_in_arc returns False when lo or hi is not a number (covers line 204)."""
    assert _in_arc(180.0, None, 200.0) is False


def test_in_arc_non_numeric_hi_returns_false() -> None:
    """_in_arc returns False when hi is not a number (covers line 204)."""
    assert _in_arc(180.0, 100.0, "east") is False


# ── _azimuth_intervals: unknown sector / non-dict range / non-numeric bounds ─


def test_contains_azimuth_unknown_sector_is_skipped() -> None:
    """Unknown sector label in _azimuth_intervals yields no arc (covers 233->231).

    An inner predicate with an unknown sector has no matching intervals, so
    contains() returns True (vacuous — all-of-nothing is satisfied).
    """
    m = SunCondition()
    outer = {"azimuth": {"sectors": ["S", "W"]}}
    # "BOGUS" is not in SECTORS; _azimuth_intervals skips it → inner has no intervals
    inner = {"azimuth": {"sectors": ["BOGUS"]}}
    # all() over empty sequence is True
    assert m.contains(outer, inner) is True


def test_contains_azimuth_non_dict_range_is_skipped() -> None:
    """Non-dict item in ranges list is skipped in _azimuth_intervals (covers 236->235).

    After skipping, inner has no intervals → vacuously contained.
    """
    m = SunCondition()
    outer = {"azimuth": {"sectors": ["S"]}}
    inner = {"azimuth": {"ranges": ["not-a-dict"]}}
    assert m.contains(outer, inner) is True


def test_contains_azimuth_non_numeric_range_bounds_are_skipped() -> None:
    """Non-numeric from/to in a range dict is skipped (covers 238->235).

    After skipping, inner has no intervals → vacuously contained.
    """
    m = SunCondition()
    outer = {"azimuth": {"sectors": ["S"]}}
    inner = {"azimuth": {"ranges": [{"from": "east", "to": 90}]}}
    assert m.contains(outer, inner) is True


# ── _sector_label: no-match fallback ─────────────────────────────────────────


def test_sector_label_fallback_returns_N() -> None:
    """_sector_label returns 'N' when no sector arc matches (covers line 254).

    337.5 is the exact boundary between NW and N; since _in_arc is [lo, hi)
    NW = [292.5, 337.5) — 337.5 is not in NW, and N = [337.5, 22.5) wraps,
    so 337.5 should match N. Use a value that genuinely misses all arcs by
    calling _sector_label with a float that the coverage tool tracks as hitting
    line 254's return.  The only way to reach line 254 is if every SECTORS
    arc misses; we pass a non-float to force _in_arc to return False for all.
    We call _sector_label via monkey-patching _in_arc — but since we can't
    patch without modifying source, we verify the fallback indirectly: pass a
    value that would be rejected by every _in_arc call if lo/hi were swapped
    to trigger the False path.  The simplest approach: override SECTORS
    temporarily to an empty dict.
    """
    import custom_components.ambience.conditions.sun as sun_module

    original = sun_module.SECTORS
    try:
        sun_module.SECTORS = {}  # type: ignore[assignment]
        result = _sector_label(180.0)
    finally:
        sun_module.SECTORS = original
    assert result == "N"


def test_validate_predicate_accepts_identical_azimuth_range_endpoints() -> None:
    """from == to (an empty arc) is left valid — harmless at runtime, and
    rejecting it would block saving a scope holding such a config."""
    SunCondition().validate_predicate({"azimuth": {"ranges": [{"from": 90, "to": 90}]}})


async def test_snapshot_treats_non_finite_angles_as_unobservable(hass: HomeAssistant) -> None:
    """A NaN elevation would pass a min-only constraint (nan < lo is False →
    falls through); non-finite readings must snapshot as None instead."""
    hass.states.async_set(
        "sun.sun", "above_horizon", {"elevation": float("nan"), "azimuth": float("inf")}
    )
    snap = await SunCondition().snapshot(hass)
    assert snap.elevation is None
    assert snap.azimuth is None
