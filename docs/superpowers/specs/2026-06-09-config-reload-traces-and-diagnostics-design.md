# Config-reload traces, narrow rerun, and per-scope diagnostics

**Date:** 2026-06-09
**Status:** Approved — ready for implementation plan

## Problem

When any Ambience config change is saved, the integration re-runs **every**
scope/category combination and records each resulting trace with the cause
"Startup". This has two problems:

1. **Misleading label.** "Startup" is indistinguishable from a real Home
   Assistant restart. A config save is a *reload*, not a startup, and should say
   so.
2. **Over-broad rerun.** A change to one area should not re-evaluate (and emit
   traces for) every other scope/category. The rerun should be scoped to what
   actually changed.

Additionally, diagnostics should be more useful for debugging:

3. There should be a **per-(scope, category) "Download diagnostics" button** that
   bundles that unit's config, the relevant global context, and its traces.
4. The **main** Home Assistant diagnostics dump should also include traces.

## Background: how it works today

- `AmbienceStore` save/delete methods call `_notify_config_changed()`, which
  fires `SIGNAL_CONFIG_CHANGED` with **no payload** describing what changed
  (`store.py:55`).
- `__init__.py:302` connects that signal to `engine.async_request_refresh()`,
  a debounced (0.3s) call to `_async_refresh()` →
  `async_rebuild()` + `async_subscribe()` + `async_initial_sync()`
  (`trigger_engine.py:346`).
- `async_initial_sync()` re-applies **all** units and hardcodes
  `CauseKind.STARTUP` (`trigger_engine.py:365-377`). This same method runs on
  real HA startup via `async_start()`, which is why config reloads are labelled
  "Startup".
- Separately, the websocket save handlers call `_schedule_reapply()`
  (`websocket.py:151`) → `async_apply_scene()`, which re-applies the saved scope
  immediately and emits a **second**, MANUAL-cause trace. `async_apply_scene`
  uses the "manual path" which always executes matched categories (no
  last-applied dedupe), so an edited scene whose winning index is unchanged
  still re-fires.
- Net effect of saving one area: a MANUAL trace for that area **plus** a STARTUP
  trace for every scope/category (mostly DEBOUNCED/NO_OP noise).
- `_resolve_and_apply()` (`trigger_engine.py:217`) checks scope-disabled and
  switch-off **before** the `force` gate; `force` only bypasses the
  last-applied dedupe at line 283. So `force=True` re-fires unchanged winners
  but never overrides switch-off/disabled.
- Diagnostics (`diagnostics.py`) dumps only the redacted store —
  no traces. `TO_REDACT = {workday_sensor, workday_calendar, entity, who,
  where, template}`.
- Traces live in an in-memory `BufferSink` (`trace.py:160`), keyed by
  `(scope_kind, scope_id, category)`, max 5 per bucket. `records()` returns all
  buffered units newest-first; `buffered_unit_to_dict()` serializes one unit.
- Frontend `traces-modal.ts` already shows traces for one (scope, category) and
  receives `.scope` and `.category` props — the natural home for the per-unit
  download button.

## Decisions (confirmed with user)

- New cause label: **"Reloaded"**.
- Rerun granularity: **affected scope only; genuinely global changes reapply
  all.**
- Per-unit download contents: **scope config + global context + that unit's
  traces.**

## Design

### Part A — Distinguish reloads & rerun only what changed

1. **New cause kind.** Add `RELOADED = "reloaded"` to the `CauseKind` StrEnum in
   `trace.py`. Frontend: add `"reloaded"` to the `TraceCause` kind union in
   `types.ts` and a `reloaded: "Reloaded"` entry to the fixed-label map in
   `trace-detail.ts`. Real HA startup keeps `STARTUP` / "Startup".

2. **Thread the affected scope through the signal.** Change
   `_notify_config_changed(self, affected=None)` where `affected` is a
   `(scope_kind, scope_id)` tuple for scope-local changes and `None` (meaning
   "global → reapply all") otherwise. Dispatch it as a payload arg:
   `async_dispatcher_send(hass, SIGNAL_CONFIG_CHANGED, affected)`.

   - Scope-local (pass the scope): `async_save_area`/`async_delete_area`
     (`("area", area_id)`), `async_save_floor`/`async_delete_floor`
     (`("floor", floor_id)`), `async_save_house` (`("house", None)`).
   - Global (pass `None`): `async_save_categories`, `async_delete_category`,
     `async_save_condition_config` (covers day/weather/periods/lux),
     `async_save_exposed_actions`.

3. **Engine accumulates pending changes** across the debounce window. Add
   `_pending_affected: set[tuple[str, str | None]]` and `_pending_all: bool` to
   `AutoTriggerEngine`. A new `@callback note_config_changed(affected)` sets
   `_pending_all = True` when `affected is None`, else adds the scope to
   `_pending_affected`. `__init__.py`'s signal handler becomes
   `_on_config_changed(affected)` → `engine.note_config_changed(affected)` then
   `engine.async_request_refresh()`.

