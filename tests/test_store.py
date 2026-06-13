"""AmbienceStore wraps HA Store with typed helpers."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from custom_components.ambience.const import (
    GENERAL_CATEGORY_ID,
    SIGNAL_CONFIG_CHANGED,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from custom_components.ambience.store import AmbienceStore, reassign_orphan_scenes


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
        "scenes": [],
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
    await store.async_save_area("a", {"extra": [], "conditions": [], "scenes": []})
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
    config = {"extra": ["welcome"], "scenes": []}
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
    assert store.get_house() == {"scenes": []}


async def test_save_and_read_floor(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    config = {"scenes": [{"name": "x", "when": {}, "actions": []}]}
    await store.async_save_floor("upstairs", config)
    assert store.get_floor("upstairs") == config
    assert store.floors() == {"upstairs": config}


async def test_delete_floor(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_floor("a", {"scenes": []})
    await store.async_delete_floor("a")
    assert store.get_floor("a") is None


async def test_delete_unknown_floor_is_noop(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_delete_floor("nope")  # must not raise


async def test_save_and_read_house(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    config = {"scenes": [{"name": "away", "when": {}, "actions": []}]}
    await store.async_save_house(config)
    assert store.get_house() == config


async def test_persisted_floor_and_house_survive_new_store(hass: HomeAssistant) -> None:
    s1 = AmbienceStore(hass)
    await s1.async_load()
    await s1.async_save_floor("upstairs", {"scenes": []})
    await s1.async_save_house({"scenes": [{"name": "h", "when": {}, "actions": []}]})

    s2 = AmbienceStore(hass)
    await s2.async_load()
    assert s2.get_floor("upstairs") == {"scenes": []}
    assert s2.get_house()["scenes"][0]["name"] == "h"


async def test_all_scope_configs_yields_every_scope(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area("kitchen", {"scenes": [{"name": "k", "when": {}, "actions": []}]})
    await store.async_save_floor("upstairs", {"scenes": [{"name": "u", "when": {}, "actions": []}]})
    await store.async_save_house({"scenes": [{"name": "h", "when": {}, "actions": []}]})

    triples = list(store.all_scope_configs())
    by_kind = {(k, sid): cfg for (k, sid, cfg) in triples}

    assert ("area", "kitchen") in by_kind
    assert ("floor", "upstairs") in by_kind
    assert ("house", None) in by_kind
    assert by_kind[("area", "kitchen")]["scenes"][0]["name"] == "k"
    assert by_kind[("house", None)]["scenes"][0]["name"] == "h"


async def test_save_area_fires_config_changed(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_save_area("a", {"scenes": []})
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
    await store.async_save_area("a", {"scenes": []})
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


async def test_load_leaves_explicit_category_untouched(hass: HomeAssistant) -> None:
    """A scene referencing an existing category keeps it across a save/reload round-trip."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_categories([{"id": "blinds", "name": "Blinds"}])
    await store.async_save_area(
        "lr",
        {"scenes": [{"when": {}, "actions": [], "category": "blinds"}]},
    )
    store2 = AmbienceStore(hass)
    await store2.async_load()
    assert store2.get_area("lr")["scenes"][0]["category"] == "blinds"


async def test_fresh_store_seeds_general_category(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()  # no persisted data
    categories = store.categories()
    assert [g["id"] for g in categories] == [GENERAL_CATEGORY_ID]
    assert categories[0]["name"] == "General"
    assert categories[0]["icon"] == "mdi:home"
    assert categories[0]["color"] == "blue-grey"


async def test_delete_category_blocked_when_it_has_members(
    hass: HomeAssistant, hass_storage
) -> None:
    hass_storage[STORAGE_KEY] = {
        "version": STORAGE_VERSION,
        "data": {
            "version": STORAGE_VERSION,
            "categories": [{"id": "blinds", "name": "Blinds"}, {"id": "lights", "name": "Lights"}],
            "areas": {"a1": {"scenes": [{"when": {}, "actions": [], "category": "blinds"}]}},
            "floors": {},
            "house": {"scenes": []},
        },
    }
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError, match="still has scenes"):
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
            "house": {"scenes": []},
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
            "house": {"scenes": []},
        },
    }
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_delete_category("a")
    assert [g["id"] for g in store.categories()] == ["b"]


# --- reassign_orphan_scenes ---------------------------------------------------


def test_reassign_orphan_scenes_reassigns_none_category() -> None:
    """Scenes with category=None are pointed at the target; returns True."""
    scenes = [{"category": None, "actions": []}, {"category": "known", "actions": []}]
    changed = reassign_orphan_scenes(scenes, {"known"}, "general")
    assert changed is True
    assert scenes[0]["category"] == "general"
    assert scenes[1]["category"] == "known"  # untouched


