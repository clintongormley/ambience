"""The one table of per-kind facts about Ambience's scopes (house/floor/area).

The three kinds differ in only a handful of ways: which top-level store bucket
holds their config, whether they carry an id, which registry can confirm they
still exist, which store accessor reads/writes them, and which exceptions key
names a missing one. Every caller that would branch on the scope kind reads
those facts from here instead.

Callers keep their own "this scope is missing" semantics — the store hands back
an empty config, the service layer raises a `ServiceValidationError`, the
websocket layer asks the registry — so this module supplies the facts and the
error constructors, not one policy.

Leaf module by construction: it imports the HA registries and `.errors` only. A
`.const` or `.store` import here would close an import cycle (const carries a
TYPE_CHECKING import of store, and store imports this module).
"""

from __future__ import annotations

from collections.abc import Callable, Iterator
from dataclasses import dataclass
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr

from .errors import AmbienceError, service_validation_error


def _area_entry(hass: HomeAssistant, scope_id: str | None) -> Any:
    return ar.async_get(hass).async_get_area(scope_id)


def _floor_entry(hass: HomeAssistant, scope_id: str | None) -> Any:
    return fr.async_get(hass).async_get_floor(scope_id)


@dataclass(frozen=True)
class ScopeKind:
    """Everything that distinguishes one scope kind from the other two.

    The house is the single id-less kind: it has no registry entry (it always
    exists, so `registry_lookup` and `not_found_key` are None) and its whole
    bucket is one scope's config rather than a map keyed by id.
    """

    kind: str
    # Top-level key in the persisted payload holding this kind's config.
    bucket: str
    has_id: bool
    # AmbienceStore accessors for one scope's config, resolved by name so this
    # module stays free of a store import (the test doubles expose them too).
    store_getter: str
    store_saver: str
    # None for the house; otherwise the registry lookup that proves the scope
    # still exists, returning the entry or None.
    registry_lookup: Callable[[HomeAssistant, str | None], Any] | None
    # strings.json `exceptions` key for a scope whose registry entry is gone.
    # Read off this literal by bin/check_exceptions_keys.
    not_found_key: str | None


_SPECS: tuple[ScopeKind, ...] = (
    ScopeKind(
        kind="house",
        bucket="house",
        has_id=False,
        store_getter="get_house",
        store_saver="async_save_house",
        registry_lookup=None,
        not_found_key=None,
    ),
    ScopeKind(
        kind="floor",
        bucket="floors",
        has_id=True,
        store_getter="get_floor",
        store_saver="async_save_floor",
        registry_lookup=_floor_entry,
        not_found_key="unknown_floor",
    ),
    ScopeKind(
        kind="area",
        bucket="areas",
        has_id=True,
        store_getter="get_area",
        store_saver="async_save_area",
        registry_lookup=_area_entry,
        not_found_key="unknown_area",
    ),
)

_BY_KIND: dict[str, ScopeKind] = {spec.kind: spec for spec in _SPECS}

SCOPE_KINDS: tuple[str, ...] = tuple(_BY_KIND)


def iter_scope_kinds() -> Iterator[ScopeKind]:
    """Every scope kind, house first."""
    return iter(_SPECS)


def find_scope_spec(kind: str) -> ScopeKind | None:
    """The spec for `kind`, or None — for callers that own the unknown-kind error."""
    return _BY_KIND.get(kind)


def scope_spec(kind: str) -> ScopeKind:
    """The spec for `kind`, raising the translated unknown-kind error."""
    spec = _BY_KIND.get(kind)
    if spec is None:
        raise AmbienceError("unknown_scope_kind", scope_kind=kind)
    return spec


def scope_bucket(
    store_data: dict[str, Any], kind: str, scope_id: str | None, *, create: bool
) -> dict[str, Any]:
    """One scope's config dict inside the persisted payload.

    `create=True` is the writer path: it inserts (and returns) an empty scope
    config for a scope that has none yet, so callers can mutate the result in
    place. `create=False` never mutates `store_data` and returns a bare `{}` for
    an absent scope.
    """
    spec = scope_spec(kind)
    if not spec.has_id:
        if create:
            return store_data.setdefault(spec.bucket, {"scenes": []})
        return store_data.get(spec.bucket, {})
    if create:
        return store_data[spec.bucket].setdefault(scope_id, {"scenes": []})
    return store_data.get(spec.bucket, {}).get(scope_id, {})


def scope_exists(hass: HomeAssistant, kind: str, scope_id: str | None) -> bool:
    """Whether a scope still exists. The house always does; a kind that isn't one
    of the three never does — callers treat an unrecognised scope as gone rather
    than as an error (the undo/redo stack discards such entries)."""
    spec = _BY_KIND.get(kind)
    if spec is None:
        return False
    if spec.registry_lookup is None:
        return True
    return spec.registry_lookup(hass, scope_id) is not None


def _not_found_key(kind: str, scope_id: str | None) -> str:
    spec = scope_spec(kind)
    if spec.not_found_key is None:
        # The house has no registry entry to lose, so asking for its not-found
        # error is a caller bug, not user input — an internal contract error,
        # not a translatable one.
        raise ValueError(f"{kind} scope always exists (scope_id={scope_id})")
    return spec.not_found_key


def not_found_error(kind: str, scope_id: str | None) -> AmbienceError:
    """The canonical "this area/floor is gone" error, for the websocket layer.

    The key is the caller-independent one from the table above; bin/check_exceptions_keys
    reads it off the `not_found_key=` literal there.
    """
    return AmbienceError(_not_found_key(kind, scope_id), scope_id=scope_id)  # i18n-ignore


def not_found_validation_error(kind: str, scope_id: str | None) -> ServiceValidationError:
    """The same error as a ServiceValidationError, for the service-call path."""
    key = _not_found_key(kind, scope_id)
    return service_validation_error(key, scope_id=scope_id)  # i18n-ignore
