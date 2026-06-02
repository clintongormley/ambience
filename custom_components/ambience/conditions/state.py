"""StateCondition — boolean expression over entity states + optional `for`."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..triggers import EMPTY, TriggerSpec


@dataclass(frozen=True)
class StateSnapshot:
    """Frozen view of HA states at tick time."""

    now: datetime
    # entity_id -> (state, last_changed, last_updated). Captured up-front so
    # matching is pure. Both timestamps are kept so the `for` clock can pick
    # the right one per atom: state-mode atoms clock off `last_changed` (only
    # moves when the state string changes), while attribute-mode atoms clock
    # off `last_updated` (any change, including an attribute-only refresh,
    # resets the clock — correct when the atom's LHS *is* an attribute).
    states: dict[str, tuple[str, datetime, datetime]]
    # entity_id -> attribute dict. Populated alongside states for atoms that
    # compare an attribute instead of the state itself.
    attributes: dict[str, dict[str, Any]] = field(default_factory=dict)


_UNAVAILABLE = {"unavailable", "unknown"}


class StateCondition:
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
        "Expression tree: atoms {kind: 'is'|'is_not'|'>'|'>='|'<'|'<=', "
        "entity_id, attribute?, states, for?}, groups {kind: 'and'|'or', "
        "items: [...]}, negation {kind: 'not', item}. For numeric ops, "
        "`states` carries a single numeric threshold as a string. None = "
        "match-anything."
    )
    input = "state_predicate"
    # Above day (900): state is the most specific world-fact a rule can name,
    # so it ranks highest among world-fact conditions in the linearisation
    # tiebreaker.
    priority = 950

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    async def snapshot(self, hass: HomeAssistant, *, now: datetime | None = None) -> StateSnapshot:
        states: dict[str, tuple[str, datetime, datetime]] = {}
        attributes: dict[str, dict[str, Any]] = {}
        for s in hass.states.async_all():
            states[s.entity_id] = (s.state, s.last_changed, s.last_updated)
            # `s.attributes` is a Mapping; copy into a plain dict so the
            # snapshot stays detached from HA's live state object.
            attributes[s.entity_id] = dict(s.attributes)
        return StateSnapshot(now=now or dt_util.utcnow(), states=states, attributes=attributes)

    def matches(self, predicate: Any, snapshot: StateSnapshot) -> bool:
        if predicate is None:
            return True
        return self._eval(predicate, snapshot)

    def describe(self, snapshot: StateSnapshot) -> str | None:
        # No single "current value" — depends on which atoms a predicate names.
        return None

    # --- evaluation -----------------------------------------------------

    _ATOM_KINDS = ("is", "is_not", ">", ">=", "<", "<=")
    _NUMERIC_KINDS = (">", ">=", "<", "<=")

    def _eval(self, expr: Any, snap: StateSnapshot) -> bool:
        if not isinstance(expr, dict):
            return False
        kind = expr.get("kind")
        if kind in self._ATOM_KINDS:
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
        state, last_changed, last_updated = cur
        if state in _UNAVAILABLE:
            return False
        # When `attribute` is set, swap the LHS from entity.state to
        # entity.attributes[attribute]. Missing attribute → no match.
        attribute = atom.get("attribute")
        if attribute:
            attrs = snap.attributes.get(entity_id) or {}
            if attribute not in attrs:
                return False
            value = str(attrs[attribute])
        else:
            value = state
        kind = atom.get("kind")
        rhs = atom.get("states") or []
        if kind in self._NUMERIC_KINDS:
            if not self._numeric_op(kind, value, rhs):
                return False
        else:
            in_set = value in rhs
            if kind == "is_not":
                in_set = not in_set
            if not in_set:
                return False
        dur = atom.get("for")
        if dur:
            seconds = self._dur_seconds(dur)
            if seconds > 0:
                # State-mode atoms clock off last_changed (the state string has
                # been stable that long); attribute-mode atoms clock off
                # last_updated (an attribute change should reset its own clock).
                since = last_updated if attribute else last_changed
                elapsed = (snap.now - since).total_seconds()
                if elapsed < seconds:
                    return False
        return True

    @staticmethod
    def _numeric_op(kind: str, value: str, rhs: list) -> bool:
        """Parse both sides as float and apply the comparison. Returns
        False on any parse failure or unexpected RHS shape (we don't fail
        the predicate hard — the rule just doesn't match)."""
        if len(rhs) != 1:
            return False
        try:
            actual = float(value)
            threshold = float(rhs[0])
        except (ValueError, TypeError):
            return False
        if kind == ">":
            return actual > threshold
        if kind == ">=":
            return actual >= threshold
        if kind == "<":
            return actual < threshold
        if kind == "<=":
            return actual <= threshold
        return False

    @staticmethod
    def _dur_seconds(dur: Any) -> float:
        if not isinstance(dur, dict):
            return 0.0
        h = dur.get("h") or 0
        m = dur.get("m") or 0
        s = dur.get("s") or 0
        return float(h) * 3600 + float(m) * 60 + float(s)

    # --- validation -----------------------------------------------------

    _VALID_KINDS = ("is", "is_not", ">", ">=", "<", "<=", "and", "or", "not")

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        self._validate_expr(predicate)

    def _validate_expr(self, expr: Any) -> None:
        if not isinstance(expr, dict):
            raise ValueError("state expression must be a dict")
        kind = expr.get("kind")
        if kind not in self._VALID_KINDS:
            raise ValueError(f"unknown kind: {kind!r}")
        if kind in self._ATOM_KINDS:
            self._validate_atom(expr)
        elif kind in ("and", "or"):
            items = expr.get("items")
            if not isinstance(items, list) or not items:
                raise ValueError(f"{kind} group requires a non-empty items list")
            for it in items:
                self._validate_expr(it)
        else:  # "not"
            item = expr.get("item")
            if item is None:
                raise ValueError("not requires an item")
            self._validate_expr(item)

    def _validate_atom(self, atom: dict) -> None:
        entity_id = atom.get("entity_id")
        if not isinstance(entity_id, str) or not entity_id.strip():
            raise ValueError("state atom requires a non-empty entity_id")
        kind = atom.get("kind")
        states = atom.get("states")
        if not isinstance(states, list):
            raise ValueError("state atom requires a states list")
        # Numeric ops have stricter shape: exactly one numeric string.
        if kind in self._NUMERIC_KINDS:
            if len(states) != 1:
                raise ValueError(f"{kind} atom requires exactly one threshold value")
            if not isinstance(states[0], str) or not states[0]:
                raise ValueError(f"{kind} atom threshold must be a non-empty string")
            try:
                float(states[0])
            except ValueError:
                raise ValueError(
                    f"{kind} atom threshold must be a numeric string, got {states[0]!r}"
                ) from None
        else:
            if not states:
                raise ValueError("state atom requires a non-empty states list")
            if not all(isinstance(s, str) and s for s in states):
                raise ValueError("state atom states must all be non-empty strings")
        attribute = atom.get("attribute")
        if attribute is not None and (not isinstance(attribute, str) or not attribute.strip()):
            raise ValueError("`attribute` must be a non-empty string or null")
        dur = atom.get("for")
        if dur is None:
            return
        if not isinstance(dur, dict):
            raise ValueError("`for` must be a dict {h,m,s} or null")
        for k in ("h", "m", "s"):
            v = dur.get(k, 0)
            if not isinstance(v, int) or isinstance(v, bool) or v < 0:
                raise ValueError(f"`for.{k}` must be a non-negative int")

    # --- linearisation --------------------------------------------------

    def order_key(self, predicate: Any) -> str:
        """First atom's entity_id, recursively. Empty string for `None`/no atoms."""
        atom = self._first_atom(predicate)
        return atom.get("entity_id", "") if atom else ""

    def _first_atom(self, expr: Any) -> dict | None:
        if not isinstance(expr, dict):
            return None
        kind = expr.get("kind")
        if kind in self._ATOM_KINDS:
            return expr
        if kind in ("and", "or"):
            for it in expr.get("items") or []:
                a = self._first_atom(it)
                if a is not None:
                    return a
        if kind == "not":
            return self._first_atom(expr.get("item"))
        return None

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        if predicate is None:
            return EMPTY
        entities: set[str] = set()
        durations: set[tuple[str, float]] = set()
        self._collect_deps(predicate, entities, durations)
        return TriggerSpec(
            entities=frozenset(entities),
            entity_durations=frozenset(durations),
        )

    def _collect_deps(
        self,
        expr: Any,
        entities: set[str],
        durations: set[tuple[str, float]],
    ) -> None:
        if not isinstance(expr, dict):
            return
        kind = expr.get("kind")
        if kind in self._ATOM_KINDS:
            entity_id = expr.get("entity_id")
            if isinstance(entity_id, str) and entity_id:
                entities.add(entity_id)
                seconds = self._dur_seconds(expr.get("for"))
                if seconds > 0:
                    durations.add((entity_id, seconds))
            return
        if kind in ("and", "or"):
            for item in expr.get("items") or []:
                self._collect_deps(item, entities, durations)
        if kind == "not":
            self._collect_deps(expr.get("item"), entities, durations)
