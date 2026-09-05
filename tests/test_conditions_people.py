"""PeopleCondition — who is home / away / in a zone, with optional `for`."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.people import PeopleCondition, PeopleSnapshot
from custom_components.ambience.triggers import DurationGate


def _snap(
    persons: dict[str, tuple[str, datetime]] | None = None,
    now: datetime | None = None,
    names: dict[str, str] | None = None,
    zone_labels: dict[str, str] | None = None,
    in_zones: dict[str, list[str] | None] | None = None,
    tenure: dict[str, datetime] | None = None,
) -> PeopleSnapshot:
    return PeopleSnapshot(
        now=now or datetime(2026, 5, 25, 12, 0, tzinfo=UTC),
        persons=persons or {},
        names=names or {},
        zone_labels=zone_labels or {},
        in_zones=in_zones or {},
        tenure=tenure,
    )


def test_protocol_fields() -> None:
    m = PeopleCondition()
    assert m.name == "people"
    assert m.input == "people_predicate"
    assert m.priority == 925
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


async def test_snapshot_captures_persons_names_and_zones(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "person.alice",
        "Work",
        {"friendly_name": "Alice", "in_zones": ["zone.work", "zone.home"]},
    )
    hass.states.async_set("person.bob", "not_home", {"friendly_name": "Bob"})
    hass.states.async_set("zone.home", "1", {"friendly_name": "Home"})
    hass.states.async_set("zone.work", "0", {"friendly_name": "Work"})
    snap = await PeopleCondition().snapshot(hass)
    assert snap.persons["person.alice"][0] == "Work"
    assert isinstance(snap.persons["person.alice"][1], datetime)
    assert snap.names["person.alice"] == "Alice"
    assert snap.zone_labels["zone.home"] == "home"
    assert snap.zone_labels["zone.work"] == "Work"
    assert "person.alice" in snap.persons and "zone.work" not in snap.persons


async def test_snapshot_captures_in_zones(hass: HomeAssistant) -> None:
    # HA reports in_zones as a list of zone entity_ids ("zone.work").
    hass.states.async_set("person.alice", "Work", {"in_zones": ["zone.work", "zone.home"]})
    hass.states.async_set("person.bob", "home")  # attribute absent
    snap = await PeopleCondition().snapshot(hass)
    assert snap.in_zones["person.alice"] == ["zone.work", "zone.home"]
    assert snap.in_zones["person.bob"] is None


async def test_snapshot_with_entities_captures_only_referenced_persons(
    hass: HomeAssistant,
) -> None:
    hass.states.async_set("person.alice", "home", {"friendly_name": "Alice"})
    hass.states.async_set("person.bob", "not_home", {"friendly_name": "Bob"})
    hass.states.async_set("zone.home", "1", {"friendly_name": "Home"})
    snap = await PeopleCondition().snapshot(hass, entities=frozenset({"person.alice"}))
    assert set(snap.persons) == {"person.alice"}
    assert "person.bob" not in snap.persons
    # Zones are not person-scoped — they stay fully captured for location matching.
    assert snap.zone_labels["zone.home"] == "home"


async def test_snapshot_with_entities_does_not_scan_person_domain(
    hass: HomeAssistant, monkeypatch
) -> None:
    hass.states.async_set("person.alice", "home")
    hass.states.async_set("zone.home", "1", {"friendly_name": "Home"})
    real_async_all = type(hass.states).async_all

    def _guard(self, domain=None, *args, **kwargs):
        # The person domain must be targeted directly; zone is still allowed.
        assert domain != "person", "snapshot must not scan the person domain when entities given"
        return real_async_all(self, domain, *args, **kwargs)

    monkeypatch.setattr(type(hass.states), "async_all", _guard)
    snap = await PeopleCondition().snapshot(hass, entities=frozenset({"person.alice"}))
    assert set(snap.persons) == {"person.alice"}


async def test_snapshot_with_entities_skips_missing_person(hass: HomeAssistant) -> None:
    hass.states.async_set("zone.home", "1", {"friendly_name": "Home"})
    snap = await PeopleCondition().snapshot(hass, entities=frozenset({"person.ghost"}))
    assert snap.persons == {}


def _p(state: str) -> tuple[str, datetime]:
    return (state, datetime(2026, 5, 25, 11, 0, tzinfo=UTC))


def test_matches_none_predicate_is_true() -> None:
    assert PeopleCondition().matches(None, _snap()) is True


def test_matches_any_home() -> None:
    m = PeopleCondition()
    snap = _snap({"person.a": _p("home"), "person.b": _p("not_home")})
    assert m.matches({"quant": "any", "where": "home"}, snap) is True
    snap2 = _snap({"person.a": _p("not_home"), "person.b": _p("not_home")})
    assert m.matches({"quant": "any", "where": "home"}, snap2) is False


def test_matches_everyone_home() -> None:
    m = PeopleCondition()
    snap = _snap({"person.a": _p("home"), "person.b": _p("home")})
    assert m.matches({"quant": "everyone", "where": "home"}, snap) is True
    snap2 = _snap({"person.a": _p("home"), "person.b": _p("not_home")})
    assert m.matches({"quant": "everyone", "where": "home"}, snap2) is False


def test_matches_nobody_home() -> None:
    m = PeopleCondition()
    snap = _snap({"person.a": _p("not_home"), "person.b": _p("work")})
    assert m.matches({"quant": "nobody", "where": "home"}, snap) is True
    snap2 = _snap({"person.a": _p("home"), "person.b": _p("not_home")})
    assert m.matches({"quant": "nobody", "where": "home"}, snap2) is False


def test_matches_default_quant_is_any_and_default_where_is_home() -> None:
    m = PeopleCondition()
    snap = _snap({"person.a": _p("home")})
    assert m.matches({}, snap) is True


def test_matches_who_subset() -> None:
    m = PeopleCondition()
    snap = _snap({"person.a": _p("home"), "person.b": _p("not_home")})
    # everyone of {a} home -> True; everyone of {a,b} home -> False
    assert m.matches({"who": ["person.a"], "quant": "everyone", "where": "home"}, snap) is True
    assert (
        m.matches({"who": ["person.a", "person.b"], "quant": "everyone", "where": "home"}, snap)
        is False
    )


def test_matches_who_names_absent_person_is_unobservable() -> None:
    m = PeopleCondition()
    snap = _snap({"person.a": _p("home")})
    # everyone of {a, ghost} -> ghost unobservable -> False
    assert (
        m.matches({"who": ["person.a", "person.ghost"], "quant": "everyone", "where": "home"}, snap)
        is False
    )
    # nobody of {ghost} home -> can't confirm -> False
    assert m.matches({"who": ["person.ghost"], "quant": "nobody", "where": "home"}, snap) is False


def test_matches_negate_home_includes_other_zones() -> None:
    m = PeopleCondition()
    # "not at home" — a person at Work (or not_home) is not at home -> matches.
    snap = _snap({"person.a": _p("work")})
    assert m.matches({"quant": "any", "where": "home", "negate": True}, snap) is True
    snap2 = _snap({"person.a": _p("not_home")})
    assert m.matches({"quant": "any", "where": "home", "negate": True}, snap2) is True
    # A person at home is NOT "not at home" -> no match.
    snap3 = _snap({"person.a": _p("home")})
    assert m.matches({"quant": "any", "where": "home", "negate": True}, snap3) is False


def test_matches_negate_zone() -> None:
    m = PeopleCondition()
    labels = {"zone.work": "Work"}
    # Not at Work: person at home matches "not at Work".
    snap = _snap({"person.a": _p("home")}, zone_labels=labels)
    assert m.matches({"quant": "any", "where": "zone.work", "negate": True}, snap) is True
    # At Work: does NOT match "not at Work".
    snap2 = _snap({"person.a": _p("Work")}, zone_labels=labels)
    assert m.matches({"quant": "any", "where": "zone.work", "negate": True}, snap2) is False


def test_matches_negate_unobservable_still_fails() -> None:
    m = PeopleCondition()
    # Unavailable -> unobservable -> fails even under negate (cannot confirm).
    snap = _snap({"person.a": _p("unavailable")})
    assert m.matches({"quant": "any", "where": "home", "negate": True}, snap) is False


def test_matches_negate_for_duration() -> None:
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    labels = {"zone.work": "Work"}
    # Person left Work 10m ago (home since) -> "not at Work for 5m" holds.
    snap = _snap({"person.a": ("home", now - timedelta(minutes=10))}, now=now, zone_labels=labels)
    pred = {"quant": "any", "where": "zone.work", "negate": True, "for": {"h": 0, "m": 5, "s": 0}}
    assert m.matches(pred, snap) is True
    # Only 1m in the not-at-Work state -> not yet.
    snap2 = _snap({"person.a": ("home", now - timedelta(minutes=1))}, now=now, zone_labels=labels)
    assert m.matches(pred, snap2) is False


def test_matches_zone_by_label() -> None:
    m = PeopleCondition()
    snap = _snap({"person.a": _p("Work")}, zone_labels={"zone.work": "Work"})
    assert m.matches({"who": ["person.a"], "where": "zone.work"}, snap) is True
    # unknown zone in predicate -> no label -> False
    assert m.matches({"who": ["person.a"], "where": "zone.ghost"}, snap) is False


# --- in_zones (overlapping zones) -----------------------------------------


def test_matches_in_zones_overlap_matches_both_zones() -> None:
    m = PeopleCondition()
    # Person resolves to "Work" by state, but in_zones says they're in BOTH
    # work and home (overlapping zones). They match home AND work.
    snap = _snap(
        {"person.a": _p("Work")},
        in_zones={"person.a": ["zone.work", "zone.home"]},
    )
    assert m.matches({"quant": "any", "where": "home"}, snap) is True
    assert m.matches({"quant": "any", "where": "zone.work"}, snap) is True
    # ...and "not at home" is therefore False for them.
    assert m.matches({"quant": "any", "where": "home", "negate": True}, snap) is False


def test_matches_in_zones_not_home() -> None:
    m = PeopleCondition()
    snap = _snap({"person.a": _p("Work")}, in_zones={"person.a": ["zone.work"]})
    assert m.matches({"quant": "any", "where": "home"}, snap) is False
    assert m.matches({"quant": "any", "where": "zone.work"}, snap) is True


def test_matches_in_zones_empty_falls_back_to_state_away() -> None:
    m = PeopleCondition()
    # in_zones=[] defers to `state` (see the scanner-source note below). Here
    # state="not_home", so an away person stays away — the safety guard proving
    # the empty-list fallback doesn't wrongly flip a genuinely-away person home.
    snap = _snap({"person.a": _p("not_home")}, in_zones={"person.a": []})
    assert m.matches({"quant": "any", "where": "home"}, snap) is False
    assert m.matches({"quant": "any", "where": "home", "negate": True}, snap) is True


def test_matches_in_zones_absent_falls_back_to_state() -> None:
    m = PeopleCondition()
    # No in_zones attribute (None) -> fall back to state matching.
    snap = _snap({"person.a": _p("home")}, in_zones={"person.a": None})
    assert m.matches({"quant": "any", "where": "home"}, snap) is True
    # zone fallback via label.
    snap2 = _snap(
        {"person.a": _p("Work")},
        in_zones={"person.a": None},
        zone_labels={"zone.work": "Work"},
    )
    assert m.matches({"quant": "any", "where": "zone.work"}, snap2) is True


def test_matches_in_zones_unavailable_still_unobservable() -> None:
    m = PeopleCondition()
    # Unavailable state is unobservable even if in_zones present/absent.
    snap = _snap({"person.a": _p("unavailable")}, in_zones={"person.a": []})
    assert m.matches({"quant": "any", "where": "home", "negate": True}, snap) is False


# --- scanner-sourced persons: empty in_zones falls back to state ----------
# HA populates `in_zones` only from GPS coordinates. A person tracked by a
# non-GPS presence scanner (router/ping/nmap/unifi/BLE) reports state "home"
# (or a zone name via location_name) but in_zones=[] (empty, NOT None). An
# empty list must therefore be treated as "no usable zone info" and fall back
# to `state` — otherwise a person who is home is read as away.


def test_matches_scanner_home_empty_in_zones_falls_back_to_state() -> None:
    m = PeopleCondition()
    # state="home" but in_zones=[] (a router/scanner-tracked person at home).
    snap = _snap({"person.a": _p("home")}, in_zones={"person.a": []})
    assert m.matches({"quant": "any", "where": "home"}, snap) is True
    # ...and "nobody home" must NOT fire while they are home (the dangerous case).
    assert m.matches({"quant": "nobody", "where": "home"}, snap) is False


def test_matches_scanner_named_zone_empty_in_zones_falls_back_to_state() -> None:
    m = PeopleCondition()
    # A scanner person in a named zone: state is the zone label, in_zones=[].
    snap = _snap(
        {"person.a": _p("Work")},
        in_zones={"person.a": []},
        zone_labels={"zone.work": "Work"},
    )
    assert m.matches({"quant": "any", "where": "zone.work"}, snap) is True
    # ...and a non-home named-zone state must NOT leak into a home match.
    assert m.matches({"quant": "any", "where": "home"}, snap) is False


def test_matches_scanner_home_empty_in_zones_for_duration_via_tenure() -> None:
    m = PeopleCondition()
    # The headline danger case through the engine `for:` clock: a scanner person
    # is home now (state="home", in_zones=[]), so "nobody home for 30m" must be
    # instantly false even with a stale tenure entry — the empty-list fallback
    # has to flow through the tenure path's instant test, not just the plain one.
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"quant": "nobody", "where": "home", "for": {"m": 30}}
    key = m._gate_key(pred)
    snap = _snap(
        persons={"person.bob": ("home", now - timedelta(minutes=1))},
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": []},
        tenure={key: now - timedelta(minutes=60)},  # stale — must not win
    )
    assert m.matches(pred, snap) is False


def test_describe_counts_scanner_home_empty_in_zones_as_home() -> None:
    m = PeopleCondition()
    # _is_home() must also fall back to state on empty in_zones.
    snap = _snap(
        {"person.a": _p("home"), "person.b": _p("not_home")},
        names={"person.a": "Alice", "person.b": "Bob"},
        in_zones={"person.a": [], "person.b": []},
    )
    assert m.describe(snap) == "1 of 2 home (Alice)"


def test_describe_does_not_count_unavailable_person_as_home() -> None:
    m = PeopleCondition()
    # _is_home must mirror _loc_match: an unavailable person with a STALE
    # non-empty in_zones=["zone.home"] is unobservable, not home — so the
    # snapshot summary agrees with matches() (which excludes them).
    snap = _snap(
        {"person.a": _p("unavailable"), "person.b": _p("home")},
        names={"person.a": "Alice", "person.b": "Bob"},
        in_zones={"person.a": ["zone.home"], "person.b": ["zone.home"]},
    )
    assert m.describe(snap) == "1 of 2 home (Bob)"


def test_describe_counts_in_zones_overlap_as_home() -> None:
    m = PeopleCondition()
    # State "Work" but in_zones includes zone.home -> counts as home.
    snap = _snap(
        {"person.a": _p("Work"), "person.b": _p("not_home")},
        names={"person.a": "Alice", "person.b": "Bob"},
        in_zones={"person.a": ["zone.work", "zone.home"]},
    )
    assert m.describe(snap) == "1 of 2 home (Alice)"


def test_matches_unavailable_person_excluded() -> None:
    m = PeopleCondition()
    snap = _snap({"person.a": _p("unavailable"), "person.b": _p("home")})
    # any home -> b counts -> True
    assert m.matches({"quant": "any", "where": "home"}, snap) is True
    # everyone home -> a unobservable -> False
    assert m.matches({"quant": "everyone", "where": "home"}, snap) is False


def test_matches_malformed_is_false() -> None:
    m = PeopleCondition()
    assert m.matches(42, _snap()) is False
    assert m.matches("home", _snap()) is False


def test_matches_empty_household() -> None:
    m = PeopleCondition()
    snap = _snap({})
    assert m.matches({"quant": "any", "where": "home"}, snap) is False
    assert m.matches({"quant": "everyone", "where": "home"}, snap) is False
    assert m.matches({"quant": "nobody", "where": "home"}, snap) is True


def test_matches_for_duration_met_any() -> None:
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    snap = _snap({"person.a": ("home", now - timedelta(minutes=10))}, now=now)
    pred = {"quant": "any", "where": "home", "for": {"h": 0, "m": 5, "s": 0}}
    assert m.matches(pred, snap) is True


def test_matches_for_duration_not_yet_any() -> None:
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    snap = _snap({"person.a": ("home", now - timedelta(minutes=1))}, now=now)
    pred = {"quant": "any", "where": "home", "for": {"h": 0, "m": 5, "s": 0}}
    assert m.matches(pred, snap) is False


def test_matches_for_duration_nobody_uses_away_clock() -> None:
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    # a left home 10m ago (not_home since then) -> nobody home for 5m holds
    snap = _snap({"person.a": ("not_home", now - timedelta(minutes=10))}, now=now)
    pred = {"quant": "nobody", "where": "home", "for": {"h": 0, "m": 5, "s": 0}}
    assert m.matches(pred, snap) is True
    # only 1m since leaving -> not yet
    snap2 = _snap({"person.a": ("not_home", now - timedelta(minutes=1))}, now=now)
    assert m.matches(pred, snap2) is False


def test_validate_accepts_none_and_valid() -> None:
    m = PeopleCondition()
    m.validate_predicate(None)
    m.validate_predicate({})
    m.validate_predicate(
        {"who": ["person.a"], "quant": "everyone", "where": "home", "for": {"h": 0, "m": 5, "s": 0}}
    )
    m.validate_predicate({"where": "zone.work"})
    m.validate_predicate({"where": "home", "negate": True})
    m.validate_predicate({"where": "zone.x"})


def test_validate_rejects_non_dict() -> None:
    with pytest.raises(ValueError):
        PeopleCondition().validate_predicate(42)


def test_validate_rejects_bad_who() -> None:
    m = PeopleCondition()
    with pytest.raises(ValueError, match="who"):
        m.validate_predicate({"who": "person.a"})
    with pytest.raises(ValueError, match="person"):
        m.validate_predicate({"who": ["light.x"]})


def test_validate_rejects_present_but_empty_who() -> None:
    # A present-but-empty `who` is "specific mode, nobody picked" — incomplete.
    # The frontend flags it; the backend must too, so an AI/imported config can't
    # smuggle it past validation and silently run as "all persons". Omitting
    # `who` entirely (base mode = all persons) stays valid.
    m = PeopleCondition()
    with pytest.raises(ValueError, match="who"):
        m.validate_predicate({"who": [], "quant": "any"})
    m.validate_predicate({"quant": "any"})  # absent who is still fine


def test_validate_rejects_bad_quant() -> None:
    with pytest.raises(ValueError, match="quant"):
        PeopleCondition().validate_predicate({"quant": "some"})


def test_validate_rejects_bad_where() -> None:
    m = PeopleCondition()
    with pytest.raises(ValueError, match="where"):
        m.validate_predicate({"where": "office"})
    with pytest.raises(ValueError, match="where"):
        m.validate_predicate({"where": 5})
    # "away" is no longer a valid where (replaced by negate).
    with pytest.raises(ValueError, match="where"):
        m.validate_predicate({"where": "away"})


def test_validate_rejects_non_bool_negate() -> None:
    m = PeopleCondition()
    with pytest.raises(ValueError, match="negate"):
        m.validate_predicate({"where": "home", "negate": "yes"})
    with pytest.raises(ValueError, match="negate"):
        m.validate_predicate({"where": "home", "negate": 1})


def test_validate_rejects_bad_for() -> None:
    m = PeopleCondition()
    with pytest.raises(ValueError, match="for"):
        m.validate_predicate({"for": {"h": -1, "m": 0, "s": 0}})
    with pytest.raises(ValueError, match="for"):
        m.validate_predicate({"for": {"h": 0, "m": "five", "s": 0}})


def test_describe_summarises_home_count() -> None:
    m = PeopleCondition()
    snap = _snap(
        {"person.a": _p("home"), "person.b": _p("not_home"), "person.c": _p("home")},
        names={"person.a": "Alice", "person.b": "Bob", "person.c": "Cara"},
    )
    assert m.describe(snap) == "2 of 3 home (Alice, Cara)"


def test_describe_none_home() -> None:
    m = PeopleCondition()
    snap = _snap({"person.a": _p("not_home")}, names={"person.a": "Alice"})
    assert m.describe(snap) == "0 of 1 home"


def test_describe_empty() -> None:
    assert PeopleCondition().describe(_snap()) == "no people tracked"
    assert PeopleCondition().describe(_snap(), None) == "no people tracked"


def test_describe_predicate_lists_each_person_any_home() -> None:
    snap = _snap(
        {"person.a": _p("home"), "person.b": _p("not_home")},
        names={"person.a": "Alice", "person.b": "Bob"},
    )
    pred = {"who": ["person.a", "person.b"]}
    assert PeopleCondition().describe(snap, pred) == "want anyone home: Alice: home ✓, Bob: away ✗"


def test_describe_predicate_everyone() -> None:
    snap = _snap(
        {"person.a": _p("home"), "person.b": _p("not_home")},
        names={"person.a": "Alice", "person.b": "Bob"},
    )
    pred = {"who": ["person.a", "person.b"], "quant": "everyone"}
    assert (
        PeopleCondition().describe(snap, pred) == "want everyone home: Alice: home ✓, Bob: away ✗"
    )


def test_describe_predicate_nobody_marks_away_as_match() -> None:
    snap = _snap(
        {"person.a": _p("not_home"), "person.b": _p("not_home")},
        names={"person.a": "Alice", "person.b": "Bob"},
    )
    pred = {"who": ["person.a", "person.b"], "quant": "nobody"}
    assert PeopleCondition().describe(snap, pred) == "want nobody home: Alice: away ✓, Bob: away ✓"


def test_describe_predicate_negate_not_home() -> None:
    snap = _snap({"person.a": _p("home")}, names={"person.a": "Alice"})
    pred = {"who": ["person.a"], "negate": True}
    assert PeopleCondition().describe(snap, pred) == "want anyone not home: Alice: home ✗"


def test_describe_predicate_zone_where() -> None:
    snap = _snap(
        {"person.a": _p("Work")},
        names={"person.a": "Alice"},
        zone_labels={"zone.work": "Work"},
        in_zones={"person.a": ["zone.work"]},
    )
    pred = {"who": ["person.a"], "where": "zone.work"}
    assert PeopleCondition().describe(snap, pred) == "want anyone in Work: Alice: in Work ✓"


def test_describe_predicate_missing_person_not_found() -> None:
    pred = {"who": ["person.ghost"]}
    assert (
        PeopleCondition().describe(_snap(), pred) == "want anyone home: person.ghost: not found ✗"
    )


def test_describe_predicate_present_but_unavailable_person() -> None:
    """A person that IS in the snapshot but has state 'unavailable' renders as
    'unavailable ✗' (not 'not found ✗'), because _loc_match returns None for
    states in the UNAVAILABLE set."""
    snap = _snap(
        {"person.alice": _p("unavailable")},
        names={"person.alice": "Alice"},
    )
    pred = {"who": ["person.alice"]}
    result = PeopleCondition().describe(snap, pred)
    assert result == "want anyone home: Alice: unavailable ✗"


def test_describe_predicate_empty_who_lists_all_persons() -> None:
    snap = _snap({"person.a": _p("home")}, names={"person.a": "Alice"})
    assert PeopleCondition().describe(snap, {"who": []}) == "want anyone home: Alice: home ✓"


def test_describe_predicate_for_shows_elapsed_and_requirement() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    home_25m = ("home", datetime(2026, 5, 25, 11, 35, tzinfo=UTC))  # meets ≥20m
    home_5m = ("home", datetime(2026, 5, 25, 11, 55, tzinfo=UTC))  # too short
    snap = _snap(
        {"person.a": home_25m, "person.b": home_5m},
        now=now,
        names={"person.a": "Alice", "person.b": "Bob"},
    )
    pred = {"who": ["person.a", "person.b"], "quant": "everyone", "for": {"m": 20}}
    assert PeopleCondition().describe(snap, pred) == (
        "want everyone home for ≥20m: Alice: home 25m ✓, Bob: home 5m ✗"
    )


# contains(outer, inner) -> True iff every state matching inner also matches outer
# (inner's match-set is a subset of outer's).


def test_contains_everyone_subset_of_any_same_set() -> None:
    m = PeopleCondition()
    inner = {"quant": "everyone", "where": "home"}
    outer = {"quant": "any", "where": "home"}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_any_smaller_set_subset_of_bigger() -> None:
    m = PeopleCondition()
    inner = {"who": ["person.a"], "quant": "any", "where": "home"}
    outer = {"who": ["person.a", "person.b"], "quant": "any", "where": "home"}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_everyone_bigger_set_subset_of_smaller() -> None:
    m = PeopleCondition()
    inner = {"who": ["person.a", "person.b"], "quant": "everyone", "where": "home"}
    outer = {"who": ["person.a"], "quant": "everyone", "where": "home"}
    assert m.contains(outer, inner) is True


def test_contains_nobody_bigger_set_subset_of_smaller() -> None:
    m = PeopleCondition()
    inner = {"who": ["person.a", "person.b"], "quant": "nobody", "where": "home"}
    outer = {"who": ["person.a"], "quant": "nobody", "where": "home"}
    assert m.contains(outer, inner) is True


def test_contains_less_than_shorter_inner_is_more_specific() -> None:
    m = PeopleCondition()
    short = {
        "who": ["person.a"],
        "quant": "any",
        "where": "home",
        "for": {"s": 30},
        "for_mode": "less_than",
    }
    long = {
        "who": ["person.a"],
        "quant": "any",
        "where": "home",
        "for": {"s": 60},
        "for_mode": "less_than",
    }
    # less_than inverts: held < 30 ⊆ held < 60.
    assert m.contains(long, short) is True
    assert m.contains(short, long) is False


def test_contains_false_when_for_mode_differs() -> None:
    m = PeopleCondition()
    at_least = {"who": ["person.a"], "quant": "any", "where": "home", "for": {"s": 30}}
    less_than = {
        "who": ["person.a"],
        "quant": "any",
        "where": "home",
        "for": {"s": 30},
        "for_mode": "less_than",
    }
    assert m.contains(at_least, less_than) is False
    assert m.contains(less_than, at_least) is False


def test_contains_nobody_disjoint_from_any() -> None:
    m = PeopleCondition()
    a = {"quant": "nobody", "where": "home"}
    b = {"quant": "any", "where": "home"}
    assert m.contains(a, b) is False
    assert m.contains(b, a) is False


def test_contains_different_where_is_false() -> None:
    m = PeopleCondition()
    inner = {"quant": "everyone", "where": "home"}
    outer = {"quant": "any", "where": "zone.work"}
    assert m.contains(outer, inner) is False


def test_contains_requires_equal_negate() -> None:
    m = PeopleCondition()
    inner = {"quant": "everyone", "where": "home", "negate": True}
    outer = {"quant": "any", "where": "home", "negate": True}
    # Same where AND same negate -> the usual quant lattice applies.
    assert m.contains(outer, inner) is True
    # Different negate -> not comparable -> False.
    outer2 = {"quant": "any", "where": "home"}
    assert m.contains(outer2, inner) is False
    assert m.contains(inner, outer2) is False


def test_contains_longer_for_is_subset() -> None:
    m = PeopleCondition()
    inner = {"quant": "any", "where": "home", "for": {"h": 0, "m": 10, "s": 0}}
    outer = {"quant": "any", "where": "home", "for": {"h": 0, "m": 5, "s": 0}}
    assert m.contains(outer, inner) is True  # held 10m ⊆ held 5m
    assert m.contains(inner, outer) is False


def test_contains_empty_who_is_all_superset() -> None:
    m = PeopleCondition()
    # any over explicit ⊆ any over ALL
    assert (
        m.contains(
            {"quant": "any", "where": "home"},
            {"who": ["person.a"], "quant": "any", "where": "home"},
        )
        is True
    )
    # everyone over ALL ⊆ everyone over explicit
    assert (
        m.contains(
            {"who": ["person.a"], "quant": "everyone", "where": "home"},
            {"quant": "everyone", "where": "home"},
        )
        is True
    )


def test_contains_everyone_inner_any_outer_requires_intersection() -> None:
    m = PeopleCondition()
    inner = {"who": ["person.a"], "quant": "everyone", "where": "home"}
    outer = {"who": ["person.a", "person.c"], "quant": "any", "where": "home"}
    assert m.contains(outer, inner) is True  # a ∈ both
    disjoint_outer = {"who": ["person.c"], "quant": "any", "where": "home"}
    assert m.contains(disjoint_outer, inner) is False


def test_contains_non_dict_is_false() -> None:
    m = PeopleCondition()
    assert m.contains(None, {"quant": "any"}) is False
    assert m.contains({"quant": "any"}, 5) is False


# ── trigger_deps ──────────────────────────────────────────────────────────────


def test_trigger_deps_explicit_who_with_for() -> None:
    m = PeopleCondition()
    pred = {"who": ["person.alice", "person.bob"], "for": {"h": 0, "m": 5, "s": 0}}
    spec = m.trigger_deps(pred)
    assert spec.entities == frozenset({"person.alice", "person.bob"})
    # One predicate-level gate (entity_id None for a multi-person who), so the
    # tenure clock spans the whole quantified test rather than per-person.
    assert spec.duration_gates == frozenset(
        {
            DurationGate(
                key=m._gate_key(pred),
                seconds=300.0,
                label=m._gate_label(pred),
                entity_id=None,
            )
        }
    )


def test_trigger_deps_single_who_with_for_names_the_entity() -> None:
    m = PeopleCondition()
    pred = {"who": ["person.alice"], "for": {"m": 5}}
    spec = m.trigger_deps(pred)
    gate = next(iter(spec.duration_gates))
    assert gate.entity_id == "person.alice"
    assert gate.key == m._gate_key(pred)


def test_trigger_deps_explicit_who_no_for() -> None:
    m = PeopleCondition()
    spec = m.trigger_deps({"who": ["person.alice"], "quant": "nobody"})
    assert spec.entities == frozenset({"person.alice"})
    assert spec.duration_gates == frozenset()


def test_trigger_deps_none_is_empty() -> None:
    from custom_components.ambience.triggers import EMPTY

    assert PeopleCondition().trigger_deps(None) == EMPTY
    assert PeopleCondition().trigger_deps("garbage") == EMPTY


async def test_trigger_deps_empty_who_watches_all_persons(hass: HomeAssistant) -> None:
    hass.states.async_set("person.alice", "home")
    hass.states.async_set("person.bob", "not_home")
    m = PeopleCondition(hass=hass)
    spec = m.trigger_deps({"quant": "everyone"})  # who absent → all current persons
    assert spec.entities == frozenset({"person.alice", "person.bob"})
    assert spec.duration_gates == frozenset()
    assert spec.domains == frozenset({"person"})


def test_trigger_deps_wildcard_who_watches_the_person_domain() -> None:
    """A `who`-less predicate means "all persons", a set that changes while HA
    runs — so it names the whole `person` domain, not just today's members."""
    spec = PeopleCondition().trigger_deps({"quant": "nobody"})
    assert spec.domains == frozenset({"person"})


