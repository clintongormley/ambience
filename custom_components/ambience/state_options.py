"""Plausible state values for an entity — shared by the websocket API and the
what-if simulator. Pure: reads `hass.states` only."""

from __future__ import annotations

import importlib

from homeassistant.const import (
    STATE_HOME,
    STATE_NOT_HOME,
    STATE_OFF,
    STATE_ON,
    STATE_UNAVAILABLE,
    STATE_UNKNOWN,
)
from homeassistant.core import HomeAssistant


def _enum_state_values(component: str, enum_name: str, fallback: list[str]) -> list[str]:
    """Values of an HA state enum, resilient to the enum's import location
    changing — or the enum being absent — across our supported HA version range.

    HA moves these enums between a component's ``.const`` module and its package
    root between releases (e.g. ``CoverState`` is in ``cover.const`` on some
    versions, only ``homeassistant.components.cover`` on others), so a fixed
    import would ImportError-crash the integration on part of the range. Try the
    lightweight ``.const`` module first, then the package root, then fall back to
    a known-good literal so a relocated enum can never break module import.
    """
    for module_name in (
        f"homeassistant.components.{component}.const",
        f"homeassistant.components.{component}",
    ):
        try:
            enum = getattr(importlib.import_module(module_name), enum_name)
        except (ImportError, AttributeError):
            continue
        return [member.value for member in enum]
    return list(fallback)


# Domain-typical state sets, derived from Home Assistant's own state enums so
# they track core additions automatically (e.g. lock's `opening`/`open`, alarm's
# `disarming`) rather than drifting out of a hand-maintained list. The fallback
# literal beside each enum is used only if HA relocates/removes that enum (see
# `_enum_state_values`); it mirrors the enum's current values. Domains whose
# state is a plain on/off or a fixed pair of strings have no enum to enumerate.
# For domains not listed, we fall back to just the entity's current state.
_ON_OFF = [STATE_ON, STATE_OFF]
_DOMAIN_KNOWN_STATES: dict[str, list[str]] = {
    "binary_sensor": _ON_OFF,
    "switch": _ON_OFF,
    "light": _ON_OFF,
    "fan": _ON_OFF,
    "input_boolean": _ON_OFF,
    # Plain on/off domains whose richer detail lives in attributes (e.g. a
    # remote's `current_activity`, a humidifier's `mode`) — listed so the value
    # dropdown offers both states like HA's own State trigger, not just the live
    # one.
    "remote": _ON_OFF,
    "automation": _ON_OFF,
    "script": _ON_OFF,
    "siren": _ON_OFF,
    "humidifier": _ON_OFF,
    "update": _ON_OFF,
    "calendar": _ON_OFF,
    "cover": _enum_state_values("cover", "CoverState", ["closed", "closing", "open", "opening"]),
    "lock": _enum_state_values(
        "lock",
        "LockState",
        ["jammed", "locked", "locking", "open", "opening", "unlocked", "unlocking"],
    ),
    "media_player": _enum_state_values(
        "media_player",
        "MediaPlayerState",
        ["off", "on", "idle", "playing", "paused", "standby", "buffering"],
    ),
    "climate": _enum_state_values(
        "climate", "HVACMode", ["off", "heat", "cool", "heat_cool", "auto", "dry", "fan_only"]
    ),
    "vacuum": _enum_state_values(
        "vacuum", "VacuumActivity", ["cleaning", "docked", "idle", "paused", "returning", "error"]
    ),
    "person": [STATE_HOME, STATE_NOT_HOME],
    "device_tracker": [STATE_HOME, STATE_NOT_HOME],
    "sun": ["above_horizon", "below_horizon"],
    "alarm_control_panel": _enum_state_values(
        "alarm_control_panel",
        "AlarmControlPanelState",
        [
            "disarmed",
            "armed_home",
            "armed_away",
            "armed_night",
            "armed_vacation",
            "armed_custom_bypass",
            "pending",
            "arming",
            "disarming",
            "triggered",
        ],
    ),
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
        # person / device_tracker: include zone friendly names. zone.home is
        # skipped — HA reports presence there as the literal state `home`
        # (already offered via the domain list), never as the zone's friendly
        # name, so that label could never match.
        if domain in ("person", "device_tracker"):
            for z in hass.states.async_all("zone"):
                if z.entity_id == "zone.home":
                    continue
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
