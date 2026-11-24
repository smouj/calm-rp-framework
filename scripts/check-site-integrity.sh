#!/usr/bin/env bash
# Static integrity checks for site/. Replaces the hosted-CI-only validation step
# in .github/workflows/pages.yml with something that runs locally, offline.

set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

fail=0
say() { printf '\033[31m  %s\033[0m\n' "$1"; fail=1; }

for f in site/index.html site/legal.html site/assets/styles.css site/assets/app.js \
  site/assets/favicon.svg site/assets/favicon.ico site/assets/favicon-32.png \
  site/assets/apple-touch-icon.png site/assets/og-image.png; do
  [ -s "$f" ] || say "missing or empty: $f"
done

# Every internal page link must resolve to a real file.
for page in site/index.html site/legal.html; do
  while IFS= read -r target; do
    case "$target" in
      http*|mailto:*|'#'*|'') continue ;;
    esac
    path="${target%%#*}"
    [ -z "$path" ] && continue
    resolved="$(dirname "$page")/$path"
    [ -f "$resolved" ] || say "$page links to missing local file: $target"
  done < <(grep -oE 'href="[^"]+"' "$page" | sed 's/^href="//; s/"$//')
done

# Anchors must have a matching id.
while IFS= read -r anchor; do
  grep -q "id=\"$anchor\"" site/index.html || say "index.html anchor without target: #$anchor"
done < <(grep -oE 'href="#[^"]+"' site/index.html | sed 's/^href="#//; s/"$//' | sort -u)

# No game binaries or proprietary archives referenced by the site.
if grep -R -nIi -E 'game_scarlett_master\.exe|\.rpf9?([^a-z]|$)' site/ >/dev/null 2>&1; then
  say "site references a proprietary game artifact"
fi

# Required legal disclosures must be present on the site.
for needle in 'ausencia de afiliación' 'Rockstar Games' 'Take-Two' 'MIT' 'no autorizado'; do
  grep -qii -- "$needle" site/legal.html || say "legal.html is missing required disclosure: $needle"
done

[ -f site/legal.html ] && ! grep -q 'href="./legal.html"' site/index.html && say "index.html does not link to legal.html"

if [ "$fail" -eq 0 ]; then
  printf '  site integrity OK\n'
fi
exit "$fail"
