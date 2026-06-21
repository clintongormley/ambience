"""Ambience "Scene updates" activity sensor.

A single always-present sensor on a dedicated "Ambience" hub device. Its STATE is
the latest activity line ("'Evening' in Lounge") — so the state change itself IS
the logbook entry (rendered "Ambience Scene updates changed to '<scene>' in
<scope>"), filterable by the hub device (and the entity).

It is deliberately NON-continuous (no state_class / unit_of_measurement / numeric
device_class): HA's logbook drops continuous sensors from its entity/device
filter (is_sensor_continuous → async_filter_entities), so a continuous activity
anchor cannot be filtered on at all. The structured detail (last_scene, last_scope,
…) lives in attributes; both state and attributes restore across restarts.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import MAX_LENGTH_STATE_STATE, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Context, HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.util import dt as dt_util

from .const import DOMAIN, SIGNAL_ACTIVITY_RECORDED
from .service_logbook import ActivityRecord

# The hub device carries the integration brand name (constant — not the
# configurable switch-default name), so it stays a stable "Ambience" filter
# target in the logbook regardless of switch settings.
HUB_DEVICE_NAME = "Ambience"


def _clamp_state(state: str) -> str:
    """Clamp an activity line to HA's 255-char state limit (core drops an
    over-limit state to 'unknown', which would silently lose the activity)."""
    if len(state) > MAX_LENGTH_STATE_STATE:
        return state[: MAX_LENGTH_STATE_STATE - 1] + "…"
    return state


def _attrs_from_record(record: ActivityRecord, applied_at: str | None) -> dict[str, Any]:
    """The sensor's attribute dict for one apply/run — the single source of truth
    for the attribute shape, used by both the live update and the restore filter."""
    return {
        "last_scene": record.scene,
        "last_scope": record.scope,
        "last_scope_kind": record.scope_kind,
        "last_category": record.category,
        "last_action": record.action,
        "applied_at": applied_at,
    }


# The attribute keys _attrs_from_record produces — restored from the prior state
# on restart. Keep in sync with _attrs_from_record.
_RESTORED_ATTRS = (
    "last_scene",
    "last_scope",
    "last_scope_kind",
    "last_category",
    "last_action",
    "applied_at",
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Create the single Scene-updates sensor."""
    async_add_entities([AmbienceSceneUpdatesSensor()])


class AmbienceSceneUpdatesSensor(SensorEntity, RestoreEntity):
    """The Ambience activity-log anchor: its state is the latest apply/run line."""

    _attr_should_poll = False
    _attr_has_entity_name = True
    _attr_translation_key = "scene_updates"
    _attr_unique_id = "ambience_scene_updates"
    _attr_icon = "mdi:history"
    # No state_class / unit / numeric device_class on purpose — see module docstring:
    # those would make HA classify this as a continuous sensor and refuse to filter
    # the logbook on it.

    def __init__(self) -> None:
        self.entity_id = "sensor.ambience_scene_updates"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, "hub")},
            name=HUB_DEVICE_NAME,
            entry_type=DeviceEntryType.SERVICE,
        )
        # None ⇒ "unknown" until the first apply/run.
        self._attr_native_value: str | None = None
        self._attrs: dict[str, Any] = {}

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        # Restore the last activity line + detail across restarts. A non-meaningful
        # prior state (unknown/unavailable after a crash) is not restored as the
        # state — but the detail attributes still are.
        if (last := await self.async_get_last_state()) is not None:
            if last.state not in (STATE_UNKNOWN, STATE_UNAVAILABLE):
                self._attr_native_value = last.state
            self._attrs = {k: last.attributes[k] for k in _RESTORED_ATTRS if k in last.attributes}
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_ACTIVITY_RECORDED, self._on_activity)
        )

    @callback
    def _on_activity(self, record: ActivityRecord, context: Context) -> None:
        # Adopt the apply's context so this state change and the dispatched device
        # service calls (which share it) are grouped under one logbook activity.
        self.async_set_context(context)
        self._attr_native_value = _clamp_state(record.message)
        # UTC, matching the integration's other persisted timestamps (trace,
        # switch off_at); the frontend localises for display.
        self._attrs = _attrs_from_record(record, dt_util.utcnow().isoformat())
        self.async_write_ha_state()

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Latest apply/run detail. Empty until the first apply."""
        return self._attrs
