# Changelog

Significant changes will be recorded here after review and merge. Releases will describe verified, tested functionality and limitations.

## Unreleased

- Research: the 25-Nov research pass is published — a GTA VI capability matrix (20 verified RAGE 9 format/engine findings with confidence, method, limits and CALM consequence, plus an 8-row platform-event matrix), an uncertainty register (16 open unknowns with closing triggers), a pattern-by-pattern architecture comparison against FiveM/RedM, QBCore/Mantle, Qbox and ESX, and an evidence-based roadmap revision proposal; the Leonida takedown is verified as a Take-Two DMCA claim against a 3,007-repository network and the watch set gains GTA6-Asset-Info and enforcement actions.
- Brand: the owner's official 1280×640 social banner is now the README hero in both languages (`site/assets/banner-calm-social.png`) and the Open Graph/Twitter preview (`og-image.png` is that same banner, already the exact social-card ratio).
- Brand: every surface is re-derived from the social banner palette by pixel sampling — banner navy `#101020`, Miami pink `#F86080` (bright sky tone, AA on navy), deep rose `#B8476A` light accent, banner white `#F8F8F8` — replacing the earlier indigo/salmon set in `styles.css`, `theme-color` metas, README badges and `PROJECT_IDENTITY.md`.
- Site: both page headers show the official traced star beside an italic `CALM` wordmark instead of the abstract four-bar mark; the star is the same traced geometry as the favicon set.
- Brand: the favicon set is regenerated on the banner navy `#101020` (`favicon.svg`, `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`); the traced star core matches the social banner star core with IoU 0.94 (same owner design), and `logo.svg` keeps the horizontal lockup on navy.
- Site: the light-theme hero wordmark chip is composited on banner navy (`banner-calm-navy.png`) replacing the retired indigo export; the dark theme keeps the transparent white wordmark.
- Docs: a verified improvement-goals register (`GOALS.md` / `GOALS.es.md`) records the audited baseline of the repository and the published site plus goals G1–G6 with checkable success criteria; both READMEs link it.
- Brand: the favicon set is derived from the official banner instead of a hand-approximated mark: the banner star (tilted five-point, white on night indigo) is traced from the source pixels into `favicon.svg`, `favicon.ico`, `favicon-32.png` and `apple-touch-icon.png` (trace IoU 0.96), so every surface shows the same star as the README banner.
- Site: `index.html` ships the complete icon links plus Open Graph and Twitter card metas backed by a new `og-image.png` composed from the full official banner on indigo; `site/README.md` now records the verified published state of Pages (HTTP 200) instead of the pre-publication note.
- Site: the browser-only economy calculator demo is retired; the page keeps its informational role and every interactive limit without the toy transfer form.
- Site: the former demo section becomes an engineering overview of the actual monorepo layout, the eleven Vitest suites and the local verification gates, all content verifiable against the repository.
- Docs: legal pages and operations notes no longer describe the removed interactive demo; the static, no-data-collection statement now matches the published site exactly.
- Brand: the CALM banner is now a repository-owned asset in both READMEs (`site/assets/banner-calm-white.png` source, `banner-calm-indigo.png` export) instead of an unversioned user-attachment URL (#39).
- Site: the community site shows the CALM banner logo on the homepage hero, with white-on-dark and indigo-chip variants switched by the existing theme mechanism (#40).
- Brand: all surfaces use the applied banner palette (night indigo, warm salmon, deep coral, warm cream) — README badges, `theme-color` metas, hero glow and the documented palette in `PROJECT_IDENTITY.md` (#41).
- Docs: hosted-CI status lines in both READMEs now record the verified passing state of the `validate` workflow; local verification remains the authoritative gate.
- Preparing public community positioning, documentation, contributor policies and a clear fan-project/IP disclaimer.
- Existing domain, simulator, infrastructure and GTA VI integration constraints remain at their actual implementation maturity.

**No playable GTA VI multiplayer release has been published by this project.**
