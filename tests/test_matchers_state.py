"""StateMatcher — boolean expression over entity states + optional `for`."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from homeassistant.core import HomeAssistant

from custom_components.ambience.matchers.state import StateMatcher, StateSnapshot


def _snap(
    states: dict[str, tuple[str, datetime]] | None = None, now: datetime | None = None
) -> StateSnapshot:
    return StateSnapshot(
        now=now or datetime(2026, 5, 25, 12, 0, tzinfo=UTC),
        states=states or {},
    )


def test_protocol_fields() -> None:
    m = StateMatcher()
    assert m.name == "state"
    assert m.toggleable is True
    assert m.input == "state_predicate"
    assert m.priority == 50
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


def test_matches_none_predicate_is_true() -> None:
    assert StateMatcher().matches(None, _snap()) is True


def test_matches_atom_is_membership() -> None:
    m = StateMatcher()
    snap = _snap({"person.bob": ("home", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": "is", "entity_id": "person.bob", "states": ["home", "work"]}
    assert m.matches(pred, snap) is True


def test_matches_atom_not_in() -> None:
    m = StateMatcher()
    snap = _snap({"person.bob": ("away", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": "is", "entity_id": "person.bob", "states": ["home", "work"]}
    assert m.matches(pred, snap) is False


def test_matches_atom_is_not_negates() -> None:
    m = StateMatcher()
    snap = _snap({"person.bob": ("away", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": "is_not", "entity_id": "person.bob", "states": ["home"]}
    assert m.matches(pred, snap) is True


def test_matches_atom_missing_entity_is_false() -> None:
    m = StateMatcher()
    pred = {"kind": "is", "entity_id": "person.ghost", "states": ["home"]}
    assert m.matches(pred, _snap()) is False
    pred2 = {"kind": "is_not", "entity_id": "person.ghost", "states": ["home"]}
    assert m.matches(pred2, _snap()) is False


def test_matches_atom_for_duration_met() -> None:
    m = StateMatcher()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    snap = _snap(
        {"person.bob": ("home", now - timedelta(minutes=10))},
        now=now,
    )
    pred = {
        "kind": "is",
        "entity_id": "person.bob",
        "states": ["home"],
        "for": {"h": 0, "m": 5, "s": 0},
    }
    assert m.matches(pred, snap) is True


def test_matches_atom_for_duration_not_yet() -> None:
    m = StateMatcher()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    snap = _snap(
        {"person.bob": ("home", now - timedelta(minutes=1))},
        now=now,
    )
    pred = {
        "kind": "is",
        "entity_id": "person.bob",
        "states": ["home"],
        "for": {"h": 0, "m": 5, "s": 0},
    }
    assert m.matches(pred, snap) is False


def test_matches_and_group() -> None:
    m = StateMatcher()
    snap = _snap(
        {
            "person.bob": ("home", datetime(2026, 5, 25, 11, 0, tzinfo=UTC)),
            "binary_sensor.door": ("on", datetime(2026, 5, 25, 11, 0, tzinfo=UTC)),
        }
    )
    pred = {
        "kind": "and",
        "items": [
            {"kind": "is", "entity_id": "person.bob", "states": ["home"]},
            {"kind": "is", "entity_id": "binary_sensor.door", "states": ["on"]},
        ],
    }
    assert m.matches(pred, snap) is True
    pred["items"][1]["states"] = ["off"]
    assert m.matches(pred, snap) is False


def test_matches_or_group() -> None:
    m = StateMatcher()
    snap = _snap({"person.bob": ("away", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {
        "kind": "or",
        "items": [
            {"kind": "is", "entity_id": "person.bob", "states": ["home"]},
            {"kind": "is", "entity_id": "person.bob", "states": ["away"]},
        ],
    }
    assert m.matches(pred, snap) is True


def test_matches_not_wrapper() -> None:
    m = StateMatcher()
    snap = _snap({"person.bob": ("home", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": "not", "item": {"kind": "is", "entity_id": "person.bob", "states": ["home"]}}
    assert m.matches(pred, snap) is False
    pred["item"]["states"] = ["away"]
    assert m.matches(pred, snap) is True


def test_matches_nested_expression() -> None:
    """(A is home AND B is on) OR NOT C is open"""
    m = StateMatcher()
    snap = _snap(
        {
            "person.bob": ("home", datetime(2026, 5, 25, 11, 0, tzinfo=UTC)),
            "binary_sensor.b": ("off", datetime(2026, 5, 25, 11, 0, tzinfo=UTC)),
            "cover.c": ("closed", datetime(2026, 5, 25, 11, 0, tzinfo=UTC)),
        }
    )
    pred = {
        "kind": "or",
        "items": [
            {
                "kind": "and",
                "items": [
                    {"kind": "is", "entity_id": "person.bob", "states": ["home"]},
                    {"kind": "is", "entity_id": "binary_sensor.b", "states": ["on"]},
                ],
            },
            {"kind": "not", "item": {"kind": "is", "entity_id": "cover.c", "states": ["open"]}},
        ],
    }
    assert m.matches(pred, snap) is True


def test_matches_unknown_kind_is_false() -> None:
    m = StateMatcher()
    assert m.matches({"kind": "xor", "items": []}, _snap()) is False
    assert m.matches({"not_a_dict": True}, _snap()) is False
    assert m.matches(42, _snap()) is False


async def test_snapshot_captures_all_states(hass: HomeAssistant) -> None:
    hass.states.async_set("person.bob", "home", {})
    hass.states.async_set("binary_sensor.door", "on", {})
    snap = await StateMatcher().snapshot(hass)
    assert "person.bob" in snap.states
    assert snap.states["person.bob"][0] == "home"
    assert "binary_sensor.door" in snap.states
    assert isinstance(snap.now, datetime)


def test_describe_returns_none() -> None:
    assert StateMatcher().describe(_snap()) is None
