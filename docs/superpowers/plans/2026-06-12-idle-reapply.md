# Idle Re-apply Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the per-action `reapply_seconds` mechanism (preserved on a branch) and add a global, idle-gated re-apply that force re-asserts each `(scope, category)` unit's scene after N minutes of no dispatch.

**Architecture:** Per-unit one-shot `async_call_later` timers in the trigger engine, (re)armed at the single `last_applied` dispatch chokepoint (`async_execute_plan`) via a new `SIGNAL_UNIT_APPLIED` dispatcher signal. When a timer fires it refreshes snapshots and calls the existing `_resolve_and_apply(force=True)`, which re-resolves and re-dispatches even when the winner is unchanged. A global on/off + interval lives in a new `reapply` store blob, edited through a websocket pair mirroring `switch_defaults`.

**Tech Stack:** Python (Home Assistant custom component, pytest + `pytest-homeassistant-custom-component`, ruff, 99% branch-coverage gate), TypeScript/Lit frontend (vitest, Biome, esbuild).

Spec: [docs/superpowers/specs/2026-06-12-idle-reapply-design.md](../specs/2026-06-12-idle-reapply-design.md)

---

## File Structure

**Phase 1 — removal (one revertable commit):**
- `custom_components/ambience/`: `validators.py` (delete file), `const.py`, `exposed_actions.py`, `service.py`, `service_logbook.py`, `trace.py`, `trigger_engine.py`, `trigger_subscriptions.py`, `websocket.py`, `websocket_helpers.py`
- `frontend/src/`: `reapply.ts` (delete file), `types.ts`, `i18n-data.ts`, `trace-detail.ts`, `views/auto-triggers-modal.ts`, `views/scene-editor.ts`, `views/actions-settings.ts`
- Tests: `tests/test_validators.py` (delete), `frontend test/reapply.test.ts` (delete), plus reapply cases pruned from the listed test files.

**Phase 2 — new feature (one commit per task):**
- `const.py` — signals + reapply defaults
- `store.py` — `reapply` blob: get/save/validate/ensure
- `websocket.py` — `ambience/reapply/list` + `/save`
- `trace.py` — re-add `CauseKind.REAPPLY` + describe
- `service.py` — emit `SIGNAL_UNIT_APPLIED` at the dispatch chokepoint
- `trigger_subscriptions.py` — per-unit reapply timers (state + arm/cancel/rearm/fire); `trigger_engine.py` — timer dict init
- `__init__.py` — connect the two new signals to engine handlers
- `frontend/src/`: `types.ts`, `api.ts`, `views/ambience-settings.ts`, `i18n-data.ts`
- Tests: extend `tests/test_store.py`, `tests/test_websocket.py`, `tests/test_trace.py`, `tests/test_service.py`, `tests/test_trigger_engine.py` (+ the `FakeStore` double), an `__init__`/setup test, and `test/ambience-settings.test.ts`.

---

## PHASE 1 — Remove the old `reapply_seconds` feature

### Task 1: Preserve, then remove the per-action reapply feature

This is **one self-contained commit**. The archive branch keeps the old code; the single commit must `git revert` cleanly later. Removal is mechanical — the test suite and the 99% coverage gate are the spec: after deleting the feature and its tests, any branch that is now unreachable must also be deleted (they are enumerated below).

**Files:** (create) none; (delete) `custom_components/ambience/validators.py`, `tests/test_validators.py`, `frontend/src/reapply.ts`, `frontend/test/reapply.test.ts`; (modify) the rest listed under File Structure.

- [ ] **Step 1: Create the archive branch at the current HEAD**

```bash
git branch archive/reapply-seconds
git push -u origin archive/reapply-seconds   # optional: publish so it survives worktree teardown
```

Expected: `archive/reapply-seconds` points at the pre-removal commit. Stay on `reapply`.

- [ ] **Step 2: Remove backend production code**

Delete file `custom_components/ambience/validators.py` (its whole contents are `MIN_REAPPLY_SECONDS` + `validate_reapply_seconds`).

In `custom_components/ambience/const.py`: nothing references reapply here (verify with grep below) — no change unless grep finds one.

In `custom_components/ambience/exposed_actions.py`:
- remove the import `from .validators import validate_reapply_seconds` (line ~26)
- remove the block (lines ~77-78):
```python
            if "reapply_seconds" in entry:
                validate_reapply_seconds(sid, entry["reapply_seconds"])
```

In `custom_components/ambience/websocket_helpers.py`:
- remove `from .validators import validate_reapply_seconds` (line ~26)
- remove the block (lines ~116-118):
```python
            if "reapply_seconds" in action_spec:
                validate_reapply_seconds(
                    f"scene {scene_idx} action {action_idx}", action_spec["reapply_seconds"]
                )
```

In `custom_components/ambience/service.py`: delete `scope_reapply_intervals` (lines ~679-688) and `effective_reapply_seconds` (lines ~691-708), and the now-unused `MIN_REAPPLY_SECONDS` import (line ~40).

In `custom_components/ambience/trigger_engine.py`:
- remove `scope_reapply_intervals` from the `.service` import (line ~40)
- remove `DATA_EXPOSED_ACTIONS` from the `.const` import **only if** it becomes unused (grep first — it is also used by `_build_reapply_intervals`; if no other use remains, drop it)
- remove `self._reapply_intervals = {}` init (line ~101)
- remove `self._reapply_intervals = self._build_reapply_intervals()` (line ~161)
- delete the `_build_reapply_intervals` method (lines ~178-186)

In `custom_components/ambience/trigger_subscriptions.py`:
- remove `effective_reapply_seconds` from the `.service` import (line ~38)
- remove the reapply-interval subscription loop in `async_subscribe` (lines ~135-142)
- delete `_make_reapply_handler` (lines ~187-196), `_reapply_tick` (lines ~198-200), `_reapply_scope` (lines ~202-257)
- remove the now-unused imports made dead by the above: `asyncio` (used only by `_reapply_tick` — verify), `log_apply` (line ~41), `DATA_EXPOSED_ACTIONS` from `.const` (verify), `get_last_applied` from `.service` (verify). Grep before removing each.

