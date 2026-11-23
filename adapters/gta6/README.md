# GTA VI Adapter — Reserved

No GTA VI runtime integration is implemented or assumed.

This directory remains a documented placeholder until Rockstar Games and/or Cfx.re publish a legitimate public development/runtime contract relevant to GTA VI community servers or roleplay integration.

## Required evidence before implementation

Before runtime-specific code is added here:

1. the capability must be supported by public first-party evidence recorded in `docs/research/PLATFORM_STATUS.md`;
2. the research must follow `docs/research/RESEARCH_PROTOCOL.md`;
3. the relevant capability in `docs/server/RUNTIME_REQUIREMENTS.md` must move out of `UNKNOWN`;
4. durable architectural coupling must be recorded in an ADR;
5. a neutral adapter contract and conformance tests must exist;
6. game-specific types and APIs must remain outside the core domain.

## Technology evidence is context, not an adapter contract

The project tracks current public Rockstar/Cfx engineering evidence in `docs/research/ROCKSTAR_TECHNOLOGY_BASELINE.md`.

That baseline confirms, among other things, substantial current use of C++ in Rockstar gameplay/graphics/Cfx platform engineering and Lua/JavaScript/C# as current FiveM scripting runtimes. It does **not** unlock this adapter.

Do not infer from that evidence that:

- the future GTA VI community-server adapter must be written in C++;
- Rockstar's internal `game script` is a public scripting API;
- current FiveM Lua/JavaScript/C# runtimes will be available for GTA VI;
- TypeScript used in this repository must match the game-facing runtime;
- a Cfx.re GTA VI product exists.

The adapter implementation language is selected only after `RT-003` and `RT-004` are supported by GTA VI-specific public evidence and the decision is recorded in an ADR.

## Third-party tooling does not unlock the adapter

The [Leonida technical assessment](../../docs/research/LEONIDA_2026-11-23.md) documents useful public research into Xbox file formats, a Windows loader and offline world tooling. Leonida is not a GTA VI community-server runtime, and its repository reports that the game does not yet boot.

No Leonida packages, exported resources, console interfaces or speculative multiplayer hooks may be placed here on that basis. A successful future Leonida boot alone would not establish first-party GTA VI server authorization or the required adapter contracts.

## What may exist here before unlock

Allowed pre-runtime content:

- this documentation;
- neutral interfaces needed to describe the adapter boundary;
- fixtures that contain no proprietary game data;
- conformance-test scaffolding that targets project-owned contracts;
- research notes that clearly remain non-implementation evidence.

Not allowed before unlock:

- invented GTA VI native names or event contracts;
- code that pretends to connect to an unconfirmed runtime;
- leaked/private APIs or services;
- proprietary game code/assets;
- current FiveM/RedM behavior presented as a GTA VI guarantee;
- language/runtime choices justified only by Rockstar's internal technology stack.

The goal is to make GTA VI integration a replaceable boundary, not to predict the runtime before it is documented.
