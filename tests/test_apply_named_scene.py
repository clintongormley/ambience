"""async_apply_named_scene runs a named scene's actions directly, bypassing predicates."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.ambience.const import (
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DATA_SWITCHES,
    DATA_TRACE_BUFFER,
    DATA_TRACE_SINKS,
    DOMAIN,
)
from custom_components.ambience.service import async_apply_named_scene, get_last_applied
from custom_components.ambience.trace import BufferSink, CauseKind, Outcome


async def _install(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> str:
    area = ar.async_get(hass).async_create("Living Room")
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    exposed = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed.save([{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}])
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area.id,
        {
            "scenes": [
                {
                    "name": "Bright",
                    "category": "lighting",
                    # A predicate that is NOT currently true — proves we skip evaluation.
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.nope",
                            "states": ["on"],
                        }
                    },
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                }
            ]
        },
    )
    return area.id


async def test_runs_named_scene_actions_bypassing_predicates(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright")

    assert len(calls) == 1


async def test_skips_scenes_in_other_categories(hass, mock_config_entry):
    # A scene with the same name in a different category must not be matched; the
    # lookup skips it and finds the one in the requested category.
    area_id = await _install(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "Bright",
                    "category": "blinds",
                    "when": {},
                    "actions": [
                        {"service": "cover.open_cover", "entity_ids": ["cover.b"], "params": {}}
                    ],
                },
                {
                    "name": "Bright",
                    "category": "lighting",
                    "when": {},
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                },
            ]
        },
    )
    light_calls = async_mock_service(hass, "light", "turn_on")
    cover_calls = async_mock_service(hass, "cover", "open_cover")

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright")

    assert len(light_calls) == 1
    assert len(cover_calls) == 0


async def test_runs_with_tracing_inactive(hass, mock_config_entry):
    # When no trace buffer is registered, tracing_active() is False: the actions
    # still run and no trace is emitted.
    area_id = await _install(hass, mock_config_entry)
    hass.data[DOMAIN].pop(DATA_TRACE_BUFFER, None)
    calls = async_mock_service(hass, "light", "turn_on")

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright")

    assert len(calls) == 1


async def test_name_match_is_case_insensitive(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")

    await async_apply_named_scene(hass, "area", area_id, "lighting", "  bright  ")

    assert len(calls) == 1


async def test_unknown_name_raises(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")

    with pytest.raises(ServiceValidationError):
        await async_apply_named_scene(hass, "area", area_id, "lighting", "Nope")

    assert len(calls) == 0


async def test_empty_scene_name_does_not_match_unnamed_scene(hass, mock_config_entry):
    # An unnamed scene (blank name) is exempt from the uniqueness rule; an empty
    # scene_name must not silently match and run its actions.
    area_id = await _install(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "",
                    "category": "lighting",
                    "when": {},
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                }
            ]
        },
    )
    calls = async_mock_service(hass, "light", "turn_on")

    with pytest.raises(ServiceValidationError):
        await async_apply_named_scene(hass, "area", area_id, "lighting", "")

    assert len(calls) == 0


async def test_does_not_record_last_applied(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    async_mock_service(hass, "light", "turn_on")

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright")

    assert get_last_applied(hass, "area", area_id, "lighting") is None


async def test_noop_when_switch_off_without_force(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")
    switch = hass.data[DOMAIN][DATA_SWITCHES][("area", area_id)]
    await switch.async_turn_off()
    await hass.async_block_till_done()

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright")

    assert len(calls) == 0


async def test_force_runs_when_switch_off(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")
    switch = hass.data[DOMAIN][DATA_SWITCHES][("area", area_id)]
    await switch.async_turn_off()
    await hass.async_block_till_done()

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright", force=True)

    assert len(calls) == 1


async def test_blocked_when_scope_disabled(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("area", area_id, False)
    await hass.async_block_till_done()

    with pytest.raises(ServiceValidationError):
        await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright")

    assert len(calls) == 0


def _activate_tracing(hass) -> BufferSink:
    """Register a BufferSink so tracing_active() returns True and emit_trace() captures records."""
    buffer = BufferSink()
    hass.data.setdefault(DOMAIN, {})[DATA_TRACE_SINKS] = [buffer]
    hass.data[DOMAIN][DATA_TRACE_BUFFER] = buffer
    return buffer


async def test_emits_manual_acted_trace(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    async_mock_service(hass, "light", "turn_on")
    buffer = _activate_tracing(hass)

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright")

    records = buffer.records()
    assert len(records) == 1
    record = records[0]
    assert record.cause.kind == CauseKind.MANUAL
    assert record.unit.outcome == Outcome.ACTED
    assert record.unit.winner_name == "Bright"


async def test_named_scene_without_actions_emits_no_op(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    # Seed a scene with empty actions in the same area.
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "Blocker",
                    "category": "lighting",
                    "when": {},
                    "actions": [],
                }
            ]
        },
    )
    async_mock_service(hass, "light", "turn_on")
    buffer = _activate_tracing(hass)

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Blocker")

    records = buffer.records()
    assert len(records) == 1
    record = records[0]
    assert record.cause.kind == CauseKind.MANUAL
    assert record.unit.outcome == Outcome.NO_OP
    assert record.unit.winner_name == "Blocker"
