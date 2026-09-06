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
                and isinstance(node.args[0], ast.Constant)
                and isinstance(node.args[0].value, str)
            ):
                keys.add(node.args[0].value)
    assert keys <= set(DETAIL_EN), f"phrase keys missing from DETAIL_EN: {keys - set(DETAIL_EN)}"
