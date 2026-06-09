"""Apply voice-assistant exposure to the ambience scope switches.

The per-assistant choice lives in the config-entry options; the resolved
{assistant: bool} map is stashed in hass.data during setup. Exposure is applied
when each switch is added; an options change reloads the entry, which re-applies
it via the freshly-stashed map.
"""

from __future__ import annotations

from homeassistant.components.homeassistant.exposed_entities import async_expose_entity
from homeassistant.core import HomeAssistant, callback

from .const import (
    DATA_EXPOSED_ASSISTANTS,
    DEFAULT_EXPOSED_ASSISTANTS,
    DOMAIN,
    KNOWN_ASSISTANTS,
)


@callback
def async_apply_switch_exposure(hass: HomeAssistant, entity_id: str) -> None:
    """Expose/unexpose one switch on each known assistant per the entry option."""
    enabled = hass.data.get(DOMAIN, {}).get(
        DATA_EXPOSED_ASSISTANTS, DEFAULT_EXPOSED_ASSISTANTS
    )
    for assistant in KNOWN_ASSISTANTS:
        # Default missing keys to unexposed (e.g. a new assistant added to
        # KNOWN_ASSISTANTS before the user re-saves options); bool() guards
        # against a non-bool value in corrupted persisted options.
        async_expose_entity(hass, assistant, entity_id, bool(enabled.get(assistant, False)))
