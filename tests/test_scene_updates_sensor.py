"""The Ambience "Scene updates" activity sensor + hub device.

The sensor is the always-present logbook anchor: it lives on a dedicated
"Ambience" hub device so the activity log can be filtered by that device, and
its state is a logbook-suppressed running count (the rich logbook line stays the
single activity entry — see test_logbook_attribution.py for the line itself).
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.components.sensor import SensorStateClass
from homeassistant.const import EVENT_LOGBOOK_ENTRY
from homeassistant.core import HomeAssistant, State
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_capture_events,
    async_mock_service,
    mock_restore_cache,
)

from custom_components.ambience.const import DATA_EXPOSED_ACTIONS, DATA_STORE, DOMAIN

SENSOR_ID = "sensor.ambience_scene_updates"


async def _setup_with_sun(hass: HomeAssistant) -> None:
    now = datetime.now(UTC)
    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {
            "next_rising": (now + timedelta(hours=1)).isoformat(),
            "next_setting": (now + timedelta(hours=12)).isoformat(),
            "next_dawn": (now + timedelta(minutes=30)).isoformat(),
            "next_dusk": (now + timedelta(hours=13)).isoformat(),
            "next_noon": (now + timedelta(hours=6)).isoformat(),
            "next_midnight": (now + timedelta(hours=18)).isoformat(),
        },
    )


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    await _setup_with_sun(hass)
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def test_sensor_is_created(hass: HomeAssistant, installed: MockConfigEntry) -> None:
    state = hass.states.get(SENSOR_ID)
    assert state is not None
    assert state.state == "0"


async def test_sensor_on_ambience_hub_device(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """A dedicated (ambience, "hub") device named "Ambience" owns the sensor —
    distinct from the house/scope switch devices, so the activity log filters by
    a sensibly-named "Ambience" device."""
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_device(identifiers={(DOMAIN, "hub")})
    assert device is not None
    assert device.name == "Ambience"
    # Distinct from the house switch's device.
    house = dev_reg.async_get_device(identifiers={(DOMAIN, "ambience")})
    assert house is not None
    assert house.id != device.id


async def test_friendly_name_is_ambience_scene_updates(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    state = hass.states.get(SENSOR_ID)
    assert state.attributes["friendly_name"] == "Ambience Scene updates"


async def test_state_class_is_total_increasing(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """A continuous (state_class-bearing) sensor is the lever that keeps the
    sensor's own state changes OUT of the logbook (HA's is_sensor_continuous), so
    the rich apply line stays the single activity entry. Guard the contract."""
    state = hass.states.get(SENSOR_ID)
    assert state.attributes["state_class"] == SensorStateClass.TOTAL_INCREASING


async def test_state_changes_suppressed_from_logbook(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """The load-bearing contract: HA's logbook treats this sensor as continuous,
    so its own count state-changes are filtered out and only the rich apply/run
    line survives. Assert via HA's real is_sensor_continuous, not just the attr."""
    from homeassistant.components.logbook.helpers import is_sensor_continuous

    assert is_sensor_continuous(hass, er.async_get(hass), SENSOR_ID) is True


async def test_present_when_create_switches_off(hass: HomeAssistant) -> None:
    """The sensor + hub device must exist even with no scope switches — the
    activity anchor cannot depend on the optional create_switches feature."""
    await _setup_with_sun(hass)
    entry = MockConfigEntry(
        domain=DOMAIN, title="Ambience", data={}, options={}, unique_id="amb_no_switches"
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # create_switches defaults off ⇒ no house switch...
    assert hass.states.get("switch.house_ambience") is None
    # ...but the sensor and its hub device are still present.
    assert hass.states.get(SENSOR_ID) is not None
    assert dr.async_get(hass).async_get_device(identifiers={(DOMAIN, "hub")}) is not None


async def _save_area_scene(hass: HomeAssistant, area_name: str, scene_name: str) -> str:
    """Create a real area + a single one-action scene; return the area_id."""
    store = hass.data[DOMAIN][DATA_STORE]
    exposed = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed.save(
        [{"id": "cover.open_cover", "label": "", "visible_fields": [], "defaults": {}}]
    )
    area = ar.async_get(hass).async_create(area_name)
    await hass.async_block_till_done()
    await store.async_save_area(
        area.id,
        {
            "scenes": [
                {
                    "name": scene_name,
                    "category": "general",
                    "when": {},
                    "actions": [
                        {"service": "cover.open_cover", "entity_ids": ["cover.blind"], "params": {}}
                    ],
                }
            ],
        },
    )
    return area.id


async def test_apply_increments_count_and_sets_attributes(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    async_mock_service(hass, "cover", "open_cover")
    area_id = await _save_area_scene(hass, "Lounge", "Evening")

    await hass.services.async_call(
        DOMAIN, "apply_scene", {"scope": [f"area:{area_id}"]}, blocking=True
    )
    await hass.async_block_till_done()

    state = hass.states.get(SENSOR_ID)
    assert state.state == "1"
    attrs = state.attributes
    assert attrs["last_scene"] == "Evening"
    assert attrs["last_scope"] == "Lounge"
    assert attrs["last_scope_kind"] == "area"
    assert attrs["last_action"] == "applied"
    # Single configured category ⇒ no "(category)" suffix in the summary.
    assert attrs["summary"] == "applied 'Evening' in Lounge"
    assert attrs["applied_at"]


async def test_count_tallies_per_category_winner(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """A single apply across N winning categories bumps the count by N — the count
    tallies logbook entries (one per category winner), not service calls."""
    from custom_components.ambience.service import async_apply_scene

    async_mock_service(hass, "light", "turn_on")
    async_mock_service(hass, "cover", "open_cover")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_categories(
        [{"id": "lighting", "name": "Lights"}, {"id": "blinds", "name": "Blinds"}]
    )
    exposed = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed.save(
        [
            {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}},
            {"id": "cover.open_cover", "label": "", "visible_fields": [], "defaults": {}},
        ]
    )
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {
                    "name": "Evening",
                    "category": "lighting",
                    "when": {},
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                },
                {
                    "name": "Open",
                    "category": "blinds",
                    "when": {},
                    "actions": [
                        {"service": "cover.open_cover", "entity_ids": ["cover.blind"], "params": {}}
                    ],
                },
            ],
        },
    )

    await async_apply_scene(hass, "area", "lr")
    await hass.async_block_till_done()

    assert hass.states.get(SENSOR_ID).state == "2"


