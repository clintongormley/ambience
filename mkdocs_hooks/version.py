"""mkdocs build hook: surface the integration version in the site name.

Reads custom_components/ambience/manifest.json and appends the version to
config['site_name'] (e.g. "Ambience" -> "Ambience v1.0.0"), so it renders as
text beside the wordmark in the nav — and in page titles. Best-effort: an
unreadable or malformed manifest leaves the site name untouched."""

import json
from pathlib import Path

_MANIFEST = Path("custom_components/ambience/manifest.json")


def read_version(manifest_path: Path = _MANIFEST) -> str:
    """The integration version from *manifest_path*, or '' if unavailable."""
    try:
        return str(json.loads(manifest_path.read_text())["version"])
    except (OSError, ValueError, KeyError, TypeError):
        return ""


def on_config(config):
    """mkdocs event: append the released version to the site name (no-op if
    the manifest version is unavailable)."""
    version = read_version(_MANIFEST)
    if version:
        config["site_name"] = f"{config['site_name']} v{version}"
    return config
