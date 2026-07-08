import pytest
from conftest import FakeClient

from ambience_mcp import tools
from ambience_mcp.ha_client import HACommandError
from ambience_mcp.ledger import PreviewLedger, fingerprint


async def test_get_scope_area_uses_area_get():
    client = FakeClient({"ambience/area/get": {"scenes": [{"name": "X"}]}})
    result = await tools.get_scope(client, {"kind": "area", "id": "living_room"})
    assert result == {"scenes": [{"name": "X", "rank": 1}]}
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


async def test_validate_strips_rank():
    # `rank` is a read-only annotation; validating read-back scenes must not leak it.
    client = FakeClient({"ambience/validate": {"ok": True}})
    await tools.validate(client, [{"name": "X", "category": "c", "rank": 1}])
    call = next(c for c in client.calls if c["type"] == "ambience/validate")
    assert call["config"] == {"scenes": [{"name": "X", "category": "c"}]}


async def test_preview_write_returns_diff_valid_and_token():
    scenes = [{"name": "Movie", "category": "lighting"}]
    client = FakeClient(
        {
            "ambience/area/get": {"scenes": []},
            "ambience/validate": {"ok": True},
            "ambience/categories/list": {"categories": [{"id": "lighting"}]},
        }
    )
    ledger = PreviewLedger()
    result = await tools.preview_write(client, {"kind": "area", "id": "lr"}, scenes, ledger)
    assert result["valid"] is True
    assert result["errors"] is None
    assert result["unknown_categories"] == []
    assert result["diff"]["added"] == scenes
    assert result["confirm_token"] == fingerprint({"kind": "area", "id": "lr"}, scenes)


async def test_preview_write_survives_unreadable_current_scenes():
    # `current` is read from the same ambience/{kind}/get command the read-path guard
    # covers. A too-new backend returning an unrecognised scene shape must not crash
    # diff_scopes — fall back to an empty baseline (proposed shown as added) rather
    # than raise. The write's validity is still decided by validate + categories.
    scope = {"kind": "area", "id": "lr"}
    scenes = [{"name": "Movie", "category": "lighting"}]
    client = FakeClient(
        {
            "ambience/area/get": {"scenes": ["sceneref-1", "sceneref-2"]},  # unreadable shape
            "ambience/validate": {"ok": True},
            "ambience/categories/list": {"categories": [{"id": "lighting"}]},
        }
    )
    result = await tools.preview_write(client, scope, scenes, PreviewLedger())
    assert result["valid"] is True
    assert result["diff"]["added"] == scenes
    assert result["diff"]["removed"] == []
    assert result["diff"]["updated"] == []


async def test_preview_write_survives_non_list_current_scenes():
    # A reshaped backend could send `{"scenes": null}` (or any non-list) — `.get`'s
    # default only fires on an absent key, so `current` becomes None. The guard must
    # check the container type too, or it crashes on `for scene in None`.
    scope = {"kind": "area", "id": "lr"}
    scenes = [{"name": "Movie", "category": "lighting"}]
    client = FakeClient(
        {
            "ambience/area/get": {"scenes": None},  # non-list shape
            "ambience/validate": {"ok": True},
            "ambience/categories/list": {"categories": [{"id": "lighting"}]},
        }
    )
    result = await tools.preview_write(client, scope, scenes, PreviewLedger())
    assert result["valid"] is True
    assert result["diff"]["added"] == scenes


async def test_preview_write_blocks_a_scene_with_an_unknown_category():
    # The backend would silently move it to General, so preview must block until
    # the category exists (create it with save_categories first).
    scope = {"kind": "area", "id": "lr"}
    scenes = [{"name": "Movie", "category": "typo_lighting"}]
    client = FakeClient(
        {
            "ambience/area/get": {"scenes": []},
            "ambience/validate": {"ok": True},
            "ambience/categories/list": {"categories": [{"id": "lighting"}]},
        }
    )
    ledger = PreviewLedger()
    result = await tools.preview_write(client, scope, scenes, ledger)
    assert result["unknown_categories"] == ["typo_lighting"]
    assert result["valid"] is False
    # No usable token was recorded → apply is gated out.
    with pytest.raises(tools.ToolError, match="preview_write"):
        await tools.apply_write(client, scope, scenes, result["confirm_token"], ledger)


async def test_preview_write_accepts_declared_new_categories():
    scope = {"kind": "area", "id": "lr"}
    scenes = [{"name": "Film", "category": "movie_night"}]
    new_cats = [{"id": "movie_night", "name": "Movie Night"}]
    client = FakeClient(
        {
            "ambience/area/get": {"scenes": []},
            "ambience/validate": {"ok": True},
            "ambience/categories/list": {"categories": [{"id": "lighting"}]},
        }
    )
    ledger = PreviewLedger()
    result = await tools.preview_write(client, scope, scenes, ledger, new_cats)
    assert result["valid"] is True
    assert result["unknown_categories"] == []
    assert result["creating_categories"] == new_cats
    assert result["confirm_token"] == fingerprint(scope, scenes, new_cats)
    assert ledger.consume(result["confirm_token"]) is True  # a usable, applyable token


