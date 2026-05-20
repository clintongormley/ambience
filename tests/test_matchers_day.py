"""DayMatcher — date / weekday / workday predicate."""

from __future__ import annotations

from datetime import date
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.matchers.day import DayMatcher, DaySnapshot


def _snap(today: date, **overrides) -> DaySnapshot:
    defaults = {
        "today": today,
        "weekday": today.weekday(),
        "days_in_month": 31,
        "workday_state": None,
        "month_workdays": None,
    }
    defaults.update(overrides)
    return DaySnapshot(**defaults)


def test_matcher_protocol_fields() -> None:
    m = DayMatcher()
    assert m.name == "day"
    assert m.toggleable is True
    assert m.input == "day_predicate"
    assert m.priority == 200
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


def _install_store_stub(hass: HomeAssistant, **day_config) -> None:
    """Plant a minimal store stub at hass.data[DOMAIN][DATA_STORE]."""

    class _Store:
        def get_matcher_config(self, name: str) -> dict[str, object]:
            if name == "day":
                return {
                    "workday_sensor": day_config.get("workday_sensor"),
                    "workday_calendar": day_config.get("workday_calendar"),
                }
            return {}

    hass.data.setdefault(DOMAIN, {})[DATA_STORE] = _Store()


async def test_snapshot_today_weekday_days_in_month(hass: HomeAssistant) -> None:
    _install_store_stub(hass)
    snap = await DayMatcher().snapshot(hass)
    today = dt_util.now().date()
    assert snap.today == today
    assert snap.weekday == today.weekday()
    from calendar import monthrange

    assert snap.days_in_month == monthrange(today.year, today.month)[1]
    assert snap.workday_state is None
    assert snap.month_workdays is None


async def test_snapshot_reads_workday_sensor_state(hass: HomeAssistant) -> None:
    _install_store_stub(hass, workday_sensor="binary_sensor.workday")
    hass.states.async_set("binary_sensor.workday", "on")
    snap = await DayMatcher().snapshot(hass)
    assert snap.workday_state == "on"


async def test_snapshot_workday_sensor_unavailable_yields_none(hass: HomeAssistant) -> None:
    _install_store_stub(hass, workday_sensor="binary_sensor.workday")
    snap = await DayMatcher().snapshot(hass)
    assert snap.workday_state is None


async def test_snapshot_workday_sensor_unknown_state_yields_none(hass: HomeAssistant) -> None:
    _install_store_stub(hass, workday_sensor="binary_sensor.workday")
    hass.states.async_set("binary_sensor.workday", "unknown")
    snap = await DayMatcher().snapshot(hass)
    assert snap.workday_state is None


async def test_snapshot_month_workdays_none_without_calendar(hass: HomeAssistant) -> None:
    _install_store_stub(hass)
    snap = await DayMatcher().snapshot(hass)
    assert snap.month_workdays is None


async def test_snapshot_month_workdays_from_calendar_events(hass: HomeAssistant) -> None:
    """Calendar entity emits events for workdays; the snapshot collects their start
    dates within the current month, sorted."""
    _install_store_stub(hass, workday_calendar="calendar.workday")
    today = dt_util.now().date()

    class _Event:
        def __init__(self, day: int):
            self.start = date(today.year, today.month, day)

    async def fake_fetch(hass_, entity_id, start, end):
        assert entity_id == "calendar.workday"
        assert start.date() == date(today.year, today.month, 1)
        return [_Event(2), _Event(3), _Event(4), _Event(5), _Event(6)]

    with patch(
        "custom_components.ambience.matchers.day._fetch_calendar_events",
        new=fake_fetch,
    ):
        snap = await DayMatcher().snapshot(hass)

    assert snap.month_workdays == tuple(date(today.year, today.month, d) for d in (2, 3, 4, 5, 6))


async def test_snapshot_month_workdays_handles_fetch_error(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    _install_store_stub(hass, workday_calendar="calendar.workday")

    async def boom(*_args, **_kwargs):
        raise RuntimeError("entity missing")

    with patch(
        "custom_components.ambience.matchers.day._fetch_calendar_events",
        new=boom,
    ):
        snap = await DayMatcher().snapshot(hass)

    assert snap.month_workdays is None
    assert "entity missing" in caplog.text
