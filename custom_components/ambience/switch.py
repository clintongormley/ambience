"""Per-scope Ambience switch — area/floor/house kill switch with auto-on timer."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_point_in_utc_time
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.util import dt as dt_util
from homeassistant.util import slugify

from .const import (
    DATA_STORE,
    DATA_SWITCH_ADD_ENTITIES,
    DATA_SWITCHES,
    DOMAIN,
    SIGNAL_SWITCH_CONFIG_UPDATED,
)
from .exposure import async_apply_switch_exposure
from .naming import scope_device_name

_LOGGER = logging.getLogger(__name__)


class _CancellableTimer:
    """Wraps the unsubscribe callable from async_track_point_in_utc_time.

    Provides a `.cancel()` / `.cancelled()` interface so test code can
    inspect timer state the same way it would with asyncio.TimerHandle.
    """

    def __init__(self, unsub_fn: Any) -> None:
        self._unsub = unsub_fn
        self._cancelled = False

    def cancel(self) -> None:
        if not self._cancelled:
            self._cancelled = True
            self._unsub()

    def cancelled(self) -> bool:
        return self._cancelled


def switch_unique_id(scope_kind: str, scope_id: str | None) -> str:
    """Deterministic unique_id for a scope's switch entity. Shared with the
    websocket layer so it can look the entity up to enable/disable it."""
    if scope_kind == "house":
        return "ambience_switch_house"
    return f"ambience_switch_{scope_kind}_{scope_id}"


def scope_for_unique_id(unique_id: str) -> tuple[str, str | None] | None:
    """Reverse switch_unique_id: map a scope switch's unique_id back to
    (scope_kind, scope_id), or None if it isn't an Ambience scope switch.

    The apply_scene service takes a scope switch entity_id; this resolves the
    chosen entity to the scope it gates. scope_id may itself contain underscores,
    so only the leading kind segment is split off.
    """
    if unique_id == "ambience_switch_house":
        return ("house", None)
    for scope_kind in ("area", "floor"):
        prefix = f"ambience_switch_{scope_kind}_"
        if unique_id.startswith(prefix):
            return (scope_kind, unique_id[len(prefix) :])
    return None


def _device_identifiers(scope_kind: str, scope_id: str | None) -> set[tuple[str, str]]:
    """Device-registry identifiers for a scope's device."""
    if scope_kind == "house":
        return {(DOMAIN, "ambience")}
    return {(DOMAIN, f"{scope_kind}_{scope_id}")}


