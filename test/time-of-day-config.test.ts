import { describe, test, expect, afterEach, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  listPeriods: vi.fn(async () => ({
    builtins: {
      morning: { from: { kind: "sun", anchor: "sunrise", offset_min: 0 }, to: { kind: "sun", anchor: "noon", offset_min: 0 } },
    },
    custom: {},
    hidden: [],
  })),
  savePeriods: vi.fn(async () => ({ ok: true, warnings: [] })),
  resetPeriods: vi.fn(async () => ({ ok: true })),
}));

import "../frontend/src/views/time-of-day-config";

describe("ambience-time-of-day-config", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders the builtin morning row after load", async () => {
    el = document.createElement("ambience-time-of-day-config");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("Morning");
  });
});
