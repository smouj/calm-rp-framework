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
- current FiveM/RedM behavior presented as a GTA VI guarantee.

The goal is to make GTA VI integration a replaceable boundary, not to predict the runtime before it is documented.
