"""Scene saves are recorded in the undo history."""

from custom_components.ambience.const import DATA_HISTORY, DOMAIN


async def test_house_save_records_entry_with_descriptor(hass, hass_ws_client, installed) -> None:
    client = await hass_ws_client()
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/house/save",
            "config": {"scenes": [{"name": "Movie", "category": "general"}]},
            "change": {"action": "add", "scene_name": "Movie"},
        }
    )
    res = await client.receive_json()
    assert res["success"] is True

    snap = hass.data[DOMAIN][DATA_HISTORY].snapshot()
    assert snap["can_undo"] is True
    assert snap["undo"] == {
        "action": "add",
        "scene_name": "Movie",
        "scope_kind": "house",
        "scope_id": None,
    }


async def test_save_without_change_field_uses_generic_descriptor(hass, hass_ws_client, installed):
    client = await hass_ws_client()
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/house/save",
            "config": {"scenes": [{"name": "X", "category": "general"}]},
        }
    )
    assert (await client.receive_json())["success"] is True
    assert hass.data[DOMAIN][DATA_HISTORY].snapshot()["undo"]["action"] == "edit"


async def test_identical_save_records_nothing(hass, hass_ws_client, installed) -> None:
    client = await hass_ws_client()
    cfg = {"scenes": [{"name": "X", "category": "general"}]}
    for mid in (1, 2):
        await client.send_json(
            {
                "id": mid,
                "type": "ambience/house/save",
                "config": cfg,
                "change": {"action": "edit", "scene_name": "X"},
            }
        )
        assert (await client.receive_json())["success"] is True
    # The second save changed nothing, so only one entry is recorded.
    assert hass.data[DOMAIN][DATA_HISTORY].snapshot()["undo_count"] == 1


async def test_area_save_records_entry(hass, hass_ws_client, installed) -> None:
    import homeassistant.helpers.area_registry as ar

    area = ar.async_get(hass).async_create("Den")
    client = await hass_ws_client()
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/area/save",
            "area_id": area.id,
            "config": {"scenes": [{"name": "Reading", "category": "general"}]},
            "change": {"action": "add", "scene_name": "Reading"},
        }
    )
    assert (await client.receive_json())["success"] is True

    snap = hass.data[DOMAIN][DATA_HISTORY].snapshot()
    assert snap["can_undo"] is True
    assert snap["undo"] == {
        "action": "add",
        "scene_name": "Reading",
        "scope_kind": "area",
        "scope_id": area.id,
    }
