# Diagnostics guide — "why didn't my scene fire?"

When a user says a scene isn't behaving, the answer is in the **traces** carried
in their downloaded AI bundle (and in the panel's per-scope diagnostics). This
file explains the trace record and walks through diagnosing failures, then
producing a corrected import block.

## What a trace is

Ambience records each **evaluation**: something changes in the home (an entity, a
clock tick, a sun event, a `for` timer), and every affected `(scope, category)`
**unit** re-evaluates its scenes and records what happened. The bundle holds the
most recent of these per unit.

## The trace record

One buffered unit looks like this (fields verified against the backend):

```jsonc
{
  "event_id": "a1b2c3",            // correlates lines of one trigger event
  "timestamp": "2026-06-27T19:05:00+00:00",
  "cause": {
    "kind": "entity",             // what triggered this evaluation (see below)
    "entity_id": "binary_sensor.lounge_motion",
    "old": "off",
    "new": "on",
    "detail": null
  },
  "scope_kind": "area",
  "scope_id": "living_room",
  "scope_name": "Living Room",
  "category": "evening_calm",
  "category_name": "Evening Calm",
  "switch_state": "on",            // the scope's pause switch at evaluation time
  "outcome": "no_match",           // what the unit did (see below)
  "winner_name": null,             // the scene that won, if any
  "actions": [ /* dispatched actions, if any */ ],
  "explanation": {
    "winner_index": null,          // 0-based index of the winning scene, or null
    "scenes": [
      {
        "index": 0,
        "name": "Evening dim",
        "matched": false,          // did this scene's when match?
        "evaluated": true,         // false = skipped (a winner was already found)
        "disabled": false,
        "predicates": [
          {
            "condition_key": "time_of_day",
            "passed": true,
            "detail": "evening",   // human description of why it passed/failed
            "entity_ids": []       // entities this predicate references
          },
          {
            "condition_key": "lux",
            "passed": false,
            "detail": "want <10 lx; Living Room: 240 lx ✗",
            "entity_ids": ["sensor.living_lux"]
          }
        ]
      }
    ]
  }
}
```

### `cause.kind` — what triggered the evaluation

| kind | meaning |
|---|---|
| `entity` | an entity changed state (`entity_id`, `old`, `new` are set) |
| `clock` | a scheduled clock time fired (`detail` = the time) |
| `sun` | a sun event fired (`detail` names it) |
| `duration` | a `for:` timer elapsed — a predicate's test has now held long enough |
| `has_time` | a periodic sweep re-checked a wall-clock-dependent template |
| `switch` | the scope's pause switch turned on |
| `manual` | a manual apply |
| `startup` | startup sync |
| `reloaded` | a config save (not an HA restart) re-ran evaluation |
| `reapply` | the idle-reapply timer fired |
| `simulated` | the what-if simulator |
| `unknown` | unclassified |

### `outcome` — what the unit did

| outcome | meaning |
|---|---|
| `acted` | a scene won **and** its actions were dispatched |
| `no_op` | a scene won but it has **no actions** (a pure blocker) |
| `debounced` | a scene won, but it's identical to the last applied winner — the redundant re-fire was suppressed |
| `no_match` | **no scene matched** — nothing won |
| `skipped_switch_off` | the scope's pause switch was off, so the unit didn't apply |
| `skipped_scope_disabled` | the scope is permanently disabled (`enabled: false`) |
| `skipped_unavailable` | the trigger was an entity going unavailable/unknown — a drop-out, not a real event, so nothing was applied |

### `explanation.scenes[]` — the per-scene verdict

- `matched` — did this scene's `when` match?
- `evaluated` — `false` means the scene was **not checked** because an earlier,
  more specific scene already won. (Evaluation stops at the winner.)
- `disabled` — the scene is disabled and ignored.
- `predicates[]` — one row per condition in the scene's `when`:
  - `condition_key` — the condition name (`time_of_day`, `lux`, …).
  - `passed` — did this condition pass?
  - `detail` — a human description (e.g. `"want <10 lx; Living Room: 240 lx ✗"`).
    **This is the single most useful field for diagnosis** — it usually names the
    exact value that failed. (For `people`/`template`, `detail` may be redacted in
    the bundle for privacy; you'll still see `passed`.)
  - `entity_ids` — the entities the predicate references.

A scene **wins** only when **every** predicate `passed`. The first failed
predicate is your culprit.

## Diagnosing — the method

1. **Find the unit** for the user's scope + category (`scope_kind`/`scope_id` +
   `category`).
2. **Read `outcome`.** A `skipped_*` outcome means the scene never got a chance —
   address the switch/scope state, not the conditions. A `no_match` means the
   conditions are the problem. An `acted`/`debounced` with the *wrong* scene
   means the resolved **order** is off: either the scene you wanted isn't actually
   more specific, so the broader one wins (tighten it), or a broad override isn't
   pinned above the specific scenes. See `schema.md` → *How scenes are chosen*.
3. **For `no_match`,** open the scene in `explanation.scenes` and find the
   predicate with `passed: false`. Its `detail` tells you what value blocked it.
4. **Cross-check the `cause`:** did the evaluation even run for the right reason?
   If a `for:` condition never fired a `duration` cause, the timer may not have
   elapsed yet. If the scene depends on an entity that never appears as a `cause`,
   the engine may not be watching it (e.g. an opaque `template`).
5. **Emit a corrected import block** (`mode: merge`) fixing the predicate(s).

## Worked walkthrough 1 — wrong lux band

**Symptom:** "My evening dim scene never fires."

Trace (trimmed):

```jsonc
{
  "outcome": "no_match",
  "category": "evening_calm", "scope_kind": "area", "scope_id": "living_room",
  "explanation": { "winner_index": null, "scenes": [
    { "index": 0, "name": "Evening dim", "matched": false, "evaluated": true,
      "predicates": [
        { "condition_key": "time_of_day", "passed": true,  "detail": "evening" },
        { "condition_key": "lux",         "passed": false, "detail": "want <10 lx; Living Room: 240 lx ✗" }
      ] } ] }
}
```

**Read it:** `time_of_day` passed; `lux` failed — the scene wanted `< 10` lx
(`dark`) but the room reads 240 lx. The user wanted "dim the lights in the
evening", not "only when pitch dark". The lux constraint is too strict (or
shouldn't be there).

**Fix:** drop the over-tight lux band (or widen it to `dim`/`normal`). Corrected
block:

```yaml
ambience_import: 1
scope: { kind: area, id: living_room }
mode: merge
scenes:
  - name: Evening dim          # same name → upserts the existing scene
    category: evening_calm
    when:
      time_of_day: [{ period: evening }]
      # removed the lux: dark constraint
    actions:
      - { service: light.turn_on, entity_ids: [light.living_room], params: { brightness_pct: 20 } }
```

## Worked walkthrough 2 — a more specific scene shadows it

**Symptom:** "My 'Movie' scene wins even when I'm not watching TV."

Trace (trimmed):

```jsonc
{
  "outcome": "acted", "winner_name": "Movie", "category": "lounge",
  "explanation": { "winner_index": 0, "scenes": [
    { "index": 0, "name": "Movie",   "matched": true,  "evaluated": true,
      "predicates": [ { "condition_key": "time_of_day", "passed": true, "detail": "evening" } ] },
    { "index": 1, "name": "Evening", "matched": true,  "evaluated": false }
  ] }
}
```

**Read it:** "Movie" matched on `time_of_day: evening` alone and won; "Evening"
was never evaluated (`evaluated: false`) because the winner was already found.
The "Movie" scene is **under-constrained** — it should also require the TV to be
on. Its match-set is broader than intended, so it shadows everything.

**Fix:** add the missing constraint to "Movie" so it only wins when actually
watching:

```yaml
ambience_import: 1
scope: { kind: area, id: lounge }
mode: merge
scenes:
  - name: Movie
    category: lounge
    when:
      time_of_day: [{ period: evening }]
      state: { kind: is, entity_id: media_player.lounge_tv, states: [playing] }
    actions:
      - { service: light.turn_on, entity_ids: [light.lounge], params: { brightness_pct: 10 } }
```

Now "Movie" is strictly more specific *and* only matches while the TV plays;
otherwise "Evening" wins.

## Worked walkthrough 3 — the switch was off / scope disabled

**Symptom:** "Nothing happens at all in this room."

Trace:

```jsonc
{ "outcome": "skipped_switch_off", "scope_kind": "area", "scope_id": "study", "category": "focus" }
```

**Read it:** the outcome is `skipped_switch_off` — the conditions were never even
evaluated because the scope's Ambience **pause switch is off**. (Likewise
`skipped_scope_disabled` = the scope is permanently disabled.) This is **not** a
config bug — there's nothing to fix in the scenes. Tell the user to turn the
scope's Ambience switch back on (or re-enable the scope). No import block needed.

## Producing the corrected block

Always:

- Use `mode: merge` and keep the **same scene `name`** so the fix **upserts** the
  existing scene rather than adding a duplicate.
- Change only the predicate(s) the trace pinned down.
- Keep `scope` and `category` matching the failing unit's `scope_kind`/`scope_id`
  and `category`.
- If the fix is about **resolved order** (a shadow), you can't fix it with list
  order — the engine re-derives the order. Either add the missing constraint to
  the over-broad scene (so the intended winner is strictly more specific, as in
  walkthrough 2), or, for a broad override/blocker that must beat specific scenes,
  tell the user to **pin it to the top** in the panel. See `schema.md` → *How
  scenes are chosen*.

## A note on privacy / redaction

The AI bundle reuses the diagnostics redaction, so some values are scrubbed
before you see them: `people`/`template` predicate `detail` strings, and
`person.*` / `device_tracker.*` ids in causes and predicate `entity_ids` are
replaced with `**REDACTED**`. You can still diagnose from `passed`, the condition
keys, and the non-presence predicates — just don't expect to see exact
person/location strings.
