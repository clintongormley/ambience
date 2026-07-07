from ambience_mcp.ledger import PreviewLedger, fingerprint


def test_fingerprint_is_deterministic_and_key_order_independent():
    a = fingerprint({"kind": "area", "id": "lr"}, [{"name": "X", "category": "c"}])
    b = fingerprint({"id": "lr", "kind": "area"}, [{"category": "c", "name": "X"}])
    assert a == b
    assert len(a) == 16


def test_fingerprint_changes_when_payload_changes():
    a = fingerprint({"kind": "area", "id": "lr"}, [{"name": "X", "category": "c"}])
    b = fingerprint({"kind": "area", "id": "lr"}, [{"name": "Y", "category": "c"}])
    assert a != b


def test_fingerprint_changes_with_scope():
    a = fingerprint({"kind": "area", "id": "lr"}, [])
    b = fingerprint({"kind": "area", "id": "kitchen"}, [])
    assert a != b


def test_fingerprint_binds_new_categories():
    scope = {"kind": "area", "id": "lr"}
    scenes = [{"name": "X", "category": "c"}]
    base = fingerprint(scope, scenes)
    assert fingerprint(scope, scenes, []) == base  # empty → unchanged (back-compat)
    assert fingerprint(scope, scenes, None) == base
    assert fingerprint(scope, scenes, [{"id": "c", "name": "C"}]) != base


def test_record_then_consume_true_once():
    ledger = PreviewLedger()
    ledger.record("abc")
    assert ledger.consume("abc") is True
    assert ledger.consume("abc") is False


def test_consume_unknown_is_false():
    assert PreviewLedger().consume("nope") is False


def test_ledger_is_bounded_and_evicts_oldest():
    ledger = PreviewLedger()
    oldest = "tok-oldest"
    ledger.record(oldest)
    for i in range(PreviewLedger._MAX):
        ledger.record(f"tok-{i:05d}")
    # recording _MAX further tokens pushes the set past the cap, evicting the oldest
    assert ledger.consume(oldest) is False
    # a recently recorded token is still there
    assert ledger.consume(f"tok-{PreviewLedger._MAX - 1:05d}") is True
