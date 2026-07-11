import pathlib
import re

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


async def test_list_traces_trims_an_oversized_list_and_announces_the_omission(monkeypatch):
    # ambience/traces/list has no default cap on the backend, so an unguarded MCP
    # tool could hand back the whole (possibly huge) buffer — the exact unbounded
    # result this module exists to prevent, reached through a different tool.
    monkeypatch.setenv("AMBIENCE_MCP_MAX_RESULT_CHARS", "2000")
    client = FakeClient(
        {
            "ambience/traces/list": {
                "traces": [{"unit": f"u{i}", "reason": "x" * 100} for i in range(50)]
            }
        }
    )

    result = await tools.list_traces(client)

    from ambience_mcp import budget

    assert budget.size_of(result) <= 2000
    assert result["omitted"] > 0
    assert result["notice"]


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


async def test_get_context_reads_ai_context_not_the_fat_bundle():
    client = FakeClient(
        {"ambience/ai_context": {"ambience_ai_context": 1, "catalog": {"entity_summary": {}}}}
    )

    result = await tools.get_context(client)

    assert client.calls == [{"type": "ambience/ai_context"}]
    assert result["ambience_ai_context"] == 1


async def test_get_context_on_an_old_backend_says_to_upgrade():
    client = FakeClient({"ambience/ai_context": HACommandError("unknown_command", "nope")})

    with pytest.raises(tools.ToolError, match="Upgrade Ambience"):
        await tools.get_context(client)


async def test_get_context_warns_when_the_backend_is_newer_than_us():
    client = FakeClient({"ambience/ai_context": {"ambience_ai_context": 99}})

    result = await tools.get_context(client)

    assert "warning" in result
    assert "ambience-mcp" in result["warning"]


async def test_get_context_does_not_warn_when_the_backend_format_matches():
    client = FakeClient({"ambience/ai_context": {"ambience_ai_context": 1}})

    result = await tools.get_context(client)

    assert "warning" not in result


async def test_get_context_does_not_warn_when_the_format_field_is_absent():
    client = FakeClient({"ambience/ai_context": {}})

    result = await tools.get_context(client)

    assert "warning" not in result


async def test_get_context_propagates_other_command_errors():
    # Mirrors test_get_guide_propagates_other_command_errors: only unknown_command
    # is converted to a ToolError; every other HACommandError must pass through
    # untouched rather than be swallowed or misreported.
    client = FakeClient({"ambience/ai_context": HACommandError("validation_error", "boom")})
    with pytest.raises(HACommandError):
        await tools.get_context(client)


async def test_get_context_sheds_schemas_that_bust_the_budget(monkeypatch):
    monkeypatch.setenv("AMBIENCE_MCP_MAX_RESULT_CHARS", "2000")
    client = FakeClient(
        {
            "ambience/ai_context": {
                "ambience_ai_context": 1,
                "actions": {
                    "exposed": [{"id": f"light.a{i}"} for i in range(10)],
                    "schemas": {f"light.a{i}": {"f": "x" * 500} for i in range(10)},
                },
            }
        }
    )

    result = await tools.get_context(client)

    from ambience_mcp import budget

    assert budget.size_of(result) <= 2000
    assert result["schemas_omitted"]


async def test_find_entities_forwards_only_the_given_filters():
    client = FakeClient({"ambience/entities/find": {"entities": [], "total_matches": 0}})

    await tools.find_entities(client, domain="light", area_id="kitchen")

    assert client.calls == [
        {"type": "ambience/entities/find", "domain": "light", "area_id": "kitchen"}
    ]


async def test_find_entities_omits_unset_filters_entirely():
    # Sending explicit nulls would make the backend's vol.Optional pointless.
    client = FakeClient({"ambience/entities/find": {"entities": []}})

    await tools.find_entities(client)

    assert client.calls == [{"type": "ambience/entities/find"}]


