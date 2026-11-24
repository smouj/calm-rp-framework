# Improvement Goals — Repository and Community Site

**State:** ACTIVE improvement register
**Created:** 2026-11-25
**Companion to:** [ROADMAP.md](./docs/roadmap/ROADMAP.md) (product direction). This file fixes quality goals for the repository and the GitHub Pages site, each with a verified baseline and a checkable success criterion.

Every baseline claim below was checked on 2026-11-25 against the live site and the repository itself; the verification method is stated next to each claim.

## Verified baseline (2026-11-25)

- **Pages is published and serving**: `https://smouj.github.io/calm-rp-framework/`, `/legal.html` and the referenced assets returned HTTP 200 (direct live checks).
- **The live site serves the previous content**: it still shows the retired "Laboratorio" demo because the local commit replacing it with the verified engineering overview has not been merged or published yet.
- **Palette coherence holds**: every color token in `site/assets/styles.css` equals the documented palette in `docs/branding/PROJECT_IDENTITY.md`, and the indigo banner background is pixel-verified `#1B1C3A`.
- **The banner star is white, tilted and five-pointed** (long point to the right): verified by pixel analysis and by an independent vision-model description of the banner.
- **The icon set diverged from the banner before this batch**: `favicon.svg` and `logo.svg` used a filled salmon star and Georgia serif text instead of the banner star.
- **The site claims are true**: the 11 Vitest suites exist and the monorepo tree shown matches the actual `packages/`, `apps/`, `adapters/`, `infrastructure/` and `tests/` directories.
- **The deploy workflow is valid**: `.github/workflows/pages.yml` parses correctly and triggers on `site/**` changes to `main`.

## Goals

### G1 — Publish the pending site work

**Goal:** merge and deploy the verified engineering overview and the banner-derived icon batch.
**Done when:** the published homepage shows the "Ingeniería" section, the new assets return HTTP 200, and the `Deploy community site` workflow has succeeded once after the merge.
**Owner:** the repository owner (write access); the batch sits on the local branch `feat/site-engineering-section`, ready for review.

### G2 — One brand across every surface

**Goal:** the same star from the README banner appears on every surface: browser tab, bookmarks, iOS home screen and social previews.
**Applied in this batch:** favicon set traced from the banner pixels (IoU 0.96 against the real core), `apple-touch-icon.png`, and `og-image.png` composed from the full banner; the identity policy records the derivation.
**Done when:** G1 is published and the icon renders in each context; any future brand change updates banner, favicon and README in the same commit.

### G3 — Keep the published information contrasted and verified

**Goal:** every public claim (site, READMEs) stays checkable against the repository.
**Method:** the existing gates already enforce part of this (`tests/site-hygiene.test.ts`, `scripts/check-site-integrity.sh`, `bash scripts/verify-local.sh`); the status note in `site/README.md` records the verified publication state.
**Done when:** the gates pass on every change and status notes carry the verification date and method.

### G4 — Branch hygiene per BRANCH_RETIREMENT.md

**Goal:** return to the single-`main` model documented in `docs/operations/BRANCH_RETIREMENT.md`.
**Blocked by:** write access (stale local branches and their remote counterparts cannot be deleted without it).
**Done when:** `brand/palette-coherence`, `docs/*`, `feat/site-logo`, `test/simulator-player-directory` and `smouj-patch-1` are deleted after confirming their content is merged or obsolete, and only `main` remains.

### G5 — Open Issues and PRs triage

**Goal:** no stale issues or PRs; every open item carries an owner and a verification step.
**Blocked by:** repository API access to list, comment and close.
**Done when:** a dated triage note is recorded (the repository pattern for this is `docs/operations/PR24_CI_TRIAGE.md`).

### G6 — Re-verify after publication

**Goal:** after G1 deploys, update `docs/operations/GITHUB_PAGES_DEPLOYMENT.md` with the new asset list and fresh HTTP 200 checks.
**Done when:** that document records the deploy date and every new asset returning 200.

## Permanent constraints (unchanged)

- Published statements are verified before being written; the local gate `bash scripts/verify-local.sh` is the authoritative check and hosted CI is a convenience.
- No Rockstar/Take-Two/Cfx.re assets, no leaked material and no invented compatibility claims; the MIT license covers original content only.
- The site stays static and informative: it does not run the TypeScript core or persist data.
- Evidence levels (official confirmation / third-party observation / independent reproduction / inference) stay attached to any research claim, as practiced in `docs/research/`.
