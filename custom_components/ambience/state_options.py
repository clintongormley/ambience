"""Plausible state values for an entity — shared by the websocket API and the
what-if simulator. Pure: reads `hass.states` only."""

from __future__ import annotations

from homeassistant.components.alarm_control_panel.const import AlarmControlPanelState
from homeassistant.components.climate.const import HVACMode
from homeassistant.components.cover.const import CoverState
from homeassistant.components.lock.const import LockState
from homeassistant.components.media_player.const import MediaPlayerState
from homeassistant.components.sun.const import STATE_ABOVE_HORIZON, STATE_BELOW_HORIZON
from homeassistant.components.vacuum.const import VacuumActivity
from homeassistant.const import (
    STATE_HOME,
    STATE_NOT_HOME,
    STATE_OFF,
    STATE_ON,
    STATE_UNAVAILABLE,
    STATE_UNKNOWN,
)
from homeassistant.core import HomeAssistant

# Domain-typical state sets, derived from Home Assistant's own state enums so
# they track core additions automatically (e.g. lock's `opening`/`open`, alarm's
# `disarming`) rather than drifting out of a hand-maintained list. Domains whose
# state is a plain on/off or a module constant have no enum to enumerate. For
# domains not listed, we fall back to just the entity's current state.
_ON_OFF = [STATE_ON, STATE_OFF]
_DOMAIN_KNOWN_STATES: dict[str, list[str]] = {
    "binary_sensor": _ON_OFF,
    "switch": _ON_OFF,
    "light": _ON_OFF,
    "fan": _ON_OFF,
    "input_boolean": _ON_OFF,
    "cover": [s.value for s in CoverState],
    "lock": [s.value for s in LockState],
    "media_player": [s.value for s in MediaPlayerState],
    "climate": [m.value for m in HVACMode],
    "vacuum": [a.value for a in VacuumActivity],
    "person": [STATE_HOME, STATE_NOT_HOME],
    "device_tracker": [STATE_HOME, STATE_NOT_HOME],
    "sun": [STATE_ABOVE_HORIZON, STATE_BELOW_HORIZON],
    "alarm_control_panel": [s.value for s in AlarmControlPanelState],
}


# Maps (domain, attribute) -> the companion attribute that lists every possible
# value (mirrors HA's own getStates), so the state-condition value dropdown can
# offer the same choices as the automation editor.
_ATTRIBUTE_OPTION_SOURCE: dict[str, dict[str, str]] = {
    "climate": {
        "fan_mode": "fan_modes",
        "preset_mode": "preset_modes",
        "swing_mode": "swing_modes",
        "swing_horizontal_mode": "swing_horizontal_modes",
    },
    "fan": {"preset_mode": "preset_modes"},
    "humidifier": {"mode": "available_modes"},
    "light": {"effect": "effect_list"},
    "media_player": {"sound_mode": "sound_mode_list", "source": "source_list"},
    "remote": {"current_activity": "activity_list"},
    "vacuum": {"fan_speed": "fan_speed_list"},
    "water_heater": {"operation_mode": "operation_list"},
}


def known_attribute_values_for(hass: HomeAssistant, entity_id: str, attribute: str) -> list[str]:
    """Best-effort list of possible values for an entity attribute.

    Reads the attribute's companion "list" attribute (e.g. a light's `effect`
    reads `effect_list`) and always includes the attribute's current value so
    the active selection is never missing. Returns [] when the entity is
    unknown or there's nothing to offer.
    """
    domain = entity_id.split(".", 1)[0] if "." in entity_id else ""
    values: list[str] = []
    seen: set[str] = set()

    def _add(value: object) -> None:
        if value is None:
            return
        text = value if isinstance(value, str) else str(value)
        if text and text not in seen:
            seen.add(text)
            values.append(text)

    state = hass.states.get(entity_id)
    if state is None:
        return values

    list_attr = _ATTRIBUTE_OPTION_SOURCE.get(domain, {}).get(attribute)
    if list_attr:
        raw = state.attributes.get(list_attr)
        if isinstance(raw, list):
            for item in raw:
                _add(item)
    # Always include the current value so it stays selectable.
    _add(state.attributes.get(attribute))

    return values


def known_states_for(hass: HomeAssistant, entity_id: str) -> list[str]:
    """Best-effort list of plausible states for a given entity."""
    domain = entity_id.split(".", 1)[0] if "." in entity_id else ""
    states: list[str] = []
    seen: set[str] = set()

    def _add(s: str) -> None:
        if s and s not in seen:
            seen.add(s)
            states.append(s)

    for s in _DOMAIN_KNOWN_STATES.get(domain, []):
        _add(s)

    state = hass.states.get(entity_id)
    if state is not None:
        # input_select / select: read configured options.
        opts = state.attributes.get("options")
        if isinstance(opts, list):
            for o in opts:
                if isinstance(o, str):
                    _add(o)
        # person / device_tracker: include zone friendly names.
        if domain in ("person", "device_tracker"):
            for z in hass.states.async_all("zone"):
                name = z.attributes.get("friendly_name")
                if isinstance(name, str) and name:
                    _add(name)
                else:
                    _add(z.entity_id.split(".", 1)[1])
        # Always include the entity's current state so the user can pick it.
        # `unavailable`/`unknown` are intentionally NOT offered as options
        # (deferred until requested): HA's automation editor lists them for every
        # entity, but here "is not <state>" covers those cases and a number field
        # can't accept them. To re-enable, append STATE_UNAVAILABLE/STATE_UNKNOWN
        # for any resolvable entity.
        if state.state and state.state not in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            _add(state.state)

    return states