def test_trigger_deps_explicit_who_has_no_domain_watch() -> None:
    """An explicit `who` list is a fixed set: no domain watch, so adding an
    unrelated person doesn't churn the index."""
    spec = PeopleCondition().trigger_deps({"who": ["person.alice"], "quant": "nobody"})
    assert spec.domains == frozenset()


async def test_trigger_deps_wildcard_with_no_persons_is_not_empty(hass: HomeAssistant) -> None:
    """With no `person.*` entities yet the wildcard enumerates nothing, but the
    spec must still be non-EMPTY (the domain watch) or the engine drops the
    predicate and the first person added is never noticed."""
    from custom_components.ambience.triggers import EMPTY

    spec = PeopleCondition(hass=hass).trigger_deps({"quant": "nobody"})
    assert spec.entities == frozenset()
    assert spec.domains == frozenset({"person"})
    assert spec != EMPTY


def test_all_person_ids_returns_empty_without_hass() -> None:
    # Line 146: _all_person_ids() early-exits with [] when hass is None.
    m = PeopleCondition(hass=None)
    assert m._all_person_ids() == []


# ── predicate tenure (engine-tracked `for:` clock) ─────────────────────────────


def test_nobody_home_for_does_not_reset_on_zone_hop_with_tenure() -> None:
    """Headline bug: a person moving zone A → zone B keeps the 'nobody home'
    clock running, because 'not home' held continuously."""
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"quant": "nobody", "where": "home", "for": {"m": 30}}
    key = m._gate_key(pred)
    # Bob hopped to ZoneB 1m ago (fresh last_changed) but 'nobody home' held 30m.
    snap = _snap(
        persons={"person.bob": ("ZoneB", now - timedelta(minutes=1))},
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": ["zone.b"]},
        tenure={key: now - timedelta(minutes=30)},
    )
    assert m.matches(pred, snap) is True
    # Without tenure (the legacy clock) the same snapshot resets → miss.
    snap_legacy = _snap(
        persons={"person.bob": ("ZoneB", now - timedelta(minutes=1))},
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": ["zone.b"]},
        tenure=None,
    )
    assert m.matches(pred, snap_legacy) is False


