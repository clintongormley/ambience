import { describe, test, expect, beforeAll, afterEach, vi } from "vitest";

vi.mock("../frontend/src/api", () => ({
  listAutoTriggers: vi.fn(),
}));

import "../frontend/src/views/auto-triggers-modal";
import * as api from "../frontend/src/api";
import type { AutoTrigger } from "../frontend/src/types";

// Register a stub <ha-state-icon> so the modal takes its preferred branch.
// This is permanent for the process, so it lives in its own file (the main
// modal test exercises the ha-icon fallback, which needs ha-state-icon absent).
beforeAll(() => {
  if (!customElements.get("ha-state-icon")) {
    customElements.define("ha-state-icon", class extends HTMLElement {});
  }
});

async function mountOpen(
  states: Record<string, unknown>,
  triggers: AutoTrigger[],
): Promise<any> {
  (api.listAutoTriggers as any).mockResolvedValue({ triggers, opaque: false });
  const el: any = document.createElement("ambience-auto-triggers-modal");
  el.hass = { states };
  el.scope = { kind: "area", id: "lr" };
  el.rules = [];
  document.body.appendChild(el);
  await el.updateComplete;
  el.open = true;
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("auto-triggers-modal entity icon (ha-state-icon registered)", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("entity rows render ha-state-icon with the entity's state object", async () => {
    const stateObj = { entity_id: "event.backup", state: "x", attributes: {} };
    el = await mountOpen({ "event.backup": stateObj }, [
      { key: "entity:event.backup", kind: "entity", entity_id: "event.backup", enabled: true },
    ]);
    const icon: any = el.shadowRoot.querySelector("li ha-state-icon.row-icon");
    expect(icon).toBeTruthy();
    expect(icon.stateObj).toBe(stateObj);
    // No ha-icon fallback for the entity row when ha-state-icon is available.
    expect(el.shadowRoot.querySelector("li ha-icon.row-icon")).toBeNull();
  });
});
