from bin.check_no_hardcoded_ts import main, violations


def test_flags_static_title():
    assert violations('html`<button title="Show more"></button>`')


def test_allows_localized_title():
    assert not violations('html`<button title=${localize(h,"ui.x","X")}></button>`')


def test_flags_text_node():
    assert violations("html`<div>Scene evaluation</div>`")


def test_allows_interpolated_text_node():
    assert not violations('html`<div>${localize(h,"ui.x","X")}</div>`')


def test_ignores_arrow_functions():
    assert not violations("items.map((r) => renderScene(r))")


def test_allowlisted_placeholder_ok():
    assert not violations('html`<input placeholder="entity_id" />`')


def test_i18n_ignore_exempts():
    assert not violations("html`<div>Literal</div>`  // i18n-ignore")


def test_real_tree_is_clean():
    assert main() == 0