In `custom_components/ambience/websocket.py`:
- remove `scope_reapply_intervals` from imports (line ~40)
- in `scope_triggers` handler, delete the reapply rows (lines ~432-436):
```python
    exposed = hass.data[DOMAIN].get(DATA_EXPOSED_ACTIONS)
    for interval in scope_reapply_intervals(cfg, exposed):
        triggers.append(
            {"key": f"reapply:{interval}", "kind": "reapply", "interval_seconds": interval}
        )
```
(keep the surrounding `spec`/`triggers`/`send_result` lines; drop the now-unused `exposed`/`DATA_EXPOSED_ACTIONS` only if grep shows no other use in the file).

- [ ] **Step 3: Remove the now-dead trace/logbook branches (coverage gate)**

In `custom_components/ambience/trace.py`:
- delete `REAPPLY = "reapply"` from `CauseKind` (line ~53)
- delete the `if self.kind == CauseKind.REAPPLY:` branch in `describe()` (lines ~108-109)
- delete `REAPPLIED = "reapplied"` from `Outcome` (line ~72)
- change `_CHANGES_OUTCOMES = (Outcome.ACTED, Outcome.REAPPLIED)` to `_CHANGES_OUTCOMES = (Outcome.ACTED,)` (line ~316)
- delete the re-apply `elif` in `format_trace_event` (lines ~287-289):
```python
        elif explanation is None and unit.winner_name is not None:
            # Re-apply: no resolution happened, so no scene index — name only.
            winner = f" -> {unit.winner_name!r}"
```

In `custom_components/ambience/service_logbook.py`: drop the `reapplied` flag entirely.
- `compose_apply_message`: remove the `reapplied: bool` parameter and change `verb = "re-applied" if reapplied else "applied"` to `verb = "applied"`.
- `log_apply`: remove the `reapplied: bool` keyword parameter and the `reapplied=reapplied` argument it forwards to `compose_apply_message`.

In `custom_components/ambience/service.py` (`async_execute_plan`, line ~638): change the call to `log_apply(hass, scope_kind, scope_id, category_id, plan["scene_name"], index)` (drop `reapplied=False`).

- [ ] **Step 4: Remove frontend production code**

Delete file `frontend/src/reapply.ts`.

In `frontend/src/types.ts`:
- remove `reapply_seconds?: number;` from `ActionSpec` (line ~38) and its comment (lines ~36-37)
- remove `reapply_seconds?: number;` from `ExposedAction` (line ~56) and its comment (lines ~54-55)
- remove `| { kind: "reapply"; interval_seconds: number }` from the `TriggerDescriptor` union (line ~316) and `"reapply"` from the kind string union (line ~338); remove the `reapply` row comment (line ~306).

In `frontend/src/trace-detail.ts`: remove the `reapply: "Periodic refresh",` map entry (line ~195).

In `frontend/src/views/auto-triggers-modal.ts`: remove `import { formatReapplyInterval } from "../reapply.js";` (line ~6), the `reapply: "mdi:refresh",` icon entry (line ~14), and the `case "reapply":` block (lines ~254-258).

In `frontend/src/views/scene-editor.ts`: remove `import { effectiveReapplySeconds, parseReapplyOverrideSeconds } from "../reapply.js";` (line ~8); delete the `_setReapplyOverride` and `_renderReapplyOverride` methods (lines ~1036-1075); remove the `${this._renderReapplyOverride(...)}` call (line ~1124), the `reapply-badge` render (lines ~1080-1093 region around `effectiveReapplySeconds`), and the `.reapply-override` / `.reapply-badge` CSS (lines ~179-210).

In `frontend/src/views/actions-settings.ts`: remove `import { DEFAULT_REAPPLY_SECONDS, parseReapplyConfigSeconds } from "../reapply.js";` (line ~20) and the reapply control block (the checkbox + seconds field, lines ~937-968, plus the `DEFAULT_REAPPLY_SECONDS` use near line ~597).

In `frontend/src/i18n-data.ts`: remove `auto_trigger_reapply` (line ~152), `auto_trigger_every` (line ~153), `reapply_enable_label` (line ~214), `reapply_seconds_label` (line ~215), `reapply_seconds_unit` (line ~216).

- [ ] **Step 5: Remove the tests for the deleted feature**

- Delete `tests/test_validators.py` and `frontend/test/reapply.test.ts`.
- In `tests/test_trigger_engine.py`: delete `test_reapply_fires_due_action_for_winning_scene`, `test_reapply_attributes_to_ambience`, `test_reapply_emits_trace_event`, `test_reapply_skips_when_switch_off`, `test_reapply_skips_when_scene_is_not_the_winner`, `test_reapply_skips_when_no_scene_active`, `test_reapply_distinct_intervals_fire_independently`, and the `_exposed_store_with` helper if now unused.
- In `tests/test_service.py`: delete the `effective_reapply_seconds` / `scope_reapply_intervals` tests (lines ~1010-1093).
- In `tests/test_exposed_actions.py`: delete the `reapply_seconds` validation tests (lines ~232-263).
- In `tests/test_websocket.py`: delete the `reapply_seconds` save-validation tests (lines ~1871-1901) and any `reapply` trigger-descriptor assertions in the `scope_triggers` tests.
- In `tests/test_websocket_helpers.py`: delete `*reapply_seconds*` tests (lines ~208-243).
- In `tests/test_trigger_subscriptions.py`: remove `reapply_seconds` from fixtures (lines ~299, ~329) and any reapply-specific test.
- In `tests/test_logbook_attribution.py`: delete `test_message_reapplied_verb` (line ~89) and `test_message_reapplied_single_category` (line ~114); remove the `reapplied=False,` / `reapplied=True,` argument from every remaining `compose_apply_message(...)` call (lines ~55, ~67, ~79, ~91, ~104, ~116) — the param no longer exists.
- In `tests/test_trace.py`: delete the tests that exercise the removed `"reapplied"` outcome / the re-apply winner-name-only rendering — `test_logsink_routes_reapplied_to_changes_stream` (line ~240) and `test_buffered_unit_to_dict_reapplied_has_null_explanation` (line ~465), plus the `format_trace_event` assertion block using a `"reapplied"` `UnitTrace` (lines ~225-236).
- In the frontend tests `actions-settings.test.ts`, `scene-editor.test.ts`, `auto-triggers-modal.test.ts`, `auto-triggers-modal-icon.test.ts`, `api-auto-triggers.test.ts`: delete every `reapply`-referencing test/assertion.