def test_people_tenure_requires_instant_truth() -> None:
    """A stale tenure entry must not win once the instant test stops holding:
    someone is home now, so 'nobody home' is instantly false regardless of an
    old tenure timestamp."""
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"quant": "nobody", "where": "home", "for": {"m": 30}}
    key = m._gate_key(pred)
    snap = _snap(
        persons={"person.bob": ("home", now - timedelta(minutes=1))},
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": ["zone.home"]},
        tenure={key: now - timedelta(minutes=60)},  # stale
    )
    assert m.matches(pred, snap) is False


def test_people_tenure_not_yet_held() -> None:
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"quant": "nobody", "where": "home", "for": {"m": 30}}
    key = m._gate_key(pred)
    snap = _snap(
        persons={"person.bob": ("away", now - timedelta(minutes=1))},
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": []},
        tenure={key: now - timedelta(minutes=5)},  # only 5m, need 30m
    )
    assert m.matches(pred, snap) is False


def test_people_gate_key_distinguishes_quant_where_negate_who() -> None:
    m = PeopleCondition()
    base = {"quant": "nobody", "where": "home", "for": {"m": 30}}
    assert m._gate_key(base) != m._gate_key({**base, "quant": "any"})
    assert m._gate_key(base) != m._gate_key({**base, "where": "zone.work"})
    assert m._gate_key(base) != m._gate_key({**base, "negate": True})
    assert m._gate_key(base) != m._gate_key({**base, "who": ["person.bob"]})


