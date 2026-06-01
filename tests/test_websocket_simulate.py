"""WebSocket commands for the what-if simulator."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
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


@pytest.fixture
async def seeded_area(hass: HomeAssistant, installed) -> str:
    """Create an HA area with one grouped state rule; returns its area_id."""
    area = ar.async_get(hass).async_create("Kitchen")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area.id,
        {
            "matchers": [],
            "rules": [
                {
                    "group": "g1",
                    "name": "Motion on",
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.motion",
                            "states": ["on"],
                        }
                    },
                    "actions": [],
                }
            ],
        },
    )
    return area.id


async def test_simulate_returns_result(hass: HomeAssistant, hass_ws_client, seeded_area) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="area",
        scope_id=seeded_area,
        group="g1",
        now="2026-12-21T17:30:00+00:00",
        overrides={"binary_sensor.motion": {"state": "on"}},
    )
    assert resp["success"] is True
    result = resp["result"]["result"]
    assert result["cause"]["kind"] == "simulated"
    assert result["group"] == "g1"
    # Overriding motion → on makes the rule match.
    assert result["outcome"] == "acted"
    assert result["winner_name"] == "Motion on"


async def test_simulate_rejects_unparseable_now(
    hass: HomeAssistant, hass_ws_client, seeded_area
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="area",
        scope_id=seeded_area,
        group="g1",
        now="not-a-date",
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


async def test_simulate_rejects_malformed_override(
    hass: HomeAssistant, hass_ws_client, seeded_area
) -> None:
    """A non-dict override value is rejected at the schema layer, not mid-resolve."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="area",
        scope_id=seeded_area,
        group="g1",
        now="2026-12-21T17:30:00+00:00",
        overrides={"binary_sensor.motion": "on"},  # should be {"state": "on"}
    )
    assert resp["success"] is False


async def test_simulate_inputs_returns_panel_shape(
    hass: HomeAssistant, hass_ws_client, seeded_area
) -> None:
    """`ambience/simulate/inputs` returns knobs/has_time/opaque for a group."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate/inputs",
        scope_kind="area",
        scope_id=seeded_area,
        group="g1",
    )
    assert resp["success"] is True
    result = resp["result"]
    assert "has_time" in result and "opaque" in result
    # The group's state rule references binary_sensor.motion → one entity knob.
    ids = [k["entity_id"] for k in result["knobs"]]
    assert "binary_sensor.motion" in ids
    assert "states" in result["knobs"][0]  # enriched with plausible options
