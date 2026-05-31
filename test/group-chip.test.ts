import { describe, test, expect, afterEach } from "vitest";

import "../frontend/src/views/group-chip";
import type { RuleGroup } from "../frontend/src/types";

describe("ambience-group-chip", () => {
  let el: any;
  afterEach(() => el?.remove());

  async function mount(group: RuleGroup): Promise<any> {
    el = document.createElement("ambience-group-chip");
    el.group = group;
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  }

  test("a coloured group renders its hex background and the name", async () => {
    el = await mount({ id: "g1", name: "Lights", color: "green" });
    const lozenge = el.shadowRoot.querySelector(".lozenge") as HTMLElement;
    expect(lozenge).toBeTruthy();
    expect(lozenge.getAttribute("style")).toContain("#4caf50");
    expect(lozenge.textContent).toContain("Lights");
  });

  test("a no-colour group renders the name with the neutral style", async () => {
    el = await mount({ id: "g1", name: "Plain" });
    const lozenge = el.shadowRoot.querySelector(".lozenge") as HTMLElement;
    expect(lozenge).toBeTruthy();
    expect(lozenge.classList.contains("neutral")).toBe(true);
    expect(lozenge.textContent).toContain("Plain");
  });

  test("a group with an icon renders an ha-icon element", async () => {
    el = await mount({ id: "g1", name: "Lights", icon: "mdi:lightbulb" });
    expect(el.shadowRoot.querySelector("ha-icon")).toBeTruthy();
  });

  test("a group without an icon renders no ha-icon element", async () => {
    el = await mount({ id: "g1", name: "Lights" });
    expect(el.shadowRoot.querySelector("ha-icon")).toBeNull();
  });
});
