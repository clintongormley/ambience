# Expand `ambience.apply_scene` Action Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the `ambience.apply_scene` admin service so a caller can scope an apply to a single category, and apply a specific named scene's actions directly (bypassing predicate resolution).

**Architecture:** Add one new service-layer function `async_apply_named_scene` that locates a scene by name within a `(scope, category)` and runs its actions directly (mirroring the existing `async_run_scene_actions`, but gated on the scope switch and located by name). The existing `async_apply_scene` already handles the predicate paths (it accepts `category` and `force`). The service handler in `__init__.py` dispatches to the named path when a `scene` is supplied, else to `async_apply_scene`. The voluptuous schema gains `category`/`scene`/`force` fields plus a "scene ⇒ category" validator.

**Tech Stack:** Python 3.13, Home Assistant custom integration, `voluptuous` for service schemas, `pytest` + `pytest-homeassistant-custom-component` (asyncio auto mode).

---

## File Structure

- **Modify** `custom_components/ambience/service.py` — add `async_apply_named_scene`.
- **Modify** `custom_components/ambience/__init__.py` — extend `_APPLY_SCENE_SCHEMA` (new fields + `scene ⇒ category` validator) and update `_handle_apply_scene` to dispatch.
- **Modify** `custom_components/ambience/services.yaml` — expose `floor`, `house`, `category`, `force` fields (and keep `area`/`scene`).
- **Create** `tests/test_apply_named_scene.py` — unit tests for `async_apply_named_scene`.
- **Create** `tests/test_apply_scene_schema.py` — tests for the `_APPLY_SCENE_SCHEMA` validator.
- **Modify** `tests/test_e2e_apply_scene.py` — end-to-end handler-dispatch tests for the new `category`/`scene` fields.

Conventions to follow (from existing tests): install the integration via `MockConfigEntry` + `async_create` area; pre-expose services through `hass.data[DOMAIN][DATA_EXPOSED_ACTIONS].save(...)`; seed scenes via `store.async_save_area(...)`; observe device calls with `async_mock_service`.

---

## Task 1: `async_apply_named_scene` in `service.py`

Locate a scene by name within a `(scope, category)` and run its actions directly. Gate on the permanent `enabled` flag always, and on the scope switch unless `force=True`. Do NOT touch last-applied. Emit a `MANUAL`-cause trace.

**Files:**
- Modify: `custom_components/ambience/service.py` (add function after `async_run_scene_actions`, ~line 439)
- Test: `tests/test_apply_named_scene.py` (create)

- [ ] **Step 1: Write the failing tests**

Create `tests/test_apply_named_scene.py`:

