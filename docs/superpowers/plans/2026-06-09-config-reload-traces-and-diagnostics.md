# Config-reload Traces & Diagnostics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Label config-triggered reruns "Reloaded" (not "Startup"), re-apply only the scope that actually changed, and surface traces in diagnostics (a per-(scope,category) download button plus traces in the main diagnostics dump).

**Architecture:** A config save fires `SIGNAL_CONFIG_CHANGED` carrying *what* changed; the engine accumulates the affected scopes across the 0.3s debounce, then re-applies only those (force-applying so edited scenes re-fire) with a new `RELOADED` cause — while genuinely global changes still re-apply everything. The redundant per-save `_schedule_reapply` is removed. Diagnostics gains a `traces` section, and a new admin WS command returns a per-(scope,category) diagnostic bundle the frontend downloads as JSON.

**Tech Stack:** Python (Home Assistant custom integration, pytest + pytest-homeassistant-custom-component), TypeScript/Lit frontend (Vitest).

---

## Spec

`docs/superpowers/specs/2026-06-09-config-reload-traces-and-diagnostics-design.md`

## File map

- `custom_components/ambience/trace.py` — add `RELOADED` cause kind.
- `frontend/src/types.ts` — add `"reloaded"` to the `TraceCause` kind union.
- `frontend/src/trace-detail.ts` — add the `reloaded: "Reloaded"` label.
- `custom_components/ambience/store.py` — `_notify_config_changed(affected)`; pass scope from each save/delete.
- `custom_components/ambience/trigger_engine.py` — pending-change accumulator, `_sync`/`_all_units`/`_units_for`, new `_async_refresh` (RELOADED, narrow), `async_initial_sync` (STARTUP, all), `async_start`.
- `custom_components/ambience/__init__.py` — signal handler passes `affected` to `engine.note_config_changed`.
- `custom_components/ambience/websocket.py` — remove `_schedule_reapply`; add `ambience/diagnostics/scope` command.
- `custom_components/ambience/diagnostics.py` — traces in main dump; `scope_diagnostics()` helper.
- `frontend/src/api.ts` — `downloadScopeDiagnostics()`.
- `frontend/src/views/traces-modal.ts` — "Download diagnostics" button.
- Tests: `tests/test_trigger_engine.py`, `tests/test_store.py`, `tests/test_websocket.py`, `tests/test_diagnostics.py`, `tests/test_websocket_traces.py`, `test/trace-detail.test.ts` (new or existing), `test/api-full.test.ts` (or new), `test/traces-modal.test.ts`.

Run the full backend suite with `pytest` and the frontend suite with `npm run test` (Vitest). `npm run ci` runs Biome lint+format.

---

## Task 1: Add the `RELOADED` cause (backend enum + frontend label)

**Files:**
- Modify: `custom_components/ambience/trace.py` (CauseKind enum, ~line 33-52)
- Modify: `frontend/src/types.ts:335-346` (TraceCause kind union)
- Modify: `frontend/src/trace-detail.ts:77-84` (CAUSE_LABELS_FIXED)
- Test: `test/trace-detail.test.ts`

- [ ] **Step 1: Write the failing frontend test**

Check whether `test/trace-detail.test.ts` exists. If it does, add this test inside the existing top-level `describe`; if not, create the file with this content:

```typescript
import { describe, expect, test } from "vitest";
import { formatCause } from "../frontend/src/trace-detail";
import type { TraceCause } from "../frontend/src/types";

function cause(over: Partial<TraceCause> = {}): TraceCause {
  return { kind: "reloaded", entity_id: null, old: null, new: null, detail: null, ...over };
}

describe("formatCause reloaded", () => {
  test("renders the reloaded kind as 'Reloaded'", () => {
    expect(formatCause(cause())).toBe("Reloaded");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- trace-detail`
Expected: FAIL — `formatCause` returns the raw `"reloaded"` (or a fallback), not `"Reloaded"`; and/or TypeScript rejects `kind: "reloaded"` because it's not in the union.

- [ ] **Step 3: Add the cause everywhere**

In `custom_components/ambience/trace.py`, add to the `CauseKind` StrEnum, right after `STARTUP = "startup"`:

```python
    STARTUP = "startup"
    # A config save (not an HA restart) triggered the rerun.
    RELOADED = "reloaded"
    REAPPLY = "reapply"
```

In `frontend/src/types.ts`, add `"reloaded"` to the `TraceCause` kind union after `"startup"`:

```typescript
    | "startup"
    | "reloaded"
    | "reapply"
```

In `frontend/src/trace-detail.ts`, add to `CAUSE_LABELS_FIXED` after the `startup` entry:

