import json
from pathlib import Path

from scripts.check_translations import compare_keys, flatten_keys


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
