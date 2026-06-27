# Example 1 — Evening wind-down

## The request

> "In the evening, when it gets dark in the living room, dim the lights to about
> 20%."

## AI bundle excerpt the AI consults

```jsonc
{
  "ambience_ai_bundle": 1,
  "catalog": {
    "areas": [ { "area_id": "living_room", "name": "Living Room" } ],
    "entities": [
      { "entity_id": "light.living_room", "domain": "light",
        "area_id": "living_room", "state": "on" },
      { "entity_id": "sensor.living_lux", "domain": "sensor",
        "device_class": "illuminance", "area_id": "living_room", "state": "240" }
    ]
  },
  "actions": {
    "exposed": [ { "id": "light.turn_on", "label": "Turn on",
                   "visible_fields": ["brightness_pct", "color_temp"], "defaults": {} } ],
    "schemas": { "light.turn_on": { "fields": { "brightness_pct": {}, "color_temp": {} } } }
  },
  "definitions": {
    "categories": [ { "id": "general", "name": "General" } ],
    "periods": { "builtins": { "evening": {}, "morning": {} }, "custom": {}, "hidden": [] },
    "lux_ranges": { "builtins": { "dark": {}, "dim": {} }, "custom": {}, "hidden": [] }
  }
}
```

The AI learns: the real area id is `living_room`, the light is
`light.living_room`, there's an illuminance sensor `sensor.living_lux`,
`light.turn_on` is exposed with a `brightness_pct` field, and `evening` / `dim`
are valid vocabulary.

## The produced import block

```yaml
ambience_import: 1
scope: { kind: area, id: living_room }
mode: merge
category: { id: evening_calm, name: Evening Calm, icon: mdi:weather-night, color: indigo }
scenes:
  - name: Evening wind-down
    category: evening_calm
    description: Dim the living-room lights in the evening once it's dim.
    when:
      time_of_day: [{ period: evening }]
      lux: { sensors: [sensor.living_lux], range: dim }
    actions:
      - service: light.turn_on
        entity_ids: [light.living_room]
        params: { brightness_pct: 20 }
```

Notes:

- "When it gets dark" was read as **dim, not pitch-dark** — `range: dim` (10–50
  lx), not `dark` (<10). The trace-driven diagnostics guide shows why `dark` is
  usually too strict for "dim the lights".
- `time_of_day` is a one-element list so the user can easily add "or another
  window" later.
- A new `evening_calm` category is declared so the import creates it instead of
  coercing to General.
