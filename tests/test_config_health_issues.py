"""Tests for the config-health Repairs reconciler."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import issue_registry as ir

from custom_components.ambience.config_health_issues import reconcile_issues
from custom_components.ambience.const import DATA_STORE, DOMAIN


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry) -> Any:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


@pytest.fixture
def area_id(hass: HomeAssistant) -> str:
    return ar.async_get(hass).async_create("Living Room").id


def _domain_issue_ids(hass: HomeAssistant) -> set[str]:
    return {iid for (dom, iid) in ir.async_get(hass).issues if dom == DOMAIN}


async def test_reconcile_creates_issue_for_missing_entity(hass, installed, area_id) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "ghost",
                    "when": {},
                    "category": "c1",
                    "actions": [{"service": "light.turn_on", "entity_ids": ["light.ghost"]}],
                }
            ]
        },
    )
    reconcile_issues(hass)
    issues = ir.async_get(hass).issues
    iid = next(i for (dom, i) in issues if dom == DOMAIN and i.startswith("missing_entity:"))
    issue = issues[(DOMAIN, iid)]
    # Lock the translation contract so a key/placeholder rename can't silently drift.
    assert issue.translation_key == "missing_entity"
    assert issue.translation_placeholders == {"entity_id": "light.ghost", "scenes": "ghost"}


async def test_reconcile_clears_issue_when_entity_appears(hass, installed, area_id) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "ghost",
                    "when": {},
                    "category": "c1",
                    "actions": [{"service": "light.turn_on", "entity_ids": ["light.ghost"]}],
                }
            ]
        },
    )
    reconcile_issues(hass)
    assert _domain_issue_ids(hass)
    hass.states.async_set("light.ghost", "on")
    reconcile_issues(hass)
    assert _domain_issue_ids(hass) == set()


async def test_reconcile_is_idempotent(hass, installed, area_id) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "ghost",
                    "when": {},
                    "category": "c1",
                    "actions": [{"service": "light.turn_on", "entity_ids": ["light.ghost"]}],
                }
            ]
        },
    )
    reconcile_issues(hass)
    first = _domain_issue_ids(hass)
    reconcile_issues(hass)
    assert _domain_issue_ids(hass) == first


async def test_reconcile_creates_overlap_issue(hass, installed, area_id) -> None:
    hass.states.async_set("light.shared", "on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "a",
                    "when": {},
                    "category": "cat1",
                    "actions": [{"service": "light.turn_on", "entity_ids": ["light.shared"]}],
                },
                {
                    "name": "b",
                    "when": {},
                    "category": "cat2",
                    "actions": [{"service": "light.turn_off", "entity_ids": ["light.shared"]}],
                },
            ]
        },
    )
    reconcile_issues(hass)
    assert "action_overlap:light.shared" in _domain_issue_ids(hass)


async def test_reconcile_leaves_foreign_domain_issues_untouched(hass, installed, area_id) -> None:
    """A Repairs issue under DOMAIN with an id not owned by config-health must
    not be deleted by the reconcile delete-pass."""
    ir.async_create_issue(
        hass,
        DOMAIN,
        "some_other_issue",
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="some_other_issue",
    )
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "ghost",
                    "when": {},
                    "category": "c1",
                    "actions": [{"service": "light.turn_on", "entity_ids": ["light.ghost"]}],
                }
            ]
        },
    )
    reconcile_issues(hass)
    assert "some_other_issue" in _domain_issue_ids(hass)  # not deleted
    assert any(iid.startswith("missing_entity:") for iid in _domain_issue_ids(hass))


async def test_reconcile_noops_when_domain_data_missing(hass, installed) -> None:
    """reconcile_issues must not raise when hass.data[DOMAIN] has been removed
    (e.g. during the unload race)."""
    hass.data.pop(DOMAIN, None)
    reconcile_issues(hass)  # must not raise
