"""The Ambience "Scene updates" activity sensor + hub device.

The sensor is the always-present logbook anchor: it lives on a dedicated
"Ambience" hub device so the activity log can be filtered by that device (and by
the entity itself), and its *state is the human-readable activity line* — so the
state change IS the logbook entry. It is deliberately NON-continuous (no
state_class / unit / numeric device_class): a continuous sensor is dropped by
HA's logbook filter (is_sensor_continuous / async_filter_entities), which is the
bug this design fixes. See test_logbook_attribution.py for the shared-context
(activity → device changes) grouping.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.const import EVENT_STATE_CHANGED, STATE_UNKNOWN
from homeassistant.core import HomeAssistant, State, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
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


async def test_sensor_is_created_unknown_until_first_activity(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """The state is the last activity line; with no activity yet it is unknown."""
    state = hass.states.get(SENSOR_ID)
    assert state is not None
    assert state.state == STATE_UNKNOWN


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


async def test_sensor_is_not_continuous(hass: HomeAssistant, installed: MockConfigEntry) -> None:
    """The load-bearing contract: the sensor must NOT be continuous, or HA's
    logbook treats it as a numeric trend and refuses to filter on it. No
    state_class / unit_of_measurement / numeric device_class."""
    from homeassistant.components.logbook.helpers import is_sensor_continuous

    state = hass.states.get(SENSOR_ID)
    assert "state_class" not in state.attributes
    assert "unit_of_measurement" not in state.attributes
    assert is_sensor_continuous(hass, er.async_get(hass), SENSOR_ID) is False


async def test_sensor_survives_logbook_entity_filter(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """Regression for the PR #121 bug: the Logbook websocket runs requested
    entity_ids through async_filter_entities, which DROPS continuous sensors.
    Our sensor must pass through so the activity log can be filtered by it (and,
    since the Logbook panel resolves a device filter to its entity_ids, by the
    Ambience device)."""
    from homeassistant.components.logbook.helpers import async_filter_entities

    assert async_filter_entities(hass, [SENSOR_ID]) == [SENSOR_ID]


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


async def test_apply_sets_state_message_and_attributes(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    async_mock_service(hass, "cover", "open_cover")
    area_id = await _save_area_scene(hass, "Lounge", "Evening")

    await hass.services.async_call(
        DOMAIN, "apply_scene", {"scope": [f"area:{area_id}"]}, blocking=True
    )
    await hass.async_block_till_done()

    state = hass.states.get(SENSOR_ID)
    # The state IS the rich activity line (the logbook entry). Single configured
    # category ⇒ no "(category)" suffix.
    assert state.state == "'Evening' in Lounge"
    attrs = state.attributes
    assert attrs["last_scene"] == "Evening"
    assert attrs["last_scope"] == "Lounge"
    assert attrs["last_scope_kind"] == "area"
    assert attrs["last_action"] == "applied"
    assert attrs["applied_at"]


async def test_state_is_truncated_to_ha_limit(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """A very long scene+scope name must not blow past HA's 255-char state limit
    (which would make HA drop the state to 'unknown' and lose the activity)."""
    from homeassistant.const import MAX_LENGTH_STATE_STATE

    async_mock_service(hass, "cover", "open_cover")
    area_id = await _save_area_scene(hass, "L" * 200, "E" * 200)

    await hass.services.async_call(
        DOMAIN, "apply_scene", {"scope": [f"area:{area_id}"]}, blocking=True
    )
    await hass.async_block_till_done()

    state = hass.states.get(SENSOR_ID)
    assert state.state != STATE_UNKNOWN
    assert len(state.state) <= MAX_LENGTH_STATE_STATE


async def test_apply_logs_one_state_change_per_category_winner(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """A single apply across N winning categories produces N activity lines — one
    state change per category winner (each its own logbook entry)."""
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

    messages: list[str] = []

    @callback
    def _track(event) -> None:
        if event.data["entity_id"] == SENSOR_ID and event.data["new_state"] is not None:
            messages.append(event.data["new_state"].state)

    hass.bus.async_listen(EVENT_STATE_CHANGED, _track)

    await async_apply_scene(hass, "area", "lr")
    await hass.async_block_till_done()

    assert "'Evening' in lr (Lights)" in messages
    assert "'Open' in lr (Blinds)" in messages


async def test_restores_state_and_attributes(hass: HomeAssistant) -> None:
    """The last activity line + structured detail survive a restart, so the
    entity shows the last activity rather than resetting to unknown."""
    mock_restore_cache(
        hass,
        [
            State(
                SENSOR_ID,
                "'Evening' in Lounge",
                {
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
    assert state.state == "'Evening' in Lounge"
    assert state.attributes["last_scene"] == "Evening"
    assert state.attributes["last_action"] == "applied"


async def test_restore_ignores_unknown_prior_state(hass: HomeAssistant) -> None:
    """A non-meaningful restored state (unknown/unavailable after a crash) leaves
    the entity unknown rather than restoring the literal word as the activity."""
    mock_restore_cache(hass, [State(SENSOR_ID, "unavailable", {"last_scene": "Evening"})])
    await _setup_with_sun(hass)
    entry = MockConfigEntry(
        domain=DOMAIN, title="Ambience", data={}, options={}, unique_id="amb_restore_bad"
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    state = hass.states.get(SENSOR_ID)
    assert state.state == STATE_UNKNOWN
    assert state.attributes["last_scene"] == "Evening"
