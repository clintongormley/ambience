"""Logbook attribution: message composition + per-scope logbook entries + context.

Each apply/run records a Home Assistant logbook entry against the scope's switch
entity (area switch → filterable by that area) and shares one Context between the
entry and the dispatched device service calls so the logbook groups the device
changes under the activity.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.components.logbook.const import (
    EVENT_LOGBOOK_ENTRY,
    LOGBOOK_ENTRY_DOMAIN,
    LOGBOOK_ENTRY_ENTITY_ID,
    LOGBOOK_ENTRY_MESSAGE,
    LOGBOOK_ENTRY_NAME,
)
from homeassistant.core import Context, Event, HomeAssistant, callback
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_mock_service,
)

from custom_components.ambience.const import (
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)
from custom_components.ambience.service_logbook import compose_apply_message


async def _make_area_scope(hass: HomeAssistant, name: str) -> tuple[str, str]:
    """Create a real HA area (spawning its scope switch) → (area_id, switch entity_id)."""
    area = ar.async_get(hass).async_create(name)
    await hass.async_block_till_done()
    return area.id, hass.data[DOMAIN][DATA_SWITCHES][("area", area.id)].entity_id


def _capture_logbook(hass: HomeAssistant) -> list[Event]:
    """Collect EVENT_LOGBOOK_ENTRY events fired during a test."""
    events: list[Event] = []

    @callback
    def _track(event: Event) -> None:
        events.append(event)

    hass.bus.async_listen(EVENT_LOGBOOK_ENTRY, _track)
    return events


class _FakeExposedStorage:
    """In-memory stand-in for ExposedActionsStore's storage backend."""

    def __init__(self, initial: list[dict] | None = None) -> None:
        self._actions: list[dict] = list(initial or [])

    def get_exposed_actions(self) -> list[dict]:
        return list(self._actions)

    async def async_save_exposed_actions(self, actions: list[dict]) -> None:
        self._actions = list(actions)


# --- Pure message composition -------------------------------------------------


def test_message_named_scene_single_category() -> None:
    msg = compose_apply_message(
        scene_name="Evening",
        scene_index=0,
        scope_label="Master Bedroom",
        category_label="Lights",
        category_count=1,
    )
    assert msg == "'Evening' in Master Bedroom"


def test_message_multiple_categories_includes_category() -> None:
    msg = compose_apply_message(
        scene_name="Evening",
        scene_index=0,
        scope_label="Master Bedroom",
        category_label="Lights",
        category_count=2,
    )
    assert msg == "'Evening' in Master Bedroom (Lights)"


def test_message_unnamed_scene_falls_back_to_index() -> None:
    msg = compose_apply_message(
        scene_name=None,
        scene_index=2,
        scope_label="Kitchen",
        category_label=None,
        category_count=1,
    )
    assert msg == "'scene 3' in Kitchen"


def test_message_multiple_categories_but_no_label_omits_category() -> None:
    msg = compose_apply_message(
        scene_name="Evening",
        scene_index=0,
        scope_label="Master Bedroom",
        category_label=None,
        category_count=2,
    )
    assert msg == "'Evening' in Master Bedroom"


# --- Context propagation through async_execute_actions ------------------------


async def test_execute_actions_passes_context_to_service_calls(hass: HomeAssistant) -> None:
    from custom_components.ambience.exposed_actions import ExposedActionsStore
    from custom_components.ambience.service import async_execute_actions

    calls = async_mock_service(hass, "light", "turn_on")
    hass.data[DOMAIN] = {
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    await hass.data[DOMAIN][DATA_EXPOSED_ACTIONS].save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )

    ctx = Context()
    await async_execute_actions(
        hass,
        "area",
        "lr",
        [{"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}],
        scene_index=0,
        context=ctx,
    )

    assert len(calls) == 1
    assert calls[0].context.id == ctx.id


# --- Unit: switch resolution + fallback + skip --------------------------------


async def test_log_apply_falls_back_to_house_switch_for_scope_without_one(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service_logbook import log_apply

    house_entity_id = hass.data[DOMAIN][DATA_SWITCHES][("house", None)].entity_id
    events = _capture_logbook(hass)

    # ("area", "lr") is not a real HA area ⇒ no switch ⇒ fallback to house switch.
    log_apply(hass, "area", "lr", "general", "Movie", 0)
    await hass.async_block_till_done()

    assert len(events) == 1
    assert events[0].data[LOGBOOK_ENTRY_ENTITY_ID] == house_entity_id


async def test_log_apply_skips_logbook_when_no_switch_exists(hass: HomeAssistant) -> None:
    from custom_components.ambience.service_logbook import log_apply

    # Minimal hass.data: no switches at all.
    hass.data[DOMAIN] = {DATA_SWITCHES: {}}
    events = _capture_logbook(hass)

    ctx = log_apply(hass, "area", "lr", "general", "Movie", 0)
    await hass.async_block_till_done()

    assert events == []
    assert isinstance(ctx, Context)  # still returns a context so the apply can run


# --- Behavioral: applies via the installed integration ------------------------


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


async def test_apply_logs_entry_on_area_switch_and_shares_context(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_apply_scene

    cover_calls = async_mock_service(hass, "cover", "open_cover")
    store = hass.data[DOMAIN][DATA_STORE]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "cover.open_cover", "label": "", "visible_fields": [], "defaults": {}}]
    )
    area_id, switch_entity_id = await _make_area_scope(hass, "Lounge")
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "Evening",
                    "category": "general",
                    "when": {},
                    "actions": [
                        {"service": "cover.open_cover", "entity_ids": ["cover.blind"], "params": {}}
                    ],
                }
            ],
        },
    )

    events = _capture_logbook(hass)
    await async_apply_scene(hass, "area", area_id)
    await hass.async_block_till_done()

    assert len(events) == 1
    data = events[0].data
    assert data[LOGBOOK_ENTRY_ENTITY_ID] == switch_entity_id
    assert data[LOGBOOK_ENTRY_NAME] == "Ambience"
    assert data[LOGBOOK_ENTRY_MESSAGE] == "'Evening' in Lounge"
    assert data[LOGBOOK_ENTRY_DOMAIN] == DOMAIN
    # The dispatched device call shares the entry's context ⇒ logbook grouping.
    assert len(cover_calls) == 1
    assert cover_calls[0].context.id == events[0].context.id


