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
    DEFAULT_SWITCH_NAME,
    GENERAL_CATEGORY,
    SIGNAL_CONFIG_CHANGED,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .errors import AmbienceError
from .scopes import scope_bucket, scope_spec

# Switch / idle re-apply defaults. Defined here (store is their only consumer)
# rather than in const.py, to avoid a CodeQL py/unsafe-cyclic-import false
# positive: const has a TYPE_CHECKING-only import of store for get_store's
# annotation, and CodeQL flags const-level constants imported by store as
# "defined after the cyclic import".
# auto_on_delay: how long a paused scope stays off before auto-resuming; 0 = never.
DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS = 0
# Re-assert each unit's scene after this many seconds of no dispatch; off by
# default; interval pre-filled at 60 min; the floor rejects nonsensical values.
DEFAULT_REAPPLY_ENABLED = False
DEFAULT_REAPPLY_INTERVAL_SECONDS = 3600
MIN_REAPPLY_INTERVAL_SECONDS = 60

# Voice-assistant exposure default: switches exposed to local Assist only.
# Defined here (store owns the persisted map) rather than const.py to avoid the
# CodeQL py/unsafe-cyclic-import false positive (see the note above). Keys must
# stay aligned with const.KNOWN_ASSISTANTS / const.ASSISTANT_FIELDS — guarded by
# test_known_assistants_match_default_map_and_fields.
DEFAULT_EXPOSED_ASSISTANTS = {
    "conversation": True,
    "cloud.google_assistant": False,
    "cloud.alexa": False,
}

# Built-in exposed actions seeded on first load. Defined here (not const.py)
# to avoid the const<->store cyclic-import CodeQL false positive.
DEFAULT_SEEDED_BUILTINS: list[dict[str, Any]] = [
    {"id": "ambience.turn_on", "label": "", "visible_fields": [], "defaults": {}},
    {"id": "ambience.turn_off", "label": "", "visible_fields": [], "defaults": {}},
    {"id": "ambience.cover_safe_open", "label": "", "visible_fields": [], "defaults": {}},
    {"id": "ambience.cover_safe_close", "label": "", "visible_fields": [], "defaults": {}},
    {
        "id": "ambience.cover_safe_set_position",
        "label": "",
        "visible_fields": ["position"],
        "defaults": {},
    },
    {
        "id": "ambience.cover_safe_set_tilt_position",
        "label": "",
        "visible_fields": ["tilt_position"],
        "defaults": {},
    },
]

# Service ids of the seeded built-ins, in seed order. Used by setup to resolve
# their localized labels once the built-in services are registered.
SEEDED_BUILTIN_IDS: list[str] = [entry["id"] for entry in DEFAULT_SEEDED_BUILTINS]

_LOGGER = logging.getLogger(__name__)


class LastCategoryError(AmbienceError):
    """Raised when deleting the only remaining category."""


