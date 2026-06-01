# Script Predicate Input — Field Labels & Triggers Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix five UX/correctness issues in the script matcher editor: raw field names, unfriendly descriptors, misleading trigger suggestions, no manual entity picker, and an unreachable Form tab for no-fields scripts.

**Architecture:** All changes are in the `<ambience-script-predicate-input>` Lit component plus the deletion of one now-unused websocket command. Field labels/helpers are driven through `<ha-form>`'s `computeLabel`/`computeHelper` (matching the existing `day-predicate-input` pattern). Triggers become an `entity` multi-selector (matching `target-picker`). The suggestion path is deleted end-to-end (frontend component, api.ts, backend websocket, tests).

**Tech Stack:** Lit + TypeScript (frontend, vitest/jsdom tests); Home Assistant Python integration (pytest, websocket tests).

---

## File Structure

- **Modify** `frontend/src/views/script-predicate-input.ts` — the component (labels, helpers, drop suggestions, entity picker, form-tab reachability).
- **Modify** `frontend/src/api.ts` — remove `getScriptReferencedEntities`.
- **Modify** `custom_components/ambience/websocket.py` — remove `_ws_script_referenced_entities`, its registration, and the command-name entry.
- **Modify** `test/script-predicate-input.test.ts` — new/updated frontend tests (lives at repo-root `test/`, imports from `../frontend/src/...`).
- **Modify** `tests/test_websocket.py` — delete the two `referenced_entities` backend tests.

**Reference patterns to mirror (read before starting):**
- `frontend/src/views/day-predicate-input.ts:247-268` — `_computeFieldHelper` / `_computeFieldLabel` bound arrow methods.
- `frontend/src/views/target-picker.ts:81-104` — `<ha-form>` with `selector.entity.multiple` and jsdom fallback.
- `frontend/src/summary.ts:55-70` — `paramLabel`; `frontend/src/i18n.ts:26-29` — `humanizeId`; `frontend/src/summary.ts:257-259` — `humanizeFieldId`.

**Commands — all run from the repo root** (`vitest.config.ts`, `package.json`, and `esbuild.config.mjs` all live at repo root, NOT in `frontend/`):
- Frontend tests: `npm test -- test/script-predicate-input.test.ts` (add `-t "<name>"` to filter). `npm test` runs `vitest run`.
- Typecheck: `npm run check` (`tsc --noEmit`). Build/bundle: `npm run build` → outputs `custom_components/ambience/frontend/ambience-panel.js` (there is no `frontend/dist`).
- Coverage (thresholds: lines/functions/statements 90, branches 85): `npm run coverage`.

---

## Task 1: Friendly field labels in the Arguments form

**Files:**
- Modify: `frontend/src/views/script-predicate-input.ts` (`_argsSchema`, `_renderArgs`, imports)
- Test: `test/script-predicate-input.test.ts`

- [ ] **Step 1: Write the failing test**

Add to the `describe("ambience-script-predicate-input — YAML mode", ...)` file (new `describe` block at end of file):

```typescript
describe("ambience-script-predicate-input — field labels", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("_fieldLabel prefers the field's friendly name alias", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: {
        target_brightness: { name: "Target brightness", selector: { number: {} } },
      } } } } },
    );
    expect(el._fieldLabel({ name: "target_brightness" })).toBe("Target brightness");
  });

  test("_fieldLabel falls back to a humanized raw key when no alias", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: {
        target_brightness: { selector: { number: {} } },
      } } } } },
    );
    expect(el._fieldLabel({ name: "target_brightness" })).toBe("Target brightness");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run `npm test -- test/script-predicate-input.test.ts -t "field labels"`
Expected: FAIL — `el._fieldLabel is not a function`.

- [ ] **Step 3: Write minimal implementation**

In `frontend/src/views/script-predicate-input.ts`, add the import near the top (after the existing imports):

```typescript
import { humanizeFieldId } from "../summary.js";
```

Add this bound method to the class (place it next to `_argsSchema`):

```typescript
/** Friendly label for an args field: prefers the script field's `name`
 *  alias, else humanizes the raw key. Mirrors summary.ts:paramLabel. */
