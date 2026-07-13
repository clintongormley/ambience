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


def test_summarise_diff_reports_priority_and_pinned_when_explicitly_authored():
    # Inverted: priority/pinned are evaluation-order fields the backend HONOURS
    # on import, so when the AFTER scene states them explicitly a change here
    # must be visible, not swallowed — see test_a_priority_swap_is_a_visible_update.
    before = {"name": "Evening", "category": "lighting", "priority": 5, "pinned": True}
    after = {"name": "Evening", "category": "lighting", "priority": 99, "pinned": False}
    changes = {"added": [], "removed": [], "updated": [{"before": before, "after": after}]}

    assert summarise_diff(changes)["updated"][0]["changed_fields"] == ["pinned", "priority"]


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


def test_a_priority_swap_is_a_visible_update():
    """The backend pins any scene carrying an int priority AT that priority
    (authorable on import) — swapping two priorities changes which scene wins,
    so it must never preview as an empty diff."""
    current = [
        {"name": "A", "category": "mood", "priority": 2048, "actions": []},
        {"name": "B", "category": "mood", "priority": 1024, "actions": []},
    ]
    proposed = [
        {"name": "A", "category": "mood", "priority": 1024, "actions": []},
        {"name": "B", "category": "mood", "priority": 2048, "actions": []},
    ]
    changes = diff_scopes(current, proposed)
    assert changes["added"] == [] and changes["removed"] == []
    assert len(changes["updated"]) == 2
    summary = summarise_diff(changes)
    assert all(u["changed_fields"] == ["priority"] for u in summary["updated"])


def test_a_pinned_flip_is_a_visible_update():
    current = [{"name": "A", "category": "mood", "priority": 10, "actions": []}]
    proposed = [{"name": "A", "category": "mood", "priority": 10, "pinned": True, "actions": []}]
    assert len(diff_scopes(current, proposed)["updated"]) == 1


def test_a_faithful_carry_forward_is_still_an_empty_diff():
    scene = {"name": "A", "category": "mood", "priority": 10, "pinned": False, "actions": []}
    changes = diff_scopes([scene], [dict(scene)])
    assert changes["updated"] == [] and "order_note" not in changes


def test_authoring_without_order_fields_gets_one_note_not_per_scene_noise():
    """A model that authors by list order (no priority/pinned) must not drown
    the diff in phantom 'updated' entries — but the backend WILL re-derive
    order, so the diff says so once, at scope level."""
    current = [
        {"name": "A", "category": "mood", "priority": 2048, "actions": []},
        {"name": "B", "category": "mood", "priority": 1024, "actions": []},
    ]
    proposed = [
        {"name": "A", "category": "mood", "actions": []},
        {"name": "B", "category": "mood", "actions": []},
    ]
    changes = diff_scopes(current, proposed)
    assert changes["updated"] == []
    assert "re-derive" in changes["order_note"]


def test_restating_priority_while_dropping_pinned_still_gets_a_signal():
    """Partial omission: the proposal restates `priority` unchanged but silently
    drops the stored `pinned`. Per-field comparison strips `pinned` from both
    sides (since it's not authored), so the scenes compare equal and produce no
    `updated` entry — but the backend WILL re-derive `pinned` on apply
    (minimise_pins), so this must not be a silent, empty diff."""
    current = [{"name": "A", "category": "mood", "priority": 100, "pinned": True, "actions": []}]
    proposed = [{"name": "A", "category": "mood", "priority": 100, "actions": []}]
    changes = diff_scopes(current, proposed)
    assert changes["updated"] == []
    assert "order_note" in changes


def test_restating_pinned_while_dropping_priority_still_gets_a_signal():
    """The mirror image: `pinned` is restated unchanged, `priority` is silently
    dropped. Same reasoning as the priority-restated case above, other field."""
    current = [{"name": "A", "category": "mood", "priority": 100, "pinned": True, "actions": []}]
    proposed = [{"name": "A", "category": "mood", "pinned": True, "actions": []}]
    changes = diff_scopes(current, proposed)
    assert changes["updated"] == []
    assert "order_note" in changes


def test_summarise_diff_keeps_the_order_note():
    changes = {"added": [], "removed": [], "updated": [], "order_note": "note text"}
    assert summarise_diff(changes)["order_note"] == "note text"
