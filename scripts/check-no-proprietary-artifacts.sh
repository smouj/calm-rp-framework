#!/usr/bin/env bash
# Fails if the working tree contains proprietary game artifacts or references
# that imply GTA VI integration is available. Runs with bash + grep only, so it
# works without node_modules, network access or a CI runner.

set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

fail=0

report() {
  printf '\033[31m  blocked: %s\033[0m\n' "$1"
  fail=1
}

# Executables and archives that must never be committed.
for ext in exe dll rpf rpf9 pkg xex ipa nsp keys; do
  while IFS= read -r hit; do
    [ -n "$hit" ] && report "forbidden file type .$ext -> $hit"
  done < <(git ls-files "*.$ext" 2>/dev/null)
done

# A tracked file named like a leak dump or a game binary.
while IFS= read -r hit; do
  [ -n "$hit" ] && report "suspicious tracked name -> $hit"
done < <(git ls-files 2>/dev/null | grep -Ei '(^|/)(game_?scarlett|gta6?\.exe|all-refs\.bundle)' || true)

# Site and docs must not link to leak downloads.
while IFS= read -r hit; do
  [ -n "$hit" ] && report "possible leak link -> $hit"
done < <(git grep -nEi '(mega\.nz|1fichier|gofile|anonfiles|buzzheavier).*(gta|scarlett|leonida)' -- site docs 2>/dev/null || true)

if [ "$fail" -eq 0 ]; then
  printf '  no proprietary artifacts or leak links found\n'
fi
exit "$fail"
