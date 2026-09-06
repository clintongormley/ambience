"""The backend's English trace details must equal the panel bundle's `en`
`trace_detail` table, and every `phrase()` key used in code must exist in it."""

import ast
from pathlib import Path

from bin._i18n_bundle import parse_locales
from custom_components.ambience.conditions._common import (
    DETAIL_EN,
    detail_to_wire,
    ent,
    phrase,
    render_detail,
    text,
    wrap_quantified_segs,
)

_ROOT = Path(__file__).parents[1]


def _bundle_trace_detail(locale: str) -> dict[str, str]:
    flat = parse_locales((_ROOT / "frontend" / "src" / "i18n-data.ts").read_text())[locale]
    prefix = "trace_detail."
    return {k[len(prefix) :]: v for k, v in flat.items() if k.startswith(prefix)}


def test_en_bundle_matches_detail_en() -> None:
    assert _bundle_trace_detail("en") == DETAIL_EN


def test_render_detail_joins_english() -> None:
    segs = [phrase("want"), text(" "), phrase("quant_anyone"), text(" "), phrase("where_home")]
    assert render_detail(segs) == "want anyone home"


def test_detail_to_wire_shapes() -> None:
    assert detail_to_wire([text("x")]) == [{"t": "x"}]
    assert detail_to_wire([ent("person.a", "Alice")]) == [{"e": "person.a", "t": "Alice"}]
    assert detail_to_wire([phrase("not_found")]) == [{"k": "not_found", "p": {}, "t": "not found"}]


def test_wrap_quantified_segs_matches_string_helper() -> None:
    cells = [[text("A ✓")], [text("B ✗")]]
    assert render_detail(wrap_quantified_segs(cells, "all", False)) == "all of: A ✓, B ✗"
    assert render_detail(wrap_quantified_segs(cells, "any", True)) == "not(any of: A ✓, B ✗)"
    assert render_detail(wrap_quantified_segs([[text("A ✓")]], "any", False)) == "A ✓"


def _static_phrase_keys(arg: ast.expr) -> set[str]:
    """Every literal `trace_detail` key a `phrase()` first-argument expression can
    statically resolve to: a bare string constant, or either branch of a ternary
    (`phrase("where_home" if ... else "where_not_home")`). An f-string base
    (`phrase(f"quant_{...}")`) resolves to no static key here — its family is
    pinned separately below."""
    if isinstance(arg, ast.Constant) and isinstance(arg.value, str):
        return {arg.value}
    if isinstance(arg, ast.IfExp):
        return _static_phrase_keys(arg.body) | _static_phrase_keys(arg.orelse)
    return set()


def test_every_phrase_key_is_defined() -> None:
    keys: set[str] = set()
    files = [_ROOT / "custom_components" / "ambience" / "conditions" / "_common.py"]
    files += sorted((_ROOT / "custom_components" / "ambience" / "conditions").glob("*.py"))
    for path in files:
        for node in ast.walk(ast.parse(path.read_text())):
            if (
                isinstance(node, ast.Call)
                and isinstance(node.func, ast.Name)
                and node.func.id == "phrase"
                and node.args
            ):
                keys |= _static_phrase_keys(node.args[0])
    assert keys <= set(DETAIL_EN), f"phrase keys missing from DETAIL_EN: {keys - set(DETAIL_EN)}"
    # The f-string family `phrase(f"quant_{_quant_word(...)}")` can't be resolved
    # from the AST; pin every word it can emit (see PeopleCondition._quant_word).
    quant_family = {"quant_anyone", "quant_everyone", "quant_nobody"}
    assert quant_family <= set(DETAIL_EN), (
        f"quant_* phrase keys missing from DETAIL_EN: {quant_family - set(DETAIL_EN)}"
    )
    # The ternary branches must actually have been collected — a guard against a
    # future refactor silently dropping the IfExp resolution above.
    assert {"where_home", "where_not_home", "where_in", "where_not_in"} <= keys
