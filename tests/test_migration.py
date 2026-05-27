"""Tests for the one-shot action-shape migration."""

from __future__ import annotations

from custom_components.ambience.migration import migrate_scope


def test_migrates_set_light_with_brightness_to_turn_on() -> None:
    cfg = {
        "rules": [
            {
                "actions": [
                    {
                        "action": "set_light",
                        "entity_ids": ["light.a"],
                        "params": {"brightness": 80, "transition": 2},
                    },
                ],
            },
        ],
    }
    used = migrate_scope(cfg)
    assert used == {"light.turn_on"}
    assert cfg["rules"][0]["actions"] == [
        {
            "service": "light.turn_on",
            "entity_ids": ["light.a"],
            "params": {"brightness_pct": 80, "transition": 2},
        },
    ]


def test_migrates_set_light_brightness_zero_to_turn_off() -> None:
    cfg = {
        "rules": [
            {
                "actions": [
                    {
                        "action": "set_light",
                        "entity_ids": ["light.a"],
                        "params": {"brightness": 0, "transition": 3},
                    },
                ],
            },
        ],
    }
    used = migrate_scope(cfg)
    assert used == {"light.turn_off"}
    assert cfg["rules"][0]["actions"] == [
        {
            "service": "light.turn_off",
            "entity_ids": ["light.a"],
            "params": {"transition": 3},
        },
    ]


def test_migrates_set_light_without_transition() -> None:
    cfg = {
        "rules": [
            {
                "actions": [
                    {
                        "action": "set_light",
                        "entity_ids": ["light.a"],
                        "params": {"brightness": 50},
                    },
                ],
            },
        ],
    }
    used = migrate_scope(cfg)
    assert used == {"light.turn_on"}
    assert cfg["rules"][0]["actions"][0] == {
        "service": "light.turn_on",
        "entity_ids": ["light.a"],
        "params": {"brightness_pct": 50},
    }


def test_migrates_script_action() -> None:
    cfg = {
        "rules": [
            {
                "actions": [
                    {
                        "action": "script",
                        "entity_ids": [],
                        "params": {"message": "hi"},
                        "script": "script.greet",
                    },
                ],
            },
        ],
    }
    used = migrate_scope(cfg)
    assert used == {"script.greet"}
    assert cfg["rules"][0]["actions"] == [
        {
            "service": "script.greet",
            "entity_ids": [],
            "params": {"message": "hi"},
        },
    ]


def test_idempotent_on_already_migrated_data() -> None:
    cfg = {
        "rules": [
            {
                "actions": [
                    {
                        "service": "light.turn_on",
                        "entity_ids": ["light.a"],
                        "params": {"brightness_pct": 80},
                    },
                ],
            },
        ],
    }
    before = repr(cfg)
    used = migrate_scope(cfg)
    assert used == set()
    assert repr(cfg) == before


def test_handles_mixed_rules() -> None:
    cfg = {
        "rules": [
            {
                "actions": [
                    {
                        "action": "set_light",
                        "entity_ids": ["light.a"],
                        "params": {"brightness": 100},
                    },
                ],
            },
            {"actions": [{"service": "switch.turn_on", "entity_ids": ["switch.b"], "params": {}}]},
            {
                "actions": [
                    {"action": "script", "entity_ids": [], "params": {}, "script": "script.foo"},
                ],
            },
        ],
    }
    used = migrate_scope(cfg)
    assert used == {"light.turn_on", "script.foo"}


def test_handles_empty_rules() -> None:
    cfg: dict = {"rules": []}
    assert migrate_scope(cfg) == set()


def test_handles_missing_rules_key() -> None:
    cfg: dict = {}
    assert migrate_scope(cfg) == set()
