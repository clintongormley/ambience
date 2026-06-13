"""Tests for build_apply_scene_schema's runtime-populated dropdown options.

Also covers the static apply_scene voluptuous schema (_APPLY_SCENE_SCHEMA).
"""

from __future__ import annotations

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience import _APPLY_SCENE_SCHEMA
from custom_components.ambience.const import DATA_STORE, DOMAIN, GENERAL_CATEGORY_ID
from custom_components.ambience.service import build_apply_scene_schema, scope_option_value


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry: MockConfigEntry):
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


# ---------------------------------------------------------------------------
# Static voluptuous schema
# ---------------------------------------------------------------------------


def test_empty_is_valid():
    # No target => all scopes; the schema permits an empty call and defaults force off.
    assert _APPLY_SCENE_SCHEMA({}) == {"force": False}


def test_force_defaults_to_false():
    assert _APPLY_SCENE_SCHEMA({})["force"] is False


def test_scope_coerced_to_list():
    out = _APPLY_SCENE_SCHEMA({"scope": "area:living_room"})
    assert out["scope"] == ["area:living_room"]


def test_scope_multiple_accepted():
    out = _APPLY_SCENE_SCHEMA({"scope": ["house", "floor:ground", "area:lr"]})
    assert out["scope"] == ["house", "floor:ground", "area:lr"]


def test_category_and_scene_multiple():
    out = _APPLY_SCENE_SCHEMA({"category": ["lighting", "blinds"], "scene": "Movie"})
    assert out["category"] == ["lighting", "blinds"]
    assert out["scene"] == ["Movie"]


def test_force_accepted():
    assert _APPLY_SCENE_SCHEMA({"force": True})["force"] is True


def test_scene_without_category_is_now_valid():
    # The old "scene requires category" rule is gone; scenes resolve their own category.
    assert _APPLY_SCENE_SCHEMA({"scene": "Movie"})["scene"] == ["Movie"]


def test_scope_items_coerced_to_strings():
    # cv.string coerces non-string list items (e.g. a stray number) to str.
    assert _APPLY_SCENE_SCHEMA({"scope": [123]})["scope"] == ["123"]


def test_scope_rejects_nested_list():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"scope": [["nested"]]})


# ---------------------------------------------------------------------------
# build_apply_scene_schema (runtime UI schema)
# ---------------------------------------------------------------------------


async def test_build_apply_scene_schema_options(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]

    # Two categories.
    await store.async_save_categories(
        [
            {"id": "lighting", "name": "Lighting"},
            {"id": "blinds", "name": "Blinds"},
        ]
    )
    # A house scene named "Evening".
    await store.async_save_house(
        {"scenes": [{"name": "Evening", "category": "lighting", "when": {}, "actions": []}]}
    )
    # An ENABLED area with a scene named "Movie".
    area = ar.async_get(hass).async_create("Kitchen")
    floor = fr.async_get(hass).async_create("Ground")
    await hass.async_block_till_done()
    await store.async_save_area(
        area.id,
        {"scenes": [{"name": "Movie", "category": "lighting", "when": {}, "actions": []}]},
    )
    # A DISABLED floor.
    await store.async_set_scope_enabled("floor", floor.floor_id, False)

    schema = build_apply_scene_schema(hass)
    fields = schema["fields"]

    scope_opts = fields["scope"]["selector"]["select"]["options"]
    values = [o["value"] for o in scope_opts]
    assert scope_option_value("house", None) in values  # house enabled
    assert scope_option_value("area", area.id) in values  # enabled area present
    assert scope_option_value("floor", floor.floor_id) not in values  # disabled floor omitted

    cat_opts = fields["category"]["selector"]["select"]["options"]
    assert {"value": "lighting", "label": "Lighting"} in cat_opts
    assert {"value": "blinds", "label": "Blinds"} in cat_opts

    scene_opts = fields["scene"]["selector"]["select"]["options"]
    scene_values = [o["value"] for o in scene_opts]
    assert scene_values == sorted(set(scene_values))  # distinct + sorted
    assert "Evening" in scene_values and "Movie" in scene_values

    for key in ("scope", "category", "scene"):
        sel = fields[key]["selector"]["select"]
        assert sel["multiple"] is True and sel["custom_value"] is True

    # force is a plain boolean selector
    assert fields["force"]["selector"] == {"boolean": {}}


async def test_build_apply_scene_schema_empty_store(hass, installed):
    """Empty store: house enabled by default (get_scope_enabled default True), no
    areas/floors, only the seeded General category, and no scene names."""
    schema = build_apply_scene_schema(hass)
    fields = schema["fields"]

    scope_opts = fields["scope"]["selector"]["select"]["options"]
    assert scope_opts == [{"value": scope_option_value("house", None), "label": "House"}]

    cat_opts = fields["category"]["selector"]["select"]["options"]
    assert cat_opts == [{"value": GENERAL_CATEGORY_ID, "label": "General"}]

    scene_opts = fields["scene"]["selector"]["select"]["options"]
    assert scene_opts == []


async def test_build_apply_scene_schema_house_disabled(hass, installed):
    """A disabled house drops the House scope option entirely."""
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("house", None, False)

    schema = build_apply_scene_schema(hass)
    scope_opts = schema["fields"]["scope"]["selector"]["select"]["options"]
    assert scope_opts == []


async def test_build_apply_scene_schema_enabled_floor_and_blank_scene_names(hass, installed):
    """An enabled floor is listed; whitespace/blank scene names are dropped."""
    store = hass.data[DOMAIN][DATA_STORE]
    floor = fr.async_get(hass).async_create("Loft")
    await hass.async_block_till_done()
    # Enabled by default; give it a scene with a blank name plus a real one.
    await store.async_save_floor(
        floor.floor_id,
        {
            "scenes": [
                {"name": "   ", "category": "general", "when": {}, "actions": []},
                {"name": "Reading", "category": "general", "when": {}, "actions": []},
            ]
        },
    )

    schema = build_apply_scene_schema(hass)
    fields = schema["fields"]

    scope_values = [o["value"] for o in fields["scope"]["selector"]["select"]["options"]]
    assert scope_option_value("floor", floor.floor_id) in scope_values
    # The floor label is suffixed with its kind.
    floor_opt = next(
        o
        for o in fields["scope"]["selector"]["select"]["options"]
        if o["value"] == scope_option_value("floor", floor.floor_id)
    )
    assert floor_opt["label"] == "Loft (floor)"

    scene_values = [o["value"] for o in fields["scene"]["selector"]["select"]["options"]]
    assert scene_values == ["Reading"]  # blank name dropped
