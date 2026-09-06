"""The MCP handshake: the one compatibility signal that is always deliverable.

Every other version check this project has tried lived *inside* a payload that
could be too large to return — so the failure swallowed its own diagnostic. This
command is a handful of bytes: it always arrives."""

from __future__ import annotations

import json
from typing import Any

from custom_components.ambience.const import MCP_PROTOCOL


async def _ws_send(hass_ws_client, **payload: Any) -> dict:
    client = await hass_ws_client()
    payload.setdefault("id", 1)
    await client.send_json(payload)
    return await client.receive_json()


async def test_hello_declares_the_protocol(hass, installed, hass_ws_client) -> None:
    msg = await _ws_send(hass_ws_client, type="ambience/mcp/hello")

    assert msg["success"]
    assert msg["result"]["protocol"] == MCP_PROTOCOL


async def test_hello_declares_the_oldest_mcp_it_serves(hass, installed, hass_ws_client) -> None:
    msg = await _ws_send(hass_ws_client, type="ambience/mcp/hello")

    assert isinstance(msg["result"]["min_mcp_version"], str)
    assert msg["result"]["min_mcp_version"]


async def test_hello_carries_the_ambience_version(hass, installed, hass_ws_client) -> None:
    msg = await _ws_send(hass_ws_client, type="ambience/mcp/hello")

    assert "ambience_version" in msg["result"]


async def test_hello_is_tiny(hass, installed, hass_ws_client) -> None:
    # The whole point: this can never be swallowed by a size limit, whatever the
    # house looks like. If it ever grows, the mechanism is broken.
    msg = await _ws_send(hass_ws_client, type="ambience/mcp/hello")

    assert len(json.dumps(msg["result"])) < 500


async def test_hello_returns_only_the_three_fields(hass, installed, hass_ws_client) -> None:
    msg = await _ws_send(hass_ws_client, type="ambience/mcp/hello")

    assert set(msg["result"]) == {"protocol", "ambience_version", "min_mcp_version"}
