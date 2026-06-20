"""Built-in services are registered on setup, removed on unload, and pass
exposed-action catalog validation."""

from __future__ import annotations

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
