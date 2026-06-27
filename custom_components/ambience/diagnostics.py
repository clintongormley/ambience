"""Diagnostics support for Ambience.

Implementing both handlers makes Home Assistant render a "Download diagnostics"
link on the integration page (config entry) and on the Ambience device page
(device). All of Ambience's configuration lives in :class:`AmbienceStore`, so
both dumps return the full persisted store with location-revealing fields
redacted.

The redaction rules live in :mod:`.redact`, shared with the AI bundle so the two
exports can never drift apart on what gets scrubbed.
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntry

from .const import DATA_STORE, DOMAIN
from .redact import buffer_records, redact, redact_trace, redacted_traces
from .trace import buffered_unit_to_dict


def _store_dump(hass: HomeAssistant) -> dict[str, Any]:
    store = hass.data[DOMAIN][DATA_STORE]
    dump = redact(store.as_dict())
    dump["traces"] = redacted_traces(hass)
    return dump


def scope_diagnostics(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category: str
) -> dict[str, Any]:
    """A focused diagnostic bundle for one (scope, category): that scope's config,
    the global context needed to read it, and that unit's buffered traces — all
    redacted."""
    store = hass.data[DOMAIN][DATA_STORE]
    mine = [
        r
        for r in buffer_records(hass)
        if r.unit.scope_kind == scope_kind
        and r.unit.scope_id == scope_id
        and r.unit.category == category
    ]
    payload = {
        "scope": {
            "scope_kind": scope_kind,
            "scope_id": scope_id,
            "category": category,
            "config": store.scope_config(scope_kind, scope_id),
        },
        "context": {
            "categories": store.categories(),
            "conditions": store.get_conditions(),
        },
        "traces": [redact_trace(buffered_unit_to_dict(r)) for r in mine],
    }
    return redact(payload)


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for the config entry."""
    return _store_dump(hass)


async def async_get_device_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry, device: DeviceEntry
) -> dict[str, Any]:
    """Return diagnostics for an Ambience device.

    Ambience has one device per scope (the main service device plus per-floor and
    per-area sub-devices), but they all share the one store, so every device dump
    is the same redacted store as the config-entry dump.
    """
    return _store_dump(hass)
