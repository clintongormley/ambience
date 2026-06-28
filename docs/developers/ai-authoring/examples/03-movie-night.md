# Example 3 — Movie night across a category

## The request

> "Set up a Movie Night group for the lounge: when the TV is playing in the
> evening, drop the lights right down; otherwise just use a normal evening
> level."

This needs a **new category** with **two scenes** — a specific one (TV playing)
and a catch-all (evening default). It shows scene ordering / specificity.

## AI bundle excerpt the AI consults

```jsonc
{
  "ambience_ai_bundle": 1,
  "catalog": {
    "areas": [ { "area_id": "lounge", "name": "Lounge" } ],
    "entities": [
      { "entity_id": "light.lounge", "domain": "light", "area_id": "lounge", "state": "on" },
      { "entity_id": "media_player.lounge_tv", "domain": "media_player",
        "area_id": "lounge", "state": "playing" }
    ]
  },
  "actions": {
    "exposed": [ { "id": "light.turn_on", "label": "Turn on",
                   "visible_fields": ["brightness_pct"], "defaults": {} } ],
    "schemas": { "light.turn_on": { "fields": { "brightness_pct": {} } } }
  },
  "definitions": {
    "categories": [ { "id": "general", "name": "General" } ],
    "periods": { "builtins": { "evening": {}, "nighttime": {} }, "custom": {}, "hidden": [] }
  }
}
```

## The produced import block

```yaml
ambience_import: 1
scope: { kind: area, id: lounge }
mode: merge
category: { id: movie_night, name: Movie Night, icon: mdi:movie, color: deep-purple }
scenes:
  # The more-specific scene (TV playing in the evening) → cinema-dark. It wins by
  # being a subset of "Evening default", not by being listed first.
  - name: Film mode
    category: movie_night
    when:
      time_of_day: [{ period: evening }]
      state: { kind: is, entity_id: media_player.lounge_tv, states: [playing] }
    actions:
      - service: light.turn_on
        entity_ids: [light.lounge]
        params: { brightness_pct: 5 }
  # Catch-all: any other evening → a comfortable level.
  - name: Evening default
    category: movie_night
    when:
      time_of_day: [{ period: evening }]
    actions:
      - service: light.turn_on
        entity_ids: [light.lounge]
        params: { brightness_pct: 35 }
```

Notes:

- **Two scenes, ANDed conditions, ORed by specificity.** "Film mode" requires
  *both* evening *and* TV playing; "Evening default" requires only evening. "Film
  mode" matches a strict *subset* of the situations "Evening default" does, so the
  engine evaluates it first (more specific wins): it beats "Evening default"
  whenever the TV is playing, and "Evening default" handles every other evening.
  This is automatic because the two are containment-related — a *broad* override
  that is **not** a subset of what it must beat (e.g. "projector on") would instead
  need pinning; see `schema.md` → *How scenes are chosen*.
- Both scenes share the `movie_night` category, declared once in the envelope so
  the import creates it.
- The catch-all is listed last and is intentionally broad. If you wanted a *true*
  unconditional default you'd give it an empty `when: {}`.
