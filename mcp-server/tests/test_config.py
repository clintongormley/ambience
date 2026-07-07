import pytest

from ambience_mcp.config import Config, ConfigError, load_config


def test_derives_ws_url_from_http():
    cfg = load_config({"AMBIENCE_HA_URL": "http://ha.local:8123", "AMBIENCE_HA_TOKEN": "t"})
    assert cfg == Config(
        base_url="http://ha.local:8123",
        token="t",
        ws_url="ws://ha.local:8123/api/websocket",
    )


def test_derives_wss_url_from_https_and_strips_trailing_slash():
    cfg = load_config({"AMBIENCE_HA_URL": "https://ha.example.com/", "AMBIENCE_HA_TOKEN": "t"})
    assert cfg.ws_url == "wss://ha.example.com/api/websocket"


def test_missing_url_raises():
    with pytest.raises(ConfigError, match="AMBIENCE_HA_URL"):
        load_config({"AMBIENCE_HA_TOKEN": "t"})


def test_missing_token_raises():
    with pytest.raises(ConfigError, match="AMBIENCE_HA_TOKEN"):
        load_config({"AMBIENCE_HA_URL": "http://ha.local:8123"})


def test_bad_scheme_raises():
    with pytest.raises(ConfigError, match="http"):
        load_config({"AMBIENCE_HA_URL": "ha.local:8123", "AMBIENCE_HA_TOKEN": "t"})
