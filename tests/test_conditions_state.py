"""StateCondition — boolean expression over entity states + optional `for`."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.state import StateCondition, StateSnapshot


def _snap(
    states: dict[str, tuple] | None = None,
    now: datetime | None = None,
    attributes: dict[str, dict[str, object]] | None = None,
) -> StateSnapshot:
    # Snapshot stores (state, last_changed, last_updated). Callers may pass a
    # 2-tuple (state, ts) when last_changed == last_updated; normalise it here.
    norm: dict[str, tuple[str, datetime, datetime]] = {}
    for eid, value in (states or {}).items():
        if len(value) == 2:
            state, ts = value
            norm[eid] = (state, ts, ts)
        else:
            norm[eid] = value
    return StateSnapshot(
        now=now or datetime(2026, 5, 25, 12, 0, tzinfo=UTC),
        states=norm,
        attributes=attributes or {},
    )


def test_protocol_fields() -> None:
    m = StateCondition()
    assert m.name == "state"
    assert not hasattr(m, "toggleable")
    assert m.input == "state_predicate"
    assert m.priority == 950
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


def test_matches_none_predicate_is_true() -> None:
    assert StateCondition().matches(None, _snap()) is True


def test_matches_atom_is_membership() -> None:
    m = StateCondition()
    snap = _snap({"person.bob": ("home", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": "is", "entity_id": "person.bob", "states": ["home", "work"]}
    assert m.matches(pred, snap) is True


def test_matches_atom_not_in() -> None:
    m = StateCondition()
    snap = _snap({"person.bob": ("away", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": "is", "entity_id": "person.bob", "states": ["home", "work"]}
    assert m.matches(pred, snap) is False


def test_matches_atom_is_not_negates() -> None:
    m = StateCondition()
    snap = _snap({"person.bob": ("away", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": "is_not", "entity_id": "person.bob", "states": ["home"]}
    assert m.matches(pred, snap) is True


def test_matches_atom_missing_entity_is_false() -> None:
    m = StateCondition()
    pred = {"kind": "is", "entity_id": "person.ghost", "states": ["home"]}
    assert m.matches(pred, _snap()) is False
    pred2 = {"kind": "is_not", "entity_id": "person.ghost", "states": ["home"]}
    assert m.matches(pred2, _snap()) is False


def test_matches_atom_for_duration_met() -> None:
    m = StateCondition()
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
    m = StateCondition()
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


def test_state_mode_for_clocks_on_last_changed_not_last_updated() -> None:
    """A state-mode atom (no `attribute`) must clock `for` off last_changed.
    Entity has been "home" for 10m (last_changed), but an attribute-only
    refresh bumped last_updated to 1m ago. A `for: 5m` state atom must still
    match — the state string never changed."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    snap = _snap(
        {
            "person.bob": (
                "home",
                now - timedelta(minutes=10),  # last_changed
                now - timedelta(minutes=1),  # last_updated (attr-only refresh)
            )
        },
        now=now,
    )
    pred = {
        "kind": "is",
        "entity_id": "person.bob",
        "states": ["home"],
        "for": {"h": 0, "m": 5, "s": 0},
    }
    assert m.matches(pred, snap) is True


