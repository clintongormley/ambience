import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/condition-input";
import "../frontend/src/views/template-predicate-input";
import "../frontend/src/views/state-predicate-input";
import "../frontend/src/views/sun-predicate-input";
import "../frontend/src/views/people-predicate-input";
import "../frontend/src/views/day-predicate-input";
import "../frontend/src/views/weather-predicate-input";
import type { ConditionInfo } from "../frontend/src/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCondition(input: string): ConditionInfo {
  return {
    name: input,
    description: "desc",
    predicate_help: "help text",
    input: input as ConditionInfo["input"],
    priority: 50,
  };
}

async function mount(input: string, value: unknown = null): Promise<any> {
  const el: any = document.createElement("ambience-condition-input");
  el.condition = makeCondition(input);
  el.value = value;
  el.hass = {};
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

// ---------------------------------------------------------------------------
// template_predicate dispatch (lines 130-141)
// ---------------------------------------------------------------------------

describe("condition-input — template_predicate dispatch", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders ambience-template-predicate-input for input=template_predicate", async () => {
    el = await mount("template_predicate");
    expect(el.shadowRoot.querySelector("ambience-template-predicate-input")).not.toBeNull();
  });

  test("does not render text input for template_predicate", async () => {
    el = await mount("template_predicate");
    expect(el.shadowRoot.querySelector("input[type='text']")).toBeNull();
  });

  test("re-emits value-changed from template widget and stops propagation", async () => {
    el = await mount("template_predicate");
    const captured: unknown[] = [];
    el.addEventListener("value-changed", (e: CustomEvent) => {
      captured.push(e.detail.value);
    });
    const widget = el.shadowRoot.querySelector("ambience-template-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { template: "{{ states('sensor.t') }}" } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured).toHaveLength(1);
    expect(captured[0]).toEqual({ template: "{{ states('sensor.t') }}" });
  });

  test("emits null value from template widget when inner widget emits null", async () => {
    el = await mount("template_predicate");
    let received: unknown = "NOT_SET";
    el.addEventListener("value-changed", (e: CustomEvent) => {
      received = e.detail.value;
    });
    const widget = el.shadowRoot.querySelector("ambience-template-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: null },
        bubbles: true,
        composed: true,
      }),
    );
    expect(received).toBeNull();
  });

  test("passes hass to the template widget", async () => {
    el = await mount("template_predicate");
    const widget = el.shadowRoot.querySelector("ambience-template-predicate-input") as any;
    expect(widget.hass).toBe(el.hass);
  });

  test("passes current value to the template widget", async () => {
    const val = { template: "{{ true }}" };
    el = await mount("template_predicate", val);
    const widget = el.shadowRoot.querySelector("ambience-template-predicate-input") as any;
    expect(widget.value).toEqual(val);
  });
});

// ---------------------------------------------------------------------------
// state_predicate dispatch (lines 142-153)
// ---------------------------------------------------------------------------

describe("condition-input — state_predicate dispatch", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders ambience-state-predicate-input for input=state_predicate", async () => {
    el = await mount("state_predicate");
    expect(el.shadowRoot.querySelector("ambience-state-predicate-input")).not.toBeNull();
  });

  test("does not render text input for state_predicate", async () => {
    el = await mount("state_predicate");
    expect(el.shadowRoot.querySelector("input[type='text']")).toBeNull();
  });

  test("re-emits value-changed from state_predicate widget", async () => {
    el = await mount("state_predicate");
    let captured: unknown = "NOT_SET";
    el.addEventListener("value-changed", (e: CustomEvent) => {
      captured = e.detail.value;
    });
    const widget = el.shadowRoot.querySelector("ambience-state-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { kind: "is", entity_id: "light.desk", states: ["on"] } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured).toEqual({ kind: "is", entity_id: "light.desk", states: ["on"] });
  });

  test("state_predicate widget event does not double-fire (stopPropagation)", async () => {
    el = await mount("state_predicate");
    let fireCount = 0;
    el.addEventListener("value-changed", () => {
      fireCount += 1;
    });
    const widget = el.shadowRoot.querySelector("ambience-state-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { kind: "is", entity_id: "x", states: [] } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(fireCount).toBe(1);
  });

  test("passes hass to the state_predicate widget", async () => {
    el = await mount("state_predicate");
    const widget = el.shadowRoot.querySelector("ambience-state-predicate-input") as any;
    expect(widget.hass).toBe(el.hass);
  });

  test("passes current value to the state_predicate widget", async () => {
    const val = { kind: "is", entity_id: "sensor.t", states: ["on"] };
    el = await mount("state_predicate", val);
    const widget = el.shadowRoot.querySelector("ambience-state-predicate-input") as any;
    expect(widget.value).toEqual(val);
  });
});

