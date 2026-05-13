"""TimeOfDayMatcher — snapshot, parsing, and matching."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.matchers.time_of_day import (
    TimeOfDayMatcher,
    TimeOfDaySnapshot,
)


def _build_snapshot(now: datetime, **overrides: datetime) -> TimeOfDaySnapshot:
    """Helper: build a fully-populated snapshot for tests."""
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


@pytest.mark.asyncio
async def test_snapshot_returns_today_anchors(hass: HomeAssistant) -> None:
    # Seed sun.sun with attributes parsed by snapshot()
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

    matcher = TimeOfDayMatcher()
    snap = await matcher.snapshot(hass)

    assert snap.now.tzinfo is not None
    assert snap.sunrise.tzinfo is not None
    assert snap.sunset.tzinfo is not None
    assert snap.dawn.tzinfo is not None
    assert snap.dusk.tzinfo is not None
    assert snap.noon.tzinfo is not None
    assert snap.midnight.tzinfo is not None


@pytest.mark.asyncio
async def test_snapshot_raises_when_sun_unavailable(hass: HomeAssistant) -> None:
    matcher = TimeOfDayMatcher()
    with pytest.raises(RuntimeError, match="sun.sun"):
        await matcher.snapshot(hass)


@pytest.mark.asyncio
async def test_snapshot_raises_when_attribute_missing(hass: HomeAssistant) -> None:
    """If sun.sun exists but is missing an expected attribute, raise RuntimeError."""
    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {
            # next_rising omitted on purpose
            "next_setting": "2026-05-13T18:00:00+00:00",
            "next_dawn": "2026-05-13T05:30:00+00:00",
            "next_dusk": "2026-05-13T18:30:00+00:00",
            "next_noon": "2026-05-13T12:00:00+00:00",
            "next_midnight": "2026-05-13T00:00:00+00:00",
        },
    )
    with pytest.raises(RuntimeError, match="next_rising"):
        await TimeOfDayMatcher().snapshot(hass)


def test_matches_absolute_range_inside() -> None:
    matcher = TimeOfDayMatcher()
    now = datetime(2026, 5, 13, 17, 0, tzinfo=UTC)
    snap = _build_snapshot(now)
    assert matcher.matches("16:00-18:30", snap) is True


def test_matches_absolute_range_outside() -> None:
    matcher = TimeOfDayMatcher()
    now = datetime(2026, 5, 13, 15, 0, tzinfo=UTC)
    snap = _build_snapshot(now)
    assert matcher.matches("16:00-18:30", snap) is False


def test_matches_absolute_range_wraps_midnight() -> None:
    matcher = TimeOfDayMatcher()
    # range 22:00 to 02:00 — current time 01:00 should match
    now = datetime(2026, 5, 13, 1, 0, tzinfo=UTC)
    snap = _build_snapshot(now)
    assert matcher.matches("22:00-02:00", snap) is True
    # 03:00 should not
    snap2 = _build_snapshot(datetime(2026, 5, 13, 3, 0, tzinfo=UTC))
    assert matcher.matches("22:00-02:00", snap2) is False


def test_matches_absolute_range_allows_spaces_around_dash() -> None:
    matcher = TimeOfDayMatcher()
    now = datetime(2026, 5, 13, 17, 0, tzinfo=UTC)
    snap = _build_snapshot(now)
    assert matcher.matches("16:00 - 18:30", snap) is True


def test_unknown_predicate_string_raises() -> None:
    matcher = TimeOfDayMatcher()
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    with pytest.raises(ValueError, match="invalid time_of_day predicate"):
        matcher.matches("garbage", snap)


def test_matches_sun_relative_range_inside() -> None:
    matcher = TimeOfDayMatcher()
    # snapshot: sunset at 18:00, dusk at 18:30
    now = datetime(2026, 5, 13, 18, 15, tzinfo=UTC)
    snap = _build_snapshot(now)
    assert matcher.matches("sunset to dusk", snap) is True


def test_matches_sun_relative_range_outside() -> None:
    matcher = TimeOfDayMatcher()
    now = datetime(2026, 5, 13, 19, 0, tzinfo=UTC)
    snap = _build_snapshot(now)
    assert matcher.matches("sunset to dusk", snap) is False


def test_matches_sun_relative_with_offsets() -> None:
    matcher = TimeOfDayMatcher()
    # sunset 18:00 - 30m = 17:30; range sunset-30m .. 22:00
    now = datetime(2026, 5, 13, 17, 45, tzinfo=UTC)
    snap = _build_snapshot(now)
    assert matcher.matches("sunset-30m to 22:00", snap) is True


def test_matches_sun_relative_offset_hours() -> None:
    matcher = TimeOfDayMatcher()
    # noon 12:00 + 1h = 13:00; range 13:00 .. sunset (18:00)
    now = datetime(2026, 5, 13, 14, 0, tzinfo=UTC)
    snap = _build_snapshot(now)
    assert matcher.matches("noon+1h to sunset", snap) is True


def test_matches_sun_relative_tolerates_spaces_in_offset() -> None:
    matcher = TimeOfDayMatcher()
    now = datetime(2026, 5, 13, 17, 45, tzinfo=UTC)
    snap = _build_snapshot(now)
    assert matcher.matches("sunset - 30m to 22:00", snap) is True


def test_invalid_anchor_raises() -> None:
    matcher = TimeOfDayMatcher()
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    with pytest.raises(ValueError, match="invalid endpoint"):
        matcher.matches("zenith to sunset", snap)
