"""User-owned list of HA services exposed to Ambience's rule editor.

Each entry pins a service ("light.turn_on") plus which of its fields are
visible (user-editable per rule) or locked (always sent on every call).
Fields not listed in either bucket are hidden.

Service-catalog validation (does this service exist? do its fields match?)
is layered on in validate_against_catalog. The basic save here only enforces
self-consistency: well-formed shapes, no duplicates, mutually-exclusive
visible/locked buckets.
"""

from __future__ import annotations

from typing import Any, Protocol

from homeassistant.core import HomeAssistant

from .services_meta import get_service_schema


class _StorageLike(Protocol):
    def get_exposed_actions(self) -> list[dict[str, Any]]: ...
    async def async_save_exposed_actions(self, actions: list[dict[str, Any]]) -> None: ...


class ExposedActionsStore:
    def __init__(self, storage: _StorageLike) -> None:
        self._storage = storage

    def list(self) -> list[dict[str, Any]]:
        return self._storage.get_exposed_actions()

    def get(self, service_id: str) -> dict[str, Any] | None:
        for entry in self._storage.get_exposed_actions():
            if entry.get("id") == service_id:
                return dict(entry)
        return None

    def validate_shape(self, actions: list[dict[str, Any]]) -> None:
        """Self-consistency checks. Does not consult the HA service catalog."""
        if not isinstance(actions, list):
            raise ValueError("exposed actions must be a list")
        seen: set[str] = set()
        for entry in actions:
            if not isinstance(entry, dict):
                raise ValueError(f"entry must be an object: {entry!r}")
            sid = entry.get("id")
            if not isinstance(sid, str) or "." not in sid:
                raise ValueError(f"invalid service id: {sid!r}")
            domain, _, name = sid.partition(".")
            if not domain or not name:
                raise ValueError(f"invalid service id: {sid!r}")
            if sid in seen:
                raise ValueError(f"duplicate service id: {sid!r}")
            seen.add(sid)
            label = entry.get("label", "")
            if not isinstance(label, str):
                raise ValueError(f"{sid}: label must be a string")
            visible = entry.get("visible_fields", [])
            locked = entry.get("locked_values", {})
            if not isinstance(visible, list) or not all(isinstance(f, str) for f in visible):
                raise ValueError(f"{sid}: visible_fields must be a list of strings")
            if not isinstance(locked, dict) or not all(isinstance(k, str) for k in locked):
                raise ValueError(f"{sid}: locked_values must be an object keyed by string")
            overlap = set(visible) & set(locked)
            if overlap:
                raise ValueError(
                    f"{sid}: field(s) cannot be both visible and locked: {sorted(overlap)!r}"
                )

    async def validate_against_catalog(
        self,
        hass: HomeAssistant,
        actions: list[dict[str, Any]],
    ) -> None:
        """Check each entry's service exists and every named field exists.

        This is async because it consults `services_meta.get_service_schema`,
        which in real HA goes through `async_get_all_descriptions` to fetch
        field metadata (the on-disk services.yaml descriptions don't live in
        the runtime service registry).

        Precondition: validate_shape() must have passed for `actions`. This
        method reads `entry["id"]` directly and will KeyError on a malformed
        entry — never call standalone on untrusted input.

        Call after validate_shape (or via save) when the HA service catalog
        is available. Locked-value type checking is intentionally not done
        here; HA's own service call rejects mismatched types at call time.
        """
        for entry in actions:
            sid = entry["id"]
            schema = await get_service_schema(hass, sid)
            if schema is None:
                raise ValueError(f"unknown service: {sid!r}")
            known_fields = set(schema["fields"])
            for fname in entry.get("visible_fields", []):
                if fname not in known_fields:
                    raise ValueError(f"{sid}: unknown field {fname!r} in visible_fields")
            for fname in entry.get("locked_values", {}):
                if fname not in known_fields:
                    raise ValueError(f"{sid}: unknown field {fname!r} in locked_values")

    async def save(self, actions: list[dict[str, Any]]) -> None:
        self.validate_shape(actions)
        await self._storage.async_save_exposed_actions(actions)
