"""scope_for_unique_id reverses switch_unique_id back to (scope_kind, scope_id)."""

from __future__ import annotations

from custom_components.ambience.switch import scope_for_unique_id, switch_unique_id


def test_house():
    assert scope_for_unique_id("ambience_switch_house") == ("house", None)


def test_area():
    assert scope_for_unique_id("ambience_switch_area_living_room") == ("area", "living_room")


def test_floor():
    assert scope_for_unique_id("ambience_switch_floor_upstairs") == ("floor", "upstairs")


def test_id_with_underscores_is_preserved():
    assert scope_for_unique_id("ambience_switch_area_a_b_c") == ("area", "a_b_c")


def test_unknown_prefix_returns_none():
    assert scope_for_unique_id("something_else") is None


def test_round_trips_with_switch_unique_id():
    for scope_kind, scope_id in (("house", None), ("area", "lr"), ("floor", "up")):
        assert scope_for_unique_id(switch_unique_id(scope_kind, scope_id)) == (scope_kind, scope_id)
