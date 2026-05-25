"""StateMatcher — boolean expression over entity states + optional `for`."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util


@dataclass(frozen=True)
class StateSnapshot:
    """Frozen view of HA states at tick time."""

    now: datetime
    # entity_id -> (state, last_changed). Captured up-front so matching is pure.
    states: dict[str, tuple[str, datetime]]


_UNAVAILABLE = {"unavailable", "unknown"}


class StateMatcher:
    """Match a rule against a boolean expression over entity states.

    Predicate is a recursive tree:
      atom:  {kind: 'is' | 'is_not', entity_id, states: [...], for?: {h,m,s}}
      group: {kind: 'and' | 'or', items: [...]}
      not:   {kind: 'not', item: ...}

    `None` = vacuous true (no constraint).
    """

    name = "state"
    description = "Matches a boolean expression over entity states with optional duration."
    predicate_help = (
        "Expression tree: atoms {kind: 'is'|'is_not', entity_id, states, for}, "
        "groups {kind: 'and'|'or', items: [...]}, negation {kind: 'not', item}. "
        "None = match-anything."
    )
    toggleable = True
    input = "state_predicate"
    # Between scene (0) and day (100): state is the most specific world-fact
    # a rule can name, so it fires earliest in the linearisation tiebreaker.
    priority = 50

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    async def snapshot(self, hass: HomeAssistant) -> StateSnapshot:
        states: dict[str, tuple[str, datetime]] = {
            s.entity_id: (s.state, s.last_changed) for s in hass.states.async_all()
        }
        return StateSnapshot(now=dt_util.utcnow(), states=states)

    def matches(self, predicate: Any, snapshot: StateSnapshot) -> bool:
        if predicate is None:
            return True
        return self._eval(predicate, snapshot)

    def describe(self, snapshot: StateSnapshot) -> str | None:
        # No single "current value" — depends on which atoms a predicate names.
        return None

    # --- evaluation -----------------------------------------------------

    def _eval(self, expr: Any, snap: StateSnapshot) -> bool:
        if not isinstance(expr, dict):
            return False
        kind = expr.get("kind")
        if kind in ("is", "is_not"):
            return self._eval_atom(expr, snap)
        if kind == "and":
            items = expr.get("items") or []
            return all(self._eval(it, snap) for it in items)
        if kind == "or":
            items = expr.get("items") or []
            return any(self._eval(it, snap) for it in items)
        if kind == "not":
            return not self._eval(expr.get("item"), snap)
        return False

    def _eval_atom(self, atom: dict, snap: StateSnapshot) -> bool:
        entity_id = atom.get("entity_id")
        if not isinstance(entity_id, str):
            return False
        cur = snap.states.get(entity_id)
        if cur is None:
            return False
        state, last_changed = cur
        if state in _UNAVAILABLE:
            return False
        allowed = atom.get("states") or []
        in_set = state in allowed
        if atom.get("kind") == "is_not":
            in_set = not in_set
        if not in_set:
            return False
        dur = atom.get("for")
        if dur:
            seconds = self._dur_seconds(dur)
            if seconds > 0:
                elapsed = (snap.now - last_changed).total_seconds()
                if elapsed < seconds:
                    return False
        return True

    @staticmethod
    def _dur_seconds(dur: Any) -> float:
        if not isinstance(dur, dict):
            return 0.0
        h = dur.get("h") or 0
        m = dur.get("m") or 0
        s = dur.get("s") or 0
        return float(h) * 3600 + float(m) * 60 + float(s)
