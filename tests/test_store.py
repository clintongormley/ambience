"""AmbienceStore wraps HA Store with typed helpers."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.const import STORAGE_KEY, STORAGE_VERSION
from custom_components.ambience.store import AmbienceStore


async def test_load_empty_returns_empty_areas(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.areas() == {}


async def test_save_and_read_area(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    config = {
        "scenes": ["movie"],
        "matchers": ["time_of_day"],
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
    await store.async_save_area("a", {"scenes": [], "matchers": [], "rules": []})
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
    config = {"scenes": ["welcome"], "rules": []}
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
    """Old dict-shaped targets are split by params group into new entity_ids/params shape."""
    store = AmbienceStore(hass)
    store._data = {
        "version": 1,
        "areas": {
            "living_room": {
                "matchers": [],
                "auto_sort": True,
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
    # Two groups: brightness=100 (a, b) and brightness=50 (c)
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
                "matchers": [],
                "auto_sort": True,
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
                "matchers": [],
                "auto_sort": True,
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
                "matchers": [],
                "auto_sort": True,
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
                "matchers": [],
                "auto_sort": True,
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


async def test_empty_store_has_new_shape(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.enabled_matchers() == []
    assert store.get_matcher_config("time_of_day") == {"custom": {}, "hidden": []}
    assert store.get_matcher_config("day") == {
        "workday_sensor": None,
        "workday_calendar": None,
    }


async def test_save_enabled_matchers_round_trips(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_enabled_matchers(["time_of_day", "day"])
    assert store.enabled_matchers() == ["time_of_day", "day"]


async def test_save_matcher_config_round_trips(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_matcher_config(
        "day",
        {
            "workday_sensor": "binary_sensor.workday",
            "workday_calendar": "calendar.workday",
        },
    )
    assert store.get_matcher_config("day") == {
        "workday_sensor": "binary_sensor.workday",
        "workday_calendar": "calendar.workday",
    }


async def test_migration_drops_area_matchers(hass: HomeAssistant) -> None:
    from homeassistant.helpers.storage import Store

    raw = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    await raw.async_save(
        {
            "version": STORAGE_VERSION,
            "areas": {
                "a1": {"matchers": ["time_of_day"], "rules": [], "auto_sort": True},
            },
            "time_of_day_periods": {"custom": {}, "hidden": []},
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    assert "matchers" not in store.get_area("a1")


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
    assert store.get_matcher_config("time_of_day") == {
        "custom": {
            "latenight": {
                "from": {"kind": "time", "hh": 22, "mm": 0},
                "to": {"kind": "time", "hh": 3, "mm": 0},
            }
        },
        "hidden": ["evening"],
    }


async def test_migration_seeds_enabled_matchers_from_registry(hass: HomeAssistant) -> None:
    from homeassistant.helpers.storage import Store

    raw = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    await raw.async_save(
        {
            "version": STORAGE_VERSION,
            "areas": {"a1": {"matchers": ["time_of_day"], "rules": [], "auto_sort": True}},
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    # Seeded with all toggleable matchers when absent.
    assert sorted(store.enabled_matchers()) == ["day", "time_of_day"]


async def test_migration_idempotent_on_new_shape(hass: HomeAssistant) -> None:
    from homeassistant.helpers.storage import Store

    raw = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    new_shape = {
        "version": STORAGE_VERSION,
        "areas": {},
        "enabled_matchers": ["time_of_day"],
        "matchers": {
            "time_of_day": {"custom": {}, "hidden": []},
            "day": {"workday_sensor": None, "workday_calendar": None},
        },
    }
    await raw.async_save(new_shape)
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.enabled_matchers() == ["time_of_day"]
    assert store.get_matcher_config("time_of_day") == {"custom": {}, "hidden": []}


async def test_empty_store_has_weather_default(hass: HomeAssistant) -> None:
    from custom_components.ambience.matchers.weather import DEFAULT_WEATHER_GROUPS

    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_matcher_config("weather") == {
        "entity": None,
        "groups": DEFAULT_WEATHER_GROUPS,
    }


async def test_save_weather_config_round_trips(hass: HomeAssistant) -> None:
    from custom_components.ambience.matchers.weather import DEFAULT_WEATHER_GROUPS

    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_matcher_config("weather", {"entity": "weather.home"})
    assert store.get_matcher_config("weather") == {
        "entity": "weather.home",
        "groups": DEFAULT_WEATHER_GROUPS,
    }


async def test_empty_store_seeds_default_weather_groups(hass: HomeAssistant) -> None:
    from custom_components.ambience.matchers.weather import DEFAULT_WEATHER_GROUPS

    store = AmbienceStore(hass)
    await store.async_load()
    cfg = store.get_matcher_config("weather")
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
            "enabled_matchers": ["weather"],
            "matchers": {"weather": {"entity": "weather.home", "groups": user_groups}},
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    cfg = store.get_matcher_config("weather")
    assert cfg == {"entity": "weather.home", "groups": user_groups}