async def test_find_entities_forwards_paging():
    client = FakeClient({"ambience/entities/find": {"entities": []}})

    await tools.find_entities(client, query="lux", limit=10, cursor=20)

    assert client.calls == [
        {"type": "ambience/entities/find", "query": "lux", "limit": 10, "cursor": 20}
    ]


async def test_find_entities_forwards_a_zero_cursor():
    # A zero cursor is falsy but legitimately SET and must be forwarded.
    # If the filter check were "simplified" from `if value is not None` to
    # `if value`, cursor=0 would be silently dropped, breaking pagination.
    client = FakeClient({"ambience/entities/find": {"entities": []}})

    await tools.find_entities(client, cursor=0)

    assert client.calls == [{"type": "ambience/entities/find", "cursor": 0}]


async def test_find_entities_trims_an_oversized_page_and_repoints_the_cursor(monkeypatch):
    monkeypatch.setenv("AMBIENCE_MCP_MAX_RESULT_CHARS", "2000")
    client = FakeClient(
        {
            "ambience/entities/find": {
                "entities": [
                    {"entity_id": f"light.l{i:03d}", "name": "n" * 100} for i in range(50)
                ],
                "total_matches": 500,
                "offset": 0,
                "returned": 50,
                "cursor": 50,
                "truncated": True,
            }
        }
    )

    result = await tools.find_entities(client)

    from ambience_mcp import budget

    assert budget.size_of(result) <= 2000
    assert result["cursor"] == result["returned"]  # offset 0 + kept
    assert result["truncated"] is True


async def test_find_entities_on_an_old_backend_says_to_upgrade():
    # Mirrors test_get_context_on_an_old_backend_says_to_upgrade: find_entities is
    # just as load-bearing as get_context and must fail the same actionable way
    # against a pre-ai_context backend, not surface a raw unknown_command.
    client = FakeClient({"ambience/entities/find": HACommandError("unknown_command", "nope")})

    with pytest.raises(tools.ToolError, match="Upgrade Ambience"):
        await tools.find_entities(client)


async def test_find_entities_propagates_other_command_errors():
    client = FakeClient({"ambience/entities/find": HACommandError("validation_error", "boom")})

    with pytest.raises(HACommandError):
        await tools.find_entities(client)


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


# A guide whose "Import format" section contains a fenced YAML block with `#`
# comments — the shape that a naive line-based splitter would shred into bogus
# sections (the real guide is full of these).
GUIDE_TEXT = """<!-- generated -->

# Ambience — AI authoring & diagnosis guide

Intro paragraph.

# Config schema

Schema body.

# Import format

Envelope body.

```yaml
# --- Block 1 of 2: Living room ---
ambience_import: 1
```

Trailing envelope prose.

# Actions

Actions body.
"""

GUIDE_PAYLOAD = {
    "guide": GUIDE_TEXT,
    "ambience_version": "1.1.0",
    "ambience_ai_bundle": 1,
}


# How Ambience <= 1.1.0 assembles the guide: the wrapper title AND the source
# document's own H1, back to back. The wrapper's body is empty.
OLD_FORMAT_GUIDE = """# Ambience — AI authoring & diagnosis guide

Intro paragraph.

# Config schema

# Ambience configuration schema (overview)

Schema body.

# Condition cookbook

# Conditions cookbook

Cookbook body.
"""


def test_split_guide_sections_reads_the_older_double_heading_format():
    """The MCP server ships separately from the integration, so a NEW server WILL
    meet an OLD Ambience (MIN_AMBIENCE_VERSION is 1.1.0, which assembles the guide
    with two H1s per part). Splitting that naively yields an empty body for every
    section an AI is told to read — it would fetch the guide, get "", and author
    blind, which is the exact failure this whole feature exists to prevent.

    The wrapper's title is the canonical section name in BOTH formats, so an empty
    section absorbs the body that follows it.
    """
    sections = tools._split_guide_sections(OLD_FORMAT_GUIDE)
    assert list(sections) == ["Config schema", "Condition cookbook"]
    assert "Schema body." in sections["Config schema"]
    assert "Cookbook body." in sections["Condition cookbook"]
    # The inner heading is absorbed, not surfaced as a section of its own.
    assert "Ambience configuration schema (overview)" not in sections


