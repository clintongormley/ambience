# Optional Ambience Switches + Scope-id `apply_scene` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make per-scope Ambience switches opt-in via a config toggle (default off); a switch exists only for an *enabled* scope while the toggle is on, and is *deleted* (not hidden) when its scope is disabled. Rework the `apply_scene` service to target scopes by area/floor id + a house flag so it no longer depends on switch entities.

**Architecture:** A new `create_switches` config-entry option gates switch creation. `switch.async_setup_entry` builds the *desired* switch set (toggle × per-scope `enabled`), adds those entities, and runs one idempotent reconcile pass that deletes any registered Ambience switch (and its device) not in the desired set. Runtime handlers (`_ws_set_scope_enabled`, area/floor create) do targeted single-switch create/delete gated on the toggle. The `apply_scene` service drops its `scope` entity field for `areas`/`floors`/`house`, with `category`/`scene` accepting multiple values.

**Tech Stack:** Python 3.14, Home Assistant custom integration, `pytest` + `pytest-homeassistant-custom-component` (`asyncio_mode=auto`), voluptuous schemas, HA selectors; TypeScript/Lit frontend with Vitest.

**Spec:** [2026-06-12-optional-switches-design.md](../specs/2026-06-12-optional-switches-design.md)

**Conventions:**
- Run a single test: `python -m pytest tests/test_x.py::test_name -q`
- Run a file: `python -m pytest tests/test_x.py -q`
- Frontend test: `npm test -- run test/x.test.ts`
- Lint/format before commit: `ruff check . && ruff format .` (Python), `npm run ci` (frontend)
- Never commit to `main`; we are on branch `optional-switches`. Commit after each task.

---

## File Structure

**Modify:**
- `custom_components/ambience/const.py` — new option + data-key constants.
- `custom_components/ambience/config_flow.py` — options-flow field.
- `custom_components/ambience/strings.json` + `translations/en.json` — option label/description.
- `custom_components/ambience/__init__.py` — stash the toggle; gate area/floor create handlers; new `apply_scene` schema + handler; reuse `_remove_scope_device` from switch.py.
- `custom_components/ambience/switch.py` — desired-set computation, reconcile, `make_scope_switch`/`_remove_scope_device` helpers, gated `async_setup_entry`.
- `custom_components/ambience/websocket.py` — `_ws_set_scope_enabled` delete-on-disable / create-on-enable.
- `custom_components/ambience/service.py` — `_resolve_target_scopes`, `_plan_named_scenes` helpers.
- `custom_components/ambience/services.yaml` — new field descriptions/selectors.
- `frontend/src/views/scopes-view.ts` — `refreshSwitches()` after the enable/disable toggle.
- `tests/conftest.py` — flip the shared `mock_config_entry` to switches-on (compatibility shim).
- `tests/test_websocket_switch.py`, `tests/test_apply_scene_schema.py`, `tests/test_e2e_apply_scene.py`, `tests/test_switch_exposure.py`, and any other test calling the `apply_scene` service — migrate to the new behavior/schema.

**Create:**
- `tests/test_switch_optional.py` — option-gating, reconcile, disable-deletes/enable-recreates at setup level.
- `tests/test_apply_scene_targeting.py` — service targeting + multi-category + multi-scene semantics.

---

## Phase 1 — Config option plumbing

### Task 1: Add option + data-key constants

**Files:**
- Modify: `custom_components/ambience/const.py`

- [ ] **Step 1: Add the constants**

In `custom_components/ambience/const.py`, directly after the `CONF_SHOW_SIDEBAR_PANEL` / `DEFAULT_SHOW_SIDEBAR_PANEL` block (around line 64-66), add:

```python
# Optional per-scope switches (options flow). Off by default: most users want the
# panel only, not a switch entity + device per scope. When on, a switch exists for
# every ENABLED scope; disabling a scope deletes its switch.
CONF_CREATE_SWITCHES = "create_switches"
DEFAULT_CREATE_SWITCHES = False
# hass.data key holding the resolved create_switches bool for this entry, so the
# switch platform + runtime handlers can read it without the config entry in hand.
DATA_CREATE_SWITCHES = "create_switches_enabled"
```

- [ ] **Step 2: Verify import works**

Run: `python -c "from custom_components.ambience.const import CONF_CREATE_SWITCHES, DEFAULT_CREATE_SWITCHES, DATA_CREATE_SWITCHES; print(CONF_CREATE_SWITCHES, DEFAULT_CREATE_SWITCHES, DATA_CREATE_SWITCHES)"`
Expected: `create_switches False create_switches_enabled`

- [ ] **Step 3: Commit**

```bash
git add custom_components/ambience/const.py
git commit -m "feat(switch): add create_switches option constants"
```

---

### Task 2: Add the option to the options flow + translations

**Files:**
- Modify: `custom_components/ambience/config_flow.py`
- Modify: `custom_components/ambience/strings.json`
- Modify: `custom_components/ambience/translations/en.json`
- Test: `tests/test_options_flow.py`

- [ ] **Step 1: Write the failing test**

Add to `tests/test_options_flow.py` (import `CONF_CREATE_SWITCHES`, `DEFAULT_CREATE_SWITCHES` from `custom_components.ambience.const` at the top):

```python
async def test_options_flow_exposes_create_switches_default_off(hass, mock_config_entry):
    # The product default is OFF even though the test fixture turns switches on.
    entry = MockConfigEntry(domain=DOMAIN, title="Ambience", data={}, options={},
                            unique_id="ambience_default_off")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    result = await hass.config_entries.options.async_init(entry.entry_id)
    schema_keys = {str(k) for k in result["data_schema"].schema}
    assert "create_switches" in schema_keys
    defaults = {str(k): k.default() for k in result["data_schema"].schema}
    assert defaults["create_switches"] is False


async def test_options_flow_saves_create_switches(hass, mock_config_entry):
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)
    from custom_components.ambience.const import CONF_SHOW_SIDEBAR_PANEL
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {CONF_SHOW_SIDEBAR_PANEL: True, "create_switches": True}
    )
    await hass.async_block_till_done()
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert mock_config_entry.options[CONF_CREATE_SWITCHES] is True
```

- [ ] **Step 2: Run to verify it fails**