def test_people_gate_states_instant_and_anchor() -> None:
    """gate_states: pre-`for` truth, anchor = the most recent person change."""
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"quant": "nobody", "where": "home", "for": {"m": 30}}
    key = m._gate_key(pred)
    snap = _snap(
        persons={
            "person.a": ("away", now - timedelta(minutes=50)),
            "person.b": ("away", now - timedelta(minutes=10)),
        },
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.a": [], "person.b": []},
    )
    gs = m.gate_states(pred, snap)
    # Instant 'nobody home' is true; anchor is the latest person change (10m ago).
    assert gs == {key: (True, now - timedelta(minutes=10))}


def test_people_gate_states_empty_persons_anchor_is_now() -> None:
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"quant": "nobody", "where": "home", "for": {"m": 30}}
    key = m._gate_key(pred)
    gs = m.gate_states(pred, _snap(persons={}, now=now))
    # 'nobody home' over zero tracked persons is vacuously true; anchor = now.
    assert gs == {key: (True, now)}


def test_people_gate_states_empty_without_for() -> None:
    m = PeopleCondition()
    assert m.gate_states({"quant": "nobody", "where": "home"}, _snap()) == {}
    assert m.gate_states(None, _snap()) == {}


def test_people_describe_tenure_mode_shows_held() -> None:
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"quant": "nobody", "where": "home", "for": {"m": 30}}
    key = m._gate_key(pred)
    snap = _snap(
        persons={"person.bob": ("away", now - timedelta(minutes=1))},
        now=now,
        names={"person.bob": "Bob"},
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": []},
        tenure={key: now - timedelta(minutes=40)},
    )
    line = m.describe(snap, pred)
    assert "held 40m" in line and "✓" in line


