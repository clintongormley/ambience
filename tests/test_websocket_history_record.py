"""Scene saves are recorded in the undo history."""

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_HISTORY, DOMAIN


@pytest.fixture
async def installed(hass, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


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
