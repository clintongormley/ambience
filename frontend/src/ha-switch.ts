import { html, nothing } from "lit";
import { live } from "lit/directives/live.js";

/** Render HA's `<ha-switch>` when it's registered, else a plain checkbox
 * fallback (so toggles stay testable under jsdom, where ha-switch isn't
 * defined). Shared by every Ambience toggle so the fallback convention lives
 * in one place. */
export function renderHaSwitch(opts: {
  checked: boolean;
  dataTest: string;
  onChange: (e: Event) => void;
  className?: string;
  onClick?: (e: Event) => void;
}) {
  const { checked, dataTest, onChange, className, onClick } = opts;
  if (customElements.get("ha-switch")) {
    return html`<ha-switch
      class=${className ?? nothing}
      data-test=${dataTest}
      .checked=${live(checked)}
      @click=${onClick}
      @change=${onChange}
    ></ha-switch>`;
  }
  return html`<input
    class=${className ?? nothing}
    data-test=${dataTest}
    type="checkbox"
    .checked=${live(checked)}
    @click=${onClick}
    @change=${onChange}
  />`;
}
