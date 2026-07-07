from ambience_mcp.diff import diff_scopes


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
