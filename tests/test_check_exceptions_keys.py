"""bin/check_exceptions_keys — every carrier-call key has an exceptions entry."""

from bin.check_exceptions_keys import defined_keys, issue_keys, main, used_keys


def test_used_keys_extracts_carrier_literals():
    src = (
        'raise AmbienceError("scope_disabled", x=1)\n'
        'raise LastCategoryError("last_category_required")\n'
        'return service_validation_error("unknown_area", scope_id=s)\n'
        'render_en("unexpected_error", {})\n'
        'raise CategoryInUseError("some_key")'
    )
    assert used_keys(src) == {
        "scope_disabled",
        "last_category_required",
        "unknown_area",
        "unexpected_error",
        "some_key",
    }


def test_defined_keys_reads_exceptions():
    assert defined_keys({"exceptions": {"a": {"message": "A"}, "b": {"message": "B"}}}) == {
        "a",
        "b",
    }


def test_main_fails_on_missing(tmp_path):
    comp = tmp_path / "c"
    comp.mkdir()
    (comp / "strings.json").write_text('{"exceptions": {"known": {"message": "K"}}}')
    (comp / "x.py").write_text('raise AmbienceError("unknown_key")')
    assert main(["--component", str(comp)]) == 1


def test_real_tree_keys_all_defined():
    assert main() == 0  # run from repo root; every carrier key resolves


def test_used_keys_extracts_delegated_key_kwarg():
    """validate_entity_ids raises on its caller's behalf, so its `key=` literal
    is a key reference too — otherwise those keys read as unused."""
    src = 'validate_entity_ids(sensors, "sensor", key="lux_sensors_not_list")\n'
    assert used_keys(src) == {"lux_sensors_not_list"}


def test_used_keys_extracts_any_key_suffixed_kwarg():
    """Every delegating carrier names its key in a `*_key=` keyword, so one rule
    covers the scope table's `not_found_key=` and HA's `translation_key=` alike
    — without it those keys read as unused."""
    src = (
        'ScopeKind(kind="area", not_found_key="unknown_area")\n'
        'HomeAssistantError(translation_key="unexpected_error")\n'
    )
    assert used_keys(src) == {"unknown_area", "unexpected_error"}


def test_used_keys_skips_repairs_issue_translation_key():
    """A Repairs issue's `translation_key=` names an `issues.*` entry, not an
    exceptions key — an inline literal must not fail the exceptions gate."""
    src = (
        "ir.async_create_issue(\n"
        '    hass, DOMAIN, "storage_unreadable", is_fixable=False,\n'
        '    translation_key="storage_unreadable",\n'
        ")\n"
        'raise AmbienceError("scope_disabled")\n'
    )
    assert used_keys(src) == {"scope_disabled"}
    assert issue_keys(src) == {"storage_unreadable"}


def test_main_fails_on_missing_issue_key(tmp_path):
    """An issue key is checked against `issues`, not `exceptions` — a key that
    only exists under exceptions is still missing for a Repairs issue."""
    comp = tmp_path / "c"
    comp.mkdir()
    (comp / "strings.json").write_text(
        '{"exceptions": {"nope": {"message": "N"}}, "issues": {"known": {"title": "K"}}}'
    )
    (comp / "x.py").write_text(
        'ir.async_create_issue(hass, DOMAIN, "x", translation_key="nope")\n'
        'raise AmbienceError("nope")\n'
    )
    assert main(["--component", str(comp)]) == 1
