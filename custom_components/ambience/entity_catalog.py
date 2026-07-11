"""The entity catalog: the registry walk both AI exports share, plus the summary
and search that keep the MCP context bounded.

`ai_bundle` (the download-and-paste export) needs the full rows, because the AI
on the other end has no tools. `ai_context` (the MCP export) needs only the
counts, and serves rows a page at a time through `find_entities`. Both read the
same rows from here, so there is one registry walk and one redaction rule in the
codebase, not two.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import REDACTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from .redact import PRESENCE_PREFIXES


def _entity_area_id(entry: er.RegistryEntry, dev_reg: dr.DeviceRegistry) -> str | None:
    """An entity's area is its own override if set, else its device's area —
    the same precedence HA uses, so an AI placing a scene action against the
    entity targets the room the user sees it in."""
    if entry.area_id is not None:
        return entry.area_id
    if entry.device_id is not None:
        device = dev_reg.async_get(entry.device_id)
        if device is not None:
            return device.area_id
    return None


def entity_rows(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Every registered entity with the facts an AI needs to author actions and
    state/occupancy/lux conditions: its area, domain, device_class and current
    state. Disabled/hidden entities are skipped — a scene cannot act on them."""
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    out: list[dict[str, Any]] = []
    for entry in ent_reg.entities.values():
        if entry.disabled or entry.hidden:
            continue
        state = hass.states.get(entry.entity_id)
        # A person/device_tracker entity's STATE is its current location — redact
        # it, mirroring how diagnostics scrubs presence PII. Its id and friendly
        # name are kept on purpose (the AI needs the id to author people
        # conditions), so a household member's name/slug (e.g. `person.alice`) IS
        # present in the export. This is also prefix-based, not capability-based:
        # an exotic state-as-PII sensor (e.g. a geocoded-location sensor) isn't
        # caught. These exports are deliberate, user-initiated local exports, so
        # these residual person-identifier surfaces are an accepted trade-off,
        # documented in the AI-authoring docs, not an unflagged leak.
        if entry.entity_id.startswith(PRESENCE_PREFIXES):
            state_value: str | None = REDACTED
        else:
            state_value = state.state if state is not None else None
        out.append(
            {
                "entity_id": entry.entity_id,
                "name": entry.name or entry.original_name,
                "domain": entry.domain,
                "device_class": entry.device_class or entry.original_device_class,
                "area_id": _entity_area_id(entry, dev_reg),
                "state": state_value,
            }
        )
    return sorted(out, key=lambda e: e["entity_id"])
