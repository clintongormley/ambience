"""Validation rules for the apply_scene service schema."""

from __future__ import annotations

import pytest
import voluptuous as vol

from custom_components.ambience import _APPLY_SCENE_SCHEMA

_SCOPE = "switch.house_ambience"


def test_scope_only_is_valid():
    assert _APPLY_SCENE_SCHEMA({"scope": _SCOPE}) == {"scope": _SCOPE}


def test_scope_and_category_is_valid():
    out = _APPLY_SCENE_SCHEMA({"scope": _SCOPE, "category": "lighting"})
    assert out["category"] == "lighting"


def test_scope_category_and_scene_is_valid():
    out = _APPLY_SCENE_SCHEMA({"scope": _SCOPE, "category": "lighting", "scene": "Bright"})
    assert out["scene"] == "Bright"


def test_force_is_accepted():
    out = _APPLY_SCENE_SCHEMA({"scope": _SCOPE, "force": True})
    assert out["force"] is True


def test_scene_without_category_is_rejected():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"scope": _SCOPE, "scene": "Bright"})


def test_missing_scope_is_rejected():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"category": "lighting"})


def test_non_entity_id_scope_is_rejected():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"scope": "not an entity id"})
