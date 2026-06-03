"""Tests for scripts/gen_reference_docs.py — drift detection for the committed reference doc."""

from __future__ import annotations

from scripts.gen_reference_docs import CONDITION_CLASSES, render_reference


def test_render_lists_every_condition_type():
    md = render_reference()
    for cls in CONDITION_CLASSES:
        assert f"### {cls.name}" in md, f"Expected '### {cls.name}' in rendered reference"


def test_render_is_deterministic():
    assert render_reference() == render_reference()


def test_condition_classes_cover_all_condition_modules():
    """Every conditions/<name>.py module must be registered in CONDITION_CLASSES,
    so a newly-added condition can't silently escape the generated docs."""
    import pkgutil

    from custom_components.ambience import conditions as cond_pkg

    registered_modules = {cls.__module__.rsplit(".", 1)[-1] for cls in CONDITION_CLASSES}
    found_modules = {
        m.name for m in pkgutil.iter_modules(cond_pkg.__path__) if not m.name.startswith("_")
    }
    missing = found_modules - registered_modules
    assert not missing, f"Condition modules missing from CONDITION_CLASSES: {sorted(missing)}"


def test_render_lists_every_ambience_action():
    md = render_reference()
    # The services.yaml is the source of truth for Ambience's own actions.
    from pathlib import Path

    import yaml

    services = yaml.safe_load(
        (Path(__file__).parent.parent / "custom_components/ambience/services.yaml").read_text()
    )
    for action_name, _spec in services.items():
        assert f"### ambience.{action_name}" in md, (
            f"Expected '### ambience.{action_name}' in rendered reference"
        )
