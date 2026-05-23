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

DEFAULT_WEATHER_GROUPS: list[dict[str, Any]] = [
    {"id": "sunny", "label": "Sunny", "conditions": ["sunny"]},
    {"id": "dim", "label": "Dim", "conditions": ["cloudy", "partlycloudy", "rainy"]},
    {
        "id": "dark",
        "label": "Dark",
        "conditions": [
            "clear-night",
            "fog",
            "hail",
            "lightning",
            "lightning-rainy",
            "pouring",
            "snowy",
            "snowy-rainy",
            "exceptional",
        ],
    },
    {
        "id": "wet",
        "label": "Wet",
        "conditions": [
            "hail",
            "lightning",
            "lightning-rainy",
            "pouring",
            "rainy",
            "snowy",
            "snowy-rainy",
        ],
    },
    {
        "id": "windy",
        "label": "Windy",
        "conditions": ["windy", "windy-variant", "exceptional"],
    },
]

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
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise ValueError(f"weather predicate must be an object or null: {predicate!r}")
        conditions = predicate.get("conditions", [])
        thresholds = predicate.get("thresholds", [])
        if not isinstance(conditions, list):
            raise ValueError("weather `conditions` must be a list")
        if not isinstance(thresholds, list):
            raise ValueError("weather `thresholds` must be a list")
        for cond in conditions:
            if cond not in WEATHER_CONDITIONS:
                raise ValueError(f"unknown weather condition: {cond!r}")
        for t in thresholds:
            self._validate_threshold(t)
        if (conditions or thresholds) and not self._entity():
            raise ValueError("weather predicate requires the weather entity to be configured")

    @staticmethod
    def _validate_threshold(t: Any) -> None:
        if not isinstance(t, dict):
            raise ValueError(f"weather threshold must be an object: {t!r}")
        if t.get("attribute") not in THRESHOLD_ATTRIBUTES:
            raise ValueError(f"unknown weather attribute: {t.get('attribute')!r}")
        if t.get("op") not in THRESHOLD_OPS:
            raise ValueError(f"invalid threshold operator: {t.get('op')!r}")
        value = t.get("value")
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            raise ValueError(f"threshold value must be a number: {value!r}")
