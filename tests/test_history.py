"""In-memory undo/redo history (ChangeHistory)."""

from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from custom_components.ambience.const import HISTORY_LIMIT, SIGNAL_HISTORY_CHANGED
from custom_components.ambience.history import ChangeHistory

ADD = {"action": "add", "scene_name": "A"}
DEL = {"action": "delete", "scene_name": "B"}


def _cfg(*names):
    return {"scenes": [{"name": n, "category": "general"} for n in names]}


def test_record_pushes_and_exposes_undo(hass):
    h = ChangeHistory(hass)
    assert h.record("house", None, _cfg(), _cfg("A"), ADD) is True
    snap = h.snapshot()
    assert snap["can_undo"] is True
    assert snap["can_redo"] is False
    assert snap["undo"] == {
        "action": "add",
        "scene_name": "A",
        "scope_kind": "house",
        "scope_id": None,
    }
    assert snap["undo_count"] == 1


def test_record_ignores_noop_save(hass):
    h = ChangeHistory(hass)
    assert h.record("area", "a", _cfg("A"), _cfg("A"), ADD) is False
    assert h.snapshot()["can_undo"] is False


def test_record_normalizes_empty_before(hass):
    # Absent/empty before becomes {"scenes": []} so undo truly empties the scope.
    h = ChangeHistory(hass)
    h.record("area", "a", None, _cfg("A"), ADD)
    _kind, _id, before = h.undo()
    assert before == {"scenes": []}


def test_snapshot_excludes_scope_enabled(hass):
    # A save whose config also carries a scope-level `enabled` records only
    # scenes, so undo never reverts an (untracked) scope enable/disable.
    h = ChangeHistory(hass)
    before = {"scenes": [], "enabled": True}
    after = {"scenes": [{"name": "A", "category": "general"}], "enabled": False}
    assert h.record("area", "a", before, after, ADD) is True
    _k, _i, restored = h.undo()
    assert restored == {"scenes": []}  # no "enabled" key


def test_noop_when_only_scope_enabled_differs(hass):
    h = ChangeHistory(hass)
    before = {"scenes": [], "enabled": True}
    after = {"scenes": [], "enabled": False}
    assert h.record("area", "a", before, after, ADD) is False


def test_undo_then_redo_round_trips(hass):
    h = ChangeHistory(hass)
    h.record("floor", "f", _cfg(), _cfg("A"), ADD)
    assert h.undo() == ("floor", "f", {"scenes": []})
    snap = h.snapshot()
    assert snap["can_undo"] is False
    assert snap["can_redo"] is True
    assert snap["redo"]["action"] == "add"
    assert h.redo() == ("floor", "f", _cfg("A"))
    assert h.snapshot()["can_undo"] is True


def test_new_record_clears_redo(hass):
    h = ChangeHistory(hass)
    h.record("house", None, _cfg(), _cfg("A"), ADD)
    h.undo()
    assert h.snapshot()["can_redo"] is True
    h.record("house", None, _cfg(), _cfg("B"), DEL)
    assert h.snapshot()["can_redo"] is False


def test_cap_at_limit_drops_oldest(hass):
    h = ChangeHistory(hass)
    for i in range(HISTORY_LIMIT + 5):
        h.record(
            "house",
            None,
            _cfg(f"S{i}"),
            _cfg(f"S{i + 1}"),
            {"action": "add", "scene_name": f"S{i + 1}"},
        )
    assert h.snapshot()["undo_count"] == HISTORY_LIMIT
    # Oldest five are gone: only the last HISTORY_LIMIT can be undone.
    seen = []
    while (r := h.undo()) is not None:
        seen.append(r[2]["scenes"][0]["name"])
    assert seen[-1] == "S5"  # the oldest still retained
    assert len(seen) == HISTORY_LIMIT


def test_empty_undo_and_redo_return_none(hass):
    h = ChangeHistory(hass)
    assert h.undo() is None
    assert h.redo() is None


def test_discard_undo_drops_without_redo(hass):
    h = ChangeHistory(hass)
    h.record("area", "gone", _cfg(), _cfg("A"), ADD)
    h.discard_undo()
    snap = h.snapshot()
    assert snap["can_undo"] is False
    assert snap["can_redo"] is False


def test_discard_redo_drops(hass):
    h = ChangeHistory(hass)
    h.record("area", "gone", _cfg(), _cfg("A"), ADD)
    h.undo()  # moves the entry onto the redo stack
    h.discard_redo()
    assert h.snapshot()["can_redo"] is False


def test_notify_changed_fires_signal_with_op_scope_and_origin(hass):
    h = ChangeHistory(hass)
    h.record("area", "a", _cfg(), _cfg("A"), ADD)
    received: list = []

    # @callback so async_dispatcher_send runs the listener synchronously inline —
    # a bare lambda is dispatched as an executor job and `received` may not be
    # populated before the assert below (see the dispatcher-test-callback-flake lesson).
    @callback
    def _record(payload: object) -> None:
        received.append(payload)

    unsub = async_dispatcher_connect(hass, SIGNAL_HISTORY_CHANGED, _record)
    origin = object()  # stands in for the originating websocket connection
    h.notify_changed("record", "area", "a", origin)
    unsub()
    assert received == [("record", "area", "a", origin)]


def test_snapshot_marks_is_self(hass):
    h = ChangeHistory(hass)
    assert h.snapshot()["is_self"] is False
    assert h.snapshot(is_self=True)["is_self"] is True
