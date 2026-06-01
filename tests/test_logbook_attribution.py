"""Logbook attribution: message composition + context propagation."""

from __future__ import annotations

from custom_components.ambience.service import _compose_apply_message

# --- Pure message composition -------------------------------------------------


def test_message_named_rule_single_group() -> None:
    msg = _compose_apply_message(
        reapplied=False,
        rule_name="Evening",
        rule_index=0,
        scope_label="Master Bedroom",
        group_label="Lights",
        group_count=1,
    )
    assert msg == "applied 'Evening' in Master Bedroom"


def test_message_multiple_groups_includes_group() -> None:
    msg = _compose_apply_message(
        reapplied=False,
        rule_name="Evening",
        rule_index=0,
        scope_label="Master Bedroom",
        group_label="Lights",
        group_count=2,
    )
    assert msg == "applied 'Evening' in Master Bedroom (Lights)"


def test_message_unnamed_rule_falls_back_to_index() -> None:
    msg = _compose_apply_message(
        reapplied=False,
        rule_name=None,
        rule_index=2,
        scope_label="Kitchen",
        group_label=None,
        group_count=1,
    )
    assert msg == "applied 'rule 3' in Kitchen"


def test_message_reapplied_verb() -> None:
    msg = _compose_apply_message(
        reapplied=True,
        rule_name="Evening",
        rule_index=0,
        scope_label="Master Bedroom",
        group_label="Lights",
        group_count=2,
    )
    assert msg == "re-applied 'Evening' in Master Bedroom (Lights)"


def test_message_multiple_groups_but_no_label_omits_group() -> None:
    # group_count > 1 with an unknown/labelless group: suffix is omitted.
    msg = _compose_apply_message(
        reapplied=False,
        rule_name="Evening",
        rule_index=0,
        scope_label="Master Bedroom",
        group_label=None,
        group_count=2,
    )
    assert msg == "applied 'Evening' in Master Bedroom"


def test_message_reapplied_single_group() -> None:
    msg = _compose_apply_message(
        reapplied=True,
        rule_name="Evening",
        rule_index=0,
        scope_label="Master Bedroom",
        group_label="Lights",
        group_count=1,
    )
    assert msg == "re-applied 'Evening' in Master Bedroom"
