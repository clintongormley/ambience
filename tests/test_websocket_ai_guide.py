"""WebSocket read API for the shipped authoring guide: served live from the
running install and version-gated so a client re-reads it only when the install
changes."""

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


async def test_ai_guide_returns_guide_and_version_stamps(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/ai_guide")

    assert resp["success"] is True
    result = resp["result"]
    assert result["ambience_ai_bundle"] == 1
    # With the integration fully set up, the running version resolves to a string.
    assert isinstance(result["ambience_version"], str) and result["ambience_version"]
    # The full shipped guide markdown (carries the generator banner).
    assert result["guide"].startswith("<!-- AUTO-GENERATED")
    assert "unchanged" not in result


async def test_ai_guide_unchanged_when_version_matches(hass, installed, hass_ws_client) -> None:
    first = (await _ws_send(hass_ws_client, type="ambience/ai_guide"))["result"]

    resp = await _ws_send(
        hass_ws_client, type="ambience/ai_guide", have_version=first["ambience_version"]
    )

    result = resp["result"]
    assert result["unchanged"] is True
    assert "guide" not in result  # a matching version skips the transfer
    assert result["ambience_version"] == first["ambience_version"]
    assert result["ambience_ai_bundle"] == 1


async def test_ai_guide_returns_guide_when_version_differs(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/ai_guide", have_version="0.0.0-stale")

    result = resp["result"]
    assert "guide" in result
    assert "unchanged" not in result
