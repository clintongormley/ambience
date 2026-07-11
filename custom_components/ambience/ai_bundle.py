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

import asyncio
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from homeassistant.util import dt as dt_util

from .const import AI_BUNDLE_VERSION, DATA_STORE, DOMAIN
from .entity_catalog import entity_rows
from .lux_ranges import LuxRangeStore
from .periods import PeriodStore
from .redact import redact_exposed_action, redact_store, redacted_traces
from .services_meta import get_service_schema


async def _ambience_version(hass: HomeAssistant) -> str | None:
    """The running integration version, for the skill's freshness check. Best-
    effort — None if the integration can't be resolved (e.g. teardown race)."""
    try:
        from homeassistant.loader import async_get_integration

        integration = await async_get_integration(hass, DOMAIN)
        return str(integration.version) if integration.version is not None else None
    except Exception:  # noqa: BLE001 — version is advisory; never sink the bundle
        return None


def _areas(hass: HomeAssistant) -> list[dict[str, Any]]:
    area_reg = ar.async_get(hass)
    return [
        # floor_id is what lets an AI resolve a floor scope to its areas (and so
        # to their entities); without it a floor-scoped block cannot be authored.
        {"area_id": entry.id, "name": entry.name, "floor_id": entry.floor_id}
        for entry in sorted(area_reg.async_list_areas(), key=lambda a: a.name)
    ]


def _floors(hass: HomeAssistant) -> list[dict[str, Any]]:
    floor_reg = fr.async_get(hass)
    return [
        {"floor_id": entry.floor_id, "name": entry.name}
        for entry in sorted(floor_reg.async_list_floors(), key=lambda f: f.name)
    ]


async def _action_schemas(hass: HomeAssistant, exposed: list[dict[str, Any]]) -> dict[str, Any]:
    """The field schema for each exposed action's service, so the AI knows which
    params are valid. Fetched concurrently; best-effort — a service whose schema
    can't be resolved (not loaded, a bare on/off helper, or an outright error) is
    simply omitted."""
    service_ids = list(
        dict.fromkeys(
            a["id"] for a in exposed if isinstance(a.get("id"), str)
        )  # unique, order-preserving
    )
    results = await asyncio.gather(
        *(get_service_schema(hass, sid) for sid in service_ids),
        return_exceptions=True,  # a single bad service must not sink the bundle
    )
    return {
        sid: schema
        for sid, schema in zip(service_ids, results, strict=True)
        if schema is not None and not isinstance(schema, BaseException)
    }


async def build_ai_bundle(hass: HomeAssistant) -> dict[str, Any]:
    """Assemble the AI bundle from the live install (catalog + exposed actions +
    definitions + redacted config + traces)."""
    store = hass.data[DOMAIN][DATA_STORE]
    exposed = store.get_exposed_actions()
    return {
        # Format version: the skill gates hard-compatibility on this.
        "ambience_ai_bundle": AI_BUNDLE_VERSION,
        # Freshness signals the skill surfaces (is this bundle current?).
        "ambience_version": await _ambience_version(hass),
        "generated_at": dt_util.utcnow().isoformat(),
        "catalog": {
            "areas": _areas(hass),
            "floors": _floors(hass),
            "entities": entity_rows(hass),
        },
        "actions": {
            # Sensitive default values (tokens, message bodies, recipients) are
            # scrubbed; the schema ids fetched below use the unredacted list.
            "exposed": [redact_exposed_action(a) for a in exposed],
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
        "config": redact_store(store.as_dict()),
        "traces": redacted_traces(hass),
    }
