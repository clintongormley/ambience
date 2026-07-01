"""Unit tests for the mkdocs build hook that surfaces the integration version."""

import importlib.util
import json
from pathlib import Path


def _load_hook():
    spec = importlib.util.spec_from_file_location(
        "ambience_docs_version",
        Path(__file__).resolve().parents[1] / "mkdocs_hooks/version.py",
    )
    assert spec and spec.loader, "could not load mkdocs_hooks/version.py"
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def test_read_version_reads_manifest(tmp_path):
    hook = _load_hook()
    m = tmp_path / "manifest.json"
    m.write_text(json.dumps({"version": "1.2.3"}))
    assert hook.read_version(m) == "1.2.3"


def test_read_version_missing_file_is_empty(tmp_path):
    hook = _load_hook()
    assert hook.read_version(tmp_path / "nope.json") == ""


def test_read_version_malformed_is_empty(tmp_path):
    hook = _load_hook()
    m = tmp_path / "manifest.json"
    m.write_text("{ not json")
    assert hook.read_version(m) == ""


def test_on_config_sets_extra_version(tmp_path, monkeypatch):
    hook = _load_hook()
    m = tmp_path / "manifest.json"
    m.write_text(json.dumps({"version": "9.9.9"}))
    monkeypatch.setattr(hook, "_MANIFEST", m)
    config = {"extra": {}}
    hook.on_config(config)
    assert config["extra"]["version"] == "9.9.9"
