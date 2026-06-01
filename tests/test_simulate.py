"""What-if simulator core."""

from custom_components.ambience.trace import CauseKind, TriggerCause


def test_simulated_cause_kind_exists_and_describes():
    cause = TriggerCause(kind=CauseKind.SIMULATED, detail="2026-12-21T17:30:00")
    assert CauseKind.SIMULATED == "simulated"
    assert "2026-12-21T17:30:00" in cause.describe()
