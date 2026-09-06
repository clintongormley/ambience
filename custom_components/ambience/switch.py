"""Per-scope Ambience switch — area/floor/house kill switch with auto-on timer."""

from __future__ import annotations

import logging
import time
from datetime import datetime, timedelta
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
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
    DATA_SWITCHES_PENDING,
    DOMAIN,
    SIGNAL_SWITCH_CONFIG_UPDATED,
    get_switches,
)
from .exposure import async_apply_switch_exposure
from .naming import scope_device_name, scope_display_name
from .scopes import iter_scope_kinds, scope_spec

_LOGGER = logging.getLogger(__name__)

# House switch first so its device exists before floor/area switches link their
# device to it (avoids an HA device-registry warning on fresh setup).
_SCOPE_KIND_ORDER = {"house": 0, "floor": 1, "area": 2}

# How long a pending-add claim (DATA_SWITCHES_PENDING) is honoured. Our
# async_added_to_hass completes in milliseconds, so a claim older than this
# belongs to an add HA abandoned: entity_platform swallows a per-entity add
# exception, and an add timeout drops every entity it had not reached yet —
# neither calls add_to_platform_abort, so neither releases the claim itself.
# Retrying a stale claim costs at worst one duplicate-id log line; never
# retrying strands the scope with no switch until the next reload.
_PENDING_CLAIM_TTL = 60.0

# HA 2026.8 deprecated DeviceRegistry.async_get_device() lookup by identifier
# (warns from 2026.8, removed 2027.8) because identifiers are only unique per
# config entry now. The replacement async_get_device_by_identifier is scoped to a
# config entry. Feature-detect it so Ambience keeps working on the 2025.2+ range
# it still supports, where the scoped method does not yet exist.
_SUPPORTS_GET_BY_IDENTIFIER = hasattr(dr.DeviceRegistry, "async_get_device_by_identifier")


def lookup_device_by_identifier(
    dev_reg: dr.DeviceRegistry,
    identifier: tuple[str, str],
    entry_id: str,
) -> dr.DeviceEntry | None:
    """Look up a device by identifier, scoped to our config entry.

    Uses async_get_device_by_identifier on HA 2026.8+ (the identifier-only
    async_get_device is deprecated there, and raises in the test framework from
    2026.9); falls back to the identifier lookup on older HA where the scoped
    method does not yet exist. The fallback isn't entry-scoped, which is safe
    here: manifest single_config_entry means only one entry's devices ever exist,
    so an identifier can't be ambiguous.

    Shared with the test suite (see tests/__init__.py) so tests query devices the
    same way across the supported HA range rather than re-implementing this gate.
    """
    if _SUPPORTS_GET_BY_IDENTIFIER:
        return dev_reg.async_get_device_by_identifier(identifier, entry_id)
    return dev_reg.async_get_device(identifiers={identifier})


def _get_scope_device(
    dev_reg: dr.DeviceRegistry,
    entry_id: str,
    scope_kind: str,
    scope_id: str | None,
) -> dr.DeviceEntry | None:
    """Look up a scope's device, scoped to our config entry."""
    return lookup_device_by_identifier(dev_reg, _device_identifier(scope_kind, scope_id), entry_id)


def _parse_off_at(iso: str | None) -> datetime | None:
    """A stored pause timestamp as a UTC-aware datetime, or None when absent or
    unusable. Normalised to UTC so it can be compared and subtracted against
    ``dt_util.utcnow()`` even if a naive timestamp ever reaches the store."""
    if not iso:
        return None
    try:
        return dt_util.as_utc(datetime.fromisoformat(iso))
    except (ValueError, TypeError):
        return None


class _CancellableTimer:
    """Wraps the unsubscribe callable from async_track_point_in_utc_time behind
    the `.cancel()` / `.cancelled()` interface of an asyncio.TimerHandle, so a
    cancel is idempotent and an already-cancelled timer is recognisable."""

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
    if not scope_spec(scope_kind).has_id:
        return "ambience_switch_house"
    return f"ambience_switch_{scope_kind}_{scope_id}"


def switch_registry_entry(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None
) -> er.RegistryEntry | None:
    """The entity-registry entry for a scope's switch, or None when the switch
    was never registered. A switch the user disabled still HAS an entry — only
    its live entity is gone — so callers distinguish the two by the entry's
    `disabled_by`."""
    ent_reg = er.async_get(hass)
    entity_id = ent_reg.async_get_entity_id(
        "switch", DOMAIN, switch_unique_id(scope_kind, scope_id)
    )
    return ent_reg.async_get(entity_id) if entity_id is not None else None


