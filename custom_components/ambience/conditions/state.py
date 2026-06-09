"""StateCondition — boolean expression over entity states + optional `for`."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..triggers import EMPTY, TriggerSpec
from ._common import (
    UNAVAILABLE,
    dur_seconds,
    fmt_duration,
    kleene_all,
    kleene_any,
    kleene_not,
    validate_for,
)


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


class StateCondition:
    """Match a scene against a boolean expression over entity states.

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
    # Above day (900): state is the most specific world-fact a scene can name,
    # so it ranks highest among world-fact conditions in the linearisation
    # tiebreaker.
    priority = 950

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: datetime | None = None,
        entities: frozenset[str] | None = None,  # part of the shared contract; not used here
    ) -> StateSnapshot:
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
        # `_eval` is tri-state: None = unobservable. Collapse it to a miss here —
        # only a definite True counts as a match.
        return self._eval(predicate, snapshot) is True

    # The numeric comparison kinds that need a prettier symbol than their key;
    # `>`/`<` already read fine, so only `>=`/`<=` are remapped. The membership
    # kinds ("is"/"is_not") render as words instead.
    _OP_SYMBOLS = {">=": "≥", "<=": "≤"}

    def describe(self, snapshot: StateSnapshot, predicate: Any = None) -> str | None:
        # predicate=None is the whole-snapshot summary (snapshots_described); a
        # summary over the entire HA state is meaningless for `state`, so stay
        # None. A non-dict predicate is malformed — nothing to describe.
        if not isinstance(predicate, dict):
            return None
        return self._describe_expr(predicate, snapshot)

    def _describe_expr(self, expr: Any, snap: StateSnapshot) -> str:
        # Mirror occupancy's flat style: atoms render inline; groups wrap their
        # items with the quantifier; `not` wraps its single child.
        if not isinstance(expr, dict):
            return "?"
        kind = expr.get("kind")
        if kind in self._ATOM_KINDS:
            return self._describe_atom(expr, snap)
        if kind in ("and", "or"):
            body = ", ".join(self._describe_expr(it, snap) for it in (expr.get("items") or []))
            return f"{'all' if kind == 'and' else 'any'} of: {body}"
        if kind == "not":
            return f"not({self._describe_expr(expr.get('item'), snap)})"
        return "?"

    def _describe_atom(self, atom: dict, snap: StateSnapshot) -> str:
        entity_id = atom.get("entity_id")
        attribute = atom.get("attribute")
        attrs = snap.attributes.get(entity_id) if isinstance(entity_id, str) else None
        # Friendly name (falls back to the id); in attribute-mode append the
        # attribute so "Thermostat temperature" reads unambiguously.
        name = (attrs or {}).get("friendly_name") or entity_id or "?"
        label = f"{name} {attribute}" if attribute else name
        seconds = dur_seconds(atom.get("for"))
        cur = snap.states.get(entity_id) if isinstance(entity_id, str) else None
        if cur is None:
            current = "not found"
            elapsed = ""
        else:
            state, last_changed, last_updated = cur
            if attribute:
                current = str(attrs[attribute]) if attrs and attribute in attrs else "—"
            else:
                current = state
            # With a `for` gate, show how long the value has held so a
            # recently-changed atom's ✗ is self-explanatory. Clock matches
            # _eval_atom: attribute-mode off last_updated, state-mode off
            # last_changed.
            if seconds > 0:
                since = last_updated if attribute else last_changed
                elapsed = f" {fmt_duration((snap.now - since).total_seconds())}"
            else:
                elapsed = ""
        mark = "✓" if self._eval_atom(atom, snap) is True else "✗"
        comparison = self._describe_comparison(atom)
        for_clause = f", for ≥{fmt_duration(seconds)}" if seconds > 0 else ""
        return f"{label}: {current}{elapsed} {mark} ({comparison}{for_clause})"

    def _describe_comparison(self, atom: dict) -> str:
        kind = atom.get("kind")
        states = atom.get("states") or []
        if kind in self._NUMERIC_KINDS:
            rhs = states[0] if states else "?"
            return f"{self._OP_SYMBOLS.get(kind, kind)} {rhs}"
        joined = ", ".join(str(s) for s in states)
        return f"is not {joined}" if kind == "is_not" else f"is {joined}"

    # --- evaluation -----------------------------------------------------

    _ATOM_KINDS = ("is", "is_not", ">", ">=", "<", "<=")
    _NUMERIC_KINDS = (">", ">=", "<", "<=")

    def _eval(self, expr: Any, snap: StateSnapshot) -> bool | None:
        # Tri-state (Kleene): True/False, or None when an atom is unobservable
        # (entity unavailable/unknown/absent). Carrying None through `and`/`or`/
        # `not` keeps a `not` from inverting an unobservable atom into a spurious
        # match — `not(light is on)` must not fire when the light is unavailable.
        if not isinstance(expr, dict):
            return False
        kind = expr.get("kind")
        if kind in self._ATOM_KINDS:
            return self._eval_atom(expr, snap)
        if kind == "and":
            return kleene_all(self._eval(it, snap) for it in (expr.get("items") or []))
        if kind == "or":
            return kleene_any(self._eval(it, snap) for it in (expr.get("items") or []))
        if kind == "not":
            return kleene_not(self._eval(expr.get("item"), snap))
        return False

    def _eval_atom(self, atom: dict, snap: StateSnapshot) -> bool | None:
        entity_id = atom.get("entity_id")
        if not isinstance(entity_id, str):
            return False
        cur = snap.states.get(entity_id)
        if cur is None:
            return None  # entity doesn't exist -> unobservable
        state, last_changed, last_updated = cur
        if state in UNAVAILABLE:
            return None  # unobservable
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
            seconds = dur_seconds(dur)
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
        the predicate hard — the scene just doesn't match)."""
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

    # --- validation -----------------------------------------------------

    _VALID_KINDS = ("is", "is_not", ">", ">=", "<", "<=", "and", "or", "not")

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        self._validate_expr(predicate)

    def _validate_expr(self, expr: Any) -> None:
        # Messages here surface verbatim to the user in the scene editor, so they
        # read as plain guidance rather than internal jargon (no "atom"/"list").
        if not isinstance(expr, dict):
            raise ValueError("This state condition is malformed.")
        kind = expr.get("kind")
        if kind not in self._VALID_KINDS:
            raise ValueError(f"Unknown state condition kind: {kind!r}.")
        if kind in self._ATOM_KINDS:
            self._validate_atom(expr)
        elif kind in ("and", "or"):
            items = expr.get("items")
            if not isinstance(items, list) or not items:
                raise ValueError(f"An ‘{kind}’ group needs at least one condition.")
            for it in items:
                self._validate_expr(it)
        else:  # "not"
            item = expr.get("item")
            if item is None:
                raise ValueError("A ‘not’ group needs a condition to negate.")
            self._validate_expr(item)

    def _validate_atom(self, atom: dict) -> None:
        entity_id = atom.get("entity_id")
        if not isinstance(entity_id, str) or not entity_id.strip():
            raise ValueError("Pick an entity for this state condition.")
        kind = atom.get("kind")
        states = atom.get("states")
        if not isinstance(states, list):
            raise ValueError("This state condition is malformed.")
        # Numeric ops have stricter shape: exactly one numeric string.
        if kind in self._NUMERIC_KINDS:
            if len(states) != 1:
                raise ValueError(f"The ‘{kind}’ comparison needs exactly one value.")
            if not isinstance(states[0], str) or not states[0]:
                raise ValueError(f"Enter a number for the ‘{kind}’ comparison.")
            try:
                float(states[0])
            except ValueError:
                raise ValueError(
                    f"The ‘{kind}’ comparison needs a number, but got {states[0]!r}."
                ) from None
        else:
            if not states:
                raise ValueError("Pick at least one state to match.")
            if not all(isinstance(s, str) and s for s in states):
                raise ValueError("Every state to match must be a non-empty value.")
        attribute = atom.get("attribute")
        if attribute is not None and (not isinstance(attribute, str) or not attribute.strip()):
            raise ValueError("The attribute name must not be blank.")
        validate_for(atom.get("for"))

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
                seconds = dur_seconds(expr.get("for"))
                if seconds > 0:
                    durations.add((entity_id, seconds))
            return
        if kind in ("and", "or"):
            for item in expr.get("items") or []:
                self._collect_deps(item, entities, durations)
        if kind == "not":
            self._collect_deps(expr.get("item"), entities, durations)
