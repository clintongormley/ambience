"""Ambience "Scene updates" activity sensor.

A single always-present sensor on a dedicated "Ambience" hub device. It is the
logbook anchor for Ambience's activity log: applies/runs attach their logbook
entry to this entity so they can be filtered by the hub device. Its own state is
a running count, kept out of the logbook (see the design spec), with the latest
apply detail in attributes.
"""

from __future__ import annotations

import contextlib
from typing import Any

from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.util import dt as dt_util

from .const import DATA_ACTIVITY_SENSOR, DOMAIN, SIGNAL_ACTIVITY_RECORDED
from .service_logbook import ActivityRecord

# The hub device carries the integration brand name (constant — not the
# configurable switch-default name), so it stays a stable "Ambience" filter
# target in the logbook regardless of switch settings.
HUB_DEVICE_NAME = "Ambience"


def _attrs_from_record(record: ActivityRecord, applied_at: str | None) -> dict[str, Any]:
    """The sensor's attribute dict for one apply/run — the single source of truth
    for the attribute shape, used by both the live update and the restore filter."""
    return {
        "summary": record.message,
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
    "summary",
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
    """Running count of Ambience applies/runs; the activity-log anchor entity."""

    _attr_should_poll = False
    _attr_has_entity_name = True
    _attr_translation_key = "scene_updates"
    _attr_unique_id = "ambience_scene_updates"
    _attr_icon = "mdi:history"
    # Continuous ⇒ HA's logbook (is_sensor_continuous) skips this sensor's own
    # state changes, so the explicit apply/run logbook line stays the only entry.
    # Accepted side effect: a continuous sensor also accrues long-term statistics
    # (a cumulative "scene updates" total); TOTAL_INCREASING tolerates the reset to
    # 0 when a crash leaves a non-numeric prior state.
    _attr_state_class = SensorStateClass.TOTAL_INCREASING

    def __init__(self) -> None:
        self.entity_id = "sensor.ambience_scene_updates"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, "hub")},
            name=HUB_DEVICE_NAME,
            entry_type=DeviceEntryType.SERVICE,
        )
        self._attr_native_value = 0
        self._attrs: dict[str, Any] = {}

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        # Restore the running count + last-apply detail across restarts. A
        # non-numeric prior state (unknown/unavailable after a crash) keeps the
        # initial 0 rather than raising.
        if (last := await self.async_get_last_state()) is not None:
            with contextlib.suppress(TypeError, ValueError):
                self._attr_native_value = int(last.state)
            self._attrs = {k: last.attributes[k] for k in _RESTORED_ATTRS if k in last.attributes}
        # Publish our entity_id so the logbook attribution can attach each
        # apply/run entry to this entity (⇒ filterable by the hub device).
        self.hass.data.setdefault(DOMAIN, {})[DATA_ACTIVITY_SENSOR] = self.entity_id
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_ACTIVITY_RECORDED, self._on_activity)
        )

    async def async_will_remove_from_hass(self) -> None:
        self.hass.data.get(DOMAIN, {}).pop(DATA_ACTIVITY_SENSOR, None)
        await super().async_will_remove_from_hass()

    @callback
    def _on_activity(self, record: ActivityRecord) -> None:
        self._attr_native_value += 1
        # UTC, matching the integration's other persisted timestamps (trace,
        # switch off_at); the frontend localises for display.
        self._attrs = _attrs_from_record(record, dt_util.utcnow().isoformat())
        self.async_write_ha_state()

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Latest apply/run detail. Empty until the first apply."""
        return self._attrs
