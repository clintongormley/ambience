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

from .errors import AmbienceError

_LOGGER = logging.getLogger(__name__)


def _flatten_field_groups(fields: Any) -> dict[str, Any]:
    """Flatten HA-style nested field groups into a single dict.

    HA's services.yaml allows grouping fields under a parent entry that has
    its own `fields` key (e.g. `advanced_fields` on `light.turn_on`). Those
    parent entries aren't real fields — they're collapsible UI sections.
    For Ambience's purposes we want a flat list of actual fields, so any
    entry that has a nested `fields` dict is replaced by its nested fields.
    Recursive in case groups are nested further.
    """
    if not isinstance(fields, dict):
        return {}
    out: dict[str, Any] = {}
    for key, value in fields.items():
        if isinstance(value, dict) and isinstance(value.get("fields"), dict):
            out.update(_flatten_field_groups(value["fields"]))
        else:
            out[key] = value
    return out


def _registry_is_dict_stubbed(registry: dict) -> bool:
    """True iff every non-empty domain map's first entry is a plain dict.

    Test fixtures stub `hass.services.async_services()` to return plain
    dicts of dicts; real HA returns dicts of `Service` objects. An empty
    registry is treated as real HA (no stubs to detect).
    """
    found_any = False
    for domain_map in registry.values():
        if not domain_map:
            continue
        found_any = True
        sample = next(iter(domain_map.values()))
        if not isinstance(sample, dict):
            return False
    return found_any


async def _descriptions_with_status(
    hass: HomeAssistant,
) -> tuple[dict[str, dict[str, dict[str, Any]]], bool]:
    """Return (descriptions, degraded_flag).

    degraded=True means async_get_all_descriptions was unavailable; the
    returned dict has the correct set of domain/service keys but every
    spec is an empty dict (no fields, no target). Field-level validation
    must be skipped when degraded is True.
    """
    registry = hass.services.async_services()
    if _registry_is_dict_stubbed(registry):
        # Test fixtures provide their own field/target data — not degraded.
        return registry, False
    try:
        from homeassistant.helpers.service import async_get_all_descriptions

        return await async_get_all_descriptions(hass), False
    except Exception as exc:
        # Stripped test envs (no integrations on disk) can break the loader;
        # fall back to a runtime-registry view (no fields/target/description).
        _LOGGER.debug(
            "ambience: async_get_all_descriptions unavailable (%s); "
            "falling back to runtime-registry view",
            exc,
        )
        return (
            {domain: {name: {} for name in names} for domain, names in registry.items()},
            True,
        )


async def _descriptions(hass: HomeAssistant) -> dict[str, dict[str, dict[str, Any]]]:
    """Best-effort {domain: {name: {description?, fields?, target?}}} view."""
    data, _degraded = await _descriptions_with_status(hass)
    return data


async def list_services(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Flat, alpha-sorted list of every HA service.

    Each entry: {id: "domain.service", name, description, target}. `name` is
    HA's predefined human label (from services.yaml/translations). Field schemas
    are omitted to keep the WS payload small — fetch per-service via
    get_service_schema when the user opens that service.
    """
    descriptions = await _descriptions(hass)
    items: list[dict[str, Any]] = []
    for domain, names in descriptions.items():
        for name, spec in names.items():
            friendly = spec.get("name") if isinstance(spec, dict) else None
            description = spec.get("description") if isinstance(spec, dict) else None
            target = spec.get("target") if isinstance(spec, dict) else None
            items.append(
                {
                    "id": f"{domain}.{name}",
                    "name": friendly or "",
                    "description": description or "",
                    "target": target,
                }
            )
    items.sort(key=lambda i: i["id"])
    return items


async def get_service_schema(hass: HomeAssistant, service_id: str) -> dict[str, Any] | None:
    """Return {fields, target} for one service, or None if unknown.

    Raises AmbienceError if `service_id` is not "domain.service".
    """
    if "." not in service_id:
        raise AmbienceError("invalid_service_id_format", service_id=service_id)
    domain, name = service_id.split(".", 1)
    descriptions = await _descriptions(hass)
    spec = descriptions.get(domain, {}).get(name)
    if spec is None:
        return None
    return {
        "name": spec.get("name") if isinstance(spec, dict) else None,
        "fields": _flatten_field_groups(spec.get("fields")) if isinstance(spec, dict) else {},
        "target": spec.get("target") if isinstance(spec, dict) else None,
    }
