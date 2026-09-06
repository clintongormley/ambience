"""The backend's English trace reasons must equal the panel bundle's `en`
`trace_reason` table: the backend renders English for logs/MCP, the panel
localises by key, and the two must not drift."""

from pathlib import Path

from bin._i18n_bundle import parse_locales
from custom_components.ambience.conditions._common import REASON_EN, Reason


def _bundle_trace_reasons(locale: str) -> dict[str, str]:
    text = (Path(__file__).parents[1] / "frontend" / "src" / "i18n-data.ts").read_text()
    flat = parse_locales(text)[locale]
    prefix = "trace_reason."
    return {k[len(prefix) :]: v for k, v in flat.items() if k.startswith(prefix)}


def test_backend_reason_table_matches_the_bundles_english() -> None:
    assert _bundle_trace_reasons("en") == REASON_EN


def test_every_locale_carries_every_reason_key() -> None:
    for locale in ("es", "pt", "fr"):
        assert set(_bundle_trace_reasons(locale)) == set(REASON_EN), locale


def test_reason_renders_english_with_placeholders() -> None:
    rendered = Reason("lux_range_missing", {"range": "dusk"}).render()
    assert rendered == "lux range dusk no longer exists"
