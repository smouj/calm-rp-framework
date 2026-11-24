# GitHub Pages release and verification

**Status at 24 November 2026: LIVE.**
The site is published at **https://smouj.github.io/calm-rp-framework/** and every page and asset was
verified returning HTTP 200:
`/`, `/legal.html`, `/assets/styles.css`, `/assets/app.js`.

The repository was made **public** by the owner's decision (the project is non-commercial), which is
what unlocked Pages: GitHub does not offer Pages for a private repository on the free plan.

## What is published

- `site/index.html` and `site/legal.html`, with original HTML/CSS/JS under `site/assets/`.
- A local-only economy demo. No Rockstar assets, no external scripts, no fonts, no analytics.
- The legal notice covers non-affiliation, MIT scope, no game server, official source links,
  the local-only theme setting and third-party hosting.

## How deployment works

`.github/workflows/pages.yml` publishes `site/` on every push to `main` that touches `site/`, and on
manual dispatch. It:

1. Detects whether Pages is enabled for the repository and **skips cleanly** if not, instead of
   failing on every push.
2. Validates the static site with `scripts/check-site-integrity.sh` (the same check the local gate
   runs).
3. Configures Pages, uploads the artifact and deploys.

All actions are pinned to full commit SHAs, as this repository requires.

### Version note (resolved)

The first deployment failed with _"No artifacts named github-pages were found"_ even though the
artifact uploaded successfully. That is an incompatibility in the v4 Pages action stack. Bumping
`configure-pages` to v6.0.0, `upload-pages-artifact` to v5.0.0 and `deploy-pages` to v5.0.1 (PR #35)
fixed it; the next run completed with `success`.

### Transient deploy failures (observed 2026-11-24)

A push can still fail at the `Deploy to GitHub Pages` step with the same _"No artifacts named
github-pages were found"_ message even when the artifact uploaded successfully moments earlier in
the same run ([run 45498265539](https://github.com/smouj/calm-rp-framework/actions/runs/45498265539):
artifact 14970456041 uploaded and finalized, then `Found 0 artifact(s)` on the fetch). This is a
transient GitHub API inconsistency, not a site or workflow defect: the action's own guidance is to
check githubstatus.com and re-run the deployment, or simply let the next `site/**` push deploy —
the two immediately following runs completed with `success`. The site-integrity gate still runs
before upload, so this failure mode says nothing about the published content.

## Re-verifying after a change

```bash
bash scripts/check-site-integrity.sh                  # static checks, offline
curl -sS -o /dev/null -w '%{http_code}\n' https://smouj.github.io/calm-rp-framework/legal.html
```

A deployed site is not a legal opinion. The non-affiliation notices must stay on the page; the site
integrity check fails the build if they are removed.

## Why Actions is not the verification gate

The account's Actions quota was exhausted, and jobs failed before a runner was assigned. The
authoritative gate is `bash scripts/verify-local.sh`; Pages deployment is a publishing step, not
proof that the code is correct. See `LOCAL_VERIFICATION.md`.
