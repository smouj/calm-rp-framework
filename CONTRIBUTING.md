# Contributing to GTA VI RP Platform

Thanks for helping build an independent, community-led roleplay foundation. **All skill levels are welcome.** This project is early-stage: contributions should improve testable source code, tooling, documentation or research rather than promise an unverified GTA VI multiplayer capability.

Read our [Code of Conduct](./CODE_OF_CONDUCT.md), [scope](./docs/PROJECT_SCOPE.md), [governance](./GOVERNANCE.md) and [trademark policy](./TRADEMARKS.md) before contributing.

## Where to start

- **First contribution:** fix unclear documentation, improve accessibility, add a simulator test, or reproduce a small bug.
- **Bug:** open an issue with the failing revision and minimum steps to reproduce.
- **Feature:** describe the problem and proposed behavior before starting a large PR.
- **Platform research:** cite primary Rockstar/Cfx sources, date them, record remaining unknowns and classify evidence.
- **Security:** never report vulnerabilities publicly; use [SECURITY.md](./SECURITY.md).

Browse [good first issues](https://github.com/smouj/gta6-rp-platform/labels/good%20first%20issue) or [help wanted](https://github.com/smouj/gta6-rp-platform/labels/help%20wanted). If those lists are empty, propose a bounded improvement.

## Set up your environment

You need Node.js 22+ and pnpm 10.34.5. **No GTA VI game files or tools are required.**

```bash
git clone https://github.com/<YOUR_USERNAME>/gta6-rp-platform.git
cd gta6-rp-platform
corepack enable
corepack prepare pnpm@10.34.5 --activate
pnpm install --frozen-lockfile
pnpm check
```

Optional local infrastructure:

```bash
docker compose -f infrastructure/docker/compose.yml up -d
```

This verifies the _foundation_, not a GTA VI runtime. Never include local secrets or game data in test fixtures.

## Contribution workflow

1. Open or choose an issue; discuss significant interface changes before implementation.
2. Fork and create a short-lived branch: `feat/...`, `fix/...`, `docs/...`, `test/...`, `research/...`, or `security/...`.
3. Keep the change focused. Follow the [architecture](./ARCHITECTURE.md) and accepted ADRs.
4. Add tests for behavior or security invariants; document externally visible changes.
5. Run `pnpm check` and record the outcome honestly. If it fails, describe where and why.
6. Open a PR against `main`, complete the template and link the issue.
7. Respond to review feedback. Maintainers merge approved contributions only after valid checks.

Conventional Commit examples: `feat(simulator): model session expiration`, `fix(core): reject invalid transfer`, `docs(research): verify official runtime guidance`.

## Engineering standards

- Keep GTA/Cfx-specific code out of domain packages.
- Treat clients as untrusted; validate commands and ownership on the server.
- Use typed contracts, migrations and testable state transitions.
- Use integer minor units for money; ensure idempotency and auditability for sensitive changes.
- Prefer simple modules before microservices or untested plugin APIs.
- Avoid new dependencies unless necessary; pin and review the changes to lockfiles.
- Do not reformat unrelated files or rewrite existing ADR history silently.
- Clearly distinguish **implemented**, **prototype**, **research**, **proposed** and **blocked** features.

## Evidence and game-data restrictions

Public research into GTA VI assets or third-party tools such as Leonida **does not** establish a supported modding interface or grant permission to distribute the game's materials.

Do **not** submit:

- game archives, executables, ripped models/textures/audio, keys, derived shaders, proprietary data exports or leaks;
- private Rockstar APIs, stolen credentials, bypasses or game-service abuse code;
- official logos or copied promotional graphics used as project branding;
- invented GTA VI event, native, networking or scripting contracts;
- secrets, access tokens, private addresses, personal data or reproduction logs containing these.

Use synthetic mock data and project-owned assets. Cite original public sources for research.

## Licensing and attribution

By submitting a contribution, you confirm that you have the right to license it under this repository's [MIT license](./LICENSE) and that you have complied with any dependencies' licenses. Keep copyright notices where required; indicate material third-party sources explicitly.

The MIT license does **not** cover Rockstar intellectual property.

## Reviews, conduct and releases

Maintainers may ask for changes or decline proposals that are unsafe, unsupported, off-scope or legally uncertain. Contributors should not expect an immediate response or a fixed release date. Follow [GOVERNANCE.md](./GOVERNANCE.md) for decisions and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for respectful collaboration.

Do not claim a green CI result unless the final head actually completed tests. GitHub runners failing before starting jobs are an infrastructure blocker, **not** verification.
