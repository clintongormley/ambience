# Script predicate input — field labels & triggers fixes

Date: 2026-06-01
Component: `frontend/src/views/script-predicate-input.ts` (`<ambience-script-predicate-input>`)

## Problem

The script matcher editor has five issues:

1. **Raw field names.** The Arguments form shows raw script field keys
   (e.g. `target_brightness`) instead of HA's friendly `name` alias.
2. **Unfriendly descriptors.** Field help text is shoved into
   `description: { suffix }`, which `<ha-form>` does not render as helper text.
3. **Misleading trigger suggestions.** "Suggested" triggers come from the
   script's `referenced_entities` — the entities the script *acts on*, not the
   ones it reads. Suggesting "re-evaluate when the light you just turned on
   changes" is backwards and looks unrelated to the script.
4. **No way to add arbitrary watch entities.** Triggers can only be added by
   clicking a suggestion or editing YAML; there is no entity picker.
5. **Form tab unreachable for no-fields scripts.** `connectedCallback` forces
   YAML mode when a script declares no fields, and the Form button is disabled
   whenever there are no fields — so switching to YAML traps the user there.

## Changes

### 1. Friendly field labels (form mode)
Pass `computeLabel` to the Arguments `<ha-form>`. For each schema row return the
script field's `name` alias if present, else `humanizeFieldId(rawKey)` — the
same resolution `summary.ts:paramLabel` already uses. The schema `name` stays
the raw key (it is the args-dict key); only the displayed label changes.

### 2. Friendly descriptors
Remove the `description: { suffix: f.description }` construction from
`_argsSchema()`. Instead pass `computeHelper` to the same `<ha-form>`, returning
the field's `description`. That is the channel ha-form renders helper text
through.

### 3. Remove the suggestions path (frontend + backend)
Nothing else consumes `referenced_entities`, so delete it end to end:
- Frontend component: `_suggested`, `_suggestedFor`, `_loadSuggestions`, the
  `getScriptReferencedEntities` import and call, and the "Suggested:" render
  block in `_renderTriggers`.
- `frontend/src/api.ts`: remove `getScriptReferencedEntities`.
- Backend `custom_components/ambience/websocket.py`: remove
  `_ws_script_referenced_entities`, its `async_register_command` call, and the
  `ambience/script/referenced_entities` command-name entry.
- Remove the corresponding backend websocket test.

### 4. Manual entity picker for triggers
Replace the chips-only + suggestions UI with an entity picker bound to
`triggers: string[]`:
- **Real HA:** `<ha-form>` with
  `schema: [{ name: "triggers", selector: { entity: { multiple: true } } }]`,
  `.data = { triggers }`, emitting the new array on `value-changed`. ha-form
  renders the selected entities as removable chips natively and provides
  search/filter.
- **jsdom fallback (no `ha-form`):** keep removable trigger chips and add a text
  `<input>` that appends a typed `entity_id` on change, so headless tests can
  add and remove triggers.

### 5. Form tab always reachable
- Drop `!hasFields` from the Form button's `disabled` binding — disable it only
  while `_yamlError !== null`.
- Remove the `connectedCallback` auto-switch to YAML for no-fields scripts;
  always default to form mode.
- Keep the Arguments section gated by `hasFields` (no empty `<ha-form>`), but
  render the triggers picker whenever in form mode.
- Gate the triggers section to **form mode only** (today it also renders beside
  the YAML editor, double-editing `triggers`).

## Data model

Unchanged: `ScriptPredicate = null | { script: string; args?: Record<string,
unknown>; triggers?: string[] }`. Triggers remain a list of entity_id strings;
the entity selector reads and writes that list directly.

## Testing (TDD)

Frontend, in `test/script-predicate-input.test.ts` — each written test-first:
- Field label resolves to `field.name` when present; falls back to humanized raw
  key otherwise.
- Helper text is wired via `computeHelper` from `field.description`.
- No suggestion state/markup remains; `getScriptReferencedEntities` is gone.
- Triggers: add a typed entity (fallback input) and remove a chip update the
  emitted `triggers` array.
- Form tab is reachable for a no-fields script (default mode is form; Form button
  not disabled when YAML is valid). Existing "disabled while YAML invalid" test
  stays green.

Backend:
- Delete the `referenced_entities` websocket test.

The `/* v8 ignore */` real-HA ha-form branches stay covered through the jsdom
fallback paths.

## Out of scope
- No change to the script-call/matching backend (`matchers/script.py`).
- No change to the `ScriptPredicate` shape or YAML schema.