async def test_apply_with_empty_actions_logs_nothing(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_apply_scene

    store = hass.data[DOMAIN][DATA_STORE]
    area_id, _ = await _make_area_scope(hass, "Lounge")
    await store.async_save_area(
        area_id,
        {"scenes": [{"name": "Empty", "category": "general", "when": {}, "actions": []}]},
    )

    events = _capture_logbook(hass)
    await async_apply_scene(hass, "area", area_id)
    await hass.async_block_till_done()

    assert events == []


async def test_multiple_categories_each_log_entry_and_context(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_apply_scene

    light_calls = async_mock_service(hass, "light", "turn_on")
    cover_calls = async_mock_service(hass, "cover", "open_cover")
    house_entity_id = hass.data[DOMAIN][DATA_SWITCHES][("house", None)].entity_id
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_categories(
        [{"id": "lighting", "name": "Lights"}, {"id": "blinds", "name": "Blinds"}]
    )
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
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

    events = _capture_logbook(hass)
    await async_apply_scene(hass, "area", "lr")
    await hass.async_block_till_done()

    by_message = {e.data[LOGBOOK_ENTRY_MESSAGE]: e for e in events}
    assert "'Evening' in lr (Lights)" in by_message
    assert "'Open' in lr (Blinds)" in by_message
    # "lr" is not a real area ⇒ both entries fall back to the house switch.
    assert by_message["'Evening' in lr (Lights)"].data[LOGBOOK_ENTRY_ENTITY_ID] == house_entity_id
    assert by_message["'Open' in lr (Blinds)"].data[LOGBOOK_ENTRY_ENTITY_ID] == house_entity_id
    # Each category winner has its own independent context, shared with its calls.
    light_ctx = by_message["'Evening' in lr (Lights)"].context.id
    cover_ctx = by_message["'Open' in lr (Blinds)"].context.id
    assert light_calls[0].context.id == light_ctx
    assert cover_calls[0].context.id == cover_ctx
    assert light_ctx != cover_ctx


async def test_house_scope_logs_on_house_switch(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_apply_scene

    async_mock_service(hass, "light", "turn_on")
    house_entity_id = hass.data[DOMAIN][DATA_SWITCHES][("house", None)].entity_id
    store = hass.data[DOMAIN][DATA_STORE]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    await store.async_save_house(
        {
            "scenes": [
                {
                    "name": "Movie",
                    "category": "general",
                    "when": {},
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                }
            ],
        }
    )

    events = _capture_logbook(hass)
    await async_apply_scene(hass, "house", None)
    await hass.async_block_till_done()

    assert len(events) == 1
    assert events[0].data[LOGBOOK_ENTRY_MESSAGE] == "'Movie' in House"
    assert events[0].data[LOGBOOK_ENTRY_ENTITY_ID] == house_entity_id


async def test_run_scene_actions_logs_and_shares_context(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_run_scene_actions

    light_calls = async_mock_service(hass, "light", "turn_on")
    house_entity_id = hass.data[DOMAIN][DATA_SWITCHES][("house", None)].entity_id
    store = hass.data[DOMAIN][DATA_STORE]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {
                    "name": "Movie",
                    "category": "general",
                    "when": {},
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                }
            ],
        },
    )

    events = _capture_logbook(hass)
    await async_run_scene_actions(hass, "area", "lr", 0)
    await hass.async_block_till_done()

    # "lr" is not a real area ⇒ raw-id label, entry on the house switch (fallback).
    assert len(events) == 1
    assert events[0].data[LOGBOOK_ENTRY_MESSAGE] == "'Movie' in lr"
    assert events[0].data[LOGBOOK_ENTRY_ENTITY_ID] == house_entity_id
    assert len(light_calls) == 1
    assert light_calls[0].context.id == events[0].context.id


async def test_run_scene_actions_with_empty_actions_logs_nothing(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_run_scene_actions

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {"scenes": [{"name": "Empty", "category": "general", "when": {}, "actions": []}]},
    )

    events = _capture_logbook(hass)
    await async_run_scene_actions(hass, "area", "lr", 0)
    await hass.async_block_till_done()

    assert events == []


async def test_setup_removes_legacy_scene_updates_entity_and_hub_device(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    mock_config_entry.add_to_hass(hass)
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        "sensor", DOMAIN, "ambience_scene_updates", config_entry=mock_config_entry
    )
    dev_reg = dr.async_get(hass)
    dev_reg.async_get_or_create(
        config_entry_id=mock_config_entry.entry_id, identifiers={(DOMAIN, "hub")}
    )

    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert ent_reg.async_get_entity_id("sensor", DOMAIN, "ambience_scene_updates") is None
    assert dev_reg.async_get_device(identifiers={(DOMAIN, "hub")}) is None
