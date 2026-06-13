"""Unit tests for apply_scene scope resolution + named-scene planning."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.service import (
    _plan_named_scenes,
    _resolve_target_scopes,
    parse_scope_option,
    scope_option_value,
)


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry: MockConfigEntry):
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


def test_scope_option_value_encodes_each_kind():
    assert scope_option_value("house", None) == "house"
    assert scope_option_value("floor", "ground") == "floor:ground"
    assert scope_option_value("area", "kitchen") == "area:kitchen"


def test_parse_scope_option_round_trips_and_rejects_bad():
    assert parse_scope_option("house") == ("house", None)
    assert parse_scope_option("floor:ground") == ("floor", "ground")
    assert parse_scope_option("area:kitchen") == ("area", "kitchen")
    with pytest.raises(ServiceValidationError):
        parse_scope_option("bogus")
    with pytest.raises(ServiceValidationError):
        parse_scope_option("zone:x")
    with pytest.raises(ServiceValidationError):
        parse_scope_option("area:")


async def test_resolve_explicit_scopes_preserve_order(hass, installed):
    area = ar.async_get(hass).async_create("LR")
    scopes = _resolve_target_scopes(hass, {"scope": ["house", scope_option_value("area", area.id)]})
    assert scopes == [("house", None), ("area", area.id)]


async def test_resolve_blank_targets_every_scope(hass, installed):
    area = ar.async_get(hass).async_create("LR")
    floor = fr.async_get(hass).async_create("Ground")
    await hass.async_block_till_done()
    scopes = _resolve_target_scopes(hass, {})
    assert ("house", None) in scopes
    assert ("floor", floor.floor_id) in scopes
    assert ("area", area.id) in scopes


async def test_resolve_unknown_area_raises(hass, installed):
    with pytest.raises(ServiceValidationError):
        _resolve_target_scopes(hass, {"scope": ["area:ghost"]})


async def test_resolve_unknown_floor_raises(hass, installed):
    with pytest.raises(ServiceValidationError):
        _resolve_target_scopes(hass, {"scope": ["floor:ghost"]})


async def test_resolve_dedups_repeated_ids(hass, installed):
    # Repeated ids (easy to write in YAML) must not apply the same scope twice.
    area = ar.async_get(hass).async_create("LR")
    value = f"area:{area.id}"
    scopes = _resolve_target_scopes(hass, {"scope": [value, value]})
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
