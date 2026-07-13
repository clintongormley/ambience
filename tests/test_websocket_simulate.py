"""WebSocket commands for the what-if simulator."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.errors import AmbienceError
from custom_components.ambience.simulate import sun_anchors


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
    # binary_sensor.motion is referenced by the seeded scene but never given a
    # state here, so it is absent (hass.states.get -> None). The simulator reads
    # an absent entity as `unavailable` and offers it as a choice, alongside the
    # domain's real states, so the control's seeded value matches what it sends.
    assert motion["options"] == ["on", "off", "unavailable"]
    assert motion["live_state"] == "unavailable"


async def test_simulate_returns_applied_index_and_accepts_prev_applied(
    hass: HomeAssistant, hass_ws_client, seeded_area
) -> None:
    """The response carries applied_index; replaying it as prev_applied debounces
    the re-won scene (no actions), mirroring production's last_applied."""
    first = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="area",
        scope_id=seeded_area,
        category="g1",
        now="2026-12-21T17:30:00+00:00",
        overrides={"binary_sensor.motion": {"state": "on"}},
    )
    assert first["success"] is True
    assert first["result"]["result"]["outcome"] == "acted"
    applied = first["result"]["applied_index"]
    assert isinstance(applied, int)

    second = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="area",
        scope_id=seeded_area,
        category="g1",
        now="2026-12-21T17:30:00+00:00",
        overrides={"binary_sensor.motion": {"state": "on"}},
        prev_applied=applied,
    )
    assert second["success"] is True
    assert second["result"]["result"]["outcome"] == "debounced"
    assert second["result"]["result"]["actions"] == []
    assert second["result"]["applied_index"] == applied


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


async def test_prev_applied_rejects_booleans(
    hass: HomeAssistant, hass_ws_client, seeded_area
) -> None:
    """bool subclasses int, and prev_applied is compared to a scene index with
    == — True would silently debounce index 1. The same range rejects bools
    for scene priority; the schema must match."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/simulate",
        scope_kind="area",
        scope_id=seeded_area,
        category="g1",
        now="2026-12-21T17:30:00+00:00",
        prev_applied=True,
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


def test_sun_anchors_returns_six_iso_strings(hass: HomeAssistant) -> None:
    hass.config.latitude = 51.5
    hass.config.longitude = -0.12
    hass.config.elevation = 0
    result = sun_anchors(hass, "2026-07-04")
    assert set(result) == {"sunrise", "sunset", "noon", "midnight", "dawn", "dusk"}
    # A London midsummer date has every anchor defined.
    for name, iso in result.items():
        assert iso is not None, name
        # Parseable, tz-aware, and expressed in UTC.
        assert datetime.fromisoformat(iso).tzinfo is not None
        assert datetime.fromisoformat(iso).utcoffset() == timedelta(0), name


def test_sun_anchors_nulls_undefined_anchors_in_polar_day(hass: HomeAssistant) -> None:
    # Above the Arctic circle at midsummer the sun never sets: sunrise/sunset
    # are undefined and come back as None; solar noon/midnight still exist.
    hass.config.latitude = 78.0
    hass.config.longitude = 15.0
    hass.config.elevation = 0
    result = sun_anchors(hass, "2026-06-21")
    assert result["sunrise"] is None
    assert result["sunset"] is None
    assert result["noon"] is not None


def test_sun_anchors_rejects_bad_date(hass: HomeAssistant) -> None:
    with pytest.raises(AmbienceError) as exc:
        sun_anchors(hass, "not-a-date")
    assert exc.value.translation_key == "unparseable_date"


async def test_ws_sun_anchors_returns_anchors(
    hass: HomeAssistant, hass_ws_client, installed
) -> None:
    hass.config.latitude = 51.5
    hass.config.longitude = -0.12
    hass.config.elevation = 0
    resp = await _ws_send(hass_ws_client, type="ambience/simulate/sun_anchors", date="2026-07-04")
    assert resp["success"] is True
    anchors = resp["result"]["anchors"]
    assert set(anchors) == {"sunrise", "sunset", "noon", "midnight", "dawn", "dusk"}
    assert anchors["sunset"] is not None


async def test_ws_sun_anchors_rejects_bad_date(
    hass: HomeAssistant, hass_ws_client, installed
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/simulate/sun_anchors", date="nope")
    assert resp["success"] is False
    assert resp["error"]["translation_key"] == "unparseable_date"
