#!/usr/bin/env bash
# CALM local verification gate.
#
# Runs the same checks CI runs, on the developer machine, with no dependency on
# GitHub Actions, hosted runners or runner quota. Use this as the authoritative
# gate when hosted CI is unavailable (billing, quota, outage or a private repo).
#
#   bash scripts/verify-local.sh          # run every stage
#   bash scripts/verify-local.sh --fast   # skip typecheck/build
#
# Exit code 0 means every stage passed. Any failure prints the failing stage.

set -uo pipefail

FAST=0
[ "${1:-}" = "--fast" ] && FAST=1

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 1

PASS=()
FAIL=()

run_stage() {
  local name="$1"
  shift
  printf '\n\033[1m==> %s\033[0m\n' "$name"
  if "$@"; then
    PASS+=("$name")
    printf '\033[32m    PASS\033[0m %s\n' "$name"
  else
    FAIL+=("$name")
    printf '\033[31m    FAIL\033[0m %s\n' "$name"
  fi
}

need() {
  command -v "$1" >/dev/null 2>&1
}

printf 'CALM local verification\n'
printf 'workspace: %s\n' "$ROOT"

if ! need node; then
  printf '\033[31mnode is required.\033[0m\n'
  exit 2
fi
printf 'node: %s\n' "$(node --version)"

# --- 1. Toolchain ---------------------------------------------------------
run_stage "toolchain" bash -c 'corepack enable >/dev/null 2>&1; corepack prepare "$(node -p "require(\"./package.json\").packageManager")" --activate >/dev/null 2>&1'

# --- 2. Lockfile-consistent install --------------------------------------
if [ ! -d node_modules ]; then
  run_stage "install (frozen lockfile)" pnpm install --frozen-lockfile
else
  printf '\n\033[1m==> install\033[0m\n    node_modules present, skipping\n'
fi

# --- 3. Offline-safe content guardrails ----------------------------------
# These run without the node_modules tree, so they work even if install fails.
run_stage "no proprietary artifacts" bash scripts/check-no-proprietary-artifacts.sh
run_stage "no secrets committed" bash scripts/check-no-secrets.sh
run_stage "site integrity" bash scripts/check-site-integrity.sh

# --- 4. Lint, types, tests, formatting -----------------------------------
run_stage "lint" pnpm lint
if [ "$FAST" -eq 0 ]; then
  run_stage "typecheck" pnpm typecheck
fi
run_stage "tests" pnpm test
run_stage "format check" pnpm format:check
if [ "$FAST" -eq 0 ]; then
  run_stage "build" pnpm build
fi

# --- Summary --------------------------------------------------------------
printf '\n\033[1m==> summary\033[0m\n'
for s in "${PASS[@]:-}"; do [ -n "$s" ] && printf '  \033[32mPASS\033[0m %s\n' "$s"; done
for s in "${FAIL[@]:-}"; do [ -n "$s" ] && printf '  \033[31mFAIL\033[0m %s\n' "$s"; done

if [ "${#FAIL[@]}" -gt 0 ]; then
  printf '\n\033[31mVerification FAILED (%d stage(s)).\033[0m\n' "${#FAIL[@]}"
  exit 1
fi

printf '\n\033[32mVerification PASSED.\033[0m\n'
