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

    def matches(self, predicate: Any, snapshot: PeopleSnapshot) -> bool:  # noqa: ARG002
        return True

    def describe(self, snapshot: PeopleSnapshot) -> str | None:  # noqa: ARG002
        return None

    def validate_predicate(self, predicate: Any) -> None:
        return None

    @staticmethod
    def _dur_seconds(dur: Any) -> float:
        if not isinstance(dur, dict):
            return 0.0
        h = dur.get("h") or 0
        m = dur.get("m") or 0
        s = dur.get("s") or 0
        return float(h) * 3600 + float(m) * 60 + float(s)
