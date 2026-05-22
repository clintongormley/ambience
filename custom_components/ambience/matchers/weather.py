"""Built-in `weather` matcher — condition + numeric-threshold predicate."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from homeassistant.core import HomeAssistant

WEATHER_CONDITIONS = (
    "clear-night",
    "cloudy",
    "fog",
    "hail",
    "lightning",
    "lightning-rainy",
    "partlycloudy",
    "pouring",
    "rainy",
    "snowy",
    "snowy-rainy",
    "sunny",
    "windy",
    "windy-variant",
    "exceptional",
)
THRESHOLD_ATTRIBUTES = (
    "temperature",
    "apparent_temperature",
    "humidity",
    "wind_speed",
    "pressure",
)
THRESHOLD_OPS = ("<", "<=", ">", ">=")

_UNAVAILABLE = ("unknown", "unavailable")


@dataclass(frozen=True)
class WeatherSnapshot:
    condition: str | None
    attributes: dict[str, float]


def _op_satisfied(actual: float, op: str, value: float) -> bool:
    if op == "<":
        return actual < value
    if op == "<=":
        return actual <= value
    if op == ">":
        return actual > value
    if op == ">=":
        return actual >= value
    return False


class WeatherMatcher:
    name = "weather"
    description = "Matches the current weather condition and attribute thresholds."
    predicate_help = (
        "Object {conditions: [...], thresholds: [{attribute, op, value}]}. "
        "Matches when the condition is in `conditions` (empty = any) and every "
        "threshold holds. Operators: < <= > >=."
    )
    toggleable = True
    input = "weather_predicate"
    priority = 300

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    def _entity(self) -> str | None:
        hass = self._hass
        if hass is None:
            return None
        from ..const import DATA_STORE, DOMAIN

        store = hass.data.get(DOMAIN, {}).get(DATA_STORE)
        if store is None:
            return None
        return store.get_matcher_config("weather").get("entity")

    async def snapshot(self, hass: HomeAssistant) -> WeatherSnapshot:
        from ..const import DATA_STORE, DOMAIN

        store = hass.data[DOMAIN][DATA_STORE]
        entity_id = store.get_matcher_config("weather").get("entity")
        if not entity_id:
            return WeatherSnapshot(condition=None, attributes={})
        state = hass.states.get(entity_id)
        if state is None or state.state in _UNAVAILABLE:
            return WeatherSnapshot(condition=None, attributes={})
        attributes: dict[str, float] = {}
        for key, val in state.attributes.items():
            if isinstance(val, bool):
                continue
            if isinstance(val, (int, float)):
                attributes[key] = float(val)
        return WeatherSnapshot(condition=state.state, attributes=attributes)

    def matches(self, predicate: Any, snapshot: WeatherSnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        conditions = predicate.get("conditions") or []
        thresholds = predicate.get("thresholds") or []
        cond_ok = not conditions or snapshot.condition in conditions
        thr_ok = all(self._threshold_ok(t, snapshot) for t in thresholds)
        return cond_ok and thr_ok

    @staticmethod
    def _threshold_ok(t: Any, snap: WeatherSnapshot) -> bool:
        if not isinstance(t, dict):
            return False
        attr = t.get("attribute")
        if attr not in snap.attributes:
            return False
        value = t.get("value")
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            return False
        return _op_satisfied(snap.attributes[attr], t.get("op"), float(value))

    def describe(self, snapshot: WeatherSnapshot) -> str | None:
        return snapshot.condition

    def validate_predicate(self, predicate: Any) -> None:
        raise NotImplementedError  # implemented in Task A3
