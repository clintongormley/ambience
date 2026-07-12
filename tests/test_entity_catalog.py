"""The entity catalog: the registry walk both AI exports share, plus the summary
and search that keep the MCP context bounded."""

from __future__ import annotations

from homeassistant.components.diagnostics import REDACTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er

from custom_components.ambience.entity_catalog import (
    FIND_LIMIT_MAX,
    entity_rows,
    entity_summary,
    find_entities,
)


async def test_entity_rows_carry_area_domain_and_state(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get_or_create("light", "ambience", "lamp1", suggested_object_id="lamp")
    ent_reg.async_update_entity(entry.entity_id, area_id=area.id)
    hass.states.async_set(entry.entity_id, "on", {"friendly_name": "Lamp"})

    rows = entity_rows(hass)

    lamp = next(r for r in rows if r["entity_id"] == entry.entity_id)
    assert lamp["domain"] == "light"
    assert lamp["area_id"] == area.id
    assert lamp["state"] == "on"


async def test_entity_rows_are_sorted_by_entity_id(hass: HomeAssistant) -> None:
    ent_reg = er.async_get(hass)
    for object_id in ("zulu", "alpha", "mike"):
        ent_reg.async_get_or_create("light", "ambience", object_id, suggested_object_id=object_id)

    rows = entity_rows(hass)

    ids = [r["entity_id"] for r in rows]
    assert ids == sorted(ids)


async def test_entity_rows_skip_disabled_and_hidden(hass: HomeAssistant) -> None:
    ent_reg = er.async_get(hass)
    disabled = ent_reg.async_get_or_create(
        "light",
        "ambience",
        "off1",
        suggested_object_id="disabled",
        disabled_by=er.RegistryEntryDisabler.USER,
    )
    hidden = ent_reg.async_get_or_create(
        "light",
        "ambience",
        "hid1",
        suggested_object_id="hidden",
        hidden_by=er.RegistryEntryHider.USER,
    )

    ids = {r["entity_id"] for r in entity_rows(hass)}

    assert disabled.entity_id not in ids
    assert hidden.entity_id not in ids


async def test_entity_rows_redact_presence_state(hass: HomeAssistant) -> None:
    ent_reg = er.async_get(hass)
    person = ent_reg.async_get_or_create("person", "ambience", "alice", suggested_object_id="alice")
    hass.states.async_set(person.entity_id, "home")

    row = next(r for r in entity_rows(hass) if r["entity_id"] == person.entity_id)

    assert row["state"] == REDACTED


def _row(entity_id, *, domain, area_id=None, device_class=None):
    return {
        "entity_id": entity_id,
        "name": entity_id,
        "domain": domain,
        "device_class": device_class,
        "area_id": area_id,
        "state": "on",
    }


def test_entity_summary_counts_by_domain_area_and_device_class() -> None:
    rows = [
        _row("light.a", domain="light", area_id="kitchen"),
        _row("light.b", domain="light", area_id="kitchen"),
        _row("sensor.lux", domain="sensor", area_id="hall", device_class="illuminance"),
        _row("binary_sensor.occ", domain="binary_sensor", area_id="hall", device_class="occupancy"),
    ]

    summary = entity_summary(rows)

    assert summary["total"] == 4
    assert summary["by_domain"] == {"light": 2, "sensor": 1, "binary_sensor": 1}
    assert summary["by_area"] == {"kitchen": 2, "hall": 2}
    assert summary["by_device_class"] == {
        "sensor.illuminance": 1,
        "binary_sensor.occupancy": 1,
    }


def test_entity_summary_device_class_keys_are_domain_qualified() -> None:
    # `sensor.occupancy` and `binary_sensor.occupancy` are different things and
    # must not collide into one count.
    rows = [
        _row("binary_sensor.a", domain="binary_sensor", device_class="occupancy"),
        _row("sensor.b", domain="sensor", device_class="occupancy"),
    ]

    assert entity_summary(rows)["by_device_class"] == {
        "binary_sensor.occupancy": 1,
        "sensor.occupancy": 1,
    }


def test_entity_summary_omits_missing_area_and_device_class_but_still_counts_them() -> None:
    rows = [_row("light.orphan", domain="light")]  # no area, no device_class

    summary = entity_summary(rows)

    assert summary["total"] == 1
    assert summary["by_domain"] == {"light": 1}
    assert summary["by_area"] == {}
    assert summary["by_device_class"] == {}


def test_entity_summary_of_empty_catalog() -> None:
    assert entity_summary([]) == {
        "total": 0,
        "by_domain": {},
        "by_area": {},
        "by_device_class": {},
    }


def _catalog():
    return [
        _row(
            "binary_sensor.hall_motion",
            domain="binary_sensor",
            area_id="hall",
            device_class="occupancy",
        ),
        _row("light.kitchen_ceiling", domain="light", area_id="kitchen"),
        _row("light.kitchen_spots", domain="light", area_id="kitchen"),
        _row("sensor.hall_lux", domain="sensor", area_id="hall", device_class="illuminance"),
        _row("switch.kettle", domain="switch", area_id="kitchen"),
    ]


def test_find_with_no_filters_returns_everything() -> None:
    result = find_entities(_catalog())

    assert result["total_matches"] == 5
    assert result["returned"] == 5
    assert result["offset"] == 0
    assert result["cursor"] is None
    assert result["truncated"] is False


def test_find_filters_by_domain() -> None:
    result = find_entities(_catalog(), domain="light")

    assert [e["entity_id"] for e in result["entities"]] == [
        "light.kitchen_ceiling",
        "light.kitchen_spots",
    ]
    assert result["total_matches"] == 2


def test_find_accepts_a_list_of_domains() -> None:
    result = find_entities(_catalog(), domain=["light", "switch"])

    assert result["total_matches"] == 3


def test_find_filters_combine_with_and() -> None:
    result = find_entities(_catalog(), domain="light", area_id="kitchen")
    assert result["total_matches"] == 2

    # A domain that exists and an area that exists, but no entity in both.
    result = find_entities(_catalog(), domain="light", area_id="hall")
    assert result["total_matches"] == 0


def test_find_filters_by_device_class() -> None:
    result = find_entities(_catalog(), device_class="illuminance")

    assert [e["entity_id"] for e in result["entities"]] == ["sensor.hall_lux"]


def test_find_filters_by_domain_qualified_device_class() -> None:
    # entity_summary's own by_device_class keys are domain-qualified
    # (`"sensor.illuminance"`); find_entities must accept that form directly, since
    # the guide tells the model to hand this key straight back.
    result = find_entities(_catalog(), device_class="sensor.illuminance")

    assert [e["entity_id"] for e in result["entities"]] == ["sensor.hall_lux"]
    assert result["total_matches"] == 1


def test_find_domain_qualified_device_class_does_not_cross_domains() -> None:
    rows = [
        _row("sensor.occ", domain="sensor", device_class="occupancy"),
        _row("binary_sensor.occ", domain="binary_sensor", device_class="occupancy"),
    ]

    result = find_entities(rows, device_class="binary_sensor.occupancy")

    assert [e["entity_id"] for e in result["entities"]] == ["binary_sensor.occ"]
    assert result["total_matches"] == 1


def test_find_domain_qualified_device_class_combines_with_an_explicit_domain_filter() -> None:
    # A qualified device_class already pins the domain; an explicit domain= that
    # disagrees must still AND against it, matching nothing.
    result = find_entities(_catalog(), device_class="sensor.illuminance", domain="light")

    assert result["total_matches"] == 0


def test_find_device_class_round_trips_every_summary_key() -> None:
    # The real fix: every key entity_summary hands back must find exactly the rows
    # that were counted under it, across several device classes and domains.
    rows = [
        _row("sensor.lux1", domain="sensor", device_class="illuminance"),
        _row("sensor.lux2", domain="sensor", device_class="illuminance"),
        _row("sensor.occ1", domain="sensor", device_class="occupancy"),
        _row("binary_sensor.occ1", domain="binary_sensor", device_class="occupancy"),
        _row("binary_sensor.occ2", domain="binary_sensor", device_class="occupancy"),
        _row("binary_sensor.occ3", domain="binary_sensor", device_class="occupancy"),
        _row("climate.thermo", domain="climate", device_class="thermostat"),
        _row("light.plain", domain="light"),  # no device_class — not counted
    ]

    summary = entity_summary(rows)

    for key, count in summary["by_device_class"].items():
        assert find_entities(rows, device_class=key)["total_matches"] == count


def test_find_query_matches_entity_id_case_insensitively() -> None:
    result = find_entities(_catalog(), query="KITCHEN")

    assert result["total_matches"] == 2  # light.kitchen_ceiling and light.kitchen_spots


def test_find_query_matches_the_name_too() -> None:
    rows = [_row("light.abc123", domain="light")]
    rows[0]["name"] = "Reading Lamp"

    assert find_entities(rows, query="reading")["total_matches"] == 1


def test_find_query_tolerates_a_null_name() -> None:
    rows = [_row("light.abc123", domain="light")]
    rows[0]["name"] = None

    assert find_entities(rows, query="abc")["total_matches"] == 1
    assert find_entities(rows, query="nope")["total_matches"] == 0


def test_find_unknown_filter_value_is_empty_not_an_error() -> None:
    result = find_entities(_catalog(), domain="nonexistent")

    assert result["entities"] == []
    assert result["total_matches"] == 0
    assert result["cursor"] is None


def test_find_pages_with_a_cursor() -> None:
    first = find_entities(_catalog(), limit=2)

    assert first["returned"] == 2
    assert first["offset"] == 0
    assert first["cursor"] == 2
    assert first["truncated"] is True

    second = find_entities(_catalog(), limit=2, cursor=first["cursor"])

    assert second["offset"] == 2
    assert second["cursor"] == 4


def test_paging_the_whole_catalog_yields_every_entity_exactly_once() -> None:
    rows = _catalog()
    seen: list[str] = []
    cursor = None
    while True:
        page = find_entities(rows, limit=2, cursor=cursor)
        seen.extend(e["entity_id"] for e in page["entities"])
        cursor = page["cursor"]
        if cursor is None:
            break

    assert seen == [r["entity_id"] for r in rows]  # no gaps, no duplicates


def test_find_clamps_an_oversized_limit_rather_than_erroring() -> None:
    rows = [_row(f"light.l{i:03d}", domain="light") for i in range(FIND_LIMIT_MAX + 50)]

    result = find_entities(rows, limit=10_000)

    assert result["returned"] == FIND_LIMIT_MAX
    assert result["truncated"] is True


def test_find_clamps_a_nonsense_limit_up_to_one() -> None:
    result = find_entities(_catalog(), limit=0)

    assert result["returned"] == 1


def test_find_cursor_past_the_end_is_empty_not_an_error() -> None:
    result = find_entities(_catalog(), cursor=999)

    assert result["entities"] == []
    assert result["cursor"] is None
    assert result["truncated"] is False
