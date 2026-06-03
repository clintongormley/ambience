# Single source of truth for the gate commands used by humans, the pre-push
# hook (.githooks/pre-push), and CI. Coverage thresholds live in their configs
# (pyproject.toml fail_under for Python, vitest.config.ts for the frontend) so
# raising them propagates here automatically.
.PHONY: lint-py lint-js translations docs-check coverage-py coverage-js build-check install-hooks

lint-py:        ## Fast: ruff lint + format check
	ruff check . && ruff format --check .

lint-js:        ## Fast: biome lint+format check + tsc type-check
	npm run ci && npm run check

translations:   ## strings.json <-> translations key parity
	python -m scripts.check_translations

docs-check:     ## fail if the generated reference doc is stale
	python -m scripts.gen_reference_docs

coverage-py:    ## backend tests + coverage gate (fail_under in pyproject.toml)
	python -m pytest tests/ --cov=custom_components.ambience --cov-report=term-missing

coverage-js:    ## frontend tests + coverage gate (thresholds in vitest.config.ts)
	npm run coverage

build-check:    ## rebuild bundle and fail if the committed output differs
	npm run build && git diff --exit-code custom_components/ambience/frontend/

install-hooks:  ## point git at the committed hooks
	sh scripts/install-hooks.sh
