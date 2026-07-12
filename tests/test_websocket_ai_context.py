"""WebSocket read API for the bounded AI context (the MCP authoring export)."""

from __future__ import annotations

from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry


@pytest.fixture
async def installed(hass, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def _ws_send(hass_ws_client, **payload: Any) -> dict:
    client = await hass_ws_client()
    payload.setdefault("id", 1)
    await client.send_json(payload)
    return await client.receive_json()


async def test_ai_context_returns_a_summary_not_entity_rows(
    hass, installed, hass_ws_client
) -> None:
    msg = await _ws_send(hass_ws_client, type="ambience/ai_context")

    assert msg["success"]
    result = msg["result"]
    assert "ambience_ai_context" not in result
    assert "entity_summary" in result["catalog"]
    assert "entities" not in result["catalog"]
    assert "traces" not in result


async def test_ai_bundle_still_returns_the_full_catalog(hass, installed, hass_ws_client) -> None:
    # The paste flow depends on the FAT bundle. This command must not have changed.
    msg = await _ws_send(hass_ws_client, type="ambience/ai_bundle")

    assert msg["success"]
    assert "entities" in msg["result"]["catalog"]
    assert msg["result"]["ambience_ai_bundle"] == 1
