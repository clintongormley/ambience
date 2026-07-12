"""The shape-drift gate for MCP protocol 1.

The MCP server ships a FROZEN adapter per protocol and loads the one the backend
names in `ambience/mcp/hello`. That is only safe if MCP_PROTOCOL is bumped whenever
a payload's SHAPE changes — otherwise the v1 adapter silently receives a v2 payload.

So the shape is pinned. Change a key and this test fails, telling you to bump the
protocol and add an adapter, or revert. Values are NOT pinned (they vary per house);
only the structure is.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.ambience.ai_context import build_ai_context
from custom_components.ambience.const import DATA_STORE, DOMAIN, MCP_PROTOCOL
from custom_components.ambience.entity_catalog import entity_rows, find_entities
from custom_components.ambience.store import AmbienceStore

GOLDEN = Path(__file__).parent / "fixtures" / "protocol_1_shapes.json"

_DRIFT = (
    "The protocol-{protocol} `{payload}` payload shape changed.\n"
    "  added:   {added}\n"
    "  removed: {removed}\n\n"
    "The ambience-mcp package ships a FROZEN adapter per protocol; a v1 adapter "
    "cannot read a v2 payload.\n"
    "Either revert the shape change, or:\n"
    "  1. bump MCP_PROTOCOL in custom_components/ambience/const.py\n"
    "  2. add mcp-server/src/ambience_mcp/protocols/v<new>.py\n"
    "  3. re-record tests/fixtures/protocol_1_shapes.json for the new protocol\n"
    "  4. publish the MCP server BEFORE the integration (bin/release.sh gate 2)"
)


def shape_of(value: Any, prefix: str = "") -> set[str]:
    """Every key path in a payload, ignoring values and list length.

    A list contributes the union of its items' shapes, so a house with two lights
    and a house with two hundred produce the same shape."""
    paths: set[str] = set()
    if isinstance(value, dict):
        for key, sub in value.items():
            path = f"{prefix}.{key}" if prefix else key
            paths.add(path)
            paths |= shape_of(sub, path)
    elif isinstance(value, list):
        for item in value:
            paths |= shape_of(item, f"{prefix}[]")
    return paths


def assert_shape(name: str, payload: Any) -> None:
    golden = json.loads(GOLDEN.read_text())
    assert golden["protocol"] == MCP_PROTOCOL, (
        f"MCP_PROTOCOL is {MCP_PROTOCOL} but the golden records "
        f"{golden['protocol']}. Re-record the golden for the new protocol."
    )
    expected = set(golden["shapes"][name])
    actual = shape_of(payload)
    if actual != expected:
        raise AssertionError(
            _DRIFT.format(
                protocol=MCP_PROTOCOL,
                payload=name,
                added=sorted(actual - expected) or "none",
                removed=sorted(expected - actual) or "none",
            )
        )


@pytest.fixture
async def seeded(hass: HomeAssistant) -> AmbienceStore:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area(
        "living_room",
        {"scenes": [{"category": "general", "actions": [{"service": "light.turn_on"}]}]},
    )
    hass.data[DOMAIN] = {DATA_STORE: store}
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get_or_create("light", "ambience", "l1", suggested_object_id="lamp")
    hass.states.async_set(entry.entity_id, "on")
    return store


async def test_ai_context_shape_is_pinned(hass: HomeAssistant, seeded: AmbienceStore) -> None:
    assert_shape("ai_context", await build_ai_context(hass))


async def test_entities_find_shape_is_pinned(hass: HomeAssistant, seeded: AmbienceStore) -> None:
    assert_shape("entities_find", find_entities(entity_rows(hass)))
