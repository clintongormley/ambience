"""Validation rules for the apply_scene service schema."""

from __future__ import annotations

import pytest
import voluptuous as vol

from custom_components.ambience import _APPLY_SCENE_SCHEMA


def test_scope_only_is_valid():
    assert _APPLY_SCENE_SCHEMA({"area": "lr"}) == {"area": "lr"}


def test_scope_and_category_is_valid():
    out = _APPLY_SCENE_SCHEMA({"area": "lr", "category": "lighting"})
    assert out["category"] == "lighting"


def test_scope_category_and_scene_is_valid():
    out = _APPLY_SCENE_SCHEMA({"area": "lr", "category": "lighting", "scene": "Bright"})
    assert out["scene"] == "Bright"


def test_force_is_accepted():
    out = _APPLY_SCENE_SCHEMA({"house": True, "force": True})
    assert out["force"] is True


def test_scene_without_category_is_rejected():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"area": "lr", "scene": "Bright"})


def test_no_scope_is_rejected():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"category": "lighting"})


def test_two_scopes_rejected():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"area": "lr", "floor": "ground"})
