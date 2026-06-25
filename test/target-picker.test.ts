import { afterEach, expect, test } from "vitest";
import "../frontend/src/views/target-picker";

async function mount(opts: { value?: any; target?: unknown }): Promise<any> {
  const el: any = document.createElement("ambience-target-picker");
  el.hass = { states: {}, entities: {}, devices: {}, areas: {} };
  el.value = opts.value ?? {};
  if (opts.target !== undefined) el.target = opts.target;
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
