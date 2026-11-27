#!/usr/bin/env bash
# Fails if high-signal secrets are present in the Git index or working tree,
# including non-ignored untracked files. Never print candidate values to logs.

set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

fail=0

has_secret_match() {
  local path="$1" pattern="$2" source="$3" label="$4" candidate
  local aws_example='AKIA''IOSFODNN7EXAMPLE'
  local matches

  if [ "$source" = "index" ]; then
    matches=$(git show ":$path" 2>/dev/null | grep -oE -e "$pattern" 2>/dev/null || true)
  else
    matches=$(grep -oE -e "$pattern" -- "$path" 2>/dev/null || true)
  fi

  while IFS= read -r candidate; do
    [ -n "$candidate" ] || continue
    if [ "$label" = "AWS access key" ] && [ "$candidate" = "$aws_example" ]; then
      continue
    fi
    return 0
  done <<< "$matches"
  return 1
}

scan() {
  local label="$1" pattern="$2" path
  while IFS= read -r -d '' path; do
    [ -n "$path" ] || continue
    has_secret_match "$path" "$pattern" index "$label" || continue
    printf '\033[31m  possible %s in staged file ' "$label"
    printf '%q' "$path"
    printf ' (matching content redacted)\033[0m\n'
    fail=1
  done < <(git grep --cached --no-color -I -l -z -E -e "$pattern" -- . 2>/dev/null || true)

  while IFS= read -r -d '' path; do
    [ -f "$path" ] && [ ! -L "$path" ] || continue
    if grep -IqE -e "$pattern" -- "$path" 2>/dev/null && has_secret_match "$path" "$pattern" working-tree "$label"; then
      printf '\033[31m  possible %s in working-tree file ' "$label"
      printf '%q' "$path"
      printf ' (matching content redacted)\033[0m\n'
      fail=1
    fi
  done < <(git ls-files --cached --others --exclude-standard -z)
}

scan "private key" '-----BEGIN ([A-Z]+ )?PRIVATE KEY-----'
scan "AWS access key" '(A3T[A-Z0-9]|AKIA|ASIA)[A-Z0-9]{16}'
scan "GitHub token" '(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})'
scan "generic bearer token" '(bearer|token)[[:space:]]*[=:][[:space:]]*["'"'"'][A-Za-z0-9._-]{30,}'

while IFS= read -r -d '' path; do
  [ "$path" = ".env.example" ] && continue
  name="${path##*/}"
  case "$name" in
    .env|.env.*|*.env|*.env.*)
      printf '\033[31m  environment file must not be committed: '
      printf '%q' "$path"
      printf '\033[0m\n'
      fail=1
      ;;
  esac
done < <(git ls-files --cached -z)

if [ "$fail" -eq 0 ]; then
  printf '  no high-signal secret patterns detected\n'
fi
exit "$fail"
