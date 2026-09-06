"""WebSocket commands for the what-if simulator and scope diagnostics."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv
from homeassistant.util import dt as dt_util

from ..diagnostics import scope_diagnostics
from ..errors import AmbienceError
from ..simulate import SimulatedWorld, run_simulation, simulate_inputs, sun_anchors
from .common import _strict_int, send_ambience_error

# Upper bound on simulate `overrides`/`verdicts` entries. The simulator UI only
# tweaks a handful of inputs; this cap stops a malformed/abusive admin request
# from materialising an unbounded number of State objects on the event loop.
MAX_SIMULATE_ENTRIES = 1000


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/diagnostics/scope",
        vol.Required("scope_kind"): str,
        vol.Optional("scope_id"): vol.Any(str, None),
        vol.Required("category"): str,
    }
)
@websocket_api.async_response
async def _ws_scope_diagnostics(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        result = scope_diagnostics(hass, msg["scope_kind"], msg.get("scope_id"), msg["category"])
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc)
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/simulate/inputs",
        vol.Required("scope_kind"): str,
        vol.Optional("scope_id"): vol.Any(str, None),
        vol.Required("category"): str,
    }
)
@websocket_api.async_response
async def _ws_simulate_inputs(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The editable inputs for a category's simulator panel (read-only)."""
    try:
        result = await simulate_inputs(
            hass, msg["scope_kind"], msg.get("scope_id"), msg["category"]
        )
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc)
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/simulate",
        vol.Required("scope_kind"): str,
        vol.Optional("scope_id"): vol.Any(str, None),
        vol.Required("category"): str,
        vol.Required("now"): str,
        # Each override is {state?: str, attributes?: dict, for?: dict}, keyed
        # by a valid entity_id — rejected at the schema layer, not mid-resolve
        # (a bad key/state would otherwise raise inside State()).
        # Length-capped so an oversized map can't stall the event loop.
        vol.Optional("overrides", default=dict): vol.All(
            {
                cv.entity_id: {
                    vol.Optional("state"): str,
                    vol.Optional("attributes"): dict,
                    vol.Optional("for"): dict,
                }
            },
            vol.Length(max=MAX_SIMULATE_ENTRIES),
        ),
        # Per opaque-condition verdicts: condition_key -> {result_key: bool}.
        vol.Optional("verdicts", default=dict): vol.All(
            {str: {str: bool}}, vol.Length(max=MAX_SIMULATE_ENTRIES)
        ),
        # The winning scene index the previous simulate step acted on, carried
        # forward so a re-won scene debounces (None to start a fresh sequence).
        vol.Optional("prev_applied"): vol.Any(_strict_int, None),
    }
)
@websocket_api.async_response
async def _ws_simulate(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Resolve a category against a hypothetical world (read-only)."""
    now = dt_util.parse_datetime(msg["now"])
    if now is None:
        send_ambience_error(
            connection,
            msg["id"],
            AmbienceError("unparseable_now", now=msg["now"]),
        )
        return
    if now.tzinfo is None:
        # A naive now produces naive-vs-aware TypeErrors inside condition
        # snapshots, which silently distort results (per-condition None).
        send_ambience_error(
            connection,
            msg["id"],
            AmbienceError("now_not_timezone_aware", now=msg["now"]),
        )
        return
    world = SimulatedWorld(
        now=now,
        overrides=msg.get("overrides") or {},
        verdicts=msg.get("verdicts") or {},
    )
    try:
        result, applied_index = await run_simulation(
            hass,
            msg["scope_kind"],
            msg.get("scope_id"),
            msg["category"],
            world,
            prev_applied=msg.get("prev_applied"),
        )
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc)
        return
    connection.send_result(msg["id"], {"result": result, "applied_index": applied_index})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/simulate/sun_anchors",
        vol.Required("date"): str,
    }
)
@websocket_api.async_response
async def _ws_simulate_sun_anchors(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The six sun anchors for a date, so the simulator's Sun-mode 'When' can
    resolve an anchor ± offset to a concrete instant (read-only)."""
    try:
        anchors = sun_anchors(hass, msg["date"])
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc)
        return
    connection.send_result(msg["id"], {"anchors": anchors})
