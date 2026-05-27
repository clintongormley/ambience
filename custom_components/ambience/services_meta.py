"""Thin wrapper over HA's service catalog for Ambience.

Returns a normalised, JSON-serialisable view of HA's service catalog.
Used by exposed-actions validation and the per-service WS commands that
feed the settings UI's <ha-form> rendering.

`hass.services.async_services()` returns `Service` objects without field
metadata; we use `async_get_all_descriptions` (which merges the runtime
registry with `services.yaml` descriptions) when available. If the
description loader fails (e.g. a stripped test environment with no
integrations on disk), we fall back to a minimal view derived purely
from the runtime registry — ids/empty-fields/no-target.

Test fixtures that stub `hass.services.async_services()` with plain
dicts containing "fields"/"description"/"target" keys are also
supported: we read the dict directly without going through the
description loader.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)


def _registry_is_dict_stubbed(registry: dict) -> bool:
    """True iff every non-empty domain map's first entry is a plain dict.

    Test fixtures stub `hass.services.async_services()` to return plain
    dicts of dicts; real HA returns dicts of `Service` objects.
    """
    for domain_map in registry.values():
        if not domain_map:
            continue
        sample = next(iter(domain_map.values()))
        if not isinstance(sample, dict):
            return False
    return True


async def _descriptions(hass: HomeAssistant) -> dict[str, dict[str, dict[str, Any]]]:
    """Best-effort {domain: {name: {description?, fields?, target?}}} view."""
    registry = hass.services.async_services()
    if _registry_is_dict_stubbed(registry):
        return registry
    try:
        from homeassistant.helpers.service import async_get_all_descriptions

        return await async_get_all_descriptions(hass)
    except Exception as exc:
        # Stripped test envs (no integrations on disk) can break the loader;
        # fall back to a runtime-registry view (no fields/target/description).
        _LOGGER.debug(
            "ambience: async_get_all_descriptions unavailable (%s); "
            "falling back to runtime-registry view",
            exc,
        )
        return {domain: {name: {} for name in names} for domain, names in registry.items()}


async def list_services(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Flat, alpha-sorted list of every HA service.

    Each entry: {id: "domain.service", description, target}. Field schemas
    are omitted to keep the WS payload small — fetch per-service via
    get_service_schema when the user opens that service.
    """
    descriptions = await _descriptions(hass)
    items: list[dict[str, Any]] = []
    for domain, names in descriptions.items():
        for name, spec in names.items():
            description = spec.get("description") if isinstance(spec, dict) else None
            target = spec.get("target") if isinstance(spec, dict) else None
            items.append(
                {
                    "id": f"{domain}.{name}",
                    "description": description or "",
                    "target": target,
                }
            )
    items.sort(key=lambda i: i["id"])
    return items


async def get_service_schema(hass: HomeAssistant, service_id: str) -> dict[str, Any] | None:
    """Return {fields, target} for one service, or None if unknown.

    Raises ValueError if `service_id` is not "domain.service".
    """
    if "." not in service_id:
        raise ValueError(f"service_id must be domain.service: {service_id!r}")
    domain, name = service_id.split(".", 1)
    descriptions = await _descriptions(hass)
    spec = descriptions.get(domain, {}).get(name)
    if spec is None:
        return None
    return {
        "fields": dict(spec.get("fields") or {}) if isinstance(spec, dict) else {},
        "target": spec.get("target") if isinstance(spec, dict) else None,
    }
