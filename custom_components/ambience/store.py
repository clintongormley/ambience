"""Persistent store for Ambience configuration."""

from __future__ import annotations

import json
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION
from .matchers.weather import DEFAULT_WEATHER_GROUPS

_LOGGER = logging.getLogger(__name__)


class AmbienceStore:
    """Typed wrapper over HA's Store for Ambience data."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: dict[str, Any] = self._empty()

    @staticmethod
    def _empty() -> dict[str, Any]:
        return {
            "version": STORAGE_VERSION,
            "areas": {},
            "floors": {},
            "house": {"rules": [], "auto_sort": True},
            "matchers": {
                "time_of_day": {"custom": {}, "hidden": []},
                "day": {"workday_sensor": None, "workday_calendar": None},
                "weather": {"entity": None, "groups": list(DEFAULT_WEATHER_GROUPS)},
            },
        }

    @staticmethod
    def _migrate_one_action(action: dict[str, Any]) -> list[dict[str, Any]]:
        """Convert a single action dict from old to new shape.

        Returns one or more new-shape actions. New-shape actions are passed
        through unchanged. Old-shape actions (with `targets` dict) are split
        by params group into one new-shape action per distinct params dict.
        """
        if "entity_ids" in action and "params" in action:
            return [action]
        targets = action.get("targets")
        if not isinstance(targets, dict):
            return [action]
        if not targets:
            return [
                {
                    "action": action.get("action", ""),
                    "entity_ids": [],
                    "params": {},
                }
            ]
        groups: dict[str, dict[str, Any]] = {}
        for entity_id, params in targets.items():
            key = json.dumps(params, sort_keys=True)
            if key not in groups:
                groups[key] = {
                    "action": action.get("action", ""),
                    "entity_ids": [],
                    "params": params,
                }
            groups[key]["entity_ids"].append(entity_id)
        return list(groups.values())

    def _migrate_actions(self) -> None:
        """Walk every persisted rule and convert old-shape actions to new shape."""
        for area_cfg in self._data.get("areas", {}).values():
            for rule in area_cfg.get("rules", []):
                new_actions: list[dict[str, Any]] = []
                for action in rule.get("actions", []):
                    new_actions.extend(self._migrate_one_action(action))
                rule["actions"] = new_actions

    @staticmethod
    def _migrate_period_in_predicate(pred: Any) -> Any:
        """Rename old period ids (night→nighttime, day→daytime) inside a
        time_of_day predicate. Idempotent and lossless for already-renamed
        predicates. Returns the (possibly new) predicate value."""
        renames = {"night": "nighttime", "day": "daytime"}
        if isinstance(pred, list):
            return [AmbienceStore._migrate_period_in_predicate(item) for item in pred]
        if isinstance(pred, dict) and "period" in pred:
            new_pid = renames.get(pred["period"], pred["period"])
            if new_pid != pred["period"]:
                return {**pred, "period": new_pid}
        return pred

    def _migrate_periods(self) -> None:
        """Walk every persisted rule and rename old period ids in time_of_day predicates,
        and rename old period ids in the time_of_day_periods.custom map."""
        # Rules
        for area_cfg in self._data.get("areas", {}).values():
            for rule in area_cfg.get("rules", []):
                when = rule.get("when", {})
                if "time_of_day" in when:
                    when["time_of_day"] = self._migrate_period_in_predicate(when["time_of_day"])
        # Custom-period store
        periods_data = self._data.get("time_of_day_periods", {})
        custom = periods_data.get("custom", {})
        if "night" in custom:
            custom["nighttime"] = custom.pop("night")
        if "day" in custom:
            custom["daytime"] = custom.pop("day")
        # Hidden list
        hidden = periods_data.get("hidden", [])
        periods_data["hidden"] = [
            "nighttime" if h == "night" else "daytime" if h == "day" else h for h in hidden
        ]

    def _migrate_drop_area_matchers(self) -> None:
        """Per-area `matchers` is no longer a UI gate — drop the field from every area."""
        for area_cfg in self._data.get("areas", {}).values():
            area_cfg.pop("matchers", None)

    def _migrate_relocate_periods(self) -> None:
        """Move top-level `time_of_day_periods` to `matchers.time_of_day`."""
        if "time_of_day_periods" not in self._data:
            return
        self._data.setdefault("matchers", {})["time_of_day"] = self._data.pop("time_of_day_periods")

    def _ensure_matchers_namespace(self) -> None:
        """Make sure `matchers.day` (and any future per-matcher key) has a default."""
        namespace = self._data.setdefault("matchers", {})
        namespace.setdefault("time_of_day", {"custom": {}, "hidden": []})
        namespace.setdefault("day", {"workday_sensor": None, "workday_calendar": None})
        weather = namespace.setdefault("weather", {})
        weather.setdefault("entity", None)
        weather.setdefault("groups", list(DEFAULT_WEATHER_GROUPS))

    def _ensure_scope_buckets(self) -> None:
        """Floors and house keys are additive — make sure they exist."""
        self._data.setdefault("floors", {})
        self._data.setdefault("house", {"rules": [], "auto_sort": True})

    async def async_load(self) -> None:
        raw = await self._store.async_load()
        if raw is None:
            self._data = self._empty()
            return
        if not isinstance(raw, dict) or "areas" not in raw or not isinstance(raw["areas"], dict):
            _LOGGER.warning("ambience storage payload is malformed; starting empty")
            self._data = self._empty()
            return
        self._data = raw
        self._migrate_actions()
        self._migrate_periods()
        self._migrate_drop_area_matchers()
        self._migrate_relocate_periods()
        self._ensure_matchers_namespace()
        self._ensure_scope_buckets()

    def areas(self) -> dict[str, dict[str, Any]]:
        return dict(self._data["areas"])

    def get_area(self, area_id: str) -> dict[str, Any] | None:
        return self._data["areas"].get(area_id)

    async def async_save_area(self, area_id: str, config: dict[str, Any]) -> None:
        self._data["areas"][area_id] = config
        await self._store.async_save(self._data)

    async def async_delete_area(self, area_id: str) -> None:
        if area_id in self._data["areas"]:
            del self._data["areas"][area_id]
            await self._store.async_save(self._data)

    def floors(self) -> dict[str, dict[str, Any]]:
        return dict(self._data["floors"])

    def get_floor(self, floor_id: str) -> dict[str, Any] | None:
        return self._data["floors"].get(floor_id)

    async def async_save_floor(self, floor_id: str, config: dict[str, Any]) -> None:
        self._data["floors"][floor_id] = config
        await self._store.async_save(self._data)

    async def async_delete_floor(self, floor_id: str) -> None:
        if floor_id in self._data["floors"]:
            del self._data["floors"][floor_id]
            await self._store.async_save(self._data)

    def get_house(self) -> dict[str, Any]:
        return dict(self._data["house"])

    async def async_save_house(self, config: dict[str, Any]) -> None:
        self._data["house"] = config
        await self._store.async_save(self._data)

    def get_matcher_config(self, name: str) -> dict[str, Any]:
        """Return per-matcher config dict, with defaults applied for missing keys."""
        cfg = self._data.get("matchers", {}).get(name, {})
        if name == "time_of_day":
            return {
                "custom": cfg.get("custom", {}),
                "hidden": cfg.get("hidden", []),
            }
        if name == "day":
            return {
                "workday_sensor": cfg.get("workday_sensor"),
                "workday_calendar": cfg.get("workday_calendar"),
            }
        if name == "weather":
            groups = cfg.get("groups")
            if groups is None:
                groups = list(DEFAULT_WEATHER_GROUPS)
            return {"entity": cfg.get("entity"), "groups": groups}
        return dict(cfg)

    async def async_save_matcher_config(self, name: str, config: dict[str, Any]) -> None:
        self._data.setdefault("matchers", {})[name] = config
        await self._store.async_save(self._data)

    def get_periods(self) -> dict[str, Any]:
        return self.get_matcher_config("time_of_day")

    async def async_save_periods(self, payload: dict[str, Any]) -> None:
        await self.async_save_matcher_config("time_of_day", payload)
