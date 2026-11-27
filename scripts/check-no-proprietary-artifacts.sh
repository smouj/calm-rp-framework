#!/usr/bin/env bash
# Fails if the Git index or non-ignored working tree contains known proprietary
# game artifact types, or tracked docs link to leak downloads. Runs with bash +
# grep only, so it works without node_modules, network access or a CI runner.

set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.." || exit 1

fail=0

report() {
  printf '\033[31m  blocked: '
  printf '%q' "$1"
  printf '\033[0m\n'
  fail=1
}

# Known executable, package, asset-export and generic archive types. Some
# formats such as ZIP are intentionally blocked because this repository has no
# need to store opaque third-party bundles; approved dependencies use pnpm.
forbidden_extensions='exe dll sys msi msix appx appxbundle msixbundle apk dmg cab rpf rpf9 pkg xex ipa nsp xci xip keys xvc xvd ttpf awc ytd ydr ydd ymap ybn yft ymt ycd ytyp ymf ynv ypt ysc pso psin zip 7z rar tar tgz gz bz2 xz iso torrent'

# Include staged/committed paths and non-ignored untracked files. NUL delimiters
# preserve unusual filenames; %q above prevents terminal control characters.
while IFS= read -r -d '' path; do
  lower_path=${path,,}
  for ext in $forbidden_extensions; do
    case "$lower_path" in
      *."$ext")
        report "forbidden file type .$ext -> $path"
        break
        ;;
    esac
  done

  if [[ "$lower_path" =~ (^|/)(game_?scarlett|gta6?\.exe|all-refs\.bundle)(/|$) ]]; then
    report "suspicious game dump name -> $path"
  fi
done < <(git ls-files --cached --others --exclude-standard -z 2>/dev/null)

# Site and docs must not link to leak downloads.
while IFS= read -r hit; do
  [ -n "$hit" ] && report "possible leak link -> $hit"
done < <(git grep -nEi '(mega\.nz|1fichier|gofile|anonfiles|buzzheavier).*(gta|scarlett|leonida)' -- site docs 2>/dev/null || true)

if [ "$fail" -eq 0 ]; then
  printf '  no proprietary artifacts or leak links found\n'
fi
exit "$fail"