```python
"""async_apply_named_scene runs a named scene's actions directly, bypassing predicates."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.ambience.const import DATA_EXPOSED_ACTIONS, DATA_STORE, DATA_SWITCHES, DOMAIN
from custom_components.ambience.service import async_apply_named_scene, get_last_applied


async def _install(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> str:
    area = ar.async_get(hass).async_create("Living Room")
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    exposed = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed.save([{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}])
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area.id,
        {
            "scenes": [
                {
                    "name": "Bright",
                    "category": "lighting",
                    # A predicate that is NOT currently true — proves we skip evaluation.
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.nope",
                            "states": ["on"],
                        }
                    },
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                }
            ]
        },
    )
    return area.id


async def test_runs_named_scene_actions_bypassing_predicates(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright")

    assert len(calls) == 1


async def test_name_match_is_case_insensitive(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")

    await async_apply_named_scene(hass, "area", area_id, "lighting", "  bright  ")

    assert len(calls) == 1


async def test_unknown_name_raises(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")

    with pytest.raises(ServiceValidationError):
        await async_apply_named_scene(hass, "area", area_id, "lighting", "Nope")

    assert len(calls) == 0


async def test_does_not_record_last_applied(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    async_mock_service(hass, "light", "turn_on")

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright")

    assert get_last_applied(hass, "area", area_id, "lighting") is None


async def test_noop_when_switch_off_without_force(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")
    switch = hass.data[DOMAIN][DATA_SWITCHES][("area", area_id)]
    await switch.async_turn_off()
    await hass.async_block_till_done()

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright")

    assert len(calls) == 0


async def test_force_runs_when_switch_off(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")
    switch = hass.data[DOMAIN][DATA_SWITCHES][("area", area_id)]
    await switch.async_turn_off()
    await hass.async_block_till_done()

    await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright", force=True)

    assert len(calls) == 1


async def test_blocked_when_scope_disabled(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("area", area_id, False)
    await hass.async_block_till_done()

    with pytest.raises(ServiceValidationError):
        await async_apply_named_scene(hass, "area", area_id, "lighting", "Bright")

    assert len(calls) == 0
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `python -m pytest tests/test_apply_named_scene.py -v`
Expected: FAIL — `ImportError: cannot import name 'async_apply_named_scene'`.

- [ ] **Step 3: Write the minimal implementation**

In `custom_components/ambience/service.py`, add this function immediately after `async_run_scene_actions` (it ends at ~line 438, before `async_execute_plan`). It reuses existing module-level helpers (`_scope_enabled`, `_switch_state`, `_scope_config`, `async_execute_actions`, `log_run_actions`, and the trace helpers already imported at the top of the file):

```python
async def async_apply_named_scene(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category: str,
    scene_name: str,
    *,
    force: bool = False,
) -> None:
    """Apply a single named scene's actions directly, bypassing predicate resolution.

    Locates the scene by case-insensitive name within (scope, category) — names are
    unique there by construction — and runs its actions. Always refuses when the
    scope is permanently disabled. Honours the scope switch unless `force=True`.
    Does NOT touch last_applied (an out-of-band manual override, like
    async_run_scene_actions). Emits a MANUAL-cause trace.
    """
    if not _scope_enabled(hass, scope_kind, scope_id):
        raise ServiceValidationError(f"scope {scope_kind}/{scope_id} is disabled")

    switch_state = _switch_state(hass, scope_kind, scope_id)
    if not force and switch_state == "off":
        _LOGGER.info(
            "ambience: scope=%s/%s switch is off; skipping apply_scene (named scene %r)",
            scope_kind,
            scope_id,
            scene_name,
        )
        return

    store = hass.data[DOMAIN][DATA_STORE]
    cfg = _scope_config(store, scope_kind, scope_id)
    target = scene_name.strip().lower()
    match: tuple[int, dict[str, Any]] | None = None
    for index, scene in enumerate(cfg.get("scenes", [])):
        if scene.get("category") != category:
            continue
        name = scene.get("name")
        if isinstance(name, str) and name.strip().lower() == target:
            match = (index, scene)
            break
    if match is None:
        raise ServiceValidationError(
            f"no scene named {scene_name!r} in scope {scope_kind}/{scope_id} category {category!r}"
        )

    index, scene = match
    actions = scene.get("actions", [])
    context = (
        log_run_actions(hass, scope_kind, scope_id, scene.get("name"), index) if actions else None
    )
    await async_execute_actions(
        hass, scope_kind, scope_id, actions, scene_index=index, context=context
    )

    if tracing_active(hass):
        emit_trace(
            hass,
            TraceEvent(
                TriggerCause(kind=CauseKind.MANUAL),
                [
                    UnitTrace(
                        scope_kind,
                        scope_id,
                        category,
                        switch_state,
                        Outcome.ACTED,
                        None,
                        winner_name=scene.get("name"),
                        actions=actions,
                    )
                ],
            ),
        )
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `python -m pytest tests/test_apply_named_scene.py -v`
Expected: PASS (all 7 tests).

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/service.py tests/test_apply_named_scene.py
git commit -m "feat: async_apply_named_scene runs a named scene's actions directly"
```

---

## Task 2: `scene ⇒ category` schema validator in `__init__.py`

Extend `_APPLY_SCENE_SCHEMA` with `category`, `scene`, `force` fields and a validator requiring `category` whenever `scene` is present. Keep the existing exactly-one-scope rule.

**Files:**
- Modify: `custom_components/ambience/__init__.py:94-103` (`_APPLY_SCENE_SCHEMA`) plus a new validator near `_exactly_one_scope` (~line 84)
- Test: `tests/test_apply_scene_schema.py` (create)

- [ ] **Step 1: Write the failing tests**

Create `tests/test_apply_scene_schema.py`:

```python
"""Validation rules for the apply_scene service schema."""

from __future__ import annotations

import pytest
import voluptuous as vol

from custom_components.ambience import _APPLY_SCENE_SCHEMA


