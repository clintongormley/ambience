"""StateCondition — boolean expression over entity states + optional `for`."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..errors import AmbienceError
from ..triggers import EMPTY, DurationGate, GateReading, TriggerSpec
from ._common import (
    UNAVAILABLE,
    Detail,
    as_float_state,
    compare_numeric,
    dur_seconds,
    ent,
    fmt_duration,
    for_comparator_symbol,
    for_elapsed_satisfied,
    join_segs,
    kleene_all,
    kleene_any,
    kleene_not,
    phrase,
    render_detail,
    state_sources,
    tenure_held,
    tenure_within,
    text,
    validate_entity_ids,
    validate_for,
    validate_for_mode,
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
    # entity_id -> attribute mapping. Populated alongside states for atoms that
    # compare an attribute instead of the state itself. Held by reference: HA's
    # `State.attributes` is an immutable ReadOnlyDict and a state change
    # replaces the whole State, so the snapshot stays a frozen view without
    # copying every entity's attributes on every tick.
    attributes: dict[str, Mapping[str, Any]] = field(default_factory=dict)
    # Engine-injected per-gate tenure: gate fingerprint -> the time its instant
    # test last became true. When present, `for:` atoms gate off predicate
    # tenure (surviving in-set flips); when None (the simulator and direct
    # callers without an engine) they fall back to the legacy exact-state clock.
    tenure: Mapping[str, datetime] | None = None


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
        entities: frozenset[str] | None = None,
    ) -> StateSnapshot:
        states: dict[str, tuple[str, datetime, datetime]] = {}
        attributes: dict[str, Mapping[str, Any]] = {}
        # `entities` (the entities atoms actually reference) lets us read just
        # those; None (the simulator path) means a full scan. This runs on the
        # hottest path in the system — every motion/door event — so copying
        # every entity's attributes would be thousands of dict copies per tick.
        for s in state_sources(hass, entities):
            if s is None:
                continue  # referenced entity that doesn't exist
            states[s.entity_id] = (s.state, s.last_changed, s.last_updated)
            attributes[s.entity_id] = s.attributes
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

    def describe(self, snapshot: StateSnapshot, predicate: Any = None) -> Detail | None:
        # predicate=None is the whole-snapshot summary (snapshots_described); a
        # summary over the entire HA state is meaningless for `state`, so stay
        # None. A non-dict predicate is malformed — nothing to describe.
        if not isinstance(predicate, dict):
            return None
        return self._describe_expr(predicate, snapshot)

    def _describe_expr(self, expr: Any, snap: StateSnapshot) -> Detail:
        # Mirror occupancy's flat style: atoms render inline; groups wrap their
        # items with the quantifier; `not` wraps its single child.
        if not isinstance(expr, dict):
            return [text("?")]
        kind = expr.get("kind")
        if kind in self._ATOM_KINDS:
            return self._describe_atom(expr, snap)
        if kind in ("and", "or"):
            cells = [self._describe_expr(it, snap) for it in (expr.get("items") or [])]
            return [phrase("all_of" if kind == "and" else "any_of"), text(" "), *join_segs(cells)]
        if kind == "not":
            return [
                phrase("negate"),
                text("("),
                *self._describe_expr(expr.get("item"), snap),
                text(")"),
            ]
        return [text("?")]

    def _describe_atom(self, atom: dict, snap: StateSnapshot) -> Detail:
        entity_id = atom.get("entity_id")
        attribute = atom.get("attribute")
        attrs = snap.attributes.get(entity_id) if isinstance(entity_id, str) else None
        # Friendly name (falls back to the id); in attribute-mode append the
        # attribute so "Thermostat temperature" reads unambiguously. The name is
        # a linkable `ent` seg; a trailing attribute stays plain `text` so the
        # link wraps only the entity.
        name = (attrs or {}).get("friendly_name") or entity_id or "?"
        if isinstance(entity_id, str):
            label: Detail = [ent(entity_id, name)]
        else:
            label = [text(name)]
        if attribute:
            label.append(text(f" {attribute}"))
        seconds = dur_seconds(atom.get("for"))
        cur = snap.states.get(entity_id) if isinstance(entity_id, str) else None
        if cur is None:
            current: Detail = [phrase("not_found")]
            elapsed = ""
        else:
            state, last_changed, last_updated = cur
            if attribute:
                current = [text(str(attrs[attribute]) if attrs and attribute in attrs else "—")]
            else:
                current = [text(state)]
            # With a `for` gate, show how long the value has held so a
            # recently-changed atom's ✗ is self-explanatory. In tenure mode the
            # elapsed is how long the *gate* has held (from the engine tenure
            # map, surviving in-set flips); in the legacy fallback it clocks off
            # last_updated (attribute mode) / last_changed (state mode), matching
            # _eval_atom.
            if seconds > 0 and snap.tenure is not None:
                since = snap.tenure.get(self._atom_gate_key(atom))
                elapsed = f" {fmt_duration((snap.now - since).total_seconds())}" if since else ""
            elif seconds > 0:
                since = last_updated if attribute else last_changed
                elapsed = f" {fmt_duration((snap.now - since).total_seconds())}"
            else:
                elapsed = ""
        mark = "✓" if self._eval_atom(atom, snap) is True else "✗"
        comparison = self._describe_comparison(atom)
        for_clause: Detail = []
        if seconds > 0:
            # Comparator follows for_mode: ≥ for at_least (default), < for less_than.
            for_cmp = for_comparator_symbol(atom.get("for_mode"))
            for_clause = [text(", "), phrase("for_hold", rel=for_cmp, dur=fmt_duration(seconds))]
        return [
            *label,
            text(": "),
            *current,
            text(f"{elapsed} {mark} ("),
            *comparison,
            *for_clause,
            text(")"),
        ]

    def _describe_comparison(self, atom: dict) -> Detail:
        kind = atom.get("kind")
        states = atom.get("states") or []
        if kind in self._NUMERIC_KINDS:
            rhs = states[0] if states else "?"
            return [text(f"{self._OP_SYMBOLS.get(kind, kind)} {rhs}")]
        joined = ", ".join(str(s) for s in states)
        return [phrase("is_not" if kind == "is_not" else "is", values=joined)]

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

    @staticmethod
    def _atom_gate_key(atom: dict) -> str:
        """Canonical fingerprint of an atom's *instant* test (sans `for`).

        States are sorted so `is [A, B]` and `is [B, A]` share one tenure clock.
        The same fingerprint anywhere in the config maps to the same engine
        tenure entry. The components are `repr`-encoded into a tuple rather than
        string-joined so an arbitrary state value (which may itself contain any
        delimiter) can never collide with a different atom — e.g. the single
        value `"a|b"` must not fingerprint the same as the set `["a", "b"]`."""
        return repr(
            (
                atom.get("kind"),
                atom.get("entity_id"),
                atom.get("attribute") or "",
                tuple(sorted(str(s) for s in (atom.get("states") or []))),
            )
        )

    def _atom_instant(self, atom: dict, snap: StateSnapshot) -> bool | None:
        """The atom's instant (un-`for`ed) truth: True/False, or None when the
        entity is unobservable (absent / unavailable)."""
        entity_id = atom.get("entity_id")
        if not isinstance(entity_id, str):
            return False
        cur = snap.states.get(entity_id)
        if cur is None:
            return None  # entity doesn't exist -> unobservable
        state, _last_changed, _last_updated = cur
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
            return self._numeric_op(kind, value, rhs)
        in_set = value in rhs
        if kind == "is_not":
            in_set = not in_set
        return in_set

    def _eval_atom(self, atom: dict, snap: StateSnapshot) -> bool | None:
        instant = self._atom_instant(atom, snap)
        if instant is not True:
            return instant  # False or None (unobservable) carry through
        seconds = dur_seconds(atom.get("for"))
        if seconds <= 0:
            return True
        # `for_mode` picks the comparator on the held duration: the default
        # "at_least" (None) gates on the gate having held ≥ `for`; "less_than"
        # is its mirror — the gate has held < `for` (boundary exclusive). The
        # instant test above is identical for both; only the duration verdict
        # differs, so the two share one tenure clock by design.
        less_than = atom.get("for_mode") == "less_than"
        if snap.tenure is not None:
            # Engine-tracked predicate tenure: the instant test (set membership
            # / comparison) has held this long, surviving in-set state flips
            # (an `is [A, B] for` atom no longer resets when the entity flips
            # A→B, since the gate fingerprint ignores which of A/B is current).
            key = self._atom_gate_key(atom)
            if less_than:
                return tenure_within(snap.tenure, key, snap.now, seconds)
            return tenure_held(snap.tenure, key, snap.now, seconds)
        # Legacy exact-state clock (the simulator / direct callers with no
        # engine): state-mode atoms clock off last_changed (the state string has
        # been stable that long); attribute-mode atoms off last_updated (an
        # attribute change resets its own clock). This means "in the current
        # exact state that long" — only used where no tenure history exists.
        _state, last_changed, last_updated = snap.states[atom["entity_id"]]
        since = last_updated if atom.get("attribute") else last_changed
        elapsed = (snap.now - since).total_seconds()
        return for_elapsed_satisfied(elapsed, seconds, atom.get("for_mode"))

    def gate_states(self, predicate: Any, snap: StateSnapshot) -> dict[str, GateReading]:
        """For each `for:`-bearing atom in the tree, report `(instant_truth,
        anchor)`: the un-`for`ed verdict and the timestamp the engine should
        seed tenure from at startup/reload (a provable lower bound — the atom's
        last state/attribute change). Atoms without a `for:` are omitted; the
        engine only tracks tenure for gates it will re-check."""
        out: dict[str, GateReading] = {}
        self._collect_gate_states(predicate, snap, out)
        return out

    def _collect_gate_states(
        self, expr: Any, snap: StateSnapshot, out: dict[str, GateReading]
    ) -> None:
        if not isinstance(expr, dict):
            return
        kind = expr.get("kind")
        if kind in self._ATOM_KINDS:
            if dur_seconds(expr.get("for")) <= 0:
                return
            instant = self._atom_instant(expr, snap) is True
            cur = snap.states.get(expr.get("entity_id"))
            if cur is None:
                anchor = snap.now  # no real change time to clock from
            else:
                _state, last_changed, last_updated = cur
                anchor = last_updated if expr.get("attribute") else last_changed
            out[self._atom_gate_key(expr)] = (instant, anchor)
            return
        if kind in ("and", "or"):
            for item in expr.get("items") or []:
                self._collect_gate_states(item, snap, out)
        if kind == "not":
            self._collect_gate_states(expr.get("item"), snap, out)

    @staticmethod
    def _numeric_op(kind: str, value: str, rhs: list) -> bool:
        """Parse both sides as float and apply the comparison. False on any
        parse failure or unexpected RHS shape — the scene just doesn't match."""
        if len(rhs) != 1:
            return False
        actual = as_float_state(value)
        threshold = as_float_state(rhs[0])
        if actual is None or threshold is None:
            return False
        return compare_numeric(actual, kind, threshold)

    # --- validation -----------------------------------------------------

    _VALID_KINDS = ("is", "is_not", ">", ">=", "<", "<=", "and", "or", "not")

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        self._validate_expr(predicate)

    # --- normalisation (save-time) --------------------------------------

    def normalize_predicate(self, predicate: Any) -> Any:
        """Flatten redundant nesting into the canonical stored form: collapse a
        single-child ``and``/``or`` group to its sole item, and merge a same-op
        nested group into its parent. Semantically a no-op — ``kleene_all`` /
        ``kleene_any`` over the flattened tree give the same result — so this
        only strips the wrappers the editor's group "( )" wrap can leave behind,
        keeping persisted predicates and trace descriptions clean. Called once at
        save (``canonicalise``), never during live editing. Pure: returns a new
        tree, never mutates the input."""
        if predicate is None:
            return None
        return self._normalize_expr(predicate)

    @staticmethod
    def _normalize_expr(expr: Any) -> Any:
        # Runs only on validated predicates (canonicalise is gated by
        # validate_predicate), so groups always carry a non-empty `items` list,
        # `not` a non-None `item`, and every node is a dict — no defensive guards.
        kind = expr.get("kind")
        if kind in ("and", "or"):
            flat: list[Any] = []
            for item in expr["items"]:
                norm = StateCondition._normalize_expr(item)
                # A same-op child is redundant nesting — splice its items up so
                # AND[AND[a,b], c] becomes AND[a,b,c]. (A normalized group always
                # has >= 2 items; a single-child one already collapsed below.)
                if norm.get("kind") == kind:
                    flat.extend(norm["items"])
                else:
                    flat.append(norm)
            # A one-element AND/OR group *is* that element.
            return flat[0] if len(flat) == 1 else {**expr, "items": flat}
        if kind == "not":
            return {**expr, "item": StateCondition._normalize_expr(expr["item"])}
        return expr  # atom — nothing to flatten

    def _validate_expr(self, expr: Any) -> None:
        # These keys surface to the user in the scene editor, so their messages
        # read as plain guidance rather than internal jargon (no "atom"/"list").
        if not isinstance(expr, dict):
            raise AmbienceError("state_malformed")
        kind = expr.get("kind")
        if kind not in self._VALID_KINDS:
            raise AmbienceError("state_unknown_kind", kind=kind)
        if kind in self._ATOM_KINDS:
            self._validate_atom(expr)
        elif kind in ("and", "or"):
            items = expr.get("items")
            if not isinstance(items, list) or not items:
                raise AmbienceError("state_group_empty", kind=kind)
            for it in items:
                self._validate_expr(it)
        else:  # "not"
            item = expr.get("item")
            if item is None:
                raise AmbienceError("state_not_empty")
            self._validate_expr(item)

    def _validate_atom(self, atom: dict) -> None:
        entity_id = atom.get("entity_id")
        if not isinstance(entity_id, str) or not entity_id.strip():
            raise AmbienceError("state_pick_entity")
        # Any domain: a state test reads whatever entity the user picked.
        validate_entity_ids([entity_id], key="state_pick_entity")
        kind = atom.get("kind")
        states = atom.get("states")
        if not isinstance(states, list):
            raise AmbienceError("state_malformed")
        # Numeric ops have stricter shape: exactly one numeric string.
        if kind in self._NUMERIC_KINDS:
            if len(states) != 1:
                raise AmbienceError("state_compare_one_value", kind=kind)
            if not isinstance(states[0], str) or not states[0]:
                raise AmbienceError("state_compare_needs_number", kind=kind)
            try:
                float(states[0])
            except ValueError:
                raise AmbienceError(
                    "state_compare_not_number", kind=kind, value=states[0]
                ) from None
        else:
            if not states:
                raise AmbienceError("state_pick_state")
            if not all(isinstance(s, str) and s for s in states):
                raise AmbienceError("state_states_invalid")
        attribute = atom.get("attribute")
        if attribute is not None and (not isinstance(attribute, str) or not attribute.strip()):
            raise AmbienceError("state_attribute_blank")
        validate_for(atom.get("for"))
        validate_for_mode(atom.get("for_mode"))

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
        gates: set[DurationGate] = set()
        self._collect_deps(predicate, entities, gates)
        return TriggerSpec(
            entities=frozenset(entities),
            duration_gates=frozenset(gates),
        )

    def _collect_deps(
        self,
        expr: Any,
        entities: set[str],
        gates: set[DurationGate],
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
                    gates.add(
                        DurationGate(
                            key=self._atom_gate_key(expr),
                            seconds=seconds,
                            label=f"{entity_id} {render_detail(self._describe_comparison(expr))}",
                            entity_id=entity_id,
                        )
                    )
            return
        if kind in ("and", "or"):
            for item in expr.get("items") or []:
                self._collect_deps(item, entities, gates)
        if kind == "not":
            self._collect_deps(expr.get("item"), entities, gates)
