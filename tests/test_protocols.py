"""Protocols are structural; we test that the runtime checkers behave as expected."""

from __future__ import annotations

from custom_components.ambience.protocols import Matcher


def test_matcher_is_a_protocol() -> None:
    assert hasattr(Matcher, "_is_protocol")


def test_matcher_protocol_requires_name() -> None:
    class Bare:
        pass

    assert not isinstance(Bare(), Matcher)
