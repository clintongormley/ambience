import json
from pathlib import Path

from bin._i18n_bundle import flatten_items
from bin.check_translations import (
    compare_keys,
    flatten_keys,
    main,
    placeholder_mismatches,
)


def test_flatten_keys_nests_with_dots():
    assert flatten_keys({"a": {"b": 1, "c": 2}}) == {"a.b", "a.c"}


def test_compare_keys_reports_missing_and_extra():
    source = {"a": 1, "b": {"c": 2}}
    target = {"a": 1, "b": {"d": 3}}
    missing, extra = compare_keys(source, target)
    assert missing == {"b.c"}  # in source (strings.json), absent from target locale
    assert extra == {"b.d"}  # in target locale, absent from source


def test_real_en_json_matches_strings_json():
    root = Path(__file__).resolve().parent.parent / "custom_components" / "ambience"
    source = json.loads((root / "strings.json").read_text())
    en = json.loads((root / "translations" / "en.json").read_text())
    missing, extra = compare_keys(source, en)
    assert not missing, f"en.json missing keys present in strings.json: {sorted(missing)}"
    assert not extra, f"en.json has keys absent from strings.json: {sorted(extra)}"


def test_shipped_locale_missing_keys_fails(tmp_path):
    comp = tmp_path / "comp"
    (comp / "translations").mkdir(parents=True)
    (comp / "strings.json").write_text('{"a": "x", "b": "y"}')
    (comp / "translations" / "en.json").write_text('{"a": "x", "b": "y"}')
    (comp / "translations" / "es.json").write_text('{"a": "x"}')  # missing "b"
    assert main(["--component", str(comp)]) == 1  # es is shipped -> incomplete -> fail


def test_non_shipped_locale_missing_keys_ok(tmp_path):
    comp = tmp_path / "comp"
    (comp / "translations").mkdir(parents=True)
    (comp / "strings.json").write_text('{"a": "x", "b": "y"}')
    (comp / "translations" / "en.json").write_text('{"a": "x", "b": "y"}')
    (comp / "translations" / "es.json").write_text('{"a": "x", "b": "y"}')
    (comp / "translations" / "it.json").write_text('{"a": "x"}')  # it not shipped -> OK
    assert main(["--component", str(comp)]) == 0


def test_pt_is_a_shipped_locale_and_must_be_complete(tmp_path):
    comp = tmp_path / "comp"
    (comp / "translations").mkdir(parents=True)
    (comp / "strings.json").write_text('{"a": "x", "b": "y"}')
    (comp / "translations" / "en.json").write_text('{"a": "x", "b": "y"}')
    (comp / "translations" / "pt.json").write_text('{"a": "x"}')  # missing "b"
    assert main(["--component", str(comp)]) == 1  # pt is shipped -> incomplete -> fail


def test_real_pt_json_is_complete():
    root = Path(__file__).resolve().parent.parent / "custom_components" / "ambience"
    source = json.loads((root / "strings.json").read_text())
    pt = json.loads((root / "translations" / "pt.json").read_text())
    missing, extra = compare_keys(source, pt)
    assert not missing, f"pt.json missing keys present in strings.json: {sorted(missing)}"
    assert not extra, f"pt.json has keys absent from strings.json: {sorted(extra)}"


def test_real_es_json_is_complete():
    root = Path(__file__).resolve().parent.parent / "custom_components" / "ambience"
    source = json.loads((root / "strings.json").read_text())
    es = json.loads((root / "translations" / "es.json").read_text())
    missing, extra = compare_keys(source, es)
    assert not missing, f"es.json missing keys present in strings.json: {sorted(missing)}"
    assert not extra, f"es.json has keys absent from strings.json: {sorted(extra)}"


def test_real_fr_json_is_complete():
    root = Path(__file__).resolve().parent.parent / "custom_components" / "ambience"
    source = json.loads((root / "strings.json").read_text())
    fr = json.loads((root / "translations" / "fr.json").read_text())
    missing, extra = compare_keys(source, fr)
    assert not missing, f"fr.json missing keys present in strings.json: {sorted(missing)}"
    assert not extra, f"fr.json has keys absent from strings.json: {sorted(extra)}"


# --- placeholder integrity ------------------------------------------------
# strings.json carries `{token}` interpolation placeholders that HA fills in at
# runtime. A translation that renames, drops or duplicates one of those tokens
# passes the key check but breaks (or crashes) substitution at runtime. These
# guard that the token *multiset* of every shared key matches strings.json.
# placeholder_mismatches operates on already-flattened maps (flatten_items).


def test_placeholder_mismatches_flags_a_renamed_token():
    source = flatten_items({"exceptions": {"e": {"message": "must be an integer: {value}"}}})
    target = flatten_items({"exceptions": {"e": {"message": "doit être un entier : {valeur}"}}})
    assert placeholder_mismatches(source, target) == [
        "exceptions.e.message: strings.json placeholders ['value'] != ['valeur']"
    ]


def test_placeholder_mismatches_flags_a_dropped_token():
    source = flatten_items({"a": "{min} >= {max}"})
    target = flatten_items({"a": "min supérieur au max"})  # both tokens dropped
    (msg,) = placeholder_mismatches(source, target)
    assert "a:" in msg and "['max', 'min']" in msg


def test_placeholder_mismatches_ignores_reordered_tokens():
    # Same multiset, different order — a legitimate translation. No mismatch.
    source = flatten_items({"a": "{command} needs one of: {present}"})
    target = flatten_items({"a": "{present} manquant pour {command}"})
    assert placeholder_mismatches(source, target) == []


def test_placeholder_mismatches_only_checks_shared_keys():
    # A key the locale hasn't translated yet (missing) isn't a placeholder issue —
    # completeness is the key check's job, not this one.
    source = flatten_items({"a": "{x}", "b": "{y}"})
    target = flatten_items({"a": "{x}"})  # b untranslated
    assert placeholder_mismatches(source, target) == []


def test_main_fails_on_a_placeholder_mismatch_even_in_a_non_shipped_locale(tmp_path):
    # A broken token crashes at runtime regardless of shipped status, so a present
    # key with the wrong tokens must fail the gate for ANY locale.
    comp = tmp_path / "comp"
    (comp / "translations").mkdir(parents=True)
    (comp / "strings.json").write_text('{"a": "must be an integer: {value}"}')
    (comp / "translations" / "en.json").write_text('{"a": "must be an integer: {value}"}')
    (comp / "translations" / "it.json").write_text('{"a": "un entier : {valeur}"}')  # broken
    assert main(["--component", str(comp)]) == 1


def test_real_shipped_locales_have_matching_placeholders():
    root = Path(__file__).resolve().parent.parent / "custom_components" / "ambience"
    source = json.loads((root / "strings.json").read_text())
    source_items = flatten_items(source)
    for locale in ("es", "pt", "fr"):
        target = json.loads((root / "translations" / f"{locale}.json").read_text())
        issues = placeholder_mismatches(source_items, flatten_items(target))
        assert not issues, f"{locale}.json placeholder drift from strings.json: {issues}"