- [ ] **Step 6: Verify everything is green, then commit once**

Run, in order:
```bash
grep -rn "reapply" custom_components frontend/src tests test docs   # expect: ZERO hits
ruff check . && ruff format .
pytest --cov=custom_components.ambience --cov-branch --cov-report=term-missing --cov-fail-under=99
npm run ci && npm run check && npm test && npm run build
```
Expected: the grep returns nothing; ruff clean; pytest passes at ≥99% with no "missing" lines in the touched files (if coverage flags a newly-dead branch, delete it — it belonged to the removed feature); frontend lint/types/tests/build all pass.

```bash
git add -A
git commit -m "feat: remove per-action reapply_seconds (archived on archive/reapply-seconds)

The fixed-interval per-action reapply is replaced by the upcoming
idle-gated re-apply. Preserved on archive/reapply-seconds; this commit
reverts cleanly to restore it."
```

---

## PHASE 2 — Idle re-apply

### Task 2: Reapply settings in const + store

**Files:**
- Modify: `custom_components/ambience/const.py`, `custom_components/ambience/store.py`
- Test: `tests/test_store.py`

- [ ] **Step 1: Add constants and signals**

In `custom_components/ambience/const.py`, after `SIGNAL_CONFIG_CHANGED` (line ~48) and the switch defaults (lines ~51-52), add:
```python
# Dispatcher signal — fired after a unit's actions are dispatched (last-applied
# recorded). Payload: the (scope_kind, scope_id, category_id) unit. Drives the
# idle re-apply timer reset.
SIGNAL_UNIT_APPLIED = "ambience_unit_applied"

# Dispatcher signal — fired when the global re-apply settings change. Payload: None.
SIGNAL_REAPPLY_CONFIG_UPDATED = "ambience_reapply_config_updated"

# Idle re-apply: re-assert each unit's scene after this many seconds of no
# dispatch. Off by default; interval pre-filled at 90 min. Floor keeps tests
# fast and rejects nonsensical values.
DEFAULT_REAPPLY_ENABLED = False
DEFAULT_REAPPLY_INTERVAL_SECONDS = 5400
MIN_REAPPLY_INTERVAL_SECONDS = 60
```

- [ ] **Step 2: Write failing store tests**