_fieldLabel = (schema: { name: string }): string => {
  const fields = this._fieldsFor(
    this.value && typeof this.value === "object" ? this.value.script : null,
  );
  const alias = fields?.[schema.name]?.name;
  return typeof alias === "string" && alias ? alias : humanizeFieldId(schema.name);
};
```

- [ ] **Step 4: Run test to verify it passes**

Run `npm test -- test/script-predicate-input.test.ts -t "field labels"`
Expected: PASS.

- [ ] **Step 5: Wire `computeLabel` into the args ha-form**

In `_renderArgs`, the `ha-form` branch, add `.computeLabel`:

```typescript
    if (customElements.get("ha-form")) {
      return html`<ha-form
        .hass=${this.hass}
        .schema=${schema}
        .data=${args}
        .computeLabel=${this._fieldLabel}
        @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
          e.stopPropagation();
          this._updateArgs(e.detail.value);
        }}
      ></ha-form>`;
    }
```

- [ ] **Step 6: Run the full file to confirm nothing regressed**

Run `npm test -- test/script-predicate-input.test.ts`
Expected: PASS (all tests).

- [ ] **Step 7: Commit**

```bash
git add frontend/src/views/script-predicate-input.ts test/script-predicate-input.test.ts
git commit -m "fix(script-predicate): show friendly field labels in args form"
```

---

## Task 2: Friendly descriptors via computeHelper

**Files:**
- Modify: `frontend/src/views/script-predicate-input.ts` (`_argsSchema`, `_renderArgs`)
- Test: `test/script-predicate-input.test.ts`

- [ ] **Step 1: Write the failing test**

Add to the `field labels` describe block:

```typescript
  test("_fieldHelper returns the field description", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: {
        temp: { description: "Target temperature in °C", selector: { number: {} } },
      } } } } },
    );
    expect(el._fieldHelper({ name: "temp" })).toBe("Target temperature in °C");
  });

  test("_argsSchema no longer carries a description suffix", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: {
        temp: { description: "Target temperature", selector: { number: {} } },
      } } } } },
    );
    expect(el._argsSchema()[0].description).toBeUndefined();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run `npm test -- test/script-predicate-input.test.ts -t "field labels"`
Expected: FAIL — `el._fieldHelper is not a function` and the schema still has a `description`.

- [ ] **Step 3: Write minimal implementation**

Add the bound method next to `_fieldLabel`:

```typescript
/** Helper text for an args field: the script field's `description`, or "". */
_fieldHelper = (schema: { name: string }): string => {
  const fields = this._fieldsFor(
    this.value && typeof this.value === "object" ? this.value.script : null,
  );
  const desc = fields?.[schema.name]?.description;
  return typeof desc === "string" ? desc : "";
};
```

Change `_argsSchema` to stop emitting `description`:

```typescript
  _argsSchema(): HaFormSchema[] {
    const fields = this._fieldsFor(this.value && typeof this.value === "object" ? this.value.script : null);
    if (!fields) return [];
    return Object.entries(fields).map(([name, f]) => ({
      name,
      required: f.required,
      selector: f.selector ?? { text: {} },
    } as HaFormSchema));
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run `npm test -- test/script-predicate-input.test.ts -t "field labels"`
Expected: PASS.

- [ ] **Step 5: Wire `computeHelper` into the args ha-form**

In `_renderArgs`, the `ha-form` branch, add `.computeHelper` beside `.computeLabel`:

```typescript
        .computeLabel=${this._fieldLabel}
        .computeHelper=${this._fieldHelper}
