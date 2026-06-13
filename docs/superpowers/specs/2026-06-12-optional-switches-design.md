# Optional Ambience switches + scope-id `apply_scene` — design

## Problem

Today the integration auto-generates an `AmbienceScopeSwitch` entity (and a device)
for the house + every HA floor + every HA area, unconditionally. Disabling a scope
*hides* its switch. For users who don't want the switches, this is permanent
clutter (entities, devices, and the per-scope pause timer in the panel header).

We want:

1. A config toggle (default **off**) that controls whether the switches are
   generated at all. When off: no switch entities, no devices, no pause timers.
2. When on: a switch exists for every **enabled** scope. Disabling a scope
   **deletes** its switch (not hide); re-enabling recreates it.
3. The `apply_scene` HA service currently selects its scope by a switch
   `entity_id`. With switches off by default it would have nothing to target, so
   the service must be reworked to address scopes directly (by area/floor id +
   a house flag), independent of whether switches exist.

## Decisions (locked)

- **Default off for everyone.** No config-entry migration / version bump. Existing
  entries have no option set → default `False` → their auto-generated switches are
  cleaned up on the first post-upgrade reload. (Accepted: this breaks any automation
  that referenced a `switch.*_ambience` entity, and the pause feature, until the user
  turns the toggle on.)
- **Only the pause timer is gated** in the scope header. The per-scope enable/disable
  toggle (the `ha-switch` that writes `cfg.enabled`) stays always-visible — it is the
  only way to disable a scope, which the feature itself relies on.
- **Switch deletion includes the device.** Mirrors the existing area/floor-removal
  cleanup (`_remove_scope_device`); keeps the registry clutter-free. (Accepted: a user
  rename of a switch entity is lost across a disable→enable cycle, since the entity is
  deleted rather than hidden.)
- **Service targets scopes by id, not by entity.** `areas` (area selector, multiple),
  `floors` (floor selector, multiple), `house` (boolean). HA's `target` selector cannot
  be restricted to areas+floors only (its only filters are entity/device), and a custom
  dynamic dropdown of "enabled scopes only" is not viable in the HA service UI (service
  descriptions are static / client-cached). Area/floor ids are exactly the ids Ambience
  already uses as scope ids.
- **`scope`/entity field is dropped** from the service (breaking change). It could not
  work with switches off, and standardizing on scope-id targeting matches every
  websocket command (`_parse_scope`).
- **Multi-value `scene` resolves its own category.** A category is a single control
  loop showing one scene; you can't apply several scenes to one category. So each named
  scene is applied in the category that contains it.

## Part A — Optional switches

### Invariant

> A scope has a switch entity (and device) **iff** `create_switches AND scope.enabled`.

### New option

- `const.py`: `CONF_CREATE_SWITCHES = "create_switches"`, `DEFAULT_CREATE_SWITCHES = False`,
  and a hass.data key `DATA_CREATE_SWITCHES = "create_switches"`.
- `config_flow.py`: add `vol.Required(CONF_CREATE_SWITCHES, default=current)` to the
  options form; persist it in the created entry `data` alongside `show_sidebar_panel`
  and `exposed_assistants`.
- `strings.json` + `translations/en.json`: label + description for `create_switches`
  under `options.step.init.data` / `data_description`.
- `__init__.async_setup_entry`: stash
  `domain_data[DATA_CREATE_SWITCHES] = entry.options.get(CONF_CREATE_SWITCHES, DEFAULT_CREATE_SWITCHES)`
  **before** `async_forward_entry_setups(entry, [Platform.SWITCH])`, so the platform
  setup and runtime handlers can read it. An options change already reloads the entry
  (`_async_update_listener`), so the toggle takes effect via the reconcile below.

### Switch platform setup + reconcile (`switch.async_setup_entry`)

1. Read `create_switches` from hass.data (or `entry.options`).
2. Build the **desired** set of scope keys:
   - `{}` when `create_switches` is false.
   - else `{("house", None)}` if the house scope is enabled, plus each floor/area whose
     scope is enabled (`store.get_scope_enabled(...)`).
3. `async_add_entities` an `AmbienceScopeSwitch` for each desired scope (idempotent on
   reload — HA reuses the registry entry by `unique_id`).
4. **Reconcile removals:** for every entity registered to this config entry in the
   `switch` domain on platform `DOMAIN` (`er.async_entries_for_config_entry`), map its
   `unique_id` back to a scope via `scope_for_unique_id`; if that scope is **not** in the
   desired set, `registry.async_remove(entity_id)` and remove its scope device
   (`_remove_scope_device`). This single pass handles toggle-off (remove all), toggle-on
   with disabled scopes, scopes removed while HA was down, and legacy hidden entities.

   Desired-add and reconcile-remove operate on disjoint scope sets, so there is no race
   with the in-flight `async_add_entities`.

### Runtime: scope enable/disable (`_ws_set_scope_enabled`)

Replace the current hide/heal block ([websocket.py:880-902](../../../custom_components/ambience/websocket.py)):