4. **Refactor the sync path.** Extract a private helper:

   ```python
   async def _sync(self, units, cause, *, force):
       await self._refresh_all_snapshots()
       self._recompute(set(self._index.all_predicates()), self._snapshots)
       traces = await self._apply_units(units, force=force)
       if traces:
           emit_trace(self._hass, TraceEvent(cause, traces))
   ```

   `_recompute` runs over **all** predicates regardless of which units apply, so
   flip-state is correctly seeded for future event-driven evaluations.

   - `async_initial_sync()` (real startup, called by `async_start`) becomes
     `_sync(all_units, TriggerCause(STARTUP), force=False)`. Kept as a named
     method so the 23 existing tests that call it directly keep working with
     unchanged behavior.
   - `_async_refresh()` (debounced config-reload path) consumes the pending
     state, rebuilds + resubscribes, then:
     - if `_pending_all`: `_sync(all_units, RELOADED, force=False)`
     - else: `_sync(units_for(_pending_affected), RELOADED, force=True)`
     and clears the pending state. `all_units` / `units_for(...)` build
     `(kind, sid, cid)` triples from `category_ids(cfg)` of the relevant scopes,
     skipping scopes that no longer exist after the rebuild.

   `force=True` on the scope-local path is required: an edited scene whose
   winning index is unchanged must still re-fire (last-applied tracks the index,
   not the scene's contents). The global path keeps `force=False` — a global
   change doesn't alter scene contents, so winner-change gating is correct and
   avoids re-firing every unchanged scope.

5. **Remove `_schedule_reapply`** and its calls in the area/floor/house save
   handlers (`websocket.py`). The narrow `force=True` RELOADED refresh now does
   exactly what `_schedule_reapply` did (apply the saved scope, re-firing edited
   scenes) but as a single correctly-labelled trace. Manual UI "apply" buttons
   (`ambience/apply` → `async_apply_scene` → MANUAL) are unaffected.

**Result:** saving one area emits a single "Reloaded" trace covering only that
area's categories; global edits reapply all as "Reloaded"; a real HA restart
still says "Startup".

### Part B — Main diagnostics include traces

In `diagnostics.py`, add a `traces` key to the dump: read the `BufferSink` from
`DATA_TRACE_BUFFER`, serialize each record with `buffered_unit_to_dict`, and run
the list through `async_redact_data(..., TO_REDACT)`. Both
`async_get_config_entry_diagnostics` and `async_get_device_diagnostics` include
it (they share `_store_dump`; extend that or wrap both).

### Part C — Per-(scope, category) "Download diagnostics" button

- **Backend helper** in `diagnostics.py`:
  `scope_diagnostics(hass, scope_kind, scope_id, category)` returning a dict:
  - `scope`: `{scope_kind, scope_id, config}` — that scope's config from
    `store.scope_config(...)`, redacted.
  - `context`: `{categories, conditions}` — global context relevant to
    interpreting the scope, redacted.
  - `traces`: buffered units filtered to that exact
    `(scope_kind, scope_id, category)` bucket, serialized + redacted.
- **WebSocket command** `ambience/diagnostics/scope` (admin-only, matching the
  other admin commands) accepting `{scope_kind, scope_id?, category}` and
  returning the `scope_diagnostics(...)` dict. Registered in `websocket.py`
  alongside the trace commands.
- **Frontend**:
  - `downloadScopeDiagnostics(hass, scope, category)` in `api.ts`: `callWS` the
    new command, then trigger a browser JSON download (a `Blob` +
    temporary `<a download>` element), filename
    `ambience-{scope_kind}-{scope_id ?? "house"}-{category}.json`.
  - A **"Download diagnostics"** button in the `traces-modal.ts` header
    (alongside Refresh/Close), wired to that helper using the modal's existing
    `.scope` / `.category`.

## Testing (TDD — test first throughout)

Backend (pytest):
- A config-change refresh emits `RELOADED`, not `STARTUP`; real startup
  (`async_start`) still emits `STARTUP`.
- A scope-local change reapplies only that scope's units (no traces emitted for
  other scopes).
- A global change (categories / condition config) reapplies all scopes.
- A scope-local save of an edited scene whose winning index is unchanged still
  re-fires (force path).
- Pending state accumulates across the debounce window and is cleared after a
  refresh; a global change during the window upgrades the batch to "all".
- Main diagnostics include the (redacted) traces.
- `scope_diagnostics(...)` returns the scope config + global context + traces
  filtered to that bucket.
- The `ambience/diagnostics/scope` WS command returns the expected payload and
  requires admin.

Frontend:
- `downloadScopeDiagnostics` issues the correct WS call and triggers a download
  with the expected filename.
- The traces modal renders the download button and invokes the helper on click.

## Known limitation

Redaction is key-based (`async_redact_data` over `TO_REDACT`). Free-form entity
ids embedded in predicate `detail` strings inside trace explanations are not
scrubbed. Acceptable: both the traces WS API and diagnostics are already
admin-only.

## Out of scope

- Persisting traces across restarts (they remain in-memory).
- Changing trace buffer size or bucket pruning.
- Any change to the manual apply path or non-config trigger causes.
