"""The tolerant hass.data accessors in const.py."""

from __future__ import annotations

from types import SimpleNamespace

from custom_components.ambience.const import (
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
    get_store,
    get_switch,
    get_switches,
)


def test_get_switches_is_empty_before_setup_and_after_unload(hass) -> None:
    assert get_switches(hass) == {}
    hass.data[DOMAIN] = {}
    assert get_switches(hass) == {}


def test_get_switch_reads_the_live_entity_by_scope_key(hass) -> None:
    switch = SimpleNamespace(is_on=True)
    hass.data[DOMAIN] = {DATA_SWITCHES: {("area", "a"): switch}}
    assert get_switch(hass, "area", "a") is switch
    assert get_switch(hass, "area", "b") is None
    assert get_switch(hass, "house", None) is None


def test_get_store_is_none_before_setup(hass) -> None:
    assert get_store(hass) is None
    hass.data[DOMAIN] = {DATA_STORE: "store"}
    assert get_store(hass) == "store"
