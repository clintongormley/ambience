"""StateMatcher — boolean expression over entity states + optional `for`."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
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


# --- validate_predicate ------------------------------------------------


def test_validate_accepts_none() -> None:
    StateMatcher().validate_predicate(None)


def test_validate_rejects_non_dict() -> None:
    with pytest.raises(ValueError):
        StateMatcher().validate_predicate(42)


def test_validate_atom_requires_entity_id() -> None:
    m = StateMatcher()
    with pytest.raises(ValueError, match="entity_id"):
        m.validate_predicate({"kind": "is", "states": ["on"]})
    with pytest.raises(ValueError, match="entity_id"):
        m.validate_predicate({"kind": "is", "entity_id": "", "states": ["on"]})


def test_validate_atom_requires_non_empty_states() -> None:
    m = StateMatcher()
    with pytest.raises(ValueError, match="states"):
        m.validate_predicate({"kind": "is", "entity_id": "x", "states": []})
    with pytest.raises(ValueError, match="states"):
        m.validate_predicate({"kind": "is", "entity_id": "x", "states": "on"})
    with pytest.raises(ValueError, match="states"):
        m.validate_predicate({"kind": "is", "entity_id": "x", "states": ["on", 42]})


def test_validate_atom_for_is_optional() -> None:
    m = StateMatcher()
    m.validate_predicate({"kind": "is", "entity_id": "x", "states": ["on"]})
    m.validate_predicate({"kind": "is", "entity_id": "x", "states": ["on"], "for": None})
    m.validate_predicate(
        {"kind": "is", "entity_id": "x", "states": ["on"], "for": {"h": 0, "m": 5, "s": 0}}
    )


def test_validate_atom_for_rejects_negative_or_non_int() -> None:
    m = StateMatcher()
    with pytest.raises(ValueError, match="for"):
        m.validate_predicate(
            {"kind": "is", "entity_id": "x", "states": ["on"], "for": {"h": -1, "m": 0, "s": 0}}
        )
    with pytest.raises(ValueError, match="for"):
        m.validate_predicate(
            {"kind": "is", "entity_id": "x", "states": ["on"], "for": {"h": 0, "m": "five", "s": 0}}
        )


def test_validate_group_requires_non_empty_items() -> None:
    m = StateMatcher()
    with pytest.raises(ValueError, match="items"):
        m.validate_predicate({"kind": "and", "items": []})
    with pytest.raises(ValueError, match="items"):
        m.validate_predicate({"kind": "or"})


def test_validate_not_requires_item() -> None:
    m = StateMatcher()
    with pytest.raises(ValueError, match="item"):
        m.validate_predicate({"kind": "not"})


def test_validate_unknown_kind() -> None:
    m = StateMatcher()
    with pytest.raises(ValueError, match="kind"):
        m.validate_predicate({"kind": "xor", "items": []})


def test_validate_recurses_into_groups_and_not() -> None:
    m = StateMatcher()
    bad = {
        "kind": "and",
        "items": [
            {"kind": "is", "entity_id": "x", "states": []},
        ],
    }
    with pytest.raises(ValueError, match="states"):
        m.validate_predicate(bad)


def test_validate_accepts_realistic_nested() -> None:
    m = StateMatcher()
    pred = {
        "kind": "or",
        "items": [
            {
                "kind": "and",
                "items": [
                    {"kind": "is", "entity_id": "person.bob", "states": ["home", "work"]},
                    {
                        "kind": "is_not",
                        "entity_id": "binary_sensor.d",
                        "states": ["on"],
                        "for": {"h": 0, "m": 5, "s": 0},
                    },
                ],
            },
            {"kind": "not", "item": {"kind": "is", "entity_id": "cover.c", "states": ["open"]}},
        ],
    }
    m.validate_predicate(pred)


# --- order_key ---------------------------------------------------------


def test_order_key_uses_first_atom_entity_id() -> None:
    m = StateMatcher()
    assert m.order_key({"kind": "is", "entity_id": "x", "states": ["on"]}) == "x"
    nested = {
        "kind": "or",
        "items": [
            {
                "kind": "and",
                "items": [
                    {"kind": "is", "entity_id": "person.bob", "states": ["home"]},
                ],
            },
        ],
    }
    assert m.order_key(nested) == "person.bob"


def test_order_key_handles_not_wrapper() -> None:
    m = StateMatcher()
    expr = {"kind": "not", "item": {"kind": "is", "entity_id": "cover.c", "states": ["open"]}}
    assert m.order_key(expr) == "cover.c"


def test_order_key_none_predicate_returns_string() -> None:
    m = StateMatcher()
    assert isinstance(m.order_key(None), str)
