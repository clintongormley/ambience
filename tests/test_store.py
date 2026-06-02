"""AmbienceStore wraps HA Store with typed helpers."""

from __future__ import annotations

import copy

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from custom_components.ambience.const import (
    GENERAL_CATEGORY_ID,
    SIGNAL_CONFIG_CHANGED,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from custom_components.ambience.store import AmbienceStore


async def test_load_empty_returns_empty_areas(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.areas() == {}


async def test_save_and_read_area(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    config = {
        "extra": ["movie"],
        "conditions": ["time_of_day"],
        "rules": [],
    }
    await store.async_save_area("living_room", config)
    assert store.areas() == {"living_room": config}
    assert store.get_area("living_room") == config


async def test_get_area_unknown_returns_none(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_area("nope") is None


async def test_delete_area(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area("a", {"extra": [], "conditions": [], "rules": []})
    await store.async_delete_area("a")
    assert store.get_area("a") is None


async def test_delete_unknown_area_is_noop(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_delete_area("nope")  # must not raise


async def test_corrupt_payload_starts_empty(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    """If the HA Store load yields garbage, start with empty data and log."""
    # Pre-seed the underlying store with an unexpected shape.
    from homeassistant.helpers.storage import Store

    raw = Store(hass, 1, "ambience")
    await raw.async_save({"unexpected": True})

    store = AmbienceStore(hass)
    await store.async_load()
    assert store.areas() == {}
    assert "ambience storage payload" in caplog.text.lower()


async def test_persisted_data_survives_new_store_instance(hass: HomeAssistant) -> None:
    """Save with one AmbienceStore, then load with a fresh one — data must survive."""
    s1 = AmbienceStore(hass)
    await s1.async_load()
    config = {"extra": ["welcome"], "rules": []}
    await s1.async_save_area("hall", config)

    s2 = AmbienceStore(hass)
    await s2.async_load()
    assert s2.get_area("hall") == config


async def test_periods_default_to_empty_on_fresh_load(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_periods() == {"custom": {}, "hidden": []}


async def test_periods_round_trip(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    payload = {
        "custom": {
            "wind_down": {
                "from": {"kind": "time", "hh": 20, "mm": 0},
                "to": {"kind": "time", "hh": 22, "mm": 0},
                "label": "Wind down",
            }
        },
        "hidden": ["daytime"],
    }
    await store.async_save_periods(payload)
    assert store.get_periods() == payload


async def test_periods_load_handles_legacy_payload_without_periods_key(
    hass: HomeAssistant,
) -> None:
    """Storage written before this feature shipped has no time_of_day_periods key.
    Loading must not raise; periods default to empty."""
    store = AmbienceStore(hass)
    # Simulate a load where on-disk payload lacks the new key.
    store._data = {"version": 1, "areas": {}}
    assert store.get_periods() == {"custom": {}, "hidden": []}


def test_async_load_migrates_old_action_targets(hass: HomeAssistant) -> None:
    """Old dict-shaped targets are split by params category into new entity_ids/params shape."""
    store = AmbienceStore(hass)
    store._data = {
        "version": 1,
        "areas": {
            "living_room": {
                "conditions": [],
                "rules": [
                    {
                        "name": "test",
                        "when": {},
                        "actions": [
                            {
                                "action": "set_light",
                                "targets": {
                                    "light.a": {"brightness": 100},
                                    "light.b": {"brightness": 100},
                                    "light.c": {"brightness": 50},
                                },
                            }
                        ],
                    }
                ],
            }
        },
    }
    store._migrate_actions()
    actions = store._data["areas"]["living_room"]["rules"][0]["actions"]
    # Two categories: brightness=100 (a, b) and brightness=50 (c)
    assert len(actions) == 2
    by_brightness = {a["params"]["brightness"]: a for a in actions}
    assert sorted(by_brightness[100]["entity_ids"]) == ["light.a", "light.b"]
    assert by_brightness[100]["action"] == "set_light"
    assert by_brightness[50]["entity_ids"] == ["light.c"]


def test_async_load_leaves_new_shape_unchanged(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    new_action = {
        "action": "set_light",
        "entity_ids": ["light.a"],
        "params": {"brightness": 80},
    }
    store._data = {
        "version": 1,
        "areas": {
            "living_room": {
                "conditions": [],
                "rules": [{"name": "test", "when": {}, "actions": [new_action]}],
            }
        },
    }
    store._migrate_actions()
    assert store._data["areas"]["living_room"]["rules"][0]["actions"] == [new_action]


def test_async_load_handles_empty_targets_dict(hass: HomeAssistant) -> None:
    """An old-shape action with empty targets becomes an entry with no entity_ids."""
    store = AmbienceStore(hass)
    store._data = {
        "version": 1,
        "areas": {
            "living_room": {
                "conditions": [],
                "rules": [
                    {
                        "name": "test",
                        "when": {},
                        "actions": [{"action": "set_light", "targets": {}}],
                    }
                ],
            }
        },
    }
    store._migrate_actions()
    actions = store._data["areas"]["living_room"]["rules"][0]["actions"]
    assert len(actions) == 1
    assert actions[0]["action"] == "set_light"
    assert actions[0]["entity_ids"] == []
    assert actions[0]["params"] == {}


def test_migrate_one_action_passthrough_when_targets_not_dict(hass: HomeAssistant) -> None:
    """Action with a non-dict 'targets' value (malformed) is passed through unchanged."""
    store = AmbienceStore(hass)
    bad_action = {"action": "set_light", "targets": "not_a_dict"}
    store._data = {
        "version": 1,
        "areas": {
            "living_room": {
                "conditions": [],
                "rules": [{"name": "bad", "when": {}, "actions": [bad_action]}],
            }
        },
    }
    store._migrate_actions()
    actions = store._data["areas"]["living_room"]["rules"][0]["actions"]
    # Malformed action is passed through without modification
    assert actions == [bad_action]


def test_async_load_migrates_old_period_names(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    store._data = {
        "version": 1,
        "areas": {
            "living_room": {
                "conditions": [],
                "rules": [
                    {
                        "name": "old",
                        "when": {"time_of_day": {"period": "night"}},
                        "actions": [],
                    },
                    {
                        "name": "list",
                        "when": {"time_of_day": [{"period": "day"}, {"period": "evening"}]},
                        "actions": [],
                    },
                ],
            }
        },
        "time_of_day_periods": {
            "custom": {
                "night": {
                    "from": {"kind": "time", "hh": 22, "mm": 0},
                    "to": {"kind": "time", "hh": 6, "mm": 0},
                    "label": "Custom night",
                },
            },
            "hidden": ["day"],
        },
    }
    store._migrate_periods()
    rules = store._data["areas"]["living_room"]["rules"]
    assert rules[0]["when"]["time_of_day"] == {"period": "nighttime"}
    assert rules[1]["when"]["time_of_day"] == [{"period": "daytime"}, {"period": "evening"}]
    custom = store._data["time_of_day_periods"]["custom"]
    assert "night" not in custom
    assert "nighttime" in custom
    assert custom["nighttime"]["label"] == "Custom night"
    hidden = store._data["time_of_day_periods"]["hidden"]
    assert hidden == ["daytime"]


async def test_empty_store_has_condition_defaults(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_condition_config("time_of_day") == {"custom": {}, "hidden": []}
    assert store.get_condition_config("day") == {
        "workday_sensor": None,
        "workday_calendar": None,
    }


async def test_save_condition_config_round_trips(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_condition_config(
        "day",
        {
            "workday_sensor": "binary_sensor.workday",
            "workday_calendar": "calendar.workday",
        },
    )
    assert store.get_condition_config("day") == {
        "workday_sensor": "binary_sensor.workday",
        "workday_calendar": "calendar.workday",
    }


async def test_migration_drops_area_conditions(hass: HomeAssistant) -> None:
    from homeassistant.helpers.storage import Store

    raw = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    await raw.async_save(
        {
            "version": STORAGE_VERSION,
            "areas": {
                "a1": {"conditions": ["time_of_day"], "rules": []},
            },
            "time_of_day_periods": {"custom": {}, "hidden": []},
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    assert "conditions" not in store.get_area("a1")


async def test_migration_relocates_periods(hass: HomeAssistant) -> None:
    from homeassistant.helpers.storage import Store

    raw = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    await raw.async_save(
        {
            "version": STORAGE_VERSION,
            "areas": {},
            "time_of_day_periods": {
                "custom": {
                    "latenight": {
                        "from": {"kind": "time", "hh": 22, "mm": 0},
                        "to": {"kind": "time", "hh": 3, "mm": 0},
                    }
                },
                "hidden": ["evening"],
            },
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_condition_config("time_of_day") == {
        "custom": {
            "latenight": {
                "from": {"kind": "time", "hh": 22, "mm": 0},
                "to": {"kind": "time", "hh": 3, "mm": 0},
            }
        },
        "hidden": ["evening"],
    }


async def test_load_ignores_legacy_enabled_matchers(hass: HomeAssistant) -> None:
    """Old `enabled_matchers` field on disk must be silently ignored after removal."""
    from homeassistant.helpers.storage import Store

    raw = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    await raw.async_save(
        {
            "version": STORAGE_VERSION,
            "areas": {},
            "enabled_matchers": ["time_of_day", "day"],  # legacy field; must not crash
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()  # must not raise
    assert store.areas() == {}


async def test_empty_store_has_weather_default(hass: HomeAssistant) -> None:
    from custom_components.ambience.conditions.weather import DEFAULT_WEATHER_GROUPS

    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_condition_config("weather") == {
        "entity": None,
        "groups": DEFAULT_WEATHER_GROUPS,
    }


async def test_save_weather_config_round_trips(hass: HomeAssistant) -> None:
    from custom_components.ambience.conditions.weather import DEFAULT_WEATHER_GROUPS

    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_condition_config("weather", {"entity": "weather.home"})
    assert store.get_condition_config("weather") == {
        "entity": "weather.home",
        "groups": DEFAULT_WEATHER_GROUPS,
    }


async def test_empty_store_seeds_default_weather_groups(hass: HomeAssistant) -> None:
    from custom_components.ambience.conditions.weather import DEFAULT_WEATHER_GROUPS

    store = AmbienceStore(hass)
    await store.async_load()
    cfg = store.get_condition_config("weather")
    assert cfg["entity"] is None
    assert cfg["groups"] == DEFAULT_WEATHER_GROUPS


async def test_existing_weather_entity_keeps_user_groups(hass: HomeAssistant) -> None:
    from homeassistant.helpers.storage import Store

    from custom_components.ambience.const import STORAGE_KEY, STORAGE_VERSION

    raw = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    user_groups = [{"id": "only", "label": "Only", "conditions": ["sunny"]}]
    await raw.async_save(
        {
            "version": STORAGE_VERSION,
            "areas": {},
            "conditions": {"weather": {"entity": "weather.home", "groups": user_groups}},
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    cfg = store.get_condition_config("weather")
    assert cfg == {"entity": "weather.home", "groups": user_groups}


async def test_load_empty_returns_empty_floors(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.floors() == {}


async def test_load_empty_returns_default_house(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_house() == {"rules": []}


async def test_save_and_read_floor(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    config = {"rules": [{"name": "x", "when": {}, "actions": []}]}
    await store.async_save_floor("upstairs", config)
    assert store.get_floor("upstairs") == config
    assert store.floors() == {"upstairs": config}


async def test_delete_floor(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_floor("a", {"rules": []})
    await store.async_delete_floor("a")
    assert store.get_floor("a") is None


async def test_delete_unknown_floor_is_noop(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_delete_floor("nope")  # must not raise


async def test_save_and_read_house(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    config = {"rules": [{"name": "away", "when": {}, "actions": []}]}
    await store.async_save_house(config)
    assert store.get_house() == config


async def test_persisted_floor_and_house_survive_new_store(hass: HomeAssistant) -> None:
    s1 = AmbienceStore(hass)
    await s1.async_load()
    await s1.async_save_floor("upstairs", {"rules": []})
    await s1.async_save_house({"rules": [{"name": "h", "when": {}, "actions": []}]})

    s2 = AmbienceStore(hass)
    await s2.async_load()
    assert s2.get_floor("upstairs") == {"rules": []}
    assert s2.get_house()["rules"][0]["name"] == "h"


async def test_all_scope_configs_yields_every_scope(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area("kitchen", {"rules": [{"name": "k", "when": {}, "actions": []}]})
    await store.async_save_floor("upstairs", {"rules": [{"name": "u", "when": {}, "actions": []}]})
    await store.async_save_house({"rules": [{"name": "h", "when": {}, "actions": []}]})

    triples = list(store.all_scope_configs())
    by_kind = {(k, sid): cfg for (k, sid, cfg) in triples}

    assert ("area", "kitchen") in by_kind
    assert ("floor", "upstairs") in by_kind
    assert ("house", None) in by_kind
    assert by_kind[("area", "kitchen")]["rules"][0]["name"] == "k"
    assert by_kind[("house", None)]["rules"][0]["name"] == "h"


async def test_save_area_fires_config_changed(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_save_area("a", {"rules": []})
    await hass.async_block_till_done()
    unsub()
    assert len(calls) == 1


async def test_save_condition_config_fires_config_changed(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_save_condition_config("weather", {"entity": "weather.home"})
    await hass.async_block_till_done()
    unsub()
    assert len(calls) == 1


async def test_save_exposed_actions_fires_config_changed(hass: HomeAssistant) -> None:
    # Exposed-action defaults feed the engine's re-apply intervals, so saving
    # them must rebuild the watch-set like any other config save.
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_save_exposed_actions(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    await hass.async_block_till_done()
    unsub()
    assert len(calls) == 1


async def test_delete_area_fires_config_changed(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area("a", {"rules": []})
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_delete_area("a")
    await hass.async_block_till_done()
    unsub()
    assert len(calls) == 1


async def test_delete_missing_area_is_silent(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_delete_area("nope")
    await hass.async_block_till_done()
    unsub()
    assert calls == []


async def test_load_empty_seeds_general_category(hass: HomeAssistant) -> None:
    # Categories are required: a fresh store seeds the General category.
    store = AmbienceStore(hass)
    await store.async_load()
    assert [g["id"] for g in store.categories()] == [GENERAL_CATEGORY_ID]


async def test_ensure_categories_is_idempotent_and_preserves_user_categories(
    hass: HomeAssistant,
) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_categories([{"id": "blinds", "name": "Blinds"}])
    # Reload simulates a second startup: ensure must not clobber existing categories
    # nor prepend the General category when at least one category already exists.
    store2 = AmbienceStore(hass)
    await store2.async_load()
    assert store2.categories() == [{"id": "blinds", "name": "Blinds"}]


async def test_save_categories_fires_config_changed(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_save_categories([{"id": "blinds", "name": "Blinds"}])
    await hass.async_block_till_done()
    unsub()
    assert len(calls) == 1


async def test_migrate_leaves_explicit_category_untouched(hass: HomeAssistant) -> None:
    """Rules referencing an existing category are not overwritten by the migration."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_categories([{"id": "blinds", "name": "Blinds"}])
    await store.async_save_area(
        "lr",
        {"rules": [{"when": {}, "actions": [], "category": "blinds"}], "auto_sort": True},
    )
    store2 = AmbienceStore(hass)
    await store2.async_load()
    assert store2.get_area("lr")["rules"][0]["category"] == "blinds"


async def test_fresh_store_seeds_general_category(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()  # no persisted data
    categories = store.categories()
    assert [g["id"] for g in categories] == [GENERAL_CATEGORY_ID]
    assert categories[0]["name"] == "General"
    assert categories[0]["icon"] == "mdi:home"
    assert categories[0]["color"] == "blue-grey"


async def test_load_migrates_uncategorised_and_unknown_rules_to_general(
    hass: HomeAssistant, hass_storage
) -> None:
    hass_storage[STORAGE_KEY] = {
        "version": STORAGE_VERSION,
        "data": {
            "version": STORAGE_VERSION,
            "categories": [{"id": "blinds", "name": "Blinds"}],
            "areas": {
                "a1": {
                    "rules": [
                        {"when": {}, "actions": []},  # uncategorised
                        {"when": {}, "actions": [], "category": "gone"},  # unknown id
                        {"when": {}, "actions": [], "category": "blinds"},
                    ]
                }
            },
            "floors": {},
            "house": {"rules": []},
        },
    }
    store = AmbienceStore(hass)
    await store.async_load()
    assert any(g["id"] == GENERAL_CATEGORY_ID for g in store.categories())
    categories_on_rules = [r.get("category") for r in store.get_area("a1")["rules"]]
    assert categories_on_rules == [GENERAL_CATEGORY_ID, GENERAL_CATEGORY_ID, "blinds"]


async def test_delete_category_blocked_when_it_has_members(
    hass: HomeAssistant, hass_storage
) -> None:
    hass_storage[STORAGE_KEY] = {
        "version": STORAGE_VERSION,
        "data": {
            "version": STORAGE_VERSION,
            "categories": [{"id": "blinds", "name": "Blinds"}, {"id": "lights", "name": "Lights"}],
            "areas": {"a1": {"rules": [{"when": {}, "actions": [], "category": "blinds"}]}},
            "floors": {},
            "house": {"rules": []},
        },
    }
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError, match="still has rules"):
        await store.async_delete_category("blinds")
    assert any(g["id"] == "blinds" for g in store.categories())


async def test_delete_category_blocked_when_last(hass: HomeAssistant, hass_storage) -> None:
    hass_storage[STORAGE_KEY] = {
        "version": STORAGE_VERSION,
        "data": {
            "version": STORAGE_VERSION,
            "categories": [{"id": "only", "name": "Only"}],
            "areas": {},
            "floors": {},
            "house": {"rules": []},
        },
    }
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError, match="last category"):
        await store.async_delete_category("only")


async def test_delete_empty_non_last_category_succeeds(hass: HomeAssistant, hass_storage) -> None:
    hass_storage[STORAGE_KEY] = {
        "version": STORAGE_VERSION,
        "data": {
            "version": STORAGE_VERSION,
            "categories": [{"id": "a", "name": "A"}, {"id": "b", "name": "B"}],
            "areas": {},
            "floors": {},
            "house": {"rules": []},
        },
    }
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_delete_category("a")
    assert [g["id"] for g in store.categories()] == ["b"]


def test_migrate_groups_to_categories_renames_keys_and_fields(hass: HomeAssistant) -> None:
    """Legacy `groups` top-level + per-rule `group` field upgrade to categories/category."""
    store = AmbienceStore(hass)
    store._data = {
        "version": 1,
        "groups": [{"id": "general", "name": "General"}, {"id": "movie", "name": "Movie"}],
        "areas": {
            "lr": {"rules": [{"group": "movie", "when": {}}, {"group": "general", "when": {}}]}
        },
        "floors": {},
        "house": {"rules": [{"group": "movie", "when": {}}]},
    }
    store._migrate_groups_to_categories()
    assert "groups" not in store._data
    assert store._data["categories"] == [
        {"id": "general", "name": "General"},
        {"id": "movie", "name": "Movie"},
    ]
    assert [r["category"] for r in store._data["areas"]["lr"]["rules"]] == ["movie", "general"]
    assert "group" not in store._data["areas"]["lr"]["rules"][0]
    assert store._data["house"]["rules"][0]["category"] == "movie"


def test_migrate_groups_to_categories_is_idempotent(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    store._data = {
        "version": 1,
        "categories": [{"id": "general", "name": "General"}],
        "areas": {"lr": {"rules": [{"category": "general", "when": {}}]}},
        "floors": {},
        "house": {"rules": []},
    }
    snapshot = copy.deepcopy(store._data)
    store._migrate_groups_to_categories()
    assert store._data == snapshot


def test_migrate_matchers_to_conditions_renames_namespace(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    store._data = {
        "version": 1,
        "matchers": {
            "time_of_day": {"custom": {}, "hidden": []},
            "weather": {
                "entity": "weather.home",
                "groups": [{"id": "g1", "conditions": ["sunny"]}],
            },
        },
        "areas": {},
        "floors": {},
        "house": {"rules": []},
    }
    store._migrate_matchers_to_conditions()
    assert "matchers" not in store._data
    # nested weather.groups + its inner `conditions` field preserved verbatim
    assert store._data["conditions"]["weather"]["groups"] == [{"id": "g1", "conditions": ["sunny"]}]
    assert store._data["conditions"]["time_of_day"] == {"custom": {}, "hidden": []}


def test_migrate_matchers_to_conditions_is_idempotent(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    store._data = {
        "version": 1,
        "conditions": {"day": {}},
        "areas": {},
        "floors": {},
        "house": {"rules": []},
    }
    snapshot = copy.deepcopy(store._data)
    store._migrate_matchers_to_conditions()
    assert store._data == snapshot


async def test_async_load_upgrades_legacy_groups_matchers_payload(hass: HomeAssistant) -> None:
    """Full end-to-end: a legacy on-disk payload loads and exposes new vocabulary."""
    from homeassistant.helpers.storage import Store

    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "groups": [
                {"id": "general", "name": "General", "icon": "mdi:home", "color": "blue-grey"},
                {"id": "movie", "name": "Movie", "icon": "mdi:movie", "color": "red"},
            ],
            "areas": {
                "lr": {
                    "rules": [
                        {"group": "movie", "when": {}, "actions": []},
                        {"group": "general", "when": {}, "actions": []},
                    ]
                }
            },
            "floors": {},
            "house": {"rules": []},
            "matchers": {"time_of_day": {"custom": {}, "hidden": []}},
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    assert {c["id"] for c in store.categories()} == {"general", "movie"}
    assert [r["category"] for r in store.get_area("lr")["rules"]] == ["movie", "general"]
    assert store.get_condition_config("time_of_day") == {"custom": {}, "hidden": []}