async def test_apply_write_creates_declared_categories_before_saving():
    scope = {"kind": "area", "id": "lr"}
    scenes = [{"name": "Film", "category": "movie_night"}]
    new_cats = [{"id": "movie_night", "name": "Movie Night"}]
    ledger = PreviewLedger()
    token = fingerprint(scope, scenes, new_cats)
    ledger.record(token)
    client = FakeClient(
        {
            "ambience/frontend_version": {"version": "1.1.0"},
            "ambience/categories/list": {"categories": [{"id": "lighting", "name": "Lighting"}]},
            "ambience/categories/save": {"ok": True},
            "ambience/area/save": {"ok": True, "config": {"scenes": scenes}},
        }
    )
    await tools.apply_write(client, scope, scenes, token, ledger, new_cats)
    types = [c["type"] for c in client.calls]
    # categories are created (existing preserved + new appended) before the scope save
    assert types.index("ambience/categories/save") < types.index("ambience/area/save")
    save_cats = next(c for c in client.calls if c["type"] == "ambience/categories/save")
    assert [c["id"] for c in save_cats["categories"]] == ["lighting", "movie_night"]


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
    client = FakeClient(
        {
            "ambience/frontend_version": {"version": "1.1.0"},
            "ambience/area/save": {"ok": True, "config": {"scenes": scenes}},
        }
    )
    ledger.record(fingerprint(scope, scenes))
    token = fingerprint(scope, scenes)
    result = await tools.apply_write(client, scope, scenes, token, ledger)
    assert result == {"ok": True, "config": {"scenes": scenes}}
    save_call = next(c for c in client.calls if c["type"] == "ambience/area/save")
    assert save_call == {
        "type": "ambience/area/save",
        "area_id": "lr",
        "config": {"scenes": scenes},
        "change": {"action": "import", "scene_name": None},
        "minimise_pins": True,
    }


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


async def test_invalid_preview_does_not_record_a_usable_token():
    scope = {"kind": "area", "id": "lr"}
    scenes = [{"category": "c"}]
    client = FakeClient(
        {
            "ambience/area/get": {"scenes": []},
            "ambience/validate": HACommandError("validation_error", "bad predicate"),
        }
    )
    ledger = PreviewLedger()
    result = await tools.preview_write(client, scope, scenes, ledger)
    assert result["valid"] is False
    # Token was returned for reference but never recorded, so apply is gated out.
    with pytest.raises(tools.ToolError, match="preview_write"):
        await tools.apply_write(client, scope, scenes, result["confirm_token"], ledger)


async def test_list_traces_passes_limit():
    client = FakeClient({"ambience/traces/list": {"traces": []}})
    await tools.list_traces(client, limit=5)
    assert client.calls == [{"type": "ambience/traces/list", "limit": 5}]


async def test_dry_run_house_uses_house_selector():
    client = FakeClient({"ambience/dry_run": {"winner": None}})
    await tools.dry_run(client, {"kind": "house"})
    assert client.calls == [{"type": "ambience/dry_run", "house": True}]


async def test_get_scope_ranks_scenes_per_category_in_order():
    client = FakeClient(
        {
            "ambience/area/get": {
                "scenes": [
                    {"name": "A", "category": "lighting"},
                    {"name": "B", "category": "lighting"},
                    {"name": "C", "category": "blinds"},
                    {"name": "D", "category": "lighting"},
                ]
            }
        }
    )
    result = await tools.get_scope(client, {"kind": "area", "id": "lr"})
    # rank counts within each category, in list (evaluation) order
    assert [(s["name"], s["rank"]) for s in result["scenes"]] == [
        ("A", 1),
        ("B", 2),
        ("C", 1),
        ("D", 3),
    ]


async def test_get_scope_keeps_priority_and_pinned_alongside_rank():
    client = FakeClient(
        {
            "ambience/house/get": {
                "scenes": [{"name": "X", "category": "c", "priority": 7168, "pinned": True}]
            }
        }
    )
    scene = (await tools.get_scope(client, {"kind": "house"}))["scenes"][0]
    assert scene["rank"] == 1
    assert scene["priority"] == 7168
    assert scene["pinned"] is True


