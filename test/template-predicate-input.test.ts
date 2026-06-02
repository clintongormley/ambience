import { describe, test, expect, afterEach, vi } from "vitest";

import "../frontend/src/views/template-predicate-input";
import type { TemplatePredicate } from "../frontend/src/types";

type RenderMsg = { result?: unknown; error?: string; level?: string };

/**
 * Mock hass whose `connection.subscribeMessage` invokes `handler(msg, cb)` so a
 * test can push render events, and hands back a fresh unsub spy per call.
 */
function mockHass(handler?: (msg: any, cb: (m: RenderMsg) => void) => void) {
  const unsubs: Array<ReturnType<typeof vi.fn>> = [];
  const subscribeMessage = vi.fn(async (cb: (m: RenderMsg) => void, msg: any) => {
    handler?.(msg, cb);
    const u = vi.fn();
    unsubs.push(u);
    return u;
  });
  return { hass: { connection: { subscribeMessage } } as any, unsubs, subscribeMessage };
}

async function flush(el: any) {
  await el.updateComplete;
  // debounce timer (set to 0ms) + the async subscribeMessage promise.
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
}

async function mount(value: TemplatePredicate = null, hass?: any): Promise<any> {
  const el: any = document.createElement("ambience-template-predicate-input");
  el.value = value;
  el._debounceMs = 0;
  if (hass) el.hass = hass;
  document.body.appendChild(el);
  await flush(el);
  return el;
}