```typescript
  startup: "Startup",
  reloaded: "Reloaded",
  reapply: "Periodic refresh",
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- trace-detail`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/trace.py frontend/src/types.ts frontend/src/trace-detail.ts test/trace-detail.test.ts
git commit -m "feat: add RELOADED trace cause and 'Reloaded' label"
```

---

## Task 2: Carry the affected scope on `SIGNAL_CONFIG_CHANGED`

**Files:**
- Modify: `custom_components/ambience/store.py:55-57` (`_notify_config_changed`) and its callers (lines 135, 141, 153, 159, 168, 192, 210, 235, 357)
- Test: `tests/test_store.py`

- [ ] **Step 1: Write the failing tests**

Add to `tests/test_store.py` (it already imports `async_dispatcher_connect` and `SIGNAL_CONFIG_CHANGED`):

```python
async def test_save_area_signal_carries_scope(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_save_area("a", {"scenes": []})
    await hass.async_block_till_done()
    unsub()
    assert calls == [(("area", "a"),)]


async def test_save_house_signal_carries_house_scope(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_save_house({"scenes": []})
    await hass.async_block_till_done()
    unsub()
    assert calls == [(("house", None),)]


async def test_save_condition_config_signal_is_global(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    calls: list = []
    unsub = async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, lambda *a: calls.append(a))
    await store.async_save_condition_config("weather", {"entity": "weather.home"})
    await hass.async_block_till_done()
    unsub()
    assert calls == [(None,)]
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pytest tests/test_store.py -k "signal_carries or signal_is_global" -v`
Expected: FAIL — the signal currently sends no payload, so `calls == [()]`, not the scope tuples.

- [ ] **Step 3: Thread `affected` through `_notify_config_changed`**

In `custom_components/ambience/store.py`, change the method:

```python
    def _notify_config_changed(
        self, affected: tuple[str, str | None] | None = None
    ) -> None:
        """Tell the auto-trigger engine a config save happened, and narrow the
        follow-up re-apply: pass a (scope_kind, scope_id) for a scope-local
        change, or None for a global change (reapply everything)."""
        async_dispatcher_send(self._hass, SIGNAL_CONFIG_CHANGED, affected)
```

Update each caller:
- `async_save_area` (line 135): `self._notify_config_changed(("area", area_id))`
- `async_delete_area` (line 141): `self._notify_config_changed(("area", area_id))`
- `async_save_floor` (line 153): `self._notify_config_changed(("floor", floor_id))`
- `async_delete_floor` (line 159): `self._notify_config_changed(("floor", floor_id))`
- `async_save_house` (line 168): `self._notify_config_changed(("house", None))`
- `async_save_categories` (line 192): leave as `self._notify_config_changed()` (global)
- `async_delete_category` (line 210): leave as `self._notify_config_changed()` (global)
- `async_save_condition_config` (line 235): leave as `self._notify_config_changed()` (global)
- `async_save_exposed_actions` (line 357): leave as `self._notify_config_changed()` (global)

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pytest tests/test_store.py -v`
Expected: PASS (new tests pass; the existing `*_fires_config_changed` tests still pass — they use `lambda *a: calls.append(a)` and assert call count only).

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/store.py tests/test_store.py
git commit -m "feat: carry the affected scope on the config-changed signal"
```

---

## Task 3: Engine accumulates pending changes (`note_config_changed`)

**Files:**
- Modify: `custom_components/ambience/trigger_engine.py` (imports ~line 18; `__init__` ~line 69-97; add method near `async_request_refresh`)
- Test: `tests/test_trigger_engine.py`

- [ ] **Step 1: Write the failing test**

Add to `tests/test_trigger_engine.py`:

```python
async def test_note_config_changed_accumulates_pending(hass) -> None:
    engine = _engine(hass, [], {})
    engine.note_config_changed(("area", "a"))
    engine.note_config_changed(("floor", "f"))
    assert engine._pending_affected == {("area", "a"), ("floor", "f")}
    assert engine._pending_all is False
    # A global change upgrades the batch to "reapply all".
    engine.note_config_changed(None)
    assert engine._pending_all is True
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pytest tests/test_trigger_engine.py::test_note_config_changed_accumulates_pending -v`
Expected: FAIL — `AttributeError: 'AutoTriggerEngine' object has no attribute 'note_config_changed'`.

- [ ] **Step 3: Add the accumulator state and method**

In `trigger_engine.py`, add `callback` to the core import:

```python
from homeassistant.core import HomeAssistant, callback
```

In `AutoTriggerEngine.__init__`, add right before the `_refresh_debouncer` assignment (after line 89, the `_reapply_intervals` line):

```python
        # What a config-changed signal touched, accumulated across the debounce
        # window so the coalesced refresh re-applies only what changed. A global
        # change (None) sets _pending_all, which wins over any per-scope entries.
        self._pending_affected: set[tuple[str, str | None]] = set()
        self._pending_all = False
```

Add this method right above `async_request_refresh` (line 356):

```python
    @callback
    def note_config_changed(self, affected: tuple[str, str | None] | None) -> None:
        """Record what a config-changed signal touched, to narrow the next
        debounced refresh. `affected` is a (scope_kind, scope_id) for a
        scope-local change, or None for a global change (reapply everything)."""
        if affected is None:
            self._pending_all = True
        else:
            self._pending_affected.add(affected)
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pytest tests/test_trigger_engine.py::test_note_config_changed_accumulates_pending -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/trigger_engine.py tests/test_trigger_engine.py
git commit -m "feat: accumulate pending config changes in the engine"
```

---

## Task 4: Narrow, force-applied RELOADED refresh (engine sync refactor)

**Files:**
- Modify: `custom_components/ambience/trigger_engine.py:346-377` (`_async_refresh`, `async_start`, `async_request_refresh`, `async_initial_sync`)
- Test: `tests/test_trigger_engine.py`

- [ ] **Step 1: Write the failing tests**

Add to `tests/test_trigger_engine.py`. These reuse `_apply_engine` (the same helper used by `test_initial_sync_emits_startup_trace_when_tracing_active`, which builds an engine whose `tod="evening"` makes scene 0 win) plus a capture sink.

```python
class _Capture:
    def __init__(self) -> None:
        self.events: list[TraceEvent] = []

    def emit(self, event: TraceEvent) -> None:
        self.events.append(event)


async def test_initial_sync_still_emits_startup_cause(hass) -> None:
    from custom_components.ambience.trace import CauseKind

    engine, _tod = _apply_engine(hass)
    cap = _Capture()
    hass.data[DOMAIN][DATA_TRACE_SINKS] = [cap]
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        await engine.async_initial_sync()
        assert cap.events[-1].cause.kind == CauseKind.STARTUP
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)


async def test_global_refresh_emits_reloaded_cause(hass) -> None:
    from custom_components.ambience.trace import CauseKind

    engine, _tod = _apply_engine(hass)
    cap = _Capture()
    hass.data[DOMAIN][DATA_TRACE_SINKS] = [cap]
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        engine.note_config_changed(None)  # global
        await engine._async_refresh()
        assert cap.events[-1].cause.kind == CauseKind.RELOADED
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)
```

The `_apply_engine` helper builds the engine over a single scope. Find its definition (used near line 1248/1363) to learn its scope key; the next two tests assert *which* units a narrow refresh applies, so they need an engine over **two** scopes. Add this two-scope helper and tests, adapting condition stubs to match `_apply_engine`'s pattern in the file:

```python
def _two_area_engine(hass):
    """Two areas, each with one always-matching action scene; switches on."""
    scene = lambda: {"when": {}, "category": "g", "actions": [
        {"service": "light.turn_on", "entity_ids": ["light.x"], "params": {}}
    ]}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore([("area", "a", {"scenes": [scene()]}),
                               ("area", "b", {"scenes": [scene()]})]),
        DATA_CONDITIONS: {},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True),
                        ("area", "b"): SimpleNamespace(is_on=True)},
        DATA_LAST_APPLIED: {},
        DATA_TRACE_SINKS: [],
    }
    hass.services.async_register("light", "turn_on", lambda call: None)
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine.async_subscribe()
    return engine