def test_scope_only_is_valid():
    assert _APPLY_SCENE_SCHEMA({"area": "lr"}) == {"area": "lr"}


def test_scope_and_category_is_valid():
    out = _APPLY_SCENE_SCHEMA({"area": "lr", "category": "lighting"})
    assert out["category"] == "lighting"


def test_scope_category_and_scene_is_valid():
    out = _APPLY_SCENE_SCHEMA({"area": "lr", "category": "lighting", "scene": "Bright"})
    assert out["scene"] == "Bright"


def test_force_is_accepted():
    out = _APPLY_SCENE_SCHEMA({"house": True, "force": True})
    assert out["force"] is True


def test_scene_without_category_is_rejected():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"area": "lr", "scene": "Bright"})


def test_no_scope_is_rejected():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"category": "lighting"})


def test_two_scopes_rejected():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"area": "lr", "floor": "ground"})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `python -m pytest tests/test_apply_scene_schema.py -v`
Expected: FAIL — `test_scene_without_category_is_rejected` fails (no such rule yet) and the `category`/`scene`/`force`-bearing cases fail with `vol.Invalid: extra keys not allowed`.

- [ ] **Step 3: Write the minimal implementation**

In `custom_components/ambience/__init__.py`, add this validator right after `_house_must_be_true` (ends ~line 91):

```python
def _scene_requires_category(value: dict) -> dict:
    """Validator: a `scene` name may only be given together with a `category`."""
    if "scene" in value and "category" not in value:
        raise vol.Invalid("apply_scene: 'scene' requires 'category'")
    return value
```

Then replace `_APPLY_SCENE_SCHEMA` (lines 94-103) with:

```python
_APPLY_SCENE_SCHEMA = vol.All(
    vol.Schema(
        {
            vol.Optional("area"): cv.string,
            vol.Optional("floor"): cv.string,
            vol.Optional("house"): _house_must_be_true,
            vol.Optional("category"): cv.string,
            vol.Optional("scene"): cv.string,
            vol.Optional("force"): cv.boolean,
        }
    ),
    _exactly_one_scope,
    _scene_requires_category,
)
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `python -m pytest tests/test_apply_scene_schema.py -v`
Expected: PASS (all 7 tests).

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/__init__.py tests/test_apply_scene_schema.py
git commit -m "feat: apply_scene schema gains category/scene/force with scene-requires-category rule"
```

---

## Task 3: Handler dispatch + `services.yaml`

Wire the schema into the handler so `category`/`force` flow to `async_apply_scene` and a `scene` routes to `async_apply_named_scene`. Document all fields in `services.yaml`.

**Files:**
- Modify: `custom_components/ambience/__init__.py:63` (import) and `:170-176` (`_handle_apply_scene`)
- Modify: `custom_components/ambience/services.yaml` (whole file)
- Test: `tests/test_e2e_apply_scene.py` (append tests)

- [ ] **Step 1: Write the failing tests**

Append to `tests/test_e2e_apply_scene.py`:

