"""Shared base for the "opaque pre-computed" conditions: `script` and `template`.

Both share one shape: walk every scope's `when.<name>` predicates, gather the
distinct work items, pre-compute a per-item boolean in ``snapshot()`` keyed by
``result_key``, then do a pure dict lookup in ``matches()``. They differ only in
*how* an item is computed — `script` calls a HA service (with a TTL cache),
`template` renders Jinja — and in their dedup key. Everything else (the empty
``describe``, the lookup ``matches``, the dedup walk) lives here so the two can't
drift.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import get_store
from ._collect import collect_scope_predicates


class OpaquePrecomputedCondition:
    """Base for `script`/`template`. Subclasses set the protocol attributes
    (``name``/``input``/``priority``/…), implement ``result_key`` and
    ``snapshot``, and call ``_distinct_keys`` to gather their work items."""

    # Set by each subclass; used by `_distinct_keys` to pick the right predicates.
    name: str

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    def describe(self, snapshot: Any, predicate: Any = None) -> str | None:
        # Opaque by nature — nothing readable to render for a trace.
        return None

    def result_key(self, predicate: Any) -> str:
        """The key a predicate's pre-computed result is stored under in the
        snapshot, or "" if malformed. Shared by ``matches`` and the simulator's
        verdict knobs so both agree on identity."""
        raise NotImplementedError  # pragma: no cover

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        if predicate is None:
            return True
        key = self.result_key(predicate)
        return bool(key) and snapshot.results.get(key, False) is True

    def _distinct_keys(self, key_of: Callable[[dict[str, Any]], Any]) -> list[Any]:
        """Distinct, insertion-ordered ``key_of(pred)`` values over every scope's
        ``when.<name>`` predicates. A non-dict predicate, or one whose ``key_of``
        returns ``None`` (malformed), is skipped."""
        if self._hass is None:
            return []
        store = get_store(self._hass)
        if store is None:
            return []
        seen: set[Any] = set()
        out: list[Any] = []
        for pred in collect_scope_predicates(store, self.name):
            if not isinstance(pred, dict):
                continue
            key = key_of(pred)
            if key is None or key in seen:
                continue
            seen.add(key)
            out.append(key)
        return out
