"""Scope switches are always created for every enabled scope (no opt-out)."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import (
    DATA_STORE,
    DATA_SWITCH_ADD_ENTITIES,
    DATA_SWITCHES,
    DATA_SWITCHES_PENDING,
    DOMAIN,
)
from custom_components.ambience.switch import _PENDING_CLAIM_TTL, reconcile_scope_switches


def _entry(hass, *, uid: str) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, title="Ambience", data={}, options={}, unique_id=uid)
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
async def installed(hass, mock_config_entry):
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def test_house_and_enabled_area_get_switches_with_no_seed(hass: HomeAssistant) -> None:
    # No store pre-seed at all (clean install) ⇒ switches still created.
    area = ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, uid="fresh")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    keys = set(hass.data[DOMAIN][DATA_SWITCHES])
    assert ("house", None) in keys
    assert ("area", area.id) in keys


async def test_area_created_after_setup_gets_a_switch(hass: HomeAssistant) -> None:
    entry = _entry(hass, uid="late")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    area = ar.async_get(hass).async_create("Late Room")
    await hass.async_block_till_done()
    assert ("area", area.id) in hass.data[DOMAIN][DATA_SWITCHES]


async def test_disabled_scope_still_gets_no_switch(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, uid="disabled")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("area", area.id, False)
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert ("area", area.id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_disabled_floor_still_gets_no_switch(hass: HomeAssistant) -> None:
    floor = fr.async_get(hass).async_create("Upstairs")
    entry = _entry(hass, uid="floor_disabled")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("floor", floor.floor_id, False)
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert ("floor", floor.floor_id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_disabled_house_still_gets_no_switch(hass: HomeAssistant) -> None:
    entry = _entry(hass, uid="house_disabled")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("house", None, False)
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert ("house", None) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_reconcile_ignores_non_ambience_switch_entities(hass: HomeAssistant) -> None:
    # A non-switch entity owned by the ambience config entry must be skipped by the
    # reconcile (only ambience SWITCH entities are eligible for deletion).
    entry = _entry(hass, uid="foreign")
    reg = er.async_get(hass)
    reg.async_get_or_create("sensor", DOMAIN, "ambience_not_a_switch", config_entry=entry)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert reg.async_get_entity_id("sensor", DOMAIN, "ambience_not_a_switch") is not None


async def test_reconcile_does_not_re_add_a_switch_whose_add_is_still_in_flight(
    hass: HomeAssistant, installed
) -> None:
    """Between add_entities() and async_added_to_hass the switch is not yet in
    DATA_SWITCHES; a second reconcile inside that window must not add it again."""
    added: list[list[Any]] = []
    hass.data[DOMAIN][DATA_SWITCH_ADD_ENTITIES] = added.append  # records, never adds
    hass.data[DOMAIN][DATA_SWITCHES].pop(("house", None))  # simulate "not yet added"

    reconcile_scope_switches(hass, installed)
    reconcile_scope_switches(hass, installed)

    assert len(added) == 1
    assert [e.scope_key for e in added[0]] == [("house", None)]


async def test_an_aborted_add_releases_the_pending_claim(hass: HomeAssistant, installed) -> None:
    """HA can drop an entity before it is added; the pending claim must go with
    it so a later reconcile is free to try the scope again."""
    added: list[list[Any]] = []
    hass.data[DOMAIN][DATA_SWITCH_ADD_ENTITIES] = added.append
    hass.data[DOMAIN][DATA_SWITCHES].pop(("house", None))

    reconcile_scope_switches(hass, installed)
    (entity,) = added[0]
    entity.hass = hass
    entity.add_to_platform_abort()  # HA dropped it (duplicate id / disabled)

    assert ("house", None) not in hass.data[DOMAIN][DATA_SWITCHES_PENDING]
    reconcile_scope_switches(hass, installed)
    assert len(added) == 2  # free to try again


async def test_a_stale_pending_claim_is_retried(hass: HomeAssistant, installed) -> None:
    """HA can abandon an add without calling add_to_platform_abort — it swallows
    a per-entity add error, and drops whatever is left after an add timeout. A
    claim outliving its add must expire, or the scope is never created again."""
    added: list[list[Any]] = []
    hass.data[DOMAIN][DATA_SWITCH_ADD_ENTITIES] = added.append
    hass.data[DOMAIN][DATA_SWITCHES].pop(("house", None))

    reconcile_scope_switches(hass, installed)
    assert len(added) == 1

    # Age the claim past its TTL; the scope is still desired, so only expiry
    # can release it.
    hass.data[DOMAIN][DATA_SWITCHES_PENDING][("house", None)] -= _PENDING_CLAIM_TTL + 1

    reconcile_scope_switches(hass, installed)
    assert len(added) == 2


async def test_a_claim_for_a_scope_no_longer_desired_is_dropped(
    hass: HomeAssistant, installed
) -> None:
    """A claim must not outlive the scope wanting a switch, or re-enabling that
    scope would find it still claimed and never create the switch."""
    area = ar.async_get(hass).async_create("Spare Room")
    await hass.async_block_till_done()
    added: list[list[Any]] = []
    hass.data[DOMAIN][DATA_SWITCH_ADD_ENTITIES] = added.append
    hass.data[DOMAIN][DATA_SWITCHES].pop(("area", area.id))

    reconcile_scope_switches(hass, installed)
    assert ("area", area.id) in hass.data[DOMAIN][DATA_SWITCHES_PENDING]

    await hass.data[DOMAIN][DATA_STORE].async_set_scope_enabled("area", area.id, False)
    reconcile_scope_switches(hass, installed)

    assert ("area", area.id) not in hass.data[DOMAIN][DATA_SWITCHES_PENDING]
