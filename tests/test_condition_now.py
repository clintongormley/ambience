"""Condition snapshots honour an injected `now` (for the what-if simulator)."""

from datetime import UTC, datetime
from types import SimpleNamespace

import pytest
from homeassistant.util import dt as dt_util

from custom_components.ambience.conditions.day import DayCondition
from custom_components.ambience.conditions.people import PeopleCondition
from custom_components.ambience.conditions.state import StateCondition
from custom_components.ambience.conditions.time_of_day import TimeOfDayCondition

FIXED = datetime(2026, 12, 21, 17, 30, tzinfo=UTC)


class _FakeStates:
    def __init__(self, states):
        self._states = states  # dict[entity_id, FakeState]

    def get(self, entity_id):
        return self._states.get(entity_id)

    def async_all(self, domain=None):
        if domain is None:
            return list(self._states.values())
        return [s for s in self._states.values() if s.entity_id.split(".", 1)[0] == domain]


class _FakeState:
    def __init__(self, entity_id, state, attributes=None):
        self.entity_id = entity_id
        self.state = state
        self.attributes = attributes or {}
        self.last_changed = FIXED
        self.last_updated = FIXED


class _FakeHass:
    def __init__(self, states=None, data=None, config=None):
        self.states = _FakeStates(states or {})
        self.data = data or {}
        self.config = config


@pytest.mark.asyncio
async def test_people_snapshot_uses_injected_now():
    snap = await PeopleCondition().snapshot(_FakeHass(), now=FIXED)
    assert snap.now == FIXED


@pytest.mark.asyncio
async def test_state_snapshot_uses_injected_now():
    snap = await StateCondition().snapshot(_FakeHass(), now=FIXED)
    assert snap.now == FIXED


@pytest.mark.asyncio
async def test_time_of_day_snapshot_uses_injected_now():
    # sun.sun must be present (the integration is up); anchors are computed from
    # astral for now's local date using hass.config's location.
    sun = _FakeState("sun.sun", "above_horizon", {})
    config = SimpleNamespace(latitude=41.9028, longitude=12.4964, elevation=0)
    hass = _FakeHass({"sun.sun": sun}, config=config)
    snap = await TimeOfDayCondition().snapshot(hass, now=FIXED)
    assert snap.now == FIXED


@pytest.mark.asyncio
async def test_day_snapshot_uses_injected_now_local_date():
    from custom_components.ambience.const import DATA_STORE, DOMAIN

    class _FakeStore:
        def get_condition_config(self, name):
            return {"workday_sensor": None, "workday_calendar": None}

    hass = _FakeHass(data={DOMAIN: {DATA_STORE: _FakeStore()}})
    snap = await DayCondition().snapshot(hass, now=FIXED)
    assert snap.today == dt_util.as_local(FIXED).date()