def test_people_describe_tenure_mode_not_held() -> None:
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {"quant": "nobody", "where": "home", "for": {"m": 30}}
    snap = _snap(
        persons={"person.bob": ("home", now - timedelta(minutes=1))},
        now=now,
        names={"person.bob": "Bob"},
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": ["zone.home"]},
        tenure={},  # gate not currently held
    )
    line = m.describe(snap, pred)
    assert "not held" in line and "✗" in line


# ── for_mode: "less_than" (held LESS than the threshold) ───────────────────────


def test_less_than_tenure_held_short_matches() -> None:
    """less_than: instant test true and held < seconds → matches."""
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "quant": "nobody",
        "where": "home",
        "for": {"m": 30},
        "for_mode": "less_than",
    }
    key = m._gate_key(pred)
    snap = _snap(
        persons={"person.bob": ("away", now - timedelta(minutes=1))},
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": []},
        tenure={key: now - timedelta(minutes=10)},  # held 10m < 30m → within
    )
    assert m.matches(pred, snap) is True


def test_less_than_tenure_held_long_does_not_match() -> None:
    """less_than: held >= seconds → does NOT match."""
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "quant": "nobody",
        "where": "home",
        "for": {"m": 30},
        "for_mode": "less_than",
    }
    key = m._gate_key(pred)
    snap = _snap(
        persons={"person.bob": ("away", now - timedelta(minutes=1))},
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": []},
        tenure={key: now - timedelta(minutes=40)},  # held 40m >= 30m → not within
    )
    assert m.matches(pred, snap) is False


