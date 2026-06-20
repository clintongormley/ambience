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

import voluptuous as vol
from homeassistant.const import STATE_OFF, STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.service import async_extract_entity_ids

from .const import DOMAIN

_INDETERMINATE = (STATE_UNKNOWN, STATE_UNAVAILABLE)
_COVER_MOVING = ("opening", "closing")

SERVICE_TURN_ON = "turn_on"
SERVICE_TURN_OFF = "turn_off"
SERVICE_COVER_SAFE_OPEN = "cover_safe_open"
SERVICE_COVER_SAFE_CLOSE = "cover_safe_close"
SERVICE_COVER_SAFE_SET_POSITION = "cover_safe_set_position"
SERVICE_COVER_SAFE_SET_TILT_POSITION = "cover_safe_set_tilt_position"

_NO_FIELDS_SCHEMA = cv.make_entity_service_schema({})


def _int_0_100_schema(field: str):
    return cv.make_entity_service_schema(
        {vol.Required(field): vol.All(vol.Coerce(int), vol.Range(min=0, max=100))}
    )


_POSITION_SCHEMA = _int_0_100_schema("position")
_TILT_SCHEMA = _int_0_100_schema("tilt_position")


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


def _at_rest_known(state) -> bool:
    """True when state is present, determinate, and not mid-travel."""
    return (
        state is not None and state.state not in _INDETERMINATE and state.state not in _COVER_MOVING
    )


def _needs_open(state) -> bool:
    if not _at_rest_known(state):
        return True
    pos = state.attributes.get("current_position")
    if pos is not None:
        return pos != 100
    return state.state != "open"


def _needs_close(state) -> bool:
    if not _at_rest_known(state):
        return True
    pos = state.attributes.get("current_position")
    if pos is not None:
        return pos != 0
    return state.state != "closed"


def _needs_position(state, target: int, attr: str) -> bool:
    if not _at_rest_known(state):
        return True
    pos = state.attributes.get(attr)
    if pos is None:
        return True  # can't compare → passthrough
    return pos != target


async def _async_cover_open(hass: HomeAssistant, call: ServiceCall) -> None:
    eids = await async_extract_entity_ids(hass, call)
    to_send = sorted(e for e in eids if _needs_open(hass.states.get(e)))
    if to_send:
        await hass.services.async_call(
            "cover",
            "open_cover",
            {},
            target={"entity_id": to_send},
            blocking=True,
            context=call.context,
        )


async def _async_cover_close(hass: HomeAssistant, call: ServiceCall) -> None:
    eids = await async_extract_entity_ids(hass, call)
    to_send = sorted(e for e in eids if _needs_close(hass.states.get(e)))
    if to_send:
        await hass.services.async_call(
            "cover",
            "close_cover",
            {},
            target={"entity_id": to_send},
            blocking=True,
            context=call.context,
        )


async def _async_cover_set_position(hass: HomeAssistant, call: ServiceCall) -> None:
    target = call.data["position"]
    eids = await async_extract_entity_ids(hass, call)
    to_send = sorted(
        e for e in eids if _needs_position(hass.states.get(e), target, "current_position")
    )
    if to_send:
        await hass.services.async_call(
            "cover",
            "set_cover_position",
            {"position": target},
            target={"entity_id": to_send},
            blocking=True,
            context=call.context,
        )


async def _async_cover_set_tilt(hass: HomeAssistant, call: ServiceCall) -> None:
    target = call.data["tilt_position"]
    eids = await async_extract_entity_ids(hass, call)
    to_send = sorted(
        e for e in eids if _needs_position(hass.states.get(e), target, "current_tilt_position")
    )
    if to_send:
        await hass.services.async_call(
            "cover",
            "set_cover_tilt_position",
            {"tilt_position": target},
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
    hass.services.async_register(
        DOMAIN,
        SERVICE_COVER_SAFE_OPEN,
        partial(_async_cover_open, hass),
        schema=_NO_FIELDS_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_COVER_SAFE_CLOSE,
        partial(_async_cover_close, hass),
        schema=_NO_FIELDS_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_COVER_SAFE_SET_POSITION,
        partial(_async_cover_set_position, hass),
        schema=_POSITION_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_COVER_SAFE_SET_TILT_POSITION,
        partial(_async_cover_set_tilt, hass),
        schema=_TILT_SCHEMA,
    )


@callback
def async_unregister_builtin_services(hass: HomeAssistant) -> None:
    for name in (
        SERVICE_TURN_ON,
        SERVICE_TURN_OFF,
        SERVICE_COVER_SAFE_OPEN,
        SERVICE_COVER_SAFE_CLOSE,
        SERVICE_COVER_SAFE_SET_POSITION,
        SERVICE_COVER_SAFE_SET_TILT_POSITION,
    ):
        hass.services.async_remove(DOMAIN, name)