Run: `python -m pytest tests/test_options_flow.py::test_options_flow_exposes_create_switches_default_off -q`
Expected: FAIL — `"create_switches" not in schema_keys`.

> Note: `mock_config_entry` will be switches-on after Task 4. If running this task before Task 4, the test still passes its assertions (they don't depend on switch entities). Proceed regardless.

- [ ] **Step 3: Add the option to the options flow**

In `custom_components/ambience/config_flow.py`:

1. Extend the import from `.const` to include `CONF_CREATE_SWITCHES` and `DEFAULT_CREATE_SWITCHES`.
2. In `async_step_init`, add the saved key to the `data=` dict (after `CONF_SHOW_SIDEBAR_PANEL`):

```python
            return self.async_create_entry(
                title="",
                data={
                    CONF_SHOW_SIDEBAR_PANEL: user_input[CONF_SHOW_SIDEBAR_PANEL],
                    CONF_CREATE_SWITCHES: user_input[CONF_CREATE_SWITCHES],
                    CONF_EXPOSED_ASSISTANTS: exposed,
                },
            )
```

3. In the form-building branch, after reading `current` and before building `fields`, add:

```python
        create_switches = self.config_entry.options.get(
            CONF_CREATE_SWITCHES, DEFAULT_CREATE_SWITCHES
        )
        fields: dict[Any, Any] = {
            vol.Required(CONF_SHOW_SIDEBAR_PANEL, default=current): bool,
            vol.Required(CONF_CREATE_SWITCHES, default=create_switches): bool,
        }
```

(Replace the existing single-entry `fields: dict[Any, Any] = {...}` line with the two-entry dict above.)

- [ ] **Step 4: Add translations**

In `custom_components/ambience/strings.json`, under `options.step.init.data` add `"create_switches": "Create per-scope switches"`, and under `data_description` add:

```json
          "create_switches": "When on, Ambience creates a switch entity (and device) for each enabled area, floor, and the house — used to pause that scope. When off, no switches are created. Disabling a scope deletes its switch."
```

Make the identical additions in `custom_components/ambience/translations/en.json` (same two keys, same strings).

- [ ] **Step 5: Run tests to verify they pass**

Run: `python -m pytest tests/test_options_flow.py -q`
Expected: PASS (all, including the two new tests).

- [ ] **Step 6: Lint + commit**

```bash
ruff check custom_components/ambience/config_flow.py && ruff format custom_components/ambience/config_flow.py
git add custom_components/ambience/config_flow.py custom_components/ambience/strings.json custom_components/ambience/translations/en.json tests/test_options_flow.py
git commit -m "feat(switch): add create_switches toggle to options flow"
```

---

### Task 3: Stash the resolved toggle in hass.data

**Files:**
- Modify: `custom_components/ambience/__init__.py`
- Test: `tests/test_init.py`

- [ ] **Step 1: Write the failing test**

Add to `tests/test_init.py` (import `DATA_CREATE_SWITCHES`, `CONF_CREATE_SWITCHES` from const):

```python
async def test_setup_stashes_create_switches_flag(hass):
    from custom_components.ambience.const import CONF_CREATE_SWITCHES, DATA_CREATE_SWITCHES, DOMAIN
    entry = MockConfigEntry(domain=DOMAIN, title="Ambience", data={},
                            options={CONF_CREATE_SWITCHES: True}, unique_id="amb_cs")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DATA_CREATE_SWITCHES] is True


async def test_setup_create_switches_defaults_false(hass):
    from custom_components.ambience.const import DATA_CREATE_SWITCHES, DOMAIN
    entry = MockConfigEntry(domain=DOMAIN, title="Ambience", data={}, options={},
                            unique_id="amb_cs_default")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DATA_CREATE_SWITCHES] is False
```

- [ ] **Step 2: Run to verify it fails**

Run: `python -m pytest tests/test_init.py::test_setup_stashes_create_switches_flag -q`
Expected: FAIL — `KeyError: 'create_switches_enabled'`.

- [ ] **Step 3: Implement the stash**

In `custom_components/ambience/__init__.py`:

1. Add `CONF_CREATE_SWITCHES`, `DATA_CREATE_SWITCHES`, `DEFAULT_CREATE_SWITCHES` to the `.const` import block.
2. In `async_setup_entry`, immediately after the `domain_data[DATA_EXPOSED_ASSISTANTS] = ...` assignment and **before** `await hass.config_entries.async_forward_entry_setups(entry, [Platform.SWITCH])`, add:

```python
    domain_data[DATA_CREATE_SWITCHES] = entry.options.get(
        CONF_CREATE_SWITCHES, DEFAULT_CREATE_SWITCHES
    )
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_init.py::test_setup_stashes_create_switches_flag tests/test_init.py::test_setup_create_switches_defaults_false -q`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/__init__.py tests/test_init.py
git commit -m "feat(switch): stash resolved create_switches flag in hass.data"
```

---

## Phase 2 — Gate switch creation + reconcile

### Task 4: Compatibility shim — switches-on test fixture

**Files:**
- Modify: `tests/conftest.py`
- Modify: `tests/test_switch_exposure.py`

> **Why:** The product default is OFF, but the bulk of the suite assumes switches exist (they were always created before this change). Flipping the shared `mock_config_entry` to switches-on preserves the pre-change behavior for those tests; the OFF default is verified by dedicated tests that build their own entries. This step is a no-op until Task 5 reads the flag, so the suite stays green throughout.

- [ ] **Step 1: Flip the shared fixture**

In `tests/conftest.py`, update `mock_config_entry` (add the const import at the top):

```python
from custom_components.ambience.const import CONF_CREATE_SWITCHES, DOMAIN


@pytest.fixture
def mock_config_entry() -> MockConfigEntry:
    """Mock config entry for the Ambience integration.

    Switches are ON here so the large body of switch-dependent tests keeps
    working; the product default (off) is exercised by tests that build their
    own entry with empty options.
    """
    return MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={CONF_CREATE_SWITCHES: True},
        unique_id="ambience_unique",
    )