def test_less_than_tenure_exact_boundary_does_not_match() -> None:
    """less_than boundary is exclusive: held == seconds → does NOT match."""
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "quant": "nobody",
        "where": "home",
        "for": {"m": 30},
        "for_mode": "less_than",
    }
    key = m._gate_key(pred)
    snap = _snap(
        persons={"person.bob": ("away", now - timedelta(minutes=1))},
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": []},
        tenure={key: now - timedelta(minutes=30)},  # exactly 30m → not within
    )
    assert m.matches(pred, snap) is False


def test_less_than_tenure_requires_instant_truth() -> None:
    """less_than still requires the instant test to currently be true: someone is
    home now → 'nobody home' is instantly false → no match regardless of elapsed."""
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "quant": "nobody",
        "where": "home",
        "for": {"m": 30},
        "for_mode": "less_than",
    }
    key = m._gate_key(pred)
    snap = _snap(
        persons={"person.bob": ("home", now - timedelta(minutes=1))},
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": ["zone.home"]},
        tenure={key: now - timedelta(minutes=10)},  # within window, but instant false
    )
    assert m.matches(pred, snap) is False


def test_for_mode_at_least_and_absent_behave_as_today() -> None:
    """Regression: absent for_mode / 'at_least' is the existing >= behaviour."""
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    base = {"quant": "nobody", "where": "home", "for": {"m": 30}}
    key = m._gate_key(base)
    snap_held = _snap(
        persons={"person.bob": ("away", now - timedelta(minutes=1))},
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": []},
        tenure={key: now - timedelta(minutes=40)},  # 40m >= 30m
    )
    snap_short = _snap(
        persons={"person.bob": ("away", now - timedelta(minutes=1))},
        now=now,
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": []},
        tenure={key: now - timedelta(minutes=10)},  # 10m < 30m
    )
    # absent for_mode
    assert m.matches(base, snap_held) is True
    assert m.matches(base, snap_short) is False
    # explicit at_least
    at_least = {**base, "for_mode": "at_least"}
    assert m.matches(at_least, snap_held) is True
    assert m.matches(at_least, snap_short) is False


