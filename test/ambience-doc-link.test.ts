import { beforeEach, describe, expect, it } from "vitest";
import { DOCS_BASE_URL } from "../frontend/src/docs";
import "../frontend/src/views/ambience-doc-link";

async function mount(path = "conditions/lux") {
  const el = document.createElement("ambience-doc-link") as any;
  el.path = path;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-doc-link", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders an external anchor to the matching docs page", async () => {
    const el = await mount("conditions/lux");
    const a = el.shadowRoot.querySelector('[data-test="doc-link"]') as HTMLAnchorElement;
    expect(a).not.toBeNull();
    expect(a.getAttribute("href")).toBe(`${DOCS_BASE_URL}/conditions/lux/`);
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("labels the link for assistive tech", async () => {
    const el = await mount();
    const a = el.shadowRoot.querySelector('[data-test="doc-link"]') as HTMLAnchorElement;
    expect(a.getAttribute("aria-label")).toBe("Open documentation");
    expect(a.getAttribute("title")).toBe("Open documentation");
  });

  it("renders nothing when no path is set", async () => {
    const el = await mount("");
    expect(el.shadowRoot.querySelector('[data-test="doc-link"]')).toBeNull();
  });

  it("stops click propagation so a parent header toggle does not fire", async () => {
    const parent = document.createElement("div");
    let parentClicked = false;
    parent.addEventListener("click", () => {
      parentClicked = true;
    });
    const el = document.createElement("ambience-doc-link") as any;
    el.path = "conditions/lux";
    parent.appendChild(el);
    document.body.appendChild(parent);
    await el.updateComplete;

    // Capture-phase preventDefault suppresses jsdom's unimplemented navigation
    // without affecting the component's own bubble-phase stopPropagation.
    const suppressNav = (e: Event) => e.preventDefault();
    document.addEventListener("click", suppressNav, true);
    el.shadowRoot.querySelector('[data-test="doc-link"]').click();
    document.removeEventListener("click", suppressNav, true);
    await el.updateComplete;

    expect(parentClicked).toBe(false);
  });
});
