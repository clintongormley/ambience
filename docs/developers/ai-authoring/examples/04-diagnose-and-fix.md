# Example 4 — Diagnose & fix from a trace

## The request

> "My 'Evening wind-down' scene from before never turns the lights on. Here's my
> bundle — what's wrong?"

## AI bundle excerpt the AI consults (a trace)

```jsonc
{
  "traces": [
    {
      "timestamp": "2026-06-27T19:42:00+00:00",
      "cause": { "kind": "entity", "entity_id": "sensor.living_lux", "old": "180", "new": "240" },
      "scope_kind": "area", "scope_id": "living_room",
      "category": "evening_calm", "switch_state": "on",
      "outcome": "no_match",
      "winner_name": null,
      "explanation": {
        "winner_index": null,
        "scenes": [
          {
            "index": 0, "name": "Evening wind-down", "matched": false, "evaluated": true,
            "predicates": [
              { "condition_key": "time_of_day", "passed": true,  "detail": "evening", "entity_ids": [] },
              { "condition_key": "lux", "passed": false,
                "detail": "want <10 lx; Living Room: 240 lx ✗",
                "entity_ids": ["sensor.living_lux"] }
            ]
          }
        ]
      }
    }
  ]
}
```

## Diagnosis

- `outcome` is **`no_match`** — no scene won, so the conditions are the problem
  (not the switch/scope; `switch_state` is `on`).
- The only scene, "Evening wind-down", has `matched: false`. Walking its
  predicates: `time_of_day` **passed** (`evening`), but `lux` **failed**.
- The `lux` `detail` is decisive: `want <10 lx; Living Room: 240 lx ✗`. The scene
  requires the `dark` band (`< 10` lx) but the room is at 240 lx. The user's
  living room is essentially never under 10 lx in the evening, so the scene can't
  fire.
- Root cause: the lux band is **too strict**. "When it gets dark / dim" should be
  the `dim` band (10–50 lx) or wider, not `dark`.

## The corrected import block

```yaml
ambience_import: 1
scope: { kind: area, id: living_room }
mode: merge
scenes:
  - name: Evening wind-down      # SAME name → upserts the existing scene, no duplicate
    category: evening_calm
    when:
      time_of_day: [{ period: evening }]
      lux: { sensors: [sensor.living_lux], range: normal }   # widened from `dark`
    actions:
      - service: light.turn_on
        entity_ids: [light.living_room]
        params: { brightness_pct: 20 }
```

Notes:

- `mode: merge` + the **same `name`** means this **replaces** the broken scene in
  place — no duplicate is created.
- Only the failing predicate changed (`dark` → `normal`); everything else is
  preserved.
- `scope` and `category` match the failing unit exactly.
- If the user actually wants "any evening, regardless of brightness", the cleaner
  fix is to **remove** the `lux` key entirely (a missing condition is a wildcard).
