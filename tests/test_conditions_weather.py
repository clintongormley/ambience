"""WeatherCondition — condition + numeric-threshold predicate."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions._common import Reason
from custom_components.ambience.conditions.weather import (
    DEFAULT_WEATHER_GROUPS,
    WEATHER_CONDITIONS,
    WeatherCondition,
    WeatherSnapshot,
)
from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.errors import AmbienceError
from custom_components.ambience.triggers import EMPTY


def _install_store_stub(hass: HomeAssistant, entity: str | None = None) -> None:
    class _Store:
        def get_condition_config(self, name: str) -> dict[str, object]:
            return {"entity": entity} if name == "weather" else {}

    hass.data.setdefault(DOMAIN, {})[DATA_STORE] = _Store()


def _install_store_stub_groups(
    hass: HomeAssistant,
    entity: str | None = "weather.home",
    groups: list[dict] | None = None,
) -> None:
    """Plant a store stub returning a custom weather config with groups."""

    class _Store:
        def get_condition_config(self, name: str) -> dict[str, object]:
            if name == "weather":
                return {"entity": entity, "groups": groups or list(DEFAULT_WEATHER_GROUPS)}
            return {}

    hass.data.setdefault(DOMAIN, {})[DATA_STORE] = _Store()


def _snap(condition: str | None = "sunny", **attrs: float) -> WeatherSnapshot:
    return WeatherSnapshot(condition=condition, attributes=dict(attrs))


def test_protocol_fields() -> None:
    m = WeatherCondition()
    assert m.name == "weather"
    assert not hasattr(m, "toggleable")
    assert m.input == "weather_predicate"
    assert m.priority == 700
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


async def test_snapshot_unset_entity(hass: HomeAssistant) -> None:
    _install_store_stub(hass, entity=None)
    snap = await WeatherCondition().snapshot(hass)
    assert snap.condition is None
    assert snap.attributes == {}


async def test_snapshot_reads_condition_and_numeric_attributes(hass: HomeAssistant) -> None:
    _install_store_stub(hass, entity="weather.home")
    hass.states.async_set(
        "weather.home",
        "rainy",
        {
            "temperature": 4.5,
            "humidity": 90,
            "wind_speed": 12.0,
            "attribution": "ACME",
            "forecast": [{"x": 1}],
        },
    )
    snap = await WeatherCondition().snapshot(hass)
    assert snap.condition == "rainy"
    assert snap.attributes == {"temperature": 4.5, "humidity": 90.0, "wind_speed": 12.0}


async def test_snapshot_unavailable_entity(hass: HomeAssistant) -> None:
    _install_store_stub(hass, entity="weather.home")
    hass.states.async_set("weather.home", "unavailable", {})
    snap = await WeatherCondition().snapshot(hass)
    assert snap.condition is None


async def test_snapshot_unknown_state(hass: HomeAssistant) -> None:
    _install_store_stub(hass, entity="weather.home")
    hass.states.async_set("weather.home", "unknown", {})
    snap = await WeatherCondition().snapshot(hass)
    assert snap.condition is None


async def test_snapshot_entity_configured_but_absent(hass: HomeAssistant) -> None:
    _install_store_stub(hass, entity="weather.home")  # never async_set → state is None
    snap = await WeatherCondition().snapshot(hass)
    assert snap.condition is None
    assert snap.attributes == {}


async def test_snapshot_excludes_bool_attributes(hass: HomeAssistant) -> None:
    _install_store_stub(hass, entity="weather.home")
    hass.states.async_set("weather.home", "sunny", {"temperature": 20.0, "is_daytime": True})
    snap = await WeatherCondition().snapshot(hass)
    assert snap.attributes == {"temperature": 20.0}


def test_matches_thresholds_each_operator() -> None:
    m = WeatherCondition()
    snap = _snap("rainy", temperature=4.0, humidity=90.0)
    assert (
        m.matches(
            {"conditions": [], "thresholds": [{"attribute": "temperature", "op": "<", "value": 5}]},
            snap,
        )
        is True
    )
    assert (
        m.matches(
            {"conditions": [], "thresholds": [{"attribute": "temperature", "op": ">", "value": 5}]},
            snap,
        )
        is False
    )
    assert (
        m.matches(
            {"conditions": [], "thresholds": [{"attribute": "humidity", "op": ">=", "value": 90}]},
            snap,
        )
        is True
    )
    assert (
        m.matches(
            {"conditions": [], "thresholds": [{"attribute": "humidity", "op": "<=", "value": 89}]},
            snap,
        )
        is False
    )


def test_matches_missing_attribute_fails_threshold() -> None:
    m = WeatherCondition()
    pred = {"conditions": [], "thresholds": [{"attribute": "pressure", "op": "<", "value": 1000}]}
    assert m.matches(pred, _snap("rainy", temperature=4.0)) is False


def test_matches_non_dict_is_false() -> None:
    assert WeatherCondition().matches(42, _snap("sunny")) is False


@pytest.fixture
def m_with_entity(hass: HomeAssistant) -> WeatherCondition:
    _install_store_stub(hass, entity="weather.home")
    return WeatherCondition(hass=hass)


@pytest.fixture
def m_no_entity(hass: HomeAssistant) -> WeatherCondition:
    _install_store_stub_groups(hass, entity=None, groups=[])
    return WeatherCondition(hass=hass)


def test_validate_accepts_null_and_empty(m_no_entity: WeatherCondition) -> None:
    m_no_entity.validate_predicate(None)
    # inactive → no entity needed
    m_no_entity.validate_predicate({"groups": [], "thresholds": []})


def test_validate_rejects_non_dict(m_no_entity: WeatherCondition) -> None:
    with pytest.raises(AmbienceError) as exc:
        m_no_entity.validate_predicate(42)
    assert exc.value.translation_key == "weather_predicate_not_object"


def test_validate_skips_group_existence_when_no_hass() -> None:
    # no hass → shape checks still apply; unknown group ids are not rejected
    m = WeatherCondition()
    m.validate_predicate({"groups": ["anything"], "thresholds": []})


@pytest.mark.parametrize(
    "threshold,key",
    [
        ({"attribute": "nope", "op": "<", "value": 5}, "weather_unknown_attribute"),
        ({"attribute": "temperature", "op": "==", "value": 5}, "weather_invalid_operator"),
        ({"attribute": "temperature", "op": "<", "value": "5"}, "weather_threshold_not_number"),
        ({"attribute": "temperature", "op": "<", "value": True}, "weather_threshold_not_number"),
        ({"attribute": "temperature", "op": "<"}, "weather_threshold_not_number"),
    ],
)
def test_validate_rejects_bad_threshold(
    m_with_entity: WeatherCondition, threshold, key: str
) -> None:
    with pytest.raises(AmbienceError) as exc:
        m_with_entity.validate_predicate({"groups": [], "thresholds": [threshold]})
    assert exc.value.translation_key == key


def test_validate_accepts_well_formed(hass: HomeAssistant) -> None:
    _install_store_stub_groups(
        hass,
        groups=[
            {"id": "wet", "label": "Wet", "conditions": ["rainy"]},
        ],
    )
    m = WeatherCondition(hass=hass)
    m.validate_predicate(
        {
            "groups": ["wet"],
            "thresholds": [{"attribute": "temperature", "op": "<", "value": 5}],
        }
    )


def test_default_groups_cover_every_ha_condition() -> None:
    covered: set[str] = set()
    for g in DEFAULT_WEATHER_GROUPS:
        covered.update(g["conditions"])
    assert covered == set(WEATHER_CONDITIONS), f"missing: {set(WEATHER_CONDITIONS) - covered}"


def test_default_groups_have_unique_ids() -> None:
    ids = [g["id"] for g in DEFAULT_WEATHER_GROUPS]
    assert len(ids) == len(set(ids))
    assert all(isinstance(i, str) and i for i in ids)


async def test_matches_resolves_groups_via_config(hass: HomeAssistant) -> None:
    _install_store_stub_groups(
        hass,
        groups=[
            {"id": "wet", "label": "Wet", "conditions": ["rainy", "pouring"]},
            {"id": "sunny", "label": "Sunny", "conditions": ["sunny"]},
        ],
    )
    m = WeatherCondition(hass=hass)
    pred = {"groups": ["wet"], "thresholds": []}
    assert m.matches(pred, _snap("rainy")) is True
    assert m.matches(pred, _snap("pouring")) is True
    assert m.matches(pred, _snap("sunny")) is False


async def test_matches_unions_multiple_groups(hass: HomeAssistant) -> None:
    _install_store_stub_groups(
        hass,
        groups=[
            {"id": "wet", "label": "Wet", "conditions": ["rainy"]},
            {"id": "windy", "label": "Windy", "conditions": ["windy"]},
        ],
    )
    m = WeatherCondition(hass=hass)
    pred = {"groups": ["wet", "windy"], "thresholds": []}
    assert m.matches(pred, _snap("rainy")) is True
    assert m.matches(pred, _snap("windy")) is True
    assert m.matches(pred, _snap("sunny")) is False


async def test_matches_empty_groups_is_wildcard(hass: HomeAssistant) -> None:
    _install_store_stub_groups(hass)
    m = WeatherCondition(hass=hass)
    assert m.matches({"groups": [], "thresholds": []}, _snap("rainy")) is True


async def test_matches_dangling_group_just_doesnt_match(hass: HomeAssistant) -> None:
    _install_store_stub_groups(
        hass,
        groups=[
            {"id": "wet", "label": "Wet", "conditions": ["rainy"]},
        ],
    )
    m = WeatherCondition(hass=hass)
    pred = {"groups": ["nonexistent"], "thresholds": []}
    assert m.matches(pred, _snap("rainy")) is False


async def test_matches_groups_and_thresholds_anded(hass: HomeAssistant) -> None:
    _install_store_stub_groups(
        hass,
        groups=[
            {"id": "wet", "label": "Wet", "conditions": ["rainy"]},
        ],
    )
    m = WeatherCondition(hass=hass)
    pred = {
        "groups": ["wet"],
        "thresholds": [{"attribute": "temperature", "op": "<", "value": 5}],
    }
    assert m.matches(pred, _snap("rainy", temperature=4.0)) is True
    assert m.matches(pred, _snap("rainy", temperature=10.0)) is False
    assert m.matches(pred, _snap("sunny", temperature=4.0)) is False


def _condition_with_entity(entity: str | None) -> WeatherCondition:
    hass = MagicMock()
    store = MagicMock()
    store.get_condition_config.return_value = {"entity": entity}
    hass.data = {DOMAIN: {DATA_STORE: store}}
    return WeatherCondition(hass=hass)


def test_trigger_deps_watches_weather_entity_when_predicate_nonempty() -> None:
    m = _condition_with_entity("weather.home")
    spec = m.trigger_deps({"groups": ["dim"]})
    assert spec.entities == frozenset({"weather.home"})


def test_trigger_deps_thresholds_also_watch_entity() -> None:
    m = _condition_with_entity("weather.home")
    spec = m.trigger_deps({"thresholds": [{"attribute": "temperature", "op": "<", "value": 5}]})
    assert spec.entities == frozenset({"weather.home"})


def test_trigger_deps_empty_predicate_is_empty() -> None:
    m = _condition_with_entity("weather.home")
    assert m.trigger_deps({}) == EMPTY
    assert m.trigger_deps(None) == EMPTY


def test_trigger_deps_entity_not_configured_returns_empty_entities() -> None:
    m = _condition_with_entity(None)
    spec = m.trigger_deps({"groups": ["dim"]})
    assert spec.entities == frozenset()


# ---------------------------------------------------------------------------
# Unknown threshold operator (matching path is tolerant of stored junk)
# ---------------------------------------------------------------------------


def test_threshold_with_unknown_operator_never_matches() -> None:
    """An op outside ('<', '<=', '>', '>=') must not match, whatever the value."""
    snap = _snap("sunny", temperature=5.0)
    for op in ("==", "!=", ""):
        assert (
            WeatherCondition._threshold_ok(
                {"attribute": "temperature", "op": op, "value": 5.0}, snap
            )
            is False
        )


# ---------------------------------------------------------------------------
# Line 114: _entity() returns None when self._hass is None
# ---------------------------------------------------------------------------


def test_entity_returns_none_when_no_hass() -> None:
    """WeatherCondition._entity() must return None when constructed without hass."""
    m = WeatherCondition()  # hass=None
    assert m._entity() is None  # noqa: SLF001


# ---------------------------------------------------------------------------
# Line 117: _entity() returns None when get_store returns None
# ---------------------------------------------------------------------------


def test_entity_returns_none_when_store_missing(hass: HomeAssistant) -> None:
    """_entity() returns None when hass.data has no store (integration not set up)."""
    # Don't install any store → hass.data has no DOMAIN key
    m = WeatherCondition(hass=hass)
    assert m._entity() is None  # noqa: SLF001


# ---------------------------------------------------------------------------
# Line 142: matches() returns True when predicate is None
# ---------------------------------------------------------------------------


def test_matches_none_predicate_is_true() -> None:
    """matches() with predicate=None is always True (wildcard)."""
    m = WeatherCondition()
    assert m.matches(None, _snap("rainy")) is True
    assert m.matches(None, _snap(None)) is True


# ---------------------------------------------------------------------------
# Line 155: _configured_groups() returns [] when self._hass is None
# ---------------------------------------------------------------------------


def test_configured_groups_returns_empty_when_no_hass() -> None:
    """_configured_groups() returns [] when the instance has no hass."""
    m = WeatherCondition()
    assert m._configured_groups() == []  # noqa: SLF001


# ---------------------------------------------------------------------------
# Line 158: _configured_groups() returns [] when get_store returns None
# ---------------------------------------------------------------------------


def test_configured_groups_returns_empty_when_store_missing(hass: HomeAssistant) -> None:
    """_configured_groups() returns [] when the store is absent from hass.data."""
    m = WeatherCondition(hass=hass)
    assert m._configured_groups() == []  # noqa: SLF001


# ---------------------------------------------------------------------------
# Line 172: _threshold_ok returns False when threshold is not a dict
# ---------------------------------------------------------------------------


def test_threshold_ok_rejects_non_dict() -> None:
    """_threshold_ok returns False when the threshold entry is not a dict."""
    snap = _snap("rainy", temperature=10.0)
    _ok = WeatherCondition._threshold_ok  # noqa: SLF001
    assert _ok("temperature < 5", snap) is False
    assert _ok(42, snap) is False
    assert _ok(None, snap) is False


# ---------------------------------------------------------------------------
# Line 178: _threshold_ok returns False when value is bool or non-numeric
# ---------------------------------------------------------------------------


def test_threshold_ok_rejects_bool_and_non_numeric_value() -> None:
    """_threshold_ok returns False when threshold value is a bool or a string.

    The snap uses temperature=0.5 so that float(True)==1.0 makes the op hold
    (0.5 < 1.0 is True) — without the ``isinstance(value, bool)`` guard the
    mutation would return True instead of False, making the assertion fail.
    """
    snap = _snap("rainy", temperature=0.5)
    # bool is a subclass of int — must be explicitly rejected even when op would hold
    _ok = WeatherCondition._threshold_ok  # noqa: SLF001
    assert _ok({"attribute": "temperature", "op": "<", "value": True}, snap) is False
    assert _ok({"attribute": "temperature", "op": ">", "value": False}, snap) is False
    assert _ok({"attribute": "temperature", "op": "<", "value": "10"}, snap) is False
    assert _ok({"attribute": "temperature", "op": "<", "value": None}, snap) is False


# ---------------------------------------------------------------------------
# Line 182: describe() returns snapshot.condition
# ---------------------------------------------------------------------------


def test_describe_returns_condition() -> None:
    """describe() returns the condition string from the snapshot."""
    m = WeatherCondition()
    assert m.describe(_snap("sunny")) == "sunny"
    assert m.describe(_snap(None)) is None


# ---------------------------------------------------------------------------
# Line 192: validate_predicate raises when groups is not a list
# ---------------------------------------------------------------------------


def test_validate_rejects_groups_not_a_list(m_no_entity: WeatherCondition) -> None:
    """validate_predicate rejects a non-list `groups`."""
    for bad in ("sunny", {"sunny"}):
        with pytest.raises(AmbienceError) as exc:
            m_no_entity.validate_predicate({"groups": bad, "thresholds": []})
        assert exc.value.translation_key == "weather_groups_not_list"


# ---------------------------------------------------------------------------
# Line 194: validate_predicate raises when thresholds is not a list
# ---------------------------------------------------------------------------


def test_validate_rejects_thresholds_not_a_list(m_no_entity: WeatherCondition) -> None:
    """validate_predicate rejects a non-list `thresholds`."""
    for bad in ("bad", {}):
        with pytest.raises(AmbienceError) as exc:
            m_no_entity.validate_predicate({"groups": [], "thresholds": bad})
        assert exc.value.translation_key == "weather_thresholds_not_list"


# ---------------------------------------------------------------------------
# Line 197: validate_predicate raises when a group id is empty or non-string
# ---------------------------------------------------------------------------


def test_validate_rejects_empty_and_non_string_group_ids(m_no_entity: WeatherCondition) -> None:
    """validate_predicate rejects blank or non-string group ids."""
    for bad in ("", 42, None):
        with pytest.raises(AmbienceError) as exc:
            m_no_entity.validate_predicate({"groups": [bad], "thresholds": []})
        assert exc.value.translation_key == "weather_group_id_empty"


# ---------------------------------------------------------------------------
# Line 221: _validate_threshold raises when threshold is not a dict
# ---------------------------------------------------------------------------


def test_validate_threshold_rejects_non_dict(m_no_entity: WeatherCondition) -> None:
    """validate_predicate rejects a threshold entry that is not an object."""
    for bad in ("temp < 5", 42):
        with pytest.raises(AmbienceError) as exc:
            m_no_entity.validate_predicate({"groups": [], "thresholds": [bad]})
        assert exc.value.translation_key == "weather_threshold_not_object"


def test_weather_validate_predicate_allows_unknown_group_and_unset_entity(
    hass: HomeAssistant,
) -> None:
    _install_store_stub_groups(hass, entity=None, groups=[])
    cond = WeatherCondition(hass=hass)
    cond.validate_predicate({"groups": ["ghost"]})  # must not raise


def test_is_constraining_only_with_groups_or_thresholds() -> None:
    """{groups: [], thresholds: []} matches everything — a sorting wildcard,
    not a real constraint (mirrors lux/occupancy)."""
    m = WeatherCondition()
    assert m.is_constraining({"groups": ["sunny"], "thresholds": []}) is True
    assert (
        m.is_constraining(
            {"groups": [], "thresholds": [{"attribute": "humidity", "op": "<", "value": 50}]}
        )
        is True
    )
    assert m.is_constraining({"groups": [], "thresholds": []}) is False
    assert m.is_constraining({}) is False
    assert m.is_constraining("not-a-dict") is False


# ---------------------------------------------------------------------------
# unconfigured_reason — lines 192-201
# ---------------------------------------------------------------------------


def test_unconfigured_reason_inactive_predicate_returns_none(hass: HomeAssistant) -> None:
    """Inactive predicate (no groups, no thresholds) → no reason regardless of entity."""
    _install_store_stub_groups(hass, entity=None, groups=[])
    m = WeatherCondition(hass=hass)
    assert m.unconfigured_reason({"groups": [], "thresholds": []}, _snap()) is None
    assert m.unconfigured_reason(None, _snap()) is None
    assert m.unconfigured_reason({}, _snap()) is None


def test_unconfigured_reason_no_entity_returns_reason(hass: HomeAssistant) -> None:
    """Active predicate + no entity configured → 'weather entity not configured'."""
    _install_store_stub_groups(hass, entity=None, groups=[])
    m = WeatherCondition(hass=hass)
    reason = m.unconfigured_reason({"groups": ["sunny"]}, _snap())
    assert reason == Reason("weather_entity_unconfigured")


def test_unconfigured_reason_unknown_group_returns_reason(hass: HomeAssistant) -> None:
    """Active predicate + entity set + group id unknown → reason naming the group."""
    _install_store_stub_groups(
        hass,
        entity="weather.home",
        groups=[{"id": "sunny", "label": "Sunny", "conditions": ["sunny"]}],
    )
    m = WeatherCondition(hass=hass)
    reason = m.unconfigured_reason({"groups": ["ghost"]}, _snap())
    assert reason == Reason("weather_group_missing", {"group": "ghost"})


def test_unconfigured_reason_all_configured_returns_none(hass: HomeAssistant) -> None:
    """Active predicate + entity set + all groups known → None."""
    _install_store_stub_groups(
        hass,
        entity="weather.home",
        groups=[{"id": "sunny", "label": "Sunny", "conditions": ["sunny"]}],
    )
    m = WeatherCondition(hass=hass)
    assert m.unconfigured_reason({"groups": ["sunny"]}, _snap()) is None


def test_unconfigured_reason_skips_non_string_group_ids(hass: HomeAssistant) -> None:
    """Non-string group ids in the predicate are skipped (not flagged as unknown)."""
    _install_store_stub_groups(hass, entity="weather.home", groups=[])
    m = WeatherCondition(hass=hass)
    # groups contains a non-string — must not raise and must not flag it
    assert m.unconfigured_reason({"groups": [None, 42]}, _snap()) is None


async def test_snapshot_drops_non_finite_attributes(hass: HomeAssistant) -> None:
    """NaN/inf readings are unobservable: NaN fails every threshold comparison,
    so they must not reach the snapshot at all."""
    _install_store_stub(hass, entity="weather.home")
    hass.states.async_set(
        "weather.home",
        "sunny",
        {"temperature": float("nan"), "humidity": 40, "wind_speed": float("inf")},
    )
    snap = await WeatherCondition().snapshot(hass)
    assert snap.attributes == {"humidity": 40.0}
