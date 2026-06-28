"""bin/check_i18n_fallbacks — inline localize() fallback vs the en bundle value."""

from __future__ import annotations

from bin.check_i18n_fallbacks import find_mismatches, localize_calls, main

EN = {"ui.close": "Close", "ui.greeting": "Hi {name}", "ui.edit": 'Edit "{name}"'}


def test_localize_calls_extracts_literal_key_fallback_pairs() -> None:
    src = """
      localize(this.hass, "ui.close", "Close");
      localize(hass, "ui.greeting", "Hi {name}", { name });
      localize(this.hass, entry[0], entry[1]);
    """
    calls = dict(localize_calls(src))
    assert calls["ui.close"] == "Close"
    assert calls["ui.greeting"] == "Hi {name}"  # trailing placeholders arg ignored
    assert "entry[0]" not in calls  # dynamic (variable) key skipped


def test_handles_single_quoted_fallback_with_inner_quotes() -> None:
    src = 'localize(this.hass, "ui.edit", \'Edit "{name}"\');'
    assert dict(localize_calls(src))["ui.edit"] == 'Edit "{name}"'


def test_handles_multiline_calls() -> None:
    src = """
      localize(
        this.hass,
        "ui.close",
        "Close",
      )
    """
    assert dict(localize_calls(src))["ui.close"] == "Close"


def test_find_mismatches_flags_fallback_drift() -> None:
    mismatches = find_mismatches(EN, {"f.ts": 'localize(this.hass, "ui.close", "Shut");'})
    assert any("ui.close" in m for m in mismatches)


def test_find_mismatches_ignores_keys_not_in_bundle() -> None:
    # An inline-only key (no bundle entry) is out of scope here.
    src = 'localize(this.hass, "people_summary.home", "home");'
    assert find_mismatches(EN, {"f.ts": src}) == []


def test_find_mismatches_passes_when_fallback_matches() -> None:
    src = 'localize(this.hass, "ui.close", "Close");'
    assert find_mismatches(EN, {"f.ts": src}) == []


def test_real_source_fallbacks_match_bundle() -> None:
    assert main([]) == 0
