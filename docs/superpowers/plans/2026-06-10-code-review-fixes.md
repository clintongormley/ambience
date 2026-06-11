# Code Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all findings from the 2026-06-10 full-codebase review: 6 high-severity bugs, ~14 medium/low bugs, security hardening (diagnostics PII, CI permissions), dead-code removal, reuse refactors, and docs corrections.

**Architecture:** Fixes are grouped into 7 batches by subsystem so file overlap stays within a batch and batches land as independent commits. Every behavior change is TDD'd (failing test first); docs/CI/dead-code changes are verified by the relevant suite or build. Branch: `fix/code-review-findings`.

**Tech Stack:** Python (pytest + pytest-homeassistant-custom-component, ruff, 99% coverage gate), TypeScript/Lit (vitest + jsdom, biome), mkdocs, GitHub Actions.

---

## Batch 1 — Conditions backend (Python)

**Files:** `custom_components/ambience/conditions/{time_of_day,day,weather,state,script,sun,lux,_common}.py`, `periods.py`, `state_options.py`, `tests/test_conditions_*.py`, `tests/test_periods.py`, `tests/test_state_options.py`

### Task 1.1: time_of_day mixed sun/time range normalisation (HIGH)
- [ ] Failing test: `{from: sunset, to: 23:00}` evaluated at 00:30/03:00/05:30 local → no match; still matches 18:00–23:00; regression: dusk→08:30 wrap still matches overnight.
- [ ] Fix in `_match_one`: after resolving both endpoints, normalise `end` into `(start, start + 24h]` by adding/subtracting whole days.
- [ ] Verify, commit.

### Task 1.2: time_of_day dangling period tolerated per-scene (HIGH)
- [ ] Failing tests: `matches()` with a predicate referencing a deleted period → `False` (not raise); `order_key`/`contains` tolerate unknown period (return ""/False). Update the pinned `test_matches_missing_period_raises_loudly`.
- [ ] Fix: mirror lux.py:99-104 — catch ValueError per scene in `matches`/`order_key`/`_intervals`/`contains`.
- [ ] Verify, commit.

### Task 1.3: reject bool hh/mm in endpoint resolution/validation
- [ ] Failing tests: `hh: true` rejected by `time_of_day` validation and `periods._validate_endpoint`.
- [ ] Fix: add bool rejection (reuse `_valid_clock` logic) in `_resolve_endpoint` and `periods._validate_endpoint`.

### Task 1.4: `validate_for` rejects unknown keys
- [ ] Failing test: `for: {"hours": 1}` → ValueError.
- [ ] Fix in `_common.validate_for`: reject keys outside `{"h","m","s"}`.

### Task 1.5: reject equal-endpoint ranges (time_of_day + sun azimuth)
- [ ] Failing tests: time_of_day range `10:00→10:00` rejected at validation; sun azimuth `from == to` rejected.
- [ ] Fix both validators.

