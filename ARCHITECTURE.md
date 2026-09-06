# Ambience — Architecture

Developer reference for contributors. For installation and usage, see the
[user documentation](https://clintongormley.github.io/ambience). For dev
environment setup, see [CONTRIBUTING.md](CONTRIBUTING.md).

______________________________________________________________________

## Overview

Ambience is a condition-based scene engine for Home Assistant. For each *(scope,
category)* pair it maintains an ordered list of scenes; whenever a scope is
(re-)evaluated it walks the list, evaluates each scene's conditions against live
snapshots, and applies the first matching scene's actions. Scopes are
hierarchical (House → Floor → Area) and each carries an independent on/off
switch that gates automatic scene application.

______________________________________________________________________

## Resolution model

The core logic lives in `custom_components/ambience/engine.py` and is
intentionally free of HA imports.

**Data shape.** A *scene* is a plain `dict`. It carries an optional `name`, a
`when` mapping of `{condition_key: predicate}`, and a set of actions to apply on
a match. Scenes belong to a *(scope, category)* slot and are stored as an
ordered list.

**Matching algorithm** (`resolve` / `evaluate_explained`):

1. Walk the scene list in order.
1. **Disabled scenes** (`enabled: False`) are skipped entirely — they cannot win
    and do not interrupt evaluation of later scenes.
1. For each enabled scene, iterate its `when` predicates:
    - A predicate value of `None` (or an absent key) is a **wildcard** and always
        passes.
    - If the condition key is unknown, or its snapshot is `None`, the predicate
        **fails** (treated as unavailable).
    - Evaluation **short-circuits** on the first failing predicate.
1. A scene **matches** when every predicate passes. The first match is the
    winner; scenes after the winner are not evaluated.
1. If no scene matches, `resolve()` returns `None` and no actions are applied.

**Shadowing.** A scene that can never win — because an earlier, always-matching
scene precedes it — is said to be *shadowed*. The `evaluate_explained` path
(used by the dry-run WebSocket command) records the full evaluation trace,
including which scenes were not evaluated, so the frontend can surface shadowing
warnings.

**`evaluate_explained` vs `resolve`.** `resolve` is a thin wrapper over
`evaluate_explained` so the two share a single source of truth.
`evaluate_explained` accepts a `describe` flag; when `True`, each successfully
evaluated predicate's `detail` is populated from
`condition.describe(snapshot, predicate)` — the predicate is passed so an
entity-quantifier condition can scope the detail to the entities that predicate
references (used for trace output only — callers pass `True` only in that path).

______________________________________________________________________

## Scopes & switches

Implemented in `custom_components/ambience/switch.py`.

**Scope hierarchy.** There are three scope levels:

| Level | Description          | Example entity                       |
| ----- | -------------------- | ------------------------------------ |
| House | One per installation | `switch.house_ambience`              |
| Floor | One per HA floor     | `switch.ground_floor_floor_ambience` |
| Area  | One per HA area      | `switch.living_room_ambience`        |

Floors use a `_floor_ambience` suffix to avoid entity-ID collisions when a floor
and an area share the same name.

**What the switch does.** Each switch independently gates *automatic* scene
application for its own scope only. While a scope's switch is off, the engine
stops applying scenes there (an explicit apply from the panel forces past the
switch); same for floor and house. Each scope is checked independently — there
is no inherited-off propagation during resolution. Disabling the switch entity
in Settings → Entities also pauses the scope: a registered-but-disabled switch
reads as off.

**Cascade on turn-on/turn-off.** Turning a switch *off* (or *on*) via the UI or
a service call does cascade to descendants: turning the house switch off also
turns off all floor and area switches; turning it back on restores them. Turning
a floor switch off brings down its areas. This cascade is one-directional
(parent → descendants) and fires on any switch turn-on/turn-off — whether an
explicit user action or the auto-on timer firing — never during scene
resolution. A descendant paused *after* its parent keeps its own auto-on resume
time when the parent is turned back on.

**Auto-on timer.** When a switch is turned off it can schedule an automatic
turn-on after a configurable delay. The default delay is **0, which disables the
timer** — a paused scope stays paused until you turn it back on; set a positive
delay to have it auto-resume. The off-timestamp is persisted so the remaining
delay survives HA restarts. When armed, the timer fires `async_turn_on`, which
also cascades to descendants.

**Configuration.** The switch defaults (`name`, `auto_on_delay_seconds`) are
**global**: set once in **Settings → Ambience** (saved via the
`ambience/switch_defaults/save` WebSocket command) and applied to every scope.
There are no per-scope switch overrides — every scope resolves its delay and
name from the global defaults (`_resolved_delay` and the name composition both
read `get_switch_defaults()`). The per-scope `off_at` timestamp that persists a
paused switch's remaining auto-on delay is runtime state, not a configurable
override.

All scope switches are grouped under a single virtual *Ambience* service device
so the integration card links to one device page rather than a flat entity list.

______________________________________________________________________

## Frontend bundle / build pipeline

The Ambience panel is a **Lit + TypeScript** single-page application.

- Source: `frontend/src/`
- Output: the compiled bundles in `custom_components/ambience/frontend/` —
    `ambience-frontend.js`, `ambience-panel.js`, and `ambience-card.js`
- The compiled bundles are **checked into the repository**, so HACS
    installations require no build step.

To rebuild after frontend changes:

```sh
npm install   # once per worktree
npm run build
```

A **`build-check`** script (run in CI) performs a fresh build and diffs it
against the committed bundle. The CI gate fails if they diverge — keep the
committed bundle in sync with every frontend change.

The bundler is configured in `esbuild.config.mjs`. TypeScript settings live in
`tsconfig.json`.

______________________________________________________________________

## WebSocket API

All commands require admin privileges. The frontend communicates exclusively
over this API; there are no REST endpoints.

The authoritative command list lives in the
`custom_components/ambience/websocket/` package (`_WS_HANDLERS` at the bottom of
`__init__.py` — registration and unregistration both derive from it, and each
handler's `@websocket_command` schema documents its payload; the handlers
themselves live in per-family submodules). The 58 commands fall into these
families:

| Family         | Commands (representative)                                                                                                                                         | Purpose                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Registry lists | `ambience/areas/list`, `ambience/floors/list`                                                                                                                     | HA areas/floors for the scope pickers                                                   |
| Scope config   | `ambience/area/get`, `ambience/area/save` (+ `floor/*`, `house/*`), `ambience/validate`                                                                           | Load/validate/save a scope's scenes (save canonicalises order and returns shadow hints) |
| Resolution     | `ambience/dry_run`, `ambience/apply`, `ambience/scene/run_actions`                                                                                                | Preview / force-apply / run one scene's actions                                         |
| Conditions     | `ambience/conditions/list`, `ambience/conditions/day/config/*`, `ambience/conditions/weather/config/*`, `ambience/time_of_day_periods/*`, `ambience/lux_ranges/*` | Condition metadata and the global condition settings                                    |
| Actions        | `ambience/services/list`, `ambience/services/get_schema`, `ambience/exposed_actions/*`                                                                            | The exposed-actions catalogue behind the scene editor                                   |
| State helpers  | `ambience/state/known_states`, `ambience/state/known_attribute_values`                                                                                            | Plausible-value suggestions for the state condition editor                              |
| Categories     | `ambience/categories/{list,save,delete}`                                                                                                                          | Scene-category CRUD (guarded: can't drop the last or an in-use category)                |
| Switches       | `ambience/switches/list`, `ambience/switch_defaults/*`, `ambience/set_scope_enabled`                                                                              | Scope switch entity ids, global defaults, permanent enable/disable                      |
| Observability  | `ambience/traces/{list,clear}`, `ambience/auto_triggers/list`, `ambience/diagnostics/scope`, `ambience/simulate`, `ambience/simulate/inputs`                      | Trace buffer, derived watch-list, focused diagnostics, what-if simulator                |

______________________________________________________________________

## Further reading

- [CONTRIBUTING.md](CONTRIBUTING.md) — dev environment setup, running tests,
    worktree workflow.
- [User documentation](https://clintongormley.github.io/ambience) — concepts,
    configuration reference, tips & testing (published from `docs/` to GitHub
    Pages).
