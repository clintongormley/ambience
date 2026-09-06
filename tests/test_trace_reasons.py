"""The backend's English trace reasons must equal the panel bundle's `en`
`trace_reason` table: the backend renders English for logs/MCP, the panel
localises by key, and the two must not drift."""

import ast
from pathlib import Path

import pytest

from bin._i18n_bundle import parse_locales
from custom_components.ambience.conditions._common import REASON_EN, Reason


def _bundle_trace_reasons(locale: str) -> dict[str, str]:
    text = (Path(__file__).parents[1] / "frontend" / "src" / "i18n-data.ts").read_text()
    flat = parse_locales(text)[locale]
    prefix = "trace_reason."
    return {k[len(prefix) :]: v for k, v in flat.items() if k.startswith(prefix)}


def test_backend_reason_table_matches_the_bundles_english() -> None:
    assert _bundle_trace_reasons("en") == REASON_EN


def test_reason_renders_english_with_placeholders() -> None:
    rendered = Reason("lux_range_missing", {"range": "dusk"}).render()
    assert rendered == "lux range dusk no longer exists"


def _reason_keys_in_source() -> set[str]:
    """Every literal key passed to `Reason(...)` across the built-in conditions,
    read from the source rather than by import: a key on a branch no test
    exercises still has to exist in the table."""
    keys: set[str] = set()
    conditions = Path(__file__).parents[1] / "custom_components" / "ambience" / "conditions"
    for path in sorted(conditions.glob("*.py")):
        for node in ast.walk(ast.parse(path.read_text())):
            if not (isinstance(node, ast.Call) and isinstance(node.func, ast.Name)):
                continue
            if node.func.id != "Reason":
                continue
            if not node.args or not isinstance(node.args[0], ast.Constant):
                pytest.fail(f"non-literal Reason key in {path.name}:{node.lineno}")
            keys.add(node.args[0].value)
    return keys


def test_every_reason_key_used_in_source_is_in_the_table() -> None:
    """Both directions: a new `Reason(...)` key with no table entry would render
    a KeyError, and a table entry no condition raises is dead translation."""
    assert _reason_keys_in_source() == set(REASON_EN)


def test_reason_is_not_hashable() -> None:
    """The `placeholders` Mapping makes the generated hash a trap; it is
    declared away so the failure is at the call site, not inside a dict."""
    with pytest.raises(TypeError):
        hash(Reason("sun_not_configured"))
