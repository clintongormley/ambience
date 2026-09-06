"""Built-in `weather` condition — weather state + numeric-threshold predicate."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import DATA_STORE, DOMAIN, get_store
from ..errors import AmbienceError
from ..triggers import EMPTY, TriggerSpec
from ._common import UNAVAILABLE, Reason, as_float, compare_numeric, predicate_has_any

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


def weather_predicate_active(pred: Any) -> bool:
    """Whether a weather predicate actually constrains (non-empty groups or
    thresholds). The single home of this rule — shared by sorting/shadow
    detection (via is_constraining) and the dangling-weather-warning walk."""
    return predicate_has_any(pred, "groups", "thresholds")


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
        # Strict index: snapshot() only runs after setup, so a missing store is a
        # bug, not a state to tolerate.
        store = hass.data[DOMAIN][DATA_STORE]
        entity_id = store.get_condition_config("weather").get("entity")
        if not entity_id:
            return WeatherSnapshot(condition=None, attributes={})
        state = hass.states.get(entity_id)
        if state is None or state.state in UNAVAILABLE:
            return WeatherSnapshot(condition=None, attributes={})
        attributes: dict[str, float] = {}
        for key, val in state.attributes.items():
            coerced = as_float(val)
            if coerced is not None:
                attributes[key] = coerced
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
        value = as_float(t.get("value"))
        if value is None:
            return False
        return compare_numeric(snap.attributes[attr], t.get("op"), value)

    def unconfigured_reason(self, predicate: Any, snapshot: WeatherSnapshot) -> Reason | None:
        if not weather_predicate_active(predicate):
            return None
        if not self._entity():
            return Reason("weather_entity_unconfigured")
        known = {g.get("id") for g in self._configured_groups()}
        for gid in predicate.get("groups") or []:
            if isinstance(gid, str) and gid not in known:
                return Reason("weather_group_missing", {"group": gid})
        return None

    def describe(self, snapshot: WeatherSnapshot, predicate: Any = None) -> str | None:
        return snapshot.condition

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise AmbienceError("weather_predicate_not_object", predicate=predicate)
        groups = predicate.get("groups", [])
        thresholds = predicate.get("thresholds", [])
        if not isinstance(groups, list):
            raise AmbienceError("weather_groups_not_list")
        if not isinstance(thresholds, list):
            raise AmbienceError("weather_thresholds_not_list")
        for g in groups:
            if not isinstance(g, str) or not g:
                raise AmbienceError("weather_group_id_empty", gid=g)
        for t in thresholds:
            self._validate_threshold(t)

    # --- sorting (containment lattice) ----------------------------------

    def is_constraining(self, predicate: Any) -> bool:
        """{groups: [], thresholds: []} matches everything (see matches()) — a
        sorting wildcard, not a real constraint (mirrors lux/occupancy)."""
        return weather_predicate_active(predicate)

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
            raise AmbienceError("weather_threshold_not_object", value=t)
        if t.get("attribute") not in THRESHOLD_ATTRIBUTES:
            raise AmbienceError("weather_unknown_attribute", attribute=t.get("attribute"))
        if t.get("op") not in THRESHOLD_OPS:
            raise AmbienceError("weather_invalid_operator", op=t.get("op"))
        value = t.get("value")
        if as_float(value) is None:
            raise AmbienceError("weather_threshold_not_number", value=value)
