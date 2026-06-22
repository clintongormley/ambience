"""ambience/history/subscribe websocket command."""

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry


@pytest.fixture
async def installed(hass, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def test_subscribe_sends_snapshot_then_pushes_on_change(hass, hass_ws_client, installed):
    client = await hass_ws_client()
    await client.send_json({"id": 5, "type": "ambience/history/subscribe"})

    ack = await client.receive_json()
    assert ack["success"] is True

    snap = await client.receive_json()
    assert snap["event"]["op"] is None
    assert snap["event"]["can_undo"] is False

    # A save pushes an updated snapshot.
    await client.send_json(
        {
            "id": 6,
            "type": "ambience/house/save",
            "config": {"scenes": [{"name": "Movie", "category": "general"}]},
            "change": {"action": "add", "scene_name": "Movie"},
        }
    )
    # The save's own result and the pushed event arrive; collect until we see the push.
    push = None
    for _ in range(3):
        m = await client.receive_json()
        if m.get("type") == "event":
            push = m["event"]
            break
    assert push is not None
    assert push["op"] == "record"
    assert push["can_undo"] is True
    assert push["undo"]["scene_name"] == "Movie"
    assert push["changed_scope"] == {"scope_kind": "house", "scope_id": None}
