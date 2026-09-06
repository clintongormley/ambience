"""ambience/live/subscribe websocket command."""

from custom_components.ambience.service import set_last_matched


async def test_live_subscribe_snapshot_then_delta(hass, hass_ws_client, installed) -> None:
    from custom_components.ambience.service import set_last_applied_scene

    set_last_matched(hass, "area", "a", "g", 0)
    set_last_applied_scene(hass, "area", "a", "g", 0)

    client = await hass_ws_client()
    await client.send_json({"id": 7, "type": "ambience/live/subscribe"})

    ack = await client.receive_json()
    assert ack["success"] is True

    snap = await client.receive_json()
    assert snap["event"]["type"] == "snapshot"
    assert {
        "scope_kind": "area",
        "scope_id": "a",
        "category": "g",
        "matched": 0,
        "applied": 0,
    } in snap["event"]["units"]

    # A change pushes a delta.
    set_last_matched(hass, "area", "a", "g", None)
    delta = await client.receive_json()
    assert delta["event"]["type"] == "update"
    assert delta["event"]["scope_kind"] == "area"
    assert delta["event"]["category"] == "g"
    assert delta["event"]["matched"] is None
    assert delta["event"]["applied"] == 0
