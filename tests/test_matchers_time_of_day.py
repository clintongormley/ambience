"""TimeOfDayMatcher — structured JSON predicate format."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.ambience.matchers.time_of_day import (
    TimeOfDayMatcher,
    TimeOfDaySnapshot,
)
from custom_components.ambience.periods import BUILTIN_PERIODS


@pytest.fixture(autouse=True)
def force_utc_timezone():
    """Force dt_util's default timezone to UTC for the duration of each test.

    The hass fixture sets it to US/Pacific; absolute-time endpoint tests must
    compare against UTC-anchored datetimes so we pin it back here.
    """
    orig = dt_util.DEFAULT_TIME_ZONE
    dt_util.DEFAULT_TIME_ZONE = UTC
    yield
    dt_util.DEFAULT_TIME_ZONE = orig


def _build_snapshot(now: datetime, **overrides: datetime) -> TimeOfDaySnapshot:
    base = datetime(2026, 5, 13, tzinfo=UTC)
    defaults = {
        "now": now,
        "sunrise": base.replace(hour=6),
        "sunset": base.replace(hour=18),
        "noon": base.replace(hour=12),
        "midnight": base.replace(hour=0),
        "dawn": base.replace(hour=5, minute=30),
        "dusk": base.replace(hour=18, minute=30),
    }
    defaults.update(overrides)
    return TimeOfDaySnapshot(**defaults)


def _matcher(periods: dict[str, dict[str, Any]] | None = None) -> TimeOfDayMatcher:
    """Build a matcher whose period_lookup returns the given periods dict
    (defaults to BUILTIN_PERIODS)."""
    effective = periods if periods is not None else dict(BUILTIN_PERIODS)
    return TimeOfDayMatcher(period_lookup=lambda: effective)


# ── snapshot ────────────────────────────────────────────────────────────────


async def test_snapshot_returns_today_anchors(hass: HomeAssistant) -> None:
    next_rising = (datetime.now(UTC) + timedelta(hours=1)).isoformat()
    next_setting = (datetime.now(UTC) + timedelta(hours=12)).isoformat()
    next_dawn = (datetime.now(UTC) + timedelta(minutes=30)).isoformat()
    next_dusk = (datetime.now(UTC) + timedelta(hours=13)).isoformat()
    next_noon = (datetime.now(UTC) + timedelta(hours=6)).isoformat()
    next_midnight = (datetime.now(UTC) + timedelta(hours=18)).isoformat()
    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {
            "next_rising": next_rising,
            "next_setting": next_setting,
            "next_dawn": next_dawn,
            "next_dusk": next_dusk,
            "next_noon": next_noon,
            "next_midnight": next_midnight,
        },
    )
    snap = await _matcher().snapshot(hass)
    for field in ("now", "sunrise", "sunset", "dawn", "dusk", "noon", "midnight"):
        assert getattr(snap, field).tzinfo is not None


async def test_snapshot_raises_when_sun_unavailable(hass: HomeAssistant) -> None:
    with pytest.raises(RuntimeError, match="sun.sun"):
        await _matcher().snapshot(hass)


async def test_snapshot_raises_when_attribute_missing(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {
            "next_setting": "2026-05-13T18:00:00+00:00",
            "next_dawn": "2026-05-13T05:30:00+00:00",
            "next_dusk": "2026-05-13T18:30:00+00:00",
            "next_noon": "2026-05-13T12:00:00+00:00",
            "next_midnight": "2026-05-13T00:00:00+00:00",
        },
    )
    with pytest.raises(RuntimeError, match="next_rising"):
        await _matcher().snapshot(hass)


# ── matches: explicit ranges ────────────────────────────────────────────────


def _time(hh: int, mm: int) -> dict:
    return {"kind": "time", "hh": hh, "mm": mm}


def _sun(anchor: str, offset_min: int = 0) -> dict:
    return {"kind": "sun", "anchor": anchor, "offset_min": offset_min}


def _range(from_ep: dict, to_ep: dict) -> dict:
    return {"from": from_ep, "to": to_ep}


def test_matches_absolute_range_inside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 0, tzinfo=UTC))
    assert _matcher().matches(_range(_time(16, 0), _time(18, 30)), snap) is True


def test_matches_absolute_range_outside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 15, 0, tzinfo=UTC))
    assert _matcher().matches(_range(_time(16, 0), _time(18, 30)), snap) is False


def test_matches_absolute_range_wraps_midnight() -> None:
    m = _matcher()
    pred = _range(_time(22, 0), _time(2, 0))
    assert m.matches(pred, _build_snapshot(datetime(2026, 5, 13, 1, 0, tzinfo=UTC))) is True
    assert m.matches(pred, _build_snapshot(datetime(2026, 5, 13, 3, 0, tzinfo=UTC))) is False


def test_matches_sun_relative_range_inside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 18, 15, tzinfo=UTC))
    assert _matcher().matches(_range(_sun("sunset"), _sun("dusk")), snap) is True


def test_matches_sun_relative_range_outside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 19, 0, tzinfo=UTC))
    assert _matcher().matches(_range(_sun("sunset"), _sun("dusk")), snap) is False


def test_matches_sun_relative_with_negative_offset() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 45, tzinfo=UTC))
    assert _matcher().matches(_range(_sun("sunset", -30), _time(22, 0)), snap) is True


def test_matches_sun_relative_with_positive_offset_hours() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 14, 0, tzinfo=UTC))
    assert _matcher().matches(_range(_sun("noon", 60), _sun("sunset")), snap) is True


# ── matches: named periods ─────────────────────────────────────────────────


@pytest.mark.parametrize(
    "period,now_hour,now_minute,expected",
    [
        ("morning", 7, 0, True),
        ("morning", 6, 0, True),  # morning now starts at sunrise (06:00)
        ("morning", 11, 30, True),  # ...and runs to noon (12:00)
        ("morning", 12, 0, False),  # noon is exclusive end
        ("afternoon", 14, 0, True),
        ("afternoon", 18, 0, False),
        ("afternoon", 12, 0, False),  # afternoon starts at noon+1m
        ("evening", 18, 15, True),
        ("evening", 19, 0, False),
        ("daytime", 12, 0, True),
        ("daytime", 19, 0, False),
        ("nighttime", 22, 0, True),
        ("nighttime", 4, 0, True),
        ("nighttime", 10, 0, False),
    ],
)
def test_matches_named_period(period: str, now_hour: int, now_minute: int, expected: bool) -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, now_hour, now_minute, tzinfo=UTC))
    assert _matcher().matches({"period": period}, snap) is expected, period


def test_matches_custom_period_via_lookup() -> None:
    custom = {**BUILTIN_PERIODS, "wind_down": _range(_time(20, 0), _time(22, 0))}
    snap = _build_snapshot(datetime(2026, 5, 13, 21, 0, tzinfo=UTC))
    assert _matcher(custom).matches({"period": "wind_down"}, snap) is True


def test_matches_custom_shadows_builtin() -> None:
    custom = {**BUILTIN_PERIODS, "afternoon": _range(_time(13, 0), _time(17, 0))}
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 15, tzinfo=UTC))
    assert _matcher(custom).matches({"period": "afternoon"}, snap) is False


def test_matches_missing_period_raises_loudly() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    with pytest.raises(ValueError, match="unknown time_of_day period"):
        _matcher().matches({"period": "nonexistent"}, snap)


# ── matches: OR lists ──────────────────────────────────────────────────────


def test_matches_list_any() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 14, 0, tzinfo=UTC))
    assert _matcher().matches([{"period": "evening"}, {"period": "afternoon"}], snap) is True


def test_matches_list_none() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 10, 0, tzinfo=UTC))
    assert _matcher().matches([{"period": "evening"}, {"period": "afternoon"}], snap) is False


def test_matches_list_mixed_period_and_range() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 0, tzinfo=UTC))
    pred = [{"period": "evening"}, _range(_time(16, 0), _time(18, 30))]
    assert _matcher().matches(pred, snap) is True


# ── validate_predicate ─────────────────────────────────────────────────────


@pytest.mark.parametrize(
    "pred",
    [
        {"period": "morning"},
        _range(_time(16, 0), _time(18, 30)),
        _range(_sun("sunset", -30), _time(22, 0)),
        _range(_sun("sunrise"), _sun("sunset")),
        [{"period": "evening"}, _range(_time(16, 0), _time(18, 30))],
    ],
)
def test_validate_predicate_accepts_valid(pred: Any) -> None:
    _matcher().validate_predicate(pred)


@pytest.mark.parametrize(
    "pred",
    [
        "old_string_format",
        42,
        None,
        {},
        {"period": 123},
        {"from": _time(8, 0)},
        _range({"kind": "time", "hh": 25, "mm": 0}, _time(10, 0)),
        _range(_sun("zenith"), _sun("sunset")),
        [],
        [{"period": "evening"}, "garbage"],
    ],
)
def test_validate_predicate_rejects_invalid(pred: Any) -> None:
    with pytest.raises(ValueError):
        _matcher().validate_predicate(pred)


def test_validate_predicate_rejects_missing_period() -> None:
    with pytest.raises(ValueError, match="unknown time_of_day period"):
        _matcher().validate_predicate({"period": "nonexistent"})


# ── describe ───────────────────────────────────────────────────────────────


def test_describe_returns_named_period_when_matching() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 14, 0, tzinfo=UTC))
    assert _matcher().describe(snap) == "afternoon"


def test_describe_returns_none_if_no_period_matches() -> None:
    impossible = _build_snapshot(
        now=datetime(2026, 5, 13, 12, 0, tzinfo=UTC),
        sunrise=datetime(2026, 5, 13, 0, 0, tzinfo=UTC),
        sunset=datetime(2026, 5, 13, 4, 0, tzinfo=UTC),
        noon=datetime(2026, 5, 13, 2, 0, tzinfo=UTC),
        midnight=datetime(2026, 5, 13, 0, 0, tzinfo=UTC),
        dawn=datetime(2026, 5, 13, 6, 0, tzinfo=UTC),
        dusk=datetime(2026, 5, 13, 5, 0, tzinfo=UTC),
    )
    assert _matcher().describe(impossible) is None


# ── contains ───────────────────────────────────────────────────────────────


def test_contains_nested_range() -> None:
    m = _matcher()
    wide = _range(_time(10, 0), _time(14, 0))
    narrow = _range(_time(12, 0), _time(13, 0))
    assert m.contains(wide, narrow) is True
    assert m.contains(narrow, wide) is False


def test_contains_equal_range() -> None:
    m = _matcher()
    rng = _range(_time(10, 0), _time(14, 0))
    assert m.contains(rng, rng) is True


def test_contains_disjoint() -> None:
    m = _matcher()
    assert (
        m.contains(_range(_time(8, 0), _time(10, 0)), _range(_time(18, 0), _time(19, 0))) is False
    )


def test_contains_partial_overlap_neither_contains() -> None:
    m = _matcher()
    assert (
        m.contains(_range(_time(10, 0), _time(12, 0)), _range(_time(11, 0), _time(13, 0))) is False
    )


def test_contains_wrap_midnight() -> None:
    m = _matcher()
    assert m.contains(_range(_time(22, 0), _time(2, 0)), _range(_time(23, 0), _time(1, 0))) is True
    assert m.contains(_range(_time(23, 0), _time(1, 0)), _range(_time(22, 0), _time(2, 0))) is False


def test_contains_named_period() -> None:
    m = _matcher()
    assert m.contains({"period": "daytime"}, {"period": "afternoon"}) is True


def test_contains_list_predicate_union() -> None:
    m = _matcher()
    outer = [_range(_time(10, 0), _time(12, 0)), _range(_time(11, 0), _time(14, 0))]
    inner = _range(_time(11, 30), _time(13, 0))
    assert m.contains(outer, inner) is True


def test_contains_full_day_predicate() -> None:
    m = _matcher()
    full = _range(_time(0, 0), _time(0, 0))
    assert m.contains(full, _range(_time(12, 0), _time(13, 0))) is True
    assert m.contains(_range(_time(12, 0), _time(13, 0)), full) is False


# ── order_key ──────────────────────────────────────────────────────────────


def test_order_key_is_start_minute_of_day() -> None:
    m = _matcher()
    assert m.order_key(_range(_time(8, 0), _time(10, 0))) == 480
    assert m.order_key(_range(_time(18, 0), _time(19, 0))) == 1080


def test_order_key_list_takes_earliest_start() -> None:
    m = _matcher()
    pred = [_range(_time(18, 0), _time(19, 0)), _range(_time(8, 0), _time(10, 0))]
    assert m.order_key(pred) == 480


def test_order_key_named_period() -> None:
    assert _matcher().order_key({"period": "nighttime"}) == 1110.0


# ── matcher metadata ───────────────────────────────────────────────────────


def test_input_attribute_signals_dedicated_widget() -> None:
    assert _matcher().input == "time_of_day"


def test_matcher_exposes_description() -> None:
    assert _matcher().description.strip() != ""


def test_priority() -> None:
    assert _matcher().priority == 100


def test_absolute_time_uses_local_tz_for_date(hass: HomeAssistant) -> None:
    """An absolute time {kind: time, hh: 16, mm: 0} is interpreted as 16:00
    in HA's local timezone, not UTC. With HA's default test tz (UTC), this
    means 16:00Z. If a non-UTC tz is configured, the resolved start would
    be 16:00 in that tz."""
    # Test that the resolved time is in the local tz (UTC in tests by default)
    from custom_components.ambience.matchers.time_of_day import TimeOfDayMatcher

    matcher = TimeOfDayMatcher(period_lookup=lambda: {})
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 0, tzinfo=UTC))
    assert (
        matcher.matches(
            {
                "from": {"kind": "time", "hh": 16, "mm": 0},
                "to": {"kind": "time", "hh": 18, "mm": 30},
            },
            snap,
        )
        is True
    )
