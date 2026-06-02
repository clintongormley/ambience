"""day matcher derives workday from the calendar for a simulated date."""

from datetime import UTC, date, datetime

import pytest

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.matchers.day import DayMatcher


class _Store:
    def __init__(self, cfg):
        self._cfg = cfg

    def get_matcher_config(self, name):
        return self._cfg


class _Hass:
    def __init__(self, cfg):
        self.data = {DOMAIN: {DATA_STORE: _Store(cfg)}}
        self.states = None


@pytest.mark.asyncio
async def test_workday_derived_from_calendar_when_date_is_a_workday(monkeypatch):
    cfg = {"workday_sensor": None, "workday_calendar": "calendar.work"}
    hass = _Hass(cfg)
    chosen = datetime(2026, 12, 21, 12, 0, tzinfo=UTC)  # a Monday

    async def fake_fetch(_hass, _entity, _start, _end):
        class _Ev:
            start = date(2026, 12, 21)

        return [_Ev()]

    monkeypatch.setattr(
        "custom_components.ambience.matchers.day._fetch_calendar_events", fake_fetch
    )
    snap = await DayMatcher(hass).snapshot(hass, now=chosen)
    assert snap.workday_state == "on"


@pytest.mark.asyncio
async def test_workday_off_when_date_not_in_calendar(monkeypatch):
    cfg = {"workday_sensor": None, "workday_calendar": "calendar.work"}
    hass = _Hass(cfg)
    chosen = datetime(2026, 12, 25, 12, 0, tzinfo=UTC)  # not in the calendar

    async def fake_fetch(_hass, _entity, _start, _end):
        class _Ev:
            start = date(2026, 12, 21)

        return [_Ev()]

    monkeypatch.setattr(
        "custom_components.ambience.matchers.day._fetch_calendar_events", fake_fetch
    )
    snap = await DayMatcher(hass).snapshot(hass, now=chosen)
    assert snap.workday_state == "off"
