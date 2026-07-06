# Import format — the single-scope envelope

An AI authors Ambience scenes by emitting **import blocks**. Each block is one
**scope's** scenes wrapped in a thin, self-describing envelope that tells the
panel *where* the scenes go and *which group* they form. The user pastes or
uploads the block into the panel's **Import** view, previews it (adds / updates /
removes, plus new vs unknown categories), and confirms.

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
- **`replace`** — for **every category your imported scenes belong to**, remove
  the scope's existing scenes in that category and replace them with the listed
  ones. Scenes in categories you don't import are untouched. Keep all your scenes
  in one category so the blast radius matches your intent. Higher blast radius —
  the preview lists exactly which existing scenes will be removed, so check it
  before confirming.

### `scenes` (required)

A non-empty list of [Scene](schema.md#3-scene) objects. Each scene's `category`
should match the envelope `category.id` (or an existing category id). Scene
fields: `name`, `description?`, `category`, `when`, `actions`, `apply?` — see
[schema.md](schema.md) and the [conditions cookbook](conditions-cookbook.md).

> **Ordering & overrides.** List order does **not** set which scene wins — on save
> the engine re-derives the evaluation order from each scene's conditions (more
> specific, i.e. matching a *subset* of situations, evaluated first). To **force**
> an order that differs from that — e.g. floating a broad **override/blocker**
> ("projector on → close", a "block while moving" no-op) above the more-specific
> scenes — give the scenes explicit **`priority`** numbers (see
> [Ordering](#ordering) below). The user no longer has to pin by hand. See also
> [schema.md → How scenes are chosen](schema.md#how-scenes-are-chosen).

## Ordering

Add an integer **`priority`** to a scene to place it explicitly in its category's
evaluation order. **Higher number = evaluated earlier.** Numbers only need to
compare *within one category* — categories resolve independently.

Presence of a `priority` marks the scene **pinned** on import (you don't set
`pinned` yourself — the number carries it). On save the backend **auto-unpins**
every scene the natural containment order already places correctly, so the stored
config keeps pins **only** where your order genuinely overrides containment. The
resolved order is always exactly the one you numbered. Two recipes:

- **Replace a category** (`mode: replace`, or a fresh category): number the scenes
  **cleanly descending** with a gap between each — `N·1024, (N-1)·1024, …, 1·1024`
  (e.g. four scenes → `4096, 3072, 2048, 1024`). Self-contained and portable; the
  gap leaves room to insert later.

  ```yaml
  scenes:
    - { name: Projector override, category: living, priority: 3072, when: { state: {…} }, actions: [ … ] }
    - { name: Evening dim,        category: living, priority: 2048, when: { time_of_day: [{ period: evening }] }, actions: [ … ] }
    - { name: Daytime default,    category: living, priority: 1024, when: {}, actions: [ … ] }
  ```

- **Edit an existing category** (`mode: merge`): read the **current `priority`
  numbers from the AI bundle** (each scene exposes its `priority`) and
  **interpolate** — to slot a scene between neighbours numbered `2048` and `1024`,
  give it the midpoint `1536`; to put it on top, use `existing_max + 1024`. This is
  the same midpoint math the panel's drag-to-reorder uses, so your inserts land
  where you expect without renumbering the untouched scenes.

**Only number what needs it.** Where you don't care about two *incomparable*
scenes' relative order, order them the way containment already would (the
constrained / higher-condition-priority scene first — see
[schema.md → How scenes are chosen](schema.md#how-scenes-are-chosen)); the backend
then auto-unpins both and nothing is stored as pinned. Reserve `priority` for the
deliberate overrides.

## What the import does

```text
paste/upload YAML or JSON
   │
   ▼  parse + validate (shape only, no save)
 preview ──► parsed scenes (adds / updates / removes), new vs unknown categories
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
