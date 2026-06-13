"""Unit tests for apply_scene scope resolution + named-scene planning."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.service import _plan_named_scenes, _resolve_target_scopes


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry: MockConfigEntry):
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def test_resolve_explicit_scopes(hass, installed):
    area = ar.async_get(hass).async_create("LR")
    floor = fr.async_get(hass).async_create("Ground")
    scopes = _resolve_target_scopes(
        hass, {"areas": [area.id], "floors": [floor.floor_id], "house": True}
    )
    assert set(scopes) == {("area", area.id), ("floor", floor.floor_id), ("house", None)}


async def test_resolve_blank_means_all(hass, installed):
    area = ar.async_get(hass).async_create("LR")
    await hass.async_block_till_done()
    scopes = _resolve_target_scopes(hass, {})
    assert ("house", None) in scopes
    assert ("area", area.id) in scopes


async def test_resolve_unknown_area_raises(hass, installed):
    with pytest.raises(ServiceValidationError):
        _resolve_target_scopes(hass, {"areas": ["ghost"]})


async def test_resolve_unknown_floor_raises(hass, installed):
    with pytest.raises(ServiceValidationError):
        _resolve_target_scopes(hass, {"floors": ["ghost"]})


async def test_resolve_dedups_repeated_ids(hass, installed):
    # Repeated ids (easy to write in YAML) must not apply the same scope twice.
    area = ar.async_get(hass).async_create("LR")
    scopes = _resolve_target_scopes(hass, {"areas": [area.id, area.id]})
    assert scopes == [("area", area.id)]


async def test_plan_named_scene_resolves_category(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {"name": "Movie", "category": "lighting", "when": {}, "actions": []},
            ]
        },
    )
    plan = _plan_named_scenes(hass, [("area", "lr")], ["Movie"], None)
    assert plan == [("area", "lr", "lighting", "Movie")]


async def test_plan_absent_name_skipped(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {"name": "Movie", "category": "lighting", "when": {}, "actions": []},
            ]
        },
    )
    assert _plan_named_scenes(hass, [("area", "lr")], ["Nope"], None) == []


async def test_plan_ambiguous_name_raises(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {"name": "Movie", "category": "lighting", "when": {}, "actions": []},
                {"name": "Movie", "category": "blinds", "when": {}, "actions": []},
            ]
        },
    )
    with pytest.raises(ServiceValidationError):
        _plan_named_scenes(hass, [("area", "lr")], ["Movie"], None)


async def test_plan_category_narrows_eligibility(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {"name": "Movie", "category": "lighting", "when": {}, "actions": []},
                {"name": "Movie", "category": "blinds", "when": {}, "actions": []},
            ]
        },
    )
    plan = _plan_named_scenes(hass, [("area", "lr")], ["Movie"], ["lighting"])
    assert plan == [("area", "lr", "lighting", "Movie")]


async def test_plan_skips_disabled_scope(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {"name": "Movie", "category": "lighting", "when": {}, "actions": []},
            ]
        },
    )
    await store.async_set_scope_enabled("area", "lr", False)
    # A disabled scope is skipped, not planned (so the apply never raises for it).
    assert _plan_named_scenes(hass, [("area", "lr")], ["Movie"], None) == []


async def test_plan_skips_whitespace_named_scene(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]
    # A stored whitespace-only name must not be matchable (consistent with the apply stage).
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {"name": "   ", "category": "lighting", "when": {}, "actions": []},
            ]
        },
    )
    assert _plan_named_scenes(hass, [("area", "lr")], ["   "], None) == []
