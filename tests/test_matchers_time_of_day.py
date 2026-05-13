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


@pytest.mark.parametrize(
    "period,now_hour,now_minute,expected",
    [
        # midnight: midnight-1h to midnight+1h ⇒ 23:00..01:00 wrap
        ("midnight", 0, 30, True),
        ("midnight", 23, 30, True),
        ("midnight", 2, 0, False),
        # dawn 5:30 ± 30m
        ("dawn", 5, 30, True),
        ("dawn", 5, 0, True),
        ("dawn", 5, 59, True),
        ("dawn", 6, 1, False),
        # sunrise 6:00 ± 30m
        ("sunrise", 6, 0, True),
        ("sunrise", 5, 35, True),  # 5:30 +5
        # morning: sunrise+30m to noon-1h ⇒ 6:30 .. 11:00
        ("morning", 7, 0, True),
        ("morning", 6, 0, False),
        ("morning", 11, 30, False),
        # noon ± 1h ⇒ 11:00..13:00
        ("noon", 12, 0, True),
        ("noon", 13, 30, False),
        # afternoon: noon+1h to sunset-30m ⇒ 13:00..17:30
        ("afternoon", 14, 0, True),
        ("afternoon", 18, 0, False),
        # sunset ± 30m ⇒ 17:30..18:30
        ("sunset", 18, 0, True),
        # evening: sunset..dusk ⇒ 18:00..18:30
        ("evening", 18, 15, True),
        ("evening", 19, 0, False),
        # dusk ± 30m ⇒ 18:00..19:00
        ("dusk", 18, 30, True),
        # day: sunrise..sunset ⇒ 6:00..18:00
        ("day", 12, 0, True),
        ("day", 19, 0, False),
        # night: dusk..dawn ⇒ 18:30..5:30 next day
        ("night", 22, 0, True),
        ("night", 4, 0, True),
        ("night", 10, 0, False),
    ],
)
def test_named_period_match(period: str, now_hour: int, now_minute: int, expected: bool) -> None:
    matcher = TimeOfDayMatcher()
    now = datetime(2026, 5, 13, now_hour, now_minute, tzinfo=UTC)
    snap = _build_snapshot(now)
    assert matcher.matches(period, snap) is expected, period


def test_predicate_list_matches_any() -> None:
    matcher = TimeOfDayMatcher()
    now = datetime(2026, 5, 13, 14, 0, tzinfo=UTC)  # afternoon
    snap = _build_snapshot(now)
    assert matcher.matches(["evening", "afternoon"], snap) is True


def test_predicate_list_matches_none() -> None:
    matcher = TimeOfDayMatcher()
    now = datetime(2026, 5, 13, 10, 0, tzinfo=UTC)  # morning
    snap = _build_snapshot(now)
    assert matcher.matches(["evening", "afternoon"], snap) is False


def test_predicate_list_with_mixed_kinds() -> None:
    matcher = TimeOfDayMatcher()
    now = datetime(2026, 5, 13, 17, 0, tzinfo=UTC)
    snap = _build_snapshot(now)
    assert matcher.matches(["evening", "16:00-18:30"], snap) is True


@pytest.mark.parametrize(
    "predicate",
    [
        "morning",
        "16:00-18:30",
        "sunset-30m to 22:00",
        "sunrise to sunset",
        ["evening", "16:00-18:30"],
    ],
)
def test_validate_predicate_accepts_valid(predicate) -> None:
    TimeOfDayMatcher().validate_predicate(predicate)  # should not raise


@pytest.mark.parametrize(
    "predicate",
    [
        "garbage",
        "25:00-26:00",
        "sunset to zenith",
        ["evening", "garbage"],
        42,
        None,
    ],
)
def test_validate_predicate_rejects_invalid(predicate) -> None:
    with pytest.raises(ValueError):
        TimeOfDayMatcher().validate_predicate(predicate)


def test_describe_returns_named_period_when_matching() -> None:
    matcher = TimeOfDayMatcher()
    # 14:00 — should describe as "afternoon"
    snap = _build_snapshot(datetime(2026, 5, 13, 14, 0, tzinfo=UTC))
    assert matcher.describe(snap) == "afternoon"


def test_describe_returns_none_if_no_named_period_matches() -> None:
    matcher = TimeOfDayMatcher()
    # Construct a pathological snapshot where no named period contains now.
    # All anchors are jammed into the early morning (00:00-06:00);
    # at now=12:00 every resolved period range falls entirely outside that time.
    impossible = _build_snapshot(
        now=datetime(2026, 5, 13, 12, 0, tzinfo=UTC),
        sunrise=datetime(2026, 5, 13, 0, 0, tzinfo=UTC),
        sunset=datetime(2026, 5, 13, 4, 0, tzinfo=UTC),
        noon=datetime(2026, 5, 13, 2, 0, tzinfo=UTC),
        midnight=datetime(2026, 5, 13, 0, 0, tzinfo=UTC),
        dawn=datetime(2026, 5, 13, 6, 0, tzinfo=UTC),
        dusk=datetime(2026, 5, 13, 5, 0, tzinfo=UTC),
    )
    assert matcher.describe(impossible) is None