async def test_get_context_ranks_scenes_in_every_bundle_scope():
    bundle = {
        "catalog": {"areas": []},
        "config": {
            "areas": {
                "lr": {"scenes": [{"name": "A", "category": "c"}, {"name": "B", "category": "c"}]}
            },
            "floors": {"g": {"scenes": [{"name": "F", "category": "c"}]}},
            "house": {"scenes": [{"name": "H", "category": "c"}]},
        },
    }
    client = FakeClient({"ambience/ai_bundle": bundle})
    result = await tools.get_context(client)
    assert [s["rank"] for s in result["config"]["areas"]["lr"]["scenes"]] == [1, 2]
    assert result["config"]["floors"]["g"]["scenes"][0]["rank"] == 1
    assert result["config"]["house"]["scenes"][0]["rank"] == 1


async def test_get_scope_leaves_non_dict_scenes_untouched():
    # Ranking is a convenience, not load-bearing. If a future bundle changed a
    # scenes element's shape, ranking must skip and return the list untouched
    # rather than raise — the server's only structural read of the bundle.
    client = FakeClient({"ambience/area/get": {"scenes": ["sceneref-1", "sceneref-2"]}})
    result = await tools.get_scope(client, {"kind": "area", "id": "lr"})
    assert result["scenes"] == ["sceneref-1", "sceneref-2"]


async def test_get_scope_skips_ranking_for_whole_list_when_any_scene_non_dict():
    # All-or-nothing: a single non-dict element (an unrecognised shape) disables
    # ranking for the entire list, so even the well-formed dict scenes come back
    # untouched — no partial annotation.
    scenes = [{"name": "A", "category": "c"}, "sceneref"]
    client = FakeClient({"ambience/area/get": {"scenes": scenes}})
    result = await tools.get_scope(client, {"kind": "area", "id": "lr"})
    assert result["scenes"] == scenes
    assert "rank" not in result["scenes"][0]


async def test_get_context_still_warns_when_scene_shape_unrecognised():
    # The fail-open promise must hold end to end: a too-new bundle whose scenes no
    # longer match the expected shape must still reach the format warning, not crash
    # in the rank annotation before the warning is ever attached.
    newer = tools.SUPPORTED_AI_BUNDLE + 1
    bundle = {"ambience_ai_bundle": newer, "config": {"house": {"scenes": ["sceneref-1"]}}}
    client = FakeClient({"ambience/ai_bundle": bundle})
    result = await tools.get_context(client)
    assert "warning" in result
    assert str(newer) in result["warning"]  # pins the format branch, not the version branch
    assert result["config"]["house"]["scenes"] == ["sceneref-1"]


async def test_preview_write_strips_rank_before_backend():
    scenes = [{"name": "A", "category": "c", "rank": 1}]
    client = FakeClient({"ambience/area/get": {"scenes": []}, "ambience/validate": {"ok": True}})
    await tools.preview_write(client, {"kind": "area", "id": "lr"}, scenes, PreviewLedger())
    validate_call = next(c for c in client.calls if c["type"] == "ambience/validate")
    assert validate_call["config"] == {"scenes": [{"name": "A", "category": "c"}]}


async def test_apply_write_strips_rank_before_save():
    scope = {"kind": "area", "id": "lr"}
    stripped = [{"name": "A", "category": "c"}]
    scenes = [{"name": "A", "category": "c", "rank": 5}]
    ledger = PreviewLedger()
    token = fingerprint(scope, stripped)  # the gate fingerprints the rank-free payload
    ledger.record(token)
    client = FakeClient({"ambience/area/save": {"ok": True, "config": {"scenes": stripped}}})
    await tools.apply_write(client, scope, scenes, token, ledger)
    save_call = next(c for c in client.calls if c["type"] == "ambience/area/save")
    assert save_call["config"] == {"scenes": stripped}


async def test_get_guide_forwards_have_version_and_returns_payload():
    payload = {"guide": "# Guide", "ambience_version": "1.1.0", "ambience_ai_bundle": 1}
    client = FakeClient({"ambience/ai_guide": payload})
    result = await tools.get_guide(client, have_version="1.0.0")
    assert result == payload
    assert client.calls == [{"type": "ambience/ai_guide", "have_version": "1.0.0"}]


async def test_get_guide_omits_have_version_when_absent():
    client = FakeClient(
        {
            "ambience/ai_guide": {
                "guide": "# G",
                "ambience_version": "1.1.0",
                "ambience_ai_bundle": 1,
            }
        }
    )
    await tools.get_guide(client)
    assert client.calls == [{"type": "ambience/ai_guide"}]


async def test_get_guide_reports_unavailable_on_old_backend():
    client = FakeClient(
        {"ambience/ai_guide": HACommandError("unknown_command", "Unknown command.")}
    )
    result = await tools.get_guide(client)
    assert result["unavailable"] is True
    assert "guide" not in result