def test_less_than_legacy_fallback_short_matches() -> None:
    """less_than legacy fallback (no snapshot.tenure): elapsed < seconds → matches."""
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "quant": "any",
        "where": "home",
        "for": {"m": 5},
        "for_mode": "less_than",
    }
    # Home for only 1m (< 5m) and instant test true → matches.
    snap = _snap({"person.a": ("home", now - timedelta(minutes=1))}, now=now)
    assert m.matches(pred, snap) is True


def test_less_than_legacy_fallback_long_does_not_match() -> None:
    """less_than legacy fallback: elapsed >= seconds → does NOT match."""
    m = PeopleCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "quant": "any",
        "where": "home",
        "for": {"m": 5},
        "for_mode": "less_than",
    }
    # Home for 10m (>= 5m) → outside the less_than window.
    snap = _snap({"person.a": ("home", now - timedelta(minutes=10))}, now=now)
    assert m.matches(pred, snap) is False


def test_validate_rejects_bad_for_mode() -> None:
    m = PeopleCondition()
    with pytest.raises(ValueError, match="for_mode"):
        m.validate_predicate({"for_mode": "sometimes"})


def test_validate_accepts_valid_and_absent_for_mode() -> None:
    m = PeopleCondition()
    m.validate_predicate({})  # absent
    m.validate_predicate({"for_mode": "at_least"})
    m.validate_predicate({"for_mode": "less_than"})


