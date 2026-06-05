# Occupancy condition — design

**Date:** 2026-06-05
**Status:** Approved (brainstorming) — ready for implementation plan

## Problem

Presence-based scenes are currently modelled with the generic `state` condition
(e.g. `binary_sensor.lounge_presence is on`). Two problems follow:

1. **Clunky UX.** "Presence" is the most common smart-home trigger, yet building
   it means hand-picking a raw `state` condition, choosing `on`/`off`, and
   remembering the device.
2. **Wrong precedence.** Because presence rules use `state` (priority 950), they
   tie in the linearisation's top `state` slot with *other* `state` rules — like
   a "Watch TV" rule keyed on `remote.cine`'s `current_activity`. Ties in the
   `state` slot are broken by `order_key` = the entity_id, **alphabetically**.
   `binary_sensor.lounge_presence` < `remote.cine`, so every presence scene sorts
   ahead of "Watch TV", and the TV scene never wins in the overlap (you're
   present *and* watching TV). The user expects the deliberate "Watch TV" rule to
   take precedence over ambient presence/time/weather lighting.

See the real config: the `lounge` area has five `state`-on-presence scenes
(priorities 2048→1024) and one "Watch TV" `state`-on-`remote.cine` scene that
auto-sorts to the bottom (priority 0).

## Goal

A first-class **occupancy** condition that (a) gives presence a friendly,
purpose-built editor and (b) sits at a priority **below `state`**, so explicit
device/activity `state` rules ("Watch TV") automatically outrank presence-based
ambient lighting — while still outranking pure time/weather rules.

Non-goal: automatic migration. Existing `state`-based presence scenes keep
working; the user rebuilds the handful they care about on the new condition.

## Predicate

Mirrors the existing, well-tested `people` condition's structure (quantifier +
`for` + a `contains` lattice), over `binary_sensor` entities instead of persons.

```text
{ sensors: [binary_sensor.*],   // the presence sensors to test; empty/None = match-anything
  occupied: bool,                // true = occupied (on); false = vacant (off). Default true.
  quant: "any" | "all",          // default "any"
  for?: { h, m, s } }            // optional dwell time
null = no constraint (match-anything)
```

### Semantics

Let `want = "on"` when `occupied` (default), else `"off"`.

- Per sensor, observe state: `on`/`off` are observable; `unknown`/`unavailable`
  are **unobservable** (never satisfy `want`).
- **quant "any"** → at least one selected sensor is observably in `want`.
- **quant "all"** → every selected sensor is observably in `want` (and at least
  one sensor is observed).
- **`for`** → the qualifying sensors must have held `want` for ≥ the duration,
  measured per-sensor via `last_changed` (exactly the `people` pattern; same
  `last_changed`-vs-`last_updated` caveat).
- Empty/absent `sensors` (with a non-null predicate) → vacuously true
  (match-anything), consistent with "no constraint".

Common pairings: **occupied + any** = "someone's here"; **vacant + all** = "room
truly empty". Single-sensor scenes are just `quant: any` with one sensor.

## Priority & sorting

`priority = 915`. Full order:

```text
state 950 > people 925 > occupancy 915 > day 900 > time_of_day 800 > sun 750 > weather 700
```

This is the crux of the precedence fix: once presence scenes use `occupancy`
(915) and "Watch TV" stays on `state` (950), the linearisation compares the
`state` slot first — "Watch TV" constrains it `(0, …)`, the occupancy scenes are
wildcards there `(1, None)` — so "Watch TV" sorts first automatically. Occupancy
still beats pure time/weather rules because 915 > 800/700.

**`contains(outer, inner)`** — adapted from `people` (`PeopleCondition.contains`):

- Comparable only when `occupied` polarity matches **and** `quant` matches
  (different polarity/quant = disjoint match-sets → not comparable).
- Longer `for` on `inner` = more specific (inner's `for` ≥ outer's `for`).
- Sensor sets: reuse `people`'s any⊆ / all⊇ subset rules
  (`quant "any"`: `inner.sensors ⊆ outer.sensors`; `quant "all"`:
  `outer.sensors ⊆ inner.sensors`). Empty sensor set = "ALL" (the universe),
  same convention as `people`'s empty `who`.
- Conservative: anything unprovable → `False`.

**No `order_key`** — same as `people`; there's no meaningful total order among
occupancy predicates, so that linearisation slot falls back to "sorts last", and
`contains` is the condition's only sort contribution.

## Backend

New file `custom_components/ambience/conditions/occupancy.py`:

- `name = "occupancy"`, `description`, `predicate_help`, `input = "occupancy_predicate"`, `priority = 915`.
- `OccupancySnapshot` (frozen dataclass): `now`, and `sensors: dict[entity_id -> (state, last_changed)]`, plus `names` for `describe()`.
- `async snapshot(hass, *, now=None)`: snapshot **all** `binary_sensor` states via `hass.states.async_all("binary_sensor")` — `(state, last_changed)` + friendly name per entity. This mirrors `StateCondition` (snapshots all entities) and `PeopleCondition` (all persons); the engine takes one snapshot per condition per tick, so a domain-scoped full snapshot is both simple and cheap.
- `matches(predicate, snapshot)`: the semantics above. `None` → True.
- `describe(snapshot)`: e.g. "2 of 3 occupied (Lounge, Hall)".
- `validate_predicate`: `None` ok; else dict; `sensors` (if present) must be a list of `binary_sensor.*` ids; `occupied` (if present) bool; `quant` (if present) in `{any, all}`; `for` via `validate_for`. Lenient on device_class (runtime metadata, not in the id).
- `trigger_deps(predicate)`: `TriggerSpec` over the listed sensors, with `entity_durations` when `for` > 0 (mirror `people.trigger_deps`).
- `contains(outer, inner)`: as above (factor shared set helpers like `people._subset`/`_who_set`, or duplicate the few static helpers locally to keep conditions independent — prefer local duplication; conditions don't import each other today).

Register in `custom_components/ambience/__init__.py` `DATA_CONDITIONS`:

```python
"occupancy": OccupancyCondition(hass=hass),
```

The websocket `conditions/list` handler (`websocket.py`) already emits each
condition's `priority` and `input`, so the editor picks the new condition up
automatically once registered.

## Frontend

New file `frontend/src/views/occupancy-predicate-input.ts` (`<ambience-occupancy-predicate-input>`), modelled on `people-predicate-input.ts`:

- **Sensor picker** via ha-form entity selector, filtered to presence-type
  binary_sensors (flat selector form matches `day-config.ts` /
  `script-predicate-input.ts`):

```ts
{ name: "sensors",
  selector: { entity: { domain: "binary_sensor",
                        device_class: ["occupancy", "presence", "motion"],
                        multiple: true } } }
```

- **Occupied / Vacant** toggle (maps to `occupied: true|false`).
- **Quantifier** (Any / All) — shown only when more than one sensor is selected.
- **For** duration (optional), reusing the existing duration widget/`{h,m,s}` shape.
- Emits the predicate via `emitValueChanged`; normalises empty `for` to absent.

Wire-up:

- `frontend/src/views/condition-input.ts`: add `import "./occupancy-predicate-input.js"` and an `if (this.condition.input === "occupancy_predicate")` branch rendering the widget (same shape as the `people_predicate` branch).
- `frontend/src/summary.ts`: add `summariseOccupancy(pred, ctx)` and dispatch it from `summariseCondition` for `"occupancy"`. Example output: "Lounge presence is occupied", "Lounge presence is occupied for ≥5m", "all of (Lounge, Hall) vacant". Use entity friendly names via the existing `entityName`/`HassWithStates` helper.

## i18n

Add occupancy strings to `frontend/src/i18n-data.ts` (NOT `strings.json` —
hassfest rejects custom top-level keys). Keys for: condition label/description,
field labels (Sensors, State, Any/All, For), Occupied/Vacant, and the summary
connectors ("occupied", "vacant", "for", "any of", "all of").

## Docs

- `docs/conditions/occupancy.md` — what it does, predicate, examples (incl. the
  "TV overrides presence" precedence note).
- Add an entry to `docs/conditions/index.md`.

## Testing

- `tests/test_occupancy.py`:
  - `matches`: occupied/vacant × any/all × single/multi sensor; unavailable/unknown unobservable; `for` satisfied/not; `None` → True; empty sensors → True.
  - `validate_predicate`: rejects non-`binary_sensor.*`, bad `quant`, bad `for`; accepts valid + `None`.
  - `trigger_deps`: entities + durations.
  - `contains`: polarity/quant comparability, `for` monotonicity, set rules; non-comparable → False.
- `tests/test_sorting.py` (or alongside): a scene on `state` (e.g. `remote.cine`) sorts **above** a scene on `occupancy`, proving the precedence fix end-to-end.
- Frontend `test/occupancy-predicate-input.test.ts`: schema shape (device_class filter, multiple), occupied/vacant + quant emit, "for" normalisation, quant hidden for a single sensor.
- Frontend `test/summary.test.ts`: `summariseOccupancy` phrasings (occupied/vacant, for, any/all, friendly names).

## Migration

None automatic. Existing `state`-based presence scenes continue to work
unchanged. The user rebuilds the presence scenes they want reprioritised on the
new occupancy condition; "Watch TV" (and other `state` rules) then outrank them
automatically.

## Out of scope (future)

- Area-based occupancy (`{areas:[area_id], …}` aggregating an area's presence
  sensors via the registry) — deferred; can layer on later.
- Auto-migration of `state`-on-presence-sensor scenes to `occupancy`.
