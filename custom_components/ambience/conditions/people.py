"""PeopleCondition — who is (not) at home / in a zone, with optional `for`."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..triggers import EMPTY, TriggerSpec
from ._common import UNAVAILABLE, dur_seconds, fmt_duration, validate_for

_HOME = "home"
_QUANTS = ("any", "everyone", "nobody")


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
    # when the attribute is absent (e.g. router/non-GPS trackers). Zones can
    # overlap, so this can name several zones at once where `state` resolves to
    # only one. Preferred over `state` for location matching.
    in_zones: dict[str, list[str] | None] = field(default_factory=dict)


class PeopleCondition:
    """Match on who is (not) at home / in a named zone.

    Predicate (scoped quantifier):
      {who: [person.*]? (empty/absent = all persons),
       quant: 'any'|'everyone'|'nobody' (default 'any'),
       where: 'home'|'zone.*' (default 'home'),  # the POSITIVE location
       negate: bool? (default false),            # true = NOT at `where`
       for?: {h,m,s}}

    `None` = vacuous true (no constraint).
    """

    name = "people"
    description = "Matches who is (not) at home or in a named zone."
    predicate_help = (
        "{who: [person.*] (empty = all persons), quant: 'any'|'everyone'|"
        "'nobody', where: 'home'|'zone.*', negate?: bool, for?: {h,m,s}}. "
        "None = match-anything."
    )
    input = "people_predicate"
    # Between state (950) and day (900): a moderately specific world-fact.
    priority = 925

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
        who = predicate.get("who") or []
        quant = predicate.get("quant") or "any"
        where = predicate.get("where") or _HOME
        negate = bool(predicate.get("negate"))
        seconds = dur_seconds(predicate.get("for"))

        person_ids = list(who) if who else list(snapshot.persons)

        def holds(pid: str, want_at: bool) -> bool:
            cur = snapshot.persons.get(pid)
            if cur is None:
                return False  # named but absent -> unobservable
            state, changed = cur
            at = self._loc_match(state, snapshot.in_zones.get(pid), where, snapshot)
            if at is None:  # unobservable (unavailable / unknown zone)
                return False
            return self._holds_at(
                at, changed, snapshot.now, want_at=want_at, negate=negate, seconds=seconds
            )

        if quant == "everyone":
            return bool(person_ids) and all(holds(p, True) for p in person_ids)
        if quant == "nobody":
            return all(holds(p, False) for p in person_ids)
        # "any" (default)
        return any(holds(p, True) for p in person_ids)

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        if not isinstance(predicate, dict):
            return EMPTY
        who = predicate.get("who") or []
        # Empty/absent `who` means "all persons": enumerate the current person.*
        # entities the same way snapshot() does.
        persons = [p for p in who if isinstance(p, str) and p] if who else self._all_person_ids()
        seconds = dur_seconds(predicate.get("for"))
        durations = frozenset((p, seconds) for p in persons) if seconds > 0 else frozenset()
        return TriggerSpec(entities=frozenset(persons), entity_durations=durations)

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

        True/False if observable, None if unobservable. Prefers the `in_zones`
        attribute (handles overlapping zones); falls back to `state` when the
        attribute is absent. `where`: 'home' or a 'zone.*' id. Caller applies
        any `negate` inversion.
        """
        if state in UNAVAILABLE:
            return None  # unobservable
        if in_zones is not None:
            # Attribute present: authoritative membership (overlaps included).
            return cls._target_zone(where) in in_zones
        # Fallback to state (e.g. router/non-GPS trackers, no in_zones).
        if where == _HOME:
            return state == _HOME
        label = snapshot.zone_labels.get(where)
        if label is None:
            return None  # unknown zone -> unobservable
        return state == label

    @classmethod
    def _is_home(cls, state: str, in_zones: list[str] | None) -> bool:
        """Whether a person is home, preferring `in_zones` over `state`."""
        if in_zones is not None:
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
    ) -> bool:
        """Apply negate/want_at/`for` to an observable location test `at`.

        NOTE: the `for` clock uses `last_changed`, which advances on STATE
        changes only. Because zones can overlap, entering/leaving an overlapping
        zone can change `in_zones` without changing `state` (the resolved zone
        stays the same), so a zone-membership `for` is approximate in that edge
        case. We do not track history.
        """
        if negate:  # "not at <where>" -> invert the observable location test
            at = not at
        if at is not want_at:
            return False
        return not (seconds > 0 and (now - changed).total_seconds() < seconds)

    def describe(self, snapshot: PeopleSnapshot, predicate: Any = None) -> str | None:
        # No predicate: whole-snapshot summary (used by `snapshots_described`).
        if predicate is None:
            return self._describe_snapshot(snapshot)
        if not isinstance(predicate, dict):
            return None
        who = predicate.get("who") or []
        quant = predicate.get("quant") or "any"
        where = predicate.get("where") or _HOME
        negate = bool(predicate.get("negate"))
        seconds = dur_seconds(predicate.get("for"))
        # Empty `who` means "all persons" (a real constraint, unlike occupancy's
        # empty `sensors` wildcard), so enumerate the snapshot's persons.
        person_ids = list(who) if who else list(snapshot.persons)
        if not person_ids:
            return "no people tracked"
        want_at = quant != "nobody"
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
                at, cur[1], snapshot.now, want_at=want_at, negate=negate, seconds=seconds
            )
            loc = self._loc_word(at, where, snapshot)
            # With a `for` gate, show how long they've held this location so a
            # recently-arrived person's ✗ is self-explanatory.
            elapsed = f" {fmt_duration((snapshot.now - cur[1]).total_seconds())}" if seconds else ""
            parts.append(f"{name}: {loc}{elapsed} {'✓' if held else '✗'}")
        prefix = f"want {self._quant_word(quant)} {self._where_word(where, negate, snapshot)}"
        if seconds:
            prefix += f" for ≥{fmt_duration(seconds)}"
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
            raise ValueError("people predicate must be a dict")
        who = predicate.get("who")
        if who is not None:
            if not isinstance(who, list):
                raise ValueError("`who` must be a list of person entity_ids")
            for p in who:
                if not isinstance(p, str) or not p.startswith("person."):
                    raise ValueError(f"`who` entries must be person.* entity_ids, got {p!r}")
        quant = predicate.get("quant")
        if quant is not None and quant not in _QUANTS:
            raise ValueError(f"`quant` must be one of {_QUANTS}, got {quant!r}")
        where = predicate.get("where")
        if where is not None and (
            not isinstance(where, str) or (where != _HOME and not where.startswith("zone."))
        ):
            raise ValueError(f"`where` must be 'home' or a zone.* id, got {where!r}")
        negate = predicate.get("negate")
        if negate is not None and not isinstance(negate, bool):
            raise ValueError(f"`negate` must be a bool, got {negate!r}")
        validate_for(predicate.get("for"))

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
        # Comparable only when the positive location AND the negate flag match:
        # a different `negate` is a different (disjoint) match-set.
        if (outer.get("where") or _HOME) != (inner.get("where") or _HOME):
            return False
        if bool(outer.get("negate")) != bool(inner.get("negate")):
            return False
        # inner must hold at least as long as outer (longer for = more specific).
        if dur_seconds(inner.get("for")) < dur_seconds(outer.get("for")):
            return False
        qo = outer.get("quant") or "any"
        qi = inner.get("quant") or "any"
        so = self._who_set(outer.get("who"))
        si = self._who_set(inner.get("who"))
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
