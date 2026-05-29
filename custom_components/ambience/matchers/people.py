"""PeopleMatcher — who is home / away / in a zone, with optional `for`."""

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
    # (home zone -> "home"; others -> friendly name).
    zone_labels: dict[str, str] = field(default_factory=dict)


class PeopleMatcher:
    """Match on who is home / away / in a named zone.

    Predicate (scoped quantifier):
      {who: [person.*]? (empty/absent = all persons),
       quant: 'any'|'everyone'|'nobody' (default 'any'),
       where: 'home'|'away'|'zone.*' (default 'home'),
       for?: {h,m,s}}

    `None` = vacuous true (no constraint).
    """

    name = "people"
    description = "Matches who is home, away, or in a named zone."
    predicate_help = (
        "{who: [person.*] (empty = all persons), quant: 'any'|'everyone'|"
        "'nobody', where: 'home'|'away'|'zone.*', for?: {h,m,s}}. "
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
        for s in hass.states.async_all("person"):
            persons[s.entity_id] = (s.state, s.last_changed)
            names[s.entity_id] = s.attributes.get("friendly_name") or s.entity_id
        zone_labels: dict[str, str] = {}
        for z in hass.states.async_all("zone"):
            friendly = z.attributes.get("friendly_name") or z.entity_id
            zone_labels[z.entity_id] = _HOME if z.entity_id == "zone.home" else friendly
        return PeopleSnapshot(
            now=dt_util.utcnow(), persons=persons, names=names, zone_labels=zone_labels
        )

    def matches(self, predicate: Any, snapshot: PeopleSnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        who = predicate.get("who") or []
        quant = predicate.get("quant") or "any"
        where = predicate.get("where") or _HOME
        seconds = self._dur_seconds(predicate.get("for"))

        person_ids = list(who) if who else list(snapshot.persons)

        def holds(pid: str, want_at: bool) -> bool:
            cur = snapshot.persons.get(pid)
            if cur is None:
                return False  # named but absent -> unobservable
            state, changed = cur
            at = self._at_where(state, where, snapshot)
            if at is None:  # unobservable (unavailable / unknown zone)
                return False
            if at is not want_at:
                return False
            if seconds > 0 and (snapshot.now - changed).total_seconds() < seconds:
                return False
            return True

        if quant == "everyone":
            return bool(person_ids) and all(holds(p, True) for p in person_ids)
        if quant == "nobody":
            return all(holds(p, False) for p in person_ids)
        # "any" (default)
        return any(holds(p, True) for p in person_ids)

    @staticmethod
    def _at_where(state: str, where: str, snapshot: PeopleSnapshot) -> bool | None:
        """True/False if observable, None if unobservable.

        `where`: 'home' -> state == 'home'; 'away' -> state != 'home';
        'zone.*' -> state == that zone's label.
        """
        if state in _UNAVAILABLE:
            return None
        if where == _HOME:
            return state == _HOME
        if where == "away":
            return state != _HOME
        label = snapshot.zone_labels.get(where)
        if label is None:
            return None
        return state == label

    def describe(self, snapshot: PeopleSnapshot) -> str | None:
        if not snapshot.persons:
            return "no people tracked"
        total = len(snapshot.persons)
        home = sorted(
            snapshot.names.get(pid, pid)
            for pid, (state, _) in snapshot.persons.items()
            if state == _HOME
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
        if where is not None:
            if not isinstance(where, str) or (
                where not in (_HOME, "away") and not where.startswith("zone.")
            ):
                raise ValueError(
                    f"`where` must be 'home', 'away', or a zone.* id, got {where!r}"
                )
        dur = predicate.get("for")
        if dur is not None:
            if not isinstance(dur, dict):
                raise ValueError("`for` must be a dict {h,m,s} or null")
            for k in ("h", "m", "s"):
                v = dur.get(k, 0)
                if not isinstance(v, int) or isinstance(v, bool) or v < 0:
                    raise ValueError(f"`for.{k}` must be a non-negative int")

    # --- sorting (containment lattice) ----------------------------------

    def contains(self, outer: Any, inner: Any) -> bool:
        """True iff every world-state matching `inner` also matches `outer`
        (inner's match-set ⊆ outer's). Conservative: unprovable -> False."""
        if not isinstance(outer, dict) or not isinstance(inner, dict):
            return False
        if (outer.get("where") or _HOME) != (inner.get("where") or _HOME):
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
