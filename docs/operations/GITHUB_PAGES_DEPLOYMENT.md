# GitHub Pages release and verification

**Status at 24 Nov 2026:** site source exists on `main`, deployment **not confirmed**. GitHub Actions workflows on recent `main` heads failed before any runner job step ran. The repo is **private**. Do not publish a made-up URL or mark the site as live.

## What is already committed

- `site/index.html`, `site/assets/` with original HTML/CSS/JS, a local-only economy demo and no Rockstar assets.
- `site/legal.html` independent notice: non-affiliation, MIT/original code, no game server, official source links, local-only theme setting and third-party hosting caveat.
- `.github/workflows/pages.yml` static publishing of `site/` with minimal permissions and SHA-pinned GitHub Actions.

## Required owner-side actions

1. Check your GitHub account plan and whether Pages is available for this **private** repository. If Pages on private repos is not available, choose an appropriate eligible plan, or explicitly approve a separate, audited public static-site repository. Do **not** change this repository's visibility automatically.
2. Open **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Under Actions, run `Deploy community site` manually, or commit a reviewed change to `site/`.
4. Resolve [CI execution blocker #33](https://github.com/smouj/gta6-rp-platform/issues/33) if the Pages job also fails before runner allocation. Diagnose from GitHub's actual annotations, settings and quota; do not assume a workflow code defect.
5. Confirm `deploy` completed with a real runner, artifact upload and successful `actions/deploy-pages` step.
6. Only after step 5, visit the URL shown on GitHub Pages; test legal links, mobile/desktop layout, keyboard access, HTTP status, theme persistence and browser demo.
7. Only after successful deployment, populate the repository's **About → Website** field with that verified URL.

Pages may be a public website even when the repository is private: do not place secrets or non-public code in `site/`. Site source itself should be reviewed as an intentionally published artifact. A notice does not itself grant permissions to use Rockstar rights.

This is a deployment guide, not evidence that the published URL exists today.
