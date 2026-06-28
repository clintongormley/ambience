---
description: Author Ambience scenes from a plain-English description and an AI bundle, producing a single-scope import block.
---

# /ambience-create — author Ambience scenes

Guide the user from a plain-English request to an Ambience **import block** they
paste into the panel's Import view. Use the `ambience-author` skill's reference
files (`reference/conditions-cookbook.md`, `reference/schema.md`,
`reference/actions.md`, `reference/import-format.md`).

## Step 1 — Get the AI bundle

Ask the user to download it from the Ambience panel (Settings → **AI** tab →
**Download AI bundle**) and paste or upload it. You need it for real entity ids,
exposed services, and the user's vocabulary (categories, periods, lux ranges,
weather groups). Don't finalise ids without it.

## Step 2 — Confirm intent and scope

Restate the request in one sentence and confirm the **scope**:

- a single room → `scope: { kind: area, id: <area_id> }`
- a floor → `scope: { kind: floor, id: <floor_id> }`
- the whole home → `scope: { kind: house }` (no id)

If the request spans several rooms, plan **one block per scope** (or a single
floor-scoped block if they share a floor).

## Step 3 — Map intent to conditions

For each part of the intent, find the matching condition in
`reference/conditions-cookbook.md` and write its predicate with the user's real
ids. Remember:

- Multiple conditions in one scene are **ANDed** (all must hold).
- For **OR** / "otherwise", write **separate scenes**, most-specific first.
- A missing condition key (or `null`) is a wildcard.
- Prefer built-in conditions; reserve `unavailable` / `script` / `template`.

## Step 4 — Choose actions

- Use **only services that appear in the bundle's exposed list.** An unexposed
  service is silently skipped at runtime.
- Set `params` per the bundle's field schema for that service.
- Prefer the safe `ambience.*` services (`ambience.turn_on/off`,
  `ambience.cover_safe_*`) for on/off/cover control when exposed.
- `entity_ids` targets real entities from the bundle.

## Step 5 — Wrap in an import block

```yaml
ambience_import: 1
scope: { kind: area, id: <area_id> }
mode: merge                                   # safe default: upsert by (category, name)
category: { id: <slug>, name: <Name>, icon: mdi:<icon>, color: <color-id> }
scenes:
  - name: <Scene name>
    category: <slug>
    when: { ... }
    actions:
      - { service: <exposed.service>, entity_ids: [<entity_id>], params: { ... } }
```

- Declare the **category** so a new group is created (not coerced to General).
- `mode: merge` keeps the user's other scenes untouched.
- Emit one block per scope; label each (e.g. a comment naming the room).

## Step 6 — Hand off

Tell the user to:

1. Open the Ambience panel → Settings → **AI** tab.
2. Paste or upload the block.
3. Preview (adds / updates / removes, new vs unknown categories) and **confirm**.

Remind them every import is reversible via the panel's undo/redo history. You do
**not** apply anything yourself.