In `tests/test_store.py`, add (match the file's existing fixture style for constructing an `AmbienceStore`):
```python
async def test_reapply_settings_default_off(hass):
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_reapply_settings() == {"enabled": False, "interval_seconds": 5400}


async def test_save_and_get_reapply_settings(hass):
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_reapply_settings({"enabled": True, "interval_seconds": 3600})
    assert store.get_reapply_settings() == {"enabled": True, "interval_seconds": 3600}


async def test_save_reapply_settings_rejects_non_bool_enabled(hass):
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError):
        await store.async_save_reapply_settings({"enabled": 1, "interval_seconds": 3600})


async def test_save_reapply_settings_rejects_interval_below_floor(hass):
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError):
        await store.async_save_reapply_settings({"enabled": True, "interval_seconds": 30})


async def test_ensure_reapply_settings_backfills_legacy_store(hass):
    store = AmbienceStore(hass)
    await store.async_load()
    del store._data["reapply"]  # simulate a store saved before this key existed
    store._ensure_reapply_settings()
    assert store.get_reapply_settings() == {"enabled": False, "interval_seconds": 5400}
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `pytest tests/test_store.py -k reapply -v`
Expected: FAIL (`AttributeError: ... has no attribute 'get_reapply_settings'`).

- [ ] **Step 4: Implement the store methods**

In `custom_components/ambience/store.py`:

Add to the `.const` import (lines ~14-21):
```python
    DEFAULT_REAPPLY_ENABLED,
    DEFAULT_REAPPLY_INTERVAL_SECONDS,
    MIN_REAPPLY_INTERVAL_SECONDS,
```

In `_empty()` (after the `switch_defaults` block, line ~78):
```python
            "reapply": {
                "enabled": DEFAULT_REAPPLY_ENABLED,
                "interval_seconds": DEFAULT_REAPPLY_INTERVAL_SECONDS,
            },
```

Add an ensure method next to `_ensure_switch_defaults` (line ~103):
```python
    def _ensure_reapply_settings(self) -> None:
        r = self._data.setdefault("reapply", {})
        r.setdefault("enabled", DEFAULT_REAPPLY_ENABLED)
        r.setdefault("interval_seconds", DEFAULT_REAPPLY_INTERVAL_SECONDS)
```

Call it in `async_load`, right after `self._ensure_switch_defaults()` (line ~121):
```python
        self._ensure_reapply_settings()
```

Add the validator + getter + setter next to the switch-defaults ones (after line ~317):
```python
    @staticmethod
    def _validate_reapply_settings(payload: dict[str, Any]) -> None:
        enabled = payload.get("enabled")
        if not isinstance(enabled, bool):
            raise ValueError(f"reapply `enabled` must be a bool: {enabled!r}")
        interval = payload.get("interval_seconds")
        if (
            not isinstance(interval, int)
            or isinstance(interval, bool)
            or interval < MIN_REAPPLY_INTERVAL_SECONDS
        ):
            raise ValueError(
                f"reapply `interval_seconds` must be an int >= "
                f"{MIN_REAPPLY_INTERVAL_SECONDS}: {interval!r}"
            )

    def get_reapply_settings(self) -> dict[str, Any]:
        r = self._data.get("reapply", {})
        return {
            "enabled": r.get("enabled", DEFAULT_REAPPLY_ENABLED),
            "interval_seconds": r.get("interval_seconds", DEFAULT_REAPPLY_INTERVAL_SECONDS),
        }

    async def async_save_reapply_settings(self, payload: dict[str, Any]) -> None:
        self._validate_reapply_settings(payload)
        self._data["reapply"] = {
            "enabled": payload["enabled"],
            "interval_seconds": payload["interval_seconds"],
        }
        await self._store.async_save(self._data)
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `pytest tests/test_store.py -k reapply -v`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add custom_components/ambience/const.py custom_components/ambience/store.py tests/test_store.py
git commit -m "feat(reapply): global reapply settings in store (enabled + interval)"
```

---

### Task 3: WebSocket list/save for reapply settings

**Files:**
- Modify: `custom_components/ambience/websocket.py`
- Test: `tests/test_websocket.py`

- [ ] **Step 1: Write failing websocket tests**

In `tests/test_websocket.py` (follow the file's existing client/`MockConfigEntry` setup helpers used by the `switch_defaults` tests):
```python
async def test_reapply_list_returns_defaults(hass, hass_ws_client):
    client = await _setup_and_connect(hass, hass_ws_client)  # same helper the switch_defaults tests use
    await client.send_json({"id": 1, "type": "ambience/reapply/list"})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"] == {"enabled": False, "interval_seconds": 5400}


async def test_reapply_save_persists_and_signals(hass, hass_ws_client):
    from custom_components.ambience.const import SIGNAL_REAPPLY_CONFIG_UPDATED
    from homeassistant.helpers.dispatcher import async_dispatcher_connect

    fired = []
    async_dispatcher_connect(hass, SIGNAL_REAPPLY_CONFIG_UPDATED, lambda *_a: fired.append(True))
    client = await _setup_and_connect(hass, hass_ws_client)
    await client.send_json(
        {"id": 1, "type": "ambience/reapply/save", "enabled": True, "interval_seconds": 3600}
    )
    msg = await client.receive_json()
    assert msg["success"] and msg["result"] == {"ok": True}
    assert fired == [True]
    store = hass.data[DOMAIN][DATA_STORE]
    assert store.get_reapply_settings() == {"enabled": True, "interval_seconds": 3600}


async def test_reapply_save_rejects_bad_interval(hass, hass_ws_client):
    client = await _setup_and_connect(hass, hass_ws_client)
    await client.send_json(
        {"id": 1, "type": "ambience/reapply/save", "enabled": True, "interval_seconds": 30}
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "validation_error"
```

- [ ] **Step 2: Run to verify they fail**

Run: `pytest tests/test_websocket.py -k reapply -v`
Expected: FAIL (unknown command `ambience/reapply/list`).

- [ ] **Step 3: Implement the two commands and register them**

In `custom_components/ambience/websocket.py`, add `SIGNAL_REAPPLY_CONFIG_UPDATED` to the `.const` import (near line ~29), and add after `_ws_switch_defaults_save` (line ~822):
```python
@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/reapply/list"})
@websocket_api.async_response
async def _ws_reapply_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    connection.send_result(msg["id"], hass.data[DOMAIN][DATA_STORE].get_reapply_settings())


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/reapply/save",
        vol.Required("enabled"): bool,
        vol.Required("interval_seconds"): int,
    }
)
@websocket_api.async_response
async def _ws_reapply_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    try:
        await store.async_save_reapply_settings(
            {"enabled": msg["enabled"], "interval_seconds": msg["interval_seconds"]}
        )
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    async_dispatcher_send(hass, SIGNAL_REAPPLY_CONFIG_UPDATED, None)
    connection.send_result(msg["id"], {"ok": True})
```

In the handler-registration list (the tuple/list around line ~1202 that includes `_ws_switch_defaults_list`, `_ws_switch_defaults_save`), add `_ws_reapply_list,` and `_ws_reapply_save,`.

- [ ] **Step 4: Run to verify they pass**

Run: `pytest tests/test_websocket.py -k reapply -v`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/websocket.py tests/test_websocket.py
git commit -m "feat(reapply): websocket list/save for reapply settings"
```

---

### Task 4: Re-add `CauseKind.REAPPLY` for the idle trace

**Files:**
- Modify: `custom_components/ambience/trace.py`
- Test: `tests/test_trace.py`

- [ ] **Step 1: Write a failing describe test**

In `tests/test_trace.py`:
```python
def test_reapply_cause_describe_with_detail():
    from custom_components.ambience.trace import CauseKind, TriggerCause

    cause = TriggerCause(kind=CauseKind.REAPPLY, detail="1h 30m")
    assert cause.describe() == "reapply (1h 30m)"


def test_reapply_cause_describe_without_detail():
    from custom_components.ambience.trace import CauseKind, TriggerCause

    assert TriggerCause(kind=CauseKind.REAPPLY).describe() == "reapply"
```

- [ ] **Step 2: Run to verify it fails**

Run: `pytest tests/test_trace.py -k reapply -v`
Expected: FAIL (`AttributeError: REAPPLY`).

- [ ] **Step 3: Re-add the enum value and describe branch**

In `custom_components/ambience/trace.py`, add to `CauseKind` (after `RELOADED`, line ~52):
```python
    # An idle-reapply timer fired: re-assert a unit's scene after inactivity.
    REAPPLY = "reapply"
```
In `TriggerCause.describe()`, add before the `SIMULATED` branch (line ~110):
```python
        if self.kind == CauseKind.REAPPLY:
            return f"reapply ({self.detail})" if self.detail else "reapply"
```

- [ ] **Step 4: Run to verify it passes**

Run: `pytest tests/test_trace.py -k reapply -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/trace.py tests/test_trace.py
git commit -m "feat(reapply): re-add CauseKind.REAPPLY for idle-reapply traces"
```

---

### Task 5: Emit `SIGNAL_UNIT_APPLIED` at the dispatch chokepoint

**Files:**
- Modify: `custom_components/ambience/service.py`
- Test: `tests/test_service.py`

- [ ] **Step 1: Write failing tests**

