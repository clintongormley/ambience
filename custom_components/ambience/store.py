"""Persistent store for Ambience configuration."""

from __future__ import annotations

import json
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS,
    DEFAULT_SWITCH_NAME,
    STORAGE_KEY,
    STORAGE_VERSION,
)
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
            "switch_defaults": {
                "name": DEFAULT_SWITCH_NAME,
                "auto_on_delay_seconds": DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS,
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

    def _ensure_switch_defaults(self) -> None:
        sd = self._data.setdefault("switch_defaults", {})
        sd.setdefault("name", DEFAULT_SWITCH_NAME)
        sd.setdefault("auto_on_delay_seconds", DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS)

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
        self._ensure_switch_defaults()

    def areas(self) -> dict[str, dict[str, Any]]:
        return dict(self._data["areas"])

    def get_area(self, area_id: str) -> dict[str, Any] | None:
        return self._data["areas"].get(area_id)

    async def async_save_area(self, area_id: str, config: dict[str, Any]) -> None:
        existing = self._data["areas"].get(area_id, {})
        self._data["areas"][area_id] = {**existing, **config}
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
        existing = self._data["floors"].get(floor_id, {})
        self._data["floors"][floor_id] = {**existing, **config}
        await self._store.async_save(self._data)

    async def async_delete_floor(self, floor_id: str) -> None:
        if floor_id in self._data["floors"]:
            del self._data["floors"][floor_id]
            await self._store.async_save(self._data)

    def get_house(self) -> dict[str, Any]:
        return dict(self._data["house"])

    async def async_save_house(self, config: dict[str, Any]) -> None:
        existing = self._data.get("house", {})
        self._data["house"] = {**existing, **config}
        await self._store.async_save(self._data)

    def all_scope_configs(self) -> list[tuple[str, str | None, dict[str, Any]]]:
        """Yield (kind, scope_id, config) for every configured scope.

        `scope_id` is None for the house. Used by handlers that walk every
        rule list to gather dangling-reference warnings.
        """
        triples: list[tuple[str, str | None, dict[str, Any]]] = []
        for area_id, cfg in self._data.get("areas", {}).items():
            triples.append(("area", area_id, cfg))
        for floor_id, cfg in self._data.get("floors", {}).items():
            triples.append(("floor", floor_id, cfg))
        triples.append(("house", None, self._data.get("house", {"rules": [], "auto_sort": True})))
        return triples

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

    # -------------------------------------------------------------------------
    # Switch defaults + per-scope overrides
    # -------------------------------------------------------------------------

    _SCOPE_KINDS = ("house", "floor", "area")

    def _scope_container(self, scope_kind: str, scope_id: str | None) -> dict[str, Any]:
        """Return the per-scope config dict (creating a bare shell if needed).

        Used internally by switch helpers so they can read/write the `switch`
        sub-dict regardless of whether rules have been saved for the scope.
        """
        if scope_kind == "house":
            self._data.setdefault("house", {"rules": [], "auto_sort": True})
            return self._data["house"]
        if scope_kind == "floor":
            return self._data["floors"].setdefault(scope_id, {"rules": [], "auto_sort": True})
        if scope_kind == "area":
            return self._data["areas"].setdefault(scope_id, {"rules": [], "auto_sort": True})
        raise ValueError(f"unknown scope_kind: {scope_kind!r}")

    @staticmethod
    def _validate_switch_defaults(payload: dict[str, Any]) -> None:
        name = payload.get("name")
        if not isinstance(name, str) or not name.strip():
            raise ValueError(f"switch defaults `name` must be a non-empty string: {name!r}")
        delay = payload.get("auto_on_delay_seconds")
        if not isinstance(delay, int) or isinstance(delay, bool) or delay < 0:
            raise ValueError(
                f"switch defaults `auto_on_delay_seconds` must be a non-negative int: {delay!r}"
            )

    @staticmethod
    def _validate_scope_switch(payload: dict[str, Any]) -> None:
        name = payload.get("name")
        if name is not None and (not isinstance(name, str) or not name.strip()):
            raise ValueError(f"scope switch `name` must be a non-empty string or null: {name!r}")
        delay = payload.get("auto_on_delay_seconds")
        if delay is not None and (
            not isinstance(delay, int) or isinstance(delay, bool) or delay < 0
        ):
            raise ValueError(
                "scope switch `auto_on_delay_seconds` must be a non-negative int"
                f" or null: {delay!r}"
            )

    def get_switch_defaults(self) -> dict[str, Any]:
        sd = self._data.get("switch_defaults", {})
        return {
            "name": sd.get("name", DEFAULT_SWITCH_NAME),
            "auto_on_delay_seconds": sd.get(
                "auto_on_delay_seconds", DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS
            ),
        }

    async def async_save_switch_defaults(self, payload: dict[str, Any]) -> None:
        self._validate_switch_defaults(payload)
        self._data["switch_defaults"] = {
            "name": payload["name"],
            "auto_on_delay_seconds": payload["auto_on_delay_seconds"],
        }
        await self._store.async_save(self._data)

    def get_scope_switch_config(self, scope_kind: str, scope_id: str | None) -> dict[str, Any]:
        """Raw per-scope override; missing → all-inherit."""
        if scope_kind not in self._SCOPE_KINDS:
            raise ValueError(f"unknown scope_kind: {scope_kind!r}")
        if scope_kind == "house":
            cfg = self._data.get("house", {})
        elif scope_kind == "floor":
            cfg = self._data.get("floors", {}).get(scope_id, {})
        else:
            cfg = self._data.get("areas", {}).get(scope_id, {})
        sw = cfg.get("switch", {})
        return {
            "name": sw.get("name"),
            "auto_on_delay_seconds": sw.get("auto_on_delay_seconds"),
            "off_at": sw.get("off_at"),
        }

    async def async_save_scope_switch(
        self, scope_kind: str, scope_id: str | None, payload: dict[str, Any]
    ) -> None:
        if scope_kind not in self._SCOPE_KINDS:
            raise ValueError(f"unknown scope_kind: {scope_kind!r}")
        self._validate_scope_switch(payload)
        container = self._scope_container(scope_kind, scope_id)
        sw = container.setdefault("switch", {})
        sw["name"] = payload.get("name")
        sw["auto_on_delay_seconds"] = payload.get("auto_on_delay_seconds")
        # off_at is owned by the entity; never written via this method.
        await self._store.async_save(self._data)

    def resolved_scope_switch_config(self, scope_kind: str, scope_id: str | None) -> dict[str, Any]:
        defaults = self.get_switch_defaults()
        override = self.get_scope_switch_config(scope_kind, scope_id)
        return {
            "name": override["name"] if override["name"] is not None else defaults["name"],
            "auto_on_delay_seconds": (
                override["auto_on_delay_seconds"]
                if override["auto_on_delay_seconds"] is not None
                else defaults["auto_on_delay_seconds"]
            ),
            "off_at": override["off_at"],
        }

    async def async_set_scope_switch_off_at(
        self, scope_kind: str, scope_id: str | None, off_at: str | None
    ) -> None:
        if scope_kind not in self._SCOPE_KINDS:
            raise ValueError(f"unknown scope_kind: {scope_kind!r}")
        container = self._scope_container(scope_kind, scope_id)
        sw = container.setdefault("switch", {})
        sw["off_at"] = off_at
        await self._store.async_save(self._data)
