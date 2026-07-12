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
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr

from custom_components.ambience.ai_context import build_ai_context
from custom_components.ambience.builtin_services import async_register_builtin_services
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
    """A house with enough real registry data that every branch of the payload
    comes out non-empty — an empty branch pins only its container key, so a
    rename inside it (e.g. `area_id` -> `id`) would produce zero diff and sail
    through the gate.

    The `living_room` SCOPE saved below is Ambience's own config concept, not an
    HA area-registry entry, so it does not by itself populate catalog.areas/
    floors — those need real area/floor-registry entries (mirrors the house
    pattern in test_ai_bundle.py / test_ai_context.py / test_entity_catalog.py).
    """
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area(
        "living_room",
        {"scenes": [{"category": "general", "actions": [{"service": "light.turn_on"}]}]},
    )
    hass.data[DOMAIN] = {DATA_STORE: store}

    # A real floor + area (catalog.areas[], catalog.floors[]) with an entity in
    # it (entity_summary.by_area) that carries a device_class
    # (entity_summary.by_device_class). Named distinctly from the "living_room"
    # SCOPE above — an HA area registry id and an Ambience scope key are
    # different namespaces, and giving them different names keeps that clear
    # when reading the recorded golden.
    floor = fr.async_get(hass).async_create("Upstairs")
    area_reg = ar.async_get(hass)
    area = area_reg.async_create("Kitchen")
    area_reg.async_update(area.id, floor_id=floor.floor_id)

    ent_reg = er.async_get(hass)
    lamp = ent_reg.async_get_or_create("light", "ambience", "l1", suggested_object_id="lamp")
    ent_reg.async_update_entity(lamp.entity_id, area_id=area.id)
    hass.states.async_set(lamp.entity_id, "on")

    motion = ent_reg.async_get_or_create(
        "binary_sensor",
        "ambience",
        "m1",
        suggested_object_id="motion",
        original_device_class="motion",
    )
    ent_reg.async_update_entity(motion.entity_id, area_id=area.id)
    hass.states.async_set(motion.entity_id, "off")

    # Register the real ambience.* built-in services (from the committed
    # services.yaml) so `actions.schemas` resolves to their real
    # {name, fields, target} shape. `async_load` above already seeds the
    # exposed actions with these ids (see DEFAULT_SEEDED_BUILTINS in store.py);
    # without the services actually being registered, get_service_schema()
    # can't find them and every schema comes back None.
    async_register_builtin_services(hass)

    return store


async def test_ai_context_shape_is_pinned(hass: HomeAssistant, seeded: AmbienceStore) -> None:
    assert_shape("ai_context", await build_ai_context(hass))


async def test_entities_find_shape_is_pinned(hass: HomeAssistant, seeded: AmbienceStore) -> None:
    assert_shape("entities_find", find_entities(entity_rows(hass)))