def test_split_guide_sections_ignores_hash_comments_inside_code_fences():
    sections = tools._split_guide_sections(GUIDE_TEXT)
    # The document title is dropped; a `#` comment inside a ```yaml fence is not a
    # heading (a naive line split would shred "Import format" into fragments).
    assert list(sections) == ["Config schema", "Import format", "Actions"]
    body = sections["Import format"]
    assert "# --- Block 1 of 2: Living room ---" in body
    assert "Trailing envelope prose." in body


async def test_get_guide_fetches_the_whole_guide_once_then_reuses_it():
    """The guide is ~109KB and does not change until the user upgrades Ambience, so
    refetching it per section wastes real bandwidth (the server may be reached over
    the internet, not just a LAN). The version is held by the SERVER, not passed in
    as a tool argument — a model could claim to hold a guide it had never fetched
    and be told {unchanged: true} with no text, which is the trap this replaces."""
    cache = tools.GuideCache()
    client = FakeClient({"ambience/ai_guide": GUIDE_PAYLOAD})

    first = await tools.get_guide(client, cache, section="Config schema")
    assert "Schema body." in first["guide"]
    assert client.calls == [{"type": "ambience/ai_guide"}]  # nothing held yet

    # The install says "same version" and sends no text; the split is reused.
    client.results["ambience/ai_guide"] = {"unchanged": True, "ambience_version": "1.1.0"}
    second = await tools.get_guide(client, cache, section="Actions")
    assert "Actions body." in second["guide"]
    assert client.calls[-1] == {"type": "ambience/ai_guide", "have_version": "1.1.0"}


async def test_get_guide_refetches_when_the_install_was_upgraded():
    cache = tools.GuideCache()
    client = FakeClient({"ambience/ai_guide": GUIDE_PAYLOAD})
    await tools.get_guide(client, cache)

    upgraded = {
        **GUIDE_PAYLOAD,
        "ambience_version": "1.2.0",
        "guide": "# Title\n\nintro\n\n# Brand new\n\nfresh body",
    }
    client.results["ambience/ai_guide"] = upgraded
    result = await tools.get_guide(client, cache)

    assert result["ambience_version"] == "1.2.0"
    assert result["sections"] == ["Brand new"]
    assert cache.version == "1.2.0"


async def test_an_unsplittable_guide_is_never_cached():
    """Caching an empty split would POISON the cache for the life of the process:
    every later call would send have_version, be told {unchanged: true} with no
    text, and serve the empty map forever — with no error the model could see.
    Keep asking the install instead, so it can recover."""
    cache = tools.GuideCache()
    client = FakeClient({"ambience/ai_guide": {**GUIDE_PAYLOAD, "guide": ""}})

    first = await tools.get_guide(client, cache)
    assert first["sections"] == []
    assert cache.version is None  # nothing worth remembering

    # It must ask for the text again — not claim to hold a guide it never got.
    client.results["ambience/ai_guide"] = GUIDE_PAYLOAD
    second = await tools.get_guide(client, cache)
    assert second["sections"] == ["Config schema", "Import format", "Actions"]
    assert client.calls[-1] == {"type": "ambience/ai_guide"}


async def test_get_guide_without_section_returns_contents_not_the_full_text():
    """The document's own title is NOT a section: its body is the paste-flow
    preamble ("paste your downloaded AI bundle"), which is exactly the wrong
    advice over MCP — there is nothing to paste. Offering it would waste a TOC
    entry on a section no MCP reader should open."""
    client = FakeClient({"ambience/ai_guide": GUIDE_PAYLOAD})
    result = await tools.get_guide(client, tools.GuideCache())
    assert result["sections"] == ["Config schema", "Import format", "Actions"]
    assert "guide" not in result
    assert result["ambience_version"] == "1.1.0"


