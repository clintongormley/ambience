"""Apply voice-assistant exposure to the ambience scope switches.

The per-assistant on/off map lives in the Ambience store and is edited on the
panel's Advanced page. Exposure is applied when each switch is added; saving a
change dispatches SIGNAL_EXPOSED_ASSISTANTS_UPDATED, whose listener re-applies it
to every live switch in place (no entry reload).
"""

from __future__ import annotations

from homeassistant.components.homeassistant.exposed_entities import async_expose_entity
from homeassistant.core import HomeAssistant, callback

from .const import (
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
    KNOWN_ASSISTANTS,
)


@callback
def async_apply_switch_exposure(hass: HomeAssistant, entity_id: str) -> None:
    """Expose/unexpose one switch on each known assistant per the stored map."""
    enabled = hass.data[DOMAIN][DATA_STORE].get_exposed_assistants()
    for assistant in KNOWN_ASSISTANTS:
        # Default missing keys to unexposed (e.g. a new assistant added to
        # KNOWN_ASSISTANTS before the store backfills it); get_exposed_assistants
        # already returns a complete bool map, so this is belt-and-braces.
        async_expose_entity(hass, assistant, entity_id, bool(enabled.get(assistant, False)))


@callback
def async_reapply_all_switch_exposure(hass: HomeAssistant, _: object = None) -> None:
    """Re-apply exposure to every live ambience switch (after a settings change)."""
    for switch in list(hass.data.get(DOMAIN, {}).get(DATA_SWITCHES, {}).values()):
        async_apply_switch_exposure(hass, switch.entity_id)
