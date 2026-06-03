import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/people-predicate-input";
import "../frontend/src/views/condition-input";
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
    "light.kitchen": { entity_id: "light.kitchen", state: "on", attributes: {} },
  },
} as unknown as Record<string, unknown>;

async function mount(value: PeoplePredicate | null = null): Promise<any> {
  const el: any = document.createElement("ambience-people-predicate-input");
  el.hass = hass;
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

describe("ambience-people-predicate-input", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("lists only person.* entities as people options", async () => {
    el = await mount();
    const persons = el._persons().map((p: { id: string }) => p.id);
    expect(persons).toEqual(["person.alice", "person.bob"]);
  });

  test("lists only zone.* entities as location options", async () => {
    el = await mount();
    const zones = el._zones().map((z: { id: string }) => z.id);
    expect(zones).toEqual(["zone.home", "zone.work"]);
  });

  // --- mode dropdown structure ---------------------------------------------

  test("mode dropdown offers exactly the 6 modes in order", async () => {
    el = await mount();
    const opts = Array.from(modeSelect(el).querySelectorAll<HTMLOptionElement>("option")).map(
      (o) => o.value,
    );
    expect(opts).toEqual(["everybody", "anybody", "nobody", "any", "all", "none"]);
  });

  test("mode dropdown shows the shortened 'X of:' labels", async () => {
    el = await mount();
    const labels = Array.from(modeSelect(el).querySelectorAll<HTMLOptionElement>("option")).map(
      (o) => o.textContent?.trim(),
    );
    expect(labels).toEqual(["Everybody", "Anybody", "Nobody", "Any of:", "All of:", "None of:"]);
  });

  test("no 'matches anyone' hint text exists anywhere", async () => {
    // Even with an empty 'X of:' selection, the old accommodation hint is gone.
    el = await mount({ who: [], quant: "any", where: "home" });
    expect(el.shadowRoot.textContent).not.toContain("matches anyone");
    expect(el.shadowRoot.textContent).not.toContain("No one selected");
  });

  test("fresh state shows Everybody + Home and does not emit on mount", async () => {
    let emitted = false;
    el = document.createElement("ambience-people-predicate-input");
    el.hass = hass;
    el.value = null;
    el.addEventListener("value-changed", () => (emitted = true));
    document.body.appendChild(el);
    await el.updateComplete;
    expect(modeSelect(el).value).toBe("everybody");
    expect(whereSelect(el).value).toBe("home");
    expect(emitted).toBe(false);
  });

  // --- the 5 modes emit the right predicate --------------------------------

  test("Everybody emits {quant: everyone} with no who", async () => {
    el = await mount({ quant: "nobody", where: "home" });
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    await setMode(el, "everybody");
    expect(emitted?.quant).toBe("everyone");
    expect(emitted?.who).toBeUndefined();
    expect(emitted?.where).toBe("home");
  });

  test("Anybody emits {quant: any} with no who", async () => {
    el = await mount({ quant: "everyone", where: "home" });
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    await setMode(el, "anybody");
    expect(emitted?.quant).toBe("any");
    expect(emitted?.who).toBeUndefined();
    expect(emitted?.where).toBe("home");
  });

  test("Nobody emits {quant: nobody} with no who", async () => {
    el = await mount();
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    await setMode(el, "nobody");
    expect(emitted?.quant).toBe("nobody");
    expect(emitted?.who).toBeUndefined();
  });

  test("Any of these people emits {quant: any, who:[...]}", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    await setMode(el, "any");
    expect(emitted?.quant).toBe("any");
    expect(emitted?.who).toEqual(["person.alice"]);
  });

  test("All of these people emits {quant: everyone, who:[...]}", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    await setMode(el, "all");
    expect(emitted?.quant).toBe("everyone");
    expect(emitted?.who).toEqual(["person.alice"]);
  });

  test("None of these people emits {quant: nobody, who:[...]}", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    await setMode(el, "none");
    expect(emitted?.quant).toBe("nobody");
    expect(emitted?.who).toEqual(["person.alice"]);
  });

  // --- person checklist visibility -----------------------------------------

  test("person checklist is hidden for Everybody, Anybody and Nobody", async () => {
    el = await mount({ quant: "everyone", where: "home" });
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]")).toHaveLength(0);
    await setMode(el, "anybody");
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]")).toHaveLength(0);
    await setMode(el, "nobody");
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]")).toHaveLength(0);
  });

  test("person checklist is shown for the three '…these people' modes", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]").length).toBeGreaterThan(0);
    await setMode(el, "all");
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]").length).toBeGreaterThan(0);
    await setMode(el, "none");
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]").length).toBeGreaterThan(0);
  });

  test("toggling a person on adds it to who", async () => {
    el = await mount({ who: [], quant: "any", where: "home" });
    // Switch into a 'these people' mode so the checklist renders.
    await setMode(el, "any");
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const cb = el.shadowRoot.querySelector("input[type=checkbox]");
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
    expect(emitted?.who).toContain("person.alice");
  });

  test("unchecking the last person stays in the 'X of:' mode with empty who and shows the error", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    expect(modeSelect(el).value).toBe("any");
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const cb = el.shadowRoot.querySelector("input[type=checkbox]:checked") as HTMLInputElement;
    cb.checked = false;
    cb.dispatchEvent(new Event("change"));
    await el.updateComplete;
    // Checklist still rendered (mode did not collapse to a base mode).
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]").length).toBeGreaterThan(0);
    // Emitted predicate keeps the `who` key, now an empty array.
    expect(emitted?.who).toEqual([]);
    expect("who" in (emitted ?? {})).toBe(true);
    // The empty-selection error is now shown.
    const err = el.shadowRoot.querySelector(".field-error") as HTMLElement | null;
    expect(err?.textContent ?? "").toContain("Select at least one person");
  });

  test("selecting a person clears the empty-selection error message", async () => {
    el = await mount({ who: [], quant: "any", where: "home" });
    await setMode(el, "any");
    // Error message shown while empty (container always present).
    let err = el.shadowRoot.querySelector(".field-error") as HTMLElement | null;
    expect(err).not.toBeNull();
    expect(err?.textContent ?? "").toContain("Select at least one person");
    const cb = el.shadowRoot.querySelector("input[type=checkbox]") as HTMLInputElement;
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
    await el.updateComplete;
    // Container still present (reserves space) but the message is gone.
    err = el.shadowRoot.querySelector(".field-error") as HTMLElement | null;
    expect(err).not.toBeNull();
    expect((err?.textContent ?? "").trim()).toBe("");
  });

  test("switching into 'Any of:' from a base mode defaults to all persons selected", async () => {
    el = await mount({ quant: "everyone", where: "home" });
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    await setMode(el, "any");
    // Everyone is ticked by default — a valid, fully-selected starting point.
    expect(emitted?.quant).toBe("any");
    expect(emitted?.who).toEqual(["person.alice", "person.bob"]);
    expect("who" in (emitted ?? {})).toBe(true);
    // The checklist renders fully checked and shows NO error.
    const boxes = Array.from(
      el.shadowRoot.querySelectorAll<HTMLInputElement>("input[type=checkbox]"),
    );
    expect(boxes.every((c) => c.checked)).toBe(true);
    const err = el.shadowRoot.querySelector(".field-error") as HTMLElement | null;
    expect((err?.textContent ?? "").trim()).toBe("");
  });

  test("switching into 'Any of:' from a fresh (null) state defaults to all persons", async () => {
    el = await mount(null);
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    await setMode(el, "any");
    expect(emitted?.who).toEqual(["person.alice", "person.bob"]);
  });

  test("deselecting every person in an 'X of:' mode shows the error and emits empty who", async () => {
    // Start from a base mode, switch in (defaults to all), then untick all.
    el = await mount({ quant: "everyone", where: "home" });
    await setMode(el, "any");
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const boxes = Array.from(
      el.shadowRoot.querySelectorAll<HTMLInputElement>("input[type=checkbox]:checked"),
    );
    for (const cb of boxes) {
      cb.checked = false;
      cb.dispatchEvent(new Event("change"));
      await el.updateComplete;
    }
    expect(emitted?.who).toEqual([]);
    expect("who" in (emitted ?? {})).toBe(true);
    const err = el.shadowRoot.querySelector(".field-error") as HTMLElement | null;
    expect(err?.textContent ?? "").toContain("Select at least one person");
  });

  test("the error-line container is always present in an 'X of:' mode (reserves space)", async () => {
    // Valid (non-empty) selection: container present, text blank.
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    let err = el.shadowRoot.querySelector(".field-error") as HTMLElement | null;
    expect(err).not.toBeNull();
    expect((err?.textContent ?? "").trim()).toBe("");
    el.remove();
    // Empty selection: container present, message shown.
    el = await mount({ who: [], quant: "any", where: "home" });
    err = el.shadowRoot.querySelector(".field-error") as HTMLElement | null;
    expect(err).not.toBeNull();
    expect(err?.textContent ?? "").toContain("Select at least one person");
  });

  test("loaded { who:['person.alice'], quant:'any' } round-trips to exactly Alice (not everybody)", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    const checkedBoxes = Array.from(
      el.shadowRoot.querySelectorAll<HTMLInputElement>("input[type=checkbox]:checked"),
    );
    expect(checkedBoxes).toHaveLength(1);
  });

  test("changing location while in an empty 'these people' mode keeps the mode and updates where", async () => {
    el = await mount({ who: [], quant: "any", where: "home" });
    await setMode(el, "any");
    expect(modeSelect(el).value).toBe("any");
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const where = whereSelect(el);
    where.value = "zone.work";
    where.dispatchEvent(new Event("change"));
    await el.updateComplete;
    // The `who` key (empty array) survived the where change: still in an 'X of:' mode.
    expect(modeSelect(el).value).toBe("any");
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]").length).toBeGreaterThan(0);
    expect(emitted?.where).toBe("zone.work");
  });

  // --- round-trips ----------------------------------------------------------

  test("round-trips a base mode (Everybody) into the controls", async () => {
    el = await mount({ quant: "everyone", where: "home" });
    expect(modeSelect(el).value).toBe("everybody");
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]")).toHaveLength(0);
  });

  test("round-trips Nobody base mode", async () => {
    el = await mount({ quant: "nobody", where: "home" });
    expect(modeSelect(el).value).toBe("nobody");
  });

  test("round-trips 'Any of these people' (quant any + non-empty who)", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    expect(modeSelect(el).value).toBe("any");
  });

  test("round-trips a present-but-empty who:[] into its 'X of:' mode (not a base mode)", async () => {
    el = await mount({ who: [], quant: "any", where: "home" });
    // Presence of the `who` key (even empty) means an 'X of:' mode, by quant.
    expect(modeSelect(el).value).toBe("any");
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]").length).toBeGreaterThan(0);
  });

  test("round-trips who:[] with quant everyone/nobody into All/None of:", async () => {
    el = await mount({ who: [], quant: "everyone", where: "home" });
    expect(modeSelect(el).value).toBe("all");
    el.remove();
    el = await mount({ who: [], quant: "nobody", where: "home" });
    expect(modeSelect(el).value).toBe("none");
  });

  test("quant 'any' with no who key round-trips to Anybody (base mode, not Any of: nor Everybody)", async () => {
    el = await mount({ quant: "any", where: "home" });
    expect(modeSelect(el).value).toBe("anybody");
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]")).toHaveLength(0);
  });

  test("round-trips 'None of these people' (quant nobody + non-empty who)", async () => {
    el = await mount({ who: ["person.alice"], quant: "nobody", where: "home" });
    expect(modeSelect(el).value).toBe("none");
  });

  test("round-trips a 'these people' mode and ticks selected people", async () => {
    el = await mount({ who: ["person.alice"], quant: "everyone", where: "home" });
    expect(modeSelect(el).value).toBe("all");
    const checked = Array.from(
      el.shadowRoot.querySelectorAll<HTMLInputElement>("input[type=checkbox]"),
    ).filter((c: HTMLInputElement) => c.checked);
    expect(checked).toHaveLength(1);
  });

  // --- location dropdown ----------------------------------------------------

  test("emits where when the location changes", async () => {
    el = await mount();
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const where = whereSelect(el);
    where.value = "zone.work";
    where.dispatchEvent(new Event("change"));
    expect(emitted?.where).toBe("zone.work");
  });

  test("location options include home/zones but not away nor zone.home", async () => {
    el = await mount();
    const options = Array.from(whereSelect(el).querySelectorAll<HTMLOptionElement>("option")).map(
      (o: HTMLOptionElement) => o.value,
    );
    expect(options).toContain("home");
    expect(options).toContain("zone.work");
    expect(options).not.toContain("away");
    expect(options).not.toContain("zone.home");
  });

  // --- is-at / is-not-at negate toggle -------------------------------------

  test("negate toggle offers 'Is at' (false) and 'Is not at' (true)", async () => {
    el = await mount();
    const opts = Array.from(negateSelect(el).querySelectorAll<HTMLOptionElement>("option"));
    expect(opts.map((o) => o.value)).toEqual(["false", "true"]);
    expect(opts.map((o) => o.textContent?.trim())).toEqual(["Is at", "Is not at"]);
  });

  test("fresh state defaults to 'Is at' (negate false)", async () => {
    el = await mount();
    expect(negateSelect(el).value).toBe("false");
  });

  test("selecting 'Is not at' emits negate true", async () => {
    el = await mount({ quant: "everyone", where: "home" });
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const neg = negateSelect(el);
    neg.value = "true";
    neg.dispatchEvent(new Event("change"));
    expect(emitted?.negate).toBe(true);
    expect(emitted?.where).toBe("home");
  });

  test("selecting 'Is at' from a negated value clears negate", async () => {
    el = await mount({ quant: "everyone", where: "home", negate: true });
    expect(negateSelect(el).value).toBe("true");
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const neg = negateSelect(el);
    neg.value = "false";
    neg.dispatchEvent(new Event("change"));
    // negate omitted (or false) when "Is at".
    expect(emitted?.negate ?? false).toBe(false);
  });

  test("the is-at/is-not-at toggle is hidden for Nobody and None of:", async () => {
    // Base mode Nobody.
    el = await mount({ quant: "nobody", where: "home" });
    expect(negateSelect(el)).toBeNull();
    el.remove();
    // None of: (X-of mode with quant nobody).
    el = await mount({ who: ["person.alice"], quant: "nobody", where: "home" });
    expect(negateSelect(el)).toBeNull();
  });

  test("the hidden toggle is replaced by static 'is at' text for Nobody/None of:", async () => {
    el = await mount({ quant: "nobody", where: "home" });
    expect(negateSelect(el)).toBeNull();
    expect(el.shadowRoot.querySelector(".negate-static")?.textContent?.trim()).toBe("is at");
    el.remove();
    el = await mount({ who: ["person.alice"], quant: "nobody", where: "home" });
    expect(el.shadowRoot.querySelector(".negate-static")?.textContent?.trim()).toBe("is at");
  });

  test("no static 'is at' text when the toggle is shown", async () => {
    el = await mount({ quant: "everyone", where: "home" });
    expect(el.shadowRoot.querySelector(".negate-static")).toBeNull();
  });

  test("the is-at/is-not-at toggle still renders for Everybody/Anybody/Any of:/All of:", async () => {
    el = await mount({ quant: "everyone", where: "home" });
    expect(negateSelect(el)).not.toBeNull();
    await setMode(el, "anybody");
    expect(negateSelect(el)).not.toBeNull();
    el.remove();
    el = await mount({ who: ["person.alice"], quant: "any", where: "home" });
    expect(negateSelect(el)).not.toBeNull();
    await setMode(el, "all");
    expect(negateSelect(el)).not.toBeNull();
  });

  test("switching from an 'Is not at' Anybody into Nobody resets negate (no negate:true)", async () => {
    el = await mount({ quant: "any", where: "home", negate: true });
    expect(negateSelect(el)?.value).toBe("true");
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    await setMode(el, "nobody");
    expect(emitted?.quant).toBe("nobody");
    expect(emitted?.negate ?? false).toBe(false);
    expect("negate" in (emitted ?? {})).toBe(false);
    // Toggle no longer rendered.
    expect(negateSelect(el)).toBeNull();
  });

  test("switching from an 'Is not at' Any of: into None of: resets negate", async () => {
    el = await mount({ who: ["person.alice"], quant: "any", where: "home", negate: true });
    expect(negateSelect(el)?.value).toBe("true");
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    await setMode(el, "none");
    expect(emitted?.quant).toBe("nobody");
    expect(emitted?.negate ?? false).toBe(false);
    expect("negate" in (emitted ?? {})).toBe(false);
    expect(negateSelect(el)).toBeNull();
  });

  test("a Nobody predicate that carries negate:true ignores it (no toggle shown)", async () => {
    el = await mount({ quant: "nobody", where: "home", negate: true });
    expect(negateSelect(el)).toBeNull();
    // Changing where must not resurrect negate.
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const where = whereSelect(el);
    where.value = "zone.work";
    where.dispatchEvent(new Event("change"));
    expect(emitted?.where).toBe("zone.work");
    expect(emitted?.negate ?? false).toBe(false);
  });

  test("negate round-trips into the toggle and survives a where change", async () => {
    el = await mount({ quant: "everyone", where: "home", negate: true });
    expect(negateSelect(el).value).toBe("true");
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const where = whereSelect(el);
    where.value = "zone.work";
    where.dispatchEvent(new Event("change"));
    expect(emitted?.where).toBe("zone.work");
    expect(emitted?.negate).toBe(true);
  });

  // --- for duration ---------------------------------------------------------

  test("round-trips a non-zero `for` into the native h/m/s inputs and emits {h,m,s}", async () => {
    el = await mount({ quant: "everyone", where: "home", for: { h: 0, m: 10, s: 0 } });
    const inputs = Array.from(
      el.shadowRoot.querySelectorAll<HTMLInputElement>("[data-field=for] input[type=number]"),
    );
    expect(inputs).toHaveLength(3);
    const [h, m, s] = inputs as HTMLInputElement[];
    expect(h.value).toBe("0");
    expect(m.value).toBe("10");
    expect(s.value).toBe("0");

    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    // Change the hours input; emitted `for` must keep the {h,m,s} shape.
    h.value = "2";
    h.dispatchEvent(new Event("change"));
    expect(emitted?.for).toEqual({ h: 2, m: 10, s: 0 });
    // Guard against a key-name coercion bug ({hours,minutes,seconds}).
    expect(Object.keys(emitted?.for ?? {}).sort()).toEqual(["h", "m", "s"]);
  });

  // --- condition-input dispatch ----------------------------------------------

  test("condition-input dispatches to the people widget for input=people_predicate", async () => {
    const di: any = document.createElement("ambience-condition-input");
    di.condition = {
      name: "people",
      description: "",
      predicate_help: "",
      input: "people_predicate",
      priority: 75,
    };
    di.value = null;
    di.hass = hass;
    document.body.appendChild(di);
    await di.updateComplete;
    expect(di.shadowRoot.querySelector("ambience-people-predicate-input")).not.toBeNull();
    di.remove();
  });
});