def test_describe_renders_for_less_than() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    snap = _snap(
        {"person.a": ("home", now - timedelta(minutes=1))},
        now=now,
        names={"person.a": "Alice"},
    )
    pred = {"who": ["person.a"], "for": {"m": 20}, "for_mode": "less_than"}
    assert "for <20m" in PeopleCondition().describe(snap, pred)


def test_describe_renders_for_at_least() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    snap = _snap(
        {"person.a": ("home", now - timedelta(minutes=25))},
        now=now,
        names={"person.a": "Alice"},
    )
    pred = {"who": ["person.a"], "for": {"m": 20}, "for_mode": "at_least"}
    assert "for ≥20m" in PeopleCondition().describe(snap, pred)


def test_describe_less_than_per_person_mark_uses_mode_in_legacy_clock() -> None:
    # Legacy clock (no engine tenure): Alice home 2m with `for <5m` is WITHIN the
    # window, so the per-person mark must be ✓. Regression guard — describe must
    # thread `for_mode` into the per-person `_holds_at`; defaulting to at_least
    # would compare 2m >= 5m and wrongly show ✗.
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    snap = _snap(
        {"person.a": ("home", now - timedelta(minutes=2))},
        now=now,
        names={"person.a": "Alice"},
    )
    pred = {"who": ["person.a"], "for": {"m": 5}, "for_mode": "less_than"}
    assert "Alice: home 2m ✓" in PeopleCondition().describe(snap, pred)


def test_subset_all_is_not_subset_of_explicit() -> None:
    # Line 274: _subset(None, explicit_set) → False (ALL ⊈ any finite set).
    result = PeopleCondition._subset(None, frozenset({"person.a"}))
    assert result is False


def test_describe_non_dict_predicate_is_none() -> None:
    assert PeopleCondition().describe(_snap(), "not-a-dict") is None


def test_describe_no_people_tracked() -> None:
    # Empty `who` means "all persons"; with an empty snapshot there are none, so
    # describe reports that rather than an empty body.
    assert PeopleCondition().describe(_snap(), {"who": []}) == "no people tracked"
