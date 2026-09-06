"""The one scope-kind table: per-kind facts, buckets, existence, not-found errors."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr

from custom_components.ambience.errors import AmbienceError
from custom_components.ambience.scopes import (
    find_scope_spec,
    iter_scope_kinds,
    not_found_error,
    not_found_validation_error,
    scope_bucket,
    scope_exists,
    scope_spec,
)

# --- the table ---------------------------------------------------------------


def test_scope_kinds_are_house_floor_area() -> None:
    assert [spec.kind for spec in iter_scope_kinds()] == ["house", "floor", "area"]


def test_house_is_the_only_id_less_kind() -> None:
    assert [spec.kind for spec in iter_scope_kinds() if not spec.has_id] == ["house"]


def test_buckets_and_accessors_name_the_stored_config() -> None:
    assert [(s.kind, s.bucket, s.store_getter, s.store_saver) for s in iter_scope_kinds()] == [
        ("house", "house", "get_house", "async_save_house"),
        ("floor", "floors", "get_floor", "async_save_floor"),
        ("area", "areas", "get_area", "async_save_area"),
    ]


def test_not_found_keys_match_the_exceptions_keys() -> None:
    assert scope_spec("area").not_found_key == "unknown_area"
    assert scope_spec("floor").not_found_key == "unknown_floor"
    # The house is implicit: it has no registry entry to lose.
    assert scope_spec("house").not_found_key is None
    assert scope_spec("house").registry_lookup is None


def test_scope_spec_raises_for_an_unknown_kind() -> None:
    with pytest.raises(AmbienceError) as exc:
        scope_spec("galaxy")
    assert exc.value.translation_key == "unknown_scope_kind"
    assert exc.value.translation_placeholders == {"scope_kind": "galaxy"}


def test_find_scope_spec_returns_none_for_an_unknown_kind() -> None:
    assert find_scope_spec("galaxy") is None
    assert find_scope_spec("area").kind == "area"


# --- buckets -----------------------------------------------------------------


def _data() -> dict:
    return {"areas": {}, "floors": {}, "house": {"scenes": []}}


def test_bucket_reads_do_not_create() -> None:
    data = _data()
    assert scope_bucket(data, "area", "ghost", create=False) == {}
    assert scope_bucket(data, "floor", "ghost", create=False) == {}
    assert data == _data()


def test_bucket_reads_return_the_stored_config() -> None:
    data = _data()
    data["areas"]["kitchen"] = {"scenes": [{"name": "A"}]}
    data["floors"]["up"] = {"scenes": [{"name": "B"}]}
    data["house"] = {"scenes": [{"name": "C"}]}
    assert scope_bucket(data, "area", "kitchen", create=False) == {"scenes": [{"name": "A"}]}
    assert scope_bucket(data, "floor", "up", create=False) == {"scenes": [{"name": "B"}]}
    assert scope_bucket(data, "house", None, create=False) == {"scenes": [{"name": "C"}]}


def test_bucket_read_tolerates_a_missing_bucket() -> None:
    assert scope_bucket({}, "area", "kitchen", create=False) == {}
    assert scope_bucket({}, "house", None, create=False) == {}


def test_bucket_create_inserts_an_empty_scope() -> None:
    data = _data()
    container = scope_bucket(data, "area", "kitchen", create=True)
    container["enabled"] = False
    assert data["areas"] == {"kitchen": {"scenes": [], "enabled": False}}
    floor = scope_bucket(data, "floor", "up", create=True)
    floor["enabled"] = True
    assert data["floors"] == {"up": {"scenes": [], "enabled": True}}


def test_bucket_create_seeds_the_house_and_returns_the_live_dict() -> None:
    data = {"areas": {}, "floors": {}}
    house = scope_bucket(data, "house", None, create=True)
    assert house == {"scenes": []}
    house["enabled"] = False
    assert data["house"] == {"scenes": [], "enabled": False}
    assert scope_bucket(data, "house", None, create=True) is data["house"]


def test_bucket_create_gives_each_scope_its_own_scene_list() -> None:
    data = _data()
    scope_bucket(data, "area", "a", create=True)["scenes"].append({"name": "A"})
    assert scope_bucket(data, "area", "b", create=True)["scenes"] == []


def test_bucket_raises_for_an_unknown_kind() -> None:
    with pytest.raises(AmbienceError) as exc:
        scope_bucket(_data(), "galaxy", "x", create=False)
    assert exc.value.translation_key == "unknown_scope_kind"


# --- existence ---------------------------------------------------------------


async def test_scope_exists_house_always(hass: HomeAssistant) -> None:
    assert scope_exists(hass, "house", None) is True


async def test_scope_exists_follows_the_registries(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Kitchen")
    floor = fr.async_get(hass).async_create("Upstairs")
    assert scope_exists(hass, "area", area.id) is True
    assert scope_exists(hass, "floor", floor.floor_id) is True
    assert scope_exists(hass, "area", "ghost") is False
    assert scope_exists(hass, "floor", "ghost") is False


async def test_scope_exists_is_false_for_an_unknown_kind(hass: HomeAssistant) -> None:
    """An undo/redo target of an unrecognised kind is discarded, not an error."""
    assert scope_exists(hass, "galaxy", "x") is False


# --- not-found errors --------------------------------------------------------


def test_not_found_error_carries_the_per_kind_key() -> None:
    area = not_found_error("area", "ghost")
    assert isinstance(area, AmbienceError)
    assert area.translation_key == "unknown_area"
    assert area.translation_placeholders == {"scope_id": "ghost"}
    assert not_found_error("floor", "ghost").translation_key == "unknown_floor"


def test_not_found_validation_error_is_a_service_validation_error() -> None:
    err = not_found_validation_error("floor", "ghost")
    assert isinstance(err, ServiceValidationError)
    assert err.translation_key == "unknown_floor"
    assert err.translation_placeholders == {"scope_id": "ghost"}
    assert not_found_validation_error("area", "ghost").translation_key == "unknown_area"


def test_not_found_error_rejects_the_house() -> None:
    """The house always exists, so asking for its not-found error is a caller bug."""
    with pytest.raises(ValueError, match="house"):
        not_found_error("house", None)
    with pytest.raises(ValueError, match="house"):
        not_found_validation_error("house", None)


def test_not_found_error_rejects_an_unknown_kind() -> None:
    with pytest.raises(AmbienceError) as exc:
        not_found_error("galaxy", "x")
    assert exc.value.translation_key == "unknown_scope_kind"
