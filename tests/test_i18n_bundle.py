"""bin/_i18n_bundle — recursive-descent reader for the i18n-data.ts bundle."""

from __future__ import annotations

import pytest

from bin._i18n_bundle import parse_locales, placeholder_tokens

SAMPLE = """
// header comment, before the object
export const AMBIENCE_STRINGS_BY_LOCALE: Record<string, unknown> = {
  en: {
    action: {},
    weekday: { "0": "Sun" },
    ui: {
      close: "Close",
      // an inline comment
      greeting: "Hi {name}",
      wrapped:
        "Wrapped value, with a colon: yes",
      edit: 'Edit "{name}"',
    },
    day_summary: { workday: "workday" },
  }, // end en
  es: {
    action: {},
    weekday: { "0": "Dom" },
    ui: {
      close: "Cerrar",
      greeting: "Hola {name}",
      wrapped: "Valor",
      edit: 'Editar "{name}"',
    },
    day_summary: { workday: "día laborable" },
  },
};
"""


def test_parse_locales_flattens_both_locales() -> None:
    loc = parse_locales(SAMPLE)
    assert set(loc) == {"en", "es"}
    assert loc["en"]["ui.close"] == "Close"
    assert loc["en"]["weekday.0"] == "Sun"  # quoted numeric key
    assert loc["en"]["ui.greeting"] == "Hi {name}"
    # a value that wraps onto its own line, and one with an inner colon
    assert loc["en"]["ui.wrapped"] == "Wrapped value, with a colon: yes"
    # a single-quoted value carrying double quotes
    assert loc["en"]["ui.edit"] == 'Edit "{name}"'
    assert loc["en"]["day_summary.workday"] == "workday"
    assert loc["es"]["ui.close"] == "Cerrar"
    assert loc["es"]["day_summary.workday"] == "día laborable"


def test_parse_locales_skips_empty_objects() -> None:
    loc = parse_locales(SAMPLE)
    assert not any(k.startswith("action") for k in loc["en"])


def test_placeholder_tokens_is_a_sorted_multiset() -> None:
    assert placeholder_tokens("Hi {name}, {name} & {n}") == ["n", "name", "name"]
    assert placeholder_tokens("no tokens here") == []
    # bare/empty braces are not tokens (mirrors i18n.ts's /\\{(\\w+)\\}/g)
    assert placeholder_tokens("a {} b") == []


def test_parse_locales_rejects_non_string_scalar_value() -> None:
    # A numeric/boolean leaf must raise loudly, not be silently mis-read as a
    # string (which can swallow following structure and drop a whole locale,
    # making a verification gate return a wrong verdict with no error).
    bad = (
        "export const AMBIENCE_STRINGS_BY_LOCALE = { en: { ui: { n: 2 } }, es: { ui: { n: 2 } } };"
    )
    with pytest.raises(ValueError):
        parse_locales(bad)


def test_parse_locales_rejects_array_value() -> None:
    bad = 'export const AMBIENCE_STRINGS_BY_LOCALE = { en: { ui: { a: ["x"] } } };'
    with pytest.raises(ValueError):
        parse_locales(bad)


def test_parse_locales_raises_valueerror_on_truncated_input() -> None:
    # A truncated bundle (mid-edit / merge conflict) must raise the module's own
    # ValueError, not a raw IndexError.
    bad = 'export const AMBIENCE_STRINGS_BY_LOCALE = { en: { ui: { a: "x"'
    with pytest.raises(ValueError):
        parse_locales(bad)


def test_parse_locales_on_real_bundle() -> None:
    from pathlib import Path

    root = Path(__file__).resolve().parent.parent
    text = (root / "frontend" / "src" / "i18n-data.ts").read_text()
    loc = parse_locales(text)
    # canary: a forgotten/renamed shipped locale fails loudly here.
    assert set(loc) == {"en", "es", "pt"}
    # every shipped locale mirrors en's key set, and a healthy number of them.
    en_keys = set(loc["en"])
    for locale in loc.keys() - {"en"}:
        assert set(loc[locale]) == en_keys, f"{locale} bundle keys differ from en"
    assert len(en_keys) > 400
    # a couple of known anchors survive the parse
    assert loc["en"]["ui.close"]
    assert "{name}" in loc["en"]["ui.lux_modal_edit_title"]
    assert "{name}" in loc["pt"]["ui.lux_modal_edit_title"]
