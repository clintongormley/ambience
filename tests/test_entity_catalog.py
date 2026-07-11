"""The entity catalog: the registry walk both AI exports share, plus the summary
and search that keep the MCP context bounded."""

from __future__ import annotations

from homeassistant.components.diagnostics import REDACTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er

from custom_components.ambience.entity_catalog import entity_rows


async def test_entity_rows_carry_area_domain_and_state(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get_or_create("light", "ambience", "lamp1", suggested_object_id="lamp")
    ent_reg.async_update_entity(entry.entity_id, area_id=area.id)
    hass.states.async_set(entry.entity_id, "on", {"friendly_name": "Lamp"})

    rows = entity_rows(hass)

    lamp = next(r for r in rows if r["entity_id"] == entry.entity_id)
    assert lamp["domain"] == "light"
    assert lamp["area_id"] == area.id
    assert lamp["state"] == "on"


async def test_entity_rows_are_sorted_by_entity_id(hass: HomeAssistant) -> None:
    ent_reg = er.async_get(hass)
    for object_id in ("zulu", "alpha", "mike"):
        ent_reg.async_get_or_create("light", "ambience", object_id, suggested_object_id=object_id)

    rows = entity_rows(hass)

    ids = [r["entity_id"] for r in rows]
    assert ids == sorted(ids)


async def test_entity_rows_skip_disabled_and_hidden(hass: HomeAssistant) -> None:
    ent_reg = er.async_get(hass)
    disabled = ent_reg.async_get_or_create(
        "light",
        "ambience",
        "off1",
        suggested_object_id="disabled",
        disabled_by=er.RegistryEntryDisabler.USER,
    )
    hidden = ent_reg.async_get_or_create(
        "light",
        "ambience",
        "hid1",
        suggested_object_id="hidden",
        hidden_by=er.RegistryEntryHider.USER,
    )

    ids = {r["entity_id"] for r in entity_rows(hass)}

    assert disabled.entity_id not in ids
    assert hidden.entity_id not in ids


async def test_entity_rows_redact_presence_state(hass: HomeAssistant) -> None:
    ent_reg = er.async_get(hass)
    person = ent_reg.async_get_or_create("person", "ambience", "alice", suggested_object_id="alice")
    hass.states.async_set(person.entity_id, "home")

    row = next(r for r in entity_rows(hass) if r["entity_id"] == person.entity_id)

    assert row["state"] == REDACTED
