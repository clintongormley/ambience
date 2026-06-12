# Idle re-apply: re-assert a unit's scene after inactivity

## Problem

Service calls are fire-and-forget. `async_execute_actions`
([service.py](../../../custom_components/ambience/service.py)) dispatches each
action with `blocking=True` but never confirms the device obeyed — a dropped
command (e.g. a light that should turn **off** but stays **on**) is never
corrected. Once a unit's winner is stable, the engine debounces identical
re-wins ([trigger_engine.py](../../../custom_components/ambience/trigger_engine.py),
the `not force and index == get_last_applied(...)` branch), so the desired state
is asserted exactly **once** and never re-sent.

There is an existing per-action `reapply_seconds` mechanism that re-fires a
winner's actions at a **fixed interval regardless of activity**. It is being
**removed** as part of this work (see Phase 1) — it is unconditional, per-action
config surface that has not earned its keep, and its semantics differ from what
we actually want.

## Goal

Guarantee that every **enabled** `(scope, category)` unit re-asserts its desired
state at least every *N* minutes of **inactivity**, where "activity" means
commands were **actually dispatched** to that unit. Idle-gated, not fixed-rate:
a unit that keeps applying never needs reconciling; a stable unit gets its
commands re-sent every *N* minutes as a safety net.

One **global** on/off toggle and one **global** interval. **Off by default.**

### Decisions (locked during brainstorming)

- **Granularity:** a single global timeout + on/off toggle (not per-scope or
  per-category).
- **Default:** off; interval pre-filled at 90 min (5400 s).
- **Clock reset:** on **actual apply** (commands dispatched to that unit), *not*
  on every evaluation. A unit whose triggers fire constantly but whose winner
  never changes (debounced — no dispatch) still reconciles — that is exactly the
  case where a dropped command would otherwise go uncorrected forever.
- **On fire:** **re-assess + force apply** — re-resolve the scene from scratch
  (winner may change, though it rarely will), then dispatch its actions even if
  the winner is unchanged, bypassing the same-winner debounce.
- **Inactive units skip:** if the scope switch is off, the scope is permanently
  disabled, or no scene currently matches, do nothing (consistent with normal
  apply gating).
- **In-memory:** clocks live in memory and reset on restart; the startup sync
  re-applies all units, which re-arms them. No persistence.
