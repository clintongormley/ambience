"""TemplateMatcher — evaluate a Jinja2 template (against HA state) to a boolean.

The lightweight sibling of `script`: same collect-all-scopes + pure-lookup
shape, but renders Jinja instead of calling a service, and keeps no TTL cache.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.matchers.template import (
    TemplateMatcher,
    TemplateSnapshot,
)


class _StoreStub:
    """Minimal store stub exposing area/floor/house scopes for the collector."""

    def __init__(
        self,
        areas: dict[str, dict] | None = None,
        floors: dict[str, dict] | None = None,
        house: dict | None = None,
    ) -> None:
        self._areas = areas or {}
        self._floors = floors or {}
        self._house = house or {}

    def all_scope_configs(self) -> list[tuple[str, str | None, dict]]:
        return [
            *(("area", aid, cfg) for aid, cfg in self._areas.items()),
            *(("floor", fid, cfg) for fid, cfg in self._floors.items()),
            ("house", None, self._house),
        ]


def _install_store(
    hass: HomeAssistant,
    areas: dict[str, dict] | None = None,
    floors: dict[str, dict] | None = None,
    house: dict | None = None,
) -> None:
    hass.data.setdefault(DOMAIN, {})[DATA_STORE] = _StoreStub(areas, floors, house)


# --- protocol fields -------------------------------------------------------


def test_protocol_fields() -> None:
    m = TemplateMatcher()
    assert m.name == "template"
    assert m.input == "template_predicate"
    assert m.priority == 30
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


# --- validation ------------------------------------------------------------


def test_validate_predicate_accepts_null() -> None:
    TemplateMatcher().validate_predicate(None)


def test_validate_predicate_accepts_well_formed(hass: HomeAssistant) -> None:
    TemplateMatcher(hass=hass).validate_predicate({"template": "{{ true }}"})


@pytest.mark.parametrize(
    "bad",
    [
        42,
        "{{ true }}",  # bare string, not a dict
        [],
        {},  # missing template
        {"template": ""},  # empty
        {"template": "   "},  # whitespace only
        {"template": 5},  # not a string
    ],
)
def test_validate_predicate_rejects_bad(bad: object) -> None:
    with pytest.raises(ValueError):
        TemplateMatcher().validate_predicate(bad)


def test_validate_predicate_rejects_invalid_jinja(hass: HomeAssistant) -> None:
    with pytest.raises(ValueError):
        TemplateMatcher(hass=hass).validate_predicate({"template": "{{ 1 + }}"})


# --- order_key / describe --------------------------------------------------


def test_order_key_returns_template_string() -> None:
    assert TemplateMatcher().order_key({"template": "{{ x }}"}) == "{{ x }}"
    assert TemplateMatcher().order_key(None) == ""
    assert TemplateMatcher().order_key("nonsense") == ""


def test_describe_returns_none() -> None:
    assert TemplateMatcher().describe(object()) is None


# --- matches (pure lookup) -------------------------------------------------


def test_matches_null_predicate_is_wildcard() -> None:
    assert TemplateMatcher().matches(None, TemplateSnapshot()) is True


def test_matches_returns_true_when_snapshot_says_so() -> None:
    snap = TemplateSnapshot(results={"{{ a }}": True})
    assert TemplateMatcher().matches({"template": "{{ a }}"}, snap) is True


def test_matches_returns_false_when_snapshot_says_so() -> None:
    snap = TemplateSnapshot(results={"{{ a }}": False})
    assert TemplateMatcher().matches({"template": "{{ a }}"}, snap) is False


def test_matches_returns_false_on_cache_miss() -> None:
    assert TemplateMatcher().matches({"template": "{{ never }}"}, TemplateSnapshot()) is False


def test_matches_returns_false_on_malformed_predicate() -> None:
    snap = TemplateSnapshot()
    assert TemplateMatcher().matches("nope", snap) is False
    assert TemplateMatcher().matches({}, snap) is False
    assert TemplateMatcher().matches({"template": 42}, snap) is False


# --- snapshot: collection across scopes (script-bug regression guard) ------


async def test_snapshot_collects_from_area_floor_and_house(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        areas={"kitchen": {"rules": [{"when": {"template": {"template": "{{ true }}"}}}]}},
        floors={"f1": {"rules": [{"when": {"template": {"template": "{{ false }}"}}}]}},
        house={"rules": [{"when": {"template": {"template": "{{ 1 == 1 }}"}}}]},
    )
    snap = await TemplateMatcher(hass=hass).snapshot(hass)
    assert snap.results["{{ true }}"] is True
    assert snap.results["{{ false }}"] is False
    assert snap.results["{{ 1 == 1 }}"] is True


# --- snapshot: truthiness (result_as_boolean) ------------------------------


@pytest.mark.parametrize(
    ("tmpl", "expected"),
    [
        ("{{ true }}", True),
        ("{{ false }}", False),
        ("{{ 'on' }}", True),
        ("{{ 'off' }}", False),
        ("{{ 'yes' }}", True),
        ("{{ 1 }}", True),
        ("{{ 0 }}", False),
        ("{{ 'unknown' }}", False),
        ("{{ '' }}", False),
    ],
)
async def test_snapshot_truthiness(hass: HomeAssistant, tmpl: str, expected: bool) -> None:
    _install_store(hass, areas={"a": {"rules": [{"when": {"template": {"template": tmpl}}}]}})
    snap = await TemplateMatcher(hass=hass).snapshot(hass)
    assert snap.results[tmpl] is expected


async def test_snapshot_renders_against_current_state(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.lux", "42")
    tmpl = "{{ states('sensor.lux') | int < 50 }}"
    _install_store(hass, areas={"a": {"rules": [{"when": {"template": {"template": tmpl}}}]}})
    snap = await TemplateMatcher(hass=hass).snapshot(hass)
    assert snap.results[tmpl] is True


async def test_snapshot_render_error_records_false(hass: HomeAssistant, caplog) -> None:
    tmpl = "{{ 1 / 0 }}"
    _install_store(hass, areas={"a": {"rules": [{"when": {"template": {"template": tmpl}}}]}})
    snap = await TemplateMatcher(hass=hass).snapshot(hass)
    assert snap.results[tmpl] is False
    assert "template" in caplog.text.lower()


async def test_snapshot_dedups_identical_templates(hass: HomeAssistant) -> None:
    tmpl = "{{ true }}"
    _install_store(
        hass,
        areas={
            "a": {"rules": [{"when": {"template": {"template": tmpl}}}]},
            "b": {"rules": [{"when": {"template": {"template": tmpl}}}]},
        },
    )
    snap = await TemplateMatcher(hass=hass).snapshot(hass)
    assert snap.results == {tmpl: True}


async def test_snapshot_empty_when_no_template_predicates(hass: HomeAssistant) -> None:
    _install_store(hass, areas={"a": {"rules": [{"when": {"state": {"x": 1}}}]}})
    snap = await TemplateMatcher(hass=hass).snapshot(hass)
    assert snap.results == {}


async def test_snapshot_skips_malformed_predicates(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        areas={
            "a": {
                "rules": [
                    {"when": {"template": "not a dict"}},
                    {"when": {"template": {"template": 42}}},
                    {"when": {"template": {"template": "{{ true }}"}}},
                ]
            }
        },
    )
    snap = await TemplateMatcher(hass=hass).snapshot(hass)
    assert snap.results == {"{{ true }}": True}


async def test_snapshot_no_store_is_empty(hass: HomeAssistant) -> None:
    # No store installed under DOMAIN — matcher must not blow up.
    snap = await TemplateMatcher(hass=hass).snapshot(hass)
    assert snap.results == {}


# --- trigger seam: dependency capture via RenderInfo -----------------------


async def test_snapshot_captures_entity_dependencies(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.lux", "10")
    tmpl = "{{ states('sensor.lux') | int < 50 }}"
    _install_store(hass, areas={"a": {"rules": [{"when": {"template": {"template": tmpl}}}]}})
    snap = await TemplateMatcher(hass=hass).snapshot(hass)
    assert "sensor.lux" in snap.deps[tmpl].entities
