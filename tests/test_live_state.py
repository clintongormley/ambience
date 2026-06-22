"""Live-state store: last_matched / last_applied_scene helpers."""

from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from custom_components.ambience.const import DOMAIN, SIGNAL_UNIT_LIVE
from custom_components.ambience.service import (
    all_live_states,
    clear_live_state,
    get_last_applied_scene,
    get_last_matched,
    live_state,
    set_last_applied_scene,
    set_last_matched,
)


async def test_set_last_matched_dispatches_only_on_change(hass) -> None:
    hass.data[DOMAIN] = {}
    seen: list[tuple] = []

    @callback
    def _on(unit) -> None:
        seen.append(unit)

    async_dispatcher_connect(hass, SIGNAL_UNIT_LIVE, _on)

    set_last_matched(hass, "area", "k", "g", 2)
    set_last_matched(hass, "area", "k", "g", 2)  # unchanged → no dispatch
    set_last_matched(hass, "area", "k", "g", None)  # changed → dispatch
    await hass.async_block_till_done()

    assert get_last_matched(hass, "area", "k", "g") is None
    assert seen == [("area", "k", "g"), ("area", "k", "g")]


async def test_set_last_applied_scene_dispatches_only_on_change(hass) -> None:
    hass.data[DOMAIN] = {}
    seen: list[tuple] = []

    @callback
    def _on(unit) -> None:
        seen.append(unit)

    async_dispatcher_connect(hass, SIGNAL_UNIT_LIVE, _on)

    set_last_applied_scene(hass, "area", "k", "g", 0)
    set_last_applied_scene(hass, "area", "k", "g", 0)  # unchanged → no dispatch
    await hass.async_block_till_done()

    assert get_last_applied_scene(hass, "area", "k", "g") == 0
    assert seen == [("area", "k", "g")]


async def test_live_state_and_all_live_states(hass) -> None:
    hass.data[DOMAIN] = {}
    set_last_matched(hass, "area", "k", "g", None)
    set_last_applied_scene(hass, "area", "k", "g", 3)

    assert live_state(hass, "area", "k", "g") == (None, 3)
    assert {
        "scope_kind": "area",
        "scope_id": "k",
        "category": "g",
        "matched": None,
        "applied": 3,
    } in all_live_states(hass)


async def test_clear_live_state_drops_a_scopes_entries(hass) -> None:
    hass.data[DOMAIN] = {}
    set_last_matched(hass, "area", "k", "g", 1)
    set_last_applied_scene(hass, "area", "k", "g", 1)
    set_last_matched(hass, "area", "other", "g", 1)

    clear_live_state(hass, "area", "k")

    assert live_state(hass, "area", "k", "g") == (None, None)
    assert get_last_matched(hass, "area", "other", "g") == 1
