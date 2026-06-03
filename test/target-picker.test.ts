import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/target-picker";

async function mount(opts: {
  entities?: string[];
  value?: string[];
  target?: unknown;
}): Promise<any> {
  const el: any = document.createElement("ambience-target-picker");
  el.entities = opts.entities ?? [];
  el.value = opts.value ?? [];
  if (opts.target !== undefined) el.target = opts.target;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureEmit(el: HTMLElement): () => string[] | undefined {
  let detail: { value: string[] } | undefined;
  el.addEventListener("value-changed", ((e: CustomEvent) => {
    detail = e.detail;
  }) as any);
  return () => detail?.value;
}

describe("ambience-target-picker (Lit fallback)", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  test("renders a checkbox for each available entity", async () => {
    el = await mount({ entities: ["light.a", "light.b", "light.c"] });
    expect(el.shadowRoot.querySelectorAll('input[type="checkbox"]').length).toBe(3);
  });

  test("entities in value are checked", async () => {
    el = await mount({
      entities: ["light.a", "light.b", "light.c"],
      value: ["light.a", "light.c"],
    });
    const boxes = el.shadowRoot.querySelectorAll(
      'input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>;
    expect(boxes[0].checked).toBe(true);
    expect(boxes[1].checked).toBe(false);
    expect(boxes[2].checked).toBe(true);
  });

  test("checking a box emits the new array", async () => {
    el = await mount({
      entities: ["light.a", "light.b"],
      value: ["light.a"],
    });
    const get = captureEmit(el);
    const boxes = el.shadowRoot.querySelectorAll(
      'input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>;
    boxes[1].checked = true;
    boxes[1].dispatchEvent(new Event("change"));
    expect(get()).toEqual(["light.a", "light.b"]);
  });

  test("unchecking a box emits without that entity", async () => {
    el = await mount({
      entities: ["light.a", "light.b"],
      value: ["light.a", "light.b"],
    });
    const get = captureEmit(el);
    const boxes = el.shadowRoot.querySelectorAll(
      'input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>;
    boxes[0].checked = false;
    boxes[0].dispatchEvent(new Event("change"));
    expect(get()).toEqual(["light.b"]);
  });

  test("empty entity list renders an empty-state hint", async () => {
    el = await mount({ entities: [] });
    expect(el.shadowRoot.textContent).toContain("No matching entities");
  });

  test("HA target metadata filters the displayed entity list by domain", async () => {
    el = await mount({
      entities: ["light.a", "switch.fan", "light.b"],
      target: { entity: { domain: "light" } },
    });
    const boxes = el.shadowRoot.querySelectorAll(
      'input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>;
    // switch.fan filtered out by HA target metadata
    expect(boxes.length).toBe(2);
    const labels = Array.from(el.shadowRoot.querySelectorAll("label")).map((l: any) =>
      l.textContent.trim(),
    );
    expect(labels).toContain("light.a");
    expect(labels).toContain("light.b");
    expect(labels).not.toContain("switch.fan");
  });

  test("HA target with no entity stanza does not filter", async () => {
    el = await mount({
      entities: ["light.a", "switch.fan"],
      target: { device: {} },
    });
    expect(el.shadowRoot.querySelectorAll('input[type="checkbox"]').length).toBe(2);
  });

  test("checked emission preserves the filtered-list order", async () => {
    el = await mount({
      entities: ["light.a", "switch.fan", "light.b"],
      target: { entity: { domain: "light" } },
      value: ["light.a"],
    });
    const get = captureEmit(el);
    const boxes = el.shadowRoot.querySelectorAll(
      'input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>;
    // Second box (light.b) — switch.fan was filtered out
    boxes[1].checked = true;
    boxes[1].dispatchEvent(new Event("change"));
    expect(get()).toEqual(["light.a", "light.b"]);
  });
});
