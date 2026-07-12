from ambience_mcp.diff import diff_scopes, summarise_diff


def test_added_scene():
    d = diff_scopes([], [{"name": "Movie", "category": "lighting"}])
    assert d["added"] == [{"name": "Movie", "category": "lighting"}]
    assert d["removed"] == []
    assert d["updated"] == []


def test_removed_scene():
    d = diff_scopes([{"name": "Movie", "category": "lighting"}], [])
    assert d["removed"] == [{"name": "Movie", "category": "lighting"}]
    assert d["added"] == []


def test_updated_scene_matched_by_name_and_category():
    current = [{"name": "Evening", "category": "lighting", "when": {"lux": {"max": 40}}}]
    proposed = [{"name": "Evening", "category": "lighting", "when": {"lux": {"max": 60}}}]
    d = diff_scopes(current, proposed)
    assert d["added"] == []
    assert d["removed"] == []
    assert d["updated"] == [{"before": current[0], "after": proposed[0]}]


def test_unchanged_scene_produces_no_diff():
    scene = {"name": "Evening", "category": "lighting", "when": {"lux": {"max": 40}}}
    d = diff_scopes([scene], [dict(scene)])
    assert d == {"added": [], "removed": [], "updated": []}


def test_ignores_transient_annotation_fields_when_comparing():
    current = [
        {
            "name": "Evening",
            "category": "lighting",
            "shadowed_by": 2,
            "missing_entities": ["x"],
        }
    ]
    proposed = [{"name": "Evening", "category": "lighting"}]
    assert diff_scopes(current, proposed)["updated"] == []


def test_ignores_backend_priority_and_pinned_when_comparing():
    # The backend annotates stored scenes with a computed `priority` + `pinned` the
    # AI never authors, so a re-submitted-unchanged scene must not show as updated.
    current = [{"name": "Evening", "category": "lighting", "priority": 7168, "pinned": True}]
    proposed = [{"name": "Evening", "category": "lighting"}]
    assert diff_scopes(current, proposed)["updated"] == []


def test_same_name_different_category_are_distinct():
    current = [{"name": "On", "category": "a"}]
    proposed = [{"name": "On", "category": "b"}]
    d = diff_scopes(current, proposed)
    assert d["added"] == [{"name": "On", "category": "b"}]
    assert d["removed"] == [{"name": "On", "category": "a"}]


def test_unnamed_scenes_matched_by_index():
    current = [{"category": "c", "when": {"lux": {"max": 10}}}]
    proposed = [{"category": "c", "when": {"lux": {"max": 20}}}]
    d = diff_scopes(current, proposed)
    assert d["updated"] == [{"before": current[0], "after": proposed[0]}]


# summarise_diff: elides scene BODIES from a diff_scopes result while keeping
# every ENTRY — the property `fit_preview` depends on. A future refactor that
# drops an entry instead of just its body would let a human approve a scope
# write without ever seeing every scene it touches.


def test_summarise_diff_keeps_every_added_and_removed_entry():
    added = [{"name": f"a{i}", "category": "c", "actions": "x" * 50} for i in range(30)]
    removed = [{"name": f"r{i}", "category": "c", "actions": "y" * 50} for i in range(15)]
    changes = {"added": added, "removed": removed, "updated": []}

    summary = summarise_diff(changes)

    assert len(summary["added"]) == len(added)
    assert len(summary["removed"]) == len(removed)
    assert {e["name"] for e in summary["added"]} == {s["name"] for s in added}
    assert {e["name"] for e in summary["removed"]} == {s["name"] for s in removed}


def test_summarise_diff_added_and_removed_entries_carry_name_and_category_only():
    changes = {
        "added": [{"name": "Movie", "category": "lighting", "actions": [{"x": "y"}]}],
        "removed": [],
        "updated": [],
    }

    assert summarise_diff(changes)["added"] == [{"name": "Movie", "category": "lighting"}]


def test_summarise_diff_updated_reports_changed_fields():
    before = {"name": "Evening", "category": "lighting", "actions": "off", "when": {"lux": 10}}
    after = {"name": "Evening", "category": "lighting", "actions": "on", "when": {"lux": 20}}
    changes = {"added": [], "removed": [], "updated": [{"before": before, "after": after}]}

    summary = summarise_diff(changes)

    assert summary["updated"] == [
        {
            "name": "Evening",
            "category": "lighting",
            "changed_fields": ["actions", "when"],
        }
    ]


def test_summarise_diff_never_reports_priority_or_pinned_as_changed():
    before = {"name": "Evening", "category": "lighting", "priority": 5, "pinned": True}
    after = {"name": "Evening", "category": "lighting", "priority": 99, "pinned": False}
    changes = {"added": [], "removed": [], "updated": [{"before": before, "after": after}]}

    assert summarise_diff(changes)["updated"][0]["changed_fields"] == []


def test_summarise_diff_handles_an_unnamed_scene_without_crashing():
    current = [{"category": "c", "when": {"lux": {"max": 10}}}]
    proposed = [{"category": "c", "when": {"lux": {"max": 20}}}]
    changes = diff_scopes(current, proposed)

    summary = summarise_diff(changes)

    assert summary["updated"] == [
        {"name": None, "category": "c", "index": 0, "changed_fields": ["when"]}
    ]


def test_summarise_diff_gives_unnamed_added_removed_entries_a_positional_index():
    changes = {
        "added": [{"category": "c", "actions": "x"}, {"category": "c", "actions": "y"}],
        "removed": [],
        "updated": [],
    }

    summary = summarise_diff(changes)

    assert summary["added"] == [
        {"name": None, "category": "c", "index": 0},
        {"name": None, "category": "c", "index": 1},
    ]
