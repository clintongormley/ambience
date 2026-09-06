"""Switch entities follow HA area + floor registries dynamically."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr

from custom_components.ambience.const import DATA_SWITCH_ADD_ENTITIES, DATA_SWITCHES, DOMAIN
from tests import get_scope_device


@pytest.fixture
async def installed(hass, mock_config_entry):
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def test_house_switch_present_after_setup(hass, installed):
    assert ("house", None) in hass.data[DOMAIN][DATA_SWITCHES]


async def test_initial_platform_adds_do_not_request_an_engine_refresh(
    hass, mock_config_entry
) -> None:
    """The platform's initial switch adds happen before the engine is built
    (DATA_ENGINE absent), so they must not touch it — only a switch that
    appears afterwards should."""
    from custom_components.ambience.trigger_engine import AutoTriggerEngine

    mock_config_entry.add_to_hass(hass)
    with (
        patch.object(AutoTriggerEngine, "note_config_changed") as noted,
        patch.object(AutoTriggerEngine, "async_request_refresh", new=AsyncMock()) as refresh,
    ):
        assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
        await hass.async_block_till_done()

    noted.assert_not_called()
    refresh.assert_not_awaited()


async def test_a_switch_added_at_runtime_requests_an_engine_refresh(hass, installed) -> None:
    """The engine's switch watch is frozen at subscribe; a switch that appears
    later must trigger a re-subscribe or its off->on is never seen."""
    from homeassistant.helpers import area_registry as ar

    from custom_components.ambience.trigger_engine import AutoTriggerEngine

    with (
        patch.object(AutoTriggerEngine, "note_config_changed") as noted,
        patch.object(AutoTriggerEngine, "async_request_refresh", new=AsyncMock()) as refresh,
    ):
        area = ar.async_get(hass).async_create("Attic")
        await hass.async_block_till_done()

    noted.assert_called_with(("area", area.id))
    refresh.assert_awaited()


async def test_area_added_post_setup_gets_a_switch(hass, installed):
    area = ar.async_get(hass).async_create("Garage")
    await hass.async_block_till_done()
    assert ("area", area.id) in hass.data[DOMAIN][DATA_SWITCHES]


async def test_floor_added_post_setup_gets_a_switch(hass, installed):
    floor = fr.async_get(hass).async_create("Loft")
    await hass.async_block_till_done()
    assert ("floor", floor.floor_id) in hass.data[DOMAIN][DATA_SWITCHES]


async def test_area_removal_drops_switch(hass, installed):
    area = ar.async_get(hass).async_create("Garage")
    await hass.async_block_till_done()
    uid = f"ambience_switch_area_{area.id}"
    ent_reg = er.async_get(hass)
    assert ent_reg.async_get_entity_id("switch", DOMAIN, uid) is not None

    ar.async_get(hass).async_delete(area.id)
    await hass.async_block_till_done()
    assert ("area", area.id) not in hass.data[DOMAIN][DATA_SWITCHES]
    assert ent_reg.async_get_entity_id("switch", DOMAIN, uid) is None


async def test_floor_removal_drops_switch(hass, installed):
    floor = fr.async_get(hass).async_create("Loft")
    await hass.async_block_till_done()
    uid = f"ambience_switch_floor_{floor.floor_id}"
    ent_reg = er.async_get(hass)
    assert ent_reg.async_get_entity_id("switch", DOMAIN, uid) is not None

    fr.async_get(hass).async_delete(floor.floor_id)
    await hass.async_block_till_done()
    assert ("floor", floor.floor_id) not in hass.data[DOMAIN][DATA_SWITCHES]
    assert ent_reg.async_get_entity_id("switch", DOMAIN, uid) is None


async def test_area_create_with_no_add_entities_callback_is_noop(hass, installed):
    """When add_entities is not yet set (DATA_SWITCH_ADD_ENTITIES absent) creating
    an area fires the handler but skips the add_entities call (191->193 branch)."""
    # Remove the callback so the guard at 191 sees add_entities is None.
    hass.data[DOMAIN].pop(DATA_SWITCH_ADD_ENTITIES, None)

    area = ar.async_get(hass).async_create("Sunroom")
    await hass.async_block_till_done()

    # No switch was registered because add_entities was absent.
    assert ("area", area.id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_floor_create_with_no_add_entities_callback_is_noop(hass, installed):
    """When add_entities is not yet set (DATA_SWITCH_ADD_ENTITIES absent) creating
    a floor fires the handler but skips the add_entities call (217->219 branch)."""
    hass.data[DOMAIN].pop(DATA_SWITCH_ADD_ENTITIES, None)

    floor = fr.async_get(hass).async_create("Basement")
    await hass.async_block_till_done()

    assert ("floor", floor.floor_id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_area_registry_unknown_action_is_ignored(hass, installed):
    """An area registry event with an action other than 'create' or 'remove'
    passes through both guards and exits silently (194->exit branch)."""
    area = ar.async_get(hass).async_create("Patio")
    await hass.async_block_till_done()

    # Fire a synthetic event with an unrecognised action.
    hass.bus.async_fire(
        ar.EVENT_AREA_REGISTRY_UPDATED,
        {"action": "updated", "area_id": area.id},
    )
    await hass.async_block_till_done()

    # Still present — the handler did nothing destructive.
    assert ("area", area.id) in hass.data[DOMAIN][DATA_SWITCHES]


async def test_floor_registry_unknown_action_is_ignored(hass, installed):
    """A floor registry event with an action other than 'create' or 'remove'
    exits silently (220->exit branch)."""
    floor = fr.async_get(hass).async_create("Attic")
    await hass.async_block_till_done()

    hass.bus.async_fire(
        fr.EVENT_FLOOR_REGISTRY_UPDATED,
        {"action": "updated", "floor_id": floor.floor_id},
    )
    await hass.async_block_till_done()

    assert ("floor", floor.floor_id) in hass.data[DOMAIN][DATA_SWITCHES]


async def test_area_removal_without_registered_entity_is_safe(hass, installed):
    """Removing an area whose switch entity was never registered in the entity
    registry skips async_remove (202->exit branch — ent_id is None)."""
    area = ar.async_get(hass).async_create("Shed")
    await hass.async_block_till_done()

    # Remove the entity from the registry manually so ent_id lookup returns None.
    ent_reg = er.async_get(hass)
    uid = f"ambience_switch_area_{area.id}"
    ent_id = ent_reg.async_get_entity_id("switch", DOMAIN, uid)
    if ent_id is not None:
        ent_reg.async_remove(ent_id)

    # Now remove the area — handler should not raise even with no entity in registry.
    ar.async_get(hass).async_delete(area.id)
    await hass.async_block_till_done()

    assert ("area", area.id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_floor_removal_without_registered_entity_is_safe(hass, installed):
    """Removing a floor whose switch entity was never registered in the entity
    registry skips async_remove (228->exit branch — ent_id is None)."""
    floor = fr.async_get(hass).async_create("Garden")
    await hass.async_block_till_done()

    ent_reg = er.async_get(hass)
    uid = f"ambience_switch_floor_{floor.floor_id}"
    ent_id = ent_reg.async_get_entity_id("switch", DOMAIN, uid)
    if ent_id is not None:
        ent_reg.async_remove(ent_id)

    fr.async_get(hass).async_delete(floor.floor_id)
    await hass.async_block_till_done()

    assert ("floor", floor.floor_id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_area_added_creates_subdevice_in_area(hass, installed):
    area = ar.async_get(hass).async_create("Garage")
    await hass.async_block_till_done()
    dev_reg = dr.async_get(hass)
    dev = get_scope_device(dev_reg, (DOMAIN, f"area_{area.id}"), installed.entry_id)
    assert dev is not None
    assert dev.area_id == area.id


async def test_area_removal_drops_subdevice(hass, installed):
    area = ar.async_get(hass).async_create("Garage")
    await hass.async_block_till_done()
    dev_reg = dr.async_get(hass)
    entry_id = installed.entry_id
    assert get_scope_device(dev_reg, (DOMAIN, f"area_{area.id}"), entry_id) is not None

    ar.async_get(hass).async_delete(area.id)
    await hass.async_block_till_done()
    assert get_scope_device(dev_reg, (DOMAIN, f"area_{area.id}"), entry_id) is None


async def test_floor_removal_drops_subdevice(hass, installed):
    floor = fr.async_get(hass).async_create("Loft")
    await hass.async_block_till_done()
    dev_reg = dr.async_get(hass)
    entry_id = installed.entry_id
    assert get_scope_device(dev_reg, (DOMAIN, f"floor_{floor.floor_id}"), entry_id) is not None

    fr.async_get(hass).async_delete(floor.floor_id)
    await hass.async_block_till_done()
    assert get_scope_device(dev_reg, (DOMAIN, f"floor_{floor.floor_id}"), entry_id) is None


async def test_area_rename_updates_device_name_via_registry_event(hass, installed):
    """Renaming an HA area updates the scope device name with no manual signal —
    the area-registry 'update' event must drive the resync in production."""
    area = ar.async_get(hass).async_create("Lounge")
    await hass.async_block_till_done()
    dev_reg = dr.async_get(hass)
    ident = (DOMAIN, f"area_{area.id}")
    entry_id = installed.entry_id
    assert get_scope_device(dev_reg, ident, entry_id).name == "Lounge Ambience"

    ar.async_get(hass).async_update(area.id, name="Den")
    await hass.async_block_till_done()
    assert get_scope_device(dev_reg, ident, entry_id).name == "Den Ambience"


async def test_floor_rename_updates_device_name_via_registry_event(hass, installed):
    """Renaming an HA floor updates the scope device name with no manual signal."""
    floor = fr.async_get(hass).async_create("Loft")
    await hass.async_block_till_done()
    dev_reg = dr.async_get(hass)
    entry_id = installed.entry_id
    name = get_scope_device(dev_reg, (DOMAIN, f"floor_{floor.floor_id}"), entry_id).name
    assert name == "Loft Ambience"

    fr.async_get(hass).async_update(floor.floor_id, name="Attic")
    await hass.async_block_till_done()
    name = get_scope_device(dev_reg, (DOMAIN, f"floor_{floor.floor_id}"), entry_id).name
    assert name == "Attic Ambience"


async def test_remove_scope_device_missing_is_noop(hass, installed):
    """_remove_scope_device for a scope with no device is a safe no-op (the
    device-is-None branch)."""
    from custom_components.ambience import _remove_scope_device

    # No device exists for this id — must not raise and must remove nothing.
    _remove_scope_device(hass, installed.entry_id, "area", "does-not-exist")
