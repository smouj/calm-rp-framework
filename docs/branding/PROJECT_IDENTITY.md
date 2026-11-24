# Project Identity and Asset Policy

**State:** ACTIVE — unofficial fan/community project  
**Updated:** 2026-11-25

## Positioning

**CALM — Roleplay Framework** is the user-selected **working name** of this independent technical project. The repository is named `calm-rp-framework` so the project title itself carries no third-party trademark. CALM is **not yet trademark-cleared**: the FINOS CALM architecture standard and existing CALM software-related trademarks require review before commercial/official brand registration.

Our own branding must be recognizable, honest and distinguishable from Rockstar Games, Take-Two, Cfx.re and FiveM. A visual resemblance or a prominent disclaimer **does not confer trademark permission**.

## Design direction

Use a clean, technical, restrained identity suitable for documentation, repository badges, eventual tools and contributor guides.

Applied **original** palette (re-derived 2026-11-25 by pixel sampling from the owner's official social banner `site/assets/banner-calm-social.png`, 1280×640; in use on the community site and README badges):

- Banner navy `#101020`: navigation, structure and dark backgrounds (86 % of the dark pixels sampled on the banner band; the favicon set uses the same navy).
- Panel navy `#18192B` (line `#2B2C4A`, muted `#141527`): supporting surfaces and borders.
- Miami pink `#F86080`: highlights, links and active actions — the bright sky pink measured in the banner, chosen over the darker sky tone `#F06080` because it keeps AA contrast on navy.
- Deep rose `#B8476A`: light-theme accent equivalent (banner pink family, AA on light surfaces).
- Banner white `#F8F8F8`: text on dark surfaces (the wordmark white).
- Rose-white `#FAF7F9`: clean light backgrounds.
- Mint `#8CB9AD`: secondary supporting tone for "ready" status accents only.

These colors are not copied from an official Rockstar brand system. Use sufficient contrast and avoid decorative elements that impair readability. Default to typography, spacing and strong information hierarchy before creating large promotional graphics.

**Wordmark:** use our own `CALM` / `ROLEPLAY FRAMEWORK` typography, subject to legal name clearance, in generic typefaces. Do not redraw the official `Grand Theft Auto VI`, Rockstar, FiveM or Cfx.re logos or use a misleading official-looking launch banner.

## Badges and status labels

README badges must describe **real** repository attributes:

- `CI`: linked to the actual GitHub Actions workflow; never hand-label a failing build as green.
- `MIT`: points to the license for original project content only.
- `Research & prototype`: accurate until working features justify another phase.
- `Contributions welcome`: points to the contribution guide.
- `GTA VI runtime unavailable`: clear that no playable compatibility exists.

Badge colors should follow the restrained original palette. Badges are informational, not an endorsement or affiliation indicator.

## Rights and content restrictions

- **use original logomarks** and project-owned assets only;
- never commit Rockstar key art, copyrighted logos, extracted map/model/texture/audio files or screenshots without specific rights;
- avoid presentation that could reasonably be mistaken for official Rockstar documentation or software;
- do not package GTA VI executables, keys, shaders, leaks or other protected material;
- keep the ownership/non-affiliation statement in the README and [TRADEMARKS.md](../../TRADEMARKS.md).

## Organization

The owner-designed banners are versioned with the code in `site/assets/`:

- `banner-calm-social.png` — the official 1280×640 social banner (navy band, Miami-pink scene, white `CALM` wordmark and star). It is the README hero in both languages and the Open Graph/Twitter preview (`og-image.png` is this same banner, already the exact social-card ratio).
- `banner-calm-white.png` — the transparent wordmark source for dark backgrounds (homepage hero).
- `banner-calm-navy.png` — the same wordmark composited on banner navy `#101020` for light surfaces (homepage hero, light theme).

The icon set is **derived from the banner, not redrawn by hand**. The banner star is a tilted five-point star (long point to the right, "shooting star" style) rendered as a white outline; its core traced from the source pixels matches the star core of the social banner with IoU 0.94, confirming both owner banners carry the same star design. `favicon.svg`, `favicon.ico`, `favicon-32.png` and `apple-touch-icon.png` carry that star traced from the source pixels, filled white on banner navy `#101020` for legibility at small sizes, and the header of both pages shows the same traced star inline beside an italic `CALM` wordmark. `logo.svg` is the simplified horizontal lockup: traced star plus generic italic sans wordmark on banner navy.

If further project-owned graphics are created, preserve editable source files and only necessary public exports:

```text
assets/
  brand/
    source/
    export/
  docs/
```

Don't commit fonts without redistribution rights, generated caches, redundant exports or borrowed trademark images.

## Documentation style

Project text must make the distinction between actual features, prototypes, research and blocked GTA VI requirements obvious.

Do not add:

- fake release screenshots or invented performance claims;
- official-looking authority badges or endorsements;
- repetitive disclaimers in every technical section;
- artificial “generated by” signatures;
- generic filler or unattributed copied framework boilerplate.

The goal is a credible, community-owned technical project, not an imitation of a publisher website.
