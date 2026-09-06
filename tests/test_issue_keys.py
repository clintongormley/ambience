"""Pin the exact set of `issues.*` ids the code can raise against strings.json.

`bin.check_exceptions_keys` only sees a LITERAL `translation_key=` on
`async_create_issue(...)`, but both real Repairs call sites pass a
variable/constant, so the gate reports "0 issue key(s)" and can't catch an
`issues.*` entry going missing or unused. This test does that instead: the
raisable set is derived from the code (so it tracks refactors) and asserted
equal to the defined `issues` section — catching both a raisable key missing
from strings.json and a defined key nothing raises.
"""

import json
from pathlib import Path

from bin.check_exceptions_keys import defined_keys
from custom_components.ambience.config_health_issues import _NEW_KINDS
from custom_components.ambience.const import STORAGE_UNREADABLE_ISSUE

_STRINGS = Path("custom_components/ambience/strings.json")

# The two `translation_key = "..."` literal branches in
# `config_health_issues.reconcile_issues` (missing_entity / action_overlap
# problem kinds). Mirror them here; _NEW_KINDS covers every other branch.
_LITERAL_BRANCH_KEYS = {"missing_entity", "action_overlap"}


def test_raisable_issue_keys_match_strings_json():
    raisable = set(_NEW_KINDS) | _LITERAL_BRANCH_KEYS | {STORAGE_UNREADABLE_ISSUE}
    defined = defined_keys(json.loads(_STRINGS.read_text()), "issues")
    missing = raisable - defined
    unused = defined - raisable
    assert not missing, (
        f"issue keys raisable in code but missing from strings.json: {sorted(missing)}"
    )
    assert not unused, (
        f"issue keys defined in strings.json but nothing raises them: {sorted(unused)}"
    )
