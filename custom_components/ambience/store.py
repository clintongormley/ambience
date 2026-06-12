"""Persistent store for Ambience configuration."""

from __future__ import annotations

import copy
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store

from .conditions.weather import DEFAULT_WEATHER_GROUPS
from .const import (
    DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS,
    DEFAULT_SWITCH_NAME,
    GENERAL_CATEGORY,
    SIGNAL_CONFIG_CHANGED,
    STORAGE_KEY,
    STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)


class LastCategoryError(ValueError):
    """Raised when deleting the only remaining category."""


class CategoryInUseError(ValueError):
    """Raised when deleting a category that still has scenes in some scope."""


def reassign_orphan_scenes(scenes: list[dict[str, Any]], known: set[str], target: str) -> bool:
    """Point any scene with no category or an unknown category at `target`. Mutates the
    scenes in place; returns True if anything was changed. Used by the websocket's
    save-time coercion to keep every persisted scene pointed at a real category."""
    changed = False
    for scene in scenes:
        cid = scene.get("category")
        if cid is None or cid not in known:
            scene["category"] = target
            changed = True
    return changed


class AmbienceStore:
    """Typed wrapper over HA's Store for Ambience data."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: dict[str, Any] = self._empty()

    def _notify_config_changed(self, affected: tuple[str, str | None] | None = None) -> None:
        """Tell the auto-trigger engine a config save happened, and narrow the
        follow-up re-apply: pass a (scope_kind, scope_id) for a scope-local
        change, or None for a global change (reapply everything)."""
        async_dispatcher_send(self._hass, SIGNAL_CONFIG_CHANGED, affected)

    @staticmethod
    def _empty() -> dict[str, Any]:
        return {
            "version": STORAGE_VERSION,
            "categories": [dict(GENERAL_CATEGORY)],
            "areas": {},
            "floors": {},
            "house": {"scenes": []},
            "conditions": {
                "time_of_day": {"custom": {}, "hidden": []},
                "day": {"workday_sensor": None, "workday_calendar": None},
                "weather": {"entity": None, "groups": list(DEFAULT_WEATHER_GROUPS)},
                "lux": {"custom": {}, "hidden": []},
            },
            "switch_defaults": {
                "name": DEFAULT_SWITCH_NAME,
                "auto_on_delay_seconds": DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS,
            },
            "exposed_actions": [],
        }

    def _ensure_conditions_namespace(self) -> None:
        """Make sure `conditions.day` (and any future per-condition key) has a default."""
        namespace = self._data.setdefault("conditions", {})
        namespace.setdefault("time_of_day", {"custom": {}, "hidden": []})
        namespace.setdefault("day", {"workday_sensor": None, "workday_calendar": None})
        weather = namespace.setdefault("weather", {})
        weather.setdefault("entity", None)
        weather.setdefault("groups", list(DEFAULT_WEATHER_GROUPS))
        namespace.setdefault("lux", {"custom": {}, "hidden": []})

    def _ensure_scope_buckets(self) -> None:
        """Floors and house keys are additive — make sure they exist."""
        self._data.setdefault("floors", {})
        self._data.setdefault("house", {"scenes": []})

    def _ensure_categories(self) -> None:
        """Seed the General category when no categories exist. Categories are
        required: a store must always have at least one."""
        if not self._data.get("categories"):
            self._data["categories"] = [dict(GENERAL_CATEGORY)]

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
        self._ensure_conditions_namespace()
        self._ensure_scope_buckets()
        self._ensure_categories()
        self._ensure_switch_defaults()

    def as_dict(self) -> dict[str, Any]:
        """A deep copy of the full persisted payload, for diagnostics dumps."""
        return copy.deepcopy(self._data)

    def areas(self) -> dict[str, dict[str, Any]]:
        return dict(self._data["areas"])

    def get_area(self, area_id: str) -> dict[str, Any] | None:
        return self._data["areas"].get(area_id)

    async def async_save_area(self, area_id: str, config: dict[str, Any]) -> None:
        existing = self._data["areas"].get(area_id, {})
        self._data["areas"][area_id] = {**existing, **config}
        await self._store.async_save(self._data)
        self._notify_config_changed(("area", area_id))

    async def async_delete_area(self, area_id: str) -> None:
        if area_id in self._data["areas"]:
            del self._data["areas"][area_id]
            await self._store.async_save(self._data)
            self._notify_config_changed(("area", area_id))

    def floors(self) -> dict[str, dict[str, Any]]:
        return dict(self._data["floors"])

    def get_floor(self, floor_id: str) -> dict[str, Any] | None:
        return self._data["floors"].get(floor_id)

    async def async_save_floor(self, floor_id: str, config: dict[str, Any]) -> None:
        existing = self._data["floors"].get(floor_id, {})
        self._data["floors"][floor_id] = {**existing, **config}
        await self._store.async_save(self._data)
        self._notify_config_changed(("floor", floor_id))

    async def async_delete_floor(self, floor_id: str) -> None:
        if floor_id in self._data["floors"]:
            del self._data["floors"][floor_id]
            await self._store.async_save(self._data)
            self._notify_config_changed(("floor", floor_id))

    def get_house(self) -> dict[str, Any]:
        return dict(self._data["house"])

    async def async_save_house(self, config: dict[str, Any]) -> None:
        existing = self._data.get("house", {})
        self._data["house"] = {**existing, **config}
        await self._store.async_save(self._data)
        self._notify_config_changed(("house", None))

    def all_scope_configs(self) -> list[tuple[str, str | None, dict[str, Any]]]:
        """Yield (kind, scope_id, config) for every configured scope.

        `scope_id` is None for the house. Used by handlers that walk every
        scene list to gather dangling-reference warnings.
        """
        triples: list[tuple[str, str | None, dict[str, Any]]] = []
        for area_id, cfg in self._data.get("areas", {}).items():
            triples.append(("area", area_id, cfg))
        for floor_id, cfg in self._data.get("floors", {}).items():
            triples.append(("floor", floor_id, cfg))
        triples.append(("house", None, self._data.get("house", {"scenes": []})))
        return triples

    def categories(self) -> list[dict[str, Any]]:
        """The global ordered categories list (a copy)."""
        return [dict(c) for c in self._data.get("categories", [])]

    async def async_save_categories(self, categories: list[dict[str, Any]]) -> None:
        """Replace the whole categories list. Caller (websocket) validates shape;
        the store owns the same invariants the delete path enforces — at least
        one category must always exist, and a category with scenes can't be
        dropped (a stale-tab save would silently orphan them)."""
        if not categories:
            raise LastCategoryError("at least one category is required")
        new_ids = {c.get("id") for c in categories}
        in_use = {
            scene.get("category")
            for _kind, _id, cfg in self.all_scope_configs()
            for scene in cfg.get("scenes", [])
        }
        removed_in_use = sorted(cid for cid in in_use - new_ids if isinstance(cid, str))
        if removed_in_use:
            raise CategoryInUseError(f"categories still have scenes: {', '.join(removed_in_use)}")
        self._data["categories"] = [dict(c) for c in categories]
        await self._store.async_save(self._data)
        self._notify_config_changed()

    async def async_delete_category(self, category_id: str) -> None:
        """Remove a category. Refused when the category still has scenes in any
        scope, or when it is the last remaining category (a scene must always have
        a category and at least one category must always exist)."""
        categories = self._data.get("categories", [])
        if len(categories) <= 1:
            raise LastCategoryError("cannot delete the last category")
        in_use = any(
            scene.get("category") == category_id
            for _kind, _id, cfg in self.all_scope_configs()
            for scene in cfg.get("scenes", [])
        )
        if in_use:
            raise CategoryInUseError(f"category {category_id!r} still has scenes")
        self._data["categories"] = [c for c in categories if c.get("id") != category_id]
        await self._store.async_save(self._data)
        self._notify_config_changed()

    def get_conditions(self) -> dict[str, Any]:
        """A deep copy of the whole conditions namespace, for diagnostics bundles
        (cheaper than copying the entire store via :meth:`as_dict`)."""
        return copy.deepcopy(self._data.get("conditions", {}))

    def get_condition_config(self, name: str) -> dict[str, Any]:
        """Return per-condition config dict, with defaults applied for missing keys."""
        cfg = self._data.get("conditions", {}).get(name, {})
        if name in ("time_of_day", "lux"):
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

    async def async_save_condition_config(self, name: str, config: dict[str, Any]) -> None:
        self._data.setdefault("conditions", {})[name] = config
        await self._store.async_save(self._data)
        self._notify_config_changed()

    def get_periods(self) -> dict[str, Any]:
        return self.get_condition_config("time_of_day")

    async def async_save_periods(self, payload: dict[str, Any]) -> None:
        await self.async_save_condition_config("time_of_day", payload)

    def get_lux_ranges(self) -> dict[str, Any]:
        return self.get_condition_config("lux")

    async def async_save_lux_ranges(self, payload: dict[str, Any]) -> None:
        await self.async_save_condition_config("lux", payload)

    # -------------------------------------------------------------------------
    # Switch defaults + per-scope off-at state
    # -------------------------------------------------------------------------

    _SCOPE_KINDS = ("house", "floor", "area")

    def _scope_container(self, scope_kind: str, scope_id: str | None) -> dict[str, Any]:
        """Return the per-scope config dict (creating a bare shell if needed).

        Used internally by switch helpers so they can read/write the `switch`
        sub-dict regardless of whether scenes have been saved for the scope.
        """
        if scope_kind == "house":
            self._data.setdefault("house", {"scenes": []})
            return self._data["house"]
        if scope_kind == "floor":
            return self._data["floors"].setdefault(scope_id, {"scenes": []})
        if scope_kind == "area":
            return self._data["areas"].setdefault(scope_id, {"scenes": []})
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

    def get_scope_switch_off_at(self, scope_kind: str, scope_id: str | None) -> str | None:
        """The persisted off-at timestamp for a scope's switch (``None`` if on or
        never set). ``off_at`` is runtime state owned by the switch entity, not
        user configuration — switch name and auto-on delay always come from the
        global defaults (:meth:`get_switch_defaults`)."""
        if scope_kind not in self._SCOPE_KINDS:
            raise ValueError(f"unknown scope_kind: {scope_kind!r}")
        sw = self.scope_config(scope_kind, scope_id).get("switch", {})
        return sw.get("off_at") if isinstance(sw, dict) else None

    async def async_set_scope_switch_off_at(
        self, scope_kind: str, scope_id: str | None, off_at: str | None
    ) -> None:
        if scope_kind not in self._SCOPE_KINDS:
            raise ValueError(f"unknown scope_kind: {scope_kind!r}")
        container = self._scope_container(scope_kind, scope_id)
        sw = container.setdefault("switch", {})
        sw["off_at"] = off_at
        # off_at is loss-tolerant runtime state, and a house toggle writes it
        # once per descendant switch — delay_save coalesces those N+1 writes
        # into one instead of serialising full-store saves.
        self._store.async_delay_save(lambda: self._data, 1.0)

    def get_scope_enabled(self, scope_kind: str, scope_id: str | None) -> bool:
        """Whether a scope is permanently enabled (default ``True``).

        Independent of the switch's temporary on/off (``off_at``): a scope
        applies scenes only when it is enabled AND its switch is not paused.
        """
        if scope_kind not in self._SCOPE_KINDS:
            raise ValueError(f"unknown scope_kind: {scope_kind!r}")
        return bool(self.scope_config(scope_kind, scope_id).get("enabled", True))

    async def async_set_scope_enabled(
        self, scope_kind: str, scope_id: str | None, enabled: bool
    ) -> None:
        if scope_kind not in self._SCOPE_KINDS:
            raise ValueError(f"unknown scope_kind: {scope_kind!r}")
        container = self._scope_container(scope_kind, scope_id)
        container["enabled"] = bool(enabled)
        await self._store.async_save(self._data)
        self._notify_config_changed((scope_kind, scope_id))

    def scope_config(self, scope_kind: str, scope_id: str | None) -> dict[str, Any]:
        """Read-only per-scope config dict ({} if absent). Does not create."""
        if scope_kind == "house":
            return self._data.get("house", {})
        if scope_kind == "floor":
            return self._data.get("floors", {}).get(scope_id, {})
        if scope_kind == "area":
            return self._data.get("areas", {}).get(scope_id, {})
        raise ValueError(f"unknown scope_kind: {scope_kind!r}")

    def get_exposed_actions(self) -> list[dict[str, Any]]:
        """Persisted list of ExposedAction entries (may be empty)."""
        actions = self._data.get("exposed_actions")
        return list(actions) if isinstance(actions, list) else []

    async def async_save_exposed_actions(self, actions: list[dict[str, Any]]) -> None:
        self._data["exposed_actions"] = list(actions)
        await self._store.async_save(self._data)
        # Exposed-action defaults affect scene execution, so a change here must
        # rebuild the watch-set like any other config save.
        self._notify_config_changed()
