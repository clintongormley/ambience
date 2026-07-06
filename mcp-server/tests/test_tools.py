import pytest
from conftest import FakeClient

from ambience_mcp import tools
from ambience_mcp.ha_client import HACommandError
from ambience_mcp.ledger import PreviewLedger, fingerprint


async def test_get_scope_area_uses_area_get():
    client = FakeClient({"ambience/area/get": {"scenes": [{"name": "X"}]}})
    result = await tools.get_scope(client, {"kind": "area", "id": "living_room"})
    assert result == {"scenes": [{"name": "X"}]}
    assert client.calls == [{"type": "ambience/area/get", "area_id": "living_room"}]


async def test_get_scope_house_uses_house_get_without_id():
    client = FakeClient({"ambience/house/get": {"scenes": []}})
    await tools.get_scope(client, {"kind": "house"})
    assert client.calls == [{"type": "ambience/house/get"}]


async def test_get_scope_rejects_area_without_id():
    with pytest.raises(tools.ToolError, match="id"):
        await tools.get_scope(FakeClient(), {"kind": "area"})


async def test_get_scope_rejects_bad_kind():
    with pytest.raises(tools.ToolError, match="kind"):
        await tools.get_scope(FakeClient(), {"kind": "planet", "id": "mars"})


async def test_dry_run_uses_scope_selector():
    client = FakeClient({"ambience/dry_run": {"winner": None}})
    await tools.dry_run(client, {"kind": "floor", "id": "ground"})
    assert client.calls == [{"type": "ambience/dry_run", "floor_id": "ground"}]


async def test_validate_wraps_scenes_in_config():
    client = FakeClient({"ambience/validate": {"ok": True}})
    await tools.validate(client, [{"name": "X", "category": "c"}])
    assert client.calls == [
        {"type": "ambience/validate", "config": {"scenes": [{"name": "X", "category": "c"}]}}
    ]


async def test_preview_write_returns_diff_valid_and_token():
    scenes = [{"name": "Movie", "category": "lighting"}]
    client = FakeClient(
        {
            "ambience/area/get": {"scenes": []},
            "ambience/validate": {"ok": True},
        }
    )
    ledger = PreviewLedger()
    result = await tools.preview_write(client, {"kind": "area", "id": "lr"}, scenes, ledger)
    assert result["valid"] is True
    assert result["errors"] is None
    assert result["diff"]["added"] == scenes
    assert result["confirm_token"] == fingerprint({"kind": "area", "id": "lr"}, scenes)


async def test_preview_write_reports_validation_error():
    client = FakeClient(
        {
            "ambience/area/get": {"scenes": []},
            "ambience/validate": HACommandError("validation_error", "bad predicate"),
        }
    )
    result = await tools.preview_write(
        client, {"kind": "area", "id": "lr"}, [{"category": "c"}], PreviewLedger()
    )
    assert result["valid"] is False
    assert result["errors"] == "bad predicate"


async def test_apply_write_requires_matching_token_from_preview():
    scenes = [{"name": "Movie", "category": "lighting"}]
    scope = {"kind": "area", "id": "lr"}
    ledger = PreviewLedger()
    client = FakeClient({"ambience/area/save": {"ok": True, "config": {"scenes": scenes}}})
    ledger.record(fingerprint(scope, scenes))
    token = fingerprint(scope, scenes)
    result = await tools.apply_write(client, scope, scenes, token, ledger)
    assert result == {"ok": True, "config": {"scenes": scenes}}
    assert client.calls == [
        {
            "type": "ambience/area/save",
            "area_id": "lr",
            "config": {"scenes": scenes},
            "change": {"action": "import", "scene_name": None},
            "minimise_pins": True,
        }
    ]


async def test_apply_write_rejects_without_preview():
    scenes = [{"name": "Movie", "category": "lighting"}]
    scope = {"kind": "area", "id": "lr"}
    with pytest.raises(tools.ToolError, match="preview_write"):
        await tools.apply_write(
            client=FakeClient(),
            scope=scope,
            scenes=scenes,
            confirm_token=fingerprint(scope, scenes),
            ledger=PreviewLedger(),
        )


async def test_apply_write_rejects_token_for_different_payload():
    scope = {"kind": "area", "id": "lr"}
    ledger = PreviewLedger()
    ledger.record(fingerprint(scope, [{"name": "Old"}]))
    with pytest.raises(tools.ToolError, match="preview_write"):
        await tools.apply_write(
            FakeClient(), scope, [{"name": "New"}], fingerprint(scope, [{"name": "Old"}]), ledger
        )


async def test_list_traces_passes_limit():
    client = FakeClient({"ambience/traces/list": {"traces": []}})
    await tools.list_traces(client, limit=5)
    assert client.calls == [{"type": "ambience/traces/list", "limit": 5}]
