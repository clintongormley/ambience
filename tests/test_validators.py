"""Tests for the shared reapply_seconds validator."""

from __future__ import annotations

import pytest

from custom_components.ambience.validators import (
    MIN_REAPPLY_SECONDS,
    validate_reapply_seconds,
)


@pytest.mark.parametrize("value", [0, MIN_REAPPLY_SECONDS, 600])
def test_accepts_zero_and_at_or_above_floor(value):
    validate_reapply_seconds("ctx", value)  # must not raise


@pytest.mark.parametrize("value", [1, MIN_REAPPLY_SECONDS - 1, -1])
def test_rejects_below_floor_and_negative(value):
    with pytest.raises(ValueError, match="reapply_seconds"):
        validate_reapply_seconds("ctx", value)


@pytest.mark.parametrize("value", [True, "10", 10.0, None])
def test_rejects_non_int(value):
    with pytest.raises(ValueError, match="reapply_seconds"):
        validate_reapply_seconds("ctx", value)


def test_error_message_includes_context():
    with pytest.raises(ValueError, match="rule 2 action 1"):
        validate_reapply_seconds("rule 2 action 1", 5)
