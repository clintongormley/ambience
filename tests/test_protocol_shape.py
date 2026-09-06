"""The shape-drift gate for MCP protocol 1.

The MCP server ships a FROZEN adapter per protocol and loads the one the backend
names in `ambience/mcp/hello`. That is only safe if MCP_PROTOCOL is bumped whenever
a payload's SHAPE changes — otherwise the v1 adapter silently receives a v2 payload.

So the shape is pinned. Change a key and this test fails, telling you to bump the
protocol and add an adapter, or revert. Values are NOT pinned (they vary per house);
only the structure is.

Pinned payloads: `ai_context`, `entities_find`, `traces_list` (read per-protocol by
ProtocolV1) and `scope_get`, `categories_list` (read by every protocol via
BaseProtocol.get_scope/list_categories, and again inline inside preview_write — the
diff's baseline and its known-category gate). A rename in either of those last two
would make preview_write's diff show every scene as freshly `added`
(`current = []`, the defensive fallback for a shape it can't read) while apply_write
still replaces the whole scope — a human approving a change they cannot see, which
is exactly the failure this gate exists to prevent.

Deliberately NOT pinned: `ambience/ai_guide`. `BaseProtocol.get_guide` reads it too,
but its payload is versioned prose (schema/cookbook text for the model to read), not
structured data the diff/consent surface depends on — a wording change there is not
the kind of silent-misread risk this gate is for.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.ai_context import build_ai_context
from custom_components.ambience.builtin_services import async_register_builtin_services
from custom_components.ambience.const import (
    DATA_STORE,
    DATA_TRACE_BUFFER,
    DOMAIN,
    MCP_PROTOCOL,
)
from custom_components.ambience.engine import Explanation, PredicateResult, SceneEval
from custom_components.ambience.entity_catalog import entity_rows, find_entities
from custom_components.ambience.store import AmbienceStore
from custom_components.ambience.trace import (
    CauseKind,
    Outcome,
    TraceEvent,
    TriggerCause,
    UnitTrace,
)

GOLDEN = Path(__file__).parent / "fixtures" / "protocol_1_shapes.json"

_DRIFT = (
    "The protocol-{protocol} `{payload}` payload shape changed.\n"
    "  added:   {added}\n"
    "  removed: {removed}\n\n"
    "The ambience-mcp package ships a FROZEN adapter per protocol; a v1 adapter "
    "cannot read a v2 payload.\n"
    "Either revert the shape change, or:\n"
    "  1. bump MCP_PROTOCOL in custom_components/ambience/const.py\n"
    "  2. add mcp-server/src/ambience_mcp/protocols/v<new>.py\n"
    "  3. re-record tests/fixtures/protocol_1_shapes.json for the new protocol\n"
    "  4. publish the MCP server BEFORE the integration (bin/release.sh gate 2)"
)


# Dicts whose KEYS are data, not structure: an area id, a domain, a service id, a
# service field name. Their keys are collapsed to `*`, so the sub-shape underneath
# stays pinned (a rename of `scene_count` still fails the gate) while the key itself
# does not. Without this, seeding one more area into the fixture reads as "the
# protocol-1 shape changed" — a false alarm that trains a maintainer to re-record the
# golden without reading it, which is exactly how a REAL drift gets waved through.
#
# Wildcarding does NOT lose the empty-branch protection the `seeded` fixture exists
# for: an empty dict still contributes only its container key, so a branch with no
# `.*` under it is still visibly unpopulated.
_VALUE_KEYED = frozenset(
    {
        # keyed by area id / domain / "<domain>.<device_class>"
        "catalog.entity_summary.by_area",
        "catalog.entity_summary.by_domain",
        "catalog.entity_summary.by_device_class",
        # keyed by area id / floor id
        "config.areas",
        "config.floors",
        # keyed by the user's own definition names
        "config.conditions.lux.custom",
        "config.conditions.time_of_day.custom",
        "definitions.lux_ranges.custom",
        "definitions.periods.custom",
        # keyed by exposed-action service id, then by that service's field names —
        # the user's config and HA's services.yaml, not our payload structure
        "actions.schemas",
        "actions.schemas.*.fields",
        # keyed by the dispatched action's own service field names
        "traces[].actions[].params",
        # keyed by the stored scene action's own service field names
        "scenes[].actions[].params",
    }
)

# Branches whose INSIDE is not ours at all: we pin the key and stop.
#
# A field's `selector` is HA's own vocabulary, copied verbatim out of a services.yaml
# (`number: {min, max, step, unit_of_measurement}`, `select: {options, multiple,
# custom_value, sort}`, `entity: {filter: [{domain}]}`, ...). The MCP never reads
# inside one — it hands the schema to the model as-is — so nothing in there is part of
# the protocol contract, and every selector kind has a different body.
#
# Wildcarding the selector TYPE (as `_VALUE_KEYED` did) is not enough, and that is the
# point: it collapses the type key but still descends into the body, so adding an
# ordinary `select` field to services.yaml adds `...selector.*.options`/`.multiple`/
# `.custom_value`/`.sort` — and an `entity` filter adds a whole `...selector.*.*[]`
# branch — each of which the gate would report as protocol-1 drift and demand an
# MCP_PROTOCOL bump plus a v2 adapter FOR ADDING A SERVICE FIELD. services.yaml grows;
# a gate that cries wolf there is a gate maintainers learn to re-record blindly.
#
# The `selector` key itself stays pinned, so renaming or dropping it is still caught.
_OPAQUE = frozenset({"actions.schemas.*.fields.*.selector"})


def shape_of(value: Any, prefix: str = "") -> set[str]:
    """Every key path in a payload, ignoring values and list length.

    A list contributes the union of its items' shapes, so a house with two lights
    and a house with two hundred produce the same shape. A dict listed in
    `_VALUE_KEYED` contributes the union of its VALUES' shapes under a single `*`
    key, for the same reason. A path in `_OPAQUE` contributes nothing below itself.
    """
    paths: set[str] = set()
    if prefix in _OPAQUE:
        return paths  # the key is pinned by our caller; its contents are HA's, not ours
    if isinstance(value, dict):
        value_keyed = prefix in _VALUE_KEYED
        for key, sub in value.items():
            name = "*" if value_keyed else key
            path = f"{prefix}.{name}" if prefix else name
            paths.add(path)
            paths |= shape_of(sub, path)
    elif isinstance(value, list):
        for item in value:
            paths |= shape_of(item, f"{prefix}[]")
    return paths


def assert_shape(name: str, payload: Any) -> None:
    golden = json.loads(GOLDEN.read_text())
    assert golden["protocol"] == MCP_PROTOCOL, (
        f"MCP_PROTOCOL is {MCP_PROTOCOL} but the golden records "
        f"{golden['protocol']}. Re-record the golden for the new protocol."
    )
    expected = set(golden["shapes"][name])
    actual = shape_of(payload)
    if actual != expected:
        raise AssertionError(
            _DRIFT.format(
                protocol=MCP_PROTOCOL,
                payload=name,
                added=sorted(actual - expected) or "none",
                removed=sorted(expected - actual) or "none",
            )
        )


# --- the wildcards themselves: they must silence NOISE without silencing DRIFT -------
# A `_VALUE_KEYED`/`_OPAQUE` entry is a hole in the gate. Each one is here to stop a
# false alarm (fixture data, HA's services.yaml) from reading as a protocol change —
# and each one must still let a REAL rename through. These pin both halves, on a
# hand-built payload, so the gate's own reach is tested rather than assumed.
def _schema(field: dict[str, Any]) -> dict[str, Any]:
    """The `actions.schemas` branch of ai_context, with one service and one field."""
    return {
        "actions": {
            "schemas": {
                "light.turn_on": {
                    "name": "Turn on",
                    "fields": {"brightness_pct": field},
                    "target": {"entity": [{"domain": "light"}]},
                }
            }
        }
    }


_NUMBER_FIELD = {
    "name": "Brightness",
    "description": "0-100",
    "required": False,
    "selector": {"number": {"min": 0, "max": 100, "step": 1}},
}


def test_a_new_service_field_selector_is_not_protocol_drift():
    """MIN-1: the whole point of wildcarding this branch. `services.yaml` grows, and a
    new field's selector is HA's vocabulary, not our payload structure — a `select`
    (options/multiple/custom_value/sort) or an `entity` filter must NOT be reported as
    "the protocol-1 shape changed, bump MCP_PROTOCOL and write a v2 adapter".

    Wildcarding only the selector TYPE would not achieve this: the body keys would
    still be walked. Hence `_OPAQUE`.
    """
    number = shape_of(_schema(_NUMBER_FIELD))

    select = shape_of(
        _schema(
            {
                "name": "Effect",
                "description": "which effect",
                "required": False,
                "selector": {
                    "select": {
                        "options": [{"value": "a", "label": "A"}],
                        "multiple": False,
                        "custom_value": True,
                        "sort": True,
                    }
                },
            }
        )
    )
    entity = shape_of(
        _schema(
            {
                "name": "Target",
                "description": "which entity",
                "required": True,
                "selector": {"entity": {"filter": [{"domain": "light"}]}},
            }
        )
    )

    assert select == number
    assert entity == number
    # ...and the selector key itself is still pinned, so dropping it IS drift.
    assert "actions.schemas.*.fields.*.selector" in number


def test_a_rename_inside_a_wildcarded_branch_is_still_drift():
    """The other half: the wildcards must not blunt the gate. Each of these is a REAL
    protocol-1 break that the v1 adapter (and the model reading its output) would trip
    over, and each lives inside a branch some wildcard collapses."""
    baseline = shape_of(_schema(_NUMBER_FIELD))

    # `fields` -> `parameters`: the rename the enriched fixture exists to catch.
    renamed = _schema(_NUMBER_FIELD)
    schema = renamed["actions"]["schemas"]["light.turn_on"]
    schema["parameters"] = schema.pop("fields")
    assert shape_of(renamed) != baseline

    # A field's own keys are ours (we choose to forward name/description/required).
    dropped = _schema({**_NUMBER_FIELD, "mandatory": _NUMBER_FIELD["required"]})
    del dropped["actions"]["schemas"]["light.turn_on"]["fields"]["brightness_pct"]["required"]
    assert shape_of(dropped) != baseline

    # The `selector` key itself — opaque INSIDE, pinned as a key.
    no_selector = _schema({k: v for k, v in _NUMBER_FIELD.items() if k != "selector"})
    assert shape_of(no_selector) != baseline

    # And one level up: the service entry's own keys.
    no_target = _schema(_NUMBER_FIELD)
    del no_target["actions"]["schemas"]["light.turn_on"]["target"]
    assert shape_of(no_target) != baseline


@pytest.fixture
async def seeded(hass: HomeAssistant) -> AmbienceStore:
    """A house with enough real registry data that every branch of the payload
    comes out non-empty — an empty branch pins only its container key, so a
    rename inside it (e.g. `area_id` -> `id`) would produce zero diff and sail
    through the gate.

    The `living_room` SCOPE saved below is Ambience's own config concept, not an
    HA area-registry entry, so it does not by itself populate catalog.areas/
    floors — those need real area/floor-registry entries (mirrors the house
    pattern in test_ai_bundle.py / test_ai_context.py / test_entity_catalog.py).
    """
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area(
        "living_room",
        {"scenes": [{"category": "general", "actions": [{"service": "light.turn_on"}]}]},
    )
    hass.data[DOMAIN] = {DATA_STORE: store}

    # A real floor + area (catalog.areas[], catalog.floors[]) with an entity in
    # it (entity_summary.by_area) that carries a device_class
    # (entity_summary.by_device_class). Named distinctly from the "living_room"
    # SCOPE above — an HA area registry id and an Ambience scope key are
    # different namespaces, and giving them different names keeps that clear
    # when reading the recorded golden.
    floor = fr.async_get(hass).async_create("Upstairs")
    area_reg = ar.async_get(hass)
    area = area_reg.async_create("Kitchen")
    area_reg.async_update(area.id, floor_id=floor.floor_id)

    ent_reg = er.async_get(hass)
    lamp = ent_reg.async_get_or_create("light", "ambience", "l1", suggested_object_id="lamp")
    ent_reg.async_update_entity(lamp.entity_id, area_id=area.id)
    hass.states.async_set(lamp.entity_id, "on")

    motion = ent_reg.async_get_or_create(
        "binary_sensor",
        "ambience",
        "m1",
        suggested_object_id="motion",
        original_device_class="motion",
    )
    ent_reg.async_update_entity(motion.entity_id, area_id=area.id)
    hass.states.async_set(motion.entity_id, "off")

    # Register the real ambience.* built-in services (from the committed
    # services.yaml) so `actions.schemas` resolves to their real
    # {name, fields, target} shape. `async_load` above already seeds the
    # exposed actions with these ids (see DEFAULT_SEEDED_BUILTINS in store.py);
    # without the services actually being registered, get_service_schema()
    # can't find them and every schema comes back None.
    async_register_builtin_services(hass)

    return store


@pytest.fixture
async def traced(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    """A real install with ONE fully-populated trace in the ring buffer.

    Every optional field is filled — a cause with all five keys, a winner, dispatched
    actions with params, and an explanation carrying evaluated AND unevaluated scenes
    with predicates. A golden recorded from a thin trace (or worse, an empty list)
    would pin only `traces`, and `fit_traces`' `result.get("traces")` contract plus
    every key the MCP reads inside a record would be unguarded.
    """
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    explanation = Explanation(
        winner_index=1,
        scenes=[
            SceneEval(
                index=0,
                name="morning",
                predicates=[
                    PredicateResult(
                        condition_key="time_of_day",
                        passed=False,
                        detail="not morning",
                        entity_ids=("sun.sun",),
                    )
                ],
                matched=False,
                evaluated=True,
            ),
            SceneEval(
                index=1,
                name="evening",
                predicates=[
                    PredicateResult(
                        condition_key="lux",
                        passed=True,
                        detail="dark (3 lx)",
                        entity_ids=("sensor.lux",),
                    )
                ],
                matched=True,
                evaluated=True,
            ),
            # Never reached (the winner short-circuits) — and `disabled` scenes are
            # skipped outright. Both still serialise, so both are in the shape.
            SceneEval(index=2, name="night", predicates=[], matched=False, evaluated=False),
        ],
    )
    unit = UnitTrace(
        scope_kind="area",
        scope_id="kitchen",
        category="general",
        switch_state="on",
        outcome=Outcome.ACTED,
        explanation=explanation,
        winner_name="evening",
        actions=[
            {
                "service": "light.turn_on",
                "entity_ids": ["light.lamp"],
                "params": {"brightness_pct": 40},
            }
        ],
        category_name="General",
        scope_name="Kitchen",
    )
    buffer = hass.data[DOMAIN][DATA_TRACE_BUFFER]
    buffer.clear()  # drop anything setup itself emitted, so the golden is ours alone
    buffer.emit(
        TraceEvent(
            cause=TriggerCause(
                kind=CauseKind.ENTITY,
                entity_id="sensor.lux",
                old="120",
                new="3",
                detail="lux fell",
            ),
            units=[unit],
            event_id="e1",
            timestamp="2026-07-12T10:00:00+00:00",
        )
    )
    return mock_config_entry


async def test_ai_context_shape_is_pinned(hass: HomeAssistant, seeded: AmbienceStore) -> None:
    assert_shape("ai_context", await build_ai_context(hass))


async def test_entities_find_shape_is_pinned(hass: HomeAssistant, seeded: AmbienceStore) -> None:
    assert_shape("entities_find", find_entities(entity_rows(hass)))


async def test_traces_list_shape_is_pinned(
    hass: HomeAssistant, traced: MockConfigEntry, hass_ws_client: Any
) -> None:
    """The third protocol-1 payload. Pinned through the real websocket handler, not
    by rebuilding the payload here, so the `traces` WRAPPER key is pinned too — that
    is the key `budget.fit_traces` reads (`result.get("traces")`) to decide what to
    trim, and a rename would silently disable the MCP's trace trimming.

    `redact: true` because that is what the MCP's `list_traces` always sends; the
    redaction rewrites values, not shape, but the gate must pin the payload the MCP
    actually receives.
    """
    client = await hass_ws_client()
    await client.send_json({"id": 1, "type": "ambience/traces/list", "redact": True})
    resp = await client.receive_json()

    assert resp["success"] is True
    # Shape FIRST, so a renamed key reports the actionable drift message rather than
    # the bare KeyError the fixture guard below would raise.
    assert_shape("traces_list", resp["result"])
    # A golden recorded from an empty list would pin only `traces` and nothing inside
    # a record — so guard the fixture, not just the payload.
    assert resp["result"]["traces"], "an empty trace list would pin nothing"


async def test_scope_get_shape_is_pinned(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, hass_ws_client: Any
) -> None:
    """`ambience/{kind}/get` is read by every protocol version, not a per-protocol
    adapter: `BaseProtocol.get_scope` (base.py) returns it straight to the model, AND
    `BaseProtocol.preview_write` reads it again as the diff's `current` baseline. If
    `scenes` were ever renamed, `preview_write`'s defensive fallback (`current = []`)
    would kick in silently — every scene would then diff as freshly `added` while
    `apply_write` still replaces the whole scope wholesale. That is a human approving
    a change they cannot see, the exact failure the diff exists to prevent — so this
    is pinned here even though no per-protocol adapter names it.

    Pinned through the real websocket handlers (save then get), with a genuinely
    populated scene — name, category, description, a non-empty `when`, an action with
    entity_ids/params, and explicit `priority`/`pinned` — so a rename of any field
    `diff.py`'s `_key`/`_comparable` or the MCP's `_with_ranks` reads is caught, not
    just the container keys.
    """
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    area = ar.async_get(hass).async_create("Kitchen")
    client = await hass_ws_client()
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/area/save",
            "area_id": area.id,
            "config": {
                "scenes": [
                    {
                        "name": "movie",
                        "category": "general",
                        "description": "evening watch",
                        "when": {"time_of_day": {"period": "evening"}},
                        "actions": [
                            {
                                "service": "light.turn_on",
                                "entity_ids": ["light.lamp"],
                                "params": {"brightness_pct": 30},
                            }
                        ],
                        "priority": 10,
                        "pinned": True,
                    }
                ]
            },
        }
    )
    save = await client.receive_json()
    assert save["success"] is True, save

    await client.send_json({"id": 2, "type": "ambience/area/get", "area_id": area.id})
    resp = await client.receive_json()

    assert resp["success"] is True
    assert_shape("scope_get", resp["result"])
    # A golden recorded from an empty scene list would pin nothing inside a scene.
    assert resp["result"]["scenes"], "an empty scene list would pin nothing"


async def test_categories_list_shape_is_pinned(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, hass_ws_client: Any
) -> None:
    """`ambience/categories/list` is read by every protocol version via
    `BaseProtocol.list_categories`, AND again inline inside `preview_write`'s
    known-category gate (`existing_by_id`). A silent rename of `id` there would make
    every already-declared category look unknown to `preview_write`, blocking every
    write behind a spurious 'unknown categories' error — the opposite failure mode
    from `scope_get`'s (a false block instead of a silent over-approval), but still
    not caught by any per-protocol adapter golden.

    A fresh install always seeds one real category (`GENERAL_CATEGORY`), so this
    needs no extra setup to be non-empty.
    """
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    client = await hass_ws_client()
    await client.send_json({"id": 1, "type": "ambience/categories/list"})
    resp = await client.receive_json()

    assert resp["success"] is True
    assert_shape("categories_list", resp["result"])
    assert resp["result"]["categories"], "an empty category list would pin nothing"


def _read_mcp_set_literal(module: str, name: str) -> set[Any]:
    """The value of one module-level set (or `frozenset({...})`) assignment in an
    mcp-server module, read with `ast` rather than imported — the two packages
    cannot import each other (separate venvs), so this is how a backend test reads
    an MCP literal (same technique bin/check_mcp_protocol.py uses for
    MCP_PROTOCOL). Shared by the gates below so the ast-walking isn't duplicated
    between them."""
    import ast
    from pathlib import Path

    path = Path(__file__).parents[1] / "mcp-server" / "src" / "ambience_mcp" / module
    for node in ast.parse(path.read_text()).body:
        # `X = {...}` and the annotated `X: frozenset[str] = frozenset({...})` are
        # different nodes; both spellings are in use in mcp-server.
        if isinstance(node, ast.Assign):
            target, value = node.targets[0], node.value
        elif isinstance(node, ast.AnnAssign) and node.value is not None:
            target, value = node.target, node.value
        else:
            continue
        if not (isinstance(target, ast.Name) and target.id == name):
            continue
        if (
            isinstance(value, ast.Call)
            and isinstance(value.func, ast.Name)
            and value.func.id == "frozenset"
        ):
            if not value.args:
                continue  # bare frozenset() — no literal to read
            value = value.args[0]
        return set(ast.literal_eval(value))
    raise AssertionError(f"no module-level {name} assignment in mcp-server {module}")


def _load_mcp_diff():
    """mcp-server's `diff` module, loaded BY PATH rather than imported.

    The two packages live in separate venvs, so `import ambience_mcp` fails from
    the backend test env (see `_read_mcp_set_literal`). `diff.py` imports
    nothing but the stdlib, though, so loading it from its file gives a backend
    test the real functions to call — a stronger gate than comparing literals,
    because it pins BEHAVIOUR rather than a copied value."""
    import importlib.util
    from pathlib import Path

    diff_py = Path(__file__).parents[1] / "mcp-server" / "src" / "ambience_mcp" / "diff.py"
    spec = importlib.util.spec_from_file_location("_mcp_diff_under_test", diff_py)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_mcp_diff_predicate_defaults_match_the_backends():
    """diff.py must fill the SAME predicate defaults the backend materialises at
    save (`normalize_predicate` / each condition's `_norm`).

    The backend stores the filled form while the AI guide teaches the compact
    one, so an author re-submitting an unchanged scene sends a predicate that
    differs only by those defaults. If diff.py's rules drift from the backend's,
    that re-submission previews as "N updated" and the human confirm gate fills
    with noise — the same class of bug the transient-fields gate below guards.

    Pins the RULES, not just the default values: the cases below include the
    falsy and explicit-null forms where an `or` fill, a `bool()` fill and
    `occupied`'s "only an explicit False means vacant" rule all differ.
    """
    from custom_components.ambience.conditions.lux import _norm as lux_norm
    from custom_components.ambience.conditions.occupancy import _norm as occupancy_norm
    from custom_components.ambience.conditions.people import _norm as people_norm

    diff = _load_mcp_diff()
    cases: list[tuple[str, Any, list[Any]]] = [
        (
            "occupancy",
            occupancy_norm,
            [
                {"sensors": ["binary_sensor.hall"]},  # the guide's compact form
                {},
                {"sensors": ["binary_sensor.a"], "occupied": False, "quant": "all"},
                {"occupied": None, "quant": None, "negate": None, "for_mode": None},
                {"occupied": True, "negate": True, "for_mode": "less_than", "for": {"m": 5}},
                None,  # the wildcard form
                "nonsense",  # hand-edited junk must not crash either side
            ],
        ),
        (
            "lux",
            lux_norm,
            [
                {"sensors": ["sensor.a"], "range": "dark"},
                {"sensors": ["sensor.a"], "min": 5},
                {"quant": None, "negate": None},
                {"quant": "all", "negate": True},
                None,
            ],
        ),
        (
            "people",
            people_norm,
            [
                {"who": ["person.alice"]},
                {},
                {"quant": None, "where": None, "negate": None, "for_mode": None},
                {"quant": "nobody", "where": "zone.work", "negate": True},
                {"for": {"m": 10}, "for_mode": "less_than"},
                None,
            ],
        ),
    ]
    for condition, backend_norm, predicates in cases:
        for predicate in predicates:
            assert diff._normalise(condition, predicate) == backend_norm(predicate), (
                f"{condition} predicate {predicate!r} normalises differently in mcp-server"
            )


def test_mcp_diff_predicate_defaults_cover_every_normalising_condition():
    """Every backend condition that materialises predicate defaults at save must
    have an entry in diff.py's `_PREDICATE_DEFAULTS`. The test above only checks
    the three that exist today; without this one, a FOURTH condition growing
    defaults would silently reintroduce the confirm-gate noise for its own
    predicates.

    "Materialises defaults" is detected by the convention itself — subclassing
    `NormalisesPredicate` with a `_DEFAULTS` table — with a module-level `_norm`
    as a secondary signal, so a condition that declares defaults either way is
    caught."""
    import importlib
    from pathlib import Path

    from custom_components.ambience.conditions._common import NormalisesPredicate

    conditions_dir = Path(__file__).parents[1] / "custom_components" / "ambience" / "conditions"
    normalising = set()
    for path in sorted(conditions_dir.glob("*.py")):
        if path.name.startswith("_"):
            continue  # shared helpers, not conditions
        module = importlib.import_module(f"custom_components.ambience.conditions.{path.stem}")
        has_norm = hasattr(module, "_norm")
        for obj in vars(module).values():
            if not (
                isinstance(obj, type)
                and obj.__module__ == module.__name__
                and getattr(obj, "name", None)
                and hasattr(obj, "matches")
            ):
                continue
            if issubclass(obj, NormalisesPredicate) or "_DEFAULTS" in vars(obj) or has_norm:
                normalising.add(obj.name)

    assert normalising, (
        "found no condition subclassing NormalisesPredicate — has the convention moved?"
    )
    table = _load_mcp_diff()._PREDICATE_DEFAULTS
    assert normalising <= set(table), (
        "conditions materialising defaults but unknown to mcp-server diff.py: "
        f"{sorted(normalising - set(table))}"
    )


def test_mcp_diff_transient_fields_match_the_backends():
    """diff.py must ignore exactly the per-scene hints the backend injects
    (websocket_helpers._TRANSIENT_SCENE_FIELDS) — a new backend annotation
    that diff.py doesn't know makes every re-submitted-unchanged scene show
    as 'updated', turning the human approval surface into noise."""
    from custom_components.ambience.websocket_helpers import _TRANSIENT_SCENE_FIELDS

    assert _read_mcp_set_literal("diff.py", "_TRANSIENT_FIELDS") == set(_TRANSIENT_SCENE_FIELDS)


def test_mcp_diff_order_fields_match_the_backend():
    """diff.py's `_ORDER_FIELDS` names the scene fields the backend honours on
    import to set evaluation order — validated in
    `websocket_helpers.validate_scope_config` (the `scene_priority_invalid` /
    `scene_pinned_invalid` checks) and consumed by `sorting.resolve_order` /
    `sorting.minimise_pins`. This is the same class of bug
    `test_mcp_diff_transient_fields_match_the_backends` guards against: if the
    backend ever honoured a THIRD order field, an order-only change stated only
    in that field would preview as "no changes" — the exact bug commit
    a8ed6aaf fixed when it was `_TRANSIENT_FIELDS`.

    Unlike `_TRANSIENT_SCENE_FIELDS`, the backend has no single named constant
    for "priority"/"pinned" — they're two literal strings used inline at the
    two call sites above, not gathered into one importable/ast-parseable
    place. So this pins the MCP's set against that known-correct literal
    directly, rather than against a backend symbol. It is a weaker gate than
    the transient-fields one: it catches an accidental edit to diff.py's own
    `_ORDER_FIELDS`, but NOT a backend change that adds a new order field,
    since there is nothing on the backend side to read. If a maintainer adds
    one, this test's hardcoded set must be updated by hand.
    """
    assert _read_mcp_set_literal("diff.py", "_ORDER_FIELDS") == {"priority", "pinned"}


def test_every_registered_ws_command_is_classified_read_or_write():
    """A new command must be placed in exactly one set, so the MCP client can
    never mistake a write for a retry-safe read."""
    from custom_components.ambience import websocket as ws

    registered = {handler._ws_command for handler in ws._WS_HANDLERS}  # noqa: SLF001
    assert registered == ws.WRITE_COMMANDS | ws.READ_COMMANDS
    assert not (ws.WRITE_COMMANDS & ws.READ_COMMANDS)


def test_mcp_mutating_commands_match_the_backends_write_set():
    """ha_client re-sends a command whose reply was lost only when it is a read;
    the two sides must agree on what a write is."""
    from custom_components.ambience import websocket as ws

    assert _read_mcp_set_literal("ha_client.py", "MUTATING_COMMANDS") == set(ws.WRITE_COMMANDS)