async def test_apply_logbook_entry_attached_to_sensor(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """The apply's logbook entry carries the sensor's entity_id, so it is
    filterable by the hub device."""
    entries = async_capture_events(hass, EVENT_LOGBOOK_ENTRY)
    async_mock_service(hass, "cover", "open_cover")
    area_id = await _save_area_scene(hass, "Lounge", "Evening")

    await hass.services.async_call(
        DOMAIN, "apply_scene", {"scope": [f"area:{area_id}"]}, blocking=True
    )
    await hass.async_block_till_done()

    amb = [e for e in entries if e.data.get("name") == "Ambience"]
    assert len(amb) == 1
    assert amb[0].data["entity_id"] == SENSOR_ID


async def test_run_logbook_entry_attached_to_sensor(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_run_scene_actions

    entries = async_capture_events(hass, EVENT_LOGBOOK_ENTRY)
    async_mock_service(hass, "cover", "open_cover")
    area_id = await _save_area_scene(hass, "Lounge", "Movie")

    await async_run_scene_actions(hass, "area", area_id, 0)
    await hass.async_block_till_done()

    amb = [e for e in entries if e.data.get("name") == "Ambience"]
    assert len(amb) == 1
    assert amb[0].data["entity_id"] == SENSOR_ID


async def test_log_entry_omits_entity_id_when_no_sensor(hass: HomeAssistant) -> None:
    """Fallback: without a registered sensor the entry is domain-only (pre-sensor
    behaviour) — the activity log never regresses if the sensor is disabled."""
    from custom_components.ambience.service_logbook import _log_entry

    hass.data.setdefault(DOMAIN, {})  # no DATA_ACTIVITY_SENSOR published
    entries = async_capture_events(hass, EVENT_LOGBOOK_ENTRY)

    _log_entry(hass, "hello")
    await hass.async_block_till_done()

    assert len(entries) == 1
    assert "entity_id" not in entries[0].data


async def test_restores_count_and_attributes(hass: HomeAssistant) -> None:
    """Count + last-apply detail survive a restart, so the at-a-glance summary
    and running total are not reset to zero on every HA restart."""
    mock_restore_cache(
        hass,
        [
            State(
                SENSOR_ID,
                "7",
                {
                    "summary": "applied 'Evening' in Lounge",
                    "last_scene": "Evening",
                    "last_scope": "Lounge",
                    "last_scope_kind": "area",
                    "last_category": None,
                    "last_action": "applied",
                    "applied_at": "2026-06-21T09:14:00+00:00",
                },
            )
        ],
    )
    await _setup_with_sun(hass)
    entry = MockConfigEntry(
        domain=DOMAIN, title="Ambience", data={}, options={}, unique_id="amb_restore"
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    state = hass.states.get(SENSOR_ID)
    assert state.state == "7"
    assert state.attributes["last_scene"] == "Evening"
    assert state.attributes["last_action"] == "applied"
    assert state.attributes["summary"] == "applied 'Evening' in Lounge"


async def test_restore_ignores_non_numeric_prior_state(hass: HomeAssistant) -> None:
    """A non-numeric restored state (e.g. unknown/unavailable) leaves the count at
    0 rather than crashing; attributes still restore."""
    mock_restore_cache(hass, [State(SENSOR_ID, "unknown", {"last_scene": "Evening"})])
    await _setup_with_sun(hass)
    entry = MockConfigEntry(
        domain=DOMAIN, title="Ambience", data={}, options={}, unique_id="amb_restore_bad"
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    state = hass.states.get(SENSOR_ID)
    assert state.state == "0"
    assert state.attributes["last_scene"] == "Evening"
