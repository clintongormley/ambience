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


async def _save_house(client, msg_id, names, category="general"):
    """Save the house scene list. Each entry is a scene name (placed in
    `category`) or a (name, category) pair."""
    scenes = [(n, category) if isinstance(n, str) else n for n in names]
    await client.send_json(
        {
            "id": msg_id,
            "type": "ambience/house/save",
            "config": {"scenes": [{"name": n, "category": c} for n, c in scenes]},
            "change": {"action": "add", "scene_name": scenes[-1][0] if scenes else None},
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


async def test_scope_exists_unknown_kind_returns_false(hass, installed) -> None:
    """_scope_exists returns True for the known 'house' kind and False (safe default)
    for any unrecognised scope_kind — documenting the defensive fall-through contract."""
    from custom_components.ambience.scopes import scope_exists as _scope_exists

    assert _scope_exists(hass, "house", None) is True
    assert _scope_exists(hass, "nonsense", None) is False


async def _save_categories(client, msg_id, ids):
    await client.send_json(
        {
            "id": msg_id,
            "type": "ambience/categories/save",
            "categories": [{"id": cid, "name": cid.title()} for cid in ids],
        }
    )
    assert (await client.receive_json())["success"] is True


async def test_undo_coerces_scene_out_of_deleted_category(hass, hass_ws_client, installed):
    """A snapshot restored by undo may name a category deleted since; the scene
    must land in an existing category, not dangle."""
    client = await hass_ws_client()
    await _save_categories(client, 1, ["general", "a", "b"])
    await _save_house(client, 2, ["S"], category="b")
    await _save_house(client, 3, ["S"], category="a")
    await client.send_json({"id": 4, "type": "ambience/categories/delete", "category_id": "b"})
    assert (await client.receive_json())["success"] is True

    await client.send_json({"id": 5, "type": "ambience/history/undo"})
    res = (await client.receive_json())["result"]
    assert res["ok"] is True
    assert res["config"]["scenes"][0]["category"] == "general"
    store = hass.data[DOMAIN][DATA_STORE]
    assert store.get_house()["scenes"][0]["category"] == "general"
    # The store invariant holds: a later categories/save is not blocked by the
    # restored scene.
    await _save_categories(client, 6, ["general", "a"])


async def test_redo_coerces_scene_out_of_deleted_category(hass, hass_ws_client, installed):
    """The redo mirror: the forward snapshot's category may also be gone."""
    client = await hass_ws_client()
    await _save_categories(client, 1, ["general", "a", "b"])
    await _save_house(client, 2, ["S"], category="a")
    await _save_house(client, 3, ["S"], category="b")
    await client.send_json({"id": 4, "type": "ambience/history/undo"})
    assert (await client.receive_json())["result"]["ok"] is True
    await client.send_json({"id": 5, "type": "ambience/categories/delete", "category_id": "b"})
    assert (await client.receive_json())["success"] is True

    await client.send_json({"id": 6, "type": "ambience/history/redo"})
    res = (await client.receive_json())["result"]
    assert res["ok"] is True
    assert res["config"]["scenes"][0]["category"] == "general"
    store = hass.data[DOMAIN][DATA_STORE]
    assert store.get_house()["scenes"][0]["category"] == "general"
    await _save_categories(client, 7, ["general", "a"])


async def test_undo_coercion_leaves_priorities_strictly_decreasing(hass, hass_ws_client, installed):
    """Merging a deleted category's scenes into General must not leave the target
    bucket with tied/ascending priorities: coercion moved scenes between
    categories, so the restored config is re-canonicalised."""
    client = await hass_ws_client()
    await _save_categories(client, 1, ["general", "a", "b"])
    await _save_house(client, 2, ["G1", "G2", ("B1", "b"), ("B2", "b")])
    # Each category is independently canonical — both start at the same numbers.
    by_cat = _priorities_by_category(hass.data[DOMAIN][DATA_STORE].get_house()["scenes"])
    assert by_cat["general"] == by_cat["b"]
    # Empty out "b" so it can be deleted, then delete it.
    await _save_house(client, 3, ["G1", "G2", ("B1", "a"), ("B2", "a")])
    await client.send_json({"id": 4, "type": "ambience/categories/delete", "category_id": "b"})
    assert (await client.receive_json())["success"] is True

    await client.send_json({"id": 5, "type": "ambience/history/undo"})
    res = (await client.receive_json())["result"]
    assert res["ok"] is True
    scenes = hass.data[DOMAIN][DATA_STORE].get_house()["scenes"]
    # All four scenes landed in General…
    assert {s["name"] for s in scenes if s["category"] == "general"} == {"G1", "G2", "B1", "B2"}
    # …in a valid order: priorities strictly decreasing within each category.
    for cid, prios in _priorities_by_category(scenes).items():
        assert all(a > b for a, b in zip(prios, prios[1:], strict=False)), (cid, prios)


def _priorities_by_category(scenes):
    by_cat: dict[str, list[int]] = {}
    for scene in scenes:
        by_cat.setdefault(scene["category"], []).append(scene["priority"])
    return by_cat
