# Single source of truth for the gate commands used by humans, the pre-push
# hook (.githooks/pre-push), and CI. Coverage thresholds live in their configs
# (pyproject.toml fail_under for Python, vitest.config.ts for the frontend) so
# raising them propagates here automatically.
.PHONY: lint-py lint-js translations ui-strings i18n coverage-py coverage-js build-check install-hooks

lint-py:        ## Fast: ruff lint + format check
	ruff check . && ruff format --check .

lint-js:        ## Fast: biome lint+format check + tsc type-check
	npm run ci && npm run check

translations:   ## strings.json <-> translations key parity
	python -m bin.check_translations

ui-strings:     ## frontend ui.* localize keys <-> i18n-data.ts bundle parity
	python -m bin.check_ui_strings

i18n:           ## all i18n gates: key parity + shipped-locale completeness + no-hardcoded lints
	python -m bin.check_translations
	python -m bin.check_ui_strings
	python -m bin.check_exceptions_keys
	python -m bin.check_no_hardcoded_py
	python -m bin.check_no_hardcoded_ts

coverage-py:    ## backend tests + coverage gate (fail_under in pyproject.toml)
	python -m pytest tests/ --cov=custom_components.ambience --cov-report=term-missing

coverage-js:    ## frontend tests + coverage gate (thresholds in vitest.config.ts)
	npm run coverage

build-check:    ## rebuild bundle and fail if the committed output differs
	npm run build && git diff --exit-code custom_components/ambience/frontend/

install-hooks:  ## point git at the committed hooks
	sh bin/install-hooks.sh
