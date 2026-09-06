"""PeopleCondition — who is (not) at home / in a zone, with optional `for`."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
from datetime import datetime
from functools import partial
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..errors import AmbienceError
from ..triggers import EMPTY, DurationGate, GateReading, TriggerSpec
from ._common import (
    RULE_OR,
    RULE_TRUTHY,
    UNAVAILABLE,
    NormalisesPredicate,
    PredicateDefaults,
    dur_seconds,
    fmt_duration,
    for_comparator_symbol,
    for_contains,
    for_elapsed_satisfied,
    materialise_defaults,
    tenure_held,
    tenure_within,
    validate_entity_ids,
    validate_for,
    validate_for_mode,
)

_HOME = "home"
_QUANTS = ("any", "everyone", "nobody")


# `who` is deliberately absent: a present-but-empty list means "specific mode,
# nobody picked" and ``validate_predicate`` rejects it, so the all-persons
# wildcard must keep the key off.
_PREDICATE_DEFAULTS: PredicateDefaults = {
    "quant": (RULE_OR, "any"),
    "where": (RULE_OR, _HOME),
    "negate": (RULE_TRUTHY, False),
    "for_mode": (RULE_OR, "at_least"),
}

# Every read path funnels through here — ``_gate_key`` included, whose string
# keys the engine's tenure clocks — so a predicate stored before the defaults
# were materialised at save reads identically to one stored after.
_norm = partial(materialise_defaults, defaults=_PREDICATE_DEFAULTS)


@dataclass(frozen=True)
class PeopleSnapshot:
    """Frozen view of person/zone state at tick time."""

    now: datetime
    # person entity_id -> (state, last_changed). `last_changed` (not
    # last_updated): person entities get frequent attribute-only updates (GPS),
    # which would otherwise reset the `for` clock perpetually.
    persons: dict[str, tuple[str, datetime]]
    # person entity_id -> friendly name (for describe()).
    names: dict[str, str] = field(default_factory=dict)
    # zone entity_id -> the label person.state reports when in that zone
    # (home zone -> "home"; others -> friendly name). Used for the state
    # fallback when `in_zones` is unavailable.
    zone_labels: dict[str, str] = field(default_factory=dict)
    # person entity_id -> the `in_zones` attribute: a list of zone entity_ids
    # the person is currently inside (e.g. ["zone.work", "zone.home"]), or None
    # when the attribute is absent. Zones can overlap, so this can name several
    # zones at once where `state` resolves to only one. Preferred over `state`
    # ONLY when non-empty: HA populates `in_zones` from GPS coords only, so a
    # non-GPS presence scanner (router/ping/nmap/unifi/BLE) reports an empty
    # list even while home — an empty (or None) list defers to `state`.
    in_zones: dict[str, list[str] | None] = field(default_factory=dict)
    # Engine-injected per-gate tenure: gate fingerprint -> the time the
    # predicate's instant test last became true. When present, a `for:` clause
    # gates off this shared tenure (so moving between two away zones doesn't
    # reset "nobody home"); when None (the simulator / direct callers) it falls
    # back to the legacy per-person last_changed clock.
    tenure: Mapping[str, datetime] | None = None


class PeopleCondition(NormalisesPredicate):
    """Match on who is (not) at home / in a named zone.

    Predicate (scoped quantifier):
      {who: [person.*]? (omit/absent = all persons; an empty list is rejected),
       quant: 'any'|'everyone'|'nobody' (default 'any'),
       where: 'home'|'zone.*' (default 'home'),  # the POSITIVE location
       negate: bool? (default false),            # true = NOT at `where`
       for?: {h,m,s}}

    `None` = vacuous true (no constraint).
    """

    name = "people"
    description = "Matches who is (not) at home or in a named zone."
    predicate_help = (
        "{who: [person.*] (omit to match all persons), quant: 'any'|'everyone'|"
        "'nobody', where: 'home'|'zone.*', negate?: bool, for?: {h,m,s}}. "
        "None = match-anything."
    )
    input = "people_predicate"
    # Between state (950) and day (900): a moderately specific world-fact.
    priority = 925
    _DEFAULTS = _PREDICATE_DEFAULTS

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: datetime | None = None,
        entities: frozenset[str] | None = None,
    ) -> PeopleSnapshot:
        persons: dict[str, tuple[str, datetime]] = {}
        names: dict[str, str] = {}
        in_zones: dict[str, list[str] | None] = {}
        # `entities` (the persons scenes actually reference) lets us read those
        # directly; None means scan the whole person domain (back-compat). A
        # wildcard `who` predicate's trigger_deps enumerates every person, so the
        # referenced set is "all persons" whenever any wildcard people scene
        # exists — keeping matches()'s person universe correct. Zones are not
        # person-scoped, so they are always captured in full below.
        person_states = (
            [hass.states.get(eid) for eid in entities]
            if entities is not None
            else hass.states.async_all("person")
        )
        for s in person_states:
            if s is None:
                continue  # referenced person that doesn't exist
            persons[s.entity_id] = (s.state, s.last_changed)
            names[s.entity_id] = s.attributes.get("friendly_name") or s.entity_id
            raw = s.attributes.get("in_zones")
            in_zones[s.entity_id] = [str(z) for z in raw] if raw is not None else None
        zone_labels: dict[str, str] = {}
        for z in hass.states.async_all("zone"):
            friendly = z.attributes.get("friendly_name") or z.entity_id
            zone_labels[z.entity_id] = _HOME if z.entity_id == "zone.home" else friendly
        return PeopleSnapshot(
            now=now or dt_util.utcnow(),
            persons=persons,
            names=names,
            zone_labels=zone_labels,
            in_zones=in_zones,
        )

    def matches(self, predicate: Any, snapshot: PeopleSnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        pred = _norm(predicate)
        who = pred.get("who") or []
        quant = pred["quant"]
        where = pred["where"]
        negate = pred["negate"]
        seconds = dur_seconds(pred.get("for"))
        mode = pred["for_mode"]

        if seconds > 0 and snapshot.tenure is not None:
            # Engine-tracked predicate tenure: evaluate the instant test
            # (seconds=0), then gate on how long that test has held — which
            # survives a person moving between two away zones, etc.
            if not self._quantified(who, quant, where, negate, 0.0, snapshot):
                return False
            gate = tenure_within if mode == "less_than" else tenure_held
            return gate(snapshot.tenure, self._gate_key(pred), snapshot.now, seconds)
        return self._quantified(who, quant, where, negate, seconds, snapshot, mode)

    def _quantified(
        self,
        who: list,
        quant: str,
        where: str,
        negate: bool,
        seconds: float,
        snapshot: PeopleSnapshot,
        mode: str | None = None,
    ) -> bool:
        """The quantified location test, clocked off `seconds` of per-person
        tenure (the legacy/fallback clock). `seconds=0` yields the instant test.
        `mode` ("at_least" default / "less_than") selects the `for` comparator."""
        person_ids = list(who) if who else list(snapshot.persons)
        if not person_ids:
            # No persons to test: the location test is unobservable, so every
            # quantifier is False. `nobody` is deliberately NOT vacuously true
            # here — a "nobody home" scene must not fire on a Home Assistant
            # that tracks no persons at all, where there is no evidence either
            # way.
            return False

        def holds(pid: str, want_at: bool) -> bool:
            cur = snapshot.persons.get(pid)
            if cur is None:
                return False  # named but absent -> unobservable
            state, changed = cur
            at = self._loc_match(state, snapshot.in_zones.get(pid), where, snapshot)
            if at is None:  # unobservable (unavailable / unknown zone)
                return False
            return self._holds_at(
                at,
                changed,
                snapshot.now,
                want_at=want_at,
                negate=negate,
                seconds=seconds,
                mode=mode,
            )

        if quant == "everyone":
            return all(holds(p, True) for p in person_ids)
        if quant == "nobody":
            return all(holds(p, False) for p in person_ids)
        # "any" (default)
        return any(holds(p, True) for p in person_ids)

    @staticmethod
    def _gate_key(predicate: dict) -> str:
        """Canonical fingerprint of the predicate's instant (un-`for`ed) test.

        Same quantifier / location / negate / who-set anywhere in the config →
        same key → shared tenure clock."""
        pred = _norm(predicate)
        who = pred.get("who") or []
        who_part = "|".join(sorted(who)) if who else "*"
        return f"{pred['quant']}:{pred['where']}:{int(pred['negate'])}:{who_part}"

    def _gate_label(self, predicate: dict) -> str:
        """Human-readable instant description, for a multi-person DURATION trace
        cause (e.g. "nobody home", "anyone not in Work")."""
        pred = _norm(predicate)
        where = pred["where"]
        place = "home" if where == _HOME else f"in {where}"
        return f"{self._quant_word(pred['quant'])} {'not ' if pred['negate'] else ''}{place}"

    def gate_states(self, predicate: Any, snapshot: PeopleSnapshot) -> dict[str, GateReading]:
        """`{gate_key: (instant_truth, anchor)}` for a `for:`-bearing predicate,
        else empty. The anchor (startup/reload tenure seed) is the most recent
        person state change among the referenced persons — a provable lower
        bound on how long the instant test has held — falling back to
        `snapshot.now` when no referenced person is present."""
        if not isinstance(predicate, dict):
            return {}
        seconds = dur_seconds(predicate.get("for"))
        if seconds <= 0:
            return {}
        pred = _norm(predicate)
        who = pred.get("who") or []
        instant = self._quantified(who, pred["quant"], pred["where"], pred["negate"], 0.0, snapshot)
        person_ids = list(who) if who else list(snapshot.persons)
        changes = [cur[1] for pid in person_ids if (cur := snapshot.persons.get(pid)) is not None]
        anchor = max(changes) if changes else snapshot.now
        return {self._gate_key(pred): (instant, anchor)}

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        if not isinstance(predicate, dict):
            return EMPTY
        who = predicate.get("who") or []
        # Empty/absent `who` means "all persons": enumerate the current person.*
        # entities the same way snapshot() does. That enumeration is a point-in-time
        # answer, so a wildcard also depends on the `person` domain's MEMBERSHIP —
        # the engine watches it and rebuilds when a person is added or removed,
        # which re-enumerates this spec. Without it a person created after startup
        # is neither watched nor counted, and "nobody home" stays true while they
        # are home.
        persons = [p for p in who if isinstance(p, str) and p] if who else self._all_person_ids()
        domains = frozenset() if who else frozenset({"person"})
        seconds = dur_seconds(predicate.get("for"))
        gates = (
            frozenset(
                {
                    DurationGate(
                        key=self._gate_key(predicate),
                        seconds=seconds,
                        label=self._gate_label(predicate),
                        entity_id=(persons[0] if len(persons) == 1 else None),
                    )
                }
            )
            if seconds > 0
            else frozenset()
        )
        return TriggerSpec(entities=frozenset(persons), domains=domains, duration_gates=gates)

    def _all_person_ids(self) -> list[str]:
        hass = self._hass
        if hass is None:
            return []
        return [s.entity_id for s in hass.states.async_all("person")]

    @staticmethod
    def _target_zone(where: str) -> str:
        """The zone entity_id `where` refers to: 'home' -> 'zone.home'."""
        return "zone.home" if where == _HOME else where

    @classmethod
    def _loc_match(
        cls,
        state: str,
        in_zones: list[str] | None,
        where: str,
        snapshot: PeopleSnapshot,
    ) -> bool | None:
        """Pure (un-negated) location test.

        True/False if observable, None if unobservable. Prefers a NON-EMPTY
        `in_zones` (handles overlapping zones); falls back to `state` when it is
        absent (None) or empty ([]) — see `PeopleSnapshot.in_zones` for why an
        empty list must defer to `state`. `where`: 'home' or a 'zone.*' id.
        Caller applies any `negate` inversion.
        """
        if state in UNAVAILABLE:
            return None  # unobservable
        if in_zones:
            # Non-empty attribute: authoritative membership (overlaps included).
            return cls._target_zone(where) in in_zones
        # Fallback to state: in_zones absent or empty.
        if where == _HOME:
            return state == _HOME
        label = snapshot.zone_labels.get(where)
        if label is None:
            return None  # unknown zone -> unobservable
        return state == label

    @classmethod
    def _is_home(cls, state: str, in_zones: list[str] | None) -> bool:
        """Whether a person is home. Unobservable (unavailable/unknown) states
        are never counted home, mirroring `_loc_match`. Otherwise prefers a
        NON-EMPTY `in_zones` over `state`; an absent (None) or empty ([]) list
        defers to `state` — see `_loc_match` for why an empty list must not be
        read as "in no zone"."""
        if state in UNAVAILABLE:
            return False
        if in_zones:
            return "zone.home" in in_zones
        return state == _HOME

    @staticmethod
    def _holds_at(
        at: bool,
        changed: datetime,
        now: datetime,
        *,
        want_at: bool,
        negate: bool,
        seconds: float,
        mode: str | None = None,
    ) -> bool:
        """Apply negate/want_at/`for` to an observable location test `at`.

        NOTE: this is the LEGACY/fallback clock, used only when no engine tenure
        is attached to the snapshot (the simulator and direct callers). It uses
        per-person `last_changed`, which advances on STATE changes only — so here
        `for` means "in the current exact state that long". The engine path
        (see `matches`/`gate_states`) instead tracks predicate tenure, which
        survives a person moving between two away zones (zone A → zone B).

        `mode` only changes the elapsed comparator: "less_than" gates on
        elapsed < seconds (boundary exclusive), otherwise the default
        "at_least" gates on elapsed >= seconds. The negate/want_at handling is
        unchanged.
        """
        if negate:  # "not at <where>" -> invert the observable location test
            at = not at
        if at is not want_at:
            return False
        if seconds <= 0:
            return True
        return for_elapsed_satisfied((now - changed).total_seconds(), seconds, mode)

    def describe(self, snapshot: PeopleSnapshot, predicate: Any = None) -> str | None:
        # No predicate: whole-snapshot summary (used by `snapshots_described`).
        if predicate is None:
            return self._describe_snapshot(snapshot)
        if not isinstance(predicate, dict):
            return None
        pred = _norm(predicate)
        who = pred.get("who") or []
        quant = pred["quant"]
        where = pred["where"]
        negate = pred["negate"]
        seconds = dur_seconds(pred.get("for"))
        mode = pred["for_mode"]
        # Empty `who` means "all persons" (a real constraint, unlike occupancy's
        # empty `sensors` wildcard), so enumerate the snapshot's persons.
        person_ids = list(who) if who else list(snapshot.persons)
        if not person_ids:
            return "no people tracked"
        want_at = quant != "nobody"
        # In tenure mode the per-person marks show the *instant* location test
        # (seconds=0); how long the predicate as a whole has held is summarised
        # once in the prefix, off the engine tenure map.
        tenure_mode = seconds > 0 and snapshot.tenure is not None
        per_person_seconds = 0.0 if tenure_mode else seconds
        parts: list[str] = []
        for pid in person_ids:
            name = snapshot.names.get(pid, pid)
            cur = snapshot.persons.get(pid)
            if cur is None:  # person referenced but has no state → does not exist
                parts.append(f"{name}: not found ✗")
                continue
            at = self._loc_match(cur[0], snapshot.in_zones.get(pid), where, snapshot)
            if at is None:  # present but unavailable / unknown zone
                parts.append(f"{name}: unavailable ✗")
                continue
            held = self._holds_at(
                at,
                cur[1],
                snapshot.now,
                want_at=want_at,
                negate=negate,
                seconds=per_person_seconds,
                mode=mode,
            )
            loc = self._loc_word(at, where, snapshot)
            # In the legacy clock, show how long each person has held this
            # location so a recently-arrived person's ✗ is self-explanatory.
            elapsed = (
                f" {fmt_duration((snapshot.now - cur[1]).total_seconds())}"
                if seconds and not tenure_mode
                else ""
            )
            parts.append(f"{name}: {loc}{elapsed} {'✓' if held else '✗'}")
        prefix = f"want {self._quant_word(quant)} {self._where_word(where, negate, snapshot)}"
        if seconds:
            rel = for_comparator_symbol(mode)
            prefix += f" for {rel}{fmt_duration(seconds)}"
        if tenure_mode:
            since = snapshot.tenure.get(self._gate_key(pred))
            prefix += (
                f" (held {fmt_duration((snapshot.now - since).total_seconds())})"
                if since
                else " (not held)"
            )
        return f"{prefix}: {', '.join(parts)}"

    @staticmethod
    def _quant_word(quant: str) -> str:
        return {"any": "anyone", "everyone": "everyone", "nobody": "nobody"}.get(quant, "anyone")

    @staticmethod
    def _where_word(where: str, negate: bool, snapshot: PeopleSnapshot) -> str:
        base = "home" if where == _HOME else f"in {snapshot.zone_labels.get(where, where)}"
        return f"not {base}" if negate else base

    @staticmethod
    def _loc_word(at: bool, where: str, snapshot: PeopleSnapshot) -> str:
        if where == _HOME:
            return "home" if at else "away"
        label = snapshot.zone_labels.get(where, where)
        return f"in {label}" if at else f"not in {label}"

    def _describe_snapshot(self, snapshot: PeopleSnapshot) -> str | None:
        if not snapshot.persons:
            return "no people tracked"
        total = len(snapshot.persons)
        home = sorted(
            snapshot.names.get(pid, pid)
            for pid, (state, _) in snapshot.persons.items()
            if self._is_home(state, snapshot.in_zones.get(pid))
        )
        if home:
            return f"{len(home)} of {total} home ({', '.join(home)})"
        return f"0 of {total} home"

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise AmbienceError("people_predicate_not_object")
        who = predicate.get("who")
        if who is not None:
            if isinstance(who, list) and not who:
                # Present-but-empty = "specific mode, nobody picked" (incomplete).
                # Omit `who` entirely to mean all tracked persons; this keeps the
                # backend in step with the editor, which flags an empty selection.
                raise AmbienceError("people_who_empty")
            validate_entity_ids(who, "person", key="people_who_not_list")
        quant = predicate.get("quant")
        if quant is not None and quant not in _QUANTS:
            raise AmbienceError("quant_invalid", quants=list(_QUANTS), value=quant)
        where = predicate.get("where")
        if where is not None and where != _HOME:
            validate_entity_ids([where], "zone", key="people_where_invalid")
        negate = predicate.get("negate")
        if negate is not None and not isinstance(negate, bool):
            raise AmbienceError("negate_invalid", value=negate)
        validate_for(predicate.get("for"))
        validate_for_mode(predicate.get("for_mode"))

    # --- sorting (containment lattice) ----------------------------------
    # No `order_key`: there is no meaningful total order among people
    # predicates, so constrained scenes tie within this slot — but a scene that
    # constrains people still sorts ahead of one that leaves it a wildcard (the
    # slot is ranked by this condition's high priority). `contains` is this
    # condition's only intra-slot sorting contribution.

    def contains(self, outer: Any, inner: Any) -> bool:
        """True iff every world-state matching `inner` also matches `outer`
        (inner's match-set ⊆ outer's). Conservative: unprovable -> False."""
        if not isinstance(outer, dict) or not isinstance(inner, dict):
            return False
        o, i = _norm(outer), _norm(inner)
        # Comparable only when the positive location AND the negate flag match:
        # a different `negate` is a different (disjoint) match-set.
        if o["where"] != i["where"]:
            return False
        if o["negate"] != i["negate"]:
            return False
        # The `for`/`for_mode` duration axis must permit inner ⊆ outer
        # (at_least: longer is stricter; less_than: shorter is stricter).
        if not for_contains(o, i):
            return False
        qo = o["quant"]
        qi = i["quant"]
        so = self._who_set(o.get("who"))
        si = self._who_set(i.get("who"))
        if qo == "any" and qi == "any":
            return self._subset(si, so)
        if qo == "everyone" and qi == "everyone":
            return self._subset(so, si)
        if qo == "nobody" and qi == "nobody":
            return self._subset(so, si)
        if qo == "any" and qi == "everyone":
            return self._intersects(si, so)
        # All other quant pairs: no provable containment (stay conservative).
        return False

    @staticmethod
    def _who_set(who: Any) -> frozenset[str] | None:
        """A person set, or None meaning ALL (superset of every explicit set)."""
        if not who:
            return None
        return frozenset(who)

    @staticmethod
    def _subset(a: frozenset[str] | None, b: frozenset[str] | None) -> bool:
        """a ⊆ b, where None = ALL (the universe)."""
        if b is None:
            return True  # everything ⊆ ALL
        if a is None:
            return False  # ALL ⊆ explicit (b not None) -> only if a were ALL
        return a <= b

    @staticmethod
    def _intersects(a: frozenset[str] | None, b: frozenset[str] | None) -> bool:
        """Non-empty intersection; None = ALL (intersects any non-empty set)."""
        if a is None or b is None:
            return True
        return bool(a & b)
