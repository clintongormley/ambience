"""PeopleMatcher — who is (not) at home / in a zone, with optional `for`."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

_UNAVAILABLE = {"unavailable", "unknown"}
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


class PeopleMatcher:
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
    # Between state (50) and day (100): a moderately specific world-fact.
    priority = 75

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    async def snapshot(self, hass: HomeAssistant) -> PeopleSnapshot:
        persons: dict[str, tuple[str, datetime]] = {}
        names: dict[str, str] = {}
        in_zones: dict[str, list[str] | None] = {}
        for s in hass.states.async_all("person"):
            persons[s.entity_id] = (s.state, s.last_changed)
            names[s.entity_id] = s.attributes.get("friendly_name") or s.entity_id
            raw = s.attributes.get("in_zones")
            in_zones[s.entity_id] = [str(z) for z in raw] if raw is not None else None
        zone_labels: dict[str, str] = {}
        for z in hass.states.async_all("zone"):
            friendly = z.attributes.get("friendly_name") or z.entity_id
            zone_labels[z.entity_id] = _HOME if z.entity_id == "zone.home" else friendly
        return PeopleSnapshot(
            now=dt_util.utcnow(),
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
        seconds = self._dur_seconds(predicate.get("for"))

        person_ids = list(who) if who else list(snapshot.persons)

        def holds(pid: str, want_at: bool) -> bool:
            cur = snapshot.persons.get(pid)
            if cur is None:
                return False  # named but absent -> unobservable
            state, changed = cur
            at = self._loc_match(state, snapshot.in_zones.get(pid), where, snapshot)
            if at is None:  # unobservable (unavailable / unknown zone)
                return False
            if negate:  # "not at <where>" -> invert the observable location test
                at = not at
            if at is not want_at:
                return False
            # NOTE: the `for` clock uses `last_changed`, which advances on STATE
            # changes only. Because zones can overlap, entering/leaving an
            # overlapping zone can change `in_zones` without changing `state`
            # (the resolved zone stays the same), so a zone-membership `for` is
            # approximate in that edge case. Same class of caveat as the
            # last_changed-vs-last_updated note above; we do not track history.
            return not (seconds > 0 and (snapshot.now - changed).total_seconds() < seconds)

        if quant == "everyone":
            return bool(person_ids) and all(holds(p, True) for p in person_ids)
        if quant == "nobody":
            return all(holds(p, False) for p in person_ids)
        # "any" (default)
        return any(holds(p, True) for p in person_ids)

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
        if state in _UNAVAILABLE:
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

    def describe(self, snapshot: PeopleSnapshot) -> str | None:
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
        dur = predicate.get("for")
        if dur is not None:
            if not isinstance(dur, dict):
                raise ValueError("`for` must be a dict {h,m,s} or null")
            for k in ("h", "m", "s"):
                v = dur.get(k, 0)
                if not isinstance(v, int) or isinstance(v, bool) or v < 0:
                    raise ValueError(f"`for.{k}` must be a non-negative int")

    # --- sorting (containment lattice) ----------------------------------
    # No `order_key`: there is no meaningful total order among people
    # predicates for the linearisation tiebreaker, so that slot falls back to
    # "sorts last". `contains` is this matcher's only sorting contribution.

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
        if self._dur_seconds(inner.get("for")) < self._dur_seconds(outer.get("for")):
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

    @staticmethod
    def _dur_seconds(dur: Any) -> float:
        if not isinstance(dur, dict):
            return 0.0
        h = dur.get("h") or 0
        m = dur.get("m") or 0
        s = dur.get("s") or 0
        return float(h) * 3600 + float(m) * 60 + float(s)
