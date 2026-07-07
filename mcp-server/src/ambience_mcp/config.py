"""Read the HA connection settings from the environment and derive the
websocket URL. No secrets on disk — the token comes from AMBIENCE_HA_TOKEN."""

from __future__ import annotations

import os
from dataclasses import dataclass


class ConfigError(RuntimeError):
    """The environment is missing or malformed."""


@dataclass(frozen=True)
class Config:
    base_url: str
    token: str
    ws_url: str


def _derive_ws_url(base_url: str) -> str:
    url = base_url.rstrip("/")
    if url.startswith("https://"):
        return "wss://" + url[len("https://") :] + "/api/websocket"
    if url.startswith("http://"):
        return "ws://" + url[len("http://") :] + "/api/websocket"
    raise ConfigError(f"AMBIENCE_HA_URL must start with http:// or https:// (got {base_url!r})")


def load_config(env: dict[str, str] | None = None) -> Config:
    source = os.environ if env is None else env
    base_url = source.get("AMBIENCE_HA_URL", "").strip()
    token = source.get("AMBIENCE_HA_TOKEN", "").strip()
    if not base_url:
        raise ConfigError("AMBIENCE_HA_URL is not set")
    if not token:
        raise ConfigError("AMBIENCE_HA_TOKEN is not set")
    return Config(base_url=base_url, token=token, ws_url=_derive_ws_url(base_url))
