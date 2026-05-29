"""PeopleMatcher — who is home / away / in a zone, with optional `for`."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.matchers.people import PeopleMatcher, PeopleSnapshot


def _snap(
    persons: dict[str, tuple[str, datetime]] | None = None,
    now: datetime | None = None,
    names: dict[str, str] | None = None,
    zone_labels: dict[str, str] | None = None,
) -> PeopleSnapshot:
    return PeopleSnapshot(
        now=now or datetime(2026, 5, 25, 12, 0, tzinfo=UTC),
        persons=persons or {},
        names=names or {},
        zone_labels=zone_labels or {},
    )


def test_protocol_fields() -> None:
    m = PeopleMatcher()
    assert m.name == "people"
    assert m.input == "people_predicate"
    assert m.priority == 75
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


async def test_snapshot_captures_persons_names_and_zones(hass: HomeAssistant) -> None:
    hass.states.async_set("person.alice", "home", {"friendly_name": "Alice"})
    hass.states.async_set("person.bob", "not_home", {"friendly_name": "Bob"})
    hass.states.async_set("zone.home", "1", {"friendly_name": "Home"})
    hass.states.async_set("zone.work", "0", {"friendly_name": "Work"})
    snap = await PeopleMatcher().snapshot(hass)
    assert snap.persons["person.alice"][0] == "home"
    assert isinstance(snap.persons["person.alice"][1], datetime)
    assert snap.names["person.alice"] == "Alice"
    assert snap.zone_labels["zone.home"] == "home"
    assert snap.zone_labels["zone.work"] == "Work"
    assert "person.alice" in snap.persons and "zone.work" not in snap.persons
