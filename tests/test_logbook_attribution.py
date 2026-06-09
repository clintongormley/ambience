"""Logbook attribution: message composition + context propagation."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.const import EVENT_LOGBOOK_ENTRY
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_capture_events,
    async_mock_service,
)

from custom_components.ambience.const import (
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)
from custom_components.ambience.service_logbook import compose_apply_message


def _house_scope(hass: HomeAssistant) -> str:
    return hass.data[DOMAIN][DATA_SWITCHES][("house", None)].entity_id


async def _make_area_scope(hass: HomeAssistant, name: str) -> tuple[str, str]:
    """Create a real HA area (spawning its scope switch) → (area_id, switch entity_id)."""
    area = ar.async_get(hass).async_create(name)
    await hass.async_block_till_done()
    return area.id, hass.data[DOMAIN][DATA_SWITCHES][("area", area.id)].entity_id


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
        reapplied=False,
        scene_name="Evening",
        scene_index=0,
        scope_label="Master Bedroom",
        category_label="Lights",
        category_count=1,
    )
    assert msg == "applied 'Evening' in Master Bedroom"


def test_message_multiple_categories_includes_category() -> None:
    msg = compose_apply_message(
        reapplied=False,
        scene_name="Evening",
        scene_index=0,
        scope_label="Master Bedroom",
        category_label="Lights",
        category_count=2,
    )
    assert msg == "applied 'Evening' in Master Bedroom (Lights)"


def test_message_unnamed_scene_falls_back_to_index() -> None:
    msg = compose_apply_message(
        reapplied=False,
        scene_name=None,
        scene_index=2,
        scope_label="Kitchen",
        category_label=None,
        category_count=1,
    )
    assert msg == "applied 'scene 3' in Kitchen"


def test_message_reapplied_verb() -> None:
    msg = compose_apply_message(
        reapplied=True,
        scene_name="Evening",
        scene_index=0,
        scope_label="Master Bedroom",
        category_label="Lights",
        category_count=2,
    )
    assert msg == "re-applied 'Evening' in Master Bedroom (Lights)"


def test_message_multiple_categories_but_no_label_omits_category() -> None:
    # category_count > 1 with an unknown/labelless category: suffix is omitted.
    msg = compose_apply_message(
        reapplied=False,
        scene_name="Evening",
        scene_index=0,
        scope_label="Master Bedroom",
        category_label=None,
        category_count=2,
    )
    assert msg == "applied 'Evening' in Master Bedroom"


def test_message_reapplied_single_category() -> None:
    msg = compose_apply_message(
        reapplied=True,
        scene_name="Evening",
        scene_index=0,
        scope_label="Master Bedroom",
        category_label="Lights",
        category_count=1,
    )
    assert msg == "re-applied 'Evening' in Master Bedroom"


# --- Context propagation through async_execute_actions ------------------------


async def test_execute_actions_passes_context_to_service_calls(
    hass: HomeAssistant,
) -> None:
    from homeassistant.core import Context

    from custom_components.ambience.const import DATA_EXPOSED_ACTIONS
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


# --- Behavioral: initial apply via the installed integration ------------------


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


async def test_apply_fires_ambience_entry_and_shares_context(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    entries = async_capture_events(hass, EVENT_LOGBOOK_ENTRY)
    cover_calls = async_mock_service(hass, "cover", "open_cover")
    store = hass.data[DOMAIN][DATA_STORE]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "cover.open_cover", "label": "", "visible_fields": [], "defaults": {}}]
    )
    area_id, scope = await _make_area_scope(hass, "Lounge")
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "Evening",
                    "category": "general",
                    "when": {},
                    "actions": [
                        {
                            "service": "cover.open_cover",
                            "entity_ids": ["cover.blind"],
                            "params": {},
                        }
                    ],
                }
            ],
        },
    )

    await hass.services.async_call(DOMAIN, "apply_scene", {"scope": scope}, blocking=True)
    await hass.async_block_till_done()

    ambience_entries = [e for e in entries if e.data.get("name") == "Ambience"]
    assert len(ambience_entries) == 1
    entry = ambience_entries[0]
    assert entry.data["domain"] == "ambience"
    # Single configured category ⇒ no "(category)" suffix; scope label is the
    # real area's friendly name.
    assert entry.data["message"] == "applied 'Evening' in Lounge"
    assert len(cover_calls) == 1
    assert cover_calls[0].context.id == entry.context.id


async def test_apply_with_empty_actions_logs_nothing(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    entries = async_capture_events(hass, EVENT_LOGBOOK_ENTRY)
    store = hass.data[DOMAIN][DATA_STORE]
    area_id, scope = await _make_area_scope(hass, "Lounge")
    await store.async_save_area(
        area_id,
        {"scenes": [{"name": "Empty", "category": "general", "when": {}, "actions": []}]},
    )

    await hass.services.async_call(DOMAIN, "apply_scene", {"scope": scope}, blocking=True)
    await hass.async_block_till_done()

    assert [e for e in entries if e.data.get("name") == "Ambience"] == []


async def test_multiple_categories_include_category_name_and_own_context(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_apply_scene

    entries = async_capture_events(hass, EVENT_LOGBOOK_ENTRY)
    light_calls = async_mock_service(hass, "light", "turn_on")
    cover_calls = async_mock_service(hass, "cover", "open_cover")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_categories(
        [
            {"id": "lighting", "name": "Lights"},
            {"id": "blinds", "name": "Blinds"},
        ]
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

    await async_apply_scene(hass, "area", "lr")
    await hass.async_block_till_done()

    by_msg = {e.data["message"]: e for e in entries if e.data.get("name") == "Ambience"}
    assert "applied 'Evening' in lr (Lights)" in by_msg
    assert "applied 'Open' in lr (Blinds)" in by_msg
    assert light_calls[0].context.id == by_msg["applied 'Evening' in lr (Lights)"].context.id
    assert cover_calls[0].context.id == by_msg["applied 'Open' in lr (Blinds)"].context.id
    # Independent contexts per category.
    assert light_calls[0].context.id != cover_calls[0].context.id


async def test_house_scope_label_is_global(hass: HomeAssistant, installed: MockConfigEntry) -> None:
    entries = async_capture_events(hass, EVENT_LOGBOOK_ENTRY)
    async_mock_service(hass, "light", "turn_on")
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

    await hass.services.async_call(
        DOMAIN, "apply_scene", {"scope": _house_scope(hass)}, blocking=True
    )
    await hass.async_block_till_done()

    msgs = [e.data["message"] for e in entries if e.data.get("name") == "Ambience"]
    assert "applied 'Movie' in House" in msgs


# --- run_scene_actions: own "ran ..." wording + shared context -----------------


async def test_run_scene_actions_fires_ambience_entry_and_shares_context(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_run_scene_actions

    entries = async_capture_events(hass, EVENT_LOGBOOK_ENTRY)
    light_calls = async_mock_service(hass, "light", "turn_on")
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

    await async_run_scene_actions(hass, "area", "lr", 0)
    await hass.async_block_till_done()

    ambience_entries = [e for e in entries if e.data.get("name") == "Ambience"]
    assert len(ambience_entries) == 1
    entry = ambience_entries[0]
    assert entry.data["domain"] == "ambience"
    # run-actions uses the "ran" verb; "lr" is not a real area ⇒ raw-id fallback.
    assert entry.data["message"] == "ran 'Movie' in lr"
    assert len(light_calls) == 1
    assert light_calls[0].context.id == entry.context.id


async def test_run_scene_actions_with_empty_actions_logs_nothing(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_run_scene_actions

    entries = async_capture_events(hass, EVENT_LOGBOOK_ENTRY)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {"scenes": [{"name": "Empty", "category": "general", "when": {}, "actions": []}]},
    )

    await async_run_scene_actions(hass, "area", "lr", 0)
    await hass.async_block_till_done()

    assert [e for e in entries if e.data.get("name") == "Ambience"] == []