```

- [ ] **Step 2: Fix the two directly-constructed exposure entries**

In `tests/test_switch_exposure.py`, the entries in `test_exposure_follows_entry_option` and `test_partial_option_map_defaults_to_unexposed` are built directly with `options={CONF_EXPOSED_ASSISTANTS: ...}`. Add `CONF_CREATE_SWITCHES: True` to each `options={...}` dict (import it from const), so their switches are created.

- [ ] **Step 3: Run the full suite to confirm still green**

Run: `python -m pytest tests/ -q`
Expected: PASS (no behavior change yet — the flag is not read until Task 5).

- [ ] **Step 4: Commit**

```bash
git add tests/conftest.py tests/test_switch_exposure.py
git commit -m "test(switch): default test config entry to switches-on (compat shim)"
```

---

### Task 5: Gate switch setup on the toggle + reconcile registry

**Files:**
- Modify: `custom_components/ambience/switch.py`
- Modify: `custom_components/ambience/__init__.py` (reuse the shared device remover)
- Create: `tests/test_switch_optional.py`

- [ ] **Step 1: Write the failing tests**

Create `tests/test_switch_optional.py`:

```python
"""create_switches gating + reconcile at platform setup."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import (
    CONF_CREATE_SWITCHES,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)


def _entry(hass, *, create_switches: bool, uid: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={CONF_CREATE_SWITCHES: create_switches},
        unique_id=uid,
    )
    entry.add_to_hass(hass)
    return entry


async def test_no_switches_created_when_toggle_off(hass: HomeAssistant) -> None:
    ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, create_switches=False, uid="off")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DATA_SWITCHES] == {}


async def test_switch_per_enabled_scope_when_toggle_on(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, create_switches=True, uid="on")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    keys = set(hass.data[DOMAIN][DATA_SWITCHES])
    assert ("house", None) in keys
    assert ("area", area.id) in keys


async def test_disabled_scope_gets_no_switch_when_toggle_on(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, create_switches=True, uid="on2")
    entry.add_to_hass(hass)
    # Disable the area's scope in the store BEFORE setup creates switches.
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("area", area.id, False)
    # Reload so setup re-runs the desired-set computation.
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert ("area", area.id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_reconcile_removes_switches_and_devices_when_toggle_off(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, create_switches=True, uid="flip")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is not None

    # Flip the toggle off and reload — the reconcile must delete every switch + device.
    hass.config_entries.async_update_entry(entry, options={CONF_CREATE_SWITCHES: False})
    await hass.async_block_till_done()

    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is None
    assert reg.async_get_entity_id("switch", DOMAIN, f"ambience_switch_area_{area.id}") is None
    dev_reg = dr.async_get(hass)
    assert dev_reg.async_get_device(identifiers={(DOMAIN, "ambience")}) is None
    assert dev_reg.async_get_device(identifiers={(DOMAIN, f"area_{area.id}")}) is None
```

- [ ] **Step 2: Run to verify they fail**

Run: `python -m pytest tests/test_switch_optional.py -q`
Expected: FAIL — `test_no_switches_created_when_toggle_off` finds switches (setup is not gated yet).

- [ ] **Step 3: Add helpers + gate `async_setup_entry` in `switch.py`**

In `custom_components/ambience/switch.py`:

1. Extend imports from `.const` to include `DATA_CREATE_SWITCHES`.
2. Add a shared device-remover and a runtime-build helper (place after `_entity_id_for`, before `async_setup_entry`):

```python
def _remove_scope_device(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> None:
    """Remove a scope's device from the device registry (no-op if absent)."""
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_device(identifiers=_device_identifiers(scope_kind, scope_id))
    if device is not None:
        dev_reg.async_remove_device(device.id)


def make_scope_switch(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None
) -> AmbienceScopeSwitch:
    """Build a switch for a scope, resolving its display name from the registry.
    Used by the platform setup and the runtime create-on-enable path."""
    if scope_kind == "house":
        return AmbienceScopeSwitch("house", None, "house")
    if scope_kind == "floor":
        floor = fr.async_get(hass).async_get_floor(scope_id)
        return AmbienceScopeSwitch("floor", scope_id, floor.name if floor else str(scope_id))
    area = ar.async_get(hass).async_get_area(scope_id)
    return AmbienceScopeSwitch("area", scope_id, area.name if area else str(scope_id))


def _desired_switch_scopes(
    hass: HomeAssistant, store: Any, create_switches: bool
) -> set[tuple[str, str | None]]:
    """Scope keys that should have a switch: empty when the toggle is off, else the
    house plus every ENABLED floor/area."""
    if not create_switches:
        return set()
    desired: set[tuple[str, str | None]] = set()
    if store.get_scope_enabled("house", None):
        desired.add(("house", None))
    for floor in fr.async_get(hass).async_list_floors():
        if store.get_scope_enabled("floor", floor.floor_id):
            desired.add(("floor", floor.floor_id))
    for area in ar.async_get(hass).async_list_areas():
        if store.get_scope_enabled("area", area.id):
            desired.add(("area", area.id))
    return desired


def _reconcile_switch_registry(
    hass: HomeAssistant, entry: ConfigEntry, desired: set[tuple[str, str | None]]
) -> None:
    """Delete any registered Ambience scope switch (and its device) whose scope is
    not in *desired*. Covers the toggle being off, disabled scopes, scopes removed
    while HA was down, and legacy hidden entities from the old hide approach."""
    registry = er.async_get(hass)
    for ent in er.async_entries_for_config_entry(registry, entry.entry_id):
        if ent.domain != "switch" or ent.platform != DOMAIN:
            continue
        scope = scope_for_unique_id(ent.unique_id)
        if scope is None or scope in desired:
            continue
        registry.async_remove(ent.entity_id)
        _remove_scope_device(hass, scope[0], scope[1])
