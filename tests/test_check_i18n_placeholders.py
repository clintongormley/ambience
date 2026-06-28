"""bin/check_i18n_placeholders — en/es placeholder-token parity in the bundle."""

from __future__ import annotations

from pathlib import Path

from bin._i18n_bundle import parse_locales
from bin.check_i18n_placeholders import find_issues, main


def test_flags_token_multiset_mismatch() -> None:
    locales = {
        "en": {"ui.a": "Hi {name}", "ui.b": "{n} items"},
        "es": {"ui.a": "Hola {name}", "ui.b": "{m} elementos"},  # {n} renamed to {m}
    }
    issues = find_issues(locales)
    assert any("ui.b" in i for i in issues)
    assert not any("ui.a" in i for i in issues)  # same token, different order ok


def test_token_order_does_not_matter() -> None:
    locales = {
        "en": {"ui.a": "{scope}: {winner}"},
        "es": {"ui.a": "{winner} en {scope}"},  # reordered, same multiset
    }
    assert find_issues(locales) == []


def test_duplicate_token_counts_matter() -> None:
    locales = {
        "en": {"ui.a": "{n} of {n}"},
        "es": {"ui.a": "{n}"},  # dropped one {n}: multiset [n, n] != [n]
    }
    assert any("ui.a" in i for i in find_issues(locales))


def test_flags_key_missing_from_a_locale() -> None:
    locales = {"en": {"ui.a": "A", "ui.b": "B"}, "es": {"ui.a": "A"}}
    issues = find_issues(locales)
    assert any("ui.b" in i for i in issues)


def test_real_bundle_has_no_placeholder_drift() -> None:
    root = Path(__file__).resolve().parent.parent
    loc = parse_locales((root / "frontend" / "src" / "i18n-data.ts").read_text())
    assert find_issues(loc) == []


def test_main_returns_zero_on_the_real_bundle() -> None:
    assert main([]) == 0
