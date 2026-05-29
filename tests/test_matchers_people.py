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


def _p(state: str) -> tuple[str, datetime]:
    return (state, datetime(2026, 5, 25, 11, 0, tzinfo=UTC))


def test_matches_none_predicate_is_true() -> None:
    assert PeopleMatcher().matches(None, _snap()) is True


def test_matches_any_home() -> None:
    m = PeopleMatcher()
    snap = _snap({"person.a": _p("home"), "person.b": _p("not_home")})
    assert m.matches({"quant": "any", "where": "home"}, snap) is True
    snap2 = _snap({"person.a": _p("not_home"), "person.b": _p("not_home")})
    assert m.matches({"quant": "any", "where": "home"}, snap2) is False


def test_matches_everyone_home() -> None:
    m = PeopleMatcher()
    snap = _snap({"person.a": _p("home"), "person.b": _p("home")})
    assert m.matches({"quant": "everyone", "where": "home"}, snap) is True
    snap2 = _snap({"person.a": _p("home"), "person.b": _p("not_home")})
    assert m.matches({"quant": "everyone", "where": "home"}, snap2) is False


def test_matches_nobody_home() -> None:
    m = PeopleMatcher()
    snap = _snap({"person.a": _p("not_home"), "person.b": _p("work")})
    assert m.matches({"quant": "nobody", "where": "home"}, snap) is True
    snap2 = _snap({"person.a": _p("home"), "person.b": _p("not_home")})
    assert m.matches({"quant": "nobody", "where": "home"}, snap2) is False


def test_matches_default_quant_is_any_and_default_where_is_home() -> None:
    m = PeopleMatcher()
    snap = _snap({"person.a": _p("home")})
    assert m.matches({}, snap) is True


def test_matches_who_subset() -> None:
    m = PeopleMatcher()
    snap = _snap({"person.a": _p("home"), "person.b": _p("not_home")})
    # everyone of {a} home -> True; everyone of {a,b} home -> False
    assert m.matches({"who": ["person.a"], "quant": "everyone", "where": "home"}, snap) is True
    assert (
        m.matches({"who": ["person.a", "person.b"], "quant": "everyone", "where": "home"}, snap)
        is False
    )


def test_matches_who_names_absent_person_is_unobservable() -> None:
    m = PeopleMatcher()
    snap = _snap({"person.a": _p("home")})
    # everyone of {a, ghost} -> ghost unobservable -> False
    assert (
        m.matches({"who": ["person.a", "person.ghost"], "quant": "everyone", "where": "home"}, snap)
        is False
    )
    # nobody of {ghost} home -> can't confirm -> False
    assert m.matches({"who": ["person.ghost"], "quant": "nobody", "where": "home"}, snap) is False


def test_matches_away_includes_other_zones() -> None:
    m = PeopleMatcher()
    snap = _snap({"person.a": _p("work")})
    assert m.matches({"quant": "any", "where": "away"}, snap) is True
    snap2 = _snap({"person.a": _p("home")})
    assert m.matches({"quant": "any", "where": "away"}, snap2) is False


def test_matches_zone_by_label() -> None:
    m = PeopleMatcher()
    snap = _snap({"person.a": _p("Work")}, zone_labels={"zone.work": "Work"})
    assert m.matches({"who": ["person.a"], "where": "zone.work"}, snap) is True
    # unknown zone in predicate -> no label -> False
    assert m.matches({"who": ["person.a"], "where": "zone.ghost"}, snap) is False


def test_matches_unavailable_person_excluded() -> None:
    m = PeopleMatcher()
    snap = _snap({"person.a": _p("unavailable"), "person.b": _p("home")})
    # any home -> b counts -> True
    assert m.matches({"quant": "any", "where": "home"}, snap) is True
    # everyone home -> a unobservable -> False
    assert m.matches({"quant": "everyone", "where": "home"}, snap) is False


def test_matches_malformed_is_false() -> None:
    m = PeopleMatcher()
    assert m.matches(42, _snap()) is False
    assert m.matches("home", _snap()) is False


def test_matches_empty_household() -> None:
    m = PeopleMatcher()
    snap = _snap({})
    assert m.matches({"quant": "any", "where": "home"}, snap) is False
    assert m.matches({"quant": "everyone", "where": "home"}, snap) is False
    assert m.matches({"quant": "nobody", "where": "home"}, snap) is True
