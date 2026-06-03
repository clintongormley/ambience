"""Diagnostics support for Ambience.

Implementing both handlers makes Home Assistant render a "Download diagnostics"
link on the integration page (config entry) and on the Ambience device page
(device). All of Ambience's configuration lives in :class:`AmbienceStore`, so
both dumps return the full persisted store with location-revealing fields
redacted.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntry

from .const import DATA_STORE, DOMAIN

# Keys whose values can reveal where people live or go: the workday/calendar
# sensors a household keys off, the configured weather entity, and the
# person/zone references and free-form templates carried by `people`/`template`
# scene predicates. Redacting by key keeps the scene structure intact.
TO_REDACT = {
    "workday_sensor",
    "workday_calendar",
    "entity",
    "who",
    "where",
    "template",
}


def _store_dump(hass: HomeAssistant) -> dict[str, Any]:
    store = hass.data[DOMAIN][DATA_STORE]
    return async_redact_data(store.as_dict(), TO_REDACT)


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for the config entry."""
    return _store_dump(hass)


async def async_get_device_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry, device: DeviceEntry
) -> dict[str, Any]:
    """Return diagnostics for the Ambience device.

    Ambience exposes a single service device, so the device dump is the same
    redacted store as the config-entry dump.
    """
    return _store_dump(hass)