async def test_scope_local_refresh_applies_only_that_scope(hass) -> None:
    engine = _two_area_engine(hass)
    cap = _Capture()
    hass.data[DOMAIN][DATA_TRACE_SINKS] = [cap]
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        engine.note_config_changed(("area", "a"))  # only area a changed
        await engine._async_refresh()
        units = {(u.scope_kind, u.scope_id) for ev in cap.events for u in ev.units}
        assert units == {("area", "a")}  # area b not re-applied
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)


async def test_scope_local_refresh_reapplies_unchanged_winner(hass) -> None:
    """A scope-local refresh force-applies, so an edited scene whose winning index
    is unchanged still re-fires (last-applied tracks the index, not the content)."""
    engine = _two_area_engine(hass)
    # Pretend area a's category g already applied scene 0.
    hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] = 0
    calls: list = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    engine.note_config_changed(("area", "a"))
    await engine._async_refresh()
    assert calls, "force-applied scope a should have re-fired its action"
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pytest tests/test_trigger_engine.py -k "reloaded or scope_local or still_emits_startup" -v`
Expected: FAIL — `_async_refresh` currently calls `async_initial_sync` (STARTUP, all units, no force), so the cause is wrong, the narrow unit assertion fails, and the unchanged-winner action is suppressed (DEBOUNCED).

- [ ] **Step 3: Refactor the sync path**

In `trigger_engine.py`, replace the block from `_async_refresh` (line 346) through the end of `async_initial_sync` (line 377) with:

```python
    async def _async_refresh(self) -> None:
        """Debounced config-reload: rebuild + resubscribe, then re-apply only what
        changed (force, so edited scenes re-fire), labelling traces 'Reloaded'.
        A global change re-applies every scope without force."""
        pending_all = self._pending_all
        affected = self._pending_affected
        self._pending_all = False
        self._pending_affected = set()
        self.async_rebuild()
        self.async_subscribe()
        cause = TriggerCause(kind=CauseKind.RELOADED)
        if pending_all:
            await self._sync(self._all_units(), cause, force=False)
        else:
            await self._sync(self._units_for(affected), cause, force=True)

    async def async_start(self) -> None:
        """Build the index, subscribe, and run the startup sync pass (immediate)."""
        self.async_rebuild()
        self.async_subscribe()
        await self.async_initial_sync()

    async def async_request_refresh(self) -> None:
        """Request a config-reload refresh, debounced to coalesce rapid changes."""
        await self._refresh_debouncer.async_call()

    def async_shutdown(self) -> None:
        """Tear down all subscriptions, timers, and the refresh debouncer."""
        self._refresh_debouncer.async_shutdown()
        self._teardown()

    def _all_units(self) -> list[tuple[str, str | None, str]]:
        """Every (scope_kind, scope_id, category) unit across all scopes."""
        return [
            (kind, sid, cid)
            for (kind, sid), cfg in self._scope_cfgs.items()
            for cid in category_ids(cfg)
        ]

    def _units_for(
        self, scopes: set[tuple[str, str | None]]
    ) -> list[tuple[str, str | None, str]]:
        """The units for the given scopes, skipping any that no longer exist."""
        return [
            (kind, sid, cid)
            for (kind, sid) in scopes
            if (cfg := self._scope_cfgs.get((kind, sid))) is not None
            for cid in category_ids(cfg)
        ]

    async def _sync(
        self,
        units: list[tuple[str, str | None, str]],
        cause: TriggerCause,
        *,
        force: bool,
    ) -> None:
        """Snapshot all conditions, seed flip-state across every predicate, then
        apply the given units and emit one TraceEvent for the batch."""
        await self._refresh_all_snapshots()
        self._recompute(set(self._index.all_predicates()), self._snapshots)
        traces = await self._apply_units(units, force=force)
        if traces:
            emit_trace(self._hass, TraceEvent(cause, traces))

    async def async_initial_sync(self) -> None:
        """Startup 'sync to reality': snapshot everything, seed flip state, and
        apply each enabled scope's current winner, labelled 'Startup'."""
        await self._sync(
            self._all_units(), TriggerCause(kind=CauseKind.STARTUP), force=False
        )
