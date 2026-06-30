"""mkdocs build hook: surface the integration version to the theme.

Reads custom_components/ambience/manifest.json and sets config.extra['version']
so overrides/main.html can render a version badge next to the navbar wordmark.
Best-effort: an unreadable or malformed manifest yields '' (no badge)."""

import json
from pathlib import Path

_MANIFEST = Path("custom_components/ambience/manifest.json")


def read_version(manifest_path: Path = _MANIFEST) -> str:
    """The integration version from *manifest_path*, or '' if unavailable."""
    try:
        return str(json.loads(Path(manifest_path).read_text())["version"])
    except (OSError, ValueError, KeyError, TypeError):
        return ""


def on_config(config):
    """mkdocs event: stash the version under config.extra so templates see it."""
    config["extra"]["version"] = read_version(_MANIFEST)
    return config
