"""Thin wrapper over hass.services.async_services() for Ambience.

Returns a normalised, JSON-serialisable view of HA's service catalog.
Used by exposed-actions validation and the per-service WS commands that
feed the settings UI's <ha-form> rendering.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant


def list_services(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Flat, alpha-sorted list of every HA service.

    Each entry: {id: "domain.service", description, target}. Field schemas
    are omitted to keep the WS payload small — fetch per-service via
    get_service_schema when the user opens that service.
    """
    services = hass.services.async_services()
    items: list[dict[str, Any]] = []
    for domain, names in services.items():
        for name, spec in names.items():
            items.append(
                {
                    "id": f"{domain}.{name}",
                    "description": spec.get("description") or "",
                    "target": spec.get("target"),
                }
            )
    items.sort(key=lambda i: i["id"])
    return items


def get_service_schema(hass: HomeAssistant, service_id: str) -> dict[str, Any] | None:
    """Return {fields, target} for one service, or None if unknown."""
    if "." not in service_id:
        raise ValueError(f"service_id must be domain.service: {service_id!r}")
    domain, name = service_id.split(".", 1)
    spec = hass.services.async_services().get(domain, {}).get(name)
    if spec is None:
        return None
    return {
        "fields": dict(spec.get("fields") or {}),
        "target": spec.get("target"),
    }
