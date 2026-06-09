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

- **scope** (required): exactly one of `area` (HA area id), `floor` (HA floor id),
  or `house: true`.
- **category** (optional): a category id. Omitted ⇒ all categories in the scope.
- **scene** (optional): a scene name. Requires `category` (see validation below).
- **force** (optional, default `false`): when `true`, apply even if the scope
  switch is `off`.

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

- Extend `_APPLY_SCENE_SCHEMA`:
  - add `vol.Optional("category")`, `vol.Optional("scene")`, `vol.Optional("force")`;
  - add a validator: if `scene` is present, `category` is required.
- Update `_handle_apply_scene` to:
  - parse the scope (`area`/`floor`/`house`) as today;
  - if `scene` is present ⇒ `async_apply_named_scene(..., category, scene, force=...)`;
  - else ⇒ `async_apply_scene(..., category=category, force=force)`.

### `services.yaml`

Expose all fields: `area`, `floor`, `house`, `category`, `scene`, `force`, with
appropriate selectors and descriptions (currently only `area` and `scene` are
listed, and `floor`/`house` are undocumented despite being handled).

## Testing (TDD — tests written first)

- **Schema validator:** `scene` without `category` rejected; valid combinations
  accepted; exactly-one-scope still enforced.
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
