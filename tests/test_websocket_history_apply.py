"""ambience/history/undo and /redo websocket commands."""

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_HISTORY, DATA_STORE, DOMAIN


@pytest.fixture
async def installed(hass, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def _save_house(client, msg_id, names):
    await client.send_json(
        {
            "id": msg_id,
            "type": "ambience/house/save",
            "config": {"scenes": [{"name": n, "category": "general"} for n in names]},
            "change": {"action": "add", "scene_name": names[-1] if names else None},
        }
    )
    assert (await client.receive_json())["success"] is True


async def test_undo_restores_previous_config(hass, hass_ws_client, installed):
    client = await hass_ws_client()
    await _save_house(client, 1, ["A"])
    await _save_house(client, 2, ["A", "B"])

    await client.send_json({"id": 3, "type": "ambience/history/undo"})
    res = (await client.receive_json())["result"]
    assert res["ok"] is True
    assert res["scope_kind"] == "house"
    assert [s["name"] for s in res["config"]["scenes"]] == ["A"]
    # Store actually rolled back.
    assert [s["name"] for s in hass.data[DOMAIN][DATA_STORE].get_house()["scenes"]] == ["A"]


async def test_undo_then_redo(hass, hass_ws_client, installed):
    client = await hass_ws_client()
    await _save_house(client, 1, ["A"])
    await _save_house(client, 2, ["A", "B"])
    await client.send_json({"id": 3, "type": "ambience/history/undo"})
    await client.receive_json()
    await client.send_json({"id": 4, "type": "ambience/history/redo"})
    res = (await client.receive_json())["result"]
    assert [s["name"] for s in res["config"]["scenes"]] == ["A", "B"]


async def test_undo_area_change(hass, hass_ws_client, installed):
    import homeassistant.helpers.area_registry as ar

    area = ar.async_get(hass).async_create("Den")
    client = await hass_ws_client()
    for mid, names in ((1, ["A"]), (2, ["A", "B"])):
        await client.send_json(
            {
                "id": mid,
                "type": "ambience/area/save",
                "area_id": area.id,
                "config": {"scenes": [{"name": n, "category": "general"} for n in names]},
                "change": {"action": "add", "scene_name": names[-1]},
            }
        )
        assert (await client.receive_json())["success"] is True
    await client.send_json({"id": 3, "type": "ambience/history/undo"})
    res = (await client.receive_json())["result"]
    assert res["scope_kind"] == "area"
    assert [s["name"] for s in res["config"]["scenes"]] == ["A"]


async def test_undo_floor_change_and_empty_redo(hass, hass_ws_client, installed):
    import homeassistant.helpers.floor_registry as fr

    floor = fr.async_get(hass).async_create("Loft")
    client = await hass_ws_client()
    for mid, names in ((1, ["A"]), (2, ["A", "B"])):
        await client.send_json(
            {
                "id": mid,
                "type": "ambience/floor/save",
                "floor_id": floor.floor_id,
                "config": {"scenes": [{"name": n, "category": "general"} for n in names]},
                "change": {"action": "add", "scene_name": names[-1]},
            }
        )
        assert (await client.receive_json())["success"] is True
    # Nothing has been undone yet → redo is a no-op.
    await client.send_json({"id": 3, "type": "ambience/history/redo"})
    assert (await client.receive_json())["result"] == {"ok": False}
    await client.send_json({"id": 4, "type": "ambience/history/undo"})
    res = (await client.receive_json())["result"]
    assert res["scope_kind"] == "floor"
    assert [s["name"] for s in res["config"]["scenes"]] == ["A"]


async def test_undo_does_not_self_record(hass, hass_ws_client, installed):
    client = await hass_ws_client()
    await _save_house(client, 1, ["A"])
    await _save_house(client, 2, ["A", "B"])
    history = hass.data[DOMAIN][DATA_HISTORY]
    assert history.snapshot()["undo_count"] == 2
    await client.send_json({"id": 3, "type": "ambience/history/undo"})
    await client.receive_json()
    snap = history.snapshot()
    assert snap["undo_count"] == 1  # not 3 — the undo did not create a new entry
    assert snap["redo_count"] == 1


async def test_undo_empty_is_noop(hass, hass_ws_client, installed):
    client = await hass_ws_client()
    await client.send_json({"id": 1, "type": "ambience/history/undo"})
    res = (await client.receive_json())["result"]
    assert res == {"ok": False}


async def test_undo_skips_deleted_scope(hass, hass_ws_client, installed):
    import homeassistant.helpers.area_registry as ar

    area_reg = ar.async_get(hass)
    area = area_reg.async_create("Temp")
    client = await hass_ws_client()
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/area/save",
            "area_id": area.id,
            "config": {"scenes": [{"name": "A", "category": "general"}]},
            "change": {"action": "add", "scene_name": "A"},
        }
    )
    assert (await client.receive_json())["success"] is True
    area_reg.async_delete(area.id)
    await hass.async_block_till_done()

    await client.send_json({"id": 2, "type": "ambience/history/undo"})
    res = (await client.receive_json())["result"]
    assert res == {"ok": False}  # the only entry's scope is gone → dropped
    assert hass.data[DOMAIN][DATA_HISTORY].snapshot()["can_undo"] is False


async def test_redo_skips_deleted_scope(hass, hass_ws_client, installed) -> None:
    import homeassistant.helpers.area_registry as ar

    area_reg = ar.async_get(hass)
    area = area_reg.async_create("Temp2")
    client = await hass_ws_client()
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/area/save",
            "area_id": area.id,
            "config": {"scenes": [{"name": "A", "category": "general"}]},
            "change": {"action": "add", "scene_name": "A"},
        }
    )
    assert (await client.receive_json())["success"] is True
    # Undo it (moves the entry to the redo stack), then delete the area.
    await client.send_json({"id": 2, "type": "ambience/history/undo"})
    assert (await client.receive_json())["result"]["ok"] is True
    area_reg.async_delete(area.id)
    await hass.async_block_till_done()

    await client.send_json({"id": 3, "type": "ambience/history/redo"})
    res = (await client.receive_json())["result"]
    assert res == {"ok": False}  # the redo entry's scope is gone → dropped
    assert hass.data[DOMAIN][DATA_HISTORY].snapshot()["can_redo"] is False
