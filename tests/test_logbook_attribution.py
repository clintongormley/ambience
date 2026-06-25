"""Logbook attribution: message composition + activity-line state + context propagation.

Each apply/run sets the Scene-updates sensor's state to the rich activity line
(that state change IS the logbook entry), and shares one Context between that
state change and the dispatched device service calls so the logbook groups the
device changes under the activity.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.const import EVENT_STATE_CHANGED, STATE_UNKNOWN
from homeassistant.core import Event, HomeAssistant, callback
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

SENSOR_ID = "sensor.ambience_scene_updates"


async def _make_area_scope(hass: HomeAssistant, name: str) -> tuple[str, str]:
    """Create a real HA area (spawning its scope switch) → (area_id, switch entity_id)."""
    area = ar.async_get(hass).async_create(name)
    await hass.async_block_till_done()
    return area.id, hass.data[DOMAIN][DATA_SWITCHES][("area", area.id)].entity_id


def _capture_activity(hass: HomeAssistant) -> dict[str, str]:
    """Track Scene-updates state changes → {activity line: state-change context id}.

    Each apply/run sets the sensor state to its activity line; we record the
    context so tests can assert the device service calls share it.
    """
    by_message: dict[str, str] = {}

    @callback
    def _track(event: Event) -> None:
        if event.data["entity_id"] == SENSOR_ID and (new := event.data["new_state"]) is not None:
            by_message[new.state] = new.context.id

    hass.bus.async_listen(EVENT_STATE_CHANGED, _track)
    return by_message


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
    # category_count > 1 with an unknown/labelless category: suffix is omitted.
    msg = compose_apply_message(
        scene_name="Evening",
        scene_index=0,
        scope_label="Master Bedroom",
        category_label=None,
        category_count=2,
    )
    assert msg == "'Evening' in Master Bedroom"


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


async def test_apply_sets_activity_state_and_shares_context(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_apply_scene

    cover_calls = async_mock_service(hass, "cover", "open_cover")
    store = hass.data[DOMAIN][DATA_STORE]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "cover.open_cover", "label": "", "visible_fields": [], "defaults": {}}]
    )
    area_id, _ = await _make_area_scope(hass, "Lounge")
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

    await async_apply_scene(hass, "area", area_id)
    await hass.async_block_till_done()

    # The sensor's state is the activity line (single category ⇒ no "(category)"
    # suffix; scope label is the real area's friendly name).
    sensor = hass.states.get(SENSOR_ID)
    assert sensor.state == "'Evening' in Lounge"
    # The dispatched device call shares the activity's context, so the logbook
    # groups the cover change under the Scene-updates entry.
    assert len(cover_calls) == 1
    assert cover_calls[0].context.id == sensor.context.id


async def test_apply_with_empty_actions_records_nothing(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_apply_scene

    store = hass.data[DOMAIN][DATA_STORE]
    area_id, _ = await _make_area_scope(hass, "Lounge")
    await store.async_save_area(
        area_id,
        {"scenes": [{"name": "Empty", "category": "general", "when": {}, "actions": []}]},
    )

    await async_apply_scene(hass, "area", area_id)
    await hass.async_block_till_done()

    # Nothing applied ⇒ no activity ⇒ the sensor stays unknown.
    assert hass.states.get(SENSOR_ID).state == STATE_UNKNOWN


async def test_multiple_categories_own_activity_line_and_context(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_apply_scene

    activity = _capture_activity(hass)
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

    # One activity line per category winner, each its own logbook entry.
    assert "'Evening' in lr (Lights)" in activity
    assert "'Open' in lr (Blinds)" in activity
    assert light_calls[0].context.id == activity["'Evening' in lr (Lights)"]
    assert cover_calls[0].context.id == activity["'Open' in lr (Blinds)"]
    # Independent contexts per category.
    assert light_calls[0].context.id != cover_calls[0].context.id


async def test_house_scope_label_is_global(hass: HomeAssistant, installed: MockConfigEntry) -> None:
    from custom_components.ambience.service import async_apply_scene

    activity = _capture_activity(hass)
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

    await async_apply_scene(hass, "house", None)
    await hass.async_block_till_done()

    assert "'Movie' in House" in activity


# --- run_scene_actions: own "ran ..." wording + shared context -----------------


async def test_run_scene_actions_sets_activity_state_and_shares_context(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_run_scene_actions

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

    # "lr" is not a real area ⇒ raw-id fallback (verb lives in the last_action attr).
    sensor = hass.states.get(SENSOR_ID)
    assert sensor.state == "'Movie' in lr"
    assert len(light_calls) == 1
    assert light_calls[0].context.id == sensor.context.id


async def test_run_scene_actions_with_empty_actions_records_nothing(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from custom_components.ambience.service import async_run_scene_actions

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {"scenes": [{"name": "Empty", "category": "general", "when": {}, "actions": []}]},
    )

    await async_run_scene_actions(hass, "area", "lr", 0)
    await hass.async_block_till_done()

    assert hass.states.get(SENSOR_ID).state == STATE_UNKNOWN
