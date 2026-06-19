"""Canonical list of translation-carrier names shared by the i18n check scripts.

Add a new carrier here whenever a new error-raising helper is introduced so that
both check_exceptions_keys.py and check_no_hardcoded_py.py stay in sync.
"""

CARRIERS: tuple[str, ...] = (
    "AmbienceError",
    "service_validation_error",
    "LastCategoryError",
    "CategoryInUseError",
    "render_en",
)