async def test_get_guide_propagates_other_command_errors():
    client = FakeClient({"ambience/ai_guide": HACommandError("internal_error", "boom")})
    with pytest.raises(HACommandError):
        await tools.get_guide(client)


def test_parse_version_reads_major_minor_patch():
    assert tools._parse_version("1.1.0") == (1, 1, 0)


def test_parse_version_tolerates_prerelease_and_build_suffix():
    assert tools._parse_version("1.2.0-rc.1") == (1, 2, 0)
    assert tools._parse_version("2.0.0+build5") == (2, 0, 0)


def test_parse_version_returns_none_for_unrecognisable():
    assert tools._parse_version(None) is None
    assert tools._parse_version("") is None
    assert tools._parse_version("garbage") is None


def test_parse_version_pads_short_versions_so_they_dont_sort_low():
    # Bare tuple compare would make (1, 1) < (1, 1, 0); padding keeps 1.1 == 1.1.0.
    assert tools._parse_version("1.1") == (1, 1, 0)
    assert tools._parse_version("2") == (2, 0, 0)
    assert tools._parse_version("1.1") >= tools.MIN_AMBIENCE_VERSION


def test_parse_version_rejects_unicode_digits():
    # "²".isdigit() is True but int("²") raises; isdecimal() must reject it → None.
    assert tools._parse_version("1.².0") is None


def test_min_ambience_version_is_the_release_with_minimise_pins():
    # The floor below which apply_write is refused; comparable as a tuple.
    assert tools.MIN_AMBIENCE_VERSION == (1, 1, 0)
    assert tools._parse_version("1.0.0") < tools.MIN_AMBIENCE_VERSION
    assert tools._parse_version("1.1.0") >= tools.MIN_AMBIENCE_VERSION


def _apply_ready(version_result):
    """A FakeClient primed to apply, with a scripted frontend_version probe."""
    scenes = [{"name": "Movie", "category": "lighting"}]
    scope = {"kind": "area", "id": "lr"}
    ledger = PreviewLedger()
    token = fingerprint(scope, scenes)
    ledger.record(token)
    client = FakeClient(
        {
            "ambience/frontend_version": version_result,
            "ambience/area/save": {"ok": True, "config": {"scenes": scenes}},
        }
    )
    return client, scope, scenes, token, ledger


async def test_apply_write_refused_against_old_backend():
    client, scope, scenes, token, ledger = _apply_ready({"version": "1.0.0"})
    with pytest.raises(tools.ToolError, match="1.1.0"):
        await tools.apply_write(client, scope, scenes, token, ledger)
    # Refused before ever saving.
    assert not any(c["type"] == "ambience/area/save" for c in client.calls)


async def test_apply_write_proceeds_against_current_backend():
    client, scope, scenes, token, ledger = _apply_ready({"version": "1.1.0"})
    result = await tools.apply_write(client, scope, scenes, token, ledger)
    assert result == {"ok": True, "config": {"scenes": scenes}}


async def test_apply_write_fails_open_when_version_blank():
    # Indeterminate version (teardown race) -> proceed, don't block on a hiccup.
    client, scope, scenes, token, ledger = _apply_ready({"version": ""})
    result = await tools.apply_write(client, scope, scenes, token, ledger)
    assert result["ok"] is True


async def test_apply_write_fails_open_when_probe_unsupported():
    client, scope, scenes, token, ledger = _apply_ready(
        HACommandError("unknown_command", "Unknown command.")
    )
    result = await tools.apply_write(client, scope, scenes, token, ledger)
    assert result["ok"] is True


async def test_get_context_warns_when_backend_bundle_format_is_newer():
    newer = tools.SUPPORTED_AI_BUNDLE + 1
    client = FakeClient({"ambience/ai_bundle": {"ambience_ai_bundle": newer}})
    result = await tools.get_context(client)
    assert "warning" in result
    assert str(newer) in result["warning"]


async def test_get_context_no_warning_when_backend_bundle_format_supported():
    client = FakeClient({"ambience/ai_bundle": {"ambience_ai_bundle": tools.SUPPORTED_AI_BUNDLE}})
    result = await tools.get_context(client)
    assert "warning" not in result


async def test_get_context_no_warning_when_bundle_format_absent():
    client = FakeClient({"ambience/ai_bundle": {"config": {}}})
    result = await tools.get_context(client)
    assert "warning" not in result


async def test_get_context_warns_when_backend_older_than_min():
    client = FakeClient({"ambience/ai_bundle": {"ambience_version": "1.0.0"}})
    result = await tools.get_context(client)
    assert "warning" in result
    assert "1.0.0" in result["warning"]


async def test_get_context_no_warning_when_backend_at_min():
    client = FakeClient({"ambience/ai_bundle": {"ambience_version": "1.1.0"}})
    result = await tools.get_context(client)
    assert "warning" not in result
