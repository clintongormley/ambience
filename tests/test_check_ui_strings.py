"""bin/check_ui_strings — frontend ui.* localize keys vs the i18n-data bundle."""

from pathlib import Path

from bin.check_ui_strings import bundle_keys, compare, used_keys

SAMPLE_BUNDLE = """
export const AMBIENCE_STRINGS: Record<string, unknown> = {
  weekday: { mon: "Mon" },
  ui: {
    close: "Close",
    long_one:
      "A value that wraps onto its own line, with: a colon for good measure.",
    sun: {
      elevation: "Elevation",
    },
  },
};
"""

SAMPLE_SOURCE = """
localize(this.hass, "ui.close", "Close");
localize(this.hass, "ui.sun.elevation", "Elevation");
localize(this.hass, "ui.long_one", "...");
"""


def test_bundle_keys_handles_nesting_and_wrapped_values() -> None:
    assert bundle_keys(SAMPLE_BUNDLE) == {"ui.close", "ui.long_one", "ui.sun.elevation"}


def test_used_keys_extracts_quoted_ui_literals() -> None:
    assert used_keys(SAMPLE_SOURCE) == {"ui.close", "ui.sun.elevation", "ui.long_one"}


def test_compare_reports_missing() -> None:
    missing, unused = compare({"ui.a", "ui.b"}, {"ui.b", "ui.c"})
    assert missing == {"ui.a"}
    assert unused == {"ui.c"}


def test_real_frontend_keys_are_all_bundled() -> None:
    """Every ui.* key a localize() call references must exist in i18n-data.ts —
    a missing key silently falls back to inline English and can never be
    translated."""
    root = Path(__file__).resolve().parent.parent
    bundle = bundle_keys((root / "frontend" / "src" / "i18n-data.ts").read_text())
    used: set[str] = set()
    for ts in (root / "frontend" / "src").rglob("*.ts"):
        used |= used_keys(ts.read_text())
    missing, _unused = compare(used, bundle)
    assert not missing, f"ui keys used but not bundled in i18n-data.ts: {sorted(missing)}"