```

3. Add the missing import `from homeassistant.helpers import entity_registry as er` and `from .const import DATA_STORE` (already imported). Confirm `DATA_STORE` is in the `.const` import (it is).
4. Replace the body of `async_setup_entry` with:

```python
async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Create a switch for each enabled scope when create_switches is on; reconcile
    the entity registry to match (deleting any switch that should not exist)."""
    hass.data[DOMAIN][DATA_SWITCH_ADD_ENTITIES] = async_add_entities
    hass.data[DOMAIN].setdefault(DATA_SWITCHES, {})

    store = hass.data[DOMAIN][DATA_STORE]
    create_switches = hass.data[DOMAIN].get(DATA_CREATE_SWITCHES, False)
    desired = _desired_switch_scopes(hass, store, create_switches)

    if desired:
        async_add_entities(
            [make_scope_switch(hass, kind, sid) for (kind, sid) in desired]
        )
    _reconcile_switch_registry(hass, entry, desired)
```

- [ ] **Step 4: Reuse the shared device remover in `__init__.py`**

In `custom_components/ambience/__init__.py`, delete the local `_remove_scope_device` function (lines ~117-124) and instead import it: add `_remove_scope_device` to the existing `from .switch import ...` line (currently `from .switch import scope_for_unique_id`). Result: `from .switch import _remove_scope_device, scope_for_unique_id`.

- [ ] **Step 5: Run the new tests + the existing switch suite**

Run: `python -m pytest tests/test_switch_optional.py tests/test_switch_entity.py tests/test_init.py -q`
Expected: PASS.

- [ ] **Step 6: Run the full suite**

Run: `python -m pytest tests/ -q`
Expected: PASS. (The compat shim from Task 4 keeps switch-dependent tests green.)

- [ ] **Step 7: Lint + commit**

```bash
ruff check custom_components/ambience/switch.py custom_components/ambience/__init__.py && ruff format custom_components/ambience/switch.py custom_components/ambience/__init__.py
git add custom_components/ambience/switch.py custom_components/ambience/__init__.py tests/test_switch_optional.py
git commit -m "feat(switch): gate switch creation on create_switches + reconcile registry"
```

---

### Task 6: Gate area/floor create handlers on the toggle

**Files:**
- Modify: `custom_components/ambience/__init__.py`
- Test: `tests/test_switch_optional.py`

- [ ] **Step 1: Write the failing tests**

Add to `tests/test_switch_optional.py`:

```python
async def test_area_create_makes_no_switch_when_toggle_off(hass: HomeAssistant) -> None:
    entry = _entry(hass, create_switches=False, uid="off_create")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    area = ar.async_get(hass).async_create("Late Room")
    await hass.async_block_till_done()
    assert ("area", area.id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_area_create_makes_switch_when_toggle_on(hass: HomeAssistant) -> None:
    entry = _entry(hass, create_switches=True, uid="on_create")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    area = ar.async_get(hass).async_create("Late Room")
    await hass.async_block_till_done()
    assert ("area", area.id) in hass.data[DOMAIN][DATA_SWITCHES]
```

- [ ] **Step 2: Run to verify failure**

Run: `python -m pytest tests/test_switch_optional.py::test_area_create_makes_no_switch_when_toggle_off -q`
Expected: FAIL — a switch is created even with the toggle off.

- [ ] **Step 3: Gate both create handlers**

In `custom_components/ambience/__init__.py`, in `_handle_area_registry_update`, change the `create` branch so the add is gated:

```python
        if action == "create":
            from .switch import make_scope_switch

            add_entities = domain_data.get(DATA_SWITCH_ADD_ENTITIES)
            area = area_reg.async_get_area(area_id)
            if (
                domain_data.get(DATA_CREATE_SWITCHES)
                and add_entities is not None
                and area is not None
            ):
                add_entities([make_scope_switch(hass, "area", area_id)])
            return
```

Apply the identical change to `_handle_floor_registry_update`'s `create` branch, using `make_scope_switch(hass, "floor", floor_id)` and `floor_reg.async_get_floor(floor_id)` for the existence guard.

(This also replaces the inline `AmbienceScopeSwitch("area"/"floor", ...)` construction with `make_scope_switch`, keeping name-resolution in one place.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_switch_optional.py -q`
Expected: PASS.

- [ ] **Step 5: Run the area/floor-event suite**

Run: `python -m pytest tests/test_init.py tests/test_e2e_apply_scene.py -q`
Expected: PASS.

- [ ] **Step 6: Lint + commit**

```bash
ruff check custom_components/ambience/__init__.py && ruff format custom_components/ambience/__init__.py
git add custom_components/ambience/__init__.py tests/test_switch_optional.py
git commit -m "feat(switch): gate area/floor switch creation on create_switches"
```

---

## Phase 3 — Disable deletes / enable recreates

### Task 7: Rework `_ws_set_scope_enabled`

**Files:**
- Modify: `custom_components/ambience/websocket.py`
- Modify: `tests/test_websocket_switch.py`

- [ ] **Step 1: Rewrite the affected tests (failing)**

In `tests/test_websocket_switch.py`, replace the three legacy hide-based tests
(`test_set_scope_enabled_hides_switch_but_keeps_it_loaded`,
`test_set_scope_enabled_unhides_on_reenable`,
`test_set_scope_enabled_heals_legacy_disabled`) with the new delete/recreate tests, and add the toggle-off case:

```python
async def test_set_scope_enabled_deletes_switch_on_disable(hass, installed, hass_ws_client):
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    resp = await _ws_send(
        hass_ws_client, type="ambience/set_scope_enabled", house=True, enabled=False
    )
    assert resp["success"]
    await hass.async_block_till_done()

    reg = er.async_get(hass)
    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is None
    assert ("house", None) not in hass.data[DOMAIN][DATA_SWITCHES]
    assert dr.async_get(hass).async_get_device(identifiers={(DOMAIN, "ambience")}) is None
    assert hass.data[DOMAIN][DATA_STORE].get_scope_enabled("house", None) is False


async def test_set_scope_enabled_recreates_switch_on_reenable(hass, installed, hass_ws_client):
    from homeassistant.helpers import entity_registry as er

    for enabled in (False, True):
        resp = await _ws_send(
            hass_ws_client, type="ambience/set_scope_enabled", house=True, enabled=enabled
        )
        assert resp["success"]
        await hass.async_block_till_done()

    reg = er.async_get(hass)
    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is not None
    assert ("house", None) in hass.data[DOMAIN][DATA_SWITCHES]
    assert hass.data[DOMAIN][DATA_STORE].get_scope_enabled("house", None) is True


async def test_set_scope_enabled_no_switch_work_when_toggle_off(hass, hass_ws_client):
    # Toggle OFF: enabling/disabling a scope persists the flag but never creates a switch.
    from custom_components.ambience.const import CONF_CREATE_SWITCHES
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    entry = MockConfigEntry(domain=DOMAIN, title="Ambience", data={},
                            options={CONF_CREATE_SWITCHES: False}, unique_id="ws_off")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    resp = await _ws_send(
        hass_ws_client, type="ambience/set_scope_enabled", house=True, enabled=True
    )
    assert resp["success"]
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is None
    assert hass.data[DOMAIN][DATA_STORE].get_scope_enabled("house", None) is True
```

Leave `test_set_scope_enabled_noop_when_switch_unregistered`,
`test_set_scope_enabled_rejects_unregistered_area_id`, and
`test_set_scope_enabled_requires_one_scope` as-is. Update
`test_set_scope_enabled_enable_already_enabled_applies_no_heal` to simply assert the
switch is still present and the call succeeds (remove the `hidden_by` assertion).

- [ ] **Step 2: Run to verify failure**

Run: `python -m pytest tests/test_websocket_switch.py::test_set_scope_enabled_deletes_switch_on_disable -q`
Expected: FAIL — the switch is hidden (still registered), not deleted.

- [ ] **Step 3: Rewrite the handler block**

In `custom_components/ambience/websocket.py`:

1. Add imports: `DATA_CREATE_SWITCHES` and `DATA_SWITCH_ADD_ENTITIES` to the `.const` import; and `from .switch import _remove_scope_device, make_scope_switch, switch_unique_id` (extend the existing `from .switch import switch_unique_id`).
2. Replace the hide/heal block in `_ws_set_scope_enabled` (the `registry = er.async_get(hass)` ... `registry.async_update_entity(entity_id, hidden_by=...)` section) with:

```python
    # Switch lifecycle follows enabled-ness when switches are turned on: disabling a
    # scope DELETES its switch (and device); enabling recreates it. No clutter from
    # hidden entities. When the create_switches toggle is off there is nothing to do.
    if hass.data[DOMAIN].get(DATA_CREATE_SWITCHES):
        registry = er.async_get(hass)
        entity_id = registry.async_get_entity_id(
            "switch", DOMAIN, switch_unique_id(scope_kind, scope_id)
        )
        if enabled:
            if entity_id is None:
                add_entities = hass.data[DOMAIN].get(DATA_SWITCH_ADD_ENTITIES)
                if add_entities is not None:
                    add_entities([make_scope_switch(hass, scope_kind, scope_id)])
        elif entity_id is not None:
            registry.async_remove(entity_id)
            _remove_scope_device(hass, scope_kind, scope_id)
```

Keep the subsequent `if enabled:` block (rearm rechecks + `async_apply_scene`) unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_websocket_switch.py -q`
Expected: PASS.

- [ ] **Step 5: Lint + commit**

```bash
ruff check custom_components/ambience/websocket.py && ruff format custom_components/ambience/websocket.py
git add custom_components/ambience/websocket.py tests/test_websocket_switch.py
git commit -m "feat(switch): delete switch on scope disable, recreate on enable"
```

---

## Phase 4 — Frontend

### Task 8: Refresh the switch list after the enable/disable toggle

**Files:**
- Modify: `frontend/src/views/scopes-view.ts`
- Modify: `test/scopes-view.test.ts`

- [ ] **Step 1: Write the failing test**

In `test/scopes-view.test.ts`, the `api` mock already stubs `setScopeEnabled`. Add a spy expectation on the store's `refreshSwitches`. Add this test in the "scope-header switch toggle" block (after `test("toggling an enabled scope writes setScopeEnabled(false)")`):

```javascript
  test("toggling a scope refreshes the switch list (so the pause timer follows)", async () => {
    el = await mount({ areaConfigs: { living_room: { scenes: [], enabled: true } } });
    const spy = vi.spyOn((el as any)._store, "refreshSwitches");
    const lr = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='living_room']"));
    lr.checked = false;
    lr.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(spy).toHaveBeenCalled();
  });
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- run test/scopes-view.test.ts`
Expected: FAIL — `refreshSwitches` not called.

- [ ] **Step 3: Call `refreshSwitches` in the toggle handler**

In `frontend/src/views/scopes-view.ts`, in `_renderScopeSwitch`'s `onChange`, after the successful `reloadScope`, refresh the switch list so a switch created on re-enable (or removed on disable) is reflected:

```typescript
    const onChange = async (e: Event) => {
      e.stopPropagation();
      try {
        await setScopeEnabled(this.hass, scope, !enabled);
        await this._store.reloadScope(scope);
        await this._store.refreshSwitches();
      } catch (err) {
        this._store.error = (err as Error).message || String(err);
      }
    };
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- run test/scopes-view.test.ts`
Expected: PASS.

- [ ] **Step 5: Rebuild the bundle + lint**

Run: `npm run build && npm run ci`
Expected: build succeeds; Biome reports no issues.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/views/scopes-view.ts test/scopes-view.test.ts custom_components/ambience/frontend
git commit -m "feat(frontend): refresh switch list after scope enable/disable toggle"
```

---

## Phase 5 — `apply_scene` service redesign

### Task 9: New service schema

**Files:**
- Modify: `custom_components/ambience/__init__.py`
- Modify: `tests/test_apply_scene_schema.py` (rewrite)

- [ ] **Step 1: Rewrite the schema tests (failing)**

Replace the entire contents of `tests/test_apply_scene_schema.py`:

```python
"""Validation rules for the apply_scene service schema (scope-id targeting)."""

from __future__ import annotations

import pytest
import voluptuous as vol

from custom_components.ambience import _APPLY_SCENE_SCHEMA


def test_empty_is_valid():
    # No target => all scopes; the schema permits an empty call.
    assert _APPLY_SCENE_SCHEMA({}) == {}


def test_areas_and_floors_coerced_to_lists():
    out = _APPLY_SCENE_SCHEMA({"areas": "living_room", "floors": ["ground"]})
    assert out["areas"] == ["living_room"]
    assert out["floors"] == ["ground"]


def test_house_boolean_accepted():
    assert _APPLY_SCENE_SCHEMA({"house": True})["house"] is True


def test_category_and_scene_multiple():
    out = _APPLY_SCENE_SCHEMA({"category": ["lighting", "blinds"], "scene": "Movie"})
    assert out["category"] == ["lighting", "blinds"]
    assert out["scene"] == ["Movie"]


def test_force_accepted():
    assert _APPLY_SCENE_SCHEMA({"force": True})["force"] is True


def test_scene_without_category_is_now_valid():
    # The old "scene requires category" rule is gone; scenes resolve their own category.
    assert _APPLY_SCENE_SCHEMA({"scene": "Movie"})["scene"] == ["Movie"]


def test_house_must_be_boolean():
    with pytest.raises(vol.Invalid):
        _APPLY_SCENE_SCHEMA({"house": "yes"})
```

- [ ] **Step 2: Run to verify failure**

Run: `python -m pytest tests/test_apply_scene_schema.py -q`
Expected: FAIL — the current schema requires `scope` and rejects `{}`.

- [ ] **Step 3: Replace the schema**

In `custom_components/ambience/__init__.py`:

1. Delete `_scene_requires_category` (function) and the `_APPLY_SCENE_SCHEMA = vol.All(vol.Schema({...}), _scene_requires_category)` definition.
2. Add the new schema in its place:

```python
_APPLY_SCENE_SCHEMA = vol.Schema(
    {
        vol.Optional("areas"): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("floors"): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("house"): cv.boolean,
        vol.Optional("category"): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("scene"): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("force"): cv.boolean,
    }
)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_apply_scene_schema.py -q`
Expected: PASS.

> The service *handler* still references `call.data["scope"]` at this point, so e2e service tests will fail until Task 10. That is expected; do not run the full suite yet. Commit the schema with its unit tests.

- [ ] **Step 5: Lint + commit**

```bash
ruff check custom_components/ambience/__init__.py && ruff format custom_components/ambience/__init__.py
git add custom_components/ambience/__init__.py tests/test_apply_scene_schema.py
git commit -m "feat(service): scope-id apply_scene schema (areas/floors/house, multi category/scene)"
```

---

### Task 10: Scope-resolution + named-scene planning helpers

**Files:**
- Modify: `custom_components/ambience/service.py`
- Create: `tests/test_apply_scene_targeting.py`

- [ ] **Step 1: Write the failing unit tests for the helpers**

Create `tests/test_apply_scene_targeting.py`:

```python
"""Unit tests for apply_scene scope resolution + named-scene planning."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.service import _plan_named_scenes, _resolve_target_scopes


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry: MockConfigEntry):
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def test_resolve_explicit_scopes(hass, installed):
    area = ar.async_get(hass).async_create("LR")
    floor = fr.async_get(hass).async_create("Ground")
    scopes = _resolve_target_scopes(hass, {"areas": [area.id], "floors": [floor.floor_id], "house": True})
    assert set(scopes) == {("area", area.id), ("floor", floor.floor_id), ("house", None)}