// ---------------------------------------------------------------------------
// people_predicate value-changed propagation (lines 160-161)
// ---------------------------------------------------------------------------

describe("condition-input — people_predicate value-changed propagation", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("re-emits value-changed from people widget", async () => {
    el = await mount("people_predicate");
    let captured: unknown = "NOT_SET";
    el.addEventListener("value-changed", (e: CustomEvent) => {
      captured = e.detail.value;
    });
    const widget = el.shadowRoot.querySelector("ambience-people-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { quant: "everyone", where: "home" } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured).toEqual({ quant: "everyone", where: "home" });
  });

  test("people_predicate widget event does not double-fire (stopPropagation)", async () => {
    el = await mount("people_predicate");
    let fireCount = 0;
    el.addEventListener("value-changed", () => {
      fireCount += 1;
    });
    const widget = el.shadowRoot.querySelector("ambience-people-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { quant: "nobody", where: "home" } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(fireCount).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// script_predicate value-changed propagation (lines 85-86)
// ---------------------------------------------------------------------------

describe("condition-input — script_predicate value-changed propagation", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("re-emits value-changed from script_predicate widget", async () => {
    el = document.createElement("ambience-condition-input");
    el.condition = makeCondition("script_predicate");
    el.value = null;
    el.hass = { services: { script: { my_script: {} } } };
    document.body.appendChild(el);
    await el.updateComplete;
    let captured: unknown = "NOT_SET";
    el.addEventListener("value-changed", (e: CustomEvent) => {
      captured = e.detail.value;
    });
    const widget = el.shadowRoot.querySelector("ambience-script-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: "script.my_script" },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured).toBe("script.my_script");
  });

  test("script_predicate widget event fires exactly once (stopPropagation)", async () => {
    el = document.createElement("ambience-condition-input");
    el.condition = makeCondition("script_predicate");
    el.value = null;
    el.hass = { services: { script: {} } };
    document.body.appendChild(el);
    await el.updateComplete;
    let fireCount = 0;
    el.addEventListener("value-changed", () => {
      fireCount += 1;
    });
    const widget = el.shadowRoot.querySelector("ambience-script-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: null },
        bubbles: true,
        composed: true,
      }),
    );
    expect(fireCount).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// day_predicate value-changed propagation (lines 98-99)
// ---------------------------------------------------------------------------

describe("condition-input — day_predicate value-changed propagation", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("re-emits value-changed from day_predicate widget", async () => {
    el = document.createElement("ambience-condition-input");
    el.condition = makeCondition("day_predicate");
    el.value = null;
    el.hass = {};
    el.dayConfig = { workday_sensor: null, workday_calendar: null };
    document.body.appendChild(el);
    await el.updateComplete;
    let captured: unknown = "NOT_SET";
    el.addEventListener("value-changed", (e: CustomEvent) => {
      captured = e.detail.value;
    });
    const widget = el.shadowRoot.querySelector("ambience-day-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { days: ["mon", "tue"] } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured).toEqual({ days: ["mon", "tue"] });
  });

  test("day_predicate widget event fires exactly once (stopPropagation)", async () => {
    el = document.createElement("ambience-condition-input");
    el.condition = makeCondition("day_predicate");
    el.value = null;
    el.hass = {};
    el.dayConfig = { workday_sensor: null, workday_calendar: null };
    document.body.appendChild(el);
    await el.updateComplete;
    let fireCount = 0;
    el.addEventListener("value-changed", () => {
      fireCount += 1;
    });
    const widget = el.shadowRoot.querySelector("ambience-day-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { days: ["wed"] } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(fireCount).toBe(1);
  });

  test("uses default dayConfig when dayConfig property is not set", async () => {
    // Exercises the `?? { workday_sensor: null, workday_calendar: null }` fallback (line 96).
    el = document.createElement("ambience-condition-input");
    el.condition = makeCondition("day_predicate");
    el.value = null;
    el.hass = {};
    // Intentionally do NOT set dayConfig.
    document.body.appendChild(el);
    await el.updateComplete;
    const widget = el.shadowRoot.querySelector("ambience-day-predicate-input") as any;
    expect(widget).not.toBeNull();
    expect(widget.dayConfig).toEqual({ workday_sensor: null, workday_calendar: null });
  });
});

// ---------------------------------------------------------------------------
// weather_predicate dispatch (lines 104-117)
// ---------------------------------------------------------------------------

describe("condition-input — weather_predicate dispatch", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders ambience-weather-predicate-input for input=weather_predicate", async () => {
    el = await mount("weather_predicate");
    expect(el.shadowRoot.querySelector("ambience-weather-predicate-input")).not.toBeNull();
  });

  test("does not render text input for weather_predicate", async () => {
    el = await mount("weather_predicate");
    expect(el.shadowRoot.querySelector("input[type='text']")).toBeNull();
  });

  test("re-emits value-changed from weather widget", async () => {
    el = await mount("weather_predicate");
    let captured: unknown = "NOT_SET";
    el.addEventListener("value-changed", (e: CustomEvent) => {
      captured = e.detail.value;
    });
    const widget = el.shadowRoot.querySelector("ambience-weather-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { condition: "sunny" } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured).toEqual({ condition: "sunny" });
  });

  test("weather_predicate widget event fires exactly once (stopPropagation)", async () => {
    el = await mount("weather_predicate");
    let fireCount = 0;
    el.addEventListener("value-changed", () => {
      fireCount += 1;
    });
    const widget = el.shadowRoot.querySelector("ambience-weather-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { condition: "rainy" } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(fireCount).toBe(1);
  });

  test("passes weatherConfig groups to the weather widget", async () => {
    el = document.createElement("ambience-condition-input");
    el.condition = makeCondition("weather_predicate");
    el.value = null;
    el.hass = {};
    el.weatherConfig = { groups: ["clear", "cloudy"], entity: "weather.home" };
    document.body.appendChild(el);
    await el.updateComplete;
    const widget = el.shadowRoot.querySelector("ambience-weather-predicate-input") as any;
    expect(widget.groups).toEqual(["clear", "cloudy"]);
    expect(widget.weatherEntity).toBe("weather.home");
  });

  test("passes empty groups when weatherConfig is absent", async () => {
    el = await mount("weather_predicate");
    const widget = el.shadowRoot.querySelector("ambience-weather-predicate-input") as any;
    expect(widget.groups).toEqual([]);
    expect(widget.weatherEntity).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// sun_predicate value-changed propagation (verify handler fires via dispatcher)
// ---------------------------------------------------------------------------

describe("condition-input — sun_predicate value-changed propagation", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("re-emits value-changed from sun widget", async () => {
    el = await mount("sun_predicate");
    let captured: unknown = "NOT_SET";
    el.addEventListener("value-changed", (e: CustomEvent) => {
      captured = e.detail.value;
    });
    const widget = el.shadowRoot.querySelector("ambience-sun-predicate-input")!;
    widget.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { elevation: { min: 10 } } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured).toEqual({ elevation: { min: 10 } });
  });
});

// ---------------------------------------------------------------------------
// text fallback — predicate_help display
// ---------------------------------------------------------------------------

describe("condition-input — text fallback", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("shows predicate_help text in the .help div", async () => {
    el = document.createElement("ambience-condition-input");
    el.condition = {
      name: "custom",
      description: "",
      predicate_help: "Enter a custom value here",
      input: "text" as ConditionInfo["input"],
      priority: 10,
    };
    el.value = null;
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    const help = el.shadowRoot.querySelector(".help") as HTMLElement | null;
    expect(help?.textContent).toBe("Enter a custom value here");
  });

  test("text input shows existing string value", async () => {
    el = document.createElement("ambience-condition-input");
    el.condition = makeCondition("text");
    el.value = "existing";
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    expect(input.value).toBe("existing");
  });

  test("text input shows empty string when value is null", async () => {
    el = await mount("text", null);
    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    expect(input.value).toBe("");
  });
});