### Task 1.6: state snapshot honours `entities` narrowing
- [ ] Failing test: snapshot with `entities={"light.a"}` only reads those entities (assert via states machine containing others that don't appear).
- [ ] Fix: when `entities is not None`, use `hass.states.get` per entity (occupancy pattern); keep full scan for `None` (simulator).

### Task 1.7: NaN/inf guard in `_common.as_float`
- [ ] Failing test: NaN elevation does not match a min-only constraint.
- [ ] Fix: `math.isfinite` check in `_common.as_float` (shared by sun; keep lux behavior intact).

### Task 1.8: `is_constraining` for day + weather
- [ ] Failing tests: `{include:[],exclude:[]}` day and `{groups:[],thresholds:[]}` weather report non-constraining; sorting treats them as wildcards.
- [ ] Fix: implement `is_constraining` on both; ensure `sorting._constrained` applies it.

### Task 1.9: script result cache eviction
- [ ] Failing test: cache keys not in current pairs are dropped after `snapshot()`.
- [ ] Fix: prune `self._cache` to current pairs each snapshot.

### Task 1.10: don't offer zone.home friendly name as person state option
- [ ] Failing test: `known_states_for(person)` with zone.home named "Home" doesn't include "Home" duplicate (state `home` already covers it).
- [ ] Fix: skip `zone.home` in the zone loop.

### Task 1.11: document `for` = tenure of exact state
- [ ] Update docstrings/predicate_help in people.py and state.py; mirror in docs/conditions/people.md + entity-state.md.

## Batch 2 — Trigger engine / switch / service / init (Python)

**Files:** `trigger_engine.py`, `trigger_subscriptions.py`, `switch.py`, `service.py`, `__init__.py`, `const.py`, `store.py`, tests.

### Task 2.1: sun trigger negative-offset spin (HIGH)
- [ ] Failing test: `_schedule_sun` with computed fire time in the past arms at the un-offset anchor (+epsilon), not the past time.
- [ ] Fix in `_schedule_sun` per finding.

### Task 2.2: `for:` rechecks clock off `last_changed`
- [ ] Failing test: attribute-only update (last_updated newer than last_changed) arms recheck from `last_changed`.
- [ ] Fix `_for_recheck_delay`.

### Task 2.3: `_sync` applies dirty units from its seeding recompute
- [ ] Failing test: flip consumed by `_sync`'s global recompute still applies the affected unit.
- [ ] Fix: union returned dirty units into applied units.

### Task 2.4: delay→0 cancels armed auto-on timer
- [ ] Failing test: armed timer + save delay 0 → timer cancelled, no auto-on.
- [ ] Fix `_schedule_auto_on_from_store` to cancel before early returns.

### Task 2.5: `async_unload_entry` honours platform unload result
- [ ] Failing test: platform unload False → teardown skipped, returns False.
- [ ] Fix per standard HA pattern.

### Task 2.6: no re-arm/fire after teardown
- [ ] Failing test: sun handler queued at teardown doesn't insert new timers; `_fire` no-ops after teardown.
- [ ] Fix: `self._running` flag checked in `_schedule_sun` handler, `_make_for_recheck`, `_fire`.

### Task 2.7: `_recompute` contains `matches()` exceptions
- [ ] Failing test: one raising predicate doesn't kill evaluation of others; warning logged; predicate treated False.
- [ ] Fix: try/except around `condition.matches`.

### Task 2.8: shared snapshot helper
- [ ] Extract `snapshot_conditions(...)` (parallel gather, exception→None) used by engine `_refresh_snapshots` and service `_snapshot_all`; extract shared gather-log-failures helper. Tests keep passing; add test for parallel+exception policy.

### Task 2.9: deterministic category ordering
- [ ] Failing test: `category_ids` preserves scene order de-duplicated.
- [ ] Fix: `dict.fromkeys` ordering; docstrings now true.

### Task 2.10: batch cascade `off_at` writes
- [ ] Use `async_delay_save` for off_at writes (runtime state). Test: cascade triggers ≤1 immediate save.

### Task 2.11: manual apply shares engine apply locks
- [ ] Move per-unit locks into a shared registry in `hass.data`; service `_apply_category` takes the lock. Test: concurrent engine+manual apply serialised.

### Task 2.12: rename shadowed `entry` local in `_handle_apply_scene`
### Task 2.13: fix stale const.py comments (DATA_LAST_APPLIED shape, SIGNAL_CONFIG_CHANGED payload)

## Batch 3 — WebSocket / API (Python)

**Files:** `websocket.py`, `websocket_helpers.py`, `diagnostics.py`, `trace.py`, `simulate.py`, `service.py` (dry_run plumbing), `manifest.json`, tests.

### Task 3.1: categories/save guards (empty list, in-use removal)
### Task 3.2: validate_scope_config type guards (scenes list-of-dicts, when dict, actions list-of-dicts → ValueError with index)
### Task 3.3: diagnostics PII scrub — redacting mode for trace dump (cause entity/old/new for person/device_tracker; blank predicate detail) used only by diagnostics
### Task 3.4: derive `_WS_COMMANDS` from a single registration table (fixes missing `state/known_attribute_values`)
### Task 3.5: diagnostics/scope catches ValueError → validation_error
### Task 3.6: set_scope_enabled validates area/floor ids against registries
### Task 3.7: simulate schema tightened (`{cv.entity_id: {state: str, attributes: dict, for: dict}}`), naive `now` rejected
### Task 3.8: dry_run snapshots once (share snapshots dict between resolve calls)
### Task 3.9: dedupe scope save/get handlers (`_save_scope` helper), shared warning-walk helper, drop redundant `validate_shape` call
### Task 3.10: manifest.json adds `frontend` dependency (keys stay sorted)

Each task: failing websocket test first (tests/test_websocket*.py), fix, verify, commit per task or small group.

## Batch 4 — Frontend core (TypeScript)

**Files:** `frontend/src/*.ts`, `esbuild.config.mjs`, `vitest.config.ts`, `test/*.test.ts`, `test/stubs/`.

### Task 4.1: `watchHaComponents` WeakRef hosts; drop dead `_hass` param
### Task 4.2: delete `validateConfig`/`dryRun`/`DryRunResult` + their tests
### Task 4.3: delete custom-card-helpers shim (d.ts, esbuild external, vitest alias, stub)
### Task 4.4: delete i18n.ts duplicated fallback tables (use bundle + humanizeId fallback)
### Task 4.5: `saveCategories`/`deleteCategory` typed `Promise<void>`
### Task 4.6: trace-detail — null-safe formatCause; thread custom period map into periodLabel; single trace Action type in types.ts
### Task 4.7: card.ts `_ensure` try/catch with error placeholder
### Task 4.8: entities-for-scope structural `RegistryHass` type (drop `as any`)
### Task 4.9: summary.ts uses `stateOpLabel`; delete `_OP_LABEL` + `humanizeFieldId`; `periodLabel` fallback via `humanizeId`

Vitest red→green per task; biome + tsc clean.

## Batch 5 — Frontend views A–O

### Task 5.1: actions-settings — overlay exemption in `_cancelEditingDefaultOnClickAway` (HIGH)
### Task 5.2: day-predicate-input — `?selected` on kind options; clamp typed month
### Task 5.3: named-def-config + day-config — error states for list/save/delete; modal closes only on successful save
### Task 5.4: action-slot — dedupe in-flight schema fetches
### Task 5.5: ambience-settings — rejected name/delay edits reset the input
### Task 5.6: auto-triggers-modal — reset triggers on open/scope change (stale flash)
### Task 5.7: condition-input — shared stopPropagation/re-emit handler across all branches
### Task 5.8: actions-settings warnings use `scopeLabel`
### Task 5.9: service picker — feedback when picking an already-exposed service
### Task 5.10: remove unused exports (StateObj duplicate, DefWarning, ModalState, labelToId)
### Task 5.11: add missing 17 `ui.*` keys to i18n-data.ts; localize hardcoded strings in action-slot/actions-settings/auto-triggers-modal (incl. shared `ui.close`)

## Batch 6 — Frontend views P–Z

### Task 6.1: script-predicate-input — `e.stopPropagation()` in YAML `onInput` (HIGH)
### Task 6.2: scene-editor — `dayPredicateError` + `luxPredicateError` structural validators in `_validationError`; reset `_conditionError` on open (HIGH + medium)
### Task 6.3: time-of-day-input — `_emit` assigns `this.value` before dispatch
### Task 6.4: state-expr-atom — `_entitySeq`-style guard in `updated()`
### Task 6.5: simulator-modal — localize all strings; build timestamp inside try with validation
### Task 6.6: traces-modal — localize; add Clear button wired to `ambience/traces/clear` (fixes the dead command by giving it a caller); poll only while open
### Task 6.7: state-predicate-input — clear/recompute `_openPath` on remove/unwrap
### Task 6.8: scenes-list — reconcile `_expanded` when `scenes` changes
### Task 6.9: shared modal base (Escape/backdrop/✕) for settings/traces/simulator
### Task 6.10: shared `<ambience-for-duration>` element replacing 3 copies
### Task 6.11: weather-config (+ day-config) guarded `<ha-form>` with fallback/watch
### Task 6.12: localize script/template predicate messages, settings-modal close, state-expr "State" sentinel display
### Task 6.13: scopes-view — extract scope-config data layer into a controller/module (no behavior change)

## Batch 7 — Docs + CI/tooling

### Task 7.1: docs/conditions/lux.md (new) + index table row + mkdocs nav + settings-reference.md Conditions-tab fix
### Task 7.2: ARCHITECTURE.md — correct apply_scene fields (scope/category/scene/force, scene-requires-category, force semantics); replace stale WS table with pointer + representative examples
### Task 7.3: mkdocs nav — add Occupancy page
### Task 7.4: installation.md — fix 2 malformed admonitions
### Task 7.5: document `ambience.apply_scene` for users (actions.md section)
### Task 7.6: `bin/check_ui_strings.py` — parity check of `ui.*` localize keys vs i18n-data.ts; wire into Makefile + tests.yml quality job + pre-push
### Task 7.7: bump-version.sh also bumps pyproject.toml; set pyproject to 0.12.0
### Task 7.8: remove stale .gitignore entries for tracked docs dirs
### Task 7.9: pre-push — accumulate changed files across all pushed refs; fallback `HEAD~1..HEAD`
### Task 7.10: release.sh — abort on ls-remote failure, anchored match, reuse `bump-version.sh --validate`
### Task 7.11: workflows — `permissions: contents: read` on hassfest/tests; checkout@v6 in release.yml; setup-node 24; drop HA install from translation-parity step (verify job structure first); branch-filter push triggers on hassfest/validate

## Final verification
- [ ] `ruff check . && ruff format .` clean
- [ ] `python -m pytest tests/ -q` green incl. 99% coverage gate
- [ ] `npm run ci` (biome) + `npx tsc --noEmit` + `npx vitest run` green incl. coverage
- [ ] `npm run build` and commit refreshed bundles
- [ ] `python -m bin.check_translations` + new ui-strings check green
- [ ] mkdocs build clean (if available locally)