async def test_resolve_blank_means_all(hass, installed):
    area = ar.async_get(hass).async_create("LR")
    await hass.async_block_till_done()
    scopes = _resolve_target_scopes(hass, {})
    assert ("house", None) in scopes
    assert ("area", area.id) in scopes


async def test_resolve_unknown_area_raises(hass, installed):
    with pytest.raises(ServiceValidationError):
        _resolve_target_scopes(hass, {"areas": ["ghost"]})


async def test_plan_named_scene_resolves_category(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area("lr", {"scenes": [
        {"name": "Movie", "category": "lighting", "when": {}, "actions": []},
    ]})
    plan = _plan_named_scenes(hass, [("area", "lr")], ["Movie"], None)
    assert plan == [("area", "lr", "lighting", "Movie")]


async def test_plan_absent_name_skipped(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area("lr", {"scenes": [
        {"name": "Movie", "category": "lighting", "when": {}, "actions": []},
    ]})
    assert _plan_named_scenes(hass, [("area", "lr")], ["Nope"], None) == []


async def test_plan_ambiguous_name_raises(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area("lr", {"scenes": [
        {"name": "Movie", "category": "lighting", "when": {}, "actions": []},
        {"name": "Movie", "category": "blinds", "when": {}, "actions": []},
    ]})
    with pytest.raises(ServiceValidationError):
        _plan_named_scenes(hass, [("area", "lr")], ["Movie"], None)


async def test_plan_category_narrows_eligibility(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area("lr", {"scenes": [
        {"name": "Movie", "category": "lighting", "when": {}, "actions": []},
        {"name": "Movie", "category": "blinds", "when": {}, "actions": []},
    ]})
    # Narrowing to one category makes the otherwise-ambiguous name resolve.
    plan = _plan_named_scenes(hass, [("area", "lr")], ["Movie"], ["lighting"])
    assert plan == [("area", "lr", "lighting", "Movie")]
```

- [ ] **Step 2: Run to verify failure**

Run: `python -m pytest tests/test_apply_scene_targeting.py -q`
Expected: FAIL — `ImportError: cannot import name '_resolve_target_scopes'`.

- [ ] **Step 3: Implement the helpers in `service.py`**

In `custom_components/ambience/service.py`:

1. Ensure these imports exist at the top (add any missing): `from homeassistant.helpers import area_registry as ar`, `from homeassistant.helpers import floor_registry as fr`, `from homeassistant.exceptions import ServiceValidationError`.
2. Add the helpers (place near `category_ids`, after the existing module-level helpers):

```python
def _resolve_target_scopes(
    hass: HomeAssistant, data: dict[str, Any]
) -> list[tuple[str, str | None]]:
    """Map the service's targeting fields to a list of (scope_kind, scope_id).

    Validates area/floor ids against the registries (unknown -> ServiceValidationError).
    A blank target (no areas/floors/house) means every scope.
    """
    area_reg = ar.async_get(hass)
    floor_reg = fr.async_get(hass)
    scopes: list[tuple[str, str | None]] = []
    for area_id in data.get("areas", []):
        if area_reg.async_get_area(area_id) is None:
            raise ServiceValidationError(f"unknown area: {area_id}")
        scopes.append(("area", area_id))
    for floor_id in data.get("floors", []):
        if floor_reg.async_get_floor(floor_id) is None:
            raise ServiceValidationError(f"unknown floor: {floor_id}")
        scopes.append(("floor", floor_id))
    if data.get("house"):
        scopes.append(("house", None))
    if not scopes:
        scopes.append(("house", None))
        scopes.extend(("floor", f.floor_id) for f in floor_reg.async_list_floors())
        scopes.extend(("area", a.id) for a in area_reg.async_list_areas())
    return scopes


def _plan_named_scenes(
    hass: HomeAssistant,
    scopes: list[tuple[str, str | None]],
    scenes: list[str],
    categories: list[str] | None,
) -> list[tuple[str, str | None, str, str]]:
    """Resolve each (scope, scene-name) to the single category that contains it.

    Returns (scope_kind, scope_id, category, scene_name) tuples. A name absent in a
    scope is skipped; a name found in >1 eligible category raises (nothing applied).
    `categories`, when given, narrows the eligible categories.
    """
    store = hass.data[DOMAIN][DATA_STORE]
    eligible = set(categories) if categories else None
    plan: list[tuple[str, str | None, str, str]] = []
    for scope_kind, scope_id in scopes:
        cfg = store.scope_config(scope_kind, scope_id)
        for name in scenes:
            target = name.strip().lower()
            cats = {
                scene["category"]
                for scene in cfg.get("scenes", [])
                if isinstance(scene.get("name"), str)
                and scene["name"].strip().lower() == target
                and scene.get("category") is not None
                and (eligible is None or scene["category"] in eligible)
            }
            if not cats:
                _LOGGER.info(
                    "ambience: apply_scene scene %r not found in scope %s/%s — skipping",
                    name,
                    scope_kind,
                    scope_id,
                )
                continue
            if len(cats) > 1:
                raise ServiceValidationError(
                    f"scene {name!r} exists in multiple categories {sorted(cats)} "
                    f"in scope {scope_kind}/{scope_id}; specify `category`"
                )
            plan.append((scope_kind, scope_id, next(iter(cats)), name))
    return plan
```

- [ ] **Step 4: Run the helper tests**

Run: `python -m pytest tests/test_apply_scene_targeting.py -q`
Expected: PASS.

- [ ] **Step 5: Lint + commit**

```bash
ruff check custom_components/ambience/service.py && ruff format custom_components/ambience/service.py
git add custom_components/ambience/service.py tests/test_apply_scene_targeting.py
git commit -m "feat(service): scope-resolution + named-scene planning helpers"
```

---

### Task 11: Wire the new handler + services.yaml + migrate e2e tests

**Files:**
- Modify: `custom_components/ambience/__init__.py` (`_handle_apply_scene`)
- Modify: `custom_components/ambience/services.yaml`
- Modify: `tests/test_e2e_apply_scene.py` and any other test calling the `apply_scene` service.

- [ ] **Step 1: Rewrite the handler**

In `custom_components/ambience/__init__.py`:

1. Add to the `.service` import: `_plan_named_scenes`, `_resolve_target_scopes` (extend `from .service import async_apply_named_scene, async_apply_scene, clear_last_applied`).
2. Replace `_handle_apply_scene` with:

```python
    async def _handle_apply_scene(call: ServiceCall) -> None:
        scopes = _resolve_target_scopes(hass, call.data)
        categories = call.data.get("category")
        scenes = call.data.get("scene")
        force = call.data.get("force", False)
        if scenes:
            # Validate the whole plan first so an ambiguous name aborts before any apply.
            plan = _plan_named_scenes(hass, scopes, scenes, categories)
            for scope_kind, scope_id, category, name in plan:
                await async_apply_named_scene(
                    hass, scope_kind, scope_id, category, name, force=force
                )
        elif categories:
            for scope_kind, scope_id in scopes:
                for category in categories:
                    await async_apply_scene(
                        hass, scope_kind, scope_id, category=category, force=force
                    )
        else:
            for scope_kind, scope_id in scopes:
                await async_apply_scene(hass, scope_kind, scope_id, category=None, force=force)
```

(`scope_for_unique_id` may now be unused in `__init__.py`. If lint flags it, remove it from the `from .switch import ...` line — but keep the `_remove_scope_device` import added in Task 5.)

- [ ] **Step 2: Rewrite `services.yaml`**

Replace the contents of `custom_components/ambience/services.yaml` with:

```yaml
apply_scene:
  name: Apply scene
  description: >-
    Apply Ambience scenes to one or more scopes. With no scope selected, targets
    every scope. With no category, re-runs the rules for every category. With one
    or more categories, limits to those. With scene names, applies those named
    scenes' actions directly (each resolved to the category that contains it),
    bypassing their conditions.
  fields:
    areas:
      name: Areas
      description: Area scopes to apply in.
      required: false
      selector:
        area:
          multiple: true
    floors:
      name: Floors
      description: Floor scopes to apply in.
      required: false
      selector:
        floor:
          multiple: true
    house:
      name: House
      description: Also apply at the house scope.
      required: false
      selector:
        boolean: {}
    category:
      name: Categories
      description: Limit the apply to these scene categories (by category id).
      required: false
      selector:
        text:
          multiple: true
    scene:
      name: Scenes
      description: >-
        Apply these named scenes' actions directly, bypassing their conditions.
        Each name is resolved to the category that contains it.
      required: false
      selector:
        text:
          multiple: true
    force:
      name: Force
      description: Apply even when a scope's switch is paused.
      required: false
      default: false
      selector:
        boolean: {}
```

- [ ] **Step 3: Migrate e2e service-call tests**

In `tests/test_e2e_apply_scene.py`:

- Replace the `_house_scope` helper body so it returns nothing meaningful is no longer needed; instead call the service with `{"house": True}`.
- `_make_area_scope` returns `(area_id, switch_entity_id)`; the switch id is no longer used for the service call — keep the helper but call the service with `{"areas": [area_id]}`.

Apply these exact transformations to the service-call sites:

| Old call | New call |
|---|---|
| `{"scope": scope}` | `{"areas": [area_id]}` |
| `{"scope": _house_scope(hass)}` | `{"house": True}` |
| `{"scope": scope, "category": "lighting"}` | `{"areas": [area_id], "category": ["lighting"]}` |
| `{"scope": scope, "category": "lighting", "scene": "Bright"}` | `{"areas": [area_id], "scene": ["Bright"]}` |

Replace the three now-obsolete schema/validation tests:

- `test_apply_scene_accepts_scope_switch` → rewrite as `test_apply_scene_house_target_is_clean_noop` calling `{"house": True}`.
- `test_apply_scene_rejects_unknown_scope_entity` → rewrite as:

```python
async def test_apply_scene_rejects_unknown_area(hass, installed):
    from homeassistant.exceptions import ServiceValidationError

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "apply_scene", {"areas": ["ghost_area"]}, blocking=True
        )
```

- `test_apply_scene_rejects_missing_scope` → **delete** (an empty call is now valid = all scopes). Replace with:

```python
async def test_apply_scene_empty_targets_all_scopes_noop(hass, installed):
    # No target and no configured scenes => clean no-op across every scope.
    await hass.services.async_call(DOMAIN, "apply_scene", {}, blocking=True)
```

- `test_apply_scene_rejects_scene_without_category` → **delete** (scene no longer requires category).

For `test_apply_scene_rejects_non_admin_user` and `test_apply_scene_allows_admin_user`, replace `{"scope": _house_scope(hass)}` with `{"house": True}`.

- [ ] **Step 4: Add new multi-target behavior tests**

Append to `tests/test_e2e_apply_scene.py`:

```python
async def test_apply_scene_multi_scope_and_named_scene(hass, installed):
    store = hass.data[DOMAIN][DATA_STORE]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    a1, _ = await _make_area_scope(hass, "Room A")
    a2, _ = await _make_area_scope(hass, "Room B")
    for aid in (a1, a2):
        await store.async_save_area(aid, {"scenes": [
            {"name": "Movie", "category": "lighting", "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.nope", "states": ["on"]}},
             "actions": [{"service": "light.turn_on", "entity_ids": ["light.l"], "params": {}}]},
        ]})
    calls = async_mock_service(hass, "light", "turn_on")

    await hass.services.async_call(
        DOMAIN, "apply_scene", {"areas": [a1, a2], "scene": ["Movie"]}, blocking=True
    )
    # Named scene bypasses the never-true predicate, applied once per targeted scope.
    assert len(calls) == 2


async def test_apply_scene_ambiguous_named_scene_raises_before_applying(hass, installed):
    from homeassistant.exceptions import ServiceValidationError

    store = hass.data[DOMAIN][DATA_STORE]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    aid, _ = await _make_area_scope(hass, "Ambi Room")
    await store.async_save_area(aid, {"scenes": [
        {"name": "Movie", "category": "lighting", "when": {},
         "actions": [{"service": "light.turn_on", "entity_ids": ["light.l"], "params": {}}]},
        {"name": "Movie", "category": "blinds", "when": {},
         "actions": [{"service": "light.turn_on", "entity_ids": ["light.l"], "params": {}}]},
    ]})
    calls = async_mock_service(hass, "light", "turn_on")
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "apply_scene", {"areas": [aid], "scene": ["Movie"]}, blocking=True
        )
    assert len(calls) == 0  # nothing applied before the abort
