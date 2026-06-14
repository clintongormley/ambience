import { afterEach, describe, expect, test } from "vitest";

import "../frontend/src/views/problem-flag";

async function mount(
  props: { severity?: string; details?: string[]; summary?: string } = {},
): Promise<any> {
  const el: any = document.createElement("ambience-problem-flag");
  el.severity = props.severity ?? "error";
  el.details = props.details ?? ["Missing in Home Assistant: light.ghost"];
  el.summary = props.summary ?? (props.details ?? ["x"]).join("\n");
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-problem-flag", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders a severity badge with an explicit exclamation mark", async () => {
    el = await mount({ severity: "error" });
    const badge = el.shadowRoot.querySelector(".problem-flag");
    expect(badge.getAttribute("data-severity")).toBe("error");
    expect(badge.querySelector('ha-icon[icon="mdi:exclamation-thick"]')).toBeTruthy();
  });

  test("details are hidden until the badge is clicked", async () => {
    el = await mount({ details: ["Missing in Home Assistant: light.ghost"] });
    expect(el.shadowRoot.querySelector(".details")).toBeFalsy();
    (el.shadowRoot.querySelector(".problem-flag") as HTMLElement).click();
    await el.updateComplete;
    const details = el.shadowRoot.querySelector(".details");
    expect(details).toBeTruthy();
    expect(details.textContent).toContain("light.ghost");
  });

  test("clicking again hides the details", async () => {
    el = await mount();
    const badge = el.shadowRoot.querySelector(".problem-flag") as HTMLElement;
    badge.click();
    await el.updateComplete;
    badge.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".details")).toBeFalsy();
  });

  test("the badge click does not bubble (so it won't trigger row/scope toggles)", async () => {
    el = await mount();
    let bubbled = false;
    el.addEventListener("click", () => {
      bubbled = true;
    });
    (el.shadowRoot.querySelector(".problem-flag") as HTMLElement).click();
    expect(bubbled).toBe(false);
  });

  test("clicking elsewhere closes an open popover (and is a no-op when already closed)", async () => {
    el = await mount();
    // No-op path: a document click while closed must not throw or open it.
    document.body.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".details")).toBeFalsy();
    // Open, then click outside → closes.
    (el.shadowRoot.querySelector(".problem-flag") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".details")).toBeTruthy();
    document.body.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".details")).toBeFalsy();
  });
});
