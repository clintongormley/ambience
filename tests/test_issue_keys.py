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

from bin.check_exceptions_keys import defined_keys, translation_key_literals
from custom_components.ambience.config_health_issues import _NEW_KINDS
from custom_components.ambience.const import STORAGE_UNREADABLE_ISSUE

_STRINGS = Path("custom_components/ambience/strings.json")
_ISSUES_SRC = Path("custom_components/ambience/config_health_issues.py")


def test_raisable_issue_keys_match_strings_json():
    # The literal-branch keys (currently missing_entity / action_overlap) come
    # from AST-scanning the code's `translation_key = "..."` assignments, not a
    # hard-coded mirror — so a typo'd literal becomes an undefined key here
    # rather than passing silently. _NEW_KINDS covers the problem.kind branch;
    # STORAGE_UNREADABLE_ISSUE is raised outside this module.
    literal_branch_keys = translation_key_literals(_ISSUES_SRC.read_text())
    assert literal_branch_keys, "no translation_key literals scanned from config_health_issues.py"
    raisable = set(_NEW_KINDS) | literal_branch_keys | {STORAGE_UNREADABLE_ISSUE}
    defined = defined_keys(json.loads(_STRINGS.read_text()), "issues")
    missing = raisable - defined
    unused = defined - raisable
    assert not missing, (
        f"issue keys raisable in code but missing from strings.json: {sorted(missing)}"
    )
    assert not unused, (
        f"issue keys defined in strings.json but nothing raises them: {sorted(unused)}"
    )