class CategoryInUseError(AmbienceError):
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
        # Set when the on-disk payload was present but unreadable. While set,
        # no automatic writer may persist: the degraded empty in-memory config
        # must not replace the file the user still needs for recovery.
        self._unreadable_payload = False

    def _notify_config_changed(self, affected: tuple[str, str | None] | None = None) -> None:
        """Tell the auto-trigger engine a config save happened, and narrow the
        follow-up re-apply: pass a (scope_kind, scope_id) for a scope-local
        change, or None for a global change (reapply everything)."""
        async_dispatcher_send(self._hass, SIGNAL_CONFIG_CHANGED, affected)

    @staticmethod
    def _empty() -> dict[str, Any]:
        """A fresh, fully-defaulted payload — the single definition of every
        store default, for a new install and for filling the gaps in a loaded
        one alike (see :meth:`_apply_defaults`).

        Every nested value is a private copy: the module constants are shared
        templates, so aliasing one into `_data` would let a user's later edit
        rewrite the default every other install is seeded from.
        """
        return {
            "version": STORAGE_VERSION,
            "categories": [dict(GENERAL_CATEGORY)],
            "areas": {},
            "floors": {},
            "house": {"scenes": []},
            "conditions": {
                "time_of_day": {"custom": {}, "hidden": []},
                "day": {"workday_sensor": None, "workday_calendar": None},
                "weather": {"entity": None, "groups": copy.deepcopy(DEFAULT_WEATHER_GROUPS)},
                "lux": {"custom": {}, "hidden": []},
            },
            "switch_defaults": {
                "name": DEFAULT_SWITCH_NAME,
                "auto_on_delay_seconds": DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS,
            },
            "reapply": {
                "enabled": DEFAULT_REAPPLY_ENABLED,
                "interval_seconds": DEFAULT_REAPPLY_INTERVAL_SECONDS,
            },
            "exposed_assistants": dict(DEFAULT_EXPOSED_ASSISTANTS),
            "exposed_actions": [],
        }

    @classmethod
    def _fill_defaults(cls, data: dict[str, Any], defaults: dict[str, Any]) -> None:
        """Recursively fill keys missing from `data` with those in `defaults`.

        A key that is present keeps its stored value — including an explicit
        `None` or an empty list, which are user state, not gaps. Two dicts are
        merged key by key; any other pair is left alone. `defaults` must be a
        private copy, since its values are grafted straight onto `data`.
        """
        for key, default in defaults.items():
            if key not in data:
                data[key] = default
            elif isinstance(data[key], dict) and isinstance(default, dict):
                cls._fill_defaults(data[key], default)

    def _apply_defaults(self) -> None:
        """Bring a loaded payload up to the current default shape."""
        defaults = self._empty()
        self._fill_defaults(self._data, defaults)
        # Categories are required: a scene always points at one, so an empty
        # list is a gap rather than user intent (unlike every other list).
        # `defaults` is untouched here — the merge above only grafts on a
        # value whose key was absent, and this branch needs a present one.
        if not self._data["categories"]:
            self._data["categories"] = defaults["categories"]
        # Drop the removed create_switches flag from upgraded installs — a
        # permanent idempotent cleanup, not a version-gated migration.
        self._data["switch_defaults"].pop("create_switches", None)

    async def _ensure_builtin_actions(self) -> None:
        """Seed the built-in on/off exposed actions exactly once.

        Guarded by `builtins_seeded` so a user who later deletes a seeded
        action does not get it re-added. Persists immediately so the flag and
        seed survive restarts even without a later save.
        """
        if self._data.get("builtins_seeded"):
            return
        existing = self._data.setdefault("exposed_actions", [])
        if not isinstance(existing, list):
            # Readable store but exposed_actions is the wrong shape — don't seed
            # or persist over it (mirrors get_exposed_actions' isinstance guard).
            return
        have = {e.get("id") for e in existing if isinstance(e, dict)}
        for entry in DEFAULT_SEEDED_BUILTINS:
            if entry["id"] not in have:
                # deepcopy, not dict(): some seed templates carry non-empty
                # nested values (e.g. visible_fields=["position"]); a shallow
                # copy would alias those lists back to the module constant.
                existing.append(copy.deepcopy(entry))
        self._data["builtins_seeded"] = True
        await self._store.async_save(self._data)

    def builtins_labeled(self) -> bool:
        """True once the seeded built-ins' labels have been backfilled — lets
        setup skip resolving service names from the catalog on later starts."""
        return bool(self._data.get("builtins_labeled"))

    async def async_apply_builtin_labels(self, labels: dict[str, str]) -> None:
        """Backfill localized labels onto the seeded built-in actions, once.

        Seeding (above) runs during `async_load`, before the built-in services
        are registered, so it can't resolve their localized names. This is
        called from setup *after* registration with `labels` mapping service id
        -> localized name (HA default language, English fallback). It fills the
        label of any matching action whose label is still blank.

        Gated by `builtins_labeled` so a user who later clears a built-in's
        label isn't fought on the next restart. If `labels` is empty (service
        descriptions unavailable this load), it no-ops *without* setting the
        flag, so a later load retries.
        """
        if self._unreadable_payload:
            return
        if self._data.get("builtins_labeled"):
            return
        if not labels:
            return
        actions = self._data.get("exposed_actions")
        if not isinstance(actions, list):
            # Wrong shape — don't seed-label or persist over it (mirrors the
            # isinstance guards in _ensure_builtin_actions / get_exposed_actions).
            return
        for entry in actions:
            if not isinstance(entry, dict):
                continue
            name = labels.get(entry.get("id"))
            if name and not str(entry.get("label") or "").strip():
                entry["label"] = name
        self._data["builtins_labeled"] = True
        await self._store.async_save(self._data)

    async def async_load(self) -> None:
        raw = await self._store.async_load()
        self._unreadable_payload = False
        if raw is None:
            self._data = self._empty()
        elif not isinstance(raw, dict) or "areas" not in raw or not isinstance(raw["areas"], dict):
            _LOGGER.warning("ambience storage payload is malformed; starting empty")
            self._data = self._empty()
            # Do NOT seed-and-save here: _ensure_builtin_actions persists, which
            # would overwrite the unreadable on-disk payload and destroy any
            # chance of manual recovery / restore-from-backup. The flag keeps
            # every other automatic writer (label backfill, unload flush) off
            # the file too; only an explicit user save may replace it.
            self._unreadable_payload = True
            return
        else:
            self._data = raw
            self._apply_defaults()
        await self._ensure_builtin_actions()

    async def async_remove(self) -> None:
        """Delete the persisted store file.

        Called when the integration is removed (not on reload/restart) so a later
        re-add starts from a clean slate. PeriodStore / LuxRangeStore /
        ExposedActionsStore all persist through this same file, so one delete
        clears every kind of Ambience config.
        """
        await self._store.async_remove()

    async def async_flush(self) -> None:
        """Write any pending delayed save to disk now and cancel its timer.

        Called on unload. HA deletes the integration via a *fresh* store instance
        in `async_remove_entry`, which cannot cancel a delayed save scheduled on
        this (soon-orphaned) instance — `async_set_scope_switch_off_at` uses
        `async_delay_save`. Without this flush that late write would fire ~1s
        later and resurrect the file the removal just deleted. `async_save`
        writes immediately and cancels the pending delay/final-write listeners,
        so nothing survives the unload to recreate the file. On a reload it just
        persists the latest in-memory state, which is harmless.

        Skipped when the loaded payload was unreadable: the in-memory state is
        a degraded empty config and must not replace the file on disk.
        """
        if self._unreadable_payload:
            return
        await self._store.async_save(self._data)

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

    async def async_save_scope(
        self, scope_kind: str, scope_id: str | None, config: dict[str, Any]
    ) -> None:
        """Persist a scope's config, dispatching to the per-kind saver — the
        unified writer mirroring `scope_config()`'s unified reader, behind the
        websocket scope-save handlers and the undo/redo restore."""
        spec = scope_spec(scope_kind)
        if not spec.has_id:
            await self.async_save_house(config)
            return
        if scope_id is None:
            # area/floor always carry an id (only house is id-less); the websocket
            # schema requires it, so a None here is a caller bug, not user input —
            # an internal contract error, not a translatable AmbienceError. This
            # also narrows scope_id to `str` for the per-kind savers below.
            raise ValueError(f"{scope_kind} scope requires a scope_id")
        await getattr(self, spec.store_saver)(scope_id, config)

    def all_scope_configs(self) -> list[tuple[str, str | None, dict[str, Any]]]:
        """Yield (kind, scope_id, config) for every configured scope.

        `scope_id` is None for the house. Used by the config-health scan that
        walks every scene list to detect dangling references.
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
            raise LastCategoryError("last_category_required")
        new_ids = {c.get("id") for c in categories}
        in_use = {
            scene.get("category")
            for _kind, _id, cfg in self.all_scope_configs()
            for scene in cfg.get("scenes", [])
        }
        removed_in_use = sorted(cid for cid in in_use - new_ids if isinstance(cid, str))
        if removed_in_use:
            raise CategoryInUseError(
                "categories_still_have_scenes", categories=", ".join(removed_in_use)
            )
        self._data["categories"] = [dict(c) for c in categories]
        await self._store.async_save(self._data)
        self._notify_config_changed()

    async def async_delete_category(self, category_id: str) -> None:
        """Remove a category. Refused when the category still has scenes in any
        scope, or when it is the last remaining category (a scene must always have
        a category and at least one category must always exist)."""
        categories = self._data.get("categories", [])
        if len(categories) <= 1:
            raise LastCategoryError("cannot_delete_last_category")
        in_use = any(
            scene.get("category") == category_id
            for _kind, _id, cfg in self.all_scope_configs()
            for scene in cfg.get("scenes", [])
        )
        if in_use:
            raise CategoryInUseError("category_still_has_scenes", category_id=category_id)
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

    def _scope_container(self, scope_kind: str, scope_id: str | None) -> dict[str, Any]:
        """Return the per-scope config dict (creating a bare shell if needed).

        Used internally by switch helpers so they can read/write the `switch`
        sub-dict regardless of whether scenes have been saved for the scope.
        """
        return scope_bucket(self._data, scope_kind, scope_id, create=True)

    @staticmethod
    def _validate_switch_defaults(payload: dict[str, Any]) -> None:
        name = payload.get("name")
        if not isinstance(name, str) or not name.strip():
            raise AmbienceError("store_switch_name_empty", name=name)
        delay = payload.get("auto_on_delay_seconds")
        if not isinstance(delay, int) or isinstance(delay, bool) or delay < 0:
            raise AmbienceError("store_switch_auto_on_delay_invalid", delay=delay)

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

    @staticmethod
    def _validate_reapply_settings(payload: dict[str, Any]) -> None:
        enabled = payload.get("enabled")
        if not isinstance(enabled, bool):
            raise AmbienceError("store_reapply_enabled_invalid", enabled=enabled)
        interval = payload.get("interval_seconds")
        if (
            not isinstance(interval, int)
            or isinstance(interval, bool)
            or interval < MIN_REAPPLY_INTERVAL_SECONDS
        ):
            raise AmbienceError(
                "store_reapply_interval_invalid",
                min=MIN_REAPPLY_INTERVAL_SECONDS,
                interval=interval,
            )

    def get_reapply_settings(self) -> dict[str, Any]:
        r = self._data.get("reapply", {})
        return {
            "enabled": r.get("enabled", DEFAULT_REAPPLY_ENABLED),
            "interval_seconds": r.get("interval_seconds", DEFAULT_REAPPLY_INTERVAL_SECONDS),
        }

    async def async_save_reapply_settings(self, payload: dict[str, Any]) -> None:
        self._validate_reapply_settings(payload)
        self._data["reapply"] = {
            "enabled": payload["enabled"],
            "interval_seconds": payload["interval_seconds"],
        }
        await self._store.async_save(self._data)

    def get_exposed_assistants(self) -> dict[str, bool]:
        # Fall back to the default for any missing or non-bool stored value —
        # bool() would coerce a corrupted string like "false" to True.
        ea = self._data.get("exposed_assistants", {})
        result: dict[str, bool] = {}
        for assistant, default in DEFAULT_EXPOSED_ASSISTANTS.items():
            value = ea.get(assistant, default)
            result[assistant] = value if isinstance(value, bool) else default
        return result

    @staticmethod
    def _validate_exposed_assistants(payload: dict[str, Any]) -> None:
        # A save carries the complete exposure state — require every known key
        # (like the reapply/switch-defaults validators) and reject anything else,
        # so a partial payload can't silently reset the omitted assistants.
        for assistant in DEFAULT_EXPOSED_ASSISTANTS:
            value = payload.get(assistant)
            if not isinstance(value, bool):
                raise AmbienceError("store_exposure_invalid", assistant=assistant, value=value)
        unknown = set(payload) - set(DEFAULT_EXPOSED_ASSISTANTS)
        if unknown:
            raise AmbienceError("store_unknown_assistants", assistants=sorted(unknown))

    async def async_save_exposed_assistants(self, payload: dict[str, Any]) -> None:
        self._validate_exposed_assistants(payload)
        self._data["exposed_assistants"] = {
            assistant: payload[assistant] for assistant in DEFAULT_EXPOSED_ASSISTANTS
        }
        await self._store.async_save(self._data)

    def get_scope_switch_off_at(self, scope_kind: str, scope_id: str | None) -> str | None:
        """The persisted off-at timestamp for a scope's switch (``None`` if on or
        never set). ``off_at`` is runtime state owned by the switch entity, not
        user configuration — switch name and auto-on delay always come from the
        global defaults (:meth:`get_switch_defaults`)."""
        sw = self.scope_config(scope_kind, scope_id).get("switch", {})
        return sw.get("off_at") if isinstance(sw, dict) else None

    async def async_set_scope_switch_off_at(
        self, scope_kind: str, scope_id: str | None, off_at: str | None
    ) -> None:
        container = self._scope_container(scope_kind, scope_id)
        sw = container.setdefault("switch", {})
        sw["off_at"] = off_at
        if self._unreadable_payload:
            # Runtime state only: the switch reads the in-memory value above,
            # and losing it costs nothing next to the damaged file a scheduled
            # write would replace with the degraded empty config.
            return
        # off_at is loss-tolerant runtime state, and a house toggle writes it
        # once per descendant switch — delay_save coalesces those N+1 writes
        # into one instead of serialising full-store saves.
        self._store.async_delay_save(lambda: self._data, 1.0)

    def get_scope_enabled(self, scope_kind: str, scope_id: str | None) -> bool:
        """Whether a scope is permanently enabled (default ``True``).

        Independent of the switch's temporary on/off (``off_at``): a scope
        applies scenes only when it is enabled AND its switch is not paused.
        """
        return bool(self.scope_config(scope_kind, scope_id).get("enabled", True))

    async def async_set_scope_enabled(
        self, scope_kind: str, scope_id: str | None, enabled: bool
    ) -> None:
        container = self._scope_container(scope_kind, scope_id)
        container["enabled"] = bool(enabled)
        await self._store.async_save(self._data)
        self._notify_config_changed((scope_kind, scope_id))

    def scope_config(self, scope_kind: str, scope_id: str | None) -> dict[str, Any]:
        """Read-only per-scope config dict ({} if absent). Does not create."""
        return scope_bucket(self._data, scope_kind, scope_id, create=False)

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
