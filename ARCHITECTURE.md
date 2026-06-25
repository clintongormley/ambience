# Ambience — Architecture

Developer reference for contributors. For installation and usage, see the [user documentation](https://clintongormley.github.io/ambience). For dev environment setup, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Overview

Ambience is a condition-based scene engine for Home Assistant. For each *(scope, category)* pair it maintains an ordered list of scenes; whenever a scope is (re-)evaluated it walks the list, evaluates each scene's conditions against live snapshots, and applies the first matching scene's actions. Scopes are hierarchical (House → Floor → Area) and each carries an independent on/off switch that gates automatic scene application.

---

## Resolution model

The core logic lives in `custom_components/ambience/engine.py` and is intentionally free of HA imports.

**Data shape.** A *scene* is a plain `dict`. It carries an optional `name`, a `when` mapping of `{condition_key: predicate}`, and a set of actions to apply on a match. Scenes belong to a *(scope, category)* slot and are stored as an ordered list.

**Matching algorithm** (`resolve` / `evaluate_explained`):

1. Walk the scene list in order.
2. **Disabled scenes** (`enabled: False`) are skipped entirely — they cannot win and do not interrupt evaluation of later scenes.
3. For each enabled scene, iterate its `when` predicates:
   - A predicate value of `None` (or an absent key) is a **wildcard** and always passes.
   - If the condition key is unknown, or its snapshot is `None`, the predicate **fails** (treated as unavailable).
   - Evaluation **short-circuits** on the first failing predicate.
4. A scene **matches** when every predicate passes. The first match is the winner; scenes after the winner are not evaluated.
5. If no scene matches, `resolve()` returns `None` and no actions are applied.

**Shadowing.** A scene that can never win — because an earlier, always-matching scene precedes it — is said to be *shadowed*. The `evaluate_explained` path (used by the dry-run WebSocket command) records the full evaluation trace, including which scenes were not evaluated, so the frontend can surface shadowing warnings.

**`evaluate_explained` vs `resolve`.** `resolve` is a thin wrapper over `evaluate_explained` so the two share a single source of truth. `evaluate_explained` accepts a `describe` flag; when `True`, each successfully evaluated predicate's `detail` is populated from `condition.describe(snapshot)` (used for trace output only — callers pass `True` only in that path).

---

## Scopes & switches

Implemented in `custom_components/ambience/switch.py`.

**Scope hierarchy.** There are three scope levels:

| Level | Description | Example entity |
|---|---|---|
| House | One per installation | `switch.house_ambience` |
| Floor | One per HA floor | `switch.ground_floor_floor_ambience` |
| Area | One per HA area | `switch.living_room_ambience` |

Floors use a `_floor_ambience` suffix to avoid entity-ID collisions when a floor and an area share the same name.

**What the switch does.** Each switch independently gates *automatic* scene application for its own scope only. While a scope's switch is off, the engine stops applying scenes there (an explicit apply from the panel forces past the switch); same for floor and house. Each scope is checked independently — there is no inherited-off propagation during resolution.

**Cascade on turn-on/turn-off.** Turning a switch *off* (or *on*) via the UI or a service call does cascade to descendants: turning the house switch off also turns off all floor and area switches; turning it back on restores them. Turning a floor switch off brings down its areas. This cascade is one-directional — it fires only on explicit user action, not during scene resolution.

**Auto-on timer.** When a switch is turned off it schedules an automatic turn-on after a configurable delay (default: 7 200 seconds / 2 hours). A delay of 0 disables the timer. The off-timestamp is persisted so the remaining delay survives HA restarts. The timer fires `async_turn_on`, which also cascades to descendants.

**Configuration.** Global defaults (`name`, `auto_on_delay_seconds`) are set in **Settings → Ambience** and apply to all scopes. The per-scope save commands `ambience/house/switch/save`, `ambience/floor/switch/save`, and `ambience/area/switch/save` exist in the WebSocket API and accept per-scope `name`/`auto_on_delay_seconds` values, but the switch currently resolves both from the global defaults only (`_resolved_delay` and the name composition read `get_switch_defaults()`), so per-scope overrides are not consulted at runtime.

All scope switches are grouped under a single virtual *Ambience* service device so the integration card links to one device page rather than a flat entity list.

---

## Frontend bundle / build pipeline

The Ambience panel is a **Lit + TypeScript** single-page application.

- Source: `frontend/src/`
- Output: the compiled bundles in `custom_components/ambience/frontend/` — `ambience-frontend.js`, `ambience-panel.js`, and `ambience-card.js`
- The compiled bundles are **checked into the repository**, so HACS installations require no build step.

To rebuild after frontend changes:

```sh
npm install   # once per worktree
npm run build
```

A **`build-check`** script (run in CI) performs a fresh build and diffs it against the committed bundle. The CI gate fails if they diverge — keep the committed bundle in sync with every frontend change.

The bundler is configured in `esbuild.config.mjs`. TypeScript settings live in `tsconfig.json`.

---

## WebSocket API

All commands require admin privileges. The frontend communicates exclusively
over this API; there are no REST endpoints.

The authoritative command list lives in `custom_components/ambience/websocket.py`
(`_WS_HANDLERS` at the bottom of the file — registration and unregistration both
derive from it, and each handler's `@websocket_command` schema documents its
payload). The ~40 commands fall into these families:

| Family | Commands (representative) | Purpose |
|---|---|---|
| Registry lists | `ambience/areas/list`, `ambience/floors/list` | HA areas/floors for the scope pickers |
| Scope config | `ambience/area/get`, `ambience/area/save` (+ `floor/*`, `house/*`), `ambience/validate` | Load/validate/save a scope's scenes (save canonicalises order and returns shadow hints) |
| Resolution | `ambience/dry_run`, `ambience/apply`, `ambience/scene/run_actions` | Preview / force-apply / run one scene's actions |
| Conditions | `ambience/conditions/list`, `ambience/conditions/day/config/*`, `ambience/conditions/weather/config/*`, `ambience/time_of_day_periods/*`, `ambience/lux_ranges/*` | Condition metadata and the global condition settings |
| Actions | `ambience/services/list`, `ambience/services/get_schema`, `ambience/exposed_actions/*` | The exposed-actions catalogue behind the scene editor |
| State helpers | `ambience/state/known_states`, `ambience/state/known_attribute_values` | Plausible-value suggestions for the state condition editor |
| Categories | `ambience/categories/list|save|delete` | Scene-category CRUD (guarded: can't drop the last or an in-use category) |
| Switches | `ambience/switches/list`, `ambience/switch_defaults/*`, `ambience/set_scope_enabled` | Scope switch entity ids, global defaults, permanent enable/disable |
| Observability | `ambience/traces/list|clear`, `ambience/auto_triggers/list`, `ambience/diagnostics/scope`, `ambience/simulate`, `ambience/simulate/inputs` | Trace buffer, derived watch-list, focused diagnostics, what-if simulator |

---

## Further reading

- [CONTRIBUTING.md](CONTRIBUTING.md) — dev environment setup, running tests, worktree workflow.
- [User documentation](https://clintongormley.github.io/ambience) — concepts, configuration reference, tips & testing (published from `docs/` to GitHub Pages).