```

- [ ] **Step 5: Find and migrate any other service-call sites**

Run: `grep -rln 'apply_scene", {"scope"\|"apply_scene",' tests/`
For every remaining `hass.services.async_call(DOMAIN, "apply_scene", {"scope": ...})`, apply the transformation table from Step 3. Check especially `tests/test_apply_scene_force.py` — replace `{"scope": <switch>, "force": True}` with `{"house": True, "force": True}` (or `{"areas": [area_id], "force": True}` if it targets an area).

- [ ] **Step 6: Run the service suite**

Run: `python -m pytest tests/test_e2e_apply_scene.py tests/test_apply_scene_force.py tests/test_apply_scene_schema.py tests/test_apply_scene_targeting.py -q`
Expected: PASS.

- [ ] **Step 7: Run the full suite**

Run: `python -m pytest tests/ -q`
Expected: PASS.

- [ ] **Step 8: Lint + commit**

```bash
ruff check custom_components/ambience && ruff format custom_components/ambience
git add custom_components/ambience/__init__.py custom_components/ambience/services.yaml tests/
git commit -m "feat(service): apply_scene targets scopes by area/floor/house with multi category/scene"
```

---

## Phase 6 — Docs + final verification

### Task 12: Update README / service docs + full gate

**Files:**
- Modify: any user-facing docs that mention the switches or the `apply_scene` service (search first).

- [ ] **Step 1: Find docs referencing the old behavior**

Run: `grep -rln "apply_scene\|scope switch\|Ambience switch\|switch.*_ambience" README.md docs/ 2>/dev/null | grep -v superpowers`

- [ ] **Step 2: Update found docs**

For each hit, update to reflect: (a) switches are opt-in via the **Create per-scope switches** option (default off); (b) `apply_scene` now takes `areas`/`floors`/`house` + multi `category`/`scene` instead of a `scope` switch entity. Keep edits factual and scoped to what changed.

- [ ] **Step 3: Run the complete backend + frontend gate**

Run: `python -m pytest tests/ -q && ruff check . && ruff format --check . && npm run ci && npm run build`
Expected: all pass; bundle rebuilt.

- [ ] **Step 4: Confirm the built bundle is committed**

Run: `git status --porcelain custom_components/ambience/frontend`
Expected: empty (the rebuilt bundle from Task 8 was committed; if `npm run build` changed anything here, commit it).

- [ ] **Step 5: Commit any doc/bundle changes**

```bash
git add -A
git commit -m "docs: optional switches + scope-id apply_scene"
```

---

## Self-Review notes (for the implementer)

- **Spec coverage:** Part A (toggle, invariant, reconcile, runtime create/delete, frontend) → Tasks 1-8. Part B (service schema, targeting, multi-scene) → Tasks 9-11. Docs → Task 12.
- **Compatibility shim is load-bearing:** Task 4 must land before Task 5, or the existing switch suite goes red. It is intentionally a no-op until Task 5 reads the flag.
- **Coverage gate (99%):** new branches (toggle off vs on, disable-delete vs enable-recreate, absent vs ambiguous scene, blank-vs-explicit targeting) are all covered by the listed tests. If coverage drops, add the missing branch's test rather than lowering the gate.
- **Type consistency:** helper names are stable across tasks — `make_scope_switch`, `_desired_switch_scopes`, `_reconcile_switch_registry`, `_remove_scope_device` (switch.py); `_resolve_target_scopes`, `_plan_named_scenes` (service.py); `DATA_CREATE_SWITCHES`, `CONF_CREATE_SWITCHES`, `DEFAULT_CREATE_SWITCHES` (const.py).
