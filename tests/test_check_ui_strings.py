"""bin/check_ui_strings — frontend ui.* localize keys vs the i18n-data bundle."""

from pathlib import Path

from bin.check_ui_strings import (
    bundle_keys,
    compare,
    main,
    scan_sources,
    used_keys,
    used_prefixes,
)

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
    src = Path(__file__).resolve().parents[1] / "frontend" / "src"
    used, _prefixes = scan_sources(src)
    missing, _unused = compare(used, bundle_keys((src / "i18n-data.ts").read_text()))
    assert not missing, f"ui keys used but not bundled in i18n-data.ts: {sorted(missing)}"


def test_used_keys_includes_static_backtick_literals() -> None:
    assert used_keys('localize(h, `ui.close`, "x")') == {"ui.close"}


def test_used_prefixes_extracts_the_static_head_of_a_template_literal() -> None:
    src = 'localize(h, `ui.history_action_${a}`, a); localize(h, `ui.history_${op}_tooltip`, "")'
    assert used_prefixes(src) == {"ui.history_action_", "ui.history_"}


def test_used_prefixes_captures_a_bare_ui_head() -> None:
    """A bare `ui.` head is captured so `main` can reject it — dropping it here
    would leave the key unchecked with no signal at all."""
    assert used_prefixes('localize(h, `ui.${x}`, "")') == {"ui."}


def test_main_rejects_a_bare_ui_head(tmp_path: Path) -> None:
    """A prefix claiming every bundled key would silence the unreferenced-key
    check, so it fails the run rather than being quietly tolerated."""
    src = tmp_path / "frontend" / "src"
    src.mkdir(parents=True)
    (src / "i18n-data.ts").write_text(SAMPLE_BUNDLE)
    (src / "panel.ts").write_text('localize(h, `ui.${x}`, "")')
    assert main(["--root", str(tmp_path)]) == 1


def test_compare_treats_a_prefix_claim_as_a_reference() -> None:
    bundled = {"ui.history_action_add", "ui.history_undo_tooltip", "ui.orphan"}
    missing, unused = compare(set(), bundled, prefixes={"ui.history_"})
    assert missing == set()
    assert unused == {"ui.orphan"}


def test_real_frontend_has_no_unreferenced_ui_keys() -> None:
    """Turns the script's warning into a repo invariant."""
    src = Path(__file__).resolve().parents[1] / "frontend" / "src"
    used, prefixes = scan_sources(src)
    bundled = bundle_keys((src / "i18n-data.ts").read_text())
    _missing, unused = compare(used, bundled, prefixes=prefixes)
    assert unused == set()
