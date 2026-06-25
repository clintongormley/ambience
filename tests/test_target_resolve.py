from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers import label_registry as lr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DOMAIN
from custom_components.ambience.target_resolve import (
    action_target,
    resolve_action_entities,
)


def test_action_target_prefers_explicit_target() -> None:
    action = {"service": "light.turn_on", "target": {"area_id": ["kitchen"]}, "params": {}}
    assert action_target(action) == {"area_id": ["kitchen"]}


def test_action_target_falls_back_to_legacy_entity_ids() -> None:
    action = {"service": "light.turn_on", "entity_ids": ["light.a", "light.b"], "params": {}}
    assert action_target(action) == {"entity_id": ["light.a", "light.b"]}


def test_action_target_drops_empty_lists_and_blank() -> None:
    assert action_target(
        {"service": "x.y", "target": {"area_id": [], "entity_id": ["light.a"]}}
    ) == {"entity_id": ["light.a"]}
    assert action_target({"service": "x.y"}) == {}
    assert action_target({"service": "x.y", "entity_ids": []}) == {}


def test_action_target_coerces_scalar_to_list() -> None:
    assert action_target({"service": "x.y", "target": {"area_id": "kitchen"}}) == {
        "area_id": ["kitchen"]
    }


def _entity_in_area(hass: HomeAssistant, suffix: str, area_id: str) -> str:
    reg = er.async_get(hass)
    e = reg.async_get_or_create("light", "demo", suffix)
    reg.async_update_entity(e.entity_id, area_id=area_id)
    return e.entity_id


async def test_resolve_area_target_intersected_to_area_scope(hass: HomeAssistant) -> None:
    kitchen = ar.async_get(hass).async_create("Kitchen")
    office = ar.async_get(hass).async_create("Office")
    k_light = _entity_in_area(hass, "k", kitchen.id)
    o_light = _entity_in_area(hass, "o", office.id)
    # label both lights so a label target spans two areas
    label = lr.async_get(hass).async_create("Reading")
    reg = er.async_get(hass)
    reg.async_update_entity(k_light, labels={label.label_id})
    reg.async_update_entity(o_light, labels={label.label_id})

    # Kitchen-scoped scene, label target → only the kitchen light survives.
    got = resolve_action_entities(hass, "area", kitchen.id, {"label_id": [label.label_id]})
    assert got == [k_light]


async def test_resolve_device_indirection(hass: HomeAssistant) -> None:
    kitchen = ar.async_get(hass).async_create("Kitchen")
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    dev = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={(DOMAIN, "dev1")}, name="Dev"
    )
    dr.async_get(hass).async_update_device(dev.id, area_id=kitchen.id)
    reg = er.async_get(hass)
    e = reg.async_get_or_create("light", "demo", "viadev", device_id=dev.id)
    got = resolve_action_entities(hass, "area", kitchen.id, {"device_id": [dev.id]})
    assert got == [e.entity_id]


async def test_resolve_house_scope_has_no_intersection(hass: HomeAssistant) -> None:
    office = ar.async_get(hass).async_create("Office")
    o_light = _entity_in_area(hass, "o", office.id)
    # house scene targeting the office area → office light kept (no clip).
    got = resolve_action_entities(hass, "house", None, {"area_id": [office.id]})
    assert got == [o_light]


async def test_resolve_floor_scope(hass: HomeAssistant) -> None:
    floor = fr.async_get(hass).async_create("Ground")
    area = ar.async_get(hass).async_create("Den")
    ar.async_get(hass).async_update(area.id, floor_id=floor.floor_id)
    light = _entity_in_area(hass, "den", area.id)
    got = resolve_action_entities(hass, "floor", floor.floor_id, {"area_id": [area.id]})
    assert got == [light]


async def test_resolve_empty_and_out_of_scope_return_empty(hass: HomeAssistant) -> None:
    kitchen = ar.async_get(hass).async_create("Kitchen")
    office = ar.async_get(hass).async_create("Office")
    _entity_in_area(hass, "o", office.id)
    assert resolve_action_entities(hass, "area", kitchen.id, {}) == []
    # office area targeted from a kitchen-scoped scene → nothing in scope.
    assert resolve_action_entities(hass, "area", kitchen.id, {"area_id": [office.id]}) == []
