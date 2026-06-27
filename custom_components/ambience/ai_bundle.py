"""The AI bundle: a single export an external AI consults to author and
diagnose Ambience config.

Unlike the static knowledge pack (schema + cookbook, shipped with the
integration), the bundle is assembled live from the running install, so it
always reflects the user's actual entities, areas, exposed actions and current
config. It carries everything an AI needs to write *real* config — references to
entities that exist, in areas that exist, calling actions that are exposed — and
the recent traces needed to answer "why didn't my scene fire?".

Location/presence PII is scrubbed via :mod:`.redact`, the same rules the
diagnostics dump uses.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr

from .const import DATA_STORE, DOMAIN
from .lux_ranges import LuxRangeStore
from .periods import PeriodStore
from .redact import redact, redacted_traces
from .services_meta import get_service_schema

BUNDLE_VERSION = 1


def _areas(hass: HomeAssistant) -> list[dict[str, Any]]:
    area_reg = ar.async_get(hass)
    return [
        {"area_id": entry.id, "name": entry.name}
        for entry in sorted(area_reg.async_list_areas(), key=lambda a: a.name)
    ]


def _floors(hass: HomeAssistant) -> list[dict[str, Any]]:
    floor_reg = fr.async_get(hass)
    return [
        {"floor_id": entry.floor_id, "name": entry.name}
        for entry in sorted(floor_reg.async_list_floors(), key=lambda f: f.name)
    ]


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


def _entities(hass: HomeAssistant) -> list[dict[str, Any]]:
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
        out.append(
            {
                "entity_id": entry.entity_id,
                "name": entry.name or entry.original_name,
                "domain": entry.domain,
                "device_class": entry.device_class or entry.original_device_class,
                "area_id": _entity_area_id(entry, dev_reg),
                "state": state.state if state is not None else None,
            }
        )
    return sorted(out, key=lambda e: e["entity_id"])


async def _action_schemas(hass: HomeAssistant, exposed: list[dict[str, Any]]) -> dict[str, Any]:
    """The field schema for each exposed action's service, so the AI knows which
    params are valid. Best-effort: a service whose schema can't be resolved (not
    loaded, or a bare on/off helper) is simply omitted."""
    schemas: dict[str, Any] = {}
    for action in exposed:
        service_id = action.get("id")
        if not isinstance(service_id, str) or service_id in schemas:
            continue
        try:
            schema = await get_service_schema(hass, service_id)
        except Exception:  # noqa: BLE001 — a single bad service must not sink the bundle
            schema = None
        if schema is not None:
            schemas[service_id] = schema
    return schemas


async def build_ai_bundle(hass: HomeAssistant) -> dict[str, Any]:
    """Assemble the AI bundle from the live install (catalog + exposed actions +
    definitions + redacted config + traces)."""
    store = hass.data[DOMAIN][DATA_STORE]
    exposed = store.get_exposed_actions()
    return {
        "ambience_ai_bundle": BUNDLE_VERSION,
        "catalog": {
            "areas": _areas(hass),
            "floors": _floors(hass),
            "entities": _entities(hass),
        },
        "actions": {
            "exposed": exposed,
            "schemas": await _action_schemas(hass, exposed),
        },
        "definitions": {
            "categories": store.categories(),
            # The full named-definition vocabulary (builtins + custom + hidden),
            # not just the user's custom overrides, so the AI can reference a
            # period like "evening" or a lux band like "dark" by name.
            "periods": PeriodStore(store).view_for_ui(),
            "lux_ranges": LuxRangeStore(store).view_for_ui(),
        },
        "config": redact(store.as_dict()),
        "traces": redacted_traces(hass),
    }
