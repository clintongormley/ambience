"""User-owned list of HA services exposed to Ambience's rule editor.

Each entry pins a service ("light.turn_on") plus two orthogonal per-field
settings:

  * `visible_fields`  — fields shown in the rule editor (user-editable per
    rule).
  * `defaults`        — pre-fill values applied at execution time when the
    rule doesn't override them. A field may appear in both buckets (shown
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

from .services_meta import _descriptions_with_status


class _StorageLike(Protocol):
    def get_exposed_actions(self) -> list[dict[str, Any]]: ...
    async def async_save_exposed_actions(self, actions: list[dict[str, Any]]) -> None: ...


class ExposedActionsStore:
    def __init__(self, storage: _StorageLike) -> None:
        self._storage = storage

    @staticmethod
    def _normalise_legacy(entry: dict[str, Any]) -> dict[str, Any]:
        """Lazily rename `locked_values` → `defaults` on read.

        Transient compatibility shim (single release) so on-disk data from
        before the rename keeps working without a one-shot migration. The
        rewrite is in-memory only; `save()` is what persists the new shape.
        """
        if not isinstance(entry, dict):
            return entry
        if "locked_values" in entry and "defaults" not in entry:
            entry = dict(entry)
            entry["defaults"] = entry.pop("locked_values")
        return entry

    def list(self) -> list[dict[str, Any]]:
        return [self._normalise_legacy(e) for e in self._storage.get_exposed_actions()]

    def get(self, service_id: str) -> dict[str, Any] | None:
        for entry in self._storage.get_exposed_actions():
            if entry.get("id") == service_id:
                return self._normalise_legacy(dict(entry))
        return None

    def validate_shape(self, actions: list[dict[str, Any]]) -> None:
        """Self-consistency checks. Does not consult the HA service catalog.

        Note: a field may appear in BOTH `visible_fields` and `defaults`.
        That means "shown in the rule editor pre-filled with this value".
        """
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
            defaults = entry.get("defaults", {})
            if not isinstance(visible, list) or not all(isinstance(f, str) for f in visible):
                raise ValueError(f"{sid}: visible_fields must be a list of strings")
            if not isinstance(defaults, dict) or not all(isinstance(k, str) for k in defaults):
                raise ValueError(f"{sid}: defaults must be an object keyed by string")

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
                raise ValueError(f"unknown service: {sid!r}")
            if degraded:
                # Catalog is degraded — only verify the service exists. Field
                # validation would falsely reject valid entries because the
                # fallback view has empty fields dicts.
                continue
            known_fields = set(spec.get("fields", {}) if isinstance(spec, dict) else {})
            for fname in entry.get("visible_fields", []):
                if fname not in known_fields:
                    raise ValueError(f"{sid}: unknown field {fname!r} in visible_fields")
            for fname in entry.get("defaults", {}):
                if fname not in known_fields:
                    raise ValueError(f"{sid}: unknown field {fname!r} in defaults")

    async def save(self, actions: list[dict[str, Any]]) -> None:
        self.validate_shape(actions)
        await self._storage.async_save_exposed_actions(actions)
