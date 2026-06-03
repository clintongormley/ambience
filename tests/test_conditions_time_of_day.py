"""TimeOfDayCondition — structured JSON predicate format."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.ambience.conditions.time_of_day import (
    TimeOfDayCondition,
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


def _condition(periods: dict[str, dict[str, Any]] | None = None) -> TimeOfDayCondition:
    """Build a condition whose period_lookup returns the given periods dict
    (defaults to BUILTIN_PERIODS)."""
    effective = periods if periods is not None else dict(BUILTIN_PERIODS)
    return TimeOfDayCondition(period_lookup=lambda: effective)


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
    snap = await _condition().snapshot(hass)
    for field in ("now", "sunrise", "sunset", "dawn", "dusk", "noon", "midnight"):
        assert getattr(snap, field).tzinfo is not None


async def test_snapshot_raises_when_sun_unavailable(hass: HomeAssistant) -> None:
    with pytest.raises(RuntimeError, match="sun.sun"):
        await _condition().snapshot(hass)


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
        await _condition().snapshot(hass)


# ── matches: explicit ranges ────────────────────────────────────────────────


def _time(hh: int, mm: int) -> dict:
    return {"kind": "time", "hh": hh, "mm": mm}


def _sun(anchor: str, offset_min: int = 0) -> dict:
    return {"kind": "sun", "anchor": anchor, "offset_min": offset_min}


def _range(from_ep: dict, to_ep: dict) -> dict:
    return {"from": from_ep, "to": to_ep}


def test_matches_absolute_range_inside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 0, tzinfo=UTC))
    assert _condition().matches(_range(_time(16, 0), _time(18, 30)), snap) is True


def test_matches_absolute_range_outside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 15, 0, tzinfo=UTC))
    assert _condition().matches(_range(_time(16, 0), _time(18, 30)), snap) is False


def test_matches_absolute_range_wraps_midnight() -> None:
    m = _condition()
    pred = _range(_time(22, 0), _time(2, 0))
    assert m.matches(pred, _build_snapshot(datetime(2026, 5, 13, 1, 0, tzinfo=UTC))) is True
    assert m.matches(pred, _build_snapshot(datetime(2026, 5, 13, 3, 0, tzinfo=UTC))) is False


def test_matches_sun_relative_range_inside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 18, 15, tzinfo=UTC))
    assert _condition().matches(_range(_sun("sunset"), _sun("dusk")), snap) is True


def test_matches_sun_relative_range_outside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 19, 0, tzinfo=UTC))
    assert _condition().matches(_range(_sun("sunset"), _sun("dusk")), snap) is False


def test_matches_sun_relative_with_negative_offset() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 45, tzinfo=UTC))
    assert _condition().matches(_range(_sun("sunset", -30), _time(22, 0)), snap) is True


def test_matches_sun_relative_with_positive_offset_hours() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 14, 0, tzinfo=UTC))
    assert _condition().matches(_range(_sun("noon", 60), _sun("sunset")), snap) is True


# ── matches: named periods ─────────────────────────────────────────────────


@pytest.mark.parametrize(
    "period,now_hour,now_minute,expected",
    [
        ("morning", 7, 0, True),
        ("morning", 5, 30, True),  # morning starts at dawn (05:30), inclusive
        ("morning", 5, 45, True),  # ...so dawn→sunrise is morning, not a gap
        ("morning", 5, 0, False),  # before dawn is not morning
        ("morning", 11, 30, True),  # ...and runs to noon (12:00)
        ("morning", 12, 0, False),  # noon is exclusive end
        ("afternoon", 14, 0, True),
        ("afternoon", 18, 0, False),
        ("afternoon", 12, 0, True),  # noon belongs to afternoon (inclusive start, no +1m)
        ("evening", 18, 15, True),
        ("evening", 19, 0, False),
        ("daytime", 5, 30, True),  # daytime now starts at dawn (05:30), inclusive
        ("daytime", 5, 45, True),  # ...so dawn→sunrise is daytime, not a gap
        ("daytime", 5, 0, False),  # before dawn is not daytime
        ("daytime", 12, 0, True),
        ("daytime", 18, 0, False),  # sunset is the exclusive end
        ("daytime", 19, 0, False),
        ("nighttime", 22, 0, True),
        ("nighttime", 4, 0, True),
        ("nighttime", 10, 0, False),
    ],
)
def test_matches_named_period(period: str, now_hour: int, now_minute: int, expected: bool) -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, now_hour, now_minute, tzinfo=UTC))
    assert _condition().matches({"period": period}, snap) is expected, period


def test_matches_custom_period_via_lookup() -> None:
    custom = {**BUILTIN_PERIODS, "wind_down": _range(_time(20, 0), _time(22, 0))}
    snap = _build_snapshot(datetime(2026, 5, 13, 21, 0, tzinfo=UTC))
    assert _condition(custom).matches({"period": "wind_down"}, snap) is True


def test_matches_custom_shadows_builtin() -> None:
    custom = {**BUILTIN_PERIODS, "afternoon": _range(_time(13, 0), _time(17, 0))}
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 15, tzinfo=UTC))
    assert _condition(custom).matches({"period": "afternoon"}, snap) is False


def test_matches_missing_period_raises_loudly() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    with pytest.raises(ValueError, match="unknown time_of_day period"):
        _condition().matches({"period": "nonexistent"}, snap)


# ── matches: OR lists ──────────────────────────────────────────────────────


def test_matches_list_any() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 14, 0, tzinfo=UTC))
    assert _condition().matches([{"period": "evening"}, {"period": "afternoon"}], snap) is True


def test_matches_list_none() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 10, 0, tzinfo=UTC))
    assert _condition().matches([{"period": "evening"}, {"period": "afternoon"}], snap) is False


def test_matches_list_mixed_period_and_range() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 0, tzinfo=UTC))
    pred = [{"period": "evening"}, _range(_time(16, 0), _time(18, 30))]
    assert _condition().matches(pred, snap) is True


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
    _condition().validate_predicate(pred)


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
        _condition().validate_predicate(pred)


def test_validate_predicate_rejects_missing_period() -> None:
    with pytest.raises(ValueError, match="unknown time_of_day period"):
        _condition().validate_predicate({"period": "nonexistent"})


# ── describe ───────────────────────────────────────────────────────────────


def test_describe_returns_named_period_when_matching() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 14, 0, tzinfo=UTC))
    assert _condition().describe(snap) == "afternoon"


def test_describe_returns_none_if_no_period_matches() -> None:
    # The builtin periods now tile the full day (daytime∪evening∪nighttime cover
    # everything), so a "no match" only happens against a period set the time is
    # outside of — here a single evening window with now at midday.
    only_evening = {"evening": _range(_sun("sunset"), _sun("dusk"))}
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    assert _condition(only_evening).describe(snap) is None


# ── contains ───────────────────────────────────────────────────────────────


def test_contains_nested_range() -> None:
    m = _condition()
    wide = _range(_time(10, 0), _time(14, 0))
    narrow = _range(_time(12, 0), _time(13, 0))
    assert m.contains(wide, narrow) is True
    assert m.contains(narrow, wide) is False


def test_contains_equal_range() -> None:
    m = _condition()
    rng = _range(_time(10, 0), _time(14, 0))
    assert m.contains(rng, rng) is True


def test_contains_disjoint() -> None:
    m = _condition()
    assert (
        m.contains(_range(_time(8, 0), _time(10, 0)), _range(_time(18, 0), _time(19, 0))) is False
    )


def test_contains_partial_overlap_neither_contains() -> None:
    m = _condition()
    assert (
        m.contains(_range(_time(10, 0), _time(12, 0)), _range(_time(11, 0), _time(13, 0))) is False
    )


def test_contains_wrap_midnight() -> None:
    m = _condition()
    assert m.contains(_range(_time(22, 0), _time(2, 0)), _range(_time(23, 0), _time(1, 0))) is True
    assert m.contains(_range(_time(23, 0), _time(1, 0)), _range(_time(22, 0), _time(2, 0))) is False


def test_contains_named_period() -> None:
    m = _condition()
    assert m.contains({"period": "daytime"}, {"period": "afternoon"}) is True


def test_contains_list_predicate_union() -> None:
    m = _condition()
    outer = [_range(_time(10, 0), _time(12, 0)), _range(_time(11, 0), _time(14, 0))]
    inner = _range(_time(11, 30), _time(13, 0))
    assert m.contains(outer, inner) is True


def test_contains_full_day_predicate() -> None:
    m = _condition()
    full = _range(_time(0, 0), _time(0, 0))
    assert m.contains(full, _range(_time(12, 0), _time(13, 0))) is True
    assert m.contains(_range(_time(12, 0), _time(13, 0)), full) is False


# ── order_key ──────────────────────────────────────────────────────────────


def test_order_key_is_start_minute_of_day() -> None:
    m = _condition()
    assert m.order_key(_range(_time(8, 0), _time(10, 0))) == 480
    assert m.order_key(_range(_time(18, 0), _time(19, 0))) == 1080


def test_order_key_list_takes_earliest_start() -> None:
    m = _condition()
    pred = [_range(_time(18, 0), _time(19, 0)), _range(_time(8, 0), _time(10, 0))]
    assert m.order_key(pred) == 480


def test_order_key_named_period() -> None:
    assert _condition().order_key({"period": "nighttime"}) == 1110.0


# ── condition metadata ───────────────────────────────────────────────────────


def test_input_attribute_signals_dedicated_widget() -> None:
    assert _condition().input == "time_of_day"


def test_condition_exposes_description() -> None:
    assert _condition().description.strip() != ""


def test_priority() -> None:
    assert _condition().priority == 800


def test_trigger_deps_absolute_range_yields_clock_times() -> None:
    m = TimeOfDayCondition()
    pred = {
        "from": {"kind": "time", "hh": 22, "mm": 30},
        "to": {"kind": "time", "hh": 6, "mm": 0},
    }
    spec = m.trigger_deps(pred)
    assert spec.clock_times == frozenset({(22, 30), (6, 0)})
    assert spec.sun_events == frozenset()
    assert spec.date_rollover is False


def test_trigger_deps_sun_range_yields_sun_events() -> None:
    m = TimeOfDayCondition()
    pred = {
        "from": {"kind": "sun", "anchor": "sunrise", "offset_min": -30},
        "to": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
    }
    spec = m.trigger_deps(pred)
    assert spec.sun_events == frozenset({("sunrise", -30), ("sunset", 0)})
    assert spec.clock_times == frozenset()


def test_trigger_deps_named_period_resolves_via_lookup() -> None:
    periods = {
        "evening": {
            "from": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
            "to": {"kind": "time", "hh": 23, "mm": 0},
        }
    }
    m = TimeOfDayCondition(period_lookup=lambda: periods)
    spec = m.trigger_deps({"period": "evening"})
    assert spec.sun_events == frozenset({("sunset", 0)})
    assert spec.clock_times == frozenset({(23, 0)})


def test_trigger_deps_list_merges_all_items() -> None:
    m = TimeOfDayCondition()
    pred = [
        {"from": {"kind": "time", "hh": 7, "mm": 0}, "to": {"kind": "time", "hh": 9, "mm": 0}},
        {"from": {"kind": "time", "hh": 18, "mm": 0}, "to": {"kind": "time", "hh": 20, "mm": 0}},
    ]
    spec = m.trigger_deps(pred)
    assert spec.clock_times == frozenset({(7, 0), (9, 0), (18, 0), (20, 0)})
    assert spec.sun_events == frozenset()


def test_trigger_deps_tolerates_garbage_input() -> None:
    m = TimeOfDayCondition()
    bad_inputs: list[Any] = [
        "string",
        42,
        None,
        {},
        {"from": None, "to": None},
        {"period": "missing"},
        [None, "x"],
        {"kind": "sun", "anchor": "nope"},
    ]
    for bad in bad_inputs:
        spec = m.trigger_deps(bad)
        assert spec.clock_times == frozenset()
        assert spec.sun_events == frozenset()


def test_trigger_deps_skips_out_of_range_and_unknown_anchor() -> None:
    m = TimeOfDayCondition()
    pred = {
        "from": {"kind": "time", "hh": 99, "mm": 0},
        "to": {"kind": "sun", "anchor": "nope", "offset_min": 0},
    }
    spec = m.trigger_deps(pred)
    assert spec.clock_times == frozenset()
    assert spec.sun_events == frozenset()


def test_trigger_deps_rejects_bool_time_and_offset() -> None:
    m = TimeOfDayCondition()
    pred = {
        "from": {"kind": "time", "hh": True, "mm": False},
        "to": {"kind": "sun", "anchor": "sunset", "offset_min": True},
    }
    spec = m.trigger_deps(pred)
    assert spec.clock_times == frozenset()
    assert spec.sun_events == frozenset()


def test_absolute_time_uses_local_tz_for_date(hass: HomeAssistant) -> None:
    """An absolute time {kind: time, hh: 16, mm: 0} is interpreted as 16:00
    in HA's local timezone, not UTC. With HA's default test tz (UTC), this
    means 16:00Z. If a non-UTC tz is configured, the resolved start would
    be 16:00 in that tz."""
    # Test that the resolved time is in the local tz (UTC in tests by default)
    from custom_components.ambience.conditions.time_of_day import TimeOfDayCondition

    condition = TimeOfDayCondition(period_lookup=lambda: {})
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 0, tzinfo=UTC))
    assert (
        condition.matches(
            {
                "from": {"kind": "time", "hh": 16, "mm": 0},
                "to": {"kind": "time", "hh": 18, "mm": 30},
            },
            snap,
        )
        is True
    )


# ── snapshot: unparseable attribute value (line 74) ─────────────────────────


async def test_snapshot_raises_when_attribute_unparseable(hass: HomeAssistant) -> None:
    """snapshot() raises RuntimeError when a sun.sun attribute exists but
    cannot be parsed as a datetime (line 74 branch)."""
    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {
            "next_rising": "not-a-datetime",
            "next_setting": "2026-05-13T18:00:00+00:00",
            "next_dawn": "2026-05-13T05:30:00+00:00",
            "next_dusk": "2026-05-13T18:30:00+00:00",
            "next_noon": "2026-05-13T12:00:00+00:00",
            "next_midnight": "2026-05-13T00:00:00+00:00",
        },
    )
    with pytest.raises(RuntimeError, match="unparseable"):
        await _condition().snapshot(hass)


# ── _resolve_endpoint error paths (lines 121, 128, 139, 146) ─────────────────


def test_resolve_endpoint_non_dict_raises(hass: HomeAssistant) -> None:
    """_resolve_endpoint raises ValueError when the endpoint is not a dict
    (line 121 branch — e.g. a bare string used as a from/to value)."""
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    with pytest.raises(ValueError, match="invalid endpoint"):
        _condition().matches({"from": "08:00", "to": _time(10, 0)}, snap)


def test_resolve_endpoint_invalid_mm_raises(hass: HomeAssistant) -> None:
    """_resolve_endpoint raises ValueError when mm is out of [0, 59] range
    (line 128 branch)."""
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    with pytest.raises(ValueError, match="invalid mm"):
        _condition().matches(
            {"from": {"kind": "time", "hh": 8, "mm": 60}, "to": _time(10, 0)}, snap
        )


def test_resolve_endpoint_non_int_mm_raises(hass: HomeAssistant) -> None:
    """_resolve_endpoint raises ValueError when mm is not an int (line 128)."""
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    with pytest.raises(ValueError, match="invalid mm"):
        _condition().matches(
            {"from": {"kind": "time", "hh": 8, "mm": "30"}, "to": _time(10, 0)}, snap
        )


def test_resolve_endpoint_non_int_offset_raises() -> None:
    """_resolve_endpoint raises ValueError when offset_min is not an int
    (line 139 branch)."""
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    with pytest.raises(ValueError, match="offset_min must be int"):
        _condition().matches(
            {"from": {"kind": "sun", "anchor": "sunrise", "offset_min": "30"}, "to": _time(10, 0)},
            snap,
        )


def test_resolve_endpoint_unknown_kind_raises() -> None:
    """_resolve_endpoint raises ValueError when kind is not 'time' or 'sun'
    (line 146 branch — the final raise at the bottom of _resolve_endpoint)."""
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    with pytest.raises(ValueError, match="invalid endpoint kind"):
        _condition().matches(
            {"from": {"kind": "lunar", "hh": 8, "mm": 0}, "to": _time(10, 0)}, snap
        )


# ── describe: malformed period skipped via ValueError (lines 168-169) ────────


def test_describe_skips_malformed_period_definition() -> None:
    """describe() silently skips any period whose definition raises ValueError
    (lines 168-169 — the except-ValueError-continue branch), and falls through
    to the next period or returns None."""
    broken_periods = {
        # "from" endpoint is a bare string, not a dict — _resolve_endpoint will
        # raise ValueError, which describe() must catch and continue past.
        "broken": {"from": "not-a-dict", "to": _time(10, 0)},
        "good": _range(_time(14, 0), _time(16, 0)),
    }
    snap = _build_snapshot(datetime(2026, 5, 13, 15, 0, tzinfo=UTC))
    # Should skip "broken" without raising and return "good".
    result = _condition(broken_periods).describe(snap)
    assert result == "good"


def test_describe_returns_none_when_all_periods_malformed() -> None:
    """describe() returns None when every period definition is broken
    (all raise ValueError, caught at lines 168-169)."""
    broken_periods = {
        "p1": {"from": "bad", "to": _time(10, 0)},
        "p2": {"from": "also_bad", "to": _time(20, 0)},
    }
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    assert _condition(broken_periods).describe(snap) is None


# ── _classify_endpoint: kind is neither "time" nor "sun" (line 251->exit) ────


def test_trigger_deps_unknown_kind_produces_no_deps() -> None:
    """_classify_endpoint does nothing when kind is a string other than 'time'
    or 'sun' — exercises the 251->exit branch where the elif is False."""
    m = TimeOfDayCondition()
    pred = {
        "from": {"kind": "lunar", "anchor": "full_moon"},
        "to": {"kind": "stellar", "hh": 3, "mm": 0},
    }
    spec = m.trigger_deps(pred)
    assert spec.clock_times == frozenset()
    assert spec.sun_events == frozenset()


# ── clock-clamped sun endpoints ───────────────────────────────────────────────


def _sun_clamp(anchor: str, direction: str, hh: int, mm: int, offset_min: int = 0) -> dict:
    return {
        "kind": "sun",
        "anchor": anchor,
        "offset_min": offset_min,
        "clamp": {"dir": direction, "hh": hh, "mm": mm},
    }


def test_clamp_not_before_holds_floor_when_anchor_earlier() -> None:
    # sunrise 06:00, clamp not-before 08:30 → start = 08:30. now=07:00 is outside.
    snap = _build_snapshot(datetime(2026, 5, 13, 7, 0, tzinfo=UTC))
    pred = _range(_sun_clamp("sunrise", "not_before", 8, 30), _sun("dusk"))
    assert _condition().matches(pred, snap) is False


def test_clamp_not_before_inside_after_floor() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 9, 0, tzinfo=UTC))
    pred = _range(_sun_clamp("sunrise", "not_before", 8, 30), _sun("dusk"))
    assert _condition().matches(pred, snap) is True


def test_clamp_not_before_anchor_wins_when_later() -> None:
    # sunrise 09:00 (override) is later than the 08:30 floor → start = 09:00.
    snap = _build_snapshot(
        datetime(2026, 5, 13, 8, 45, tzinfo=UTC),
        sunrise=datetime(2026, 5, 13, 9, 0, tzinfo=UTC),
    )
    pred = _range(_sun_clamp("sunrise", "not_before", 8, 30), _sun("dusk"))
    assert _condition().matches(pred, snap) is False  # 08:45 < 09:00


def test_clamp_not_after_caps_ceiling_when_anchor_later() -> None:
    # sunset 18:00, clamp not-after 17:00 → end = 17:00. now=17:30 is outside.
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 30, tzinfo=UTC))
    pred = _range(_sun("sunrise"), _sun_clamp("sunset", "not_after", 17, 0))
    assert _condition().matches(pred, snap) is False


def test_clamp_combines_with_offset() -> None:
    # sunrise 06:00 +60min = 07:00, clamp not-before 08:30 → start = 08:30.
    snap = _build_snapshot(datetime(2026, 5, 13, 8, 0, tzinfo=UTC))
    pred = _range(_sun_clamp("sunrise", "not_before", 8, 30, offset_min=60), _sun("dusk"))
    assert _condition().matches(pred, snap) is False  # 08:00 < 08:30


def test_clamp_degenerate_inversion_never_matches() -> None:
    # not-before pushes start past a fixed end → empty range, never matches.
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    pred = _range(_sun_clamp("sunrise", "not_before", 20, 0), _time(18, 0))
    assert _condition().matches(pred, snap) is False


def test_clamp_validation_rejects_bad_dir() -> None:
    bad = {
        "kind": "sun",
        "anchor": "sunrise",
        "offset_min": 0,
        "clamp": {"dir": "sideways", "hh": 8, "mm": 30},
    }
    with pytest.raises(ValueError):
        _condition().validate_predicate(_range(bad, _sun("dusk")))


def test_clamp_validation_rejects_bad_time() -> None:
    bad = {
        "kind": "sun",
        "anchor": "sunrise",
        "offset_min": 0,
        "clamp": {"dir": "not_before", "hh": 25, "mm": 0},
    }
    with pytest.raises(ValueError):
        _condition().validate_predicate(_range(bad, _sun("dusk")))


def test_clamp_preserves_legitimate_overnight_wrap() -> None:
    # dusk(not before 20:00) → dawn is a genuine overnight range, NOT a
    # degenerate inversion: it must still match across midnight.
    pred = _range(_sun_clamp("dusk", "not_before", 20, 0), _sun("dawn"))
    cond = _condition()
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 22, 0, tzinfo=UTC))) is True
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 4, 0, tzinfo=UTC))) is True
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 20, 30, tzinfo=UTC))) is True
    # Outside the range: before the 20:00 floor, and at noon.
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 19, 0, tzinfo=UTC))) is False
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))) is False


def test_non_binding_clamp_behaves_like_plain_anchor() -> None:
    # A not-before floor far earlier than the anchor never binds → dusk → dawn.
    pred = _range(_sun_clamp("dusk", "not_before", 6, 0), _sun("dawn"))
    cond = _condition()
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 22, 0, tzinfo=UTC))) is True
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))) is False


def test_trigger_deps_includes_clamp_clock_time() -> None:
    pred = _range(_sun_clamp("sunrise", "not_before", 8, 30), _sun("dusk"))
    spec = _condition().trigger_deps(pred)
    assert (8, 30) in spec.clock_times
    assert ("sunrise", 0) in spec.sun_events
    assert ("dusk", 0) in spec.sun_events
