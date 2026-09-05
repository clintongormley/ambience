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

from collections.abc import Callable, Mapping
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import get_store
from ._collect import collect_scope_predicates


class OpaquePrecomputedCondition[SnapshotT]:
    """Base for `script`/`template`. ``SnapshotT`` is the frozen snapshot the
    subclass produces (``TemplateSnapshot`` / ``ScriptSnapshot``), carried
    through ``snapshot`` / ``_compute`` / ``_previous``.

    Subclasses set the protocol attributes
    (``name``/``input``/``priority``/…), implement ``result_key``, ``_compute``,
    ``snapshot_from_results`` and ``verdict_label``, and call ``_distinct_keys``
    to gather their work items. Subclassing this base is what marks a condition
    opaque: the simulator detects it by type and drives it with user verdicts
    instead of snapshotting it against the hypothetical world."""

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
        self._previous: SnapshotT | None = None

    def describe(self, snapshot: Any, predicate: Any = None) -> str | None:
        # Opaque by nature — nothing readable to render for a trace.
        return None

    def result_key(self, predicate: Any) -> str:
        """The key a predicate's pre-computed result is stored under in the
        snapshot, or "" if malformed. Shared by ``matches`` and the simulator's
        verdict knobs so both agree on identity."""
        raise NotImplementedError  # pragma: no cover

    def snapshot_from_results(self, results: dict[str, bool]) -> SnapshotT:
        """A complete snapshot built from forced per-key verdicts, for the
        what-if simulator: an opaque predicate can't be re-run against a
        hypothetical world, so the user supplies its result directly. Every
        opaque snapshot is a ``results`` map ``matches()`` looks up, so a verdict
        map is the whole snapshot."""
        raise NotImplementedError  # pragma: no cover

    def verdict_label(self, predicate: Any, scene: Mapping[str, Any]) -> tuple[str | None, str]:
        """``(entity_id | None, label)`` for one predicate's simulator verdict
        knob: the entity the knob should link to, if the predicate names one,
        and the text identifying it to the user."""
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
    ) -> SnapshotT:
        """Pre-compute every referenced work item, or — when ``keys`` names the
        result keys of the predicates that just fired — only those, merged over
        the previous snapshot's results.

        The merge makes this condition stateful: keys nobody recomputed keep the
        value they last had, so a key no scene references any more survives
        until the next full refresh (``keys=None``), which rebuilds the result
        set from the live config and drops it. The hint is also ignored until a
        previous snapshot exists to merge over — a partial result set with no
        baseline would read as "no match" for every scene that didn't fire.
        Concurrent snapshots resolve last-writer-wins on the baseline, so a
        hinted pass finishing after a full refresh can re-merge a key that
        refresh dropped; harmless (no predicate references it) and the next full
        refresh drops it again.
        """
        previous = self._previous
        snap = await self._compute(hass, keys if previous is not None else None, previous)
        self._previous = snap
        return snap

    async def _compute(
        self, hass: HomeAssistant, keys: frozenset[str] | None, previous: SnapshotT | None
    ) -> SnapshotT:
        """Build one snapshot over the whole work list (``keys is None``) or over
        just the named result keys, merging the rest of ``previous`` back in via
        ``_merge_over_previous``. ``previous`` is None only on a full refresh."""
        raise NotImplementedError  # pragma: no cover

    @staticmethod
    def _merge_over_previous(
        keys: frozenset[str] | None,
        previous: Mapping[str, Any],
        fresh: dict[str, Any],
    ) -> dict[str, Any]:
        """``fresh`` laid over the ``previous`` snapshot's matching map when the
        work was narrowed by a hint; ``fresh`` alone — the whole truth —
        otherwise."""
        return fresh if keys is None else {**previous, **fresh}

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
