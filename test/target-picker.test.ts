import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/target-picker";

function makeHass(version: string) {
  return { states: {}, entities: {}, devices: {}, areas: {}, config: { version } };
}

async function mount(opts: {
  value?: any;
  target?: unknown;
  hass?: any;
  entities?: string[];
}): Promise<any> {
  const el: any = document.createElement("ambience-target-picker");
  el.hass = opts.hass ?? {
    states: {},
    entities: {},
    devices: {},
    areas: {},
    config: { version: "2026.5.0" },
  };
  el.value = opts.value ?? {};
  if (opts.target !== undefined) el.target = opts.target;
  if (opts.entities !== undefined) el.entities = opts.entities;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

let el: any;
afterEach(() => el?.remove());

test("emits the target object on internal change", async () => {
  el = await mount({ value: { area_id: ["kitchen"] }, target: { entity: { domain: "light" } } });
  let detail: any;
  el.addEventListener("value-changed", (e: CustomEvent) => {
    detail = e.detail;
  });
  // Simulate the ha-form/native selector firing with a new target value.
  el._onTargetFormChange(
    new CustomEvent("value-changed", {
      detail: { value: { target: { label_id: ["reading"] } } },
    }),
  );
  expect(detail.value).toEqual({ label_id: ["reading"] });
});

test("domain filter is derived from service target metadata", async () => {
  el = await mount({ value: {}, target: { entity: { domain: "light" } } });
  const schema = el._targetSchema();
  expect(JSON.stringify(schema)).toContain("light");
});

describe("HA version gating", () => {
  test("on HA >= 2026.1 builds the target-selector schema", async () => {
    el = await mount({
      hass: makeHass("2026.5.1"),
      value: {},
      target: { entity: { domain: "light" } },
    });
    // _targetSchema() is used on new HA; _entitySchema() is the fallback
    const schema = el._targetSchema();
    expect(schema[0].selector).toHaveProperty("target");
  });

  test("on HA < 2026.1 builds the entity-selector schema", async () => {
    el = await mount({
      hass: makeHass("2025.2.0"),
      value: { entity_id: ["light.lamp"] },
      entities: ["light.lamp", "light.bulb"],
    });
    const schema = el._entitySchema();
    expect(schema[0].name).toBe("entities");
    expect(schema[0].selector).toHaveProperty("entity");
    expect(schema[0].selector.entity.multiple).toBe(true);
    expect(schema[0].selector.entity.include_entities).toEqual(["light.lamp", "light.bulb"]);
  });

  test("entity schema change handler emits {entity_id:[...]} target shape", async () => {
    el = await mount({
      hass: makeHass("2025.2.0"),
      value: {},
      entities: ["light.a"],
    });
    let detail: any;
    el.addEventListener("value-changed", (e: CustomEvent) => {
      detail = e.detail;
    });
    el._onEntityFormChange(
      new CustomEvent("value-changed", {
        detail: { value: { entities: ["light.a", "light.b"] } },
      }),
    );
    expect(detail.value).toEqual({ entity_id: ["light.a", "light.b"] });
  });

  test("entity change handler calls stopPropagation on the incoming event", async () => {
    el = await mount({ hass: makeHass("2025.2.0"), value: {} });
    let stopped = false;
    const evt = new CustomEvent("value-changed", {
      detail: { value: { entities: [] } },
      bubbles: true,
      composed: true,
    });
    const orig = evt.stopPropagation.bind(evt);
    evt.stopPropagation = () => {
      stopped = true;
      orig();
    };
    el._onEntityFormChange(evt);
    expect(stopped).toBe(true);
  });
});
