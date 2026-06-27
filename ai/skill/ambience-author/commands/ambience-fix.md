---
description: Diagnose why an Ambience scene didn't fire by reading its traces, and emit a corrected single-scope import block.
---

# /ambience-fix — diagnose & fix an Ambience scene

Guide the user from "a scene isn't firing" to a corrected Ambience **import
block**. Use the `ambience-author` skill's `reference/diagnostics-guide.md` (and
the cookbook for the corrected predicate).

## Step 1 — Get the AI bundle

Ask the user to download it from the Ambience panel (Diagnose with AI →
**Download AI bundle**). It carries the **current config** and **recent traces** —
both needed to diagnose.

## Step 2 — Find the relevant trace(s)

Identify the failing **unit** by `scope_kind` / `scope_id` + `category`. Each
trace records one evaluation: a `cause`, an `outcome`, and a per-scene
`explanation`.

## Step 3 — Read the outcome first

- `skipped_switch_off` / `skipped_scope_disabled` → **not a config bug.** The
  scope's Ambience pause switch is off, or the scope is disabled. Tell the user to
  turn it back on / re-enable the scope. No import needed.
- `skipped_unavailable` → the trigger was an entity dropping out; nothing applied
  by design.
- `no_match` → no scene matched; the **conditions** are the problem (Step 4).
- `acted` / `debounced` with the **wrong** scene winning → scene
  **ordering/specificity** is off; the winner is under-constrained or mis-ordered.

## Step 4 — Pin the failing predicate

In `explanation.scenes`, open the scene that should have won. Find the predicate
with `passed: false`. Its `detail` usually names the exact value that blocked it
(e.g. `want <10 lx; Living Room: 240 lx ✗`). That's your culprit.

- A too-strict band/threshold → widen or change it (see the cookbook).
- An unintended constraint → remove that condition key (missing = wildcard).
- A shadowing scene that wins too often → add the missing constraint to the
  over-broad scene, or reorder most-specific first.

> `people` / `template` `detail` strings and `person.*` / `device_tracker.*` ids
> may be **redacted** in the bundle — you can still diagnose from `passed`, the
> condition keys, and non-presence predicates.

## Step 5 — Emit the corrected block

```yaml
ambience_import: 1
scope: { kind: <same as failing unit> }
mode: merge
scenes:
  - name: <SAME name as the broken scene>   # same name → upserts in place, no duplicate
    category: <same category>
    when: { ...only the fixed predicate(s) changed... }
    actions: [ ... ]
```

- Keep `scope` and `category` matching the failing unit.
- Reuse the **exact scene name** with `mode: merge` so it replaces the broken
  scene rather than adding a duplicate.
- Change only what the trace pinned down.

## Step 6 — Hand off

Tell the user to import the corrected block via the panel's **Import** view
(preview → confirm), then re-test. If it still fails, ask for a fresh bundle and
repeat — the new trace will show the next blocker.
