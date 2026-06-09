import { afterEach, describe, expect, test, vi } from "vitest";
import { downloadScopeDiagnostics } from "../frontend/src/api";

describe("downloadScopeDiagnostics", () => {
  afterEach(() => vi.restoreAllMocks());

  test("requests the scope bundle and triggers a JSON download", async () => {
    const callWS = vi.fn(async () => ({ scope: { scope_id: "kitchen" }, traces: [] }));
    const hass: any = { callWS };

    vi.spyOn(URL, "createObjectURL").mockImplementation(() => "blob:x");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const clicks: HTMLAnchorElement[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clicks.push(this);
    });

    await downloadScopeDiagnostics(hass, { scope_kind: "area", scope_id: "kitchen" }, "g1");

    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/diagnostics/scope",
      scope_kind: "area",
      scope_id: "kitchen",
      category: "g1",
    });
    expect(clicks).toHaveLength(1);
    expect(clicks[0].download).toBe("ambience-area-kitchen-g1.json");
  });
});
