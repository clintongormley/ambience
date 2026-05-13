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
