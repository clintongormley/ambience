"""Built-in services are registered on setup, removed on unload, and pass
exposed-action catalog validation."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_EXPOSED_ACTIONS, DOMAIN

_SERVICES = (
    "turn_on",
    "turn_off",
    "cover_safe_open",
    "cover_safe_close",
    "cover_safe_set_position",
    "cover_safe_set_tilt_position",
)


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def test_services_registered_then_removed(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    for name in _SERVICES:
        assert hass.services.has_service(DOMAIN, name), name

    assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    for name in _SERVICES:
        assert not hass.services.has_service(DOMAIN, name), name


async def test_builtin_ids_pass_catalog_validation(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    exposed = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    # Must not raise: ambience.* services exist in the catalog and the named
    # field is real.
    await exposed.validate_against_catalog(
        hass,
        [
            {"id": "ambience.turn_on", "label": "", "visible_fields": [], "defaults": {}},
            {
                "id": "ambience.cover_safe_set_position",
                "label": "",
                "visible_fields": ["position"],
                "defaults": {},
            },
        ],
    )


async def test_ambience_registers_only_pass_through_services(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """`apply_lock` is not reentrant. That is safe only while no Ambience
    service can reach the apply path from inside a scene action; every name
    below is a pass-through to another domain's service.

    The set is spelled out rather than read from `_SERVICES` on purpose: adding
    a service must break this test, so whoever adds one reads `apply_lock`'s
    docstring and confirms the new service cannot re-enter the lock.
    """
    assert set(hass.services.async_services_for_domain(DOMAIN)) == {
        "turn_on",
        "turn_off",
        "cover_safe_open",
        "cover_safe_close",
        "cover_safe_set_position",
        "cover_safe_set_tilt_position",
    }