In `tests/test_service.py` (the file already exercises `async_execute_plan`; reuse its setup for `hass.data[DOMAIN]`, an exposed store, and a registered service):
```python
async def test_execute_plan_emits_unit_applied_when_actions_dispatched(hass):
    from custom_components.ambience.const import SIGNAL_UNIT_APPLIED
    from homeassistant.helpers.dispatcher import async_dispatcher_connect

    seen = []
    async_dispatcher_connect(hass, SIGNAL_UNIT_APPLIED, lambda unit: seen.append(unit))
    async_mock_service(hass, "light", "turn_on")
    exposed = ExposedActionsStore(_FakeExposedStorage([_exposed("light.turn_on")]))
    hass.data[DOMAIN] = {DATA_EXPOSED_ACTIONS: exposed, DATA_STORE: FakeStore({})}
    plan = {
        "matched_scene_index": 0,
        "scene_name": "Evening",
        "actions": [{"service": "light.turn_on", "entity_ids": ["light.a"], "params": {}}],
    }
    await async_execute_plan(hass, "area", "k", plan, "g")
    assert seen == [("area", "k", "g")]


async def test_execute_plan_no_signal_for_pure_blocker(hass):
    from custom_components.ambience.const import SIGNAL_UNIT_APPLIED
    from homeassistant.helpers.dispatcher import async_dispatcher_connect

    seen = []
    async_dispatcher_connect(hass, SIGNAL_UNIT_APPLIED, lambda unit: seen.append(unit))
    exposed = ExposedActionsStore(_FakeExposedStorage([_exposed("light.turn_on")]))
    hass.data[DOMAIN] = {DATA_EXPOSED_ACTIONS: exposed, DATA_STORE: FakeStore({})}
    plan = {"matched_scene_index": 0, "scene_name": "Block", "actions": []}
    await async_execute_plan(hass, "area", "k", plan, "g")
    assert seen == []
```
(`async_mock_service`, `ExposedActionsStore`, `_FakeExposedStorage`, `_exposed`, `FakeStore`, `DATA_EXPOSED_ACTIONS`, `DATA_STORE`, `DATA_LAST_APPLIED` are all already imported/defined in `test_service.py` — this mirrors `test_execute_plan_dispatches_actions_and_records_last_applied` near line 869.)

- [ ] **Step 2: Run to verify they fail**

Run: `pytest tests/test_service.py -k unit_applied -v`
Expected: FAIL (`seen == []` for the first test).

- [ ] **Step 3: Emit the signal**

In `custom_components/ambience/service.py`:
- ensure the dispatcher import exists at top: `from homeassistant.helpers.dispatcher import async_dispatcher_send` (add if missing)
- add `SIGNAL_UNIT_APPLIED` to the `.const` import
- in `async_execute_plan`, inside the existing `if actions:` block (lines ~649-651), after recording `last_applied`, add the dispatch:
```python
    if actions:
        domain_data = hass.data[DOMAIN]
        domain_data.setdefault(DATA_LAST_APPLIED, {})[(scope_kind, scope_id, category_id)] = index
        async_dispatcher_send(hass, SIGNAL_UNIT_APPLIED, (scope_kind, scope_id, category_id))
```

- [ ] **Step 4: Run to verify they pass**

Run: `pytest tests/test_service.py -k unit_applied -v`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/service.py tests/test_service.py
git commit -m "feat(reapply): emit SIGNAL_UNIT_APPLIED at the dispatch chokepoint"
```

---

### Task 6: Per-unit idle-reapply timers in the engine

**Files:**
- Modify: `custom_components/ambience/trigger_engine.py` (timer dict init), `custom_components/ambience/trigger_subscriptions.py` (timer methods)
- Test: `tests/test_trigger_engine.py` (+ `FakeStore` double)

- [ ] **Step 1: Extend the `FakeStore` test double**

In `tests/test_trigger_engine.py`, update `FakeStore.__init__` (line ~96) to accept reapply settings and add a getter:
```python
    def __init__(
        self,
        scopes: list[tuple[str, str | None, dict]],
        categories: list[dict] | None = None,
        reapply: dict | None = None,
    ) -> None:
        self._scopes = scopes
        self._by_key = {(kind, sid): cfg for kind, sid, cfg in scopes}
        self._categories = categories or []
        self._enabled: dict[tuple[str, str | None], bool] = {}
        self._reapply = reapply or {"enabled": False, "interval_seconds": 5400}

    def get_reapply_settings(self) -> dict:
        return dict(self._reapply)
```

- [ ] **Step 2: Write failing engine-timer tests**

Add to `tests/test_trigger_engine.py` (mirrors the deleted reapply tests' harness — `FakeStore`, `async_rebuild`, `async_subscribe`, `async_fire_time_changed`):
```python
def _reapply_hass_data(reapply, *, last_applied=True, switches=None):
    scene = {"when": {}, "category": "g", "name": "Evening",
             "actions": [{"service": "light.turn_on", "entity_ids": ["light.a"],
                          "params": {"brightness": 7}}]}
    return {
        DATA_STORE: FakeStore([("area", "k", {"scenes": [scene]})], reapply=reapply),
        DATA_CONDITIONS: {},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        DATA_LAST_APPLIED: {("area", "k", "g"): 0} if last_applied else {},
        DATA_SWITCHES: switches or {},
    }


async def test_idle_reapply_force_redispatches_unchanged_winner(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()  # arms the idle timer for the applied unit
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    assert len(calls) == 1 and calls[0]["brightness"] == 7
    eng._teardown()


async def test_idle_reapply_rearms_after_firing(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=120))
    await hass.async_block_till_done()
    assert len(calls) == 2  # re-armed by its own dispatch
    eng._teardown()


