"""Persistent store for Ambience configuration."""

from __future__ import annotations

import json
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store

from .const import (
    DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS,
    DEFAULT_SWITCH_NAME,
    GENERAL_GROUP,
    GENERAL_GROUP_ID,
    SIGNAL_CONFIG_CHANGED,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .matchers.weather import DEFAULT_WEATHER_GROUPS

_LOGGER = logging.getLogger(__name__)


class LastGroupError(ValueError):
    """Raised when deleting the only remaining group."""


class GroupInUseError(ValueError):
    """Raised when deleting a group that still has rules in some scope."""


def reassign_orphan_rules(rules: list[dict[str, Any]], known: set[str], target: str) -> bool:
    """Point any rule with no group or an unknown group at `target`. Mutates the
    rules in place; returns True if anything was changed. Shared by the store's
    load-time migration and the websocket's save-time coercion."""
    changed = False
    for rule in rules:
        gid = rule.get("group")
        if gid is None or gid not in known:
            rule["group"] = target
            changed = True
    return changed


class AmbienceStore:
    """Typed wrapper over HA's Store for Ambience data."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: dict[str, Any] = self._empty()

    def _notify_config_changed(self) -> None:
        """Tell the auto-trigger engine to rebuild its watch-set."""
        async_dispatcher_send(self._hass, SIGNAL_CONFIG_CHANGED)

    @staticmethod
    def _empty() -> dict[str, Any]:
        return {
            "version": STORAGE_VERSION,
            "groups": [dict(GENERAL_GROUP)],
            "areas": {},
            "floors": {},
            "house": {"rules": []},
            "matchers": {
                "time_of_day": {"custom": {}, "hidden": []},
                "day": {"workday_sensor": None, "workday_calendar": None},
                "weather": {"entity": None, "groups": list(DEFAULT_WEATHER_GROUPS)},
            },
            "switch_defaults": {
                "name": DEFAULT_SWITCH_NAME,
                "auto_on_delay_seconds": DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS,
            },
            "exposed_actions": [],
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
        self._data.setdefault("house", {"rules": []})

    def _ensure_groups(self) -> None:
        """Seed the General group when no groups exist. Groups are required: a
        store must always have at least one (see _migrate_groups)."""
        if not self._data.get("groups"):
            self._data["groups"] = [dict(GENERAL_GROUP)]

    def _migrate_groups(self) -> None:
        """Reassign every ungrouped / unknown-group rule to General, seeding
        General on demand if a store with other groups never had one.
        `_ensure_groups` runs first, so at least one group already exists."""
        known = {g["id"] for g in self._data.get("groups", [])}
        rules = [
            rule for _kind, _id, cfg in self.all_scope_configs() for rule in cfg.get("rules", [])
        ]
        if not any(r.get("group") is None or r.get("group") not in known for r in rules):
            return
        # Orphaned rules need a home: seed General if a store with other groups
        # never had one, then point them all at it.
        if GENERAL_GROUP_ID not in known:
            self._data["groups"].append(dict(GENERAL_GROUP))
            known = known | {GENERAL_GROUP_ID}
        reassign_orphan_rules(rules, known, GENERAL_GROUP_ID)

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
        self._ensure_groups()
        self._migrate_groups()
        self._ensure_switch_defaults()

    def areas(self) -> dict[str, dict[str, Any]]:
        return dict(self._data["areas"])

    def get_area(self, area_id: str) -> dict[str, Any] | None:
        return self._data["areas"].get(area_id)

    async def async_save_area(self, area_id: str, config: dict[str, Any]) -> None:
        existing = self._data["areas"].get(area_id, {})
        self._data["areas"][area_id] = {**existing, **config}
        await self._store.async_save(self._data)
        self._notify_config_changed()

    async def async_delete_area(self, area_id: str) -> None:
        if area_id in self._data["areas"]:
            del self._data["areas"][area_id]
            await self._store.async_save(self._data)
            self._notify_config_changed()

    def floors(self) -> dict[str, dict[str, Any]]:
        return dict(self._data["floors"])

    def get_floor(self, floor_id: str) -> dict[str, Any] | None:
        return self._data["floors"].get(floor_id)

    async def async_save_floor(self, floor_id: str, config: dict[str, Any]) -> None:
        existing = self._data["floors"].get(floor_id, {})
        self._data["floors"][floor_id] = {**existing, **config}
        await self._store.async_save(self._data)
        self._notify_config_changed()

    async def async_delete_floor(self, floor_id: str) -> None:
        if floor_id in self._data["floors"]:
            del self._data["floors"][floor_id]
            await self._store.async_save(self._data)
            self._notify_config_changed()

    def get_house(self) -> dict[str, Any]:
        return dict(self._data["house"])

    async def async_save_house(self, config: dict[str, Any]) -> None:
        existing = self._data.get("house", {})
        self._data["house"] = {**existing, **config}
        await self._store.async_save(self._data)
        self._notify_config_changed()

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
        triples.append(("house", None, self._data.get("house", {"rules": []})))
        return triples

    def groups(self) -> list[dict[str, Any]]:
        """The global ordered groups list (a copy)."""
        return [dict(g) for g in self._data.get("groups", [])]

    async def async_save_groups(self, groups: list[dict[str, Any]]) -> None:
        """Replace the whole groups list. Caller (websocket) validates shape."""
        self._data["groups"] = [dict(g) for g in groups]
        await self._store.async_save(self._data)
        self._notify_config_changed()

    async def async_delete_group(self, group_id: str) -> None:
        """Remove a group. Refused when the group still has rules in any scope,
        or when it is the last remaining group (a rule must always have a group
        and at least one group must always exist)."""
        groups = self._data.get("groups", [])
        if len(groups) <= 1:
            raise LastGroupError("cannot delete the last group")
        in_use = any(
            rule.get("group") == group_id
            for _kind, _id, cfg in self.all_scope_configs()
            for rule in cfg.get("rules", [])
        )
        if in_use:
            raise GroupInUseError(f"group {group_id!r} still has rules")
        self._data["groups"] = [g for g in groups if g.get("id") != group_id]
        await self._store.async_save(self._data)
        self._notify_config_changed()

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
        self._notify_config_changed()

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
            self._data.setdefault("house", {"rules": []})
            return self._data["house"]
        if scope_kind == "floor":
            return self._data["floors"].setdefault(scope_id, {"rules": []})
        if scope_kind == "area":
            return self._data["areas"].setdefault(scope_id, {"rules": []})
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

    def scope_config(self, scope_kind: str, scope_id: str | None) -> dict[str, Any]:
        """Read-only per-scope config dict ({} if absent). Does not create."""
        if scope_kind == "house":
            return self._data.get("house", {})
        if scope_kind == "floor":
            return self._data.get("floors", {}).get(scope_id, {})
        if scope_kind == "area":
            return self._data.get("areas", {}).get(scope_id, {})
        raise ValueError(f"unknown scope_kind: {scope_kind!r}")

    def auto_triggers_enabled(self, scope_kind: str, scope_id: str | None) -> bool:
        """Whether the auto-trigger engine should watch this scope. Default True."""
        return bool(self.scope_config(scope_kind, scope_id).get("auto_triggers_enabled", True))

    async def async_set_auto_triggers_enabled(
        self, scope_kind: str, scope_id: str | None, enabled: bool
    ) -> None:
        container = self._scope_container(scope_kind, scope_id)
        container["auto_triggers_enabled"] = bool(enabled)
        await self._store.async_save(self._data)
        self._notify_config_changed()

    def auto_triggers_disabled(self, scope_kind: str, scope_id: str | None) -> frozenset[str]:
        """Trigger keys the user has disabled for this scope. Default empty.

        A trigger key (e.g. ``entity:binary_sensor.motion``, ``clock:18:00``) is
        a watch the engine would otherwise subscribe to; disabling it stops this
        scope from re-evaluating when that thing changes.
        """
        raw = self.scope_config(scope_kind, scope_id).get("disabled_triggers", [])
        if not isinstance(raw, list):
            return frozenset()
        return frozenset(k for k in raw if isinstance(k, str))

    async def async_set_trigger_disabled(
        self, scope_kind: str, scope_id: str | None, key: str, disabled: bool
    ) -> None:
        """Add or remove a single trigger key from a scope's disabled set."""
        container = self._scope_container(scope_kind, scope_id)
        current = set(self.auto_triggers_disabled(scope_kind, scope_id))
        if disabled:
            current.add(key)
        else:
            current.discard(key)
        container["disabled_triggers"] = sorted(current)
        await self._store.async_save(self._data)
        self._notify_config_changed()

    def get_exposed_actions(self) -> list[dict[str, Any]]:
        """Persisted list of ExposedAction entries (may be empty)."""
        actions = self._data.get("exposed_actions")
        return list(actions) if isinstance(actions, list) else []

    async def async_save_exposed_actions(self, actions: list[dict[str, Any]]) -> None:
        self._data["exposed_actions"] = list(actions)
        await self._store.async_save(self._data)
        # Exposed-action defaults feed the engine's re-apply intervals, so a
        # change here must rebuild the watch-set like any other config save.
        self._notify_config_changed()
