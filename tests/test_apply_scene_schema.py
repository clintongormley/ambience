"""Validation rules for the apply_scene service schema (scope-id targeting)."""

from __future__ import annotations

import pytest
import voluptuous as vol

from custom_components.ambience import _APPLY_SCENE_SCHEMA


def test_empty_is_valid():
    # No target => all scopes; the schema permits an empty call.
    assert _APPLY_SCENE_SCHEMA({}) == {}


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
