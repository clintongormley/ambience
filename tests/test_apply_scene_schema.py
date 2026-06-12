"""Validation rules for the apply_scene service schema (scope-id targeting)."""

from __future__ import annotations

import pytest
import voluptuous as vol

from custom_components.ambience import _APPLY_SCENE_SCHEMA


def test_empty_is_valid():
    # No target => all scopes; the schema permits an empty call.
    assert _APPLY_SCENE_SCHEMA({}) == {}


def test_areas_and_floors_coerced_to_lists():
    out = _APPLY_SCENE_SCHEMA({"areas": "living_room", "floors": ["ground"]})
    assert out["areas"] == ["living_room"]
    assert out["floors"] == ["ground"]


def test_house_boolean_accepted():
    assert _APPLY_SCENE_SCHEMA({"house": True})["house"] is True


def test_category_and_scene_multiple():
    out = _APPLY_SCENE_SCHEMA({"category": ["lighting", "blinds"], "scene": "Movie"})
    assert out["category"] == ["lighting", "blinds"]
    assert out["scene"] == ["Movie"]


def test_force_accepted():
    assert _APPLY_SCENE_SCHEMA({"force": True})["force"] is True


def test_scene_without_category_is_now_valid():
    # The old "scene requires category" rule is gone; scenes resolve their own category.
    assert _APPLY_SCENE_SCHEMA({"scene": "Movie"})["scene"] == ["Movie"]


def test_house_coerces_truthy_strings():
    # cv.boolean coerces YAML-style truthy strings (matches the `force` field).
    assert _APPLY_SCENE_SCHEMA({"house": "yes"})["house"] is True


def test_house_rejects_non_boolean():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"house": ["not", "a", "bool"]})
