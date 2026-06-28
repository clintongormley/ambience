# Ambience configuration schema (overview)

This is a hand-authored **overview** of the data an AI produces to author
Ambience scenes. It explains the shapes and how they fit together. For the
**exhaustive, per-field predicate reference** — every condition's fields, types,
defaults and validation rules — see the generated companion:

- **[condition-reference.generated.md](condition-reference.generated.md)** — every predicate field (generated from source)
- **[action-reference.generated.md](action-reference.generated.md)** — action/params shape + built-in service fields (generated)
- **[conditions-cookbook.md](conditions-cookbook.md)** — plain-English intent → predicate (the part you author from)
- **[actions.md](actions.md)** — how actions and exposed services work
- **[import-format.md](import-format.md)** — the single-scope import envelope in full
- **[diagnostics-guide.md](diagnostics-guide.md)** — reading traces to answer "why didn't it fire?"

> **Terminology.** A **scope** is `house`, a `floor`, or an `area` — it holds an
> ordered list of scenes. A **category** is a global, named grouping every scene
> belongs to. A **scene** pairs a `when` (conditions) with `actions` and is the
> unit Ambience activates. Full glossary at the [foot of this file](#glossary).

---

## 1. The import block (what an AI emits)

The unit an AI emits and a user imports is a single **import block** — one
scope's scenes wrapped in a thin, self-describing envelope. Both **YAML and
JSON** are accepted on import.

```yaml
ambience_import: 1                      # format version — always 1
scope: { kind: area, id: living_room }  # where these scenes go
category:                               # OPTIONAL; the group these scenes form
  id: movie_night
  name: Movie Night
  icon: mdi:movie
  color: deep-purple
mode: merge                             # merge (default) | replace
scenes:                                 # a list of Scene objects (section 3)
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

The envelope is documented field-by-field in
**[import-format.md](import-format.md)**. In brief:

- `ambience_import`: integer, always `1`.
- `scope`: `{ kind: area|floor|house, id }` — `house` omits `id`. One scope per
  block; a multi-room request becomes several blocks.
- `category`: optional; declares the group so the import can **create it** rather
  than letting an unknown category silently coerce to "General" (see the
  [coercion caveat](#category-coercion-caveat)).
- `mode`: `merge` (default — upsert listed scenes by `(category, name)`, leave
  others untouched) or `replace` (replace only this category's scenes in the
  scope).
- `scenes`: a non-empty list of [Scene](#3-scene) objects.

---

## 2. ScopeConfig (what a scope stores)

The import ultimately writes a **ScopeConfig** for the target scope. Area, floor
and house all share this shape:

```jsonc
{
  "scenes": [ /* ordered list of Scene objects */ ],
  "enabled": true   // optional; default true. false = scope permanently off.
}
```

- `scenes`: a list. The engine **re-derives** the evaluation order from the
  scenes' conditions (and any pinning) — your array order is only the final
  tiebreaker between scenes it can't otherwise separate, never the authoritative
  order. The backend owns each scene's `priority`; you do not set it. See
  [How scenes are chosen](#how-scenes-are-chosen).
- `enabled`: a permanent per-scope switch, independent of the runtime pause
  toggle. You normally do not set this from an import.

An AI produces the **envelope** (section 1), not a raw ScopeConfig; the
envelope's `mode` controls how the listed scenes fold into the existing config.

---

## 3. Scene

```jsonc
{
  "name": "Dim for film",          // string; unique (case-insensitive) within its category+scope
  "description": "Optional note",  // optional string; display-only, never affects matching
  "category": "movie_night",       // required; a category id
  "when": { /* condition -> predicate map */ },
  "actions": [ /* ActionSpec list */ ],
  "apply": "once"                  // optional; "once" (default) | "always"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes (in practice) | Unique, case-insensitively and trimmed, within its `(category, scope)`. Always name scenes. |
| `description` | string | no | Display-only; never affects matching, order, or actions. |
| `category` | string | yes | A category id. An unknown/missing one is silently reassigned to `general` at save — always reference a real category (or define it in the envelope). |
| `when` | object | yes | `{ "<condition>": <predicate> }`. See section 4. Empty `{}` matches unconditionally. |
| `actions` | array | yes | List of [ActionSpec](#5-actionspec). May be empty (a pure "blocker" scene that matches but does nothing). |
| `apply` | string | no | `"once"` (default): apply when first winner, then debounce identical re-fires. `"always"`: re-apply on every re-evaluation while it stays the winner. |

**Fields you don't author** (backend-owned / response-only): `priority`,
`shadowed_by`, `missing_entities`, `overlap_entities`, `config_issues`. `pinned`
is a real, persisted field, but **you can't usefully set it from an import** (a
freshly-imported pinned scene with no priority sorts to the *bottom*) — leave it
off and have the user pin in the panel (see below).

### How scenes are chosen

Resolution is **first match wins** within one `(scope, category)`, over the scenes
in the engine's **derived** order (highest `priority` first). Two things set that
order — neither is your array order:

1. **Containment (automatic).** A scene whose match-set is a strict **subset** of
   another's is evaluated **first** — the more specific scene wins. "More specific"
   means *matches a subset of situations*, **not** "has more conditions": adding a
   condition usually shrinks the match-set, but a scene with an empty `when: {}`
   matches everything, so it always sorts **last** — the natural catch-all. Scenes
   whose match-sets are **incomparable** (neither contains the other — e.g.
   "projector is on" vs "it's mid-morning and the blind is low") are ordered by
   which higher-priority *conditions* they constrain; the one you think of as the
   "override" is **not** promoted for being broad.
2. **Pinning (manual, in the panel).** A pinned scene holds a fixed priority that
   bypasses the containment order. This is the **only** reliable way to force a
   broad rule above more-specific ones.

**Consequences for authoring:**

- A broad **override or blocker** (few conditions, must beat everything — e.g.
  "projector on → close the blind", or an empty-`when` "block while moving" no-op)
  will **not** float to the top on its own; containment sorts it *below* the
  specific scenes. Author it, then tell the user to **pin it to the top** in the
  panel (Scopes view → pin/drag). Don't rely on array order.
- Because evaluation is a first-match cascade, a scene may **omit any condition an
  earlier (pinned/higher) scene already guarantees**. Once a pinned "projector →
  close" sits on top, lower scenes needn't re-test the projector; once a pinned
  "closed dusk→sunrise" sits above the daytime scenes, those needn't gate on the
  daytime window. Prefer that cascade over repeating a guard on every scene.
- A final scene with an empty `when` is the catch-all default (it always sorts
  last).

---

## 4. The `when` map

`when` maps a condition name to its predicate:

```jsonc
"when": {
  "time_of_day": [ { "period": "evening" } ],
  "people":      { "quant": "any", "where": "home" }
}
```

- **A scene matches only when every listed condition matches** (logical AND
  across conditions). A missing key, or a `null` value, is a **wildcard** for that
  condition.
- The key must be one of the built-in condition names below (see
  `condition-reference.generated.md` for the authoritative list). Unknown keys are
  rejected at save time.
- The value is that condition's **predicate**; `null` always means "no
  constraint".

| Condition | What it tests | Advanced? |
|---|---|---|
| `state` | entity state/attributes, with `and`/`or`/`not` groups and `for` durations | no |
| `people` | who is (not) home / in a named zone | no |
| `occupancy` | presence/occupancy/motion `binary_sensor`s active or vacant | no |
| `day` | weekday / day-of-month / date / date-range / workday / holiday | no |
| `time_of_day` | a named period, a clock range, or a sun-anchored range | no |
| `weather` | current weather group and numeric thresholds | no |
| `sun` | the sun's elevation and/or compass azimuth | no |
| `lux` | ambient-light sensors inside a lux band | no |
| `unavailable` | any listed entity is unavailable/unknown/missing | **yes** |
| `script` | a HA script returning `{match: bool}` | **yes** |
| `template` | a Jinja template rendered to a bool | **yes** |

> `unavailable`, `script` and `template` are **advanced** — prefer the others
> unless the user needs a fallback guard (`unavailable`) or logic the built-ins
> cannot express (`script`/`template`).

**The exact JSON for every predicate field** — types, defaults, allowed values,
validation — lives in **[condition-reference.generated.md](condition-reference.generated.md)**
(generated from source). The curated, intent-first way to author them is in
**[conditions-cookbook.md](conditions-cookbook.md)** — that is what an AI should
read first.

---

## 5. ActionSpec

Each scene runs a list of actions when it wins. An action is one HA service call:

```jsonc
{
  "service": "light.turn_on",          // "domain.service"; required; MUST be exposed
  "entity_ids": ["light.living_room"], // the call target
  "params": { "brightness_pct": 15 }   // service field values; merged with exposed defaults
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `service` | string | yes | `"domain.service"` (must contain a `.`). **Must be an EXPOSED service** (see below). |
| `entity_ids` | string[] | yes (may be empty) | Entities to target; each a non-empty string. Empty list = no entity target. |
| `params` | object | yes (may be empty) | Field name → value. Merged over the exposed-action defaults at execution; scene `params` win. |

**Only EXPOSED services are valid.** Ambience will not call arbitrary HA
services: the user curates an exposed-actions list, and an action whose `service`
is not exposed is logged and **skipped** at execution. Use only `service` ids
present in the AI bundle's exposed services. Full semantics, the defaults-merge
rule, the built-in `ambience.*` services, and worked examples are in
**[actions.md](actions.md)**; the generated field schemas are in
**[action-reference.generated.md](action-reference.generated.md)**.

---

## 6. Validation (save-time)

The panel runs `ambience/validate` (shape-only, no save) on import before
preview. A block must satisfy all of:

- `config` is an object; `scenes` a list; each scene an object.
- Scene names unique (case-insensitive, trimmed) within a `(category, name)`.
- `description`/`category`, if present, are strings.
- `when` is an object; each key a known condition; each non-null predicate passes
  that condition's validation (see the generated reference for per-field rules).
- `actions` is a list; each `service` a `"domain.service"` string; `entity_ids` a
  list of non-empty strings; `params` an object.
- `apply`, if present, is `"once"` or `"always"`.

`params` keys are **not** whitelisted against the exposed action's visible
fields — extra params are allowed and sent at execution.

### Category coercion caveat

At save time, a scene with a missing or **unknown** `category` is silently
reassigned to `general`. The envelope's `category` block avoids this: declare the
category so the import creates it and the scene keeps its group. Always either
declare `category` in the envelope or reference an existing category id.

---

## 7. The AI bundle (what the user gives you)

The user downloads this from the Ambience panel (**AI** tab → *Download AI bundle*)
and pastes it to you. It is assembled live from their install, so every id in it is
real. Author against it. Shape:

```jsonc
{
  "ambience_ai_bundle": 1,
  "catalog": {
    "areas":  [ { "area_id": "living_room", "name": "Living Room" } ],
    "floors": [ { "floor_id": "ground", "name": "Ground floor" } ],
    // Flat list. `area_id` is the entity's own area, else its device's area, else null.
    "entities": [
      { "entity_id": "light.living_room", "name": "Living Room", "domain": "light",
        "device_class": null, "area_id": "living_room", "state": "off" }
    ]
  },
  "actions": {
    // The services the user exposed to Ambience — the ONLY valid `actions[].service`.
    "exposed": [ { "id": "light.turn_on", "label": "Turn on",
                   "visible_fields": ["brightness_pct"], "defaults": {} } ],
    // Per-exposed-service field schema (best-effort; absent for bare on/off helpers).
    "schemas": { "light.turn_on": { "fields": { "brightness_pct": {} }, "target": {} } }
  },
  "definitions": {
    "categories": [ { "id": "general", "name": "General", "icon": "mdi:home", "color": "blue-grey" } ],
    // Named vocabularies: builtins + the user's custom + hidden. Reference by id.
    "periods":    { "builtins": { "evening": {} }, "custom": {}, "hidden": [] },
    "lux_ranges": { "builtins": { "dark": {}, "dim": {} }, "custom": {}, "hidden": [] }
  },
  "config": { /* the current redacted store: areas/floors/house scenes, conditions, … */ },
  "traces": [ /* recent per-(scope,category) evaluations — see diagnostics-guide.md */ ]
}
```

Presence/location data is redacted (person/device_tracker ids, zones, templates,
workday/weather entities), so don't expect those values; reference people by the
`person.*` ids you can still see in `catalog.entities`.

---

## Glossary

- **Scope** — `house` / a `floor` / an `area`. Holds an ordered scene list; the
  surface a scene activates on.
- **Category** — a global named grouping of scenes (id + name + icon + color).
  Every scene belongs to exactly one. Within one `(scope, category)`, the first
  matching scene wins in the engine's derived order — more-specific (subset)
  scenes first, pinned scenes forced to the top. See
  [How scenes are chosen](#how-scenes-are-chosen).
- **Scene** — `{name, description?, category, when, actions, apply?}`.
- **Predicate** — the value of a condition inside `when`. `null`/absent =
  wildcard.
- **Exposed service / action** — a HA service the user has allowed Ambience to
  call. Only these are valid in `actions[].service`.
- **AI bundle** — the file the user downloads from the Ambience panel: their real
  areas/floors/entities, exposed services + field schemas, custom periods / lux
  ranges / weather groups / categories, current config (redacted), and recent
  traces. Always author against the bundle so entity ids and vocabulary are real.