async def test_idle_reapply_disabled_does_not_fire(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": False, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=600))
    await hass.async_block_till_done()
    assert calls == []
    eng._teardown()


async def test_idle_reapply_skips_when_switch_off(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data(
        {"enabled": True, "interval_seconds": 60},
        switches={("area", "k"): SimpleNamespace(is_on=False)},
    )
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    assert calls == []
    eng._teardown()


async def test_idle_reapply_skips_when_scope_disabled(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    await hass.data[DOMAIN][DATA_STORE].async_set_scope_enabled("area", "k", False)
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    assert calls == []
    eng._teardown()


async def test_idle_reapply_config_disable_cancels_timer(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    # operator turns the feature off; engine handler cancels armed timers
    eng._store()._reapply = {"enabled": False, "interval_seconds": 60}
    eng.note_reapply_config_changed(None)
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    assert calls == []
    eng._teardown()


async def test_idle_reapply_enable_via_config_arms_timer(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": False, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()  # disabled at start → arms nothing
    eng._store()._reapply = {"enabled": True, "interval_seconds": 60}
    eng.note_reapply_config_changed(None)  # enable → arms the already-applied unit
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    assert len(calls) == 1
    eng._teardown()


async def test_idle_reapply_due_callback_noop_after_teardown(hass):
    # Covers the `if self._running` guard in the one-shot callback: a timer whose
    # callback was already queued when teardown ran must not start an apply.
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    due = eng._make_reapply_due(("area", "k", "g"))
    eng._teardown()  # sets _running False
    due(None)  # must not raise and must not create a task
    await hass.async_block_till_done()


async def test_idle_reapply_emits_reapply_trace(hass):
    captured = []

    class CaptureSink:
        def emit(self, event):
            captured.append(event)

    hass.services.async_register("light", "turn_on", lambda call: None)
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    hass.data[DOMAIN][DATA_TRACE_SINKS] = [CaptureSink()]
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        eng = AutoTriggerEngine(hass)
        eng.async_rebuild()
        eng.async_subscribe()
        async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
        await hass.async_block_till_done()
        assert any(e.cause.kind == "reapply" for e in captured)
        eng._teardown()
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)
```
(Ensure `SimpleNamespace`, `DATA_TRACE_SINKS`, `timedelta`, `logging`, `dt_util` are imported in the test module — the deleted reapply tests already imported them, so they should still be present.)

- [ ] **Step 3: Run to verify they fail**

Run: `pytest tests/test_trigger_engine.py -k idle_reapply -v`
Expected: FAIL (`note_reapply_config_changed` / timer behavior missing; no calls dispatched).

- [ ] **Step 4: Add the timer dict to the engine**

In `custom_components/ambience/trigger_engine.py`, in `__init__` where `self._reapply_intervals` used to be (line ~101, now removed in Phase 1), add:
```python
        # Per-unit idle-reapply one-shot timers, keyed by (scope_kind, scope_id,
        # category_id). The cancel callable from async_call_later is stored
        # directly (same convention as _for_handles / _sun_unsubs).
        self._reapply_timers: dict[tuple[str, str | None, str], Callable[[], None]] = {}
```
(`Callable` is already imported in this module.)

- [ ] **Step 5: Add the timer methods to the subscriptions mixin**

In `custom_components/ambience/trigger_subscriptions.py`:

Add to the `.service` import group:
```python
    get_last_applied,
```
(Re-added — it was dropped in Phase 1. Verify it isn't already imported.)

In `_teardown` (after `self._switch_scopes.clear()`, line ~83), cancel reapply timers:
```python
        self._cancel_all_reapply_timers()
```

At the end of `async_subscribe` (after the switch-subscription block, line ~154), re-establish timers for already-applied units:
```python
        self._rearm_all_reapply_timers()
```

Add the methods (anywhere in the mixin, e.g. after `_make_keys_handler`):
```python
    def _reapply_settings(self) -> tuple[bool, int]:
        s = self._store().get_reapply_settings()
        return bool(s["enabled"]), int(s["interval_seconds"])

    @callback
    def note_unit_applied(self, unit: tuple[str, str | None, str]) -> None:
        """SIGNAL_UNIT_APPLIED handler: (re)arm this unit's idle clock."""
        self._arm_reapply_timer(unit)

    @callback
    def note_reapply_config_changed(self, _payload: Any = None) -> None:
        """SIGNAL_REAPPLY_CONFIG_UPDATED handler: re-establish timers under the
        new settings (cancel all, then arm for applied units if still enabled)."""
        self._cancel_all_reapply_timers()
        enabled, _interval = self._reapply_settings()
        if enabled:
            self._rearm_all_reapply_timers()

    @callback
    def _arm_reapply_timer(self, unit: tuple[str, str | None, str]) -> None:
        enabled, interval = self._reapply_settings()
        if not enabled or not self._running:
            return
        old = self._reapply_timers.pop(unit, None)
        if old is not None:
            old()
        self._reapply_timers[unit] = async_call_later(
            self._hass, interval, self._make_reapply_due(unit)
        )

    def _make_reapply_due(self, unit: tuple[str, str | None, str]) -> Callable[[Any], None]:
        @callback
        def _due(_now: Any) -> None:
            self._reapply_timers.pop(unit, None)  # one-shot: it has fired
            if self._running:
                self._hass.async_create_task(self._reapply_due(unit))

        return _due

    async def _reapply_due(self, unit: tuple[str, str | None, str]) -> None:
        """Re-assess + force-apply one idle unit. A successful dispatch re-emits
        SIGNAL_UNIT_APPLIED, which re-arms the timer; a skip (switch off / scope
        disabled / no match) dispatches nothing, so the timer stays dead until the
        next real apply re-arms it. The `_running`/enabled guards live in
        `_make_reapply_due` (before the task is created) and in cancellation, so
        this path has no extra branch to cover."""
        _enabled, interval = self._reapply_settings()
        await self._refresh_all_snapshots()
        trace = await self._resolve_and_apply(*unit, force=True)
        if trace is not None:
            emit_trace(
                self._hass,
                TraceEvent(
                    TriggerCause(kind=CauseKind.REAPPLY, detail=fmt_duration(interval)),
                    [trace],
                ),
            )

    def _cancel_all_reapply_timers(self) -> None:
        for cancel in self._reapply_timers.values():
            cancel()
        self._reapply_timers.clear()

    def _rearm_all_reapply_timers(self) -> None:
        for unit in self._all_units():
            if get_last_applied(self._hass, *unit) is not None:
                self._arm_reapply_timer(unit)
```
(`fmt_duration` is already imported at line ~30; `emit_trace`, `TraceEvent`, `TriggerCause`, `CauseKind`, `async_call_later`, `Any` are all already imported in this module. `_resolve_and_apply`, `_refresh_all_snapshots`, `_all_units`, `_store` live on the engine half of the same instance.)

- [ ] **Step 6: Run to verify they pass**

Run: `pytest tests/test_trigger_engine.py -k idle_reapply -v`
Expected: PASS (9 tests).

- [ ] **Step 7: Commit**

```bash
git add custom_components/ambience/trigger_engine.py custom_components/ambience/trigger_subscriptions.py tests/test_trigger_engine.py
git commit -m "feat(reapply): per-unit idle-reapply timers in the engine"
```

---

### Task 7: Wire the two signals into the engine at setup

**Files:**
- Modify: `custom_components/ambience/__init__.py`
- Test: `tests/test_init.py` (or the existing setup/integration test module)

- [ ] **Step 1: Write a failing integration test**

In `tests/test_init.py` (use the existing full-setup fixture that calls `async_setup_entry`; mirror an existing setup test):
```python
async def test_unit_applied_signal_arms_reapply_timer(hass, mock_config_entry):
    from custom_components.ambience.const import DATA_ENGINE, SIGNAL_UNIT_APPLIED
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    await _setup_entry(hass, mock_config_entry)  # the module's standard setup helper
    engine = hass.data[DOMAIN][DATA_ENGINE]
    engine.async_rebuild()
    # enable the feature and pretend a unit was applied
    await hass.data[DOMAIN][DATA_STORE].async_save_reapply_settings(
        {"enabled": True, "interval_seconds": 60}
    )
    unit = next(iter(engine._all_units()))
    async_dispatcher_send(hass, SIGNAL_UNIT_APPLIED, unit)
    await hass.async_block_till_done()
    assert unit in engine._reapply_timers
```

- [ ] **Step 2: Run to verify it fails**

Run: `pytest tests/test_init.py -k unit_applied -v`
Expected: FAIL (`unit not in engine._reapply_timers` — the signal isn't connected).

- [ ] **Step 3: Connect the signals**

In `custom_components/ambience/__init__.py`:
- add `SIGNAL_UNIT_APPLIED` and `SIGNAL_REAPPLY_CONFIG_UPDATED` to the `.const` import (near lines ~64-65)
- after the existing `SIGNAL_CONFIG_CHANGED` connect (line ~357), add:
```python
    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_UNIT_APPLIED, engine.note_unit_applied)
    )
    entry.async_on_unload(
        async_dispatcher_connect(
            hass, SIGNAL_REAPPLY_CONFIG_UPDATED, engine.note_reapply_config_changed
        )
    )
```

- [ ] **Step 4: Run to verify it passes**

Run: `pytest tests/test_init.py -k unit_applied -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/__init__.py tests/test_init.py
git commit -m "feat(reapply): connect unit-applied and config-updated signals to the engine"
```

---

### Task 8: Frontend settings UI

**Files:**
- Modify: `frontend/src/types.ts`, `frontend/src/api.ts`, `frontend/src/views/ambience-settings.ts`, `frontend/src/i18n-data.ts`
- Test: `test/ambience-settings.test.ts`

The interval is stored in **seconds**; the UI shows **minutes** (90 min, not 5400 s).

- [ ] **Step 1: Write failing frontend tests**

In `test/ambience-settings.test.ts` (extend the existing file; it already mounts `ambience-ambience-settings` and stubs `hass.callWS`):
```typescript
it("loads reapply settings and shows minutes", async () => {
  const calls: any[] = [];
  const hass = makeHass((msg: any) => {
    calls.push(msg);
    if (msg.type === "ambience/switch_defaults/list")
      return { name: "Ambience", auto_on_delay_seconds: 7200 };
    if (msg.type === "ambience/reapply/list")
      return { enabled: true, interval_seconds: 5400 };
    return { ok: true };
  });
  const el = await mount(hass);
  const minutes = el.shadowRoot!.querySelector<HTMLInputElement>(
    '[data-test="reapply-interval-minutes"]',
  )!;
  expect(minutes.value).toBe("90");
  const toggle = el.shadowRoot!.querySelector<HTMLInputElement>(
    '[data-test="reapply-enabled"]',
  )!;
  expect(toggle.checked).toBe(true);
});

it("saves reapply settings as seconds when minutes change", async () => {
  const saved: any[] = [];
  const hass = makeHass((msg: any) => {
    if (msg.type === "ambience/reapply/list")
      return { enabled: true, interval_seconds: 5400 };
    if (msg.type === "ambience/switch_defaults/list")
      return { name: "Ambience", auto_on_delay_seconds: 7200 };
    if (msg.type === "ambience/reapply/save") saved.push(msg);
    return { ok: true };
  });
  const el = await mount(hass);
  const minutes = el.shadowRoot!.querySelector<HTMLInputElement>(
    '[data-test="reapply-interval-minutes"]',
  )!;
  minutes.value = "120";
  minutes.dispatchEvent(new Event("change"));
  await el.updateComplete;
  expect(saved.at(-1)).toMatchObject({ enabled: true, interval_seconds: 7200 });
});
```
(Reuse whatever `makeHass`/`mount` helpers the existing test file defines; if the file builds `hass` inline, follow that shape.)

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run test/ambience-settings.test.ts`
Expected: FAIL (no `reapply-interval-minutes` element; `ambience/reapply/list` unhandled).

- [ ] **Step 3: Add the type and API helpers**

In `frontend/src/types.ts`, after `SwitchDefaults` (line ~93):
```typescript
export type ReapplySettings = {
  enabled: boolean;
  interval_seconds: number;
};
```

In `frontend/src/api.ts`, after `saveSwitchDefaults` (line ~345):
```typescript
export async function getReapplySettings(hass: HassConnection): Promise<ReapplySettings> {
  return hass.callWS({ type: "ambience/reapply/list" });
}

export async function saveReapplySettings(
  hass: HassConnection,
  enabled: boolean,
  interval_seconds: number,
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/reapply/save",
    enabled,
    interval_seconds,
  });
}
```
Add `ReapplySettings` to the `../types.js` import in `api.ts` (near the `SwitchDefaults` import).

- [ ] **Step 4: Add the i18n strings**

In `frontend/src/i18n-data.ts`, after `settings_ambience_delay_help` (line ~65):
```typescript
    settings_reapply_card: "Re-apply",
    settings_reapply_enable_label: "Re-apply scenes after inactivity",
    settings_reapply_interval_label: "Inactivity timeout (minutes)",
    settings_reapply_help:
      "Re-send each area's scene commands after this much quiet, to recover dropped commands.",
```

- [ ] **Step 5: Render and save the reapply card**

In `frontend/src/views/ambience-settings.ts`:
- import the helpers + type:
```typescript
import {
  getReapplySettings,
  getSwitchDefaults,
  type HassConnection,
  saveReapplySettings,
  saveSwitchDefaults,
} from "../api.js";
import type { ReapplySettings, SwitchDefaults } from "../types.js";
```
- add state (after `_defaults`, line ~53):
```typescript
  @state() private _reapply: ReapplySettings = {
    enabled: false,
    interval_seconds: 5400,
  };
```
- load it in `connectedCallback` (inside the existing try, after `this._defaults = ...`):
```typescript
      this._reapply = await getReapplySettings(this.hass);
```
- add change handlers (after `_onDefaultDelay`, line ~103):
```typescript
  private _saveReapply() {
    void this._safeSave(() =>
      saveReapplySettings(this.hass, this._reapply.enabled, this._reapply.interval_seconds),
    );
  }

  private _onReapplyEnabled(e: Event) {
    this._reapply = { ...this._reapply, enabled: (e.target as HTMLInputElement).checked };
    this._saveReapply();
  }

  private _onReapplyMinutes(e: Event) {
    const input = e.target as HTMLInputElement;
    const minutes = Math.floor(Number(input.value));
    if (input.value === "" || !Number.isFinite(minutes) || minutes < 1) {
      input.value = String(Math.round(this._reapply.interval_seconds / 60));
      return;
    }
    this._reapply = { ...this._reapply, interval_seconds: minutes * 60 };
    this._saveReapply();
  }
```
- render a second card in `render()` (after the Defaults card's closing `</div>`, before the template's closing backtick, line ~143):
```typescript
      <div class="card">
        <h3>${localize(this.hass, "ui.settings_reapply_card", "Re-apply")}</h3>
        <div class="row">
          <label>
            <input
              data-test="reapply-enabled"
              type="checkbox"
              .checked=${this._reapply.enabled}
              @change=${(e: Event) => this._onReapplyEnabled(e)}
            />
            ${localize(
              this.hass,
              "ui.settings_reapply_enable_label",
              "Re-apply scenes after inactivity",
            )}
          </label>
        </div>
        <div class="row">
          <label
            >${localize(
              this.hass,
              "ui.settings_reapply_interval_label",
              "Inactivity timeout (minutes)",
            )}</label
          >
          <input
            data-test="reapply-interval-minutes"
            type="number"
            min="1"
            .value=${String(Math.round(this._reapply.interval_seconds / 60))}
            @change=${(e: Event) => this._onReapplyMinutes(e)}
          />
          <div class="help">
            ${localize(
              this.hass,
              "ui.settings_reapply_help",
              "Re-send each area's scene commands after this much quiet, to recover dropped commands.",
            )}
          </div>
        </div>
      </div>
```

- [ ] **Step 6: Run to verify they pass**

Run: `npx vitest run test/ambience-settings.test.ts`
Expected: PASS.

- [ ] **Step 7: Lint, type-check, build, commit**

```bash
npm run ci && npm run check && npm run build
git add frontend/src/types.ts frontend/src/api.ts frontend/src/views/ambience-settings.ts frontend/src/i18n-data.ts test/ambience-settings.test.ts custom_components/ambience/frontend
git commit -m "feat(reapply): settings UI for idle re-apply (toggle + minutes)"
```
(`npm run build` writes the bundled card into `custom_components/ambience/frontend` — stage the rebuilt assets too, per the project's rebuild-after-frontend-changes rule.)

---

### Task 9: Full-suite verification + docs

**Files:**
- Modify: `docs/` (settings reference / concepts, if they describe reapply)

- [ ] **Step 1: Update docs**

Search docs for the old reapply mechanism and the settings surface:
```bash
grep -rn "reapply\|re-apply\|Re-apply" docs
```
- Remove descriptions of the deleted per-action `reapply_seconds`.
- In `docs/settings-reference.md` (or the settings concept doc), document the new global **Re-apply** card: a toggle ("Re-apply scenes after inactivity") and an inactivity-timeout in minutes; explain it re-sends each unit's scene commands after that much quiet to recover dropped commands; default off; resets whenever a unit's commands are dispatched.

- [ ] **Step 2: Run the complete gate**

```bash
ruff check . && ruff format .
pytest --cov=custom_components.ambience --cov-branch --cov-report=term-missing --cov-fail-under=99
npm run ci && npm run check && npm test && npm run build
```
Expected: all green; coverage ≥99% with no missing lines in the new code.

- [ ] **Step 3: Commit docs**

```bash
git add docs
git commit -m "docs(reapply): document the idle re-apply setting; drop per-action reapply"
```

---

## Notes / deliberate simplifications

- The idle-reapply logbook entry reads **"applied"** (same as a normal apply); the `reapply` cause is visible in the Ambience trace/diagnostics, not the HA logbook. (The old `reapplied`/"re-applied" path was removed in Phase 1.) A distinct logbook verb is a possible follow-up.
- A config reload (`async_subscribe` → `_rearm_all_reapply_timers`) resets every applied unit's idle clock. Config saves are infrequent and the reload itself re-applies edited units, so this is benign.
- The interval floor is `MIN_REAPPLY_INTERVAL_SECONDS = 60`; raise it later if 1-minute reconciles prove undesirable.
- Per-scope/per-category timeouts and cross-restart clock persistence are explicitly out of scope (see spec).
