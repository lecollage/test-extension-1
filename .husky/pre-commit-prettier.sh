#!/usr/bin/env bash

set -euo pipefail

mapfile -t staged_files < <(
  git diff --cached --name-only --diff-filter=ACMR |
    grep -E '\.(ts|tsx|js|mjs|cjs|css|html|json|md|ya?ml)$' || true
)

if [ ${#staged_files[@]} -eq 0 ]; then
  exit 0
fi

npx prettier --write "${staged_files[@]}"
git add "${staged_files[@]}"
