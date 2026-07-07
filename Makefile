# Single source of truth for the gate commands used by humans, the pre-push
# hook (.githooks/pre-push), and CI. Coverage thresholds live in their configs
# (pyproject.toml fail_under for Python, vitest.config.ts for the frontend) so
# raising them propagates here automatically.
.PHONY: lint-py lint-js lint-md format-md translations ui-strings i18n coverage-py coverage-js mcp-tests build-check ai-docs ai-docs-check install-hooks

# Markdown formatter, pinned for reproducible output (matches the editor venv).
# Run via uvx so no local install/PATH setup is needed — only `uv`. The
# mkdocs plugin is what gives the 4-space list-continuation indent.
MDFORMAT := uvx --from mdformat==1.0.0 \
	--with mdformat-gfm==1.0.0 \
	--with mdformat-mkdocs==5.1.4 \
	--with mdformat-frontmatter==2.1.2 \
	mdformat

lint-py:        ## Fast: ruff lint + format check
	ruff check . && ruff format --check .

lint-js:        ## Fast: biome lint+format check + tsc type-check
	npm run ci && npm run check

lint-md:        ## Fast: markdown format check (wrap/exclude from .mdformat.toml)
	git ls-files -z '*.md' '*.markdown' | xargs -0 $(MDFORMAT) --check

format-md:      ## Apply markdown formatting (AI/generated docs excluded via .mdformat.toml)
	git ls-files -z '*.md' '*.markdown' | xargs -0 $(MDFORMAT)

translations:   ## strings.json <-> translations key parity
	python -m bin.check_translations

ui-strings:     ## frontend ui.* localize keys <-> i18n-data.ts bundle parity
	python -m bin.check_ui_strings

i18n:           ## all i18n gates: key parity + shipped-locale completeness + no-hardcoded lints
	python -m bin.check_translations
	python -m bin.check_ui_strings
	python -m bin.check_i18n_placeholders
	python -m bin.check_i18n_fallbacks
	python -m bin.check_exceptions_keys
	python -m bin.check_no_hardcoded_py
	python -m bin.check_no_hardcoded_ts

coverage-py:    ## backend tests + coverage gate (fail_under in pyproject.toml)
	python -m pytest tests/ --cov=custom_components.ambience --cov-report=term-missing

coverage-js:    ## frontend tests + coverage gate (thresholds in vitest.config.ts)
	npm run coverage

mcp-tests:      ## mcp-server unit tests (isolated deps via uv, so no manual setup)
	cd mcp-server && uv run --extra test python -m pytest -q

build-check:    ## rebuild bundle and fail if the committed output differs
	npm run build && git diff --exit-code custom_components/ambience/frontend/

ai-docs:        ## regenerate the code-derived AI knowledge-pack sections
	python -m bin.gen_ai_docs

ai-docs-check:  ## regenerate AI docs and fail if the committed output is stale
	python -m bin.gen_ai_docs && git diff --exit-code docs/developers/ai-authoring/ ai/skill/ custom_components/ambience/ai_guide/

install-hooks:  ## point git at the committed hooks
	sh bin/install-hooks.sh
