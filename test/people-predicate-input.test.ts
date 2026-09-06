import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/people-predicate-input";
import type { PeoplePredicate } from "../frontend/src/types";

// Minimal hass stub exposing two persons and one (non-home) zone.
const hass = {
  states: {
    "person.alice": {
      entity_id: "person.alice",
      state: "home",
      attributes: { friendly_name: "Alice" },
    },
    "person.bob": {
      entity_id: "person.bob",
      state: "not_home",
      attributes: { friendly_name: "Bob" },
    },
    "zone.work": { entity_id: "zone.work", state: "0", attributes: { friendly_name: "Work" } },
    "zone.home": { entity_id: "zone.home", state: "1", attributes: { friendly_name: "Home" } },
  },
} as unknown as Record<string, unknown>;

// Hass stub with NO person entities (to test the empty-persons path).
const hassNoPeople = {
  states: {
    "zone.work": { entity_id: "zone.work", state: "0", attributes: { friendly_name: "Work" } },
    "zone.home": { entity_id: "zone.home", state: "1", attributes: { friendly_name: "Home" } },
  },
} as unknown as Record<string, unknown>;

async function mount(
  value: PeoplePredicate | null = null,
  overHass: Record<string, unknown> = hass,
): Promise<any> {
  const el: any = document.createElement("ambience-people-predicate-input");
  el.hass = overHass;
  el.value = value;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function modeSelect(el: any): HTMLSelectElement {
  return el.shadowRoot.querySelector("select.mode");
}

function whereSelect(el: any): HTMLSelectElement {
  return el.shadowRoot.querySelector("select.where");
}

function negateSelect(el: any): HTMLSelectElement {
  return el.shadowRoot.querySelector("select.negate");
}

async function setMode(el: any, mode: string): Promise<void> {
  const sel = modeSelect(el);
  sel.value = mode;
  sel.dispatchEvent(new Event("change"));
  await el.updateComplete;
}

describe("ambience-people-predicate-input — branch coverage", () => {
  let el: any;
  afterEach(() => el?.remove());

  // -------------------------------------------------------------------------
  // _who() — line 122: value?.who when value is non-null but who is absent
  // Branch 6: the `??` fallback side (who key absent → returns [])
  // -------------------------------------------------------------------------

  test("_who() returns [] when value has no who key", async () => {
    el = await mount({ quant: "everyone", where: "home" }); // no `who` key
    expect(el._who()).toEqual([]);
  });

  // -------------------------------------------------------------------------
  // _mode() — line 139: `_hasWhoKey()` true but quant is undefined
  // Branch 11: `quant ?? "any"` defaults to "any" in X-of mode
  // -------------------------------------------------------------------------

  test("_mode() with who:[] and missing quant defaults to 'any' mode", async () => {
    // Construct a value with who present but quant absent — _mode falls back
    // to the "any" arm of the X-of switch.
    el = await mount({ who: [] } as PeoplePredicate);
    expect(modeSelect(el).value).toBe("any");
  });

  // -------------------------------------------------------------------------
  // _hasFor() — line 160: the falsy `dur` branch (dur is null/undefined)
  // Branches 22 & 23: !!dur is false → return false immediately
  // -------------------------------------------------------------------------

  test("_hasFor() returns false when for is null", async () => {
    el = await mount({ quant: "everyone", where: "home", for: null });
    // _hasFor(null) must be false — the `for` key should be absent from emits.
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const w = whereSelect(el);
    w.value = "zone.work";
    w.dispatchEvent(new Event("change"));
    expect(emitted?.for).toBeUndefined();
  });

  test("_hasFor() returns false when all h/m/s are zero", async () => {
    el = await mount({ quant: "everyone", where: "home", for: { h: 0, m: 0, s: 0 } });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const w = whereSelect(el);
    w.value = "zone.work";
    w.dispatchEvent(new Event("change"));
    // All-zero duration must NOT be emitted.
    expect(emitted?.for).toBeUndefined();
  });

  // -------------------------------------------------------------------------
  // _emitMode() — line 188: cur.negate true but quant is NOT "nobody"
  // Branch 30: the `out.negate = true` branch (negate preserved across mode switch)
  // -------------------------------------------------------------------------

  test("_emitMode() preserves negate:true when switching to a non-negative-quant mode", async () => {
    el = await mount({ quant: "everyone", where: "home", negate: true });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    await setMode(el, "anybody");
    expect(emitted?.negate).toBe(true);
  });

  // -------------------------------------------------------------------------
  // _emitMode() — line 194: _lastSelected.length > 0 branch
  // Branch 34: switching into X-of mode restores a remembered prior selection
  // after a _togglePerson call has populated _lastSelected.
  // -------------------------------------------------------------------------

  test("_emitMode() repopulates lastSelected when switching from base mode after prior X-of use", async () => {
    // Start in "any of:" mode with both people, then tick only Alice to populate
    // _lastSelected = ["person.alice", "person.bob"] (via _togglePerson keeping
    // whatever is ticked). Then go to base mode, then back to "any" — the
    // _lastSelected path fires because _hasWhoKey is false but _lastSelected is non-empty.
    el = await mount({ who: [], quant: "any", where: "home" });

    // Tick Alice — sets _lastSelected = ["person.alice"].
    const [aliceCb] = el.shadowRoot.querySelectorAll<HTMLInputElement>("input[type=checkbox]");
    aliceCb.checked = true;
    aliceCb.dispatchEvent(new Event("change"));
    await el.updateComplete;
    // Now go to a base mode (no who key).
    await setMode(el, "everybody");
    // Now switch back into "any" — _lastSelected = ["person.alice"], _hasWhoKey false.
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    await setMode(el, "any");
    // _lastSelected was ["person.alice"], so that selection must be repopulated.
    expect(emitted?.who).toEqual(["person.alice"]);
  });

  // -------------------------------------------------------------------------
  // _emitMode() — line 205: `this._hasFor(cur.for)` in _emitMode
  // Branch 35: for is non-zero — carried into the emitted mode
  // -------------------------------------------------------------------------

  test("_emitMode() carries a non-zero for duration when switching modes", async () => {
    el = await mount({ quant: "everyone", where: "home", for: { h: 0, m: 5, s: 0 } });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    await setMode(el, "anybody");
    expect(emitted?.for).toEqual({ h: 0, m: 5, s: 0 });
  });

  // -------------------------------------------------------------------------
  // _setWhere() — line 223: _hasFor branch (for present and non-zero)
  // Branch 43: for key is carried through a where change
  // -------------------------------------------------------------------------

  test("_setWhere() carries a non-zero for duration", async () => {
    el = await mount({ quant: "everyone", where: "home", for: { h: 1, m: 0, s: 0 } });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const w = whereSelect(el);
    w.value = "zone.work";
    w.dispatchEvent(new Event("change"));
    expect(emitted?.for).toEqual({ h: 1, m: 0, s: 0 });
  });

  // -------------------------------------------------------------------------
  // _setNegate() — lines 229-232: multiple uncovered branches
  //   Branch 45/46 (line 229): negate:true path → out.negate = true
  //   Branch 48 (line 231): _hasWhoKey() true in _setNegate
  //   Branch 49 (line 232): _hasFor() in _setNegate
  // -------------------------------------------------------------------------

  test("_setNegate() sets negate:true when toggling to 'Is not at' in X-of mode", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const neg = negateSelect(el);
    neg.value = "true";
    neg.dispatchEvent(new Event("change"));
    // negate flag set, and who array preserved.
    expect(emitted?.negate).toBe(true);
    expect(emitted?.who).toEqual(["person.alice"]);
  });

  test("_setNegate() carries a non-zero for duration", async () => {
    el = await mount({ quant: "everyone", where: "home", for: { h: 0, m: 0, s: 30 } });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const neg = negateSelect(el);
    neg.value = "true";
    neg.dispatchEvent(new Event("change"));
    expect(emitted?.for).toEqual({ h: 0, m: 0, s: 30 });
  });

  // -------------------------------------------------------------------------
  // _togglePerson() — lines 241-246: uncovered branches
  //   Branch 54 (line 241): effectiveNegate true in _togglePerson (negate carried)
  //   Branch 55 (line 242): effectiveNegate false (already covered implicitly)
  //   Branch 56 (line 245): effectiveNegate is true → out.negate = true
  //   Branch 57 (line 246): _hasFor() is true in _togglePerson
  // -------------------------------------------------------------------------

  test("_togglePerson() carries negate:true when toggling a person while negated", async () => {
    el = await mount({ who: [], quant: "any", where: "home", negate: true });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const cb = el.shadowRoot.querySelector("input[type=checkbox]") as HTMLInputElement;
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
    expect(emitted?.negate).toBe(true);
    expect(emitted?.who).toContain("person.alice");
  });

  test("_togglePerson() carries a non-zero for duration", async () => {
    el = await mount({
      who: ["person.alice"],
      quant: "any",
      where: "home",
      for: { h: 0, m: 3, s: 0 },
    });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const unchecked = el.shadowRoot.querySelector(
      "input[type=checkbox]:not(:checked)",
    ) as HTMLInputElement;
    unchecked.checked = true;
    unchecked.dispatchEvent(new Event("change"));
    expect(emitted?.for).toEqual({ h: 0, m: 3, s: 0 });
  });

  // -------------------------------------------------------------------------
  // _setFor() — lines 252-254: uncovered branches
  //   Branch 60/61 (line 252): quant/where defaults when value is null → _cur() = {}
  //   Branch 62 (line 253): effectiveNegate is true in _setFor
  //   Branch 63 (line 254): _hasWhoKey() true in _setFor
  // -------------------------------------------------------------------------

  test("_setFor() uses default quant/where when value is null", async () => {
    el = await mount(null);
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const [hInput] = el.shadowRoot
      .querySelector("ambience-for-duration")!
      .shadowRoot!.querySelectorAll<HTMLInputElement>("input[type=number]");
    hInput.value = "1";
    hInput.dispatchEvent(new Event("change"));
    expect(emitted?.quant).toBe("everyone"); // default
    expect(emitted?.where).toBe("home"); // default
    expect(emitted?.for).toEqual({ h: 1, m: 0, s: 0 });
  });

  test("_setFor() carries negate:true when toggling duration while negated", async () => {
    el = await mount({ quant: "everyone", where: "home", negate: true });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const inputs = el.shadowRoot
      .querySelector("ambience-for-duration")!
      .shadowRoot!.querySelectorAll<HTMLInputElement>("input[type=number]");
    const [, mInput] = inputs;
    mInput.value = "10";
    mInput.dispatchEvent(new Event("change"));
    expect(emitted?.negate).toBe(true);
    expect(emitted?.for).toEqual({ h: 0, m: 10, s: 0 });
  });

  test("_setFor() keeps who key when in X-of mode", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const [hInput] = el.shadowRoot
      .querySelector("ambience-for-duration")!
      .shadowRoot!.querySelectorAll<HTMLInputElement>("input[type=number]");
    hInput.value = "2";
    hInput.dispatchEvent(new Event("change"));
    expect(emitted?.who).toEqual(["person.alice"]);
    expect(emitted?.for).toEqual({ h: 2, m: 0, s: 0 });
  });

  // -------------------------------------------------------------------------
  // _renderPeople() — line 331-333: no persons tracked (hint shown)
  // Branch 76: persons.length === 0 → "No people tracked" hint
  // -------------------------------------------------------------------------

  test("shows 'No people tracked' hint when hass has no person entities", async () => {
    el = await mount({ who: [], quant: "any", where: "home" }, hassNoPeople);
    const hint = el.shadowRoot.querySelector(".hint");
    expect(hint).not.toBeNull();
    expect(hint?.textContent?.trim()).toContain("No people tracked");
    // No checkboxes rendered when persons list is empty.
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]")).toHaveLength(0);
  });

  // -------------------------------------------------------------------------
  // _renderFor() — line 448: `Number(value) || 0` fallback (NaN → 0)
  // Branch 98: the `|| 0` branch fires when Number("") or NaN
  // -------------------------------------------------------------------------

  test("_renderFor() treats non-numeric input as 0 via the || 0 fallback", async () => {
    el = await mount({ quant: "everyone", where: "home" });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const [hInput] = el.shadowRoot
      .querySelector("ambience-for-duration")!
      .shadowRoot!.querySelectorAll<HTMLInputElement>("input[type=number]");
    // Simulate a non-numeric value (e.g. an empty field) which produces NaN → || 0.
    hInput.value = "";
    hInput.dispatchEvent(new Event("change"));
    // h must be 0 (from || 0), not NaN.
    expect(emitted?.for).toBeUndefined(); // all-zero → _hasFor false → not emitted
  });

  // -------------------------------------------------------------------------
  // _setFor() — the host-side handler behind <ambience-for-duration>
  // (the h:m:s editor itself is covered in test/for-duration.test.ts)
  // -------------------------------------------------------------------------

  test("_setFor() emits the correct {h,m,s} predicate", async () => {
    el = await mount({ quant: "everyone", where: "home" });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    el._setFor({ h: 1, m: 30, s: 0 });
    expect(emitted?.for).toEqual({ h: 1, m: 30, s: 0 });
  });

  test("_setFor() with all zeros emits no for key", async () => {
    el = await mount({ quant: "everyone", where: "home" });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    el._setFor({ h: 0, m: 0, s: 0 });
    // all-zero → _hasFor false → for key absent
    expect(emitted?.for).toBeUndefined();
  });

  // -------------------------------------------------------------------------
  // for_mode ("at least" / "less than")
  // -------------------------------------------------------------------------

  test("_setFor() with less_than mode round-trips for_mode", async () => {
    el = await mount({ quant: "everyone", where: "home" });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    el._setFor({ h: 0, m: 5, s: 0, mode: "less_than" });
    expect(emitted?.for).toEqual({ h: 0, m: 5, s: 0 });
    expect(emitted?.for_mode).toBe("less_than");
  });

  test("_setFor() drops for_mode when the mode is at_least", async () => {
    el = await mount({ quant: "everyone", where: "home", for: { h: 0, m: 5, s: 0 } });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    el._setFor({ h: 0, m: 5, s: 0, mode: "at_least" });
    expect(emitted?.for).toEqual({ h: 0, m: 5, s: 0 });
    expect(emitted?.for_mode).toBeUndefined();
  });

  test("_setFor() drops for_mode when the duration is zeroed", async () => {
    el = await mount({ quant: "everyone", where: "home", for: { h: 0, m: 5, s: 0 } });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    el._setFor({ h: 0, m: 0, s: 0, mode: "less_than" });
    expect(emitted?.for).toBeUndefined();
    expect(emitted?.for_mode).toBeUndefined();
  });

  test("an existing less_than for_mode survives a where change", async () => {
    el = await mount({
      quant: "everyone",
      where: "home",
      for: { h: 0, m: 5, s: 0 },
      for_mode: "less_than",
    });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const w = whereSelect(el);
    w.value = "zone.work";
    w.dispatchEvent(new Event("change"));
    expect(emitted?.for).toEqual({ h: 0, m: 5, s: 0 });
    expect(emitted?.for_mode).toBe("less_than");
  });

  // -------------------------------------------------------------------------
  // negate-static label — line 473: shown instead of toggle for Nobody/None of:
  // Already tested in condition-input-people but needed here for branch coverage.
  // -------------------------------------------------------------------------

  test("negate-static 'is at' label is rendered for Nobody mode (not the toggle)", async () => {
    el = await mount({ quant: "nobody", where: "home" });
    const label = el.shadowRoot.querySelector(".negate-static");
    expect(label).not.toBeNull();
    expect(label?.textContent?.trim()).toBe("is at");
  });

  // -------------------------------------------------------------------------
  // _mode() line 145: `return "none"` arm in the X-of switch
  // -------------------------------------------------------------------------

  test("_mode() returns 'none' for who:[] with quant nobody", async () => {
    el = await mount({ who: [], quant: "nobody", where: "home" });
    expect(modeSelect(el).value).toBe("none");
  });

  // -------------------------------------------------------------------------
  // _emitMode() line 193: `out.who = [...this._who()]` — _hasWhoKey() true path
  // -------------------------------------------------------------------------

  test("_emitMode() keeps existing who array when _hasWhoKey() is true", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    // Switch between X-of modes: both have who key, so the array is kept.
    await setMode(el, "all");
    expect(emitted?.who).toEqual(["person.alice"]);
    expect(emitted?.quant).toBe("everyone");
  });

  // -------------------------------------------------------------------------
  // _emitMode() lines 202-203: default-to-all-persons path
  // (no _hasWhoKey, no _lastSelected → use all persons)
  // -------------------------------------------------------------------------

  test("_emitMode() defaults who to all persons when switching from base mode for the first time", async () => {
    // Fresh null value: no who key and _lastSelected is empty.
    el = await mount(null);
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    await setMode(el, "all");
    expect(emitted?.who).toEqual(["person.alice", "person.bob"]);
  });

  // -------------------------------------------------------------------------
  // _setWhere() — a stored predicate with no `quant` key defaults to "any",
  // matching how the engine evaluates a missing quant.
  // -------------------------------------------------------------------------

  test("_setWhere() uses default quant 'any' when value has no quant key", async () => {
    el = await mount({ where: "home" } as PeoplePredicate); // no quant
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const w = whereSelect(el);
    w.value = "zone.work";
    w.dispatchEvent(new Event("change"));
    expect(emitted?.quant).toBe("any");
    expect(emitted?.where).toBe("zone.work");
  });

  test("_mode() with a stored predicate that has no quant shows Anybody", async () => {
    el = await mount({ where: "home" } as PeoplePredicate);
    expect(modeSelect(el).value).toBe("anybody");
  });

  // -------------------------------------------------------------------------
  // _togglePerson() — unchecking a person (on=false → filter path)
  // -------------------------------------------------------------------------

  test("_togglePerson() removes a person when unchecking (filter path)", async () => {
    el = await mount({ who: ["person.alice", "person.bob"], quant: "any", where: "home" });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    // Uncheck Alice (first checked box).
    const checkedBoxes = el.shadowRoot.querySelectorAll<HTMLInputElement>(
      "input[type=checkbox]:checked",
    );
    const aliceCb = checkedBoxes[0];
    aliceCb.checked = false;
    aliceCb.dispatchEvent(new Event("change"));
    expect(emitted?.who).toEqual(["person.bob"]);
  });

  // -------------------------------------------------------------------------
  // _renderFor() — line 451: `|| 0` fallback for minutes input
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // _setWhere() line 221: effectiveNegate true (negate carried through where change)
  // _setWhere() line 222: _hasWhoKey() true (who preserved through where change)
  // -------------------------------------------------------------------------

  test("_setWhere() carries negate:true and preserves who array", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home", negate: true });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const w = whereSelect(el);
    w.value = "zone.work";
    w.dispatchEvent(new Event("change"));
    expect(emitted?.negate).toBe(true);
    expect(emitted?.who).toEqual(["person.alice"]);
    expect(emitted?.where).toBe("zone.work");
  });

  // -------------------------------------------------------------------------
  // _setNegate() lines 229: quant/where absent → uses defaults
  // -------------------------------------------------------------------------

  test("_setNegate() uses default quant/where when value has no quant or where", async () => {
    el = await mount({} as PeoplePredicate); // no quant, no where
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const neg = negateSelect(el);
    neg.value = "true";
    neg.dispatchEvent(new Event("change"));
    expect(emitted?.quant).toBe("any"); // a stored value with no quant defaults to "any"
    expect(emitted?.where).toBe("home"); // ?? "home" fallback
    expect(emitted?.negate).toBe(true);
  });

  // -------------------------------------------------------------------------
  // _togglePerson() lines 241-242: quant/where absent → uses defaults
  // -------------------------------------------------------------------------

  test("_togglePerson() uses default quant 'any' and where 'home' when absent", async () => {
    // Mount with who present but no quant/where.
    el = await mount({ who: [] } as PeoplePredicate);
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const cb = el.shadowRoot.querySelector("input[type=checkbox]") as HTMLInputElement;
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
    expect(emitted?.quant).toBe("any"); // ?? "any" fallback
    expect(emitted?.where).toBe("home"); // ?? "home" fallback
  });

  test("_renderFor() treats non-numeric minutes input as 0 via the || 0 fallback", async () => {
    el = await mount({ quant: "everyone", where: "home", for: { h: 1, m: 0, s: 0 } });
    let emitted: PeoplePredicate | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate }>).detail.value;
    });
    const [, mInput] = el.shadowRoot
      .querySelector("ambience-for-duration")!
      .shadowRoot!.querySelectorAll<HTMLInputElement>("input[type=number]");
    mInput.value = "abc"; // non-numeric → NaN → || 0
    mInput.dispatchEvent(new Event("change"));
    // m becomes 0; h is preserved from existing `d`.
    expect(emitted?.for).toEqual({ h: 1, m: 0, s: 0 });
  });
});