async def test_get_guide_will_not_serve_the_document_title_as_a_section():
    client = FakeClient({"ambience/ai_guide": GUIDE_PAYLOAD})
    result = await tools.get_guide(
        client, tools.GuideCache(), section="Ambience — AI authoring & diagnosis guide"
    )
    assert "error" in result
    assert "guide" not in result


async def test_get_guide_returns_only_the_requested_section():
    client = FakeClient({"ambience/ai_guide": GUIDE_PAYLOAD})
    result = await tools.get_guide(client, tools.GuideCache(), section="Config schema")
    assert result["section"] == "Config schema"
    assert "Schema body." in result["guide"]
    assert "Actions body." not in result["guide"]


def test_the_sections_named_in_the_usage_hint_really_exist_in_the_shipped_guide():
    """`_GUIDE_USAGE` names sections in prose, and an AI passes those names back to
    `ambience_get_guide(section=...)`. The titles are set by bin/gen_ai_docs.py in
    the *other* package, so nothing but this test stops a rename there from leaving
    the hint pointing at a section that no longer exists — which is exactly what a
    rename in this very branch would have done."""
    guide = pathlib.Path(__file__).parents[2] / (
        "custom_components/ambience/ai_guide/ambience-ai-guide.md"
    )
    if not guide.is_file():
        pytest.skip("shipped guide not present (standalone mcp-server checkout)")
    sections = tools._split_guide_sections(guide.read_text(encoding="utf-8"))
    for named in re.findall(r"'([^']+)'", _quoted(tools._GUIDE_USAGE)):
        assert named in sections, f"_GUIDE_USAGE names a section that does not exist: {named}"
    assert sections, "the shipped guide produced no sections"
    # An empty body means the split went wrong (an unbalanced fence swallowing the
    # rest of the file, a heading shape we don't handle) — an AI would be handed ""
    # and author blind, which is precisely what serving the guide is meant to stop.
    empty = [name for name, body in sections.items() if not body.strip()]
    assert not empty, f"sections split to an empty body: {empty}"


def _quoted(text: str) -> str:
    """Normalise the hint's double quotes to single so one regex finds them all."""
    return text.replace('"', "'")


async def test_get_guide_asks_for_the_text_whenever_it_holds_none():
    """A cold cache must never claim to hold a version — that was the old trap:
    a model passed a version read from the bundle and got {unchanged: true} with no
    guide at all."""
    client = FakeClient({"ambience/ai_guide": GUIDE_PAYLOAD})
    result = await tools.get_guide(client, tools.GuideCache(), section="Actions")
    assert client.calls == [{"type": "ambience/ai_guide"}]
    assert "Actions body." in result["guide"]


async def test_get_guide_rejects_an_unknown_section_and_lists_the_real_ones():
    client = FakeClient({"ambience/ai_guide": GUIDE_PAYLOAD})
    result = await tools.get_guide(client, tools.GuideCache(), section="Nonsense")
    assert "error" in result
    assert result["sections"] == ["Config schema", "Import format", "Actions"]
    assert result["usage"]  # a wrong guess still gets told how to call it properly
    assert "guide" not in result


async def test_get_guide_reports_unavailable_on_old_backend():
    client = FakeClient(
        {"ambience/ai_guide": HACommandError("unknown_command", "Unknown command.")}
    )
    result = await tools.get_guide(client, tools.GuideCache())
    assert result["unavailable"] is True
    assert "guide" not in result


async def test_get_guide_propagates_other_command_errors():
    client = FakeClient({"ambience/ai_guide": HACommandError("internal_error", "boom")})
    with pytest.raises(HACommandError):
        await tools.get_guide(client, tools.GuideCache())


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
