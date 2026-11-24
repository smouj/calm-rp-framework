#!/usr/bin/env bash
# Fails if obviously sensitive material is committed. Conservative on purpose:
# it reports high-signal patterns only, so it does not block on placeholders.

set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

fail=0

scan() {
  local label="$1" pattern="$2"
  while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    case "$hit" in
      *AKIAIOSFODNN7EXAMPLE*|*your-*|*changeme*|*example*|*placeholder*) continue ;;
    esac
    printf '\033[31m  possible %s -> %s\033[0m\n' "$label" "$hit"
    fail=1
  done < <(git grep -nE "$pattern" -- . ':!pnpm-lock.yaml' ':!*.bundle' 2>/dev/null || true)
}

scan "private key" '-----BEGIN ([A-Z]+ )?PRIVATE KEY-----'
scan "AWS access key" '(A3T[A-Z0-9]|AKIA|ASIA)[A-Z0-9]{16}'
scan "GitHub token" '(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})'
scan "generic bearer token" '(bearer|token)[[:space:]]*[=:][[:space:]]*["'"'"'][A-Za-z0-9._-]{30,}'

if [ -f .env ] && git ls-files --error-unmatch .env >/dev/null 2>&1; then
  printf '\033[31m  .env is tracked\033[0m\n'
  fail=1
fi

if [ "$fail" -eq 0 ]; then
  printf '  no committed secrets detected\n'
fi
exit "$fail"
