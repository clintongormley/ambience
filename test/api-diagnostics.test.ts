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

  test("anchor is connected to the document when clicked (mobile WebViews require it)", async () => {
    vi.useFakeTimers();
    try {
      const callWS = vi.fn(async () => ({ scope: { scope_id: "kitchen" }, traces: [] }));
      const hass: any = { callWS };

      vi.spyOn(URL, "createObjectURL").mockImplementation(() => "blob:x");
      vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
      let connectedAtClick: boolean | null = null;
      vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
        this: HTMLAnchorElement,
      ) {
        connectedAtClick = this.isConnected;
      });

      await downloadScopeDiagnostics(hass, { scope_kind: "area", scope_id: "kitchen" }, "g1");

      expect(connectedAtClick).toBe(true);
      vi.runAllTimers();
    } finally {
      vi.useRealTimers();
    }
  });

  test("defers revokeObjectURL until after the download is triggered (mobile blob fetch is async)", async () => {
    vi.useFakeTimers();
    try {
      const callWS = vi.fn(async () => ({ scope: { scope_id: "kitchen" }, traces: [] }));
      const hass: any = { callWS };

      vi.spyOn(URL, "createObjectURL").mockImplementation(() => "blob:x");
      const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
      vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

      await downloadScopeDiagnostics(hass, { scope_kind: "area", scope_id: "kitchen" }, "g1");

      // Revoking synchronously invalidates the blob URL before a mobile
      // browser has fetched it, so it must be deferred.
      expect(revoke).not.toHaveBeenCalled();

      vi.runAllTimers();

      expect(revoke).toHaveBeenCalledWith("blob:x");
    } finally {
      vi.useRealTimers();
    }
  });
});