```

- [ ] **Step 6: Run the full file**

Run `npm test -- test/script-predicate-input.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/views/script-predicate-input.ts test/script-predicate-input.test.ts
git commit -m "fix(script-predicate): render field descriptions via computeHelper"
```

---

## Task 3: Remove the suggestions path (frontend component)

**Files:**
- Modify: `frontend/src/views/script-predicate-input.ts`
- Test: `test/script-predicate-input.test.ts`

- [ ] **Step 1: Write the failing test**

Add a new describe block at the end of the file:

```typescript
describe("ambience-script-predicate-input — no suggestions", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("does not expose suggestion state or load suggestions", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: { x: { selector: { text: {} } } } } } } },
    );
    expect(el._loadSuggestions).toBeUndefined();
    expect(el._suggested).toBeUndefined();
    expect(el.shadowRoot.querySelector(".suggested")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run `npm test -- test/script-predicate-input.test.ts -t "no suggestions"`
Expected: FAIL — `_loadSuggestions`/`_suggested` still defined, `.suggested` may render.

- [ ] **Step 3: Remove suggestion code**

In `frontend/src/views/script-predicate-input.ts`:

a. Delete the import line:
```typescript
import { getScriptReferencedEntities } from "../api.js";
```

b. Delete the two state fields:
```typescript
  @state() private _suggested: string[] = [];
  @state() private _suggestedFor: string | null = null;
```

c. Delete the entire `_loadSuggestions` method (lines ~96-108).

d. In `willUpdate`, delete the two lines that load suggestions:
```typescript
      const current = this.value && typeof this.value === "object" ? this.value.script : null;
      void this._loadSuggestions(current);
```
(Leave the `if (this._mode === "form") this._yamlText = ...` line intact.)

e. In `connectedCallback`, delete:
```typescript
    const current = this.value && typeof this.value === "object" ? this.value.script : null;
    void this._loadSuggestions(current);
```

f. In `_renderTriggers`, delete the `suggestions` const and the `${suggestions.length ? ... : ""}` block (the `.suggested` div). Also remove the now-unused first line:
```typescript
    const suggestions = this._suggested.filter((e) => !current.includes(e));
```
(Task 5 reworks the rest of `_renderTriggers`; for now leave the current-chips block.)

- [ ] **Step 4: Run test to verify it passes**

Run `npm test -- test/script-predicate-input.test.ts -t "no suggestions"`
Expected: PASS.

- [ ] **Step 5: Run the full file (some suggestion tests may now fail — delete them)**

Run `npm test -- test/script-predicate-input.test.ts`
If any existing tests reference `_suggested`, `_loadSuggestions`, `getScriptReferencedEntities`, or `suggest-` test hooks, delete those tests (they cover removed behavior).
Expected after cleanup: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/views/script-predicate-input.ts test/script-predicate-input.test.ts
git commit -m "refactor(script-predicate): drop misleading trigger suggestions"
```

---

## Task 4: Remove `getScriptReferencedEntities` from api.ts

**Files:**
- Modify: `frontend/src/api.ts`

- [ ] **Step 1: Delete the function**

Remove this export from `frontend/src/api.ts` (currently ~lines 332-338):

```typescript
export async function getScriptReferencedEntities(
  hass: HassConnection,
  script: string,
): Promise<{ entities: string[] }> {
  return hass.callWS({ type: "ambience/script/referenced_entities", script });
}
```

- [ ] **Step 2: Verify no remaining references**

Run (from repo root): `rg -n "getScriptReferencedEntities" frontend/src test`
Expected: no matches.

- [ ] **Step 3: Typecheck + rebuild bundle**

Run `npm run check` then `npm run build`
Expected: typecheck passes with no TS errors; build rebuilds `custom_components/ambience/frontend/ambience-panel.js` (required per project convention).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/api.ts custom_components/ambience/frontend/ambience-panel.js
git commit -m "refactor(api): remove getScriptReferencedEntities"
```

---

## Task 5: Manual entity picker for triggers (form-mode only)

**Files:**
- Modify: `frontend/src/views/script-predicate-input.ts` (`_renderTriggers`, `render`)
- Test: `test/script-predicate-input.test.ts`

- [ ] **Step 1: Write the failing test**

Add a new describe block:

```typescript
describe("ambience-script-predicate-input — triggers picker", () => {
  let el: any;
  afterEach(() => el?.remove());

  const withScript = {
    script: "script.foo",
    args: {},
    triggers: ["light.kitchen"],
  } as ScriptPredicate;
  const hass = { services: { script: { foo: { fields: { x: { selector: { text: {} } } } } } } };

  test("removing a trigger chip emits the shortened list", async () => {
    el = await mount(withScript, hass);
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    const removeBtn = el.shadowRoot.querySelector('[data-test="trigger-light.kitchen"] .x');
    removeBtn.click();
    expect(detail.value.triggers).toEqual([]);
  });

  test("typing an entity_id in the fallback input adds it", async () => {
    el = await mount({ script: "script.foo", args: {}, triggers: [] }, hass);
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    const input = el.shadowRoot.querySelector('[data-test="trigger-add-input"]');
    input.value = "binary_sensor.front_door";
    input.dispatchEvent(new Event("change"));
    expect(detail.value.triggers).toEqual(["binary_sensor.front_door"]);
  });

  test("triggers section is not rendered in YAML mode", async () => {
    el = await mount(withScript, hass);
    el._setMode("yaml");
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".triggers")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run `npm test -- test/script-predicate-input.test.ts -t "triggers picker"`
Expected: FAIL — no `trigger-add-input`; triggers still render in YAML mode.

- [ ] **Step 3: Replace `_renderTriggers`**

Replace the whole `_renderTriggers` method with:

```typescript
  private _renderTriggers() {
    const current = this._triggers;
    return html`
      <div class="section triggers">
        <h4>${localize(this.hass, "ui.script_triggers", "Triggers")}</h4>
        <p class="help">
          ${localize(
            this.hass,
            "ui.script_triggers_help",
            "Re-evaluate this rule when these entities change. A script is opaque, so templated references may be missed — add any it depends on.",
          )}
        </p>
        ${this._renderTriggerPicker(current)}
      </div>
    `;
  }

  /* v8 ignore start -- ha-form path (real HA only) */
  private _renderTriggerPicker(current: string[]) {
    if (customElements.get("ha-form")) {
      const schema = [{ name: "triggers", selector: { entity: { multiple: true } } }];
      return html`<ha-form
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ triggers: current }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { triggers?: string[] } }>) => {
          e.stopPropagation();
          this._setTriggers(e.detail.value.triggers ?? []);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    // jsdom fallback: chips with remove + a text input to add by entity_id.
    return html`
      <div class="chips">
        ${current.length === 0
          ? html`<span class="muted">${localize(this.hass, "ui.script_triggers_none", "No triggers")}</span>`
          : current.map(
              (eid) => html`<span class="chip" data-test=${`trigger-${eid}`}>
                ${eid}
                <button type="button" class="x" title="Remove" @click=${() => this._removeTrigger(eid)}>×</button>
              </span>`,
            )}
      </div>
      <input
        data-test="trigger-add-input"
        placeholder="entity_id"
        @change=${(e: Event) => {
          const input = e.target as HTMLInputElement;
          const eid = input.value.trim();
          if (eid) this._addTrigger(eid);
          input.value = "";
        }}
      />
    `;
  }
```

- [ ] **Step 4: Gate triggers to form mode in `render`**

In `render`, change the triggers line from:

```typescript
      ${picked ? this._renderTriggers() : ""}
```

to:

```typescript
      ${picked && this._mode === "form" ? this._renderTriggers() : ""}
```

- [ ] **Step 5: Run test to verify it passes**

Run `npm test -- test/script-predicate-input.test.ts -t "triggers picker"`
Expected: PASS.

- [ ] **Step 6: Run the full file**

Run `npm test -- test/script-predicate-input.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/views/script-predicate-input.ts test/script-predicate-input.test.ts
git commit -m "feat(script-predicate): manual entity picker for triggers"
```

---

## Task 6: Make the Form tab always reachable

**Files:**
- Modify: `frontend/src/views/script-predicate-input.ts` (`connectedCallback`, `render` Form button)
- Test: `test/script-predicate-input.test.ts`

- [ ] **Step 1: Write the failing test**

Add a new describe block:

```typescript
describe("ambience-script-predicate-input — form tab reachable", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("no-fields script defaults to form mode", async () => {
    el = await mount(
      { script: "script.bare", args: {} },
      { services: { script: { bare: {} } } },
    );
    expect(el._mode).toBe("form");
  });

  test("Form button is enabled for a no-fields script with valid yaml", async () => {
    el = await mount(
      { script: "script.bare", args: {} },
      { services: { script: { bare: {} } } },
    );
    const buttons = [...el.shadowRoot.querySelectorAll(".tabs button")];
    const formBtn = buttons.find((b: any) => b.textContent?.trim() === "Form");
    expect(formBtn.disabled).toBe(false);
  });

  test("can switch back to form after going to YAML (no fields)", async () => {
    el = await mount(
      { script: "script.bare", args: {} },
      { services: { script: { bare: {} } } },
    );
    el._setMode("yaml");
    expect(el._mode).toBe("yaml");
    el._setMode("form");
    expect(el._mode).toBe("form");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run `npm test -- test/script-predicate-input.test.ts -t "form tab reachable"`
Expected: FAIL — no-fields script starts in `yaml`; Form button disabled.

- [ ] **Step 3: Remove the auto-switch in `connectedCallback`**

In `connectedCallback`, delete these lines:

```typescript
    // Scripts with no fields can only be edited as YAML.
    const picked = this.value && typeof this.value === "object" ? this.value.script : null;
    const fields = this._fieldsFor(picked);
    if (picked && (!fields || Object.keys(fields).length === 0)) {
      this._mode = "yaml";
    }
```

The method keeps the `this._yamlText = yamlDump(this.value ?? {});` line.

- [ ] **Step 4: Drop `!hasFields` from the Form button disabled binding**

In `render`, change the Form button's disabled binding from:

```typescript
            ?disabled=${!hasFields || this._yamlError !== null}
```

to:

```typescript
            ?disabled=${this._yamlError !== null}
```

- [ ] **Step 5: Run test to verify it passes**

Run `npm test -- test/script-predicate-input.test.ts -t "form tab reachable"`
Expected: PASS.

- [ ] **Step 6: Run the full file — fix any stale expectations**

Run `npm test -- test/script-predicate-input.test.ts`
If a prior test asserted that a no-fields script starts in YAML mode or that the Form button is disabled when there are no fields, update it to the new behavior (form-mode default; Form disabled only on YAML error). The existing test "Form tab is disabled while YAML is invalid" (sets invalid YAML then expects refusal) stays valid.
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/views/script-predicate-input.ts test/script-predicate-input.test.ts
git commit -m "fix(script-predicate): keep Form tab reachable for no-fields scripts"
```

---

## Task 7: Remove the backend `referenced_entities` websocket command

**Files:**
- Modify: `custom_components/ambience/websocket.py`
- Test: `tests/test_websocket.py`

- [ ] **Step 1: Delete the backend tests first**

In `tests/test_websocket.py`, delete both functions (lines ~1687-1707):
- `test_script_referenced_entities_unknown_script_is_empty`
- `test_script_referenced_entities_returns_sorted`

- [ ] **Step 2: Run to confirm they're gone**

Run (from repo root): `python -m pytest tests/test_websocket.py -k referenced_entities -q`
Expected: no tests collected (0 selected).

- [ ] **Step 3: Remove the command from websocket.py**

In `custom_components/ambience/websocket.py`:

a. Delete the command-name list entry:
```python
    "ambience/script/referenced_entities",
```

b. Delete the registration line:
```python
    websocket_api.async_register_command(hass, _ws_script_referenced_entities)
```

c. Delete the entire `_ws_script_referenced_entities` function, including its decorators (the `@websocket_api.require_admin` / `@websocket_api.websocket_command({...})` / `@websocket_api.async_response` block at lines ~1202-1223).

- [ ] **Step 4: Verify no remaining references**

Run (from repo root): `rg -n "referenced_entities|_ws_script_referenced_entities" custom_components tests`
Expected: no matches.

- [ ] **Step 5: Run the backend websocket suite**

Run (from repo root): `python -m pytest tests/test_websocket.py -q`
Expected: PASS (no errors from the removed command).

- [ ] **Step 6: Commit**

```bash
git add custom_components/ambience/websocket.py tests/test_websocket.py
git commit -m "refactor(websocket): remove script referenced_entities command"
```

---

## Task 8: Final verification

- [ ] **Step 1: Typecheck, build, coverage**

Run `npm run check && npm run build && npm run coverage`
Expected: typecheck clean; bundle rebuilt at `custom_components/ambience/frontend/ambience-panel.js`; coverage thresholds (lines/functions/statements 90, branches 85) still met. Stage the rebuilt bundle if changed.

- [ ] **Step 2: Full frontend test run**

Run `npm test -- test/script-predicate-input.test.ts`
Expected: PASS, clean output.

- [ ] **Step 3: Backend lint + targeted tests**

Run (from repo root): `ruff check . && ruff format --check . && python -m pytest tests/test_websocket.py tests/test_matchers_script.py -q`
Expected: PASS. If `ruff format --check` reports changes, run `ruff format .`, re-check, and amend the relevant commit.

- [ ] **Step 4: Commit any remaining bundle artifact**

Stage explicit paths only — do NOT `git add -A` (untracked `node_modules` is not gitignored here):

```bash
git add custom_components/ambience/frontend/ambience-panel.js
git commit -m "chore: rebuild bundle after script-predicate fixes" || echo "nothing to commit"
```

---

## Self-Review Notes

- **Spec coverage:** Task 1 → friendly labels; Task 2 → descriptors; Tasks 3+4+7 → drop suggestions (frontend, api, backend); Task 5 → manual entity picker + form-mode gating; Task 6 → Form tab reachable. All five spec items covered.
- **Type consistency:** `_fieldLabel`/`_fieldHelper` take `{ name: string }` (ha-form computeLabel/Helper signature, matching `day-predicate-input`). `_setTriggers`/`_addTrigger`/`_removeTrigger` already exist and operate on `string[]`. Entity selector emits `{ triggers: string[] }`.
- **Note on test file location:** the frontend test lives at repo-root `test/script-predicate-input.test.ts` and imports from `../frontend/src/...`; run via `npm test` from the repo root.
