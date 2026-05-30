"""SunMatcher — elevation + azimuth angular-position predicate."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.matchers.sun import SunMatcher, SunSnapshot


def _snap(elevation: float | None = 0.0, azimuth: float | None = 180.0) -> SunSnapshot:
    return SunSnapshot(elevation=elevation, azimuth=azimuth)


# ── protocol fields ──────────────────────────────────────────────────────────


def test_protocol_fields() -> None:
    m = SunMatcher()
    assert m.name == "sun"
    assert m.input == "sun_predicate"
    assert m.priority == 250
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


# ── snapshot ─────────────────────────────────────────────────────────────────


async def test_snapshot_reads_elevation_and_azimuth(hass: HomeAssistant) -> None:
    hass.states.async_set("sun.sun", "above_horizon", {"elevation": 23.4, "azimuth": 187.6})
    snap = await SunMatcher().snapshot(hass)
    assert snap.elevation == 23.4
    assert snap.azimuth == 187.6


async def test_snapshot_missing_entity(hass: HomeAssistant) -> None:
    snap = await SunMatcher().snapshot(hass)
    assert snap.elevation is None
    assert snap.azimuth is None


async def test_snapshot_missing_attributes(hass: HomeAssistant) -> None:
    hass.states.async_set("sun.sun", "above_horizon", {})
    snap = await SunMatcher().snapshot(hass)
    assert snap.elevation is None
    assert snap.azimuth is None


async def test_snapshot_unavailable(hass: HomeAssistant) -> None:
    hass.states.async_set("sun.sun", "unavailable", {})
    snap = await SunMatcher().snapshot(hass)
    assert snap.elevation is None
    assert snap.azimuth is None


# ── matches: wildcards ───────────────────────────────────────────────────────


def test_matches_none_is_wildcard() -> None:
    assert SunMatcher().matches(None, _snap()) is True


def test_matches_non_dict_is_false() -> None:
    assert SunMatcher().matches(42, _snap()) is False


# ── matches: elevation ───────────────────────────────────────────────────────


def test_matches_elevation_above() -> None:
    m = SunMatcher()
    pred = {"elevation": {"min": 10}}
    assert m.matches(pred, _snap(elevation=20)) is True
    assert m.matches(pred, _snap(elevation=5)) is False
    assert m.matches(pred, _snap(elevation=10)) is True  # inclusive


def test_matches_elevation_below() -> None:
    m = SunMatcher()
    pred = {"elevation": {"max": 30}}
    assert m.matches(pred, _snap(elevation=20)) is True
    assert m.matches(pred, _snap(elevation=40)) is False
    assert m.matches(pred, _snap(elevation=30)) is True  # inclusive


def test_matches_elevation_between() -> None:
    m = SunMatcher()
    pred = {"elevation": {"min": 0, "max": 30}}
    assert m.matches(pred, _snap(elevation=15)) is True
    assert m.matches(pred, _snap(elevation=-5)) is False
    assert m.matches(pred, _snap(elevation=35)) is False


def test_matches_elevation_missing_snapshot_is_false() -> None:
    assert SunMatcher().matches({"elevation": {"min": 0}}, _snap(elevation=None)) is False


# ── matches: azimuth ─────────────────────────────────────────────────────────


def test_matches_azimuth_single_sector() -> None:
    m = SunMatcher()
    pred = {"azimuth": {"sectors": ["S"]}}
    assert m.matches(pred, _snap(azimuth=180)) is True
    assert m.matches(pred, _snap(azimuth=270)) is False


def test_matches_azimuth_multiple_sectors() -> None:
    m = SunMatcher()
    pred = {"azimuth": {"sectors": ["W", "SW"]}}
    assert m.matches(pred, _snap(azimuth=270)) is True  # W
    assert m.matches(pred, _snap(azimuth=225)) is True  # SW
    assert m.matches(pred, _snap(azimuth=90)) is False  # E


def test_matches_azimuth_custom_range() -> None:
    m = SunMatcher()
    pred = {"azimuth": {"ranges": [{"from": 200, "to": 250}]}}
    assert m.matches(pred, _snap(azimuth=225)) is True
    assert m.matches(pred, _snap(azimuth=260)) is False


def test_matches_azimuth_wraparound_range() -> None:
    m = SunMatcher()
    pred = {"azimuth": {"ranges": [{"from": 350, "to": 20}]}}
    assert m.matches(pred, _snap(azimuth=355)) is True
    assert m.matches(pred, _snap(azimuth=10)) is True
    assert m.matches(pred, _snap(azimuth=0)) is True
    assert m.matches(pred, _snap(azimuth=100)) is False


def test_matches_azimuth_north_sector_wraps() -> None:
    m = SunMatcher()
    pred = {"azimuth": {"sectors": ["N"]}}
    assert m.matches(pred, _snap(azimuth=0)) is True
    assert m.matches(pred, _snap(azimuth=350)) is True
    assert m.matches(pred, _snap(azimuth=10)) is True
    assert m.matches(pred, _snap(azimuth=90)) is False


def test_matches_azimuth_sectors_or_ranges_union() -> None:
    m = SunMatcher()
    pred = {"azimuth": {"sectors": ["S"], "ranges": [{"from": 60, "to": 70}]}}
    assert m.matches(pred, _snap(azimuth=180)) is True  # sector
    assert m.matches(pred, _snap(azimuth=65)) is True  # range
    assert m.matches(pred, _snap(azimuth=300)) is False


def test_matches_azimuth_missing_snapshot_is_false() -> None:
    assert SunMatcher().matches({"azimuth": {"sectors": ["S"]}}, _snap(azimuth=None)) is False


# ── matches: combined AND ────────────────────────────────────────────────────


def test_matches_elevation_and_azimuth_anded() -> None:
    m = SunMatcher()
    pred = {"elevation": {"max": 20}, "azimuth": {"sectors": ["W"]}}
    assert m.matches(pred, _snap(elevation=15, azimuth=270)) is True
    assert m.matches(pred, _snap(elevation=15, azimuth=180)) is False  # wrong azimuth
    assert m.matches(pred, _snap(elevation=30, azimuth=270)) is False  # too high


# ── validate_predicate ───────────────────────────────────────────────────────


def test_validate_accepts_none() -> None:
    SunMatcher().validate_predicate(None)


def test_validate_accepts_well_formed() -> None:
    m = SunMatcher()
    m.validate_predicate({"elevation": {"min": 0, "max": 30}})
    m.validate_predicate({"azimuth": {"sectors": ["W", "SW"]}})
    m.validate_predicate({"azimuth": {"ranges": [{"from": 350, "to": 20}]}})
    m.validate_predicate({"elevation": {"min": 10}, "azimuth": {"sectors": ["S"]}})


@pytest.mark.parametrize(
    "predicate",
    [
        42,
        "nope",
        {},  # empty — must have elevation or azimuth
        {"elevation": {"min": -100}},  # below -90
        {"elevation": {"max": 100}},  # above 90
        {"elevation": {"min": 30, "max": 10}},  # min > max
        {"elevation": {"min": "hot"}},  # non-numeric
        {"elevation": {}},  # neither bound
        {"azimuth": {}},  # neither sectors nor ranges
        {"azimuth": {"sectors": ["X"]}},  # bad label
        {"azimuth": {"sectors": "S"}},  # not a list
        {"azimuth": {"ranges": [{"from": 0, "to": 360}]}},  # 360 out of [0, 360)
        {"azimuth": {"ranges": [{"from": -1, "to": 90}]}},  # negative
        {"azimuth": {"ranges": [{"from": 0}]}},  # missing to
    ],
)
def test_validate_rejects(predicate) -> None:
    with pytest.raises(ValueError):
        SunMatcher().validate_predicate(predicate)


# ── describe ─────────────────────────────────────────────────────────────────


def test_describe_includes_elevation_azimuth_and_nearest_sector() -> None:
    out = SunMatcher().describe(_snap(elevation=23, azimuth=187))
    assert out is not None
    assert "23" in out
    assert "187" in out
    assert "S" in out  # 187° → South sector


def test_describe_nearest_sector_wraps_north() -> None:
    assert "N" in SunMatcher().describe(_snap(elevation=5, azimuth=359))


def test_describe_none_when_no_data() -> None:
    assert SunMatcher().describe(_snap(elevation=None, azimuth=None)) is None


# ── contains: elevation ──────────────────────────────────────────────────────


def test_contains_elevation_interval_nesting() -> None:
    m = SunMatcher()
    above0 = {"elevation": {"min": 0}}
    above10 = {"elevation": {"min": 10}}
    above30 = {"elevation": {"min": 30}}
    assert m.contains(above0, above10) is True
    assert m.contains(above10, above30) is True
    assert m.contains(above30, above0) is False


def test_contains_elevation_band_within_band() -> None:
    m = SunMatcher()
    wide = {"elevation": {"min": 0, "max": 40}}
    narrow = {"elevation": {"min": 10, "max": 30}}
    assert m.contains(wide, narrow) is True
    assert m.contains(narrow, wide) is False


def test_contains_absent_elevation_is_full_range() -> None:
    m = SunMatcher()
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
    m = SunMatcher()
    outer = {"azimuth": {"ranges": [{"from": 150, "to": 210}]}}
    inner = {"azimuth": {"sectors": ["S"]}}  # 157.5–202.5
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_azimuth_union() -> None:
    m = SunMatcher()
    outer = {"azimuth": {"sectors": ["S", "SW"]}}
    inner = {"azimuth": {"sectors": ["SW"]}}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_azimuth_wraparound() -> None:
    m = SunMatcher()
    outer = {"azimuth": {"ranges": [{"from": 340, "to": 30}]}}
    inner = {"azimuth": {"ranges": [{"from": 350, "to": 20}]}}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_absent_azimuth_is_full_circle() -> None:
    m = SunMatcher()
    full = {"elevation": {"min": 0}}  # no azimuth key
    bounded = {"elevation": {"min": 0}, "azimuth": {"sectors": ["S"]}}
    assert m.contains(full, bounded) is True
    assert m.contains(bounded, full) is False


def test_contains_combined() -> None:
    m = SunMatcher()
    outer = {"elevation": {"min": 0, "max": 40}, "azimuth": {"sectors": ["S", "SW", "W"]}}
    inner = {"elevation": {"min": 10, "max": 30}, "azimuth": {"sectors": ["SW"]}}
    assert m.contains(outer, inner) is True


def test_contains_disjoint_azimuth() -> None:
    m = SunMatcher()
    assert m.contains({"azimuth": {"sectors": ["S"]}}, {"azimuth": {"sectors": ["N"]}}) is False


# ── order_key ────────────────────────────────────────────────────────────────


def test_order_key_uses_elevation_min() -> None:
    m = SunMatcher()
    assert m.order_key({"elevation": {"min": 10}}) == 10
    assert m.order_key({"elevation": {"min": -5, "max": 5}}) == -5


def test_order_key_absent_elevation_min_is_neg_inf() -> None:
    m = SunMatcher()
    assert m.order_key({"azimuth": {"sectors": ["S"]}}) == float("-inf")
    assert m.order_key({"elevation": {"max": 30}}) == float("-inf")
