import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/people-predicate-input";
import "../frontend/src/views/matcher-input";
import type { PeoplePredicate } from "../frontend/src/types";

// Minimal hass stub exposing two persons and one (non-home) zone.
const hass = {
  states: {
    "person.alice": { entity_id: "person.alice", state: "home", attributes: { friendly_name: "Alice" } },
    "person.bob": { entity_id: "person.bob", state: "not_home", attributes: { friendly_name: "Bob" } },
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

  test("mode dropdown offers exactly the 5 modes in order", async () => {
    el = await mount();
    const opts = Array.from(
      modeSelect(el).querySelectorAll<HTMLOptionElement>("option"),
    ).map((o) => o.value);
    expect(opts).toEqual(["everybody", "nobody", "any", "all", "none"]);
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

  test("person checklist is hidden for Everybody and Nobody", async () => {
    el = await mount({ quant: "everyone", where: "home" });
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

  test("unchecking the last person stays in the 'these people' mode with empty who and shows the hint", async () => {
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
    // Emitted predicate has empty/absent who.
    expect(emitted?.who ?? []).toEqual([]);
    // The empty-selection hint is now shown.
    const hints = Array.from(el.shadowRoot.querySelectorAll<HTMLElement>(".hint")).map(
      (h: HTMLElement) => h.textContent ?? "",
    );
    expect(hints.some((t: string) => t.includes("No one selected"))).toBe(true);
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
    // Override survived the self-emit: still in a 'these people' mode.
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

  test("location options include home/away/zones but not zone.home", async () => {
    el = await mount();
    const options = Array.from(
      whereSelect(el).querySelectorAll<HTMLOptionElement>("option"),
    ).map((o: HTMLOptionElement) => o.value);
    expect(options).toContain("home");
    expect(options).toContain("away");
    expect(options).toContain("zone.work");
    expect(options).not.toContain("zone.home");
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

    let emitted: PeoplePredicate | null | undefined = undefined;
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

  // --- matcher-input dispatch ----------------------------------------------

  test("matcher-input dispatches to the people widget for input=people_predicate", async () => {
    const di: any = document.createElement("ambience-matcher-input");
    di.matcher = { name: "people", description: "", predicate_help: "", input: "people_predicate", priority: 75 };
    di.value = null;
    di.hass = hass;
    document.body.appendChild(di);
    await di.updateComplete;
    expect(di.shadowRoot.querySelector("ambience-people-predicate-input")).not.toBeNull();
    di.remove();
  });
});
