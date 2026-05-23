"""WeatherMatcher — condition + numeric-threshold predicate."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.matchers.weather import (
    DEFAULT_WEATHER_GROUPS,
    WEATHER_CONDITIONS,
    WeatherMatcher,
    WeatherSnapshot,
)


def _install_store_stub(hass: HomeAssistant, entity: str | None = None) -> None:
    class _Store:
        def get_matcher_config(self, name: str) -> dict[str, object]:
            return {"entity": entity} if name == "weather" else {}

    hass.data.setdefault(DOMAIN, {})[DATA_STORE] = _Store()


def _snap(condition: str | None = "sunny", **attrs: float) -> WeatherSnapshot:
    return WeatherSnapshot(condition=condition, attributes=dict(attrs))


def test_protocol_fields() -> None:
    m = WeatherMatcher()
    assert m.name == "weather"
    assert m.toggleable is True
    assert m.input == "weather_predicate"
    assert m.priority == 300
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


async def test_snapshot_unset_entity(hass: HomeAssistant) -> None:
    _install_store_stub(hass, entity=None)
    snap = await WeatherMatcher().snapshot(hass)
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
    snap = await WeatherMatcher().snapshot(hass)
    assert snap.condition == "rainy"
    assert snap.attributes == {"temperature": 4.5, "humidity": 90.0, "wind_speed": 12.0}


async def test_snapshot_unavailable_entity(hass: HomeAssistant) -> None:
    _install_store_stub(hass, entity="weather.home")
    hass.states.async_set("weather.home", "unavailable", {})
    snap = await WeatherMatcher().snapshot(hass)
    assert snap.condition is None


async def test_snapshot_unknown_state(hass: HomeAssistant) -> None:
    _install_store_stub(hass, entity="weather.home")
    hass.states.async_set("weather.home", "unknown", {})
    snap = await WeatherMatcher().snapshot(hass)
    assert snap.condition is None


async def test_snapshot_entity_configured_but_absent(hass: HomeAssistant) -> None:
    _install_store_stub(hass, entity="weather.home")  # never async_set → state is None
    snap = await WeatherMatcher().snapshot(hass)
    assert snap.condition is None
    assert snap.attributes == {}


async def test_snapshot_excludes_bool_attributes(hass: HomeAssistant) -> None:
    _install_store_stub(hass, entity="weather.home")
    hass.states.async_set("weather.home", "sunny", {"temperature": 20.0, "is_daytime": True})
    snap = await WeatherMatcher().snapshot(hass)
    assert snap.attributes == {"temperature": 20.0}


def test_matches_condition_in_set() -> None:
    m = WeatherMatcher()
    pred = {"conditions": ["rainy", "pouring"], "thresholds": []}
    assert m.matches(pred, _snap("rainy")) is True
    assert m.matches(pred, _snap("sunny")) is False


def test_matches_empty_conditions_is_any() -> None:
    m = WeatherMatcher()
    pred = {"conditions": [], "thresholds": []}
    assert m.matches(pred, _snap("sunny")) is True
    assert m.matches(None, _snap("sunny")) is True


def test_matches_none_condition() -> None:
    m = WeatherMatcher()
    pred = {"conditions": ["rainy"], "thresholds": []}
    assert m.matches(pred, _snap(None)) is False


def test_matches_thresholds_each_operator() -> None:
    m = WeatherMatcher()
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
    m = WeatherMatcher()
    pred = {"conditions": [], "thresholds": [{"attribute": "pressure", "op": "<", "value": 1000}]}
    assert m.matches(pred, _snap("rainy", temperature=4.0)) is False


def test_matches_condition_and_threshold_anded() -> None:
    m = WeatherMatcher()
    pred = {
        "conditions": ["rainy"],
        "thresholds": [{"attribute": "temperature", "op": "<", "value": 5}],
    }
    assert m.matches(pred, _snap("rainy", temperature=4.0)) is True
    assert m.matches(pred, _snap("rainy", temperature=8.0)) is False
    assert m.matches(pred, _snap("sunny", temperature=4.0)) is False


def test_matches_non_dict_is_false() -> None:
    assert WeatherMatcher().matches(42, _snap("sunny")) is False


@pytest.fixture
def m_with_entity(hass: HomeAssistant) -> WeatherMatcher:
    _install_store_stub(hass, entity="weather.home")
    return WeatherMatcher(hass=hass)


@pytest.fixture
def m_no_entity(hass: HomeAssistant) -> WeatherMatcher:
    _install_store_stub(hass, entity=None)
    return WeatherMatcher(hass=hass)


def test_validate_accepts_null_and_empty(m_no_entity: WeatherMatcher) -> None:
    m_no_entity.validate_predicate(None)
    # inactive → no entity needed
    m_no_entity.validate_predicate({"conditions": [], "thresholds": []})


def test_validate_rejects_non_dict(m_no_entity: WeatherMatcher) -> None:
    with pytest.raises(ValueError):
        m_no_entity.validate_predicate(42)


def test_validate_rejects_unknown_condition(m_with_entity: WeatherMatcher) -> None:
    with pytest.raises(ValueError, match="condition"):
        m_with_entity.validate_predicate({"conditions": ["drizzle"], "thresholds": []})


@pytest.mark.parametrize(
    "threshold",
    [
        {"attribute": "nope", "op": "<", "value": 5},
        {"attribute": "temperature", "op": "==", "value": 5},
        {"attribute": "temperature", "op": "<", "value": "5"},
        {"attribute": "temperature", "op": "<", "value": True},
        {"attribute": "temperature", "op": "<"},
    ],
)
def test_validate_rejects_bad_threshold(m_with_entity: WeatherMatcher, threshold) -> None:
    with pytest.raises(ValueError):
        m_with_entity.validate_predicate({"conditions": [], "thresholds": [threshold]})


def test_validate_active_predicate_requires_entity(m_no_entity: WeatherMatcher) -> None:
    with pytest.raises(ValueError, match="weather entity"):
        m_no_entity.validate_predicate({"conditions": ["rainy"], "thresholds": []})
    with pytest.raises(ValueError, match="weather entity"):
        m_no_entity.validate_predicate(
            {"conditions": [], "thresholds": [{"attribute": "temperature", "op": "<", "value": 5}]}
        )


def test_validate_accepts_well_formed(m_with_entity: WeatherMatcher) -> None:
    m_with_entity.validate_predicate(
        {
            "conditions": ["rainy", "pouring"],
            "thresholds": [
                {"attribute": "temperature", "op": "<", "value": 5},
                {"attribute": "humidity", "op": ">=", "value": 80},
            ],
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
