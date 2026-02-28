#!/usr/bin/env bash

set -euo pipefail

mapfile -t staged_files < <(
  git diff --cached --name-only --diff-filter=ACMR |
    grep -E '\.(ts|tsx|js|mjs|cjs)$' || true
)

if [ ${#staged_files[@]} -eq 0 ]; then
  exit 0
fi

npx vitest related --run "${staged_files[@]}"
