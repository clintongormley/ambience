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


def test_record_then_consume_true_once():
    ledger = PreviewLedger()
    ledger.record("abc")
    assert ledger.consume("abc") is True
    assert ledger.consume("abc") is False


def test_consume_unknown_is_false():
    assert PreviewLedger().consume("nope") is False