def scope_for_unique_id(unique_id: str) -> tuple[str, str | None] | None:
    """Reverse switch_unique_id: map a scope switch's unique_id back to
    (scope_kind, scope_id), or None if it isn't an Ambience scope switch.

    The switch-registry reconcile maps each registered switch's unique_id back to
    the scope it represents. scope_id may itself contain underscores, so only the
    leading kind segment is split off.
    """
    if unique_id == "ambience_switch_house":
        return ("house", None)
    for spec in iter_scope_kinds():
        if not spec.has_id:
            continue
        prefix = f"ambience_switch_{spec.kind}_"
        if unique_id.startswith(prefix):
            return (spec.kind, unique_id[len(prefix) :])
    return None


def _device_identifier(scope_kind: str, scope_id: str | None) -> tuple[str, str]:
    """The single device-registry identifier for a scope's device."""
    if not scope_spec(scope_kind).has_id:
        return (DOMAIN, "ambience")
    return (DOMAIN, f"{scope_kind}_{scope_id}")


def _device_identifiers(scope_kind: str, scope_id: str | None) -> set[tuple[str, str]]:
    """A scope's device-registry identifiers, as the set DeviceInfo expects."""
    return {_device_identifier(scope_kind, scope_id)}


# A floor's entity_id carries an extra `_floor` segment so a floor and an area
# with the same name don't collide on the slug.
_ENTITY_ID_INFIX = {"floor": "_floor"}


def _entity_id_for(scope_kind: str, display_name: str) -> str:
    if not scope_spec(scope_kind).has_id:
        return "switch.house_ambience"
    return f"switch.{slugify(display_name)}{_ENTITY_ID_INFIX.get(scope_kind, '')}_ambience"


def _remove_scope_device(
    hass: HomeAssistant, entry_id: str, scope_kind: str, scope_id: str | None
) -> None:
    """Remove a scope's device from the device registry (no-op if absent)."""
    dev_reg = dr.async_get(hass)
    device = _get_scope_device(dev_reg, entry_id, scope_kind, scope_id)
    if device is not None:
        dev_reg.async_remove_device(device.id)


def make_scope_switch(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None
) -> AmbienceScopeSwitch:
    """Build a switch for a scope, named from the registry like every other scope
    label. Used by the platform setup and the runtime create-on-enable path."""
    return AmbienceScopeSwitch(scope_kind, scope_id, scope_display_name(hass, scope_kind, scope_id))


def _desired_switch_scopes(hass: HomeAssistant, store: Any) -> set[tuple[str, str | None]]:
    """Scope keys that should have a switch: the house plus every ENABLED floor/area."""
    desired: set[tuple[str, str | None]] = set()
    if store.get_scope_enabled("house", None):
        desired.add(("house", None))
    for floor in fr.async_get(hass).async_list_floors():
        if store.get_scope_enabled("floor", floor.floor_id):
            desired.add(("floor", floor.floor_id))
    for area in ar.async_get(hass).async_list_areas():
        if store.get_scope_enabled("area", area.id):
            desired.add(("area", area.id))
    return desired


def _reconcile_switch_registry(
    hass: HomeAssistant, entry: ConfigEntry, desired: set[tuple[str, str | None]]
) -> None:
    """Delete any registered Ambience scope switch (and its device) whose scope is
    not in *desired*. Covers the toggle being off, disabled scopes, scopes removed
    while HA was down, and legacy hidden entities from the old hide approach."""
    registry = er.async_get(hass)
    for ent in er.async_entries_for_config_entry(registry, entry.entry_id):
        if ent.domain != "switch" or ent.platform != DOMAIN:
            continue
        scope = scope_for_unique_id(ent.unique_id)
        if scope is None or scope in desired:
            continue
        registry.async_remove(ent.entity_id)
        _remove_scope_device(hass, entry.entry_id, scope[0], scope[1])


