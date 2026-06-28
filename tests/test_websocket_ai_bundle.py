"""WebSocket read API for the AI bundle (the live authoring/diagnosis export)."""

from __future__ import annotations

from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_STORE, DOMAIN


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


async def test_ai_bundle_returns_catalog_actions_definitions_config(
    hass, installed, hass_ws_client
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area("a", {"scenes": []})

    resp = await _ws_send(hass_ws_client, type="ambience/ai_bundle")

    assert resp["success"] is True
    bundle = resp["result"]
    assert bundle["ambience_ai_bundle"] == 1
    # With the integration fully set up, the running version resolves to a string.
    assert isinstance(bundle["ambience_version"], str) and bundle["ambience_version"]
    assert bundle["generated_at"]
    assert "areas" in bundle["catalog"]
    assert "entities" in bundle["catalog"]
    assert "exposed" in bundle["actions"]
    assert any(c["id"] == "general" for c in bundle["definitions"]["categories"])
    assert "a" in bundle["config"]["areas"]


async def test_ai_bundle_redacts_sensitive_config(hass, installed, hass_ws_client) -> None:
    from homeassistant.components.diagnostics import REDACTED

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_condition_config(
        "day", {"workday_sensor": "binary_sensor.workday", "workday_calendar": "calendar.work"}
    )

    resp = await _ws_send(hass_ws_client, type="ambience/ai_bundle")

    assert resp["result"]["config"]["conditions"]["day"]["workday_sensor"] == REDACTED
