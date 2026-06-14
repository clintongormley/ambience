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

  test("the badge is type=button (never submits a surrounding form)", async () => {
    el = await mount();
    expect((el.shadowRoot.querySelector(".problem-flag") as HTMLButtonElement).type).toBe("button");
  });

  test("aria-label collapses the multi-line summary to a single line", async () => {
    el = await mount({ summary: "Never fires.\nMissing in Home Assistant: light.x" });
    const label = (el.shadowRoot.querySelector(".problem-flag") as HTMLElement).getAttribute(
      "aria-label",
    );
    expect(label).not.toContain("\n");
    expect(label).toBe("Never fires. Missing in Home Assistant: light.x");
  });

  test("the badge exposes its open state via aria-expanded", async () => {
    el = await mount();
    const badge = el.shadowRoot.querySelector(".problem-flag") as HTMLElement;
    expect(badge.getAttribute("aria-expanded")).toBe("false");
    badge.click();
    await el.updateComplete;
    expect(badge.getAttribute("aria-expanded")).toBe("true");
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

  test("clicking inside the open popover keeps it open (so text is selectable)", async () => {
    el = await mount({ details: ["Missing in Home Assistant: light.ghost"] });
    (el.shadowRoot.querySelector(".problem-flag") as HTMLElement).click();
    await el.updateComplete;
    (el.shadowRoot.querySelector(".details") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".details")).toBeTruthy();
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

  test("opening one flag closes any other open flag", async () => {
    const a: any = document.createElement("ambience-problem-flag");
    a.severity = "error";
    a.details = ["A detail"];
    a.summary = "A";
    const b: any = document.createElement("ambience-problem-flag");
    b.severity = "warning";
    b.details = ["B detail"];
    b.summary = "B";
    document.body.append(a, b);
    await a.updateComplete;
    await b.updateComplete;

    (a.shadowRoot.querySelector(".problem-flag") as HTMLElement).click();
    await a.updateComplete;
    expect(a.shadowRoot.querySelector(".details")).toBeTruthy();

    (b.shadowRoot.querySelector(".problem-flag") as HTMLElement).click();
    await a.updateComplete;
    await b.updateComplete;
    expect(b.shadowRoot.querySelector(".details")).toBeTruthy();
    expect(a.shadowRoot.querySelector(".details")).toBeFalsy();

    a.remove();
    b.remove();
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
