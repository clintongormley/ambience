"""Built-in `weather` condition — weather state + numeric-threshold predicate."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import get_store
from ..triggers import EMPTY, TriggerSpec
from ._common import UNAVAILABLE

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


class WeatherCondition:
    name = "weather"
    description = "Matches the current weather condition and attribute thresholds."
    predicate_help = (
        "Object {groups: [group_id, ...], thresholds: [{attribute, op, value}]}. "
        "Matches when the current weather condition belongs to one of the selected "
        "`groups` (empty = any) and every threshold holds. Operators: < <= > >=."
    )
    input = "weather_predicate"
    priority = 700

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    def _entity(self) -> str | None:
        if self._hass is None:
            return None
        store = get_store(self._hass)
        if store is None:
            return None
        return store.get_condition_config("weather").get("entity")

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: datetime | None = None,
        entities: frozenset[str] | None = None,  # part of the shared contract; not entity-driven
    ) -> WeatherSnapshot:
        from ..const import DATA_STORE, DOMAIN

        store = hass.data[DOMAIN][DATA_STORE]
        entity_id = store.get_condition_config("weather").get("entity")
        if not entity_id:
            return WeatherSnapshot(condition=None, attributes={})
        state = hass.states.get(entity_id)
        if state is None or state.state in UNAVAILABLE:
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
        groups = predicate.get("groups") or []
        thresholds = predicate.get("thresholds") or []
        if groups:
            allowed = self._allowed_conditions(groups)
            if snapshot.condition not in allowed:
                return False
        return all(self._threshold_ok(t, snapshot) for t in thresholds)

    def _configured_groups(self) -> list[dict[str, Any]]:
        if self._hass is None:
            return []
        store = get_store(self._hass)
        if store is None:
            return []
        return list(store.get_condition_config("weather").get("groups") or [])

    def _allowed_conditions(self, group_ids: list[str]) -> set[str]:
        allowed: set[str] = set()
        wanted = set(group_ids)
        for group in self._configured_groups():
            if group.get("id") in wanted:
                allowed.update(group.get("conditions") or [])
        return allowed

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

    def describe(self, snapshot: WeatherSnapshot, predicate: Any = None) -> str | None:
        return snapshot.condition

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise ValueError(f"weather predicate must be an object or null: {predicate!r}")
        groups = predicate.get("groups", [])
        thresholds = predicate.get("thresholds", [])
        if not isinstance(groups, list):
            raise ValueError("weather `groups` must be a list")
        if not isinstance(thresholds, list):
            raise ValueError("weather `thresholds` must be a list")
        for g in groups:
            if not isinstance(g, str) or not g:
                raise ValueError(f"weather group id must be a non-empty string: {g!r}")
        if groups and self._hass is not None:
            known = {gr.get("id") for gr in self._configured_groups()}
            for g in groups:
                if g not in known:
                    raise ValueError(f"unknown weather group: {g!r}")
        for t in thresholds:
            self._validate_threshold(t)
        if (groups or thresholds) and self._hass is not None and not self._entity():
            raise ValueError("weather predicate requires the weather entity to be configured")

    # --- sorting (containment lattice) ----------------------------------

    def is_constraining(self, predicate: Any) -> bool:
        """{groups: [], thresholds: []} matches everything (see matches()) — a
        sorting wildcard, not a real constraint (mirrors lux/occupancy)."""
        return isinstance(predicate, dict) and bool(
            predicate.get("groups") or predicate.get("thresholds")
        )

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        if not isinstance(predicate, dict):
            return EMPTY
        if not (predicate.get("groups") or predicate.get("thresholds")):
            return EMPTY
        entity = self._entity()
        return TriggerSpec(entities=frozenset({entity}) if entity else frozenset())

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