def test_reassign_orphan_scenes_reassigns_unknown_category() -> None:
    """Scenes with an unknown category id are pointed at the target; returns True."""
    scenes = [{"category": "deleted", "actions": []}]
    changed = reassign_orphan_scenes(scenes, {"general"}, "general")
    assert changed is True
    assert scenes[0]["category"] == "general"


def test_reassign_orphan_scenes_no_change_when_all_known() -> None:
    """When every scene already has a known category, returns False and nothing mutates."""
    scenes = [{"category": "lights", "actions": []}, {"category": "blinds", "actions": []}]
    changed = reassign_orphan_scenes(scenes, {"lights", "blinds"}, "general")
    assert changed is False
    assert scenes[0]["category"] == "lights"
    assert scenes[1]["category"] == "blinds"


def test_reassign_orphan_scenes_empty_list_returns_false() -> None:
    """An empty scene list is a no-op that returns False."""
    changed = reassign_orphan_scenes([], {"general"}, "general")
    assert changed is False


# --- as_dict -----------------------------------------------------------------


async def test_as_dict_returns_deep_copy(hass: HomeAssistant) -> None:
    """as_dict() returns a deep copy — mutating the result must not affect the store."""
    store = AmbienceStore(hass)
    await store.async_load()
    snapshot = store.as_dict()
    assert "areas" in snapshot
    # Mutate the copy; the store's internal state must be unaffected.
    snapshot["areas"]["injected"] = {"scenes": []}
    assert store.get_area("injected") is None


# --- get_condition_config fallback branch ------------------------------------


async def test_get_condition_config_unknown_name_returns_raw_dict(
    hass: HomeAssistant,
) -> None:
    """Requesting an unknown condition name returns whatever dict is stored (or {})."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_condition_config("custom_thing", {"foo": "bar"})
    result = store.get_condition_config("custom_thing")
    assert result == {"foo": "bar"}


async def test_get_condition_config_unknown_name_absent_returns_empty(
    hass: HomeAssistant,
) -> None:
    """Requesting an unknown condition name that was never saved returns {}."""
    store = AmbienceStore(hass)
    await store.async_load()
    result = store.get_condition_config("nonexistent")
    assert result == {}


# --- get_exposed_actions non-list fallback -----------------------------------


async def test_get_exposed_actions_with_non_list_payload_returns_empty(
    hass: HomeAssistant,
) -> None:
    """If exposed_actions is somehow not a list, get_exposed_actions() returns []."""
    store = AmbienceStore(hass)
    await store.async_load()
    # Directly corrupt the internal state to simulate a malformed payload.
    store._data["exposed_actions"] = "not-a-list"
    assert store.get_exposed_actions() == []


async def test_get_exposed_actions_with_missing_key_returns_empty(
    hass: HomeAssistant,
) -> None:
    """If exposed_actions key is entirely absent, get_exposed_actions() returns []."""
    store = AmbienceStore(hass)
    await store.async_load()
    del store._data["exposed_actions"]
    assert store.get_exposed_actions() == []


async def test_save_area_signal_carries_scope(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_save_area("a", {"scenes": []})
    await hass.async_block_till_done()
    unsub()
    assert calls == [(("area", "a"),)]


async def test_save_house_signal_carries_house_scope(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_save_house({"scenes": []})
    await hass.async_block_till_done()
    unsub()
    assert calls == [(("house", None),)]


async def test_save_condition_config_signal_is_global(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_save_condition_config("weather", {"entity": "weather.home"})
    await hass.async_block_till_done()
    unsub()
    assert calls == [(None,)]


async def test_reapply_settings_default_off(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_reapply_settings() == {"enabled": False, "interval_seconds": 3600}


async def test_save_and_get_reapply_settings(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_reapply_settings({"enabled": True, "interval_seconds": 3600})
    assert store.get_reapply_settings() == {"enabled": True, "interval_seconds": 3600}


async def test_save_reapply_settings_rejects_non_bool_enabled(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError):
        await store.async_save_reapply_settings({"enabled": 1, "interval_seconds": 3600})


async def test_save_reapply_settings_rejects_interval_below_floor(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError):
        await store.async_save_reapply_settings({"enabled": True, "interval_seconds": 30})


async def test_ensure_reapply_settings_backfills_legacy_store(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    del store._data["reapply"]  # simulate a store saved before this key existed
    store._ensure_reapply_settings()
    assert store.get_reapply_settings() == {"enabled": False, "interval_seconds": 3600}


async def test_switch_defaults_default_pause_is_zero(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_switch_defaults()["auto_on_delay_seconds"] == 0


async def test_reapply_default_interval_is_one_hour(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_reapply_settings()["interval_seconds"] == 3600
