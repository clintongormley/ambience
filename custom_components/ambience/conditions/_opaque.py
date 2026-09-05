"""Shared base for the "opaque pre-computed" conditions: `script` and `template`.

Both share one shape: walk every scope's `when.<name>` predicates, gather the
distinct work items, pre-compute a per-item boolean in ``snapshot()`` keyed by
``result_key``, then do a pure dict lookup in ``matches()``. They differ only in
*how* an item is computed — `script` calls a HA service (with a TTL cache),
`template` renders Jinja — and in their dedup key. Everything else (the empty
``describe``, the lookup ``matches``, the dedup walk, the ``keys`` hint and its
merge) lives here so the two can't drift.
"""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import get_store
from ._collect import collect_scope_predicates


class OpaquePrecomputedCondition:
    """Base for `script`/`template`. Subclasses set the protocol attributes
    (``name``/``input``/``priority``/…), implement ``result_key`` and
    ``_compute``, and call ``_distinct_keys`` to gather their work items."""

    # Set by each subclass; used by `_distinct_keys` to pick the right predicates.
    name: str

    # Declares the `keys` snapshot hint below: `snapshot_conditions` narrows the
    # work only for conditions carrying this flag, so every other condition's
    # snapshot signature stays untouched.
    supports_result_keys = True

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass
        # The last snapshot produced, so a hinted (partial) pass can merge its
        # recomputed keys over it.
        self._previous: Any = None

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

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: datetime | None = None,
        entities: frozenset[str] | None = None,  # part of the shared contract; not used here
        keys: frozenset[str] | None = None,
    ) -> Any:
        """Pre-compute every referenced work item, or — when ``keys`` names the
        result keys of the predicates that just fired — only those, merged over
        the previous snapshot's results.

        The merge makes this condition stateful: keys nobody recomputed keep the
        value they last had, so a key no scene references any more survives
        until the next full refresh (``keys=None``), which rebuilds the result
        set from the live config and drops it. The hint is also ignored until a
        previous snapshot exists to merge over — a partial result set with no
        baseline would read as "no match" for every scene that didn't fire.
        """
        effective = keys if self._previous is not None else None
        snap = await self._compute(hass, effective)
        self._previous = snap
        return snap

    async def _compute(self, hass: HomeAssistant, keys: frozenset[str] | None) -> Any:
        """Build one snapshot over the whole work list (``keys is None``) or over
        just the named result keys, merging the rest via ``_merge_over_previous``."""
        raise NotImplementedError  # pragma: no cover

    def _merge_over_previous(
        self, keys: frozenset[str] | None, attr: str, fresh: dict[str, Any]
    ) -> dict[str, Any]:
        """``fresh`` laid over the previous snapshot's ``attr`` map when the work
        was narrowed by a hint; ``fresh`` alone — the whole truth — otherwise."""
        if keys is None:
            return fresh
        merged = dict(getattr(self._previous, attr))
        merged.update(fresh)
        return merged

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