def _entity_id_for(scope_kind: str, display_name: str) -> str:
    if scope_kind == "house":
        return "switch.house_ambience"
    if scope_kind == "floor":
        # Suffix with `_floor_ambience` so a floor and an area with the same
        # name don't collide on the entity_id slug.
        return f"switch.{slugify(display_name)}_floor_ambience"
    return f"switch.{slugify(display_name)}_ambience"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Create the house switch + one switch per HA area + one per HA floor."""
    # Stashed for use by the registry create-event handlers in __init__.py.
    hass.data[DOMAIN][DATA_SWITCH_ADD_ENTITIES] = async_add_entities
    hass.data[DOMAIN].setdefault(DATA_SWITCHES, {})

    entities: list[AmbienceScopeSwitch] = [AmbienceScopeSwitch("house", None, "house")]
    floor_reg = fr.async_get(hass)
    for floor in floor_reg.async_list_floors():
        entities.append(AmbienceScopeSwitch("floor", floor.floor_id, floor.name))
    area_reg = ar.async_get(hass)
    for area in area_reg.async_list_areas():
        entities.append(AmbienceScopeSwitch("area", area.id, area.name))
    async_add_entities(entities)


class AmbienceScopeSwitch(SwitchEntity, RestoreEntity):
    """Switch that gates ambience.apply_scene for one scope (area/floor/house)."""

    _attr_should_poll = False
    _attr_has_entity_name = True
    _attr_icon = "mdi:lightbulb-multiple"

    def __init__(self, scope_kind: str, scope_id: str | None, display_name: str) -> None:
        self._scope_kind = scope_kind
        self._scope_id = scope_id
        # Fallback prefix if the area/floor disappears from the registry mid-
        # session. House always uses the literal "House".
        self._fallback_prefix = "House" if scope_kind == "house" else display_name
        self._attr_unique_id = switch_unique_id(scope_kind, scope_id)
        # Entity carries no name of its own: with has_entity_name the friendly
        # name becomes the device name, avoiding the "<device> <entity>" doubling.
        self._attr_name = None
        # One device per scope. The device name (the composed "<scope> <default>"
        # string) is set entirely by _sync_device_name, called from
        # async_added_to_hass and whenever SIGNAL_SWITCH_CONFIG_UPDATED fires — so
        # it is not set here, avoiding a stale name on restart when the user has
        # changed the default. Floor/area devices are sub-devices of the main
        # "ambience" service device.
        self._attr_device_info = DeviceInfo(
            identifiers=_device_identifiers(scope_kind, scope_id),
            entry_type=DeviceEntryType.SERVICE,
        )
        if scope_kind != "house":
            self._attr_device_info["via_device"] = (DOMAIN, "ambience")
        # Deterministic entity_id for clean installs; entity registry takes
        # over after first registration so user-renames stick.
        self.entity_id = _entity_id_for(scope_kind, display_name)
        self._attr_is_on = True
        self._timer: _CancellableTimer | None = None

    @property
    def scope_key(self) -> tuple[str, str | None]:
        return (self._scope_kind, self._scope_id)

    def _descendant_switches(self) -> list[AmbienceScopeSwitch]:
        """Switch entities below this scope in the house>floor>area hierarchy.

        - house: every other switch (all floors + all areas).
        - floor: area switches whose area is on this floor.
        - area:  none (leaf).
        """
        switches: dict[tuple[str, str | None], AmbienceScopeSwitch] = self.hass.data[DOMAIN].get(
            DATA_SWITCHES, {}
        )
        if self._scope_kind == "house":
            return [sw for key, sw in switches.items() if key != self.scope_key]
        if self._scope_kind == "floor":
            area_reg = ar.async_get(self.hass)
            floor_area_ids = {a.id for a in ar.async_entries_for_floor(area_reg, self._scope_id)}
            return [
                sw
                for (kind, sid), sw in switches.items()
                if kind == "area" and sid in floor_area_ids
            ]
        return []

    # ---- HA lifecycle ----

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self.hass.data[DOMAIN].setdefault(DATA_SWITCHES, {})[self.scope_key] = self
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_SWITCH_CONFIG_UPDATED, self._handle_config_updated
            )
        )
        self._sync_device_name()
        self._assign_area_device()
        last = await self.async_get_last_state()
        if last is not None and last.state == "off":
            self._attr_is_on = False
            self._schedule_auto_on_from_store(turn_on_if_expired=True)
        async_apply_switch_exposure(self.hass, self.entity_id)

    async def async_will_remove_from_hass(self) -> None:
        if self._timer is not None:
            self._timer.cancel()
            self._timer = None
        self.hass.data[DOMAIN].get(DATA_SWITCHES, {}).pop(self.scope_key, None)
        await super().async_will_remove_from_hass()

    # ---- on/off ----

    async def async_turn_on(self, **_: Any) -> None:
        await self._apply_on()
        for sw in self._descendant_switches():
            if not sw.is_on:
                await sw._apply_on()

    async def async_turn_off(self, **_: Any) -> None:
        await self._apply_off()
        for sw in self._descendant_switches():
            if sw.is_on:
                await sw._apply_off()

    async def _apply_on(self) -> None:
        """Turn this switch on locally (no cascade)."""
        if self._timer is not None:
            self._timer.cancel()
            self._timer = None
        self._attr_is_on = True
        await self._store().async_set_scope_switch_off_at(self._scope_kind, self._scope_id, None)
        self.async_write_ha_state()

    async def _apply_off(self) -> None:
        """Turn this switch off locally (no cascade)."""
        self._attr_is_on = False
        await self._store().async_set_scope_switch_off_at(
            self._scope_kind, self._scope_id, dt_util.utcnow().isoformat()
        )
        self._schedule_auto_on(seconds=self._resolved_delay())
        self.async_write_ha_state()

    # ---- internals ----

    def _store(self) -> Any:
        return self.hass.data[DOMAIN][DATA_STORE]

    def _resolved_delay(self) -> int:
        return self._store().get_switch_defaults()["auto_on_delay_seconds"]

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Expose pause timing so the frontend can render a countdown without a
        round-trip. ``off_at`` is None when the switch is on."""
        return {
            "off_at": self._store().get_scope_switch_off_at(self._scope_kind, self._scope_id),
            "auto_on_delay_seconds": self._resolved_delay(),
        }

    def _composed_device_name(self) -> str:
        default_name = self._store().get_switch_defaults()["name"]
        return scope_device_name(
            self.hass,
            self._scope_kind,
            self._scope_id,
            default_name,
            fallback=self._fallback_prefix,
        )

    def _assign_area_device(self) -> None:
        """Place an area scope's device in its HA area, only when it has none.

        suggested_area in DeviceInfo is removed in HA 2026.9, so set area_id
        directly. The "only when None" guard means the device is placed in its
        area on first creation and a later move to a *different* area is never
        overridden. (A deliberate move to no area resets area_id to None, so it
        is re-placed on the next reload — the area is the sensible default.)
        """
        if self._scope_kind != "area":
            return
        dev_reg = dr.async_get(self.hass)
        device = dev_reg.async_get_device(
            identifiers=_device_identifiers(self._scope_kind, self._scope_id)
        )
        if device is not None and device.area_id is None:
            dev_reg.async_update_device(device.id, area_id=self._scope_id)

    def _sync_device_name(self) -> None:
        """Update the scope device's registry name to the composed name.

        Writes the integration-provided `name`; HA always displays a user's
        `name_by_user` in preference, so manual device renames are preserved.
        """
        dev_reg = dr.async_get(self.hass)
        device = dev_reg.async_get_device(
            identifiers=_device_identifiers(self._scope_kind, self._scope_id)
        )
        if device is None:
            return
        new_name = self._composed_device_name()
        if device.name != new_name:
            dev_reg.async_update_device(device.id, name=new_name)

    def _schedule_auto_on(self, seconds: int) -> None:
        if self._timer is not None:
            self._timer.cancel()
            self._timer = None
        if seconds <= 0:
            return
        fire_at = dt_util.utcnow() + timedelta(seconds=seconds)
        unsub = async_track_point_in_utc_time(self.hass, self._fire_auto_on, fire_at)
        self._timer = _CancellableTimer(unsub)

    def _schedule_auto_on_from_store(self, *, turn_on_if_expired: bool) -> None:
        delay = self._resolved_delay()
        if delay <= 0:
            return
        off_at_iso = self._store().get_scope_switch_off_at(self._scope_kind, self._scope_id)
        if not off_at_iso:
            return
        try:
            off_at = datetime.fromisoformat(off_at_iso)
            remaining = delay - (dt_util.utcnow() - off_at).total_seconds()
        except (ValueError, TypeError):
            _LOGGER.warning("ambience switch: invalid off_at %r — ignoring", off_at_iso)
            return
        if remaining <= 0:
            if turn_on_if_expired:
                self.hass.async_create_task(self.async_turn_on())
            return
        self._schedule_auto_on(seconds=int(remaining))

    @callback
    def _fire_auto_on(self, _now: datetime | None = None) -> None:
        self._timer = None
        self.hass.async_create_task(self.async_turn_on())

    @callback
    def _handle_config_updated(self, _payload: None = None) -> None:
        # Fired when the global switch defaults change or a scope is renamed —
        # refresh every device's name.
        self._sync_device_name()
        if not self._attr_is_on:
            self._schedule_auto_on_from_store(turn_on_if_expired=True)
