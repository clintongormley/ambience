from custom_components.ambience.target_resolve import action_target


def test_action_target_prefers_explicit_target() -> None:
    action = {"service": "light.turn_on", "target": {"area_id": ["kitchen"]}, "params": {}}
    assert action_target(action) == {"area_id": ["kitchen"]}


def test_action_target_falls_back_to_legacy_entity_ids() -> None:
    action = {"service": "light.turn_on", "entity_ids": ["light.a", "light.b"], "params": {}}
    assert action_target(action) == {"entity_id": ["light.a", "light.b"]}


def test_action_target_drops_empty_lists_and_blank() -> None:
    assert action_target({"service": "x.y", "target": {"area_id": [], "entity_id": ["light.a"]}}) == {
        "entity_id": ["light.a"]
    }
    assert action_target({"service": "x.y"}) == {}
    assert action_target({"service": "x.y", "entity_ids": []}) == {}


def test_action_target_coerces_scalar_to_list() -> None:
    assert action_target({"service": "x.y", "target": {"area_id": "kitchen"}}) == {"area_id": ["kitchen"]}
