"""Assembly helpers shared by the two AI exports.

`ai_bundle` (download-and-paste) and `ai_context` (MCP) differ in what they carry
about ENTITIES — rows versus counts — but agree on everything else: the same
areas, the same floors, the same exposed-action schemas, the same version stamp.
Those live here so the two exports cannot drift apart on the parts that are meant
to be identical.
"""

from __future__ import annotations

import asyncio
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr

from .const import DOMAIN
from .services_meta import get_service_schema


async def ambience_version(hass: HomeAssistant) -> str | None:
    """The running integration version, for the skill's freshness check. Best-
    effort — None if the integration can't be resolved (e.g. teardown race)."""
    try:
        from homeassistant.loader import async_get_integration

        integration = await async_get_integration(hass, DOMAIN)
        return str(integration.version) if integration.version is not None else None
    except Exception:  # noqa: BLE001 — version is advisory; never sink the export
        return None


def areas(hass: HomeAssistant) -> list[dict[str, Any]]:
    area_reg = ar.async_get(hass)
    return [
        # floor_id is what lets an AI resolve a floor scope to its areas (and so
        # to their entities); without it a floor-scoped block cannot be authored.
        {"area_id": entry.id, "name": entry.name, "floor_id": entry.floor_id}
        for entry in sorted(area_reg.async_list_areas(), key=lambda a: a.name)
    ]


def floors(hass: HomeAssistant) -> list[dict[str, Any]]:
    floor_reg = fr.async_get(hass)
    return [
        {"floor_id": entry.floor_id, "name": entry.name}
        for entry in sorted(floor_reg.async_list_floors(), key=lambda f: f.name)
    ]


async def action_schemas(hass: HomeAssistant, exposed: list[dict[str, Any]]) -> dict[str, Any]:
    """The field schema for each exposed action's service, so the AI knows which
    params are valid. Fetched concurrently; best-effort — a service whose schema
    can't be resolved (not loaded, a bare on/off helper, or an outright error) is
    simply omitted.
    """
    service_ids = list(
        dict.fromkeys(
            a["id"] for a in exposed if isinstance(a.get("id"), str)
        )  # unique, order-preserving
    )
    results = await asyncio.gather(
        *(get_service_schema(hass, sid) for sid in service_ids),
        return_exceptions=True,  # a single bad service must not sink the export
    )
    return {
        sid: schema
        for sid, schema in zip(service_ids, results, strict=True)
        if schema is not None and not isinstance(schema, BaseException)
    }