```python
async def test_service_call_named_scene_runs_actions_bypassing_predicates(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    on_calls = async_mock_service(hass, "light", "turn_on")
    store = hass.data[DOMAIN][DATA_STORE]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {
                    "name": "Bright",
                    "category": "lighting",
                    # Never-true predicate: a hit proves the handler bypassed resolution.
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.nope",
                            "states": ["on"],
                        }
                    },
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                }
            ],
        },
    )

    await hass.services.async_call(
        DOMAIN,
        "apply_scene",
        {"area": "lr", "category": "lighting", "scene": "Bright"},
        blocking=True,
    )

    assert len(on_calls) == 1


async def test_service_call_category_limits_to_one_category(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    light_calls = async_mock_service(hass, "light", "turn_on")
    cover_calls = async_mock_service(hass, "cover", "open_cover")
    store = hass.data[DOMAIN][DATA_STORE]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [
            {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}},
            {"id": "cover.open_cover", "label": "", "visible_fields": [], "defaults": {}},
        ]
    )
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {},
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                },
                {
                    "category": "blinds",
                    "when": {},
                    "actions": [
                        {"service": "cover.open_cover", "entity_ids": ["cover.b"], "params": {}}
                    ],
                },
            ],
        },
    )

    await hass.services.async_call(
        DOMAIN,
        "apply_scene",
        {"area": "lr", "category": "lighting"},
        blocking=True,
    )

    assert len(light_calls) == 1
    assert len(cover_calls) == 0
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `python -m pytest tests/test_e2e_apply_scene.py -v -k "named_scene or category_limits"`
Expected: FAIL — `test_..._named_scene...` finds 0 light calls (the `scene` field is still ignored and the never-true predicate matches nothing), and `test_..._category_limits...` finds 1 cover call (category not yet passed through, so both categories apply).

- [ ] **Step 3: Write the minimal implementation**

In `custom_components/ambience/__init__.py`, update the import at line 63:

```python
from .service import async_apply_named_scene, async_apply_scene, clear_last_applied
```

Replace `_handle_apply_scene` (lines 170-176) with:

```python
    async def _handle_apply_scene(call: ServiceCall) -> None:
        if "area" in call.data:
            scope_kind, scope_id = "area", call.data["area"]
        elif "floor" in call.data:
            scope_kind, scope_id = "floor", call.data["floor"]
        else:  # house
            scope_kind, scope_id = "house", None
        category = call.data.get("category")
        scene = call.data.get("scene")
        force = call.data.get("force", False)
        if scene is not None:
            # Schema guarantees category is present whenever scene is.
            await async_apply_named_scene(
                hass, scope_kind, scope_id, category, scene, force=force
            )
        else:
            await async_apply_scene(hass, scope_kind, scope_id, category=category, force=force)
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `python -m pytest tests/test_e2e_apply_scene.py -v`
Expected: PASS (existing + 2 new tests).

- [ ] **Step 5: Update `services.yaml`**

Replace the whole file `custom_components/ambience/services.yaml` with:

```yaml
apply_scene:
  name: Apply scene
  description: >-
    Apply scenes at a scope. With no category, re-runs the rules for every
    category in the scope. With a category, re-runs the rules for just that
    category. With a category and a scene name, applies that scene's actions
    directly (ignoring its conditions).
  fields:
    area:
      name: Area
      description: The HA area id to apply scenes in.
      required: false
      selector:
        area: {}
    floor:
      name: Floor
      description: The HA floor id to apply scenes in.
      required: false
      selector:
        floor: {}
    house:
      name: House
      description: Apply at the house scope. Must be true.
      required: false
      selector:
        boolean: {}
    category:
      name: Category
      description: Limit the apply to a single scene category (by category id).
      required: false
      selector:
        text: {}
    scene:
      name: Scene
      description: >-
        Apply this named scene's actions directly, bypassing its conditions.
        Requires a category.
      required: false
      selector:
        text: {}
    force:
      name: Force
      description: Apply even when the scope's switch is off.
      required: false
      default: false
      selector:
        boolean: {}
```

- [ ] **Step 6: Verify the service metadata still loads**

Run: `python -m pytest tests/test_services_meta.py tests/test_init.py -v`
Expected: PASS (service still registers and is described).

- [ ] **Step 7: Commit**

```bash
git add custom_components/ambience/__init__.py custom_components/ambience/services.yaml tests/test_e2e_apply_scene.py
git commit -m "feat: apply_scene service exposes category/scene/force and dispatches the named-scene path"
```

---

## Task 4: Full suite, lint, and format

**Files:** none (verification only)

- [ ] **Step 1: Run the full backend test suite**

Run: `python -m pytest tests/ -q`
Expected: PASS (no regressions).

- [ ] **Step 2: Lint and format**

Run: `ruff check . && ruff format .`
Expected: no errors; formatter reports files unchanged (or auto-fixes — re-run tests if it edits anything).

- [ ] **Step 3: Commit any formatting fixes (only if `ruff format` changed files)**

```bash
git add -A
git commit -m "style: ruff format"
```

---

## Notes for the implementer

- The frontend bundle is untouched — no `npm run build` needed (this is a backend/admin-service change with no UI).
- `async_apply_named_scene` deliberately mirrors `async_run_scene_actions` (out-of-band override semantics) but differs in two ways: it honours the scope switch unless `force=True`, and it locates the scene by name within a category rather than by index. Keep both functions; they serve different callers.
- Names are unique within `(scope, category)` by server-side validation (`websocket_helpers.py`), so the first case-insensitive match is the only match.
- This action dispatches real device service calls and stays admin-only (`async_register_admin_service`); do not change that.
