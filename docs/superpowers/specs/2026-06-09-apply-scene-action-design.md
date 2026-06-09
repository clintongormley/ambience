# Expand the `ambience.apply_scene` action

## Problem

The `ambience.apply_scene` admin service is narrower than it should be:

- `services.yaml` exposes only `area` (required), even though the handler already
  reads `floor` and `house` from the call data.
- The `scene` field is declared but **ignored** by the handler.
- There is no way to scope an apply to a single **category**, and no way to apply a
  **specific named scene's actions** directly.

Internally, `async_apply_scene(...)` already accepts a `category` filter and a
`force` flag — neither is reachable from the public action. There is no
service-layer path that applies a scene located by name (only the websocket
`scene/run_actions`, which targets a scene by **index**).

## Goal

Let a caller of `ambience.apply_scene` choose how broad or narrow the apply is:

- **scope only** — re-run the rules for every category in the scope.
- **scope + category** — re-run the rules for just that category.
- **scope + category + scene** — apply that named scene's actions directly,
  bypassing predicate resolution.

## Inputs

The action takes:

- **scope** (required): the scope's Ambience switch entity_id. Each scope —
  house, every floor, every area — has its own switch (`switch.house_ambience`,
  `switch.<floor>_floor_ambience`, `switch.<area>_ambience`), so a single entity
  selector (filtered to integration `ambience`, domain `switch`) lets the user
  pick house/floor/area from one dropdown. The handler resolves the chosen
  entity back to `(scope_kind, scope_id)` from its `unique_id`
  (`switch_unique_id` is deterministic; `scope_for_unique_id` reverses it). A
  well-formed entity_id that isn't an Ambience scope switch raises
  `ServiceValidationError`.
- **category** (optional): a category id. Omitted ⇒ all categories in the scope.
- **scene** (optional): a scene name. Requires `category` (see validation below).
- **force** (optional, default `false`): when `true`, apply even if the scope
  switch is `off`.

> Earlier drafts took three separate scope fields (`area` / `floor` /
> `house: true`) guarded by an exactly-one-of validator. That was replaced with
> the single `scope` switch-entity field above: it removes the `house` boolean
> wart and the exactly-one-scope validator, and unifies all three scope kinds
> into one native dropdown.

## Behavior matrix

| Inputs | Behavior |
|---|---|
| scope only | Resolve **all** categories in the scope via their `when` predicates; apply each winner. *(current behavior)* |
| scope + category | Resolve **just that category** via predicates; apply its winner. |
| scope + category + scene | **Bypass predicates** — find the scene by name in that `(scope, category)` and run its actions directly. |
| scope + scene, **no category** | `ServiceValidationError` — a scene name is only unique within a category, so category is required. |

### Switch / enabled gating (all paths)

- The scope switch is respected: if the switch is `off`, the action is a no-op
  unless `force: true`. This matches today's `async_apply_scene` gate; the UI's
  internal callers already pass `force=True`.
- The permanent `enabled: false` disable always blocks (raises
  `ServiceValidationError`), matching existing paths.

## Named-scene path semantics

- **Lookup:** case-insensitive match on the trimmed scene name within the
  `(scope, category)` scene list. Name uniqueness within a `(scope, category)` is
  already enforced server-side (see `websocket_helpers.py`), so the match is
  unambiguous. Not found ⇒ `ServiceValidationError`.
- **No `when` evaluation:** the named scene's predicates are not checked; its
  actions run directly. This is what "apply the actions for that scene" means.
- **last-applied:** the named-scene apply does **not** touch last-applied
  tracking — it is an out-of-band manual override, exactly like the existing
  `scene/run_actions` websocket path. Consequence: the next predicate flip lets
  the rules engine re-evaluate and potentially override it. This is the intended
  "rules eventually win" behavior.
- **Trace:** emits a `MANUAL`-cause trace event like the existing apply path, so
  the action is visible in diagnostics.

## Implementation shape

### `service.py`

Add:

```python
async def async_apply_named_scene(
    hass, scope_kind, scope_id, category, scene_name, *, force=False
) -> None
```

It gates on the permanent `enabled` flag and the scope switch (honoring `force`),
locates the scene by name within `(scope, category)`, and runs its actions via the
existing `async_execute_actions`. It does **not** record last-applied. It emits a
`MANUAL`-cause trace.

The existing `async_apply_scene` already handles the predicate paths (it accepts
`category` and `force`) and needs no change for that behavior.

### `__init__.py`

- Replace `_APPLY_SCENE_SCHEMA` with:
  - `vol.Required("scope")` (a `cv.entity_id`), plus `vol.Optional("category")`,
    `vol.Optional("scene")`, `vol.Optional("force")`;
  - the validator: if `scene` is present, `category` is required.
  - drop the old `_exactly_one_scope` and `_house_must_be_true` validators.
- Update `_handle_apply_scene` to:
  - resolve `scope` (a switch entity_id) to `(scope_kind, scope_id)` via the
    entity registry + `scope_for_unique_id`; raise `ServiceValidationError` if it
    isn't an Ambience scope switch;
  - if `scene` is present ⇒ `async_apply_named_scene(..., category, scene, force=...)`;
  - else ⇒ `async_apply_scene(..., category=category, force=force)`.

### `switch.py`

Add `scope_for_unique_id(unique_id)` — the deterministic reverse of
`switch_unique_id` — so the handler can map a chosen scope switch back to its
`(scope_kind, scope_id)`.

### `services.yaml`

Expose `scope` (an `entity` selector filtered to integration `ambience`, domain
`switch`), plus `category`, `scene`, `force`.

## Testing (TDD — tests written first)

- **Schema validator:** `scope` required (a valid entity_id); `scene` without
  `category` rejected; valid combinations accepted.
- **`scope_for_unique_id`:** house/area/floor unique_ids parse back to the right
  `(scope_kind, scope_id)`; unknown prefixes return `None`; round-trips with
  `switch_unique_id`.
- **`async_apply_named_scene`:**
  - runs the matched scene's actions (case-insensitive name match);
  - raises when the name is not found in the `(scope, category)`;
  - raises when the scope is permanently disabled;
  - no-op when the switch is `off` and `force` is `false`; runs when `force` is
    `true`;
  - does not record last-applied;
  - emits a `MANUAL` trace.
- **Handler dispatch:** `scene` present ⇒ named path; absent ⇒ predicate path with
  the `category`/`force` passed through.

## Out of scope

- No change to the trigger engine or to predicate-resolution semantics.
- No new websocket command (the existing `scene/run_actions` by-index path stays).
- No frontend UI for the new fields (the action is admin/developer-tools facing).