def reconcile_scope_switches(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Create switches for every desired scope not already live, and delete any
    that should no longer exist. Driven by which scopes are enabled. Safe to
    call repeatedly (idempotent)."""
    store = hass.data[DOMAIN][DATA_STORE]
    desired = _desired_switch_scopes(hass, store)
    add_entities = hass.data[DOMAIN].get(DATA_SWITCH_ADD_ENTITIES)
    live = get_switches(hass)
    # Claimed by an add that has not reached async_added_to_hass yet: adding
    # again would hand HA a duplicate unique_id. A claim covers only that
    # window, so it is dropped once it expires (the add never landed and never
    # will), and once its scope is no longer desired (or a re-enable would find
    # the scope still claimed and never build its switch). Unload takes the
    # rest with hass.data[DOMAIN].
    pending: dict[tuple[str, str | None], float] = hass.data[DOMAIN].setdefault(
        DATA_SWITCHES_PENDING, {}
    )
    now = time.monotonic()
    for scope, claimed_at in list(pending.items()):
        if scope not in desired or now - claimed_at > _PENDING_CLAIM_TTL:
            del pending[scope]
    missing = [s for s in desired if s not in live and s not in pending]
    if missing and add_entities is not None:
        pending.update(dict.fromkeys(missing, now))
        ordered = sorted(missing, key=lambda s: _SCOPE_KIND_ORDER.get(s[0], 3))
        add_entities([make_scope_switch(hass, kind, sid) for (kind, sid) in ordered])
    _reconcile_switch_registry(hass, entry, desired)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Create a switch for each enabled scope, reconcile the registry, and
    re-reconcile live whenever the switch config changes (so a scope enable/
    disable change takes effect without an integration reload)."""
    hass.data[DOMAIN][DATA_SWITCH_ADD_ENTITIES] = async_add_entities
    hass.data[DOMAIN].setdefault(DATA_SWITCHES, {})
    reconcile_scope_switches(hass, entry)

    @callback
    def _on_switch_config_updated(_payload: None = None) -> None:
        reconcile_scope_switches(hass, entry)

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_SWITCH_CONFIG_UPDATED, _on_switch_config_updated)
    )


