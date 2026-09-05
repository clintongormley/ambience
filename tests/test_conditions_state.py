"""StateCondition — boolean expression over entity states + optional `for`."""

from __future__ import annotations

import copy
from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.state import StateCondition, StateSnapshot
from custom_components.ambience.errors import AmbienceError, render_en
from custom_components.ambience.triggers import DurationGate


def _snap(
    states: dict[str, tuple] | None = None,
    now: datetime | None = None,
    attributes: dict[str, dict[str, object]] | None = None,
    tenure: dict[str, datetime] | None = None,
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
        tenure=tenure,
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
    with pytest.raises(AmbienceError) as exc:
        StateCondition().validate_predicate(42)
    assert exc.value.translation_key == "state_malformed"


def test_validate_atom_requires_entity_id() -> None:
    m = StateCondition()
    for atom in (
        {"kind": "is", "states": ["on"]},
        {"kind": "is", "entity_id": "", "states": ["on"]},
    ):
        with pytest.raises(AmbienceError) as exc:
            m.validate_predicate(atom)
        assert exc.value.translation_key == "state_pick_entity"


def test_validate_atom_rejects_malformed_entity_id() -> None:
    """A non-blank string is not enough: it must parse as an entity id, so a
    bare domain prefix or a spaced/capitalised object id is rejected."""
    m = StateCondition()
    for bad in ("light", "light.", "light.Bad Id"):
        with pytest.raises(AmbienceError) as exc:
            m.validate_predicate({"kind": "is", "entity_id": bad, "states": ["on"]})
        assert exc.value.translation_key == "entity_id_invalid"


def test_validate_atom_requires_non_empty_states() -> None:
    m = StateCondition()
    for states, key in (
        ([], "state_pick_state"),
        ("on", "state_malformed"),
        (["on", 42], "state_states_invalid"),
    ):
        with pytest.raises(AmbienceError) as exc:
            m.validate_predicate({"kind": "is", "entity_id": "light.x", "states": states})
        assert exc.value.translation_key == key


def test_validate_messages_are_human_readable() -> None:
    """Validation errors surface in the scene editor, so the English rendering of
    the key must read as plain guidance — no internal jargon like "atom"."""
    m = StateCondition()
    with pytest.raises(AmbienceError) as exc:
        m.validate_predicate({"kind": "is", "entity_id": "light.kitchen", "states": []})
    assert exc.value.translation_key == "state_pick_state"
    msg = render_en("state_pick_state", {})
    assert "atom" not in msg
    assert "Pick at least one state" in msg


def test_validate_atom_for_is_optional() -> None:
    m = StateCondition()
    m.validate_predicate({"kind": "is", "entity_id": "light.x", "states": ["on"]})
    m.validate_predicate({"kind": "is", "entity_id": "light.x", "states": ["on"], "for": None})
    m.validate_predicate(
        {"kind": "is", "entity_id": "light.x", "states": ["on"], "for": {"h": 0, "m": 5, "s": 0}}
    )


def test_validate_atom_for_rejects_negative_or_non_int() -> None:
    m = StateCondition()
    for bad in ({"h": -1, "m": 0, "s": 0}, {"h": 0, "m": "five", "s": 0}):
        with pytest.raises(AmbienceError) as exc:
            m.validate_predicate(
                {"kind": "is", "entity_id": "light.x", "states": ["on"], "for": bad}
            )
        assert exc.value.translation_key == "for_component_invalid"


def test_validate_group_requires_non_empty_items() -> None:
    m = StateCondition()
    for pred in ({"kind": "and", "items": []}, {"kind": "or"}):
        with pytest.raises(AmbienceError) as exc:
            m.validate_predicate(pred)
        assert exc.value.translation_key == "state_group_empty"


def test_validate_not_requires_item() -> None:
    m = StateCondition()
    with pytest.raises(AmbienceError) as exc:
        m.validate_predicate({"kind": "not"})
    assert exc.value.translation_key == "state_not_empty"


def test_validate_unknown_kind() -> None:
    m = StateCondition()
    with pytest.raises(AmbienceError) as exc:
        m.validate_predicate({"kind": "xor", "items": []})
    assert exc.value.translation_key == "state_unknown_kind"


def test_validate_recurses_into_groups_and_not() -> None:
    m = StateCondition()
    bad = {
        "kind": "and",
        "items": [
            {"kind": "is", "entity_id": "light.x", "states": []},
        ],
    }
    with pytest.raises(AmbienceError) as exc:
        m.validate_predicate(bad)
    assert exc.value.translation_key == "state_pick_state"


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
    assert m.order_key({"kind": "is", "entity_id": "light.x", "states": ["on"]}) == "light.x"
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
    m.validate_predicate({"kind": "is", "entity_id": "light.x", "states": ["on"]})
    # With attribute = None (explicit)
    m.validate_predicate(
        {"kind": "is", "entity_id": "light.x", "states": ["on"], "attribute": None}
    )
    # With a string attribute
    m.validate_predicate(
        {"kind": "is", "entity_id": "light.x", "attribute": "source", "states": ["Spotify"]}
    )


def test_validate_atom_attribute_rejects_non_string() -> None:
    m = StateCondition()
    for bad in (42, ""):
        with pytest.raises(AmbienceError) as exc:
            m.validate_predicate(
                {"kind": "is", "entity_id": "light.x", "attribute": bad, "states": ["on"]}
            )
        assert exc.value.translation_key == "state_attribute_blank"


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
    m.validate_predicate({"kind": ">", "entity_id": "light.x", "states": ["10"]})
    m.validate_predicate({"kind": "<=", "entity_id": "light.x", "states": ["3.14"]})
    # Wrong shape: zero or multiple values
    for states in ([], ["1", "2"]):
        with pytest.raises(AmbienceError) as exc:
            m.validate_predicate({"kind": ">", "entity_id": "light.x", "states": states})
        assert exc.value.translation_key == "state_compare_one_value"
    # Non-numeric value
    with pytest.raises(AmbienceError) as exc:
        m.validate_predicate({"kind": ">", "entity_id": "light.x", "states": ["foo"]})
    assert exc.value.translation_key == "state_compare_not_number"


def test_validate_numeric_op_accepts_negative_and_decimals() -> None:
    m = StateCondition()
    m.validate_predicate({"kind": ">", "entity_id": "light.x", "states": ["-3.5"]})
    m.validate_predicate({"kind": ">=", "entity_id": "light.x", "states": ["0"]})


def test_order_key_supports_numeric_kinds() -> None:
    m = StateCondition()
    assert m.order_key({"kind": ">", "entity_id": "light.x", "states": ["5"]}) == "light.x"


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
    # One gate for the single `for:`-bearing atom; its key fingerprints the
    # instant test so an in-set flip can't reset its clock.
    motion_atom = {
        "kind": "is",
        "entity_id": "binary_sensor.motion",
        "states": ["off"],
        "for": {"h": 0, "m": 10, "s": 0},
    }
    assert spec.duration_gates == frozenset(
        {
            DurationGate(
                key=m._atom_gate_key(motion_atom),
                seconds=600.0,
                label="binary_sensor.motion is off",
                entity_id="binary_sensor.motion",
            )
        }
    )
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
    assert spec.duration_gates == frozenset()


# --- predicate tenure (engine-tracked `for:` clock) --------------------


def test_atom_for_does_not_reset_on_in_set_flip_with_tenure() -> None:
    """is [A, B] for 10m: an A→B flip mid-window must NOT reset the clock when
    the engine supplies tenure (the headline bug). The exact-state clock would
    reset because last_changed is fresh; predicate tenure survives."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    atom = {"kind": "is", "entity_id": "media.x", "states": ["A", "B"], "for": {"m": 10}}
    key = m._atom_gate_key(atom)
    # Entity flipped A→B 1m ago (fresh last_changed) but the gate held 10m.
    states = {"media.x": ("B", now - timedelta(minutes=1), now - timedelta(minutes=1))}
    assert m.matches(atom, _snap(states, now, tenure={key: now - timedelta(minutes=10)})) is True
    # Same snapshot WITHOUT tenure falls back to the exact-state clock → no match.
    assert m.matches(atom, _snap(states, now, tenure=None)) is False


def test_atom_tenure_not_yet_held_or_absent() -> None:
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    atom = {"kind": "is", "entity_id": "media.x", "states": ["A", "B"], "for": {"m": 10}}
    key = m._atom_gate_key(atom)
    states = {"media.x": ("A", now - timedelta(minutes=30), now - timedelta(minutes=30))}
    # Tenure recorded only 5m ago → not yet held for 10m.
    assert m.matches(atom, _snap(states, now, tenure={key: now - timedelta(minutes=5)})) is False
    # No tenure entry at all (engine never saw the gate true) → not held.
    assert m.matches(atom, _snap(states, now, tenure={})) is False


def test_atom_gate_key_is_order_insensitive_in_states() -> None:
    m = StateCondition()
    a = {"kind": "is", "entity_id": "media.x", "states": ["A", "B"], "for": {"m": 10}}
    b = {"kind": "is", "entity_id": "media.x", "states": ["B", "A"], "for": {"m": 10}}
    assert m._atom_gate_key(a) == m._atom_gate_key(b)
    # A different kind / entity / attribute yields a different key.
    c = {"kind": "is_not", "entity_id": "media.x", "states": ["A", "B"]}
    assert m._atom_gate_key(c) != m._atom_gate_key(a)


def test_atom_gate_key_no_collision_on_delimiter_in_value() -> None:
    """A single state value that literally contains the old '|' delimiter must
    NOT fingerprint the same as the two-element set — otherwise two different
    predicates would share (and clobber) one tenure clock."""
    m = StateCondition()
    single = {"kind": "is", "entity_id": "light.x", "states": ["a|b"]}
    pair = {"kind": "is", "entity_id": "light.x", "states": ["a", "b"]}
    assert m._atom_gate_key(single) != m._atom_gate_key(pair)


def test_gate_states_reports_instant_and_anchor() -> None:
    """gate_states: instant truth ignores `for`; anchor is last_changed for a
    state-mode atom, last_updated for an attribute-mode atom."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    lc = now - timedelta(minutes=10)
    lu = now - timedelta(minutes=1)
    states = {"media.x": ("A", lc, lu)}
    state_atom = {"kind": "is", "entity_id": "media.x", "states": ["A", "B"], "for": {"m": 10}}
    gs = m.gate_states(state_atom, _snap(states, now))
    assert gs == {m._atom_gate_key(state_atom): (True, lc)}
    # Attribute-mode anchors off last_updated.
    attr_atom = {
        "kind": "is",
        "entity_id": "media.x",
        "attribute": "source",
        "states": ["Spotify"],
        "for": {"m": 10},
    }
    gs_attr = m.gate_states(
        attr_atom, _snap(states, now, attributes={"media.x": {"source": "Spotify"}})
    )
    assert gs_attr == {m._atom_gate_key(attr_atom): (True, lu)}


def test_gate_states_only_includes_for_bearing_atoms() -> None:
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    pred = {
        "kind": "and",
        "items": [
            {"kind": "is", "entity_id": "light.a", "states": ["on"]},  # no for
            {"kind": "is", "entity_id": "sensor.b", "states": ["off"], "for": {"m": 5}},
        ],
    }
    states = {
        "light.a": ("on", now, now),
        "sensor.b": ("off", now - timedelta(minutes=2), now - timedelta(minutes=2)),
    }
    gs = m.gate_states(pred, _snap(states, now))
    only = {"kind": "is", "entity_id": "sensor.b", "states": ["off"], "for": {"m": 5}}
    assert set(gs) == {m._atom_gate_key(only)}


def test_gate_states_non_dict_and_not_branch() -> None:
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    # Non-dict predicate → empty (the _collect_gate_states guard).
    assert m.gate_states("not-a-dict", _snap({}, now)) == {}
    # A `not` wrapping a for-bearing atom recurses into the child.
    inner = {"kind": "is", "entity_id": "light.a", "states": ["on"], "for": {"m": 5}}
    pred = {"kind": "not", "item": inner}
    states = {"light.a": ("on", now - timedelta(minutes=2), now - timedelta(minutes=2))}
    gs = m.gate_states(pred, _snap(states, now))
    assert set(gs) == {m._atom_gate_key(inner)}


def test_gate_states_unobservable_atom_is_instant_false() -> None:
    """An unavailable/absent entity makes the instant test False; the anchor
    falls back to snapshot.now (no real change time to clock from)."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    atom = {"kind": "is", "entity_id": "sensor.gone", "states": ["on"], "for": {"m": 5}}
    gs = m.gate_states(atom, _snap({}, now))  # entity absent
    assert gs == {m._atom_gate_key(atom): (False, now)}


def test_describe_atom_shows_tenure_elapsed() -> None:
    """In tenure mode the elapsed shown is how long the gate has held, from the
    engine tenure map (not the entity's last_changed)."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    atom = {"kind": "is", "entity_id": "media.x", "states": ["A", "B"], "for": {"m": 10}}
    key = m._atom_gate_key(atom)
    # Entity flipped 1m ago, but tenure says the gate has held 12m.
    states = {"media.x": ("B", now - timedelta(minutes=1), now - timedelta(minutes=1))}
    line = m.describe(_snap(states, now, tenure={key: now - timedelta(minutes=12)}), atom)
    assert "12m" in line and "✓" in line
    # Absent tenure entry in tenure mode → no elapsed suffix, and a miss.
    line2 = m.describe(_snap(states, now, tenure={}), atom)
    assert "✗" in line2


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
    with pytest.raises(AmbienceError) as exc:
        m.validate_predicate({"kind": ">", "entity_id": "sensor.x", "states": [""]})
    assert exc.value.translation_key == "state_compare_needs_number"


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
    assert spec.duration_gates == frozenset()


def test_collect_deps_skips_atom_with_invalid_entity_id() -> None:
    """_collect_deps does not add an entity when entity_id is not a valid string (line 273->278).
    Ensures the `if isinstance(entity_id, str) and entity_id:` false-branch is taken."""
    m = StateCondition()
    # entity_id is None — the inner if-branch is False, nothing is added
    pred = {"kind": "is", "entity_id": None, "states": ["on"]}
    spec = m.trigger_deps(pred)
    assert spec.entities == frozenset()
    assert spec.duration_gates == frozenset()


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


def test_describe_expr_non_dict_child_is_placeholder() -> None:
    # A malformed (non-dict) item inside a group renders as "?" rather than crashing.
    assert StateCondition().describe(_snap(), {"kind": "and", "items": ["garbage"]}) == "all of: ?"


def test_describe_expr_unknown_kind_is_placeholder() -> None:
    # An unrecognised expression kind renders as "?".
    assert StateCondition().describe(_snap(), {"kind": "frobnicate"}) == "?"


async def test_snapshot_narrows_to_referenced_entities(hass: HomeAssistant) -> None:
    """The trigger engine passes the entities scenes actually reference; the
    snapshot must read just those instead of copying every entity in HA on the
    hottest path (motion/door events)."""
    hass.states.async_set("light.a", "on")
    hass.states.async_set("light.b", "off")
    snap = await StateCondition().snapshot(hass, entities=frozenset({"light.a", "light.gone"}))
    assert set(snap.states) == {"light.a"}
    assert set(snap.attributes) == {"light.a"}


# --- for_mode: "less_than" ---------------------------------------------------


def test_for_mode_less_than_tenure_within_window_matches() -> None:
    """`for_mode: "less_than"` matches while the gate has held for LESS than the
    threshold — the mirror of the default at_least gate, off engine tenure."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    atom = {
        "kind": "is",
        "entity_id": "person.bob",
        "states": ["home"],
        "for": {"m": 5},
        "for_mode": "less_than",
    }
    key = m._atom_gate_key(atom)
    states = {"person.bob": ("home", now - timedelta(minutes=1), now - timedelta(minutes=1))}
    # Gate held only 2m → within the 5m window → matches.
    assert m.matches(atom, _snap(states, now, tenure={key: now - timedelta(minutes=2)})) is True


def test_for_mode_less_than_tenure_held_too_long_does_not_match() -> None:
    """`less_than` stops matching once the gate has held at least the threshold."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    atom = {
        "kind": "is",
        "entity_id": "person.bob",
        "states": ["home"],
        "for": {"m": 5},
        "for_mode": "less_than",
    }
    key = m._atom_gate_key(atom)
    states = {"person.bob": ("home", now - timedelta(minutes=10), now - timedelta(minutes=10))}
    # Gate held 10m → past the 5m window → no match.
    assert m.matches(atom, _snap(states, now, tenure={key: now - timedelta(minutes=10)})) is False


def test_for_mode_less_than_tenure_exact_boundary_excluded() -> None:
    """The boundary is exclusive: held for EXACTLY the threshold → not within."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    atom = {
        "kind": "is",
        "entity_id": "person.bob",
        "states": ["home"],
        "for": {"m": 5},
        "for_mode": "less_than",
    }
    key = m._atom_gate_key(atom)
    states = {"person.bob": ("home", now - timedelta(minutes=5), now - timedelta(minutes=5))}
    # Held for exactly 5m → boundary is exclusive → no match.
    assert m.matches(atom, _snap(states, now, tenure={key: now - timedelta(minutes=5)})) is False


def test_for_mode_absent_and_at_least_behave_identically() -> None:
    """No `for_mode` (and an explicit "at_least") keep today's at_least gate: the
    gate must have held AT LEAST the threshold. A regression guard against the
    new field changing the default."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    base = {"kind": "is", "entity_id": "person.bob", "states": ["home"], "for": {"m": 5}}
    key = m._atom_gate_key(base)
    states = {"person.bob": ("home", now - timedelta(minutes=10), now - timedelta(minutes=10))}
    held_long = _snap(states, now, tenure={key: now - timedelta(minutes=10)})
    held_short = _snap(states, now, tenure={key: now - timedelta(minutes=1)})
    # Absent for_mode → at_least: 10m held matches, 1m held does not.
    assert m.matches(base, held_long) is True
    assert m.matches(base, held_short) is False
    # Explicit "at_least" behaves identically.
    explicit = {**base, "for_mode": "at_least"}
    assert m.matches(explicit, held_long) is True
    assert m.matches(explicit, held_short) is False


def test_for_mode_less_than_legacy_fallback_within_matches() -> None:
    """With no engine tenure (simulator path), `less_than` clocks off the exact
    state: elapsed < seconds → matches; elapsed >= seconds → no match."""
    m = StateCondition()
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    atom = {
        "kind": "is",
        "entity_id": "person.bob",
        "states": ["home"],
        "for": {"m": 5},
        "for_mode": "less_than",
    }
    # last_changed 2m ago, no tenure → within the 5m window → matches.
    within = _snap({"person.bob": ("home", now - timedelta(minutes=2))}, now=now, tenure=None)
    assert m.matches(atom, within) is True
    # last_changed 10m ago, no tenure → past the window → no match.
    past = _snap({"person.bob": ("home", now - timedelta(minutes=10))}, now=now, tenure=None)
    assert m.matches(atom, past) is False


def test_validate_atom_for_mode_optional_and_rejects_bad_value() -> None:
    """`for_mode` accepts None/absent, "at_least", "less_than"; a bad value
    raises at save time."""
    m = StateCondition()
    base = {"kind": "is", "entity_id": "light.x", "states": ["on"], "for": {"m": 5}}
    # Absent / None / valid modes all accepted.
    m.validate_predicate(base)
    m.validate_predicate({**base, "for_mode": None})
    m.validate_predicate({**base, "for_mode": "at_least"})
    m.validate_predicate({**base, "for_mode": "less_than"})
    # A bogus mode is rejected.
    with pytest.raises(AmbienceError) as exc:
        m.validate_predicate({**base, "for_mode": "at_most"})
    assert exc.value.translation_key == "for_mode_invalid"


def test_describe_atom_for_mode_renders_comparator() -> None:
    """describe renders `for <` for a less_than atom and `for ≥` for at_least."""
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    changed = now - timedelta(minutes=2)
    snap = _snap(
        {"binary_sensor.door": ("on", changed)},
        now=now,
        attributes={"binary_sensor.door": {"friendly_name": "Front Door"}},
    )
    less = {
        "kind": "is",
        "entity_id": "binary_sensor.door",
        "states": ["on"],
        "for": {"m": 5},
        "for_mode": "less_than",
    }
    assert StateCondition().describe(snap, less) == "Front Door: on 2m ✓ (is on, for <5m)"
    at_least = {**less, "for_mode": "at_least"}
    assert StateCondition().describe(snap, at_least) == "Front Door: on 2m ✗ (is on, for ≥5m)"


# --- normalize_predicate: save-time flattening of redundant nesting -----------
#
# The editor's group "( )" wrap can leave redundant structure (a single-child
# group, or a same-op group nested in its parent). It is semantically a no-op
# — kleene_all/any over the flattened form is identical — so normalize_predicate
# strips it for storage. Applied once at save (via canonicalise), never during
# live editing.


def _atom(eid: str) -> dict:
    return {"kind": "is", "entity_id": eid, "states": ["on"]}


def test_normalize_none_is_none() -> None:
    assert StateCondition().normalize_predicate(None) is None


def test_normalize_leaves_a_plain_atom_unchanged() -> None:
    atom = _atom("light.a")
    assert StateCondition().normalize_predicate(atom) == atom


def test_normalize_collapses_a_single_child_group_to_its_item() -> None:
    pred = {"kind": "or", "items": [{"kind": "and", "items": [_atom("a"), _atom("b")]}]}
    out = StateCondition().normalize_predicate(pred)
    assert out == {"kind": "and", "items": [_atom("a"), _atom("b")]}


def test_normalize_collapses_redundant_same_op_nesting() -> None:
    # OR[ OR[AND[a,b]], c ] -> OR[ AND[a,b], c ] (the editor's nested "( )" wrap).
    pred = {
        "kind": "or",
        "items": [
            {"kind": "or", "items": [{"kind": "and", "items": [_atom("a"), _atom("b")]}]},
            _atom("c"),
        ],
    }
    out = StateCondition().normalize_predicate(pred)
    assert out == {
        "kind": "or",
        "items": [{"kind": "and", "items": [_atom("a"), _atom("b")]}, _atom("c")],
    }


def test_normalize_merges_same_op_child_into_parent() -> None:
    # AND[ AND[a,b], c ] -> AND[ a, b, c ].
    pred = {
        "kind": "and",
        "items": [{"kind": "and", "items": [_atom("a"), _atom("b")]}, _atom("c")],
    }
    out = StateCondition().normalize_predicate(pred)
    assert out == {"kind": "and", "items": [_atom("a"), _atom("b"), _atom("c")]}


def test_normalize_preserves_not_inside_a_collapsed_group() -> None:
    # OR[ NOT(AND[a,b]) ] -> NOT(AND[a,b]) (single-child collapse keeps the NOT).
    inner = {"kind": "not", "item": {"kind": "and", "items": [_atom("a"), _atom("b")]}}
    pred = {"kind": "or", "items": [inner]}
    out = StateCondition().normalize_predicate(pred)
    assert out == inner


def test_normalize_recurses_under_a_not_wrapper() -> None:
    # NOT( AND[ AND[a,b], c ] ) -> NOT( AND[a,b,c] ).
    pred = {
        "kind": "not",
        "item": {
            "kind": "and",
            "items": [{"kind": "and", "items": [_atom("a"), _atom("b")]}, _atom("c")],
        },
    }
    out = StateCondition().normalize_predicate(pred)
    assert out == {
        "kind": "not",
        "item": {"kind": "and", "items": [_atom("a"), _atom("b"), _atom("c")]},
    }


def test_normalize_is_idempotent_on_a_clean_predicate() -> None:
    clean = {
        "kind": "or",
        "items": [{"kind": "and", "items": [_atom("a"), _atom("b")]}, _atom("c")],
    }
    once = StateCondition().normalize_predicate(clean)
    assert once == clean
    assert StateCondition().normalize_predicate(once) == clean


def test_normalize_does_not_mutate_the_input() -> None:
    pred = {"kind": "or", "items": [{"kind": "or", "items": [_atom("a")]}]}
    before = copy.deepcopy(pred)
    StateCondition().normalize_predicate(pred)
    assert pred == before
