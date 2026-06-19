"""User-owned list of HA services exposed to Ambience's scene editor.

Each entry pins a service ("light.turn_on") plus two orthogonal per-field
settings:

  * `visible_fields`  — fields shown in the scene editor (user-editable per
    scene).
  * `defaults`        — pre-fill values applied at execution time when the
    scene doesn't override them. A field may appear in both buckets (shown
    AND pre-filled), only in defaults (hidden but always sent — the old
    "locked" mode), only in visible_fields (shown empty), or in neither
    (unused).

Service-catalog validation (does this service exist? do its fields match?)
is layered on in validate_against_catalog. The basic save here only enforces
self-consistency: well-formed shapes and no duplicates.
"""

from __future__ import annotations

from typing import Any, Protocol

from homeassistant.core import HomeAssistant

from .errors import AmbienceError
from .services_meta import _descriptions_with_status, _flatten_field_groups


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

    def annotate_unexposed(self, actions: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Return a shallow copy of `actions`, tagging each one `unexposed=True`
        when its (well-formed) service id is not currently exposed — so a trace can
        render a now-deleted action as skipped instead of applied (the engine
        log-and-skips it at dispatch). The caller's list/dicts are not mutated."""
        out: list[dict[str, Any]] = []
        for action in actions:
            service_id = action.get("service")
            if isinstance(service_id, str) and "." in service_id and self.get(service_id) is None:
                out.append({**action, "unexposed": True})
            else:
                out.append(action)
        return out

    def validate_shape(self, actions: list[dict[str, Any]]) -> None:
        """Self-consistency checks. Does not consult the HA service catalog.

        Note: a field may appear in BOTH `visible_fields` and `defaults`.
        That means "shown in the scene editor pre-filled with this value".
        """
        if not isinstance(actions, list):
            raise AmbienceError("exposed_actions_not_list")
        seen: set[str] = set()
        for entry in actions:
            if not isinstance(entry, dict):
                raise AmbienceError("exposed_entry_not_object", entry=entry)
            sid = entry.get("id")
            if not isinstance(sid, str) or "." not in sid:
                raise AmbienceError("exposed_invalid_service_id", sid=sid)
            domain, _, name = sid.partition(".")
            if not domain or not name:
                raise AmbienceError("exposed_invalid_service_id", sid=sid)
            if sid in seen:
                raise AmbienceError("exposed_duplicate_service_id", sid=sid)
            seen.add(sid)
            label = entry.get("label", "")
            if not isinstance(label, str):
                raise AmbienceError("exposed_label_not_string", sid=sid)
            visible = entry.get("visible_fields", [])
            defaults = entry.get("defaults", {})
            if not isinstance(visible, list) or not all(isinstance(f, str) for f in visible):
                raise AmbienceError("exposed_visible_fields_not_list", sid=sid)
            if not isinstance(defaults, dict) or not all(isinstance(k, str) for k in defaults):
                raise AmbienceError("exposed_defaults_not_object", sid=sid)

    async def validate_against_catalog(
        self,
        hass: HomeAssistant,
        actions: list[dict[str, Any]],
    ) -> None:
        """Check each entry's service exists and every named field exists.

        This is async because it consults the HA service catalog, which goes
        through `async_get_all_descriptions` to fetch field metadata (the
        on-disk services.yaml descriptions don't live in the runtime registry).

        When the catalog is degraded (async_get_all_descriptions unavailable),
        only service-existence is verified — field-level checks are skipped to
        avoid false "unknown field" errors caused by the empty fallback view.

        Precondition: validate_shape() must have passed for `actions`. This
        method reads `entry["id"]` directly and will KeyError on a malformed
        entry — never call standalone on untrusted input.

        Call after validate_shape (or via save) when the HA service catalog
        is available. Default-value type checking is intentionally not done
        here; HA's own service call rejects mismatched types at call time.
        """
        descriptions, degraded = await _descriptions_with_status(hass)
        for entry in actions:
            sid = entry["id"]
            domain, name = sid.split(".", 1) if "." in sid else (sid, "")
            spec = descriptions.get(domain, {}).get(name)
            if spec is None:
                raise AmbienceError("exposed_unknown_service", sid=sid)
            if degraded:
                # Catalog is degraded — only verify the service exists. Field
                # validation would falsely reject valid entries because the
                # fallback view has empty fields dicts.
                continue
            known_fields = set(
                _flatten_field_groups(spec.get("fields")) if isinstance(spec, dict) else {}
            )
            for fname in entry.get("visible_fields", []):
                if fname not in known_fields:
                    raise AmbienceError("exposed_unknown_visible_field", sid=sid, field=fname)
            for fname in entry.get("defaults", {}):
                if fname not in known_fields:
                    raise AmbienceError("exposed_unknown_default_field", sid=sid, field=fname)

    async def save(self, actions: list[dict[str, Any]]) -> None:
        self.validate_shape(actions)
        await self._storage.async_save_exposed_actions(actions)