```

Note: the original `_async_refresh` and `async_start` no longer share a method, because startup must seed flip-state (`async_initial_sync` does via `_sync`) and keep the STARTUP cause, while `_async_refresh` uses RELOADED and the narrow/forced units. `async_shutdown` is reproduced unchanged above — keep only one copy (delete the original at line 360-363 if it now duplicates).

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pytest tests/test_trigger_engine.py -v`
Expected: PASS — including the pre-existing `test_initial_sync_*` and `test_config_refresh_is_debounced` tests.

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/trigger_engine.py tests/test_trigger_engine.py
git commit -m "feat: narrow, force-applied RELOADED refresh on config change"
```

---

## Task 5: Wire the signal handler to pass `affected`

**Files:**
- Modify: `custom_components/ambience/__init__.py:301-307`
- Test: `tests/test_e2e_apply_scene.py`

- [ ] **Step 1: Write the failing test**

Add to `tests/test_e2e_apply_scene.py` (it already imports `DOMAIN`, `DATA_STORE`, `async_mock_service`, `async_fire_time_changed`, `datetime`, `UTC`, `timedelta`):

```python
async def test_config_change_emits_reloaded_not_startup(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """Saving a scope after setup emits a RELOADED trace, not STARTUP."""
    from custom_components.ambience.const import DATA_TRACE_BUFFER

    async_mock_service(hass, "light", "turn_on")
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    hass.states.async_set("binary_sensor.motion", "on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.motion",
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
    await hass.async_block_till_done()
    async_fire_time_changed(hass, datetime.now(UTC) + timedelta(seconds=1))
    await hass.async_block_till_done()
    buffer = hass.data[DOMAIN][DATA_TRACE_BUFFER]
    causes = {r.cause.kind for r in buffer.records()}
    assert "reloaded" in causes
    assert "startup" not in causes
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pytest tests/test_e2e_apply_scene.py::test_config_change_emits_reloaded_not_startup -v`
Expected: FAIL — `__init__`'s handler still calls `async_request_refresh()` without first calling `note_config_changed`, so `_pending_affected`/`_pending_all` are empty and the narrow branch applies nothing (no RELOADED trace). (Depending on timing it may also still record STARTUP.)

- [ ] **Step 3: Pass `affected` to the engine**

In `custom_components/ambience/__init__.py`, replace the `_on_config_changed` handler (lines 301-305):

```python
    @callback
    def _on_config_changed(affected: tuple[str, str | None] | None = None) -> None:
        # Record what changed so the debounced refresh re-applies only that, then
        # request the (debounced) reload. A burst of saves coalesces into one
        # rebuild; their affected scopes accumulate.
        engine.note_config_changed(affected)
        hass.async_create_task(engine.async_request_refresh())
```

(`callback` is already imported in `__init__.py`; if not, add it to the `homeassistant.core` import.)

- [ ] **Step 4: Run the test to verify it passes**

Run: `pytest tests/test_e2e_apply_scene.py -v`
Expected: PASS — including the existing `test_engine_auto_applies_state_scene_on_config_change`.

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/__init__.py tests/test_e2e_apply_scene.py
git commit -m "feat: route the affected scope into the engine on config change"
```

---

## Task 6: Remove the redundant `_schedule_reapply`

**Files:**
- Modify: `custom_components/ambience/websocket.py:151-156` (delete fn) and lines 393, 452, 493 (delete calls)
- Test: `tests/test_websocket.py:2464-...` (rewrite `test_area_save_reapplies_scope` / `test_house_save_reapplies_house_scope`; add floor equivalent if missing)

- [ ] **Step 1: Rewrite the failing tests**

Replace `test_area_save_reapplies_scope` and `test_house_save_reapplies_house_scope` in `tests/test_websocket.py` (they patch `async_apply_scene`, which the save path no longer calls) with tests that assert the scope is re-applied through the engine's debounced refresh. Use the `installed` fixture's real wiring:

```python
async def test_area_save_reapplies_scope(
    hass: HomeAssistant, installed, hass_ws_client, area_id
) -> None:
    """Saving an area re-evaluates that scope via the engine's reload refresh."""
    from datetime import UTC, datetime, timedelta

    from pytest_homeassistant_custom_component.common import (
        async_fire_time_changed,
        async_mock_service,
    )

    calls = async_mock_service(hass, "light", "turn_on")
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    hass.states.async_set("binary_sensor.motion", "on")
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "scenes": [
                {
                    "category": "lighting",
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.motion",
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
    assert resp["success"] is True
    await hass.async_block_till_done()
    async_fire_time_changed(hass, datetime.now(UTC) + timedelta(seconds=1))
    await hass.async_block_till_done()
    assert len(calls) >= 1
```

For `test_house_save_reapplies_house_scope`, mirror the above with `type="ambience/house/save"` and no `area_id`. (`DATA_EXPOSED_ACTIONS` is already imported in this test module; if not, import it from `custom_components.ambience.const`.)

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pytest tests/test_websocket.py -k "reapplies_scope or reapplies_house" -v`
Expected: FAIL — they still pass against the old `_schedule_reapply` path only if unchanged; after rewriting (still referencing the old patched behavior) they fail because the new assertion needs the engine path that isn't wired through the save yet. (If they pass immediately, the engine already re-applies — proceed to Step 3 to remove the now-dead `_schedule_reapply`.)

- [ ] **Step 3: Delete `_schedule_reapply` and its calls**

In `custom_components/ambience/websocket.py`:
- Delete the `_schedule_reapply` function (lines 151-156).
- Delete the call `_schedule_reapply(hass, "area", area_id)` (line 393).
- Delete the call `_schedule_reapply(hass, "floor", floor_id)` (line 452).
- Delete the call `_schedule_reapply(hass, "house", None)` (line 493).

Leave the `async_apply_scene` import (still used at lines 623 and 1008 by the manual apply commands).

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pytest tests/test_websocket.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/websocket.py tests/test_websocket.py
git commit -m "refactor: drop redundant per-save reapply (engine reload covers it)"
```

---

## Task 7: Include traces in the main diagnostics dump

**Files:**
- Modify: `custom_components/ambience/diagnostics.py`
- Test: `tests/test_diagnostics.py`

- [ ] **Step 1: Write the failing test**

Add to `tests/test_diagnostics.py`. It seeds the buffer via `BufferSink` and a `TraceEvent`:

```python
async def test_config_entry_diagnostics_includes_traces(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    from custom_components.ambience.const import DATA_TRACE_BUFFER
    from custom_components.ambience.trace import (
        BufferSink,
        Outcome,
        TraceEvent,
        TriggerCause,
        UnitTrace,
    )

    buffer = BufferSink()
    buffer.emit(
        TraceEvent(
            TriggerCause(kind="reloaded"),
            [UnitTrace("area", "living_room", "general", "on", Outcome.ACTED, None)],
            event_id="abc",
            timestamp="2026-06-09T10:00:00+00:00",
        )
    )
    hass.data[DOMAIN][DATA_TRACE_BUFFER] = buffer

    result = await async_get_config_entry_diagnostics(hass, mock_config_entry)

    assert "traces" in result
    assert any(t["scope_id"] == "living_room" for t in result["traces"])
    assert result["traces"][0]["cause"]["kind"] == "reloaded"
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pytest tests/test_diagnostics.py::test_config_entry_diagnostics_includes_traces -v`
Expected: FAIL — `KeyError: 'traces'` (the dump has no traces key).

- [ ] **Step 3: Add traces to the dump**

In `custom_components/ambience/diagnostics.py`, update imports and `_store_dump`:

```python
from .const import DATA_STORE, DATA_TRACE_BUFFER, DOMAIN
from .trace import buffered_unit_to_dict
```

```python
def _traces_dump(hass: HomeAssistant) -> list[dict[str, Any]]:
    buffer = hass.data.get(DOMAIN, {}).get(DATA_TRACE_BUFFER)
    records = buffer.records() if buffer is not None else []
    return async_redact_data([buffered_unit_to_dict(r) for r in records], TO_REDACT)


def _store_dump(hass: HomeAssistant) -> dict[str, Any]:
    store = hass.data[DOMAIN][DATA_STORE]
    dump = async_redact_data(store.as_dict(), TO_REDACT)
    dump["traces"] = _traces_dump(hass)
    return dump
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pytest tests/test_diagnostics.py -v`
Expected: PASS (existing `test_config_entry_diagnostics_dumps_full_store` etc. still pass — they assert specific keys, and `traces` is additive).

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/diagnostics.py tests/test_diagnostics.py
git commit -m "feat: include traces in the diagnostics dump"
```

---

## Task 8: Per-(scope,category) diagnostics helper + WS command

**Files:**
- Modify: `custom_components/ambience/diagnostics.py` (add `scope_diagnostics`)
- Modify: `custom_components/ambience/websocket.py` (add `_ws_scope_diagnostics`, register it)
- Test: `tests/test_diagnostics.py`, `tests/test_websocket_traces.py`

- [ ] **Step 1: Write the failing helper test**

Add to `tests/test_diagnostics.py`:

```python
async def test_scope_diagnostics_bundles_config_context_and_traces(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    from custom_components.ambience.const import DATA_TRACE_BUFFER
    from custom_components.ambience.diagnostics import scope_diagnostics
    from custom_components.ambience.trace import (
        BufferSink,
        Outcome,
        TraceEvent,
        TriggerCause,
        UnitTrace,
    )

    buffer = BufferSink()
    buffer.emit(
        TraceEvent(
            TriggerCause(kind="reloaded"),
            [
                UnitTrace("area", "living_room", "general", "on", Outcome.ACTED, None),
                UnitTrace("area", "other", "general", "on", Outcome.ACTED, None),
            ],
            event_id="abc",
            timestamp="2026-06-09T10:00:00+00:00",
        )
    )
    hass.data[DOMAIN][DATA_TRACE_BUFFER] = buffer

    result = scope_diagnostics(hass, "area", "living_room", "general")

    assert result["scope"]["scope_kind"] == "area"
    assert result["scope"]["scope_id"] == "living_room"
    assert "scenes" in result["scope"]["config"]
    assert "categories" in result["context"]
    assert "conditions" in result["context"]
    # Only this scope+category's traces are included.
    assert len(result["traces"]) == 1
    assert result["traces"][0]["scope_id"] == "living_room"
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pytest tests/test_diagnostics.py::test_scope_diagnostics_bundles_config_context_and_traces -v`
Expected: FAIL — `ImportError: cannot import name 'scope_diagnostics'`.

- [ ] **Step 3: Add the helper**

In `custom_components/ambience/diagnostics.py`, add:

```python
def scope_diagnostics(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category: str
) -> dict[str, Any]:
    """A focused diagnostic bundle for one (scope, category): that scope's config,
    the global context needed to read it, and that unit's buffered traces — all
    redacted."""
    store = hass.data[DOMAIN][DATA_STORE]
    buffer = hass.data.get(DOMAIN, {}).get(DATA_TRACE_BUFFER)
    records = buffer.records() if buffer is not None else []
    mine = [
        r
        for r in records
        if r.unit.scope_kind == scope_kind
        and r.unit.scope_id == scope_id
        and r.unit.category == category
    ]
    payload = {
        "scope": {
            "scope_kind": scope_kind,
            "scope_id": scope_id,
            "category": category,
            "config": store.scope_config(scope_kind, scope_id),
        },
        "context": {
            "categories": store.categories(),
            "conditions": store.as_dict().get("conditions", {}),
        },
        "traces": [buffered_unit_to_dict(r) for r in mine],
    }
    return async_redact_data(payload, TO_REDACT)
```

- [ ] **Step 4: Run the helper test to verify it passes**

Run: `pytest tests/test_diagnostics.py::test_scope_diagnostics_bundles_config_context_and_traces -v`
Expected: PASS

- [ ] **Step 5: Write the failing WS-command test**

Add to `tests/test_websocket_traces.py` (model on the existing trace command tests in that file — reuse its fixtures for the buffer + ws client). If that module lacks an admin ws-client fixture, mirror the setup used by the existing `ambience/traces/list` test in the same file:

```python
async def test_ws_scope_diagnostics_returns_bundle(
    hass: HomeAssistant, hass_ws_client
) -> None:
    from custom_components.ambience.const import DATA_STORE, DATA_TRACE_BUFFER, DOMAIN
    from custom_components.ambience.store import AmbienceStore
    from custom_components.ambience.trace import (
        BufferSink,
        Outcome,
        TraceEvent,
        TriggerCause,
        UnitTrace,
    )
    from custom_components.ambience.websocket import async_register_commands

    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area("a", {"scenes": []})
    buffer = BufferSink()
    buffer.emit(
        TraceEvent(
            TriggerCause(kind="reloaded"),
            [UnitTrace("area", "a", "general", "on", Outcome.ACTED, None)],
            event_id="x",
            timestamp="2026-06-09T10:00:00+00:00",
        )
    )
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_STORE] = store
    hass.data[DOMAIN][DATA_TRACE_BUFFER] = buffer
    async_register_commands(hass)

    client = await hass_ws_client(hass)
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/diagnostics/scope",
            "scope_kind": "area",
            "scope_id": "a",
            "category": "general",
        }
    )
    resp = await client.receive_json()
    assert resp["success"] is True
    assert resp["result"]["scope"]["scope_id"] == "a"
    assert len(resp["result"]["traces"]) == 1
