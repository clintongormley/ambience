"""bin/check_ui_strings — frontend ui.* localize keys vs the i18n-data bundle."""

from pathlib import Path

from bin.check_ui_strings import bundle_keys, compare, used_keys, used_prefixes

SAMPLE_BUNDLE = """
export const AMBIENCE_STRINGS_BY_LOCALE: Record<string, unknown> = {
  en: {
    weekday: { mon: "Mon" },
    ui: {
      close: "Close",
      long_one:
        "A value that wraps onto its own line, with: a colon for good measure.",
      sun: {
        elevation: "Elevation",
      },
    },
  },
  es: {
    weekday: { mon: "Lun" },
    ui: { close: "Cerrar", long_one: "...", sun: { elevation: "Elevación" } },
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


def test_used_keys_includes_static_backtick_literals() -> None:
    assert used_keys('localize(h, `ui.close`, "x")') == {"ui.close"}


def test_used_prefixes_extracts_the_static_head_of_a_template_literal() -> None:
    src = 'localize(h, `ui.history_action_${a}`, a); localize(h, `ui.history_${op}_tooltip`, "")'
    assert used_prefixes(src) == {"ui.history_action_", "ui.history_"}


def test_used_prefixes_ignores_a_bare_ui_head() -> None:
    """A bare `ui.` head would match every bundled key, silently disabling the
    unreferenced-key check — it must not count as a prefix claim."""
    assert used_prefixes('localize(h, `ui.${x}`, "")') == set()


def test_compare_treats_a_prefix_claim_as_a_reference() -> None:
    bundled = {"ui.history_action_add", "ui.history_undo_tooltip", "ui.orphan"}
    missing, unused = compare(set(), bundled, prefixes={"ui.history_"})
    assert missing == set()
    assert unused == {"ui.orphan"}


def test_real_frontend_has_no_unreferenced_ui_keys() -> None:
    """Turns the script's warning into a repo invariant."""
    src = Path(__file__).parents[1] / "frontend" / "src"
    used, prefixes = set(), set()
    for ts in src.rglob("*.ts"):
        text = ts.read_text()
        used |= used_keys(text)
        prefixes |= used_prefixes(text)
    bundled = bundle_keys((src / "i18n-data.ts").read_text())
    _missing, unused = compare(used, bundled, prefixes=prefixes)
    assert unused == set()
