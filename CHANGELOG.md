# Changelog

Significant changes will be recorded here after review and merge. Releases will describe verified, tested functionality and limitations.

## Unreleased

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
