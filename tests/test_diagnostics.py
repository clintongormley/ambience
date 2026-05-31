"""Diagnostics dump for the Ambience integration."""

from __future__ import annotations

import pytest
from homeassistant.components.diagnostics import REDACTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.diagnostics import (
    async_get_config_entry_diagnostics,
    async_get_device_diagnostics,
)
from custom_components.ambience.store import AmbienceStore


@pytest.fixture
async def seeded_store(hass: HomeAssistant) -> AmbienceStore:
    """A store populated with rules and matcher config carrying sensitive data."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_matcher_config(
        "day",
        {"workday_sensor": "binary_sensor.workday", "workday_calendar": "calendar.work"},
    )
    await store.async_save_matcher_config("weather", {"entity": "weather.home", "groups": []})
    await store.async_save_area(
        "living_room",
        {
            "rules": [
                {
                    "group": "general",
                    "when": {
                        "people": {"who": ["person.alice"], "where": "zone.work"},
                        "template": {"template": "{{ is_state('person.bob', 'home') }}"},
                    },
                    "actions": [
                        {
                            "action": "light.turn_on",
                            "entity_ids": ["light.lamp"],
                            "params": {"brightness_pct": 30},
                        }
                    ],
                }
            ]
        },
    )
    hass.data[DOMAIN] = {DATA_STORE: store}
    return store


async def test_config_entry_diagnostics_dumps_full_store(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    result = await async_get_config_entry_diagnostics(hass, mock_config_entry)

    # Full store is dumped: structure and non-sensitive content survive.
    assert "living_room" in result["areas"]
    rule = result["areas"]["living_room"]["rules"][0]
    assert rule["group"] == "general"
    assert rule["actions"][0]["entity_ids"] == ["light.lamp"]
    assert rule["actions"][0]["params"] == {"brightness_pct": 30}


async def test_config_entry_diagnostics_redacts_sensitive_keys(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    result = await async_get_config_entry_diagnostics(hass, mock_config_entry)

    assert result["matchers"]["day"]["workday_sensor"] == REDACTED
    assert result["matchers"]["day"]["workday_calendar"] == REDACTED
    assert result["matchers"]["weather"]["entity"] == REDACTED

    when = result["areas"]["living_room"]["rules"][0]["when"]
    assert when["people"]["who"] == REDACTED
    assert when["people"]["where"] == REDACTED
    # The template matcher's predicate key is itself `template`, so the whole
    # predicate value is redacted (the key — i.e. that a template rule exists —
    # still survives).
    assert when["template"] == REDACTED


async def test_config_entry_diagnostics_does_not_mutate_store(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    await async_get_config_entry_diagnostics(hass, mock_config_entry)

    # Redaction must operate on a copy — the live store keeps its real values.
    assert seeded_store.get_matcher_config("day")["workday_sensor"] == "binary_sensor.workday"


async def test_device_diagnostics_dumps_redacted_store(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    mock_config_entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=mock_config_entry.entry_id,
        identifiers={(DOMAIN, "ambience")},
    )

    result = await async_get_device_diagnostics(hass, mock_config_entry, device)

    assert "living_room" in result["areas"]
    assert result["matchers"]["day"]["workday_sensor"] == REDACTED