class AmbienceScopeSwitch(SwitchEntity, RestoreEntity):
    """Switch that gates automatic scene application for one scope (area/floor/house).

    Gates the engine's automatic applies (and non-forced manual applies); an
    explicit apply from the panel forces past the switch."""

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
        # changed the default. Floor/area devices are linked to the main "ambience"
        # service device as sub-devices by _link_via_device (via_device_id), not the
        # deprecated DeviceInfo["via_device"] identifier key (removed HA 2027.8).
        self._attr_device_info = DeviceInfo(
            identifiers=_device_identifiers(scope_kind, scope_id),
            entry_type=DeviceEntryType.SERVICE,
        )
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
        switches: dict[tuple[str, str | None], AmbienceScopeSwitch] = get_switches(self.hass)
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
        domain_data = self.hass.data[DOMAIN]
        domain_data.setdefault(DATA_SWITCHES, {})[self.scope_key] = self
        domain_data.get(DATA_SWITCHES_PENDING, {}).pop(self.scope_key, None)
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_SWITCH_CONFIG_UPDATED, self._handle_config_updated
            )
        )
        self._sync_device_name()
        self._assign_area_device()
        self._link_via_device()
        last = await self.async_get_last_state()
        if last is not None and last.state == "off":
            self._attr_is_on = False
            self._schedule_auto_on_from_store(turn_on_if_expired=True)
        async_apply_switch_exposure(self.hass, self.entity_id)

    @callback
    def add_to_platform_abort(self) -> None:
        """HA dropped this entity before adding it (duplicate id, or disabled in
        the registry): release the reconcile's pending claim so a later reconcile
        may try again without waiting out the claim's TTL. Runs before super(),
        which nulls self.hass."""
        self.hass.data.get(DOMAIN, {}).get(DATA_SWITCHES_PENDING, {}).pop(self.scope_key, None)
        super().add_to_platform_abort()

    async def async_will_remove_from_hass(self) -> None:
        self._cancel_timer()
        self.hass.data[DOMAIN].get(DATA_SWITCHES, {}).pop(self.scope_key, None)
        await super().async_will_remove_from_hass()

    # ---- on/off ----

    async def async_turn_on(self, **_: Any) -> None:
        # Read our own pause time before _apply_on clears it: a descendant
        # paused *after* this scope was paused made a later, more specific
        # choice, so it keeps its own timer instead of resuming with us.
        paused_at = self._off_at()
        await self._apply_on()
        for sw in self._descendant_switches():
            if sw.is_on:
                continue
            own = sw._off_at()
            if paused_at is not None and own is not None and own > paused_at:
                continue
            await sw._apply_on()

    async def async_turn_off(self, **_: Any) -> None:
        # One pause decision, one timestamp: every switch this cascade pauses is
        # stamped with the initiating switch's time. Re-reading the clock per
        # descendant would make each of them microseconds "newer" than us, and
        # async_turn_on's skip would then strand the whole subtree off.
        paused_at = dt_util.utcnow()
        await self._apply_off(paused_at)
        for sw in self._descendant_switches():
            if sw.is_on:
                await sw._apply_off(paused_at)

    async def _apply_on(self) -> None:
        """Turn this switch on locally (no cascade)."""
        self._cancel_timer()
        self._attr_is_on = True
        await self._store().async_set_scope_switch_off_at(self._scope_kind, self._scope_id, None)
        self.async_write_ha_state()

    async def _apply_off(self, off_at: datetime | None = None) -> None:
        """Turn this switch off locally (no cascade).

        *off_at* is the pause time to record; it defaults to now for a switch
        pausing on its own. A cascade passes the ancestor's time so the whole
        subtree shares one pause timestamp.
        """
        self._attr_is_on = False
        await self._store().async_set_scope_switch_off_at(
            self._scope_kind,
            self._scope_id,
            (off_at if off_at is not None else dt_util.utcnow()).isoformat(),
        )
        self._schedule_auto_on(seconds=self._resolved_delay())
        self.async_write_ha_state()

    # ---- internals ----

    def _cancel_timer(self) -> None:
        if self._timer is not None:
            self._timer.cancel()
            self._timer = None

    def _store(self) -> Any:
        return self.hass.data[DOMAIN][DATA_STORE]

    def _resolved_delay(self) -> int:
        return self._store().get_switch_defaults()["auto_on_delay_seconds"]

    def _off_at(self) -> datetime | None:
        """This switch's persisted pause time, or None when it is not paused or
        the stored value is unusable."""
        return _parse_off_at(
            self._store().get_scope_switch_off_at(self._scope_kind, self._scope_id)
        )

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
        device = self.device_entry
        if device is not None and device.area_id is None:
            dr.async_get(self.hass).async_update_device(device.id, area_id=self._scope_id)

    def _link_via_device(self) -> None:
        """Link a floor/area scope device to the house device as its via-device.

        Sets via_device_id directly. DeviceInfo["via_device"] — the identifier-
        based link — is deprecated in HA 2026.8 and removed in 2027.8, so we set
        the id instead once the device exists. No-op for the house scope, when
        this device isn't registered yet, when it is already linked, or when the
        house device doesn't exist — in the last case the link is retried the next
        time this entity is added (i.e. on reload), matching how the old
        DeviceInfo["via_device"] link was only resolved at device creation.
        async_update_device(via_device_id=...) is available on the whole 2025.2+
        range; only the house lookup is guarded.
        """
        if self._scope_kind == "house":
            return
        device = self.device_entry
        if device is None or device.via_device_id is not None:
            return
        dev_reg = dr.async_get(self.hass)
        entry_id = self.platform.config_entry.entry_id
        house = _get_scope_device(dev_reg, entry_id, "house", None)
        if house is not None:
            dev_reg.async_update_device(device.id, via_device_id=house.id)

    def _sync_device_name(self) -> None:
        """Update the scope device's registry name to the composed name.

        Writes the integration-provided `name`; HA always displays a user's
        `name_by_user` in preference, so manual device renames are preserved.
        """
        device = self.device_entry
        if device is None:
            return
        new_name = self._composed_device_name()
        if device.name != new_name:
            dr.async_get(self.hass).async_update_device(device.id, name=new_name)

    def _schedule_auto_on(self, seconds: int) -> None:
        self._cancel_timer()
        if seconds <= 0:
            return
        fire_at = dt_util.utcnow() + timedelta(seconds=seconds)
        unsub = async_track_point_in_utc_time(self.hass, self._fire_auto_on, fire_at)
        self._timer = _CancellableTimer(unsub)

    def _schedule_auto_on_from_store(self, *, turn_on_if_expired: bool) -> None:
        delay = self._resolved_delay()
        if delay <= 0:
            # 0 = never auto-on: drop any timer armed under a previous delay,
            # or the switch still turns itself on at the old scheduled time.
            self._cancel_timer()
            return
        off_at_iso = self._store().get_scope_switch_off_at(self._scope_kind, self._scope_id)
        if not off_at_iso:
            # Paused with no recorded pause time (HA stopped before the delayed
            # save landed). Treat now as the pause time and arm the full delay,
            # so the switch still resumes instead of staying off forever.
            now = dt_util.utcnow()
            self.hass.async_create_task(
                self._store().async_set_scope_switch_off_at(
                    self._scope_kind, self._scope_id, now.isoformat()
                )
            )
            self._schedule_auto_on(seconds=delay)
            return
        off_at = _parse_off_at(off_at_iso)
        if off_at is None:
            _LOGGER.warning("ambience switch: invalid off_at %r — ignoring", off_at_iso)
            return
        remaining = delay - (dt_util.utcnow() - off_at).total_seconds()
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