- If `create_switches`:
  - **enabled → False:** resolve the switch entity id (`switch_unique_id`); if present,
    `registry.async_remove(...)` (which pops it from `DATA_SWITCHES` via
    `async_will_remove_from_hass`) and remove the scope device.
  - **enabled → True:** if no switch entity exists yet, create one via the stashed
    `DATA_SWITCH_ADD_ENTITIES` callback. The existing re-arm-rechecks + `async_apply_scene`
    that already runs on enable is unchanged (a freshly added switch reads
    `_switch_state == "unknown"`, so the scene applies).
- If not `create_switches`: no switch work in either direction.

### Runtime: area/floor registry events (`__init__.py`)

- **create** handlers ([:227](../../../custom_components/ambience/__init__.py),
  [:261](../../../custom_components/ambience/__init__.py)): only `add_entities([...])`
  when `create_switches` (a freshly created scope is enabled by default).
- **remove** handlers: unchanged — they already delete the switch entity + device, which
  is a no-op when none exists.

### Frontend (`scopes-view.ts`, `scope-store.ts`)

- `_renderPauseIcon` already returns `""` when `switchEntityIds` has no entry for the
  scope — so the timer auto-follows switch existence. **No logic change.**
- `_renderScopeSwitch` onChange currently calls `reloadScope` only; add
  `await this._store.refreshSwitches()` after it so a switch created on re-enable surfaces
  its pause timer without waiting for another event. (On disable the timer disappears
  immediately because `cfg.enabled === false` short-circuits `_renderPauseIcon`.)
- Rebuild the bundle (`npm run build`).

## Part B — `apply_scene` service redesign

### Schema (`_APPLY_SCENE_SCHEMA` in `__init__.py`) + `services.yaml`

```yaml
apply_scene:
  areas:    [<area_id>, ...]    # area selector, multiple: true,  optional
  floors:   [<floor_id>, ...]   # floor selector, multiple: true, optional
  house:    true | false        # boolean, optional
  category: [<category_id>, ...]# text/select, multiple: true, optional
  scene:    [<scene_name>, ...] # text, multiple: true, optional
  force:    true | false        # boolean, optional (default false)
```

- Remove the `scope` field, the `entity` selector, and `_scene_requires_category`.
- `areas`/`floors`/`category`/`scene` accept a single value or a list (normalize to list
  via `cv.ensure_list`).

### Handler semantics (`_handle_apply_scene`)

1. **Resolve target scopes:**
   - `("area", area_id)` for each `areas` entry; `("floor", floor_id)` for each `floors`;
     `("house", None)` if `house` is truthy.
   - Validate each area_id/floor_id against `ar`/`fr` registries; unknown → `ServiceValidationError`
     (mirrors `_ws_set_scope_enabled`).
   - If the resolved set is empty → **all scopes** (house + every floor + every area).
2. **Plan + validate (pre-pass, before any apply):**
   - When `scene` names are given, for each (scope, name) determine the category(ies) among
     the eligible set (all of the scope's `category_ids(cfg)`, or narrowed to `category` if
     given) whose scenes include that name (case-insensitive). 0 → record skip; 1 → record an
     apply; >1 → **ambiguous** → raise `ServiceValidationError` (nothing applied yet).
3. **Execute:**
   - `scene` mode: for each recorded (scope, category, name) apply via
     `async_apply_named_scene(..., force=force)`. Skips for absent names are logged.
   - else `category` mode: for each (scope, category) apply via
     `async_apply_scene(..., category=cat, force=force)`.
   - else: for each scope `async_apply_scene(..., category=None, force=force)`.
   - Disabled scopes are a no-op inside these functions (`_scope_enabled` gate), so
     "all scopes" naturally skips disabled ones.

`force` keeps its meaning: bypass the switch-off gate (when a switch exists and is paused)
and the no-op/last-applied guards. With switches off, `_switch_state` is `"unknown"`, so
scenes apply regardless of `force`.

## Testing (TDD; 99% coverage gate applies)

**Backend**
- Option defaults to `False`; options flow round-trips `create_switches`.
- Setup with toggle **off**: no switches added; pre-existing switch entities + devices are
  removed by the reconcile.
- Setup with toggle **on**: a switch per enabled scope; none for a disabled scope.
- `_ws_set_scope_enabled`: disable deletes the switch + device; enable recreates it
  (toggle on). Both are no-ops when toggle off.
- Area/floor **create** adds a switch only when toggle on; **remove** still deletes.
- Service targeting: areas / floors / house / blank-means-all; unknown id → error.
- Service multi-category fan-out applies each category.
- Service multi-scene: each name resolved to its own category; absent name skipped;
  name in >1 category → raises with nothing applied.

**Frontend**
- Pause timer hidden when the scope has no switch entity.
- `refreshSwitches` is invoked after the enable/disable toggle.

## Out of scope / non-changes

- The exposure options (`expose_assist`/`google`/`alexa`) stay in the options form; they
  are no-ops while switches are off (no entities to expose). Not gated.
- Switch-defaults settings (name + auto-on delay) in the panel are left as-is.
- `scope_for_unique_id` / `switch_unique_id` are retained (still used by the reconcile and
  any remaining switch logic).
