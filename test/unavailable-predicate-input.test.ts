import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/unavailable-predicate-input";
import { unavailablePredicateError } from "../frontend/src/views/unavailable-predicate-input";

describe("ambience-unavailable-predicate-input", () => {
  let el: any;
  afterEach(() => el?.remove());

  async function mount(value: any = null): Promise<any> {
    el = document.createElement("ambience-unavailable-predicate-input");
    el.value = value;
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  }

  test("renders an entity field", async () => {
    await mount();
    expect(el.shadowRoot.querySelector("[data-field='sensors']")).not.toBeNull();
  });

  test("emits {entities} on change", async () => {
    await mount();
    const events: any[] = [];
    el.addEventListener("value-changed", (e: any) => events.push(e.detail.value));
    el._setEntities(["binary_sensor.a", "light.b"]);
    expect(events.at(-1)).toEqual({ entities: ["binary_sensor.a", "light.b"] });
  });

  test("reflects existing value", async () => {
    await mount({ entities: ["binary_sensor.a"] });
    expect(el._entities()).toEqual(["binary_sensor.a"]);
  });

  test("emits null when the selection is cleared (no invalid empty predicate)", async () => {
    await mount({ entities: ["binary_sensor.a"] });
    const events: any[] = [];
    el.addEventListener("value-changed", (e: any) => events.push(e.detail.value));
    el._setEntities([]);
    expect(events.at(-1)).toBeNull();
    expect(el._entities()).toEqual([]);
  });
});

describe("unavailablePredicateError (save-gate structural validator)", () => {
  test("null is a valid wildcard", () => {
    expect(unavailablePredicateError(null)).toBeNull();
  });

  test("a non-empty entities list is valid", () => {
    expect(unavailablePredicateError({ entities: ["binary_sensor.a"] })).toBeNull();
  });

  test("an empty entities list is an error", () => {
    expect(unavailablePredicateError({ entities: [] })).toBe("Select at least one entity");
  });

  test("a malformed predicate (no entities array) is an error", () => {
    expect(unavailablePredicateError({})).toBe("Select at least one entity");
  });
});
