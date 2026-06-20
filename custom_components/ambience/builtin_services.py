"""Ambience-provided built-in services.

Real HA services registered under the `ambience` domain that do more than a
plain service pass-through:

  * turn_on / turn_off — cross-domain on/off (delegating to
    homeassistant.turn_on / turn_off) that skips entities already in the
    target state.
  * cover_safe_* — open / close / set_position / set_tilt_position that read
    each cover's state and command only those not already at the goal (no
    redundant relay click).

Labels, target-domain limits, and fields live in services.yaml + strings.json,
so HA's service catalog drives the scene-editor UI unchanged.
"""

from __future__ import annotations

from functools import partial

from homeassistant.const import STATE_OFF, STATE_ON
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.service import async_extract_entity_ids

from .const import DOMAIN

SERVICE_TURN_ON = "turn_on"
SERVICE_TURN_OFF = "turn_off"
SERVICE_COVER_SAFE_OPEN = "cover_safe_open"
SERVICE_COVER_SAFE_CLOSE = "cover_safe_close"
SERVICE_COVER_SAFE_SET_POSITION = "cover_safe_set_position"
SERVICE_COVER_SAFE_SET_TILT_POSITION = "cover_safe_set_tilt_position"

_NO_FIELDS_SCHEMA = cv.make_entity_service_schema({})


async def _async_turn_on(hass: HomeAssistant, call: ServiceCall) -> None:
    eids = await async_extract_entity_ids(hass, call)
    to_send = sorted(e for e in eids if (s := hass.states.get(e)) is None or s.state != STATE_ON)
    if to_send:
        await hass.services.async_call(
            "homeassistant",
            "turn_on",
            {},
            target={"entity_id": to_send},
            blocking=True,
            context=call.context,
        )


async def _async_turn_off(hass: HomeAssistant, call: ServiceCall) -> None:
    eids = await async_extract_entity_ids(hass, call)
    to_send = sorted(e for e in eids if (s := hass.states.get(e)) is None or s.state != STATE_OFF)
    if to_send:
        await hass.services.async_call(
            "homeassistant",
            "turn_off",
            {},
            target={"entity_id": to_send},
            blocking=True,
            context=call.context,
        )


@callback
def async_register_builtin_services(hass: HomeAssistant) -> None:
    hass.services.async_register(
        DOMAIN, SERVICE_TURN_ON, partial(_async_turn_on, hass), schema=_NO_FIELDS_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_TURN_OFF, partial(_async_turn_off, hass), schema=_NO_FIELDS_SCHEMA
    )


@callback
def async_unregister_builtin_services(hass: HomeAssistant) -> None:
    for name in (SERVICE_TURN_ON, SERVICE_TURN_OFF):
        hass.services.async_remove(DOMAIN, name)
