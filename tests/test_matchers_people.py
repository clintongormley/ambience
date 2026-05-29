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


def test_matches_for_duration_met_any() -> None:
    m = PeopleMatcher()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    snap = _snap({"person.a": ("home", now - timedelta(minutes=10))}, now=now)
    pred = {"quant": "any", "where": "home", "for": {"h": 0, "m": 5, "s": 0}}
    assert m.matches(pred, snap) is True


def test_matches_for_duration_not_yet_any() -> None:
    m = PeopleMatcher()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    snap = _snap({"person.a": ("home", now - timedelta(minutes=1))}, now=now)
    pred = {"quant": "any", "where": "home", "for": {"h": 0, "m": 5, "s": 0}}
    assert m.matches(pred, snap) is False


def test_matches_for_duration_nobody_uses_away_clock() -> None:
    m = PeopleMatcher()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    # a left home 10m ago (not_home since then) -> nobody home for 5m holds
    snap = _snap({"person.a": ("not_home", now - timedelta(minutes=10))}, now=now)
    pred = {"quant": "nobody", "where": "home", "for": {"h": 0, "m": 5, "s": 0}}
    assert m.matches(pred, snap) is True
    # only 1m since leaving -> not yet
    snap2 = _snap({"person.a": ("not_home", now - timedelta(minutes=1))}, now=now)
    assert m.matches(pred, snap2) is False


def test_validate_accepts_none_and_valid() -> None:
    m = PeopleMatcher()
    m.validate_predicate(None)
    m.validate_predicate({})
    m.validate_predicate(
        {"who": ["person.a"], "quant": "everyone", "where": "home", "for": {"h": 0, "m": 5, "s": 0}}
    )
    m.validate_predicate({"where": "zone.work"})
    m.validate_predicate({"where": "away"})


def test_validate_rejects_non_dict() -> None:
    with pytest.raises(ValueError):
        PeopleMatcher().validate_predicate(42)


def test_validate_rejects_bad_who() -> None:
    m = PeopleMatcher()
    with pytest.raises(ValueError, match="who"):
        m.validate_predicate({"who": "person.a"})
    with pytest.raises(ValueError, match="person"):
        m.validate_predicate({"who": ["light.x"]})


def test_validate_rejects_bad_quant() -> None:
    with pytest.raises(ValueError, match="quant"):
        PeopleMatcher().validate_predicate({"quant": "some"})


def test_validate_rejects_bad_where() -> None:
    m = PeopleMatcher()
    with pytest.raises(ValueError, match="where"):
        m.validate_predicate({"where": "office"})
    with pytest.raises(ValueError, match="where"):
        m.validate_predicate({"where": 5})


def test_validate_rejects_bad_for() -> None:
    m = PeopleMatcher()
    with pytest.raises(ValueError, match="for"):
        m.validate_predicate({"for": {"h": -1, "m": 0, "s": 0}})
    with pytest.raises(ValueError, match="for"):
        m.validate_predicate({"for": {"h": 0, "m": "five", "s": 0}})


def test_describe_summarises_home_count() -> None:
    m = PeopleMatcher()
    snap = _snap(
        {"person.a": _p("home"), "person.b": _p("not_home"), "person.c": _p("home")},
        names={"person.a": "Alice", "person.b": "Bob", "person.c": "Cara"},
    )
    assert m.describe(snap) == "2 of 3 home (Alice, Cara)"


def test_describe_none_home() -> None:
    m = PeopleMatcher()
    snap = _snap({"person.a": _p("not_home")}, names={"person.a": "Alice"})
    assert m.describe(snap) == "0 of 1 home"


def test_describe_empty() -> None:
    assert PeopleMatcher().describe(_snap()) == "no people tracked"


# contains(outer, inner) -> True iff every state matching inner also matches outer
# (inner's match-set is a subset of outer's).


def test_contains_everyone_subset_of_any_same_set() -> None:
    m = PeopleMatcher()
    inner = {"quant": "everyone", "where": "home"}
    outer = {"quant": "any", "where": "home"}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_any_smaller_set_subset_of_bigger() -> None:
    m = PeopleMatcher()
    inner = {"who": ["person.a"], "quant": "any", "where": "home"}
    outer = {"who": ["person.a", "person.b"], "quant": "any", "where": "home"}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_everyone_bigger_set_subset_of_smaller() -> None:
    m = PeopleMatcher()
    inner = {"who": ["person.a", "person.b"], "quant": "everyone", "where": "home"}
    outer = {"who": ["person.a"], "quant": "everyone", "where": "home"}
    assert m.contains(outer, inner) is True


def test_contains_nobody_bigger_set_subset_of_smaller() -> None:
    m = PeopleMatcher()
    inner = {"who": ["person.a", "person.b"], "quant": "nobody", "where": "home"}
    outer = {"who": ["person.a"], "quant": "nobody", "where": "home"}
    assert m.contains(outer, inner) is True


def test_contains_nobody_disjoint_from_any() -> None:
    m = PeopleMatcher()
    a = {"quant": "nobody", "where": "home"}
    b = {"quant": "any", "where": "home"}
    assert m.contains(a, b) is False
    assert m.contains(b, a) is False


def test_contains_different_where_is_false() -> None:
    m = PeopleMatcher()
    inner = {"quant": "everyone", "where": "home"}
    outer = {"quant": "any", "where": "away"}
    assert m.contains(outer, inner) is False


def test_contains_longer_for_is_subset() -> None:
    m = PeopleMatcher()
    inner = {"quant": "any", "where": "home", "for": {"h": 0, "m": 10, "s": 0}}
    outer = {"quant": "any", "where": "home", "for": {"h": 0, "m": 5, "s": 0}}
    assert m.contains(outer, inner) is True  # held 10m ⊆ held 5m
    assert m.contains(inner, outer) is False


def test_contains_empty_who_is_all_superset() -> None:
    m = PeopleMatcher()
    # any over explicit ⊆ any over ALL
    assert m.contains({"quant": "any", "where": "home"},
                      {"who": ["person.a"], "quant": "any", "where": "home"}) is True
    # everyone over ALL ⊆ everyone over explicit
    assert m.contains({"who": ["person.a"], "quant": "everyone", "where": "home"},
                      {"quant": "everyone", "where": "home"}) is True


def test_contains_everyone_inner_any_outer_requires_intersection() -> None:
    m = PeopleMatcher()
    inner = {"who": ["person.a"], "quant": "everyone", "where": "home"}
    outer = {"who": ["person.a", "person.c"], "quant": "any", "where": "home"}
    assert m.contains(outer, inner) is True  # a ∈ both
    disjoint_outer = {"who": ["person.c"], "quant": "any", "where": "home"}
    assert m.contains(disjoint_outer, inner) is False


def test_contains_non_dict_is_false() -> None:
    m = PeopleMatcher()
    assert m.contains(None, {"quant": "any"}) is False
    assert m.contains({"quant": "any"}, 5) is False