```

Confirm the registration entrypoint name (`async_register_commands`) against the top of `websocket.py`; use whatever the existing trace tests call.

- [ ] **Step 6: Run the WS test to verify it fails**

Run: `pytest tests/test_websocket_traces.py::test_ws_scope_diagnostics_returns_bundle -v`
Expected: FAIL — unknown command `ambience/diagnostics/scope`.

- [ ] **Step 7: Add and register the command**

In `custom_components/ambience/websocket.py`, add the import near the other diagnostics-free imports:

```python
from .diagnostics import scope_diagnostics
```

Add the handler next to the trace handlers (after `_ws_traces_clear`, ~line 1140):

```python
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/diagnostics/scope",
        vol.Required("scope_kind"): str,
        vol.Optional("scope_id"): vol.Any(str, None),
        vol.Required("category"): str,
    }
)
@websocket_api.async_response
async def _ws_scope_diagnostics(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    connection.send_result(
        msg["id"],
        scope_diagnostics(
            hass, msg["scope_kind"], msg.get("scope_id"), msg["category"]
        ),
    )
```

Register it alongside the trace commands (near line 145-146):

```python
    websocket_api.async_register_command(hass, _ws_traces_clear)
    websocket_api.async_register_command(hass, _ws_scope_diagnostics)
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `pytest tests/test_websocket_traces.py tests/test_diagnostics.py -v`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add custom_components/ambience/diagnostics.py custom_components/ambience/websocket.py tests/test_diagnostics.py tests/test_websocket_traces.py
git commit -m "feat: per-(scope,category) diagnostics WS command"
```

---

## Task 9: Frontend download helper + button

**Files:**
- Modify: `frontend/src/api.ts` (add `downloadScopeDiagnostics`)
- Modify: `frontend/src/views/traces-modal.ts` (header button)
- Test: `test/api-full.test.ts` (or a new `test/api-diagnostics.test.ts`), `test/traces-modal.test.ts`

- [ ] **Step 1: Write the failing API test**

Create `test/api-diagnostics.test.ts`:

```typescript
import { afterEach, describe, expect, test, vi } from "vitest";
import { downloadScopeDiagnostics } from "../frontend/src/api";

describe("downloadScopeDiagnostics", () => {
  afterEach(() => vi.restoreAllMocks());

  test("requests the scope bundle and triggers a JSON download", async () => {
    const callWS = vi.fn(async () => ({ scope: { scope_id: "kitchen" }, traces: [] }));
    const hass: any = { callWS };

    const created: string[] = [];
    vi.spyOn(URL, "createObjectURL").mockImplementation(() => "blob:x");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const clicks: HTMLAnchorElement[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clicks.push(this);
    });

    await downloadScopeDiagnostics(hass, { scope_kind: "area", scope_id: "kitchen" }, "g1");

    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/diagnostics/scope",
      scope_kind: "area",
      scope_id: "kitchen",
      category: "g1",
    });
    expect(clicks).toHaveLength(1);
    expect(clicks[0].download).toBe("ambience-area-kitchen-g1.json");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- api-diagnostics`
Expected: FAIL — `downloadScopeDiagnostics` is not exported from `api.ts`.

- [ ] **Step 3: Add the helper**

In `frontend/src/api.ts`, add after `listTraces`:

```typescript
export async function downloadScopeDiagnostics(
  hass: HassConnection,
  scope: { scope_kind: string; scope_id: string | null },
  category: string,
): Promise<void> {
  const data = await hass.callWS({
    type: "ambience/diagnostics/scope",
    scope_kind: scope.scope_kind,
    scope_id: scope.scope_id,
    category,
  });
  const filename = `ambience-${scope.scope_kind}-${scope.scope_id ?? "house"}-${category}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

If `callWS` is generically typed, annotate the call as `hass.callWS<unknown>({...})` to satisfy Biome/TS; match the surrounding style in `api.ts`.

- [ ] **Step 4: Run the API test to verify it passes**

Run: `npm run test -- api-diagnostics`
Expected: PASS

- [ ] **Step 5: Write the failing modal-button test**

In `test/traces-modal.test.ts`, extend the mock at the top so the new import resolves, then add a test. Update the `vi.mock` factory:

```typescript
vi.mock("../frontend/src/api", () => ({
  listTraces: vi.fn(),
  getServiceSchema: vi.fn(),
  downloadScopeDiagnostics: vi.fn(),
}));
```

Add this test inside the `describe`:

```typescript
test("download button calls downloadScopeDiagnostics with this scope+category", async () => {
  el = await mount([unit()]);
  const btn = el.shadowRoot.querySelector(".download");
  expect(btn).toBeTruthy();
  btn.click();
  expect(api.downloadScopeDiagnostics).toHaveBeenCalledWith(
    el.hass,
    { scope_kind: "area", scope_id: "kitchen" },
    "g1",
  );
});
```

- [ ] **Step 6: Run the modal test to verify it fails**

Run: `npm run test -- traces-modal`
Expected: FAIL — there is no `.download` button in the modal.

- [ ] **Step 7: Add the button**

In `frontend/src/views/traces-modal.ts`:

Update the api import (line 4):

```typescript
import { downloadScopeDiagnostics, getServiceSchema, type HassConnection, listTraces } from "../api.js";
```

Add a click handler method (near `_onClose`, line 177):

```typescript
  private _download(): void {
    void downloadScopeDiagnostics(this.hass, this.scope, this.category);
  }
```

Add the button in the header, between the Refresh and Close buttons (after line 190):

```typescript
          <button class="download" @click=${this._download}>Download diagnostics</button>
```

Add a `.download` style alongside `.refresh` in the `css` block (after the `.refresh.has-new` rule, ~line 56):

```css
      .download {
        padding: 0.25rem 0.75rem; cursor: pointer;
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 4px; background: none; color: inherit;
        font-size: 0.85rem;
      }
```

- [ ] **Step 8: Run the modal test to verify it passes**

Run: `npm run test -- traces-modal`
Expected: PASS

- [ ] **Step 9: Build the frontend and commit**

```bash
npm run build
git add frontend/src/api.ts frontend/src/views/traces-modal.ts test/api-diagnostics.test.ts test/traces-modal.test.ts custom_components/ambience/frontend
git commit -m "feat: per-scope diagnostics download button in traces modal"
```

(`npm run build` regenerates the bundled assets under `custom_components/ambience/frontend` — include them in the commit, per project memory "Always rebuild after frontend changes".)

---

## Task 10: Full verification & docs

**Files:**
- Possibly: `README` / user docs if traces/diagnostics are documented; `CHANGELOG` if present.

- [ ] **Step 1: Run the full backend suite**

Run: `pytest`
Expected: all pass.

- [ ] **Step 2: Run the full frontend suite + lint/format**

Run: `npm run test && npm run ci`
Expected: all pass; Biome clean.

- [ ] **Step 3: Run Python lint/format**

Run: `ruff check . && ruff format --check .`
Expected: clean (run `ruff format .` to fix if needed).

- [ ] **Step 4: Update docs if traces/diagnostics are user-documented**

Search docs for "Startup" / "diagnostics" / "traces": `grep -rni "startup\|diagnostics\|traces" docs/ README* 2>/dev/null`. If the trace causes or the diagnostics download are documented, note the new "Reloaded" cause and the per-(scope,category) "Download diagnostics" button. If nothing relevant, skip.

- [ ] **Step 5: Commit any doc changes**

```bash
git add -A
git commit -m "docs: note Reloaded cause and per-scope diagnostics download"
```

---

## Self-review notes

- **Spec coverage:** Part A → Tasks 1-6 (RELOADED label, narrow/forced rerun, signal threading, drop double-apply). Part B → Task 7. Part C → Tasks 8-9. Verification/docs → Task 10.
- **Type consistency:** `note_config_changed(affected)`, `_pending_affected`/`_pending_all`, `_sync(units, cause, *, force)`, `_all_units()`, `_units_for(scopes)`, `scope_diagnostics(hass, scope_kind, scope_id, category)`, and `downloadScopeDiagnostics(hass, scope, category)` are named identically everywhere they appear.
- **Known limitation** (from spec): key-based redaction does not scrub entity ids embedded in free-form predicate `detail` strings inside traces; acceptable since the API and diagnostics are admin-only.