def test_attribute_mode_for_clocks_on_last_updated() -> None:
    """An attribute-mode atom must keep clocking `for` off last_updated, so an
    attribute change resets its own clock. Same timestamps as the state-mode
    test, but a `for: 5m` attribute atom must NOT match — only 1m since the
    attribute last changed (last_updated)."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    snap = _snap(
        {
            "media_player.x": (
                "playing",
                now - timedelta(minutes=10),  # last_changed
                now - timedelta(minutes=1),  # last_updated
            )
        },
        now=now,
        attributes={"media_player.x": {"source": "Spotify"}},
    )
    pred = {
        "kind": "is",
        "entity_id": "media_player.x",
        "attribute": "source",
        "states": ["Spotify"],
        "for": {"h": 0, "m": 5, "s": 0},
    }
    assert m.matches(pred, snap) is False


def test_matches_and_group() -> None:
    m = StateCondition()
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
    m = StateCondition()
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
    m = StateCondition()
    snap = _snap({"person.bob": ("home", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": "not", "item": {"kind": "is", "entity_id": "person.bob", "states": ["home"]}}
    assert m.matches(pred, snap) is False
    pred["item"]["states"] = ["away"]
    assert m.matches(pred, snap) is True


def test_not_wrapper_unavailable_is_not_a_match() -> None:
    # not(entity is "on") must NOT become true when the entity is unavailable.
    # An unobservable atom is a miss; negating "couldn't tell" must not
    # manufacture a match.
    m = StateCondition()
    snap = _snap({"light.x": ("unavailable", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": "not", "item": {"kind": "is", "entity_id": "light.x", "states": ["on"]}}
    assert m.matches(pred, snap) is False


def test_not_wrapper_true_on_observable_mismatch() -> None:
    # not(entity is "on") with an observably "off" entity is a real True.
    m = StateCondition()
    snap = _snap({"light.x": ("off", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": "not", "item": {"kind": "is", "entity_id": "light.x", "states": ["on"]}}
    assert m.matches(pred, snap) is True


def test_matches_nested_expression() -> None:
    """(A is home AND B is on) OR NOT C is open"""
    m = StateCondition()
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
    m = StateCondition()
    assert m.matches({"kind": "xor", "items": []}, _snap()) is False
    assert m.matches({"not_a_dict": True}, _snap()) is False
    assert m.matches(42, _snap()) is False


async def test_snapshot_captures_all_states(hass: HomeAssistant) -> None:
    hass.states.async_set("person.bob", "home", {})
    hass.states.async_set("binary_sensor.door", "on", {})
    snap = await StateCondition().snapshot(hass)
    assert "person.bob" in snap.states
    assert snap.states["person.bob"][0] == "home"
    assert "binary_sensor.door" in snap.states
    assert isinstance(snap.now, datetime)


def test_describe_returns_none() -> None:
    assert StateCondition().describe(_snap()) is None


# --- validate_predicate ------------------------------------------------


def test_validate_accepts_none() -> None:
    StateCondition().validate_predicate(None)


def test_validate_rejects_non_dict() -> None:
    with pytest.raises(ValueError):
        StateCondition().validate_predicate(42)


def test_validate_atom_requires_entity_id() -> None:
    m = StateCondition()
    with pytest.raises(ValueError, match="entity"):
        m.validate_predicate({"kind": "is", "states": ["on"]})
    with pytest.raises(ValueError, match="entity"):
        m.validate_predicate({"kind": "is", "entity_id": "", "states": ["on"]})


def test_validate_atom_requires_non_empty_states() -> None:
    m = StateCondition()
    with pytest.raises(ValueError, match="state"):
        m.validate_predicate({"kind": "is", "entity_id": "x", "states": []})
    with pytest.raises(ValueError, match="state"):
        m.validate_predicate({"kind": "is", "entity_id": "x", "states": "on"})
    with pytest.raises(ValueError, match="state"):
        m.validate_predicate({"kind": "is", "entity_id": "x", "states": ["on", 42]})


def test_validate_messages_are_human_readable() -> None:
    """Validation errors surface verbatim in the scene editor, so they must read
    as plain guidance — no internal jargon like "atom" or "states list"."""
    m = StateCondition()
    with pytest.raises(ValueError) as exc:
        m.validate_predicate({"kind": "is", "entity_id": "light.kitchen", "states": []})
    msg = str(exc.value)
    assert "atom" not in msg
    assert "Pick at least one state" in msg


def test_validate_atom_for_is_optional() -> None:
    m = StateCondition()
    m.validate_predicate({"kind": "is", "entity_id": "x", "states": ["on"]})
    m.validate_predicate({"kind": "is", "entity_id": "x", "states": ["on"], "for": None})
    m.validate_predicate(
        {"kind": "is", "entity_id": "x", "states": ["on"], "for": {"h": 0, "m": 5, "s": 0}}
    )


def test_validate_atom_for_rejects_negative_or_non_int() -> None:
    m = StateCondition()
    with pytest.raises(ValueError, match="for"):
        m.validate_predicate(
            {"kind": "is", "entity_id": "x", "states": ["on"], "for": {"h": -1, "m": 0, "s": 0}}
        )
    with pytest.raises(ValueError, match="for"):
        m.validate_predicate(
            {"kind": "is", "entity_id": "x", "states": ["on"], "for": {"h": 0, "m": "five", "s": 0}}
        )


def test_validate_group_requires_non_empty_items() -> None:
    m = StateCondition()
    with pytest.raises(ValueError, match="group"):
        m.validate_predicate({"kind": "and", "items": []})
    with pytest.raises(ValueError, match="group"):
        m.validate_predicate({"kind": "or"})


def test_validate_not_requires_item() -> None:
    m = StateCondition()
    with pytest.raises(ValueError, match="negate"):
        m.validate_predicate({"kind": "not"})


def test_validate_unknown_kind() -> None:
    m = StateCondition()
    with pytest.raises(ValueError, match="kind"):
        m.validate_predicate({"kind": "xor", "items": []})


def test_validate_recurses_into_groups_and_not() -> None:
    m = StateCondition()
    bad = {
        "kind": "and",
        "items": [
            {"kind": "is", "entity_id": "x", "states": []},
        ],
    }
    with pytest.raises(ValueError, match="state"):
        m.validate_predicate(bad)


def test_validate_accepts_realistic_nested() -> None:
    m = StateCondition()
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
    m = StateCondition()
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
    m = StateCondition()
    expr = {"kind": "not", "item": {"kind": "is", "entity_id": "cover.c", "states": ["open"]}}
    assert m.order_key(expr) == "cover.c"


def test_order_key_none_predicate_returns_string() -> None:
    m = StateCondition()
    assert isinstance(m.order_key(None), str)


# --- attribute comparison ----------------------------------------------


def test_matches_atom_compares_attribute_when_set() -> None:
    """`attribute` swaps the LHS from entity.state to entity.attributes[attr]."""
    m = StateCondition()
    snap = _snap(
        {"media_player.x": ("playing", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))},
        attributes={"media_player.x": {"source": "Spotify"}},
    )
    # State is 'playing', but we're checking attribute 'source' against ['Spotify'].
    pred = {
        "kind": "is",
        "entity_id": "media_player.x",
        "attribute": "source",
        "states": ["Spotify", "Tidal"],
    }
    assert m.matches(pred, snap) is True


def test_matches_atom_attribute_not_matching() -> None:
    m = StateCondition()
    snap = _snap(
        {"media_player.x": ("playing", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))},
        attributes={"media_player.x": {"source": "Radio"}},
    )
    pred = {
        "kind": "is",
        "entity_id": "media_player.x",
        "attribute": "source",
        "states": ["Spotify"],
    }
    assert m.matches(pred, snap) is False


def test_matches_atom_attribute_is_not_negates() -> None:
    m = StateCondition()
    snap = _snap(
        {"media_player.x": ("playing", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))},
        attributes={"media_player.x": {"source": "Radio"}},
    )
    pred = {
        "kind": "is_not",
        "entity_id": "media_player.x",
        "attribute": "source",
        "states": ["Spotify"],
    }
    assert m.matches(pred, snap) is True


def test_matches_atom_attribute_missing_returns_false() -> None:
    """An entity that doesn't expose the requested attribute can't match."""
    m = StateCondition()
    snap = _snap(
        {"media_player.x": ("playing", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))},
        attributes={"media_player.x": {"source": "Spotify"}},
    )
    pred = {
        "kind": "is",
        "entity_id": "media_player.x",
        "attribute": "nonexistent",
        "states": ["anything"],
    }
    assert m.matches(pred, snap) is False
    # is_not on a missing attribute is also false (we can't prove the negation).
    pred2 = {**pred, "kind": "is_not"}
    assert m.matches(pred2, snap) is False


def test_matches_atom_attribute_string_coerced() -> None:
    """Numeric / bool attribute values get stringified before comparison."""
    m = StateCondition()
    snap = _snap(
        {"light.x": ("on", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))},
        attributes={"light.x": {"brightness": 255, "is_dimmable": True}},
    )
    # 255 stringified is "255" — user types it as a string in the states list.
    assert (
        m.matches(
            {"kind": "is", "entity_id": "light.x", "attribute": "brightness", "states": ["255"]},
            snap,
        )
        is True
    )
    assert (
        m.matches(
            {
                "kind": "is",
                "entity_id": "light.x",
                "attribute": "is_dimmable",
                "states": ["True"],
            },
            snap,
        )
        is True
    )


def test_matches_atom_attribute_ignores_unavailable_state() -> None:
    """If the entity's state is unavailable, attribute comparison still fails
    — we treat the whole entity as unobservable."""
    m = StateCondition()
    snap = _snap(
        {"sensor.x": ("unavailable", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))},
        attributes={"sensor.x": {"source": "Spotify"}},
    )
    pred = {
        "kind": "is",
        "entity_id": "sensor.x",
        "attribute": "source",
        "states": ["Spotify"],
    }
    assert m.matches(pred, snap) is False


async def test_snapshot_captures_entity_attributes(hass) -> None:
    hass.states.async_set("media_player.x", "playing", {"source": "Spotify", "volume_level": 0.5})
    snap = await StateCondition().snapshot(hass)
    assert snap.attributes["media_player.x"]["source"] == "Spotify"
    assert snap.attributes["media_player.x"]["volume_level"] == 0.5


async def test_snapshot_captures_both_last_changed_and_last_updated(hass) -> None:
    """last_updated bumps on any change (state OR attribute), while
    last_changed only bumps on state change. The snapshot captures both as
    (state, last_changed, last_updated) so the `for` clock can pick the right
    one per atom — attribute-mode atoms still track last_updated."""
    hass.states.async_set("media_player.x", "playing", {"source": "Spotify"})
    s1 = hass.states.get("media_player.x")
    ts1 = s1.last_updated

    # Attribute-only change: state stays "playing", source flips to Radio.
    hass.states.async_set("media_player.x", "playing", {"source": "Radio"})
    s2 = hass.states.get("media_player.x")
    # In HA: last_changed stays the same (state didn't change), last_updated advances.
    assert s2.last_updated > ts1
    assert s2.last_changed == s1.last_changed

    snap = await StateCondition().snapshot(hass)
    _state, captured_changed, captured_updated = snap.states["media_player.x"]
    assert captured_changed == s2.last_changed, "snapshot must capture last_changed"
    assert captured_updated == s2.last_updated, "snapshot must capture last_updated"


def test_validate_atom_attribute_is_optional() -> None:
    m = StateCondition()
    # Without attribute (existing behavior)
    m.validate_predicate({"kind": "is", "entity_id": "x", "states": ["on"]})
    # With attribute = None (explicit)
    m.validate_predicate({"kind": "is", "entity_id": "x", "states": ["on"], "attribute": None})
    # With a string attribute
    m.validate_predicate(
        {"kind": "is", "entity_id": "x", "attribute": "source", "states": ["Spotify"]}
    )


def test_validate_atom_attribute_rejects_non_string() -> None:
    m = StateCondition()
    with pytest.raises(ValueError, match="attribute"):
        m.validate_predicate({"kind": "is", "entity_id": "x", "attribute": 42, "states": ["on"]})
    with pytest.raises(ValueError, match="attribute"):
        m.validate_predicate({"kind": "is", "entity_id": "x", "attribute": "", "states": ["on"]})


# --- numeric comparison kinds ------------------------------------------


@pytest.mark.parametrize(
    "kind,value,threshold,expected",
    [
        (">", "10", "5", True),
        (">", "5", "5", False),
        (">", "3", "5", False),
        (">=", "5", "5", True),
        (">=", "4.9", "5", False),
        ("<", "3", "5", True),
        ("<", "5", "5", False),
        ("<=", "5", "5", True),
        ("<=", "5.1", "5", False),
    ],
)
def test_matches_numeric_ops_on_state(kind, value, threshold, expected) -> None:
    m = StateCondition()
    snap = _snap({"sensor.temp": (value, datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": kind, "entity_id": "sensor.temp", "states": [threshold]}
    assert m.matches(pred, snap) is expected


def test_matches_numeric_op_on_attribute() -> None:
    m = StateCondition()
    snap = _snap(
        {"light.x": ("on", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))},
        attributes={"light.x": {"brightness": 200}},
    )
    pred = {
        "kind": ">",
        "entity_id": "light.x",
        "attribute": "brightness",
        "states": ["100"],
    }
    assert m.matches(pred, snap) is True


def test_matches_numeric_op_unparseable_value_is_false() -> None:
    """A non-numeric state can't satisfy a numeric comparison."""
    m = StateCondition()
    snap = _snap({"sensor.x": ("foo", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": ">", "entity_id": "sensor.x", "states": ["5"]}
    assert m.matches(pred, snap) is False


def test_matches_numeric_op_missing_threshold_is_false() -> None:
    m = StateCondition()
    snap = _snap({"sensor.x": ("10", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    pred = {"kind": ">", "entity_id": "sensor.x", "states": []}
    assert m.matches(pred, snap) is False


def test_validate_numeric_op_requires_one_numeric_value() -> None:
    m = StateCondition()
    # Happy path
    m.validate_predicate({"kind": ">", "entity_id": "x", "states": ["10"]})
    m.validate_predicate({"kind": "<=", "entity_id": "x", "states": ["3.14"]})
    # Wrong shape: zero or multiple values
    with pytest.raises(ValueError, match="exactly one"):
        m.validate_predicate({"kind": ">", "entity_id": "x", "states": []})
    with pytest.raises(ValueError, match="exactly one"):
        m.validate_predicate({"kind": ">", "entity_id": "x", "states": ["1", "2"]})
    # Non-numeric value
    with pytest.raises(ValueError, match="number"):
        m.validate_predicate({"kind": ">", "entity_id": "x", "states": ["foo"]})


def test_validate_numeric_op_accepts_negative_and_decimals() -> None:
    m = StateCondition()
    m.validate_predicate({"kind": ">", "entity_id": "x", "states": ["-3.5"]})
    m.validate_predicate({"kind": ">=", "entity_id": "x", "states": ["0"]})


def test_order_key_supports_numeric_kinds() -> None:
    m = StateCondition()
    assert m.order_key({"kind": ">", "entity_id": "x", "states": ["5"]}) == "x"


# --- trigger_deps ------------------------------------------------------


def test_trigger_deps_collects_entities_and_durations() -> None:
    m = StateCondition()
    pred = {
        "kind": "and",
        "items": [
            {"kind": "is", "entity_id": "person.bob", "states": ["home"]},
            {
                "kind": "is",
                "entity_id": "binary_sensor.motion",
                "states": ["off"],
                "for": {"h": 0, "m": 10, "s": 0},
            },
            {
                "kind": "not",
                "item": {"kind": "is", "entity_id": "light.x", "states": ["on"]},
            },
        ],
    }
    spec = m.trigger_deps(pred)
    assert spec.entities == frozenset({"person.bob", "binary_sensor.motion", "light.x"})
    assert spec.entity_durations == frozenset({("binary_sensor.motion", 600.0)})
    assert spec.clock_times == frozenset()
    assert spec.date_rollover is False
    assert spec.opaque is False


def test_trigger_deps_none_predicate_is_empty() -> None:
    from custom_components.ambience.triggers import EMPTY

    assert StateCondition().trigger_deps(None) == EMPTY


def test_trigger_deps_collects_from_or_group() -> None:
    m = StateCondition()
    pred = {
        "kind": "or",
        "items": [
            {"kind": "is", "entity_id": "person.alice", "states": ["home"]},
            {"kind": "is", "entity_id": "person.bob", "states": ["home"]},
        ],
    }
    spec = m.trigger_deps(pred)
    assert spec.entities == frozenset({"person.alice", "person.bob"})
    assert spec.entity_durations == frozenset()


# --- new coverage tests ------------------------------------------------


def test_eval_atom_non_string_entity_id_is_false() -> None:
    """_eval_atom returns False when entity_id is not a string (line 105)."""
    m = StateCondition()
    snap = _snap({"sensor.x": ("on", datetime(2026, 5, 25, 11, 0, tzinfo=UTC))})
    # entity_id is an int, not a str
    pred = {"kind": "is", "entity_id": 123, "states": ["on"]}
    assert m.matches(pred, snap) is False


def test_eval_atom_for_all_zeros_still_matches() -> None:
    """A `for` dict that totals 0 seconds skips the duration check (line 136->144)
    and the atom still matches — the `if seconds > 0` branch is False."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    # last_changed is very recent — would fail a real duration gate
    snap = _snap(
        {"person.bob": ("home", now - timedelta(seconds=1))},
        now=now,
    )
    pred = {
        "kind": "is",
        "entity_id": "person.bob",
        "states": ["home"],
        "for": {"h": 0, "m": 0, "s": 0},
    }
    assert m.matches(pred, snap) is True


def test_numeric_op_fallthrough_unknown_kind_returns_false() -> None:
    """_numeric_op returns False for a kind that passes none of the if-chains (line 166).
    This exercises the final `return False` in the static method."""
    # Call the static method directly with a kind that isn't >, >=, <, <=
    result = StateCondition._numeric_op("==", "5", ["5"])
    assert result is False


def test_validate_numeric_threshold_empty_string_rejected() -> None:
    """validate_atom raises when the numeric threshold is an empty string."""
    m = StateCondition()
    with pytest.raises(ValueError, match="number"):
        m.validate_predicate({"kind": ">", "entity_id": "sensor.x", "states": [""]})


def test_first_atom_skips_none_result_items_in_and() -> None:
    """_first_atom iterates past items that return None and returns the first real
    atom (lines 241->245 and 243->241 — the loop-continue and loop-return branches)."""
    m = StateCondition()
    # First item has unknown kind → _first_atom returns None for it.
    # Second item is a valid atom → returned as the first atom.
    expr = {
        "kind": "and",
        "items": [
            {"kind": "xor", "entity_id": "sensor.a", "states": ["on"]},
            {"kind": "is", "entity_id": "sensor.b", "states": ["on"]},
        ],
    }
    atom = m._first_atom(expr)
    assert atom is not None
    assert atom["entity_id"] == "sensor.b"
    # order_key should resolve to the second entity
    assert m.order_key(expr) == "sensor.b"


def test_first_atom_returns_none_for_unknown_kind() -> None:
    """_first_atom hits the final `return None` for a dict with an unknown kind (line 247)."""
    m = StateCondition()
    # A dict whose kind isn't an atom, and/or, or not
    result = m._first_atom({"kind": "xor", "items": []})
    assert result is None
    # order_key must return an empty string when no atom is found
    assert m.order_key({"kind": "xor", "items": []}) == ""


def test_first_atom_and_exhausts_all_items_without_match() -> None:
    """_first_atom exhausts the and/or loop without finding any atom (line 241->245).
    All items return None from _first_atom (unknown kinds), so the loop falls
    through to the `if kind == 'not'` check and ultimately returns None."""
    m = StateCondition()
    expr = {
        "kind": "and",
        "items": [
            {"kind": "xor", "entity_id": "sensor.a", "states": ["on"]},
            {"kind": "xor", "entity_id": "sensor.b", "states": ["on"]},
        ],
    }
    atom = m._first_atom(expr)
    assert atom is None
    assert m.order_key(expr) == ""


def test_collect_deps_ignores_non_dict_expr() -> None:
    """_collect_deps returns early without modifying sets for a non-dict (line 269).
    Reached via trigger_deps with a non-None, non-dict top-level expression."""
    m = StateCondition()
    # trigger_deps only short-circuits on None; any other value falls into _collect_deps
    spec = m.trigger_deps("not-a-dict")
    assert spec.entities == frozenset()
    assert spec.entity_durations == frozenset()


def test_collect_deps_skips_atom_with_invalid_entity_id() -> None:
    """_collect_deps does not add an entity when entity_id is not a valid string (line 273->278).
    Ensures the `if isinstance(entity_id, str) and entity_id:` false-branch is taken."""
    m = StateCondition()
    # entity_id is None — the inner if-branch is False, nothing is added
    pred = {"kind": "is", "entity_id": None, "states": ["on"]}
    spec = m.trigger_deps(pred)
    assert spec.entities == frozenset()
    assert spec.entity_durations == frozenset()


# --- describe() — per-predicate trace detail ---------------------------------

_DT = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)


def test_describe_none_predicate_is_none() -> None:
    snap = _snap({"light.k": ("on", _DT)})
    # predicate=None is the whole-snapshot summary (snapshots_described): a
    # summary over the entire HA state is meaningless for `state`, so stay None.
    assert StateCondition().describe(snap) is None
    assert StateCondition().describe(snap, None) is None


def test_describe_non_dict_predicate_is_none() -> None:
    assert StateCondition().describe(_snap(), "nope") is None


def test_describe_atom_is_pass_and_fail() -> None:
    snap = _snap(
        {"light.k": ("on", _DT)},
        attributes={"light.k": {"friendly_name": "Kitchen Light"}},
    )
    assert (
        StateCondition().describe(snap, {"kind": "is", "entity_id": "light.k", "states": ["on"]})
        == "Kitchen Light: on ✓ (is on)"
    )
    assert (
        StateCondition().describe(snap, {"kind": "is", "entity_id": "light.k", "states": ["off"]})
        == "Kitchen Light: on ✗ (is off)"
    )


def test_describe_atom_numeric_uses_symbol() -> None:
    snap = _snap(
        {"sensor.t": ("19", _DT)},
        attributes={"sensor.t": {"friendly_name": "Hallway Temp"}},
    )
    assert (
        StateCondition().describe(snap, {"kind": ">=", "entity_id": "sensor.t", "states": ["20"]})
        == "Hallway Temp: 19 ✗ (≥ 20)"
    )


def test_describe_atom_is_not() -> None:
    snap = _snap({"lock.f": ("locked", _DT)}, attributes={"lock.f": {"friendly_name": "Front"}})
    pred = {"kind": "is_not", "entity_id": "lock.f", "states": ["unlocked"]}
    assert StateCondition().describe(snap, pred) == "Front: locked ✓ (is not unlocked)"


def test_describe_atom_is_lists_multiple_states() -> None:
    snap = _snap({"person.a": ("home", _DT)}, attributes={"person.a": {"friendly_name": "Alice"}})
    pred = {"kind": "is", "entity_id": "person.a", "states": ["home", "work"]}
    assert StateCondition().describe(snap, pred) == "Alice: home ✓ (is home, work)"


def test_describe_atom_attribute_mode_labels_and_value() -> None:
    snap = _snap(
        {"climate.x": ("heat", _DT)},
        attributes={"climate.x": {"friendly_name": "Thermostat", "temperature": 19}},
    )
    pred = {"kind": ">=", "entity_id": "climate.x", "attribute": "temperature", "states": ["20"]}
    assert StateCondition().describe(snap, pred) == "Thermostat temperature: 19 ✗ (≥ 20)"


def test_describe_atom_missing_attribute_shows_dash() -> None:
    snap = _snap(
        {"climate.x": ("heat", _DT)},
        attributes={"climate.x": {"friendly_name": "Thermostat"}},
    )
    pred = {"kind": ">=", "entity_id": "climate.x", "attribute": "temperature", "states": ["20"]}
    assert StateCondition().describe(snap, pred) == "Thermostat temperature: — ✗ (≥ 20)"


def test_describe_atom_for_shows_elapsed_and_threshold() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    changed = now - timedelta(minutes=2)
    snap = _snap(
        {"binary_sensor.door": ("on", changed)},
        now=now,
        attributes={"binary_sensor.door": {"friendly_name": "Front Door"}},
    )
    pred = {"kind": "is", "entity_id": "binary_sensor.door", "states": ["on"], "for": {"m": 5}}
    assert StateCondition().describe(snap, pred) == "Front Door: on 2m ✗ (is on, for ≥5m)"


def test_describe_atom_unavailable() -> None:
    snap = _snap(
        {"light.k": ("unavailable", _DT)},
        attributes={"light.k": {"friendly_name": "Kitchen Light"}},
    )
    pred = {"kind": "is", "entity_id": "light.k", "states": ["on"]}
    assert StateCondition().describe(snap, pred) == "Kitchen Light: unavailable ✗ (is on)"


def test_describe_atom_missing_entity_not_found() -> None:
    pred = {"kind": "is", "entity_id": "light.k", "states": ["on"]}
    assert StateCondition().describe(_snap(), pred) == "light.k: not found ✗ (is on)"


def test_describe_and_group_lists_each() -> None:
    snap = _snap(
        {"light.k": ("on", _DT), "sensor.t": ("19", _DT)},
        attributes={
            "light.k": {"friendly_name": "Kitchen Light"},
            "sensor.t": {"friendly_name": "Hallway Temp"},
        },
    )
    pred = {
        "kind": "and",
        "items": [
            {"kind": "is", "entity_id": "light.k", "states": ["on"]},
            {"kind": ">=", "entity_id": "sensor.t", "states": ["20"]},
        ],
    }
    assert (
        StateCondition().describe(snap, pred)
        == "all of: Kitchen Light: on ✓ (is on), Hallway Temp: 19 ✗ (≥ 20)"
    )


def test_describe_or_group_lists_each() -> None:
    snap = _snap(
        {"light.k": ("off", _DT), "light.l": ("on", _DT)},
        attributes={
            "light.k": {"friendly_name": "Kitchen"},
            "light.l": {"friendly_name": "Lounge"},
        },
    )
    pred = {
        "kind": "or",
        "items": [
            {"kind": "is", "entity_id": "light.k", "states": ["on"]},
            {"kind": "is", "entity_id": "light.l", "states": ["on"]},
        ],
    }
    assert (
        StateCondition().describe(snap, pred)
        == "any of: Kitchen: off ✗ (is on), Lounge: on ✓ (is on)"
    )


def test_describe_not_wraps() -> None:
    snap = _snap(
        {"light.k": ("on", _DT)}, attributes={"light.k": {"friendly_name": "Kitchen Light"}}
    )
    pred = {"kind": "not", "item": {"kind": "is", "entity_id": "light.k", "states": ["on"]}}
    assert StateCondition().describe(snap, pred) == "not(Kitchen Light: on ✓ (is on))"
