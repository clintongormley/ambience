import { beforeEach, describe, expect, it, vi } from "vitest";
import { getFrontendVersion } from "../frontend/src/api";
import { _hashInternals } from "../frontend/src/frontend-hash";
import { _internals } from "../frontend/src/views/version-banner";
import "../frontend/src/views/version-banner";

describe("getFrontendVersion", () => {
  it("calls the ambience/frontend_version command", async () => {
    const callWS = vi.fn(async () => ({ hash: "newhash", version: "0.32.0" }));
    const res = await getFrontendVersion({ callWS } as any);
    expect(callWS).toHaveBeenCalledWith({ type: "ambience/frontend_version" });
    expect(res).toEqual({ hash: "newhash", version: "0.32.0" });
  });
});

async function mount(running: string, ws?: { hash: string; version: string } | Error) {
  vi.spyOn(_hashInternals, "runningFrontendHash").mockReturnValue(running);
  const callWS = vi.fn(async () => {
    if (ws instanceof Error) throw ws;
    return ws;
  });
  const el = document.createElement("ambience-version-banner") as any;
  el.hass = { callWS };
  document.body.appendChild(el);
  await el.updateComplete;
  // allow the async _check() microtasks to settle, then re-render
  // two flushes: one for callWS to resolve, one for getFrontendVersion to unwrap
  await Promise.resolve();
  await Promise.resolve();
  await el.updateComplete;
  const inner = el.shadowRoot.querySelector("ambience-banner");
  if (inner) await inner.updateComplete;
  return el;
}
const innerBanner = (el: any) => el.shadowRoot.querySelector("ambience-banner");

describe("ambience-version-banner", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("shows and names the server version on a hash mismatch", async () => {
    const el = await mount("oldhash", { hash: "newhash", version: "0.32.0" });
    expect(innerBanner(el)).not.toBeNull();
    expect(el.shadowRoot.textContent).toContain("0.32.0");
  });

  it("the CTA triggers a reload", async () => {
    const reload = vi.spyOn(_internals, "reload").mockImplementation(() => {});
    const el = await mount("oldhash", { hash: "newhash", version: "0.32.0" });
    innerBanner(el).shadowRoot.querySelector('[data-test="banner-cta"]').click();
    expect(reload).toHaveBeenCalledOnce();
  });

  it("the banner is not dismissable", async () => {
    const el = await mount("oldhash", { hash: "newhash", version: "0.32.0" });
    expect(innerBanner(el).shadowRoot.querySelector('[data-test="banner-dismiss"]')).toBeNull();
  });

  it("hidden when the hashes match", async () => {
    const el = await mount("samehash", { hash: "samehash", version: "0.32.0" });
    expect(innerBanner(el)).toBeNull();
  });

  it("hidden when the running hash is empty (dev/unhashed load)", async () => {
    const el = await mount("", { hash: "newhash", version: "0.32.0" });
    expect(innerBanner(el)).toBeNull();
  });

  it("hidden when the server hash is missing", async () => {
    const el = await mount("oldhash", { hash: "missing", version: "0.32.0" });
    expect(innerBanner(el)).toBeNull();
  });

  it("hidden when the server hash is empty string", async () => {
    const el = await mount("oldhash", { hash: "", version: "0.32.0" });
    expect(innerBanner(el)).toBeNull();
  });

  it("hidden (fail-open) when the WS call rejects", async () => {
    const el = await mount("oldhash", new Error("boom"));
    expect(innerBanner(el)).toBeNull();
  });
});
