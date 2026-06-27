# Example 2 — Away / nobody home

## The request

> "When nobody's been home for 10 minutes, turn off the downstairs lights and the
> TV."

## AI bundle excerpt the AI consults

```jsonc
{
  "ambience_ai_bundle": 1,
  "catalog": {
    "floors": [ { "floor_id": "downstairs", "name": "Downstairs" } ],
    "areas": [
      { "area_id": "living_room", "name": "Living Room" },
      { "area_id": "kitchen", "name": "Kitchen" }
    ],
    "entities": [
      { "entity_id": "light.living_room", "domain": "light",
        "area_id": "living_room", "state": "on" },
      { "entity_id": "media_player.tv", "domain": "media_player",
        "area_id": "living_room", "state": "playing" },
      { "entity_id": "light.kitchen", "domain": "light",
        "area_id": "kitchen", "state": "on" },
      { "entity_id": "person.alice", "domain": "person", "area_id": null, "state": "home" }
    ]
  },
  "actions": {
    "exposed": [ { "id": "ambience.turn_off", "label": "Turn off",
                   "visible_fields": [], "defaults": {} } ],
    "schemas": {}
  },
  "definitions": { "categories": [ { "id": "general", "name": "General" } ] }
}
```

The AI learns: there's a `downstairs` floor containing both rooms, two tracked
persons, and `ambience.turn_off` (the safe cross-domain off) is exposed.

## The produced import block

Because the intent spans a whole floor, the AI scopes the scene to the **floor**
(one block, not two):

```yaml
ambience_import: 1
scope: { kind: floor, id: downstairs }
mode: merge
category: { id: away, name: Away, icon: mdi:home-export-outline, color: blue-grey }
scenes:
  - name: Empty house — lights & TV off
    category: away
    description: Turn downstairs lights and the TV off once nobody's home for 10 min.
    when:
      people: { quant: nobody, where: home, for: { m: 10 } }
    actions:
      - service: ambience.turn_off
        entity_ids: [light.living_room, light.kitchen, media_player.tv]
```

Notes:

- "Nobody's been home for 10 minutes" → `people` with `quant: nobody`,
  `where: home`, and `for: { m: 10 }`. The `for` counts continuously and survives
  a person hopping between two *away* zones — it only resets when someone arrives
  home.
- `ambience.turn_off` is used instead of `light.turn_off` + `media_player.turn_off`
  because it's safe (skips already-off entities) and cross-domain, so one action
  handles lights and the TV.
- Floor scope means one rule covers both rooms; the action still targets the
  specific entity ids.
