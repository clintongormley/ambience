# Import format — the single-scope envelope

An AI authors Ambience scenes by emitting **import blocks**. Each block is one
**scope's** scenes wrapped in a thin, self-describing envelope that tells the
panel *where* the scenes go and *which group* they form. The user pastes or
uploads the block into the panel's **Import** view, previews it (adds vs updates,
new categories, a live dry-run of what would match now), and confirms.

Both **YAML and JSON** are accepted on import.

## The envelope

```yaml
ambience_import: 1                      # format version — always 1
scope: { kind: area, id: living_room }  # where these scenes go
category:                               # OPTIONAL; the group these scenes form
  id: movie_night
  name: Movie Night
  icon: mdi:movie
  color: deep-purple
mode: merge                             # merge (default) | replace
scenes:                                 # a non-empty list of Scene objects
  - name: Dim for film
    category: movie_night
    when:
      time_of_day: [{ period: evening }]
      people: { quant: any, where: home }
    actions:
      - service: light.turn_on
        entity_ids: [light.living_room]
        params: { brightness_pct: 15 }
```

### `ambience_import` (required)

Integer. The envelope format version. Currently always `1`.

### `scope` (required)

Where this block's scenes live. **Exactly one scope per block.**

```jsonc
{ "kind": "area",  "id": "living_room" }    // a Home Assistant area
{ "kind": "floor", "id": "ground_floor" }   // a Home Assistant floor
{ "kind": "house" }                         // the whole-home singleton — NO id
```

- `kind`: `"area"`, `"floor"`, or `"house"`.
- `id`: the HA `area_id` / `floor_id`. **Omitted for `house`.** Use the real ids
  from the AI bundle's catalog — not the friendly name.
- A request spanning several rooms becomes **several blocks** (one per scope).
  Label each block clearly (e.g. a comment naming the room) so the user knows
  what they're importing where.

### `category` (optional)

Declares the group these scenes belong to, so the import can **create the
category if it doesn't already exist** — instead of letting an unknown category
silently coerce to "General".

```jsonc
{
  "id": "movie_night",      // stable slug; scenes reference this in their `category`
  "name": "Movie Night",    // human label
  "icon": "mdi:movie",      // optional; an mdi icon name
  "color": "deep-purple"    // optional; a category color id (see below)
}
```

- If you omit `category`, **every scene's `category` must reference an existing
  category id** (visible in the AI bundle's `categories` list).
- On preview, a not-yet-existing category is shown as **"new category to be
  created"** with this name/icon/color; the user confirms.

### `mode` (optional, default `merge`)

- **`merge`** — read the scope's current config and **upsert** the listed scenes
  by `(category, name)`: an existing `(category, name)` is replaced, a new one is
  added, **all other scenes in the scope are left untouched.** The safe default.
- **`replace`** — replace **only this category's** scenes in this scope with the
  listed ones. Scenes in *other* categories in the same scope are untouched.
  Higher blast radius — only use to deliberately clear out a group.

### `scenes` (required)

A non-empty list of [Scene](schema.md#3-scene) objects. Each scene's `category`
should match the envelope `category.id` (or an existing category id). Scene
fields: `name`, `description?`, `category`, `when`, `actions`, `apply?` — see
[schema.md](schema.md) and the [conditions cookbook](conditions-cookbook.md).

## What the import does

```text
paste/upload YAML or JSON
   │
   ▼  parse + validate (shape only, no save)
 preview ──► parsed scenes (adds vs updates), new categories to create
         ──► dry-run: what would match right now
   │
   ▼  confirm
 create category if needed → save the scope (merge or replace)
```

Because import is a normal save, it is covered by the panel's **undo/redo
history** — every import is reversible. Validation errors map back to the
offending field where possible.

## JSON form

The same block in JSON:

```json
{
  "ambience_import": 1,
  "scope": { "kind": "area", "id": "living_room" },
  "category": { "id": "movie_night", "name": "Movie Night", "icon": "mdi:movie", "color": "deep-purple" },
  "mode": "merge",
  "scenes": [
    {
      "name": "Dim for film",
      "category": "movie_night",
      "when": {
        "time_of_day": [ { "period": "evening" } ],
        "people": { "quant": "any", "where": "home" }
      },
      "actions": [
        { "service": "light.turn_on", "entity_ids": ["light.living_room"], "params": { "brightness_pct": 15 } }
      ]
    }
  ]
}
```

## Multi-scope requests → multiple blocks

"Dim the whole downstairs in the evening" across three rooms becomes three blocks
(or one floor-scoped block if the rooms share a floor). Emit each clearly:

```yaml
# --- Block 1 of 2: Living room ---
ambience_import: 1
scope: { kind: area, id: living_room }
mode: merge
category: { id: evening_calm, name: Evening Calm, icon: mdi:weather-night, color: indigo }
scenes:
  - name: Evening dim
    category: evening_calm
    when: { time_of_day: [{ period: evening }] }
    actions:
      - { service: light.turn_on, entity_ids: [light.living_room], params: { brightness_pct: 20 } }
```

```yaml
# --- Block 2 of 2: Kitchen ---
ambience_import: 1
scope: { kind: area, id: kitchen }
mode: merge
category: { id: evening_calm, name: Evening Calm, icon: mdi:weather-night, color: indigo }
scenes:
  - name: Evening dim
    category: evening_calm
    when: { time_of_day: [{ period: evening }] }
    actions:
      - { service: light.turn_on, entity_ids: [light.kitchen], params: { brightness_pct: 25 } }
```

The user imports each block in turn; the shared `category` is created once and
reused.

## Category color ids

`color` is one of these ids (Material-ish palette):

```text
red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal,
green, light-green, lime, yellow, amber, orange, deep-orange, brown,
grey, blue-grey
```

`icon` is any mdi icon name, e.g. `mdi:movie`, `mdi:weather-night`, `mdi:home`.
