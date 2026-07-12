"""The entity catalog: the registry walk both AI exports share, plus the summary
and search that keep the MCP context bounded.

`ai_bundle` (the download-and-paste export) needs the full rows, because the AI
on the other end has no tools. `ai_context` (the MCP export) needs only the
counts, and serves rows a page at a time through `find_entities`. Both read the
same rows from here, so there is one registry walk and one redaction rule in the
codebase, not two.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import REDACTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from .redact import PRESENCE_PREFIXES


def _entity_area_id(entry: er.RegistryEntry, dev_reg: dr.DeviceRegistry) -> str | None:
    """An entity's area is its own override if set, else its device's area —
    the same precedence HA uses, so an AI placing a scene action against the
    entity targets the room the user sees it in."""
    if entry.area_id is not None:
        return entry.area_id
    if entry.device_id is not None:
        device = dev_reg.async_get(entry.device_id)
        if device is not None:
            return device.area_id
    return None


def entity_rows(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Every registered entity with the facts an AI needs to author actions and
    state/occupancy/lux conditions: its area, domain, device_class and current
    state. Disabled/hidden entities are skipped — a scene cannot act on them."""
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    out: list[dict[str, Any]] = []
    for entry in ent_reg.entities.values():
        if entry.disabled or entry.hidden:
            continue
        state = hass.states.get(entry.entity_id)
        # A person/device_tracker entity's STATE is its current location — redact
        # it, mirroring how diagnostics scrubs presence PII. Its id and friendly
        # name are kept on purpose (the AI needs the id to author people
        # conditions), so a household member's name/slug (e.g. `person.alice`) IS
        # present in the export. This is also prefix-based, not capability-based:
        # an exotic state-as-PII sensor (e.g. a geocoded-location sensor) isn't
        # caught. These exports are deliberate, user-initiated local exports, so
        # these residual person-identifier surfaces are an accepted trade-off,
        # documented in the AI-authoring docs, not an unflagged leak.
        if entry.entity_id.startswith(PRESENCE_PREFIXES):
            state_value: str | None = REDACTED
        else:
            state_value = state.state if state is not None else None
        out.append(
            {
                "entity_id": entry.entity_id,
                "name": entry.name or entry.original_name,
                "domain": entry.domain,
                "device_class": entry.device_class or entry.original_device_class,
                "area_id": _entity_area_id(entry, dev_reg),
                "state": state_value,
            }
        )
    return sorted(out, key=lambda e: e["entity_id"])


def entity_summary(rows: list[dict[str, Any]]) -> dict[str, Any]:
    """Counts, not rows — what the MCP context carries in place of the catalog.

    This is the model's *discovery* mechanism: it is how an AI learns the house
    has five illuminance sensors without being handed 1,534 entities. Size is
    O(domains + areas + device_classes), so it stays small at any house size.

    An entity with no area (or no device class) is absent from that map but still
    counted in `total` and `by_domain`, so the counts never lie about the whole.
    `by_device_class` keys are domain-qualified (`sensor.occupancy` vs
    `binary_sensor.occupancy`) because those are different things.
    """
    by_domain: dict[str, int] = {}
    by_area: dict[str, int] = {}
    by_device_class: dict[str, int] = {}
    for row in rows:
        domain = row["domain"]
        by_domain[domain] = by_domain.get(domain, 0) + 1
        area_id = row["area_id"]
        if area_id is not None:
            by_area[area_id] = by_area.get(area_id, 0) + 1
        device_class = row["device_class"]
        if device_class is not None:
            key = f"{domain}.{device_class}"
            by_device_class[key] = by_device_class.get(key, 0) + 1
    return {
        "total": len(rows),
        "by_domain": by_domain,
        "by_area": by_area,
        "by_device_class": by_device_class,
    }


FIND_LIMIT_DEFAULT = 50
FIND_LIMIT_MAX = 200
"""Page size for `find_entities`. An out-of-range `limit` is CLAMPED, never
rejected: a model that asks for 10,000 rows should get the biggest page we are
willing to serve plus a cursor, not an error it has to reason its way out of."""


def _as_set(value: Any) -> set[str] | None:
    """A filter argument as a set, accepting a bare string or a list. None means
    "no filter" — distinct from an empty list, which matches nothing."""
    if value is None:
        return None
    if isinstance(value, str):
        return {value}
    return set(value)


def _split_device_classes(classes: set[str]) -> tuple[set[str], set[tuple[str, str]]]:
    """Split a `device_class` filter into bare class names and (domain,
    device_class) pairs, so a caller can pass either form back.

    `entity_summary`'s `by_device_class` keys are domain-qualified
    (`"sensor.illuminance"`), because `sensor.occupancy` and
    `binary_sensor.occupancy` are different things. A value containing a `.` is
    that qualified form: split it and require BOTH the domain and the device
    class to match. A value with no `.` is the bare form (`"illuminance"`): it
    matches the device class alone, regardless of domain. `find_entities`
    accepts both, so a key read straight from `entity_summary` can be passed
    back unchanged.
    """
    bare: set[str] = set()
    qualified: set[tuple[str, str]] = set()
    for value in classes:
        if "." in value:
            domain, cls = value.split(".", 1)
            qualified.add((domain, cls))
        else:
            bare.add(value)
    return bare, qualified


def find_entities(
    rows: list[dict[str, Any]],
    *,
    query: str | None = None,
    domain: str | list[str] | None = None,
    area_id: str | list[str] | None = None,
    device_class: str | list[str] | None = None,
    limit: int | None = None,
    cursor: int | None = None,
) -> dict[str, Any]:
    """Search the catalog, one bounded page at a time.

    This is what makes a bounded context honest: the MCP export carries counts
    rather than rows, but every entity stays REACHABLE through here. Curation was
    rejected precisely because no static filter is sound — a `state` condition can
    name any entity in the house, and exposing a new action can make a previously
    irrelevant domain relevant — so nothing is hidden, it is merely paged.

    Filters combine with AND. `cursor` is an integer offset into the matches,
    which is stable because `rows` is sorted by `entity_id`.

    `device_class` accepts either form `entity_summary`'s `by_device_class` uses:
    domain-qualified (`"sensor.illuminance"`) or bare (`"illuminance"`). This is
    deliberate — the summary is the model's discovery mechanism, and its keys are
    domain-qualified so `sensor.occupancy` and `binary_sensor.occupancy` don't
    collide, so a key read from the summary must round-trip straight back into
    this filter without the model having to strip the domain off first.
    """
    domains = _as_set(domain)
    areas = _as_set(area_id)
    classes = _as_set(device_class)
    bare_classes, qualified_classes = (
        _split_device_classes(classes) if classes is not None else (set(), set())
    )
    needle = query.casefold() if query else None

    matches = [
        row
        for row in rows
        if (domains is None or row["domain"] in domains)
        and (areas is None or row["area_id"] in areas)
        and (
            classes is None
            or row["device_class"] in bare_classes
            or (row["domain"], row["device_class"]) in qualified_classes
        )
        and (
            needle is None
            or needle in row["entity_id"].casefold()
            or (row["name"] is not None and needle in row["name"].casefold())
        )
    ]

    size = FIND_LIMIT_DEFAULT if limit is None else max(1, min(int(limit), FIND_LIMIT_MAX))
    offset = max(0, int(cursor or 0))
    page = matches[offset : offset + size]
    next_offset = offset + len(page)
    more = next_offset < len(matches)
    return {
        "entities": page,
        "total_matches": len(matches),
        "offset": offset,
        "returned": len(page),
        "cursor": next_offset if more else None,
        "truncated": more,
    }
