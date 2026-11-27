# Improvement Goals — Repository and Community Site

**State:** ACTIVE improvement register (scope corrected to GTA VI-first CALM on 2026-11-27 — see [ADR-0009](./docs/adr/0009-gta-vi-first-product-scope.md); G1, G4 and G6 were completed on 2026-11-25)
**Created:** 2026-11-25
**Companion to:** [ROADMAP.md](./docs/roadmap/ROADMAP.md) (product direction). This file fixes quality goals for the repository and the GitHub Pages site, each with a verified baseline and a checkable success criterion.

Every baseline claim below was checked on 2026-11-25 against the live site and the repository itself; the verification method is stated next to each claim.

## Verified baseline (2026-11-25)

- **Pages is published and serving**: `https://smouj.github.io/calm-rp-framework/`, `/legal.html` and the referenced assets returned HTTP 200 (direct live checks).
- **The live site serves the current CALM Essentials content** (re-verified 2026-11-25 by a direct, cache-busted fetch of `/index.html`): the published page shows the `03 / INGENIERÍA` section and the framework framing, and no `Laboratorio` section remains. A first, un-busted fetch still returned the retired demo from an intermediate cache, so verification method for future deploy doubts: re-fetch with a cache-buster before declaring a deployment failed.
- **Palette coherence holds**: every color token in `site/assets/styles.css` equals the documented palette in `docs/branding/PROJECT_IDENTITY.md`; the palette is re-derived by pixel sampling from the owner's official social banner, and the banner band navy is pixel-verified `#101020`.
- **The banner star is white, tilted and five-pointed** (long point to the right): verified by pixel analysis and by an independent vision-model description of the banner.
- **The icon set diverged from the banner before this batch**: `favicon.svg` and `logo.svg` used a filled salmon star and Georgia serif text instead of the banner star.
- **The historical test-count claim was accurate on 2026-11-25**: 18 Vitest test files existed at that baseline. On 2026-11-27, the workspace contains 20 test files; the exact run outcome is recorded in `docs/operations/RELEASE_READINESS_2026-11-27.md`.
- **The deploy workflow is valid**: `.github/workflows/pages.yml` parses correctly and triggers on `site/**` changes to `main`.

## Goals

### G1 — Publish the pending site work

**Status: DONE (2026-11-25, #45).** The verified engineering overview and the banner-derived
icon batch are merged and deployed; the published homepage shows the "Ingeniería" section and
the new assets return HTTP 200.

**Goal:** merge and deploy the verified engineering overview and the banner-derived icon batch.
**Done when:** the published homepage shows the "Ingeniería" section, the new assets return HTTP 200, and the `Deploy community site` workflow has succeeded once after the merge.

### G2 — One brand across every surface

**Goal:** the same star from the README banner appears on every surface: browser tab, bookmarks, iOS home screen and social previews.
**Applied in this batch:** the owner's official social banner (1280×640) becomes the README hero and the Open Graph/Twitter preview; the palette of every surface is re-derived from that banner (navy `#101020`, Miami pink `#F86080`, banner white); the favicon set is traced from the banner pixels (star core IoU 0.94 against the social banner core) on the banner navy, and both page headers show the traced star beside an italic `CALM` wordmark; the identity policy records the derivation.
**Done when:** G1 is published and the icon and header logo render in each context; any future brand change updates banner, favicon, header logo and README in the same commit.

### G3 — Keep the published information contrasted and verified

**Goal:** every public claim (site, READMEs) stays checkable against the repository.
**Method:** the existing gates already enforce part of this (`tests/site-hygiene.test.ts`, `scripts/check-site-integrity.sh`, `bash scripts/verify-local.sh`); the status note in `site/README.md` records the verified publication state.
**Done when:** the gates pass on every change and status notes carry the verification date and method.

### G4 — Branch hygiene per BRANCH_RETIREMENT.md

**Status: DONE for the 2026-11-25 cleanup.** The named historical branches were verified and
retired then. This work uses a temporary review branch; it must be removed after merge. Any other
local-only snapshot branches are listed in the dated triage note until their content is verified
as represented and they can be safely retired.

**Goal:** keep `main` as the only lasting integration branch, with short-lived, reviewable PR branches.
**Done when:** merged work is on `main`, its review branch is retired, and no unexplained local-only branches remain.

### G5 — Open Issues and PRs triage

**Status: DONE (2026-11-27 triage).** Issue #2 is the only open issue and remains assigned to
`smouj` for repository-owner security and provenance checks. Issues #32 and #54 are closed as
completed, and no pull request is open. See `docs/operations/ISSUE_TRIAGE_2026-11-27.md`.

**Goal:** no stale issues or PRs; every open item carries an owner and a verification step.
**Done when:** a dated triage note is recorded (the repository pattern for this is `docs/operations/PR24_CI_TRIAGE.md`).

### G6 — Re-verify after publication

**Status: DONE (2026-11-25).** `docs/operations/GITHUB_PAGES_DEPLOYMENT.md` now records the
deployed asset list with fresh HTTP 200 checks (`/`, `/legal.html`, `styles.css`, `app.js`,
`favicon.svg`, `banner-calm-social.png`, `og-image.png`).

**Goal:** after G1 deploys, update `docs/operations/GITHUB_PAGES_DEPLOYMENT.md` with the new asset list and fresh HTTP 200 checks.
**Done when:** that document records the deploy date and every new asset returning 200.

## Permanent constraints (unchanged)

- Published statements are verified before being written; the local gate `bash scripts/verify-local.sh` is the authoritative check and hosted CI is a convenience.
- No Rockstar/Take-Two/Cfx.re assets, no leaked material and no invented compatibility claims; the MIT license covers original content only.
- The site stays static and informative: it does not run the TypeScript core or persist data.
- Evidence levels (official confirmation / third-party observation / independent reproduction / inference) stay attached to any research claim, as practiced in `docs/research/`.
