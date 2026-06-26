"""UnavailableCondition — match when any listed entity is unavailable.

Predicate:
  {entities: [entity_id, ...]}   (at least one; any domain)
None = vacuous true (no constraint).

Unlike state/occupancy, this condition treats `unavailable`/`unknown` (and an
absent entity) as the OBSERVABLE fact it reports — it deliberately does NOT use
the Kleene `None` short-circuit. Matches when ANY listed entity is unavailable,
unknown, or absent: the "block here if any of these is down" guard.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..triggers import EMPTY, TriggerSpec
from ._common import UNAVAILABLE, predicate_has_any, state_sources


@dataclass(frozen=True)
class UnavailableSnapshot:
    """Frozen view of referenced entity states at tick time.

    `present` maps entity_id -> state string for entities that exist; an entity
    referenced by a predicate but absent from this map does not exist and counts
    as unavailable. `names` carries friendly names for `describe`.
    """

    now: datetime
    present: dict[str, str]
    names: dict[str, str] = field(default_factory=dict)


class UnavailableCondition:
    """Match whether any of the chosen entities is unavailable/unknown/absent."""

    name = "unavailable"
    description = "Matches when any of the listed entities is unavailable, unknown, or missing."
    predicate_help = (
        "{entities: [entity_id, ...]} — matches when ANY listed entity is "
        "unavailable, unknown, or absent. None = match-anything."
    )
    input = "unavailable_predicate"
    # The highest priority (sorts earliest), above even script (975) and
    # template (970): whether an entity is observable at all is the most
    # fundamental world-fact, so it leads the linearisation tiebreaker.
    priority = 980

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: datetime | None = None,
        entities: frozenset[str] | None = None,
    ) -> UnavailableSnapshot:
        present: dict[str, str] = {}
        names: dict[str, str] = {}
        # `entities` (the entities scenes reference) lets us read just those; None
        # (the simulator / direct callers) scans all states — this condition spans
        # any domain, so unlike occupancy there is no domain filter to narrow it.
        for s in state_sources(hass, entities):
            if s is None:
                continue  # referenced entity that doesn't exist -> absent (unavailable)
            present[s.entity_id] = s.state
            names[s.entity_id] = s.attributes.get("friendly_name") or s.entity_id
        return UnavailableSnapshot(now=now or dt_util.utcnow(), present=present, names=names)

    def _is_unavailable(self, eid: str, snap: UnavailableSnapshot) -> bool:
        """True when `eid` is absent, or present with an unavailable/unknown state."""
        state = snap.present.get(eid)
        return state is None or state in UNAVAILABLE

    def matches(self, predicate: Any, snapshot: UnavailableSnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        entities = predicate.get("entities") or []
        # Empty (shouldn't occur post-validation): "any of none" is False.
        return any(self._is_unavailable(e, snapshot) for e in entities)

    def describe(self, snapshot: UnavailableSnapshot, predicate: Any = None) -> str | None:
        if predicate is None:
            return self._describe_snapshot(snapshot)
        if not isinstance(predicate, dict):
            return None
        entities = predicate.get("entities") or []
        if not entities:
            return "no entities"
        parts: list[str] = []
        for eid in entities:
            name = snapshot.names.get(eid, eid)
            state = snapshot.present.get(eid, "missing")
            mark = "✓" if self._is_unavailable(eid, snapshot) else "✗"
            parts.append(f"{name}: {state} {mark}")
        return f"any unavailable: {', '.join(parts)}"

    def _describe_snapshot(self, snapshot: UnavailableSnapshot) -> str | None:
        if not snapshot.present:
            return "no entities"
        down = sorted(
            snapshot.names.get(eid, eid)
            for eid, state in snapshot.present.items()
            if state in UNAVAILABLE
        )
        total = len(snapshot.present)
        if down:
            return f"{len(down)} of {total} unavailable ({', '.join(down)})"
        return f"0 of {total} unavailable"

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise ValueError("This unavailable condition is malformed.")
        entities = predicate.get("entities")
        if not isinstance(entities, list) or not entities:
            raise ValueError("Pick at least one entity for this unavailable condition.")
        if not all(isinstance(e, str) and e.strip() for e in entities):
            raise ValueError("Every entity must be a non-empty entity id.")

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        if not isinstance(predicate, dict):
            return EMPTY
        entities = [e for e in (predicate.get("entities") or []) if isinstance(e, str) and e]
        if not entities:
            return EMPTY
        return TriggerSpec(entities=frozenset(entities))

    def is_constraining(self, predicate: Any) -> bool:
        return predicate_has_any(predicate, "entities")

    def order_key(self, predicate: Any) -> str:
        if not isinstance(predicate, dict):
            return ""
        # Lexicographically-first entity id is the stable linearisation key.
        return min((e for e in (predicate.get("entities") or []) if isinstance(e, str)), default="")

    def contains(self, outer: Any, inner: Any) -> bool:
        """True iff every world-state matching `inner` also matches `outer`.
        For "any unavailable", inner's entity-set ⊆ outer's implies inner-match ⊆
        outer-match. Conservative: unprovable -> False."""
        if not isinstance(outer, dict) or not isinstance(inner, dict):
            return False
        so = frozenset(e for e in (outer.get("entities") or []) if isinstance(e, str))
        si = frozenset(e for e in (inner.get("entities") or []) if isinstance(e, str))
        if not so or not si:
            return False
        return si <= so
