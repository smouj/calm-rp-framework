# Interoperability, reverse engineering and intellectual property review

**Reviewed:** 24 November 2026 | **Jurisdiction focus:** Spain / European Union  
**Status:** preliminary engineering compliance review, **not individual legal advice or authorization**. Obtain qualified legal counsel before a live GTA VI integration, public release using protected assets or commercial deployment.

## 1. What independent development may do

An independently authored roleplay framework can define original accounts, characters, bank ledger, inventory, jobs, spatial scopes, permissions, commands, simulation and administrative services. Game-independent concepts and independently written software do not require Rockstar's source code.

EU Directive 2009/24/EC, Art. 1(2), and Spanish Intellectual Property Law (Real Decreto Legislativo 1/1996), Art. 96(4), distinguish unprotected software ideas and interface principles from protected program expression. **This is not a blanket right to publish someone else's implementation, assets or confidential interfaces.**

Authoritative texts:

- BOE consolidated law (Arts. 96, 99, 100, 102): https://www.boe.es/buscar/act.php?id=BOE-A-1996-8930
- Directive 2009/24/EC (Arts. 1, 4, 5, 6, 7, 8): https://eur-lex.europa.eu/legal-content/en/TXT/?uri=CELEX:32009L0024

## 2. Observation, interoperability and limits

Spanish Art. 100(3) permits a **lawful user** to observe, study or test program operation to determine underlying ideas/principles **while performing operations they are entitled to perform**.

Art. 100(5) permits certain necessary code reproduction/translation for interoperability of an independently created program only when:

- performed by a lawful user/authorized person;
- necessary information is not readily available;
- activities are confined to the parts indispensable for interoperability.

Art. 100(6) restricts the resulting information to interoperability, restricts disclosure to what is needed and prohibits use to make a substantially similar program expression or otherwise infringe rights. Art. 100(7) safeguards legitimate rightsholder interests. Directive Arts. 5(3), 6 and 8 contain corresponding provisions and limits.

These exceptions **do not automatically legalize accessing leaked game data, bypassing access controls, redistributing decompiled code, hosting a multiplayer service or violating unrelated rights**. Contractual terms, anti-circumvention rules, confidentiality and unfair competition may raise additional issues. A public GitHub repository is not itself a license.

## 3. Rockstar/Cfx product-policy boundary

- Rockstar Mod Guidelines (10 Sep 2026): https://www.rockstargames.com/es/community-resources/mod-guidelines
- Rockstar support: authorized RP services are tied to the Cfx.re/FXServer framework; other GTA Online services are described as unauthorized: https://support.rockstargames.com/articles/LqoRbLhB9zJsqWt8LQFTK/i-found-an-unofficial-gta-multiplayer-server-will-i-get-in-trouble-for-playing-on-or-hosting-one-of-these-servers
- Cfx Creator Platform License Agreement (12 Jan 2026): https://static.cfx.re/platform-license-agreement-12-jan-2026.pdf

Current GTA V/FiveM authorization **does not extend automatically to GTA VI**. A research project or local simulator is not a supported online game server. A real GTA VI network adapter stays blocked until Rockstar/Cfx first-party evidence establishes an authorized runtime contract and terms permit its operation.

## 4. Repository evidence hygiene

| Input                                                                                                                  | Policy                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Official Rockstar/Cfx API descriptions                                                                                 | May be cited and used to design independent interfaces **for the documented supported product only**                                      |
| Public technical descriptions of archive formats and data structures                                                   | Use narrow, attributed **facts and high-level insights** after assessing lawful access, provenance, license and certainty                 |
| Original project-authored synthetic tests/fixtures                                                                     | Allowed                                                                                                                                   |
| Third-party open-source code                                                                                           | May be reused **only after verifying its actual license**, attribution obligations and compatibility with MIT; do not assume GitHub = MIT |
| Decompiled code, executable dumps, keys, models, game scripts, maps or textures from unauthorized GTA VI distributions | Do **not** import, redistribute, mirror, paste into tests, publish hashes as endorsement, or ship with tools                              |
| Offsets, internal native signatures or private protocols alleged to originate in a leak                                | Do not treat as authorized public contracts; escalate for provenance and legal review, avoid implementing them                            |
| External GitHub README claims                                                                                          | Cite as claims by the third party; do not promote to verified Rockstar runtime facts without independent, legitimate evidence             |

The public `Qbox-project/qbx_core` and `overextended/ox_inventory` repositories currently declare GPL-3.0. Their published **function names and behavioral documentation** may inform our independent design, but directly copying GPL-licensed implementation into the MIT-only project is not acceptable without a separate, competent license-compliance decision. See https://github.com/Qbox-project/qbx_core and https://github.com/overextended/ox_inventory.

Do not copy a project such as SixNG (GPL-3.0) directly into this MIT workspace. The repo does not currently need to copy any third-party implementation.

## 5. Clean-room workflow

1. Document a functional need using **our own terminology** (e.g. `session.resolve`).
2. Link the primary public source and its product scope; distinguish documented FiveM operations from GTA VI unknowns.
3. Record research origin, date, upstream commit and license status. Keep third-party source code out of implementation patches unless separately reviewed.
4. Author project-owned interfaces, adapters and synthetic fixtures; avoid unauthorized asset/function-name dumps.
5. Add fail-closed tests for unsupported capabilities, identity checks and money/ownership invariants.
6. Before a Rockstar-facing release, request written legal review and verify official authorization, intellectual property and terms.

## 6. Branding and distribution

The MIT license applies **only** to this project's independently created code/docs. It does not license GTA VI, its trademarks, maps, models or other protected content. Use original branding; do not imply endorsement or call the project a working FiveM for GTA VI. Our current website is an informational/static demonstration, not an in-game modification.

**Release gate:** do not switch this private repository to public until its complete history and content have passed the existing publication checklist, legal/provenance review and working CI validation.
