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

  test("round-trips an existing predicate into the controls", async () => {
    el = await mount({ who: ["person.alice"], quant: "everyone", where: "home" });
    const quant = el.shadowRoot.querySelector("select.quant");
    expect(quant?.value).toBe("everyone");
    const checked = Array.from(
      el.shadowRoot.querySelectorAll<HTMLInputElement>("input[type=checkbox]"),
    ).filter((c: HTMLInputElement) => c.checked);
    expect(checked).toHaveLength(1);
  });

  test("emits a predicate when the quantifier changes", async () => {
    el = await mount();
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const quant = el.shadowRoot.querySelector("select.quant");
    quant.value = "nobody";
    quant.dispatchEvent(new Event("change"));
    expect(emitted?.quant).toBe("nobody");
  });

  test("emits where when the location changes", async () => {
    el = await mount();
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const where = el.shadowRoot.querySelector("select.where");
    where.value = "zone.work";
    where.dispatchEvent(new Event("change"));
    expect(emitted?.where).toBe("zone.work");
  });

  test("toggling a person on adds it to who", async () => {
    el = await mount();
    let emitted: PeoplePredicate | null | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const cb = el.shadowRoot.querySelector("input[type=checkbox]");
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
    expect(emitted?.who).toContain("person.alice");
  });

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

  test("default selection (any/home/no who/no for) emits null", async () => {
    // Start from a non-default value, then return to the default.
    el = await mount({ quant: "nobody", where: "home" });
    let emitted: PeoplePredicate | null | undefined = undefined as any;
    el.addEventListener("value-changed", (e: Event) => {
      emitted = (e as CustomEvent<{ value: PeoplePredicate | null }>).detail.value;
    });
    const quant = el.shadowRoot.querySelector("select.quant");
    quant.value = "any";
    quant.dispatchEvent(new Event("change"));
    expect(emitted).toBeNull();
  });
});