- **Naming:** reuse `reapply` (the old feature's name is freed by Phase 1):
  settings key `reapply`, `CauseKind.REAPPLY`.

## Phase 1 — Remove the old per-action `reapply_seconds` feature

Preserve, then remove.

- **Preserve:** branch `archive/reapply-seconds` at the current HEAD keeps the
  feature intact for later restoration.
- **Remove** as **one self-contained, revertable commit** (so `git revert` can
  restore it) touching:
  - `validators.py` — `validate_reapply_seconds`, `MIN_REAPPLY_SECONDS`.
  - `const.py` — `MIN_REAPPLY_SECONDS` import/use.
  - `exposed_actions.py` — the `reapply_seconds` shape check.
  - `service.py` — `effective_reapply_seconds`, `scope_reapply_intervals`.
  - `trigger_engine.py` — `_reapply_intervals`, `_build_reapply_intervals`.
  - `trigger_subscriptions.py` — `_reapply_tick`, `_make_reapply_handler`, the
    interval `async_track_time_interval` subscription.
  - `trace.py` — `CauseKind.REAPPLY`, `Outcome.REAPPLIED` (the names are then
    free for Phase 2 to reintroduce with new semantics).
  - Frontend — delete `reapply.ts`; remove reapply fields in `actions-settings.ts`
    and `scene-editor.ts`; remove `reapply_seconds` from `types.ts`; remove the
    `reapply_*` strings from `i18n-data.ts`.
  - Tests — remove every reapply test in `test_trigger_engine.py`,
    `test_service.py`, `test_exposed_actions.py`, `test_validators.py`,
    `test_websocket.py`, `test_websocket_helpers.py`,
    `test_trigger_subscriptions.py`, `actions-settings.test.ts`,
    `scene-editor.test.ts`.
  - Docs — any mention of the per-action reapply mechanism.

The removal commit must leave the build green (lint, format, full test suite,
coverage gate) with no dangling references.

## Phase 2 — Idle re-apply

### a. Settings storage (`store.py`)

A new global blob in `_data`, mirroring the existing `switch_defaults` pattern:

```python
"reapply": { "enabled": False, "interval_seconds": 5400 }
```

- `get_reapply_settings() -> {"enabled": bool, "interval_seconds": int}`.
- `async_save_reapply_settings(payload)` — validates and persists.
- `_validate_reapply_settings(payload)` — `enabled` is a `bool`;
  `interval_seconds` is an `int >= MIN_REAPPLY_INTERVAL_SECONDS` (reject bool,
  non-int, below floor), mirroring `_validate_switch_defaults`.
- `_ensure_reapply_settings()` — backfills the key with defaults on load for
  existing installs (mirrors `_ensure_switch_defaults`).
- New consts in `const.py`: `DEFAULT_REAPPLY_ENABLED = False`,
  `DEFAULT_REAPPLY_INTERVAL_SECONDS = 5400`, `MIN_REAPPLY_INTERVAL_SECONDS = 60`
  (floor low enough to keep tests fast and allow aggressive setups).

### b. WebSocket API (`websocket.py`)

Mirror the `switch_defaults/list` + `switch_defaults/save` pair:

- `ambience/reapply/list` → returns `get_reapply_settings()`.
- `ambience/reapply/save {enabled: bool, interval_seconds: int}` → validates,
  `async_save_reapply_settings(...)`, `async_dispatcher_send(hass,
  SIGNAL_REAPPLY_CONFIG_UPDATED, None)`, returns `{"ok": True}`. Invalid payloads
  surface a websocket error (mirroring existing save validation).

### c. Frontend

In the Settings → Ambience "Defaults" view that already renders the switch name
+ auto-on delay:

- Add a toggle (**Re-apply scenes after inactivity**) and an interval input
  (duration field consistent with the existing auto-on-delay seconds field).
- `ReapplySettings = { enabled: boolean; interval_seconds: number }` in
  `types.ts`. Fetch via `ambience/reapply/list`, save via `ambience/reapply/save`.
- New `ui.settings_reapply_*` strings in `i18n-data.ts` (card title, toggle
  label, interval label, help text).

### d. Engine — per-unit one-shot timers

A "unit" is the existing `(scope_kind, scope_id, category_id)` tuple. New mixin
state:

```python
self._reapply_timers: dict[tuple[str, str | None, str], _CancellableTimer] = {}
```

This reuses the one-shot `async_call_later` / `_CancellableTimer` pattern already
used for `for:` rechecks and the switch auto-on timer.

**Arm chokepoint.** `async_execute_plan`
([service.py](../../../custom_components/ambience/service.py), right after it
records `last_applied`) emits:

```python
async_dispatcher_send(hass, SIGNAL_UNIT_APPLIED, (scope_kind, scope_id, category_id))
```

Because this is the single point where `last_applied` is recorded, it fires for
**every** dispatch path — auto-trigger applies, the manual
`async_apply_scene`/service path, and the reconcile fire itself.

**Subscriptions.** The engine subscribes to:

- `SIGNAL_UNIT_APPLIED` → `_arm_reapply_timer(unit)`: if the feature is disabled,
  return; otherwise cancel any existing timer for the unit and schedule
  `async_call_later(interval_seconds, _on_reapply_due(unit))`.
- `SIGNAL_REAPPLY_CONFIG_UPDATED` → if now disabled,
  `_cancel_all_reapply_timers()`; if enabled (or the interval changed), re-arm a
  timer for every unit with `get_last_applied(...) is not None` **and** switch on
  **and** scope enabled — so toggling on starts the safety net immediately
  without waiting for the next dispatch.

**Fire.** `_on_reapply_due(unit)` schedules a task that calls
`self._resolve_and_apply(*unit, force=True)` and emits a trace event with
`CauseKind.REAPPLY` (rendered e.g. *"re-apply (idle)"*). `force=True` bypasses
the same-winner debounce, so a stable winner's commands re-send. The existing
switch-on / scope-enabled / has-winner gating inside `_resolve_and_apply` means
an inactive unit **skips**: no dispatch ⇒ no `SIGNAL_UNIT_APPLIED` ⇒ the timer is
not re-armed and simply dies until the next real apply re-arms it. A successful
reconcile dispatch re-emits `SIGNAL_UNIT_APPLIED`, re-arming the timer
`interval_seconds` in the future — self-perpetuating, with no tight loop (the
re-arm is always `interval` ahead).

### e. Lifecycle & edge cases

- **Debounced evaluation** (winner unchanged, no dispatch) does **not** touch the
  timer — the clock reflects the last *actual* dispatch.
- **No current winner** on fire: `_resolve_and_apply` resolves nothing, forgets
  last-applied, dispatches nothing ⇒ timer dies. Correct (nothing to re-send).
- **Switch off / scope disabled** on fire: gated out ⇒ skip, timer dies. At most
  one harmless no-op wake-up after a unit goes inactive.
- **Config rebuild / unit removal:** cancel timers for vanished units (or
  cancel-all then re-arm current applied units after the resync).
- **Unload:** cancel all reapply timers.
- **Restart:** in-memory; the startup sync re-applies all units → emits signals →
  arms fresh timers. No persistence.

## Testing (TDD — tests written first)

**Backend**

- **store:** `get`/`save` round-trip; validation rejects non-bool `enabled`,
  non-int / below-floor `interval_seconds`; `_ensure_reapply_settings` backfills
  an install whose stored data predates the key.
- **websocket:** `reapply/list` returns settings; `reapply/save` persists +
  dispatches the signal; invalid payloads error.
- **engine:**
  - a dispatch arms a timer for the unit (signal ⇒ timer scheduled);
  - after `interval_seconds`, the timer **force-dispatches even when the winner
    is unchanged** (the key behavior) and re-arms;
  - skips on switch-off, on no-match, and on a permanently-disabled scope (timer
    dies, no dispatch);
  - a debounced evaluation does **not** reset the timer;
  - feature disabled ⇒ no timers armed; toggling off cancels all; toggling on
    arms timers for currently-applied units;
  - the manual `async_apply_scene` path also arms a timer (via the shared
    chokepoint);
  - the fire emits a `CauseKind.REAPPLY` trace event.
  - Drive timers with the `fixed_utcnow` + `async_fire_time_changed` fixtures.
- Remove all old reapply tests (Phase 1).

**Frontend**

- The settings UI renders the toggle + interval and saves via
  `ambience/reapply/save`. Remove the old reapply UI tests (Phase 1).

The coverage gate is strict (99% / 100% on touched backend), so new code needs
full coverage.

## Out of scope (YAGNI)

- Per-scope or per-category timeouts (global only).
- Persisting idle clocks across restart.
- Device state read-back / confirmation — this re-**sends** commands; it does not
  verify the device obeyed.
- The deleted per-action `reapply_seconds` mechanism — preserved on
  `archive/reapply-seconds` for possible later restoration.
