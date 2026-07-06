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


def test_flags_drift_in_any_locale_not_just_es() -> None:
    # A third shipped locale (pt) must be checked too, not silently ignored.
    locales = {
        "en": {"ui.a": "Hi {name}", "ui.b": "B"},
        "es": {"ui.a": "Hola {name}", "ui.b": "B"},  # es is clean
        "pt": {"ui.a": "Ola {nome}"},  # pt: token renamed AND ui.b missing
    }
    issues = find_issues(locales)
    assert any("ui.a" in i and "pt" in i for i in issues), issues  # token rename flagged
    assert any("ui.b" in i and "pt" in i for i in issues), issues  # missing key flagged
    assert all("pt" in i for i in issues), issues  # only the dirty locale (pt) is flagged


def test_real_bundle_has_no_placeholder_drift() -> None:
    root = Path(__file__).resolve().parent.parent
    loc = parse_locales((root / "frontend" / "src" / "i18n-data.ts").read_text())
    assert find_issues(loc) == []


def test_main_returns_zero_on_the_real_bundle() -> None:
    assert main([]) == 0
