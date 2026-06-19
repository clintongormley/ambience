"""bin/check_exceptions_keys — every carrier-call key has an exceptions entry."""

from bin.check_exceptions_keys import defined_keys, main, used_keys


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