describe("ambience-template-predicate-input", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders a textarea", async () => {
    el = await mount(null);
    expect(el.shadowRoot.querySelector("textarea")).not.toBeNull();
  });

  test("round-trips an existing template into the textarea", async () => {
    el = await mount({ template: "{{ is_state('x','on') }}" });
    const ta = el.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
    expect(ta.value).toBe("{{ is_state('x','on') }}");
  });

  test("typing a template emits { template: ... }", async () => {
    el = await mount(null);
    let captured: any = "unset";
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    const ta = el.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
    ta.value = "{{ true }}";
    ta.dispatchEvent(new Event("input"));
    expect(captured).toEqual({ template: "{{ true }}" });
  });

  test("clearing the textarea emits null (wildcard)", async () => {
    el = await mount({ template: "{{ true }}" });
    let captured: any = "unset";
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    const ta = el.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
    ta.value = "   ";
    ta.dispatchEvent(new Event("input"));
    expect(captured).toBeNull();
  });

  test("subscribes to render_template with the template text and report_errors", async () => {
    const { hass, subscribeMessage } = mockHass((_msg, cb) => cb({ result: "42" }));
    el = await mount({ template: "{{ 21 * 2 }}" }, hass);
    expect(subscribeMessage).toHaveBeenCalledTimes(1);
    const sentMsg = subscribeMessage.mock.calls[0][1];
    expect(sentMsg).toMatchObject({
      type: "render_template",
      template: "{{ 21 * 2 }}",
      report_errors: true,
    });
  });

  test("calls subscribeMessage bound to the connection (preserves `this`)", async () => {
    // Real HA's subscribeMessage reaches for `this._queuedMessages`; calling it
    // detached makes `this` undefined and throws. Mirror that here so a
    // regression surfaces as a preview error instead of the rendered value.
    const connection: any = {
      _queuedMessages: [] as unknown[],
      subscribeMessage(cb: (m: RenderMsg) => void, msg: unknown) {
        this._queuedMessages.push(msg);
        cb({ result: "ok" });
        return () => {};
      },
    };
    el = await mount({ template: "{{ 1 }}" }, { connection });
    expect(el.shadowRoot.querySelector(".preview.error")).toBeNull();
    expect(el.shadowRoot.textContent ?? "").toContain("ok");
  });

  test("shows the live rendered result (dev-tools style)", async () => {
    const { hass } = mockHass((_msg, cb) => cb({ result: "42" }));
    el = await mount({ template: "{{ 21 * 2 }}" }, hass);
    expect(el.shadowRoot.textContent ?? "").toContain("42");
  });

  test("indicates the boolean the condition will see — truthy result", async () => {
    const { hass } = mockHass((_msg, cb) => cb({ result: "on" }));
    el = await mount({ template: "{{ 'on' }}" }, hass);
    const bool = el.shadowRoot.querySelector(".preview .bool");
    expect(bool).not.toBeNull();
    expect(bool?.classList.contains("true")).toBe(true);
    expect(bool?.textContent?.toLowerCase()).toContain("true");
  });

  test("indicates the boolean the condition will see — falsy result (bare numeric string)", async () => {
    // "42" renders as a string and is NOT truthy to the condition.
    const { hass } = mockHass((_msg, cb) => cb({ result: "42" }));
    el = await mount({ template: "{{ states('sensor.lux') }}" }, hass);
    const bool = el.shadowRoot.querySelector(".preview .bool");
    expect(bool?.classList.contains("false")).toBe(true);
    expect(bool?.textContent?.toLowerCase()).toContain("false");
    // still shows the raw value too
    expect(el.shadowRoot.textContent ?? "").toContain("42");
  });

  test("no boolean indicator on an error", async () => {
    const { hass } = mockHass((_msg, cb) => cb({ error: "boom", level: "ERROR" }));
    el = await mount({ template: "{{ nope() }}" }, hass);
    expect(el.shadowRoot.querySelector(".preview .bool")).toBeNull();
  });

  test("serializes object/array results as JSON", async () => {
    const { hass } = mockHass((_msg, cb) => cb({ result: [1, 2, 3] }));
    el = await mount({ template: "{{ [1,2,3] }}" }, hass);
    expect(el.shadowRoot.textContent ?? "").toContain("[1,2,3]");
  });

  test("shows render errors in the preview", async () => {
    const { hass } = mockHass((_msg, cb) =>
      cb({ error: "UndefinedError: 'nope' is undefined", level: "ERROR" }),
    );
    el = await mount({ template: "{{ nope() }}" }, hass);
    const errEl = el.shadowRoot.querySelector(".preview.error");
    expect(errEl).not.toBeNull();
    expect(errEl?.textContent ?? "").toContain("undefined");
  });

  test("does not subscribe when the template is empty", async () => {
    const { hass, subscribeMessage } = mockHass();
    el = await mount(null, hass);
    expect(subscribeMessage).not.toHaveBeenCalled();
    expect(el.shadowRoot.querySelector(".preview")).toBeNull();
  });

  test("re-subscribes (unsubscribing the previous) when the template changes", async () => {
    const { hass, unsubs, subscribeMessage } = mockHass((_msg, cb) => cb({ result: "x" }));
    el = await mount({ template: "{{ 1 }}" }, hass);
    expect(subscribeMessage).toHaveBeenCalledTimes(1);

    el.value = { template: "{{ 2 }}" };
    await flush(el);

    expect(subscribeMessage).toHaveBeenCalledTimes(2);
    expect(unsubs[0]).toHaveBeenCalled(); // first subscription torn down
  });

  test("does not re-subscribe when only the hass identity changes (same connection)", async () => {
    // HA replaces the `hass` object on every state change; the live
    // render_template subscription already pushes its own updates, so a new
    // hass with the same connection must not tear down + resubscribe.
    const { hass, subscribeMessage } = mockHass((_msg, cb) => cb({ result: "x" }));
    el = await mount({ template: "{{ 1 }}" }, hass);
    expect(subscribeMessage).toHaveBeenCalledTimes(1);

    el.hass = { connection: hass.connection }; // new object, same connection
    await flush(el);

    expect(subscribeMessage).toHaveBeenCalledTimes(1);
  });

  test("unsubscribes on disconnect", async () => {
    const { hass, unsubs } = mockHass((_msg, cb) => cb({ result: "x" }));
    el = await mount({ template: "{{ 1 }}" }, hass);
    el.remove();
    expect(unsubs[0]).toHaveBeenCalled();
  });
});

describe("condition-input template dispatch", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders ambience-template-predicate-input for input=template_predicate", async () => {
    await import("../frontend/src/views/condition-input");
    el = document.createElement("ambience-condition-input");
    el.condition = {
      name: "template",
      description: "",
      predicate_help: "help text",
      input: "template_predicate",
      priority: 30,
    };
    el.value = null;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-template-predicate-input")).not.toBeNull();
  });
});
