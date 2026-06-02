"""Plausible state values for an entity — shared by the websocket API and the
what-if simulator. Pure: reads `hass.states` only."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

# Domain-typical state sets. For domains not listed, we fall back to just the
# entity's current state.
_DOMAIN_KNOWN_STATES: dict[str, list[str]] = {
    "binary_sensor": ["on", "off"],
    "switch": ["on", "off"],
    "light": ["on", "off"],
    "fan": ["on", "off"],
    "input_boolean": ["on", "off"],
    "cover": ["open", "closed", "opening", "closing", "stopped"],
    "lock": ["locked", "unlocked", "locking", "unlocking", "jammed"],
    "media_player": ["playing", "paused", "idle", "off", "on", "standby", "buffering"],
    "climate": ["heat", "cool", "off", "auto", "dry", "fan_only", "heat_cool"],
    "vacuum": ["cleaning", "docked", "paused", "idle", "returning", "error"],
    "person": ["home", "not_home"],
    "device_tracker": ["home", "not_home"],
    "sun": ["above_horizon", "below_horizon"],
    "alarm_control_panel": [
        "disarmed",
        "armed_home",
        "armed_away",
        "armed_night",
        "armed_vacation",
        "armed_custom_bypass",
        "triggered",
        "pending",
        "arming",
    ],
}


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
        if state.state and state.state not in ("unavailable", "unknown"):
            _add(state.state)

    return states
