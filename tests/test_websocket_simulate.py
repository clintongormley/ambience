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
    """Create an HA area with one grouped state scene; returns its area_id."""
    area = ar.async_get(hass).async_create("Kitchen")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area.id,
        {
            "conditions": [],
            "scenes": [
                {
                    "category": "g1",
                    "name": "Motion on",
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.motion",
                            "states": ["on"],
                        }
                    },
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.k"], "params": {}}
                    ],
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
        category="g1",
        now="2026-12-21T17:30:00+00:00",
        overrides={"binary_sensor.motion": {"state": "on"}},
    )
    assert resp["success"] is True
    result = resp["result"]["result"]
    assert result["cause"]["kind"] == "simulated"
    assert result["category"] == "g1"
    # Overriding motion → on makes the scene match.
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
        category="g1",
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
        category="g1",
        now="2026-12-21T17:30:00+00:00",
        overrides={"binary_sensor.motion": "on"},  # should be {"state": "on"}
    )
    assert resp["success"] is False


async def test_simulate_rejects_too_many_overrides(
    hass: HomeAssistant, hass_ws_client, seeded_area
) -> None:
    """An oversized overrides map is rejected at the schema layer (bounded work)."""
    from custom_components.ambience.websocket import MAX_SIMULATE_ENTRIES

    overrides = {f"sensor.s{i}": {"state": "on"} for i in range(MAX_SIMULATE_ENTRIES + 1)}
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="area",
        scope_id=seeded_area,
        category="g1",
        now="2026-12-21T17:30:00+00:00",
        overrides=overrides,
    )
    assert resp["success"] is False


async def test_simulate_inputs_returns_panel_shape(
    hass: HomeAssistant, hass_ws_client, seeded_area
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate/inputs",
        scope_kind="area",
        scope_id=seeded_area,
        category="g1",
    )
    assert resp["success"] is True
    result = resp["result"]
    assert "has_time" in result
    motion = next(k for k in result["knobs"] if k.get("entity_id") == "binary_sensor.motion")
    assert motion["kind"] == "entity"
    assert motion["control"] == "select"
    assert motion["options"] == ["on", "off"]


async def test_simulate_accepts_verdicts(hass: HomeAssistant, hass_ws_client, seeded_area) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="area",
        scope_id=seeded_area,
        category="g1",
        now="2026-12-21T17:30:00+00:00",
        overrides={},
        verdicts={"script": {"somekey": True}},
    )
    assert resp["success"] is True
    assert resp["result"]["result"]["category"] == "g1"


# --- simulate/inputs: ValueError/ServiceValidationError path (lines 957-959) ---


async def test_simulate_inputs_unknown_scope_kind_returns_validation_error(
    hass: HomeAssistant, hass_ws_client, seeded_area
) -> None:
    """simulate/inputs maps ValueError (from an unknown scope_kind) to a
    validation_error response (lines 957-959)."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate/inputs",
        scope_kind="not_a_real_scope",
        scope_id=seeded_area,
        category="g1",
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


# --- simulate: ValueError/ServiceValidationError path (lines 1003-1005) ---


async def test_simulate_unknown_scope_kind_returns_validation_error(
    hass: HomeAssistant, hass_ws_client, seeded_area
) -> None:
    """simulate maps ValueError (from an unknown scope_kind) to a
    validation_error response (lines 1003-1005)."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="not_a_real_scope",
        scope_id=seeded_area,
        category="g1",
        now="2026-12-21T17:30:00+00:00",
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


async def test_simulate_rejects_malformed_override_entity_id(
    hass: HomeAssistant, hass_ws_client, seeded_area
) -> None:
    """A non-entity-id override key must be rejected at the schema layer, not
    raise InvalidEntityFormatError mid-resolve (→ unknown_error + traceback)."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="area",
        scope_id=seeded_area,
        category="g1",
        now="2026-12-21T17:30:00+00:00",
        overrides={"not an entity id": {"state": "on"}},
    )
    assert not resp["success"]
    assert resp["error"]["code"] == "invalid_format"


async def test_simulate_rejects_non_string_override_state(
    hass: HomeAssistant, hass_ws_client, seeded_area
) -> None:
    """A non-string `state` raises TypeError in State() mid-resolve unless the
    schema rejects it first."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="area",
        scope_id=seeded_area,
        category="g1",
        now="2026-12-21T17:30:00+00:00",
        overrides={"binary_sensor.motion": {"state": 5}},
    )
    assert not resp["success"]
    assert resp["error"]["code"] == "invalid_format"


async def test_simulate_rejects_naive_now(hass: HomeAssistant, hass_ws_client, seeded_area) -> None:
    """A timezone-naive `now` produces naive-vs-aware TypeErrors inside
    condition snapshots, silently distorting results — reject it up front."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="area",
        scope_id=seeded_area,
        category="g1",
        now="2026-12-21T17:30:00",
        overrides={},
    )
    assert not resp["success"]
    assert resp["error"]["code"] == "validation_error"
