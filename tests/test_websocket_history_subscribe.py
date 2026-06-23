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


async def _next_event(client):
    """Drain results/acks until the next pushed event arrives."""
    for _ in range(4):
        m = await client.receive_json()
        if m.get("type") == "event":
            return m["event"]
    raise AssertionError("no event received")


async def test_push_marks_is_self_for_the_saving_connection_only(hass, hass_ws_client, installed):
    saver = await hass_ws_client()
    observer = await hass_ws_client()
    await saver.send_json({"id": 1, "type": "ambience/history/subscribe"})
    assert (await saver.receive_json())["success"] is True
    assert (await _next_event(saver))["op"] is None  # initial snapshot
    await observer.send_json({"id": 1, "type": "ambience/history/subscribe"})
    assert (await observer.receive_json())["success"] is True
    assert (await _next_event(observer))["op"] is None  # initial snapshot

    # The saver makes a change; both subscribers get the push.
    await saver.send_json(
        {
            "id": 2,
            "type": "ambience/house/save",
            "config": {"scenes": [{"name": "Movie", "category": "general"}]},
            "change": {"action": "add", "scene_name": "Movie"},
        }
    )

    saver_push = await _next_event(saver)
    observer_push = await _next_event(observer)
    assert saver_push["op"] == "record"
    assert saver_push["is_self"] is True  # the saver originated this change
    assert observer_push["op"] == "record"
    assert observer_push["is_self"] is False  # a different tab's change


async def test_initial_snapshot_is_not_self(hass, hass_ws_client, installed):
    client = await hass_ws_client()
    await client.send_json({"id": 1, "type": "ambience/history/subscribe"})
    assert (await client.receive_json())["success"] is True
    snap = await _next_event(client)
    assert snap["is_self"] is False
