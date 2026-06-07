import { describe, expect, test } from "vitest";

import "../frontend/src/views/occupancy-predicate-input";
import type { OccupancyPredicate } from "../frontend/src/types";

async function mount(value: OccupancyPredicate | null): Promise<any> {
  const el: any = document.createElement("ambience-occupancy-predicate-input");
  el.value = value;
  el.hass = {};
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-occupancy-predicate-input", () => {
  test("sensor picker is a binary_sensor entity selector filtered by presence device classes", async () => {
    const el = await mount({ sensors: [], occupied: true, quant: "any" });
    const sel = el._sensorSchema()[0].selector.entity;
    expect(sel.domain).toBe("binary_sensor");
    expect(sel.multiple).toBe(true);
    expect(sel.device_class).toEqual(["occupancy", "presence", "motion"]);
    el.remove();
  });

  test("quant control is hidden for a single sensor", async () => {
    const el = await mount({ sensors: ["binary_sensor.a"], occupied: true, quant: "any" });
    expect(el._showQuant()).toBe(false);
    el.remove();
  });

  test("quant control is shown for multiple sensors", async () => {
    const el = await mount({ sensors: ["binary_sensor.a", "binary_sensor.b"], quant: "all" });
    expect(el._showQuant()).toBe(true);
    el.remove();
  });

  test("the occupied/vacant toggle uses Detected/Clear labels (matching the entity-state condition)", async () => {
    const el = await mount({ sensors: ["binary_sensor.a"], occupied: true });
    const select = el.shadowRoot.querySelector("select.state");
    const labels = Array.from(select.options).map((o: HTMLOptionElement) => o.textContent?.trim());
    expect(labels).toEqual(["Detected", "Clear"]);
    el.remove();
  });

  test("toggling vacant emits occupied:false and keeps the sensors", async () => {
    const el = await mount({ sensors: ["binary_sensor.a"], occupied: true });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setOccupied(false);
    expect(captured.occupied).toBe(false);
    expect(captured.sensors).toEqual(["binary_sensor.a"]);
    el.remove();
  });

  test("selecting sensors emits the sensors list", async () => {
    const el = await mount({ sensors: [], occupied: true });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setSensors(["binary_sensor.a", "binary_sensor.b"]);
    expect(captured.sensors).toEqual(["binary_sensor.a", "binary_sensor.b"]);
    el.remove();
  });

  test("toggling 'is not' emits negate:true; 'is' drops it", async () => {
    const el = await mount({ sensors: ["binary_sensor.a"], occupied: false });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setNegate(true);
    expect(captured.negate).toBe(true);
    expect(captured.occupied).toBe(false);
    expect(captured.sensors).toEqual(["binary_sensor.a"]);
    el._setNegate(false);
    expect(captured.negate).toBeUndefined();
    el.remove();
  });

  test("a zero 'for' duration is normalised out of the emitted predicate", async () => {
    const el = await mount({ sensors: ["binary_sensor.a"], occupied: true });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setFor({ h: 0, m: 0, s: 0 });
    expect(captured.for).toBeUndefined();
    el._setFor({ h: 0, m: 5, s: 0 });
    expect(captured.for).toEqual({ h: 0, m: 5, s: 0 });
    el.remove();
  });
});
