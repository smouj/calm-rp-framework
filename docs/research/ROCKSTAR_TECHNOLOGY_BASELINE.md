# Rockstar Technology Baseline

**State:** ACTIVE

**Last verified:** 2026-08-31

This document records public, first-party technical evidence from Rockstar Games and Cfx.re that is useful when planning this project.

It is deliberately **not** a claim about GTA VI's final implementation language, future community-server runtime, modding surface or scripting API. The purpose is to distinguish what Rockstar publicly demonstrates about its current engineering stack from what remains unknown for GTA VI.

## Executive conclusion

The strongest public evidence supports the following planning model:

```text
Rockstar game technology
  |
  +-- core gameplay / control systems ------ C++ + "game script"
  +-- rendering / graphics systems --------- C++ + modern graphics APIs
  +-- shader work --------------------------- HLSL and related shader languages
  +-- production / animation tooling -------- C++ and/or C#
  +-- web production tooling ---------------- React + .NET / C#
  +-- online services ------------------------ C#/.NET + SQL + TypeScript/JavaScript
  `-- Cfx.re scripting today ---------------- Lua + JavaScript + C#
```

This establishes a useful **Rockstar/Cfx technology baseline**. It does **not** establish the future GTA VI community-server scripting language.

## Evidence records

### TECH-001 — Gameplay engineering

**Classification:** `CONFIRMED` for current Rockstar engineering practice.

Rockstar Gameplay Programming publicly states that it builds and modifies core gameplay systems and control interfaces using a combination of **C++ and game script**.

**Project relevance:** C++ literacy is strategically useful, while engine-facing assumptions must remain outside the RP domain.

**Limit:** this does not identify GTA VI's complete language set, define the internal `game script`, or expose a public scripting runtime.

### TECH-002 — Graphics engineering

**Classification:** `CONFIRMED` for current Rockstar graphics engineering practice.

Rockstar graphics programmers publicly build and modify rendering systems using **C++** and modern graphics APIs. HLSL is listed among relevant shader-programming skills.

**Project relevance:** C++ and graphics knowledge are low-level game-technology expertise, not server-domain implementation requirements.

**Limit:** this does not document GTA VI renderer internals, GTA VI shader source, the graphics APIs selected by GTA VI, or a modding interface.

### TECH-003 — Production and animation tooling

**Classification:** `CONFIRMED` for current Rockstar tools engineering practice.

Rockstar animation/tools roles publicly use **C++ and/or C#** for tooling that supports exporters, editors and asset-processing pipelines.

**Project relevance:** Rockstar's production environment is multi-language; a tooling language must not be confused with a gameplay or server scripting language.

**Limit:** this does not establish GTA VI gameplay or community-server languages.

### TECH-004 — Online services and web tooling

**Classification:** `CONFIRMED` for current Rockstar online-services engineering practice.

Rockstar Online Services publicly uses **C#/.NET**, SQL and web technologies including **JavaScript/TypeScript + React** for connected services and tooling.

**Project relevance:** TypeScript and C# are normal choices around game services even when low-level game technology is C++.

**Limit:** this does not expose GTA VI online-service contracts or authorize third-party server integration.

### TECH-005 — Cfx.re platform engineering

**Classification:** `CONFIRMED` for current Cfx/Rockstar platform engineering.

Rockstar currently recruits C++ engineers specifically for the **Cfx.re creator platforms**, including FiveM and RedM.

**Project relevance:** creator-platform internals can be implemented in C++ while server resources are exposed through higher-level scripting runtimes.

**Limit:** this does not confirm a GTA VI Cfx product or future GTA VI community-server architecture.

### TECH-006 — Current FiveM scripting runtimes

**Classification:** `CONFIRMED` for current FiveM.

Current Cfx.re/FiveM documentation exposes scripting runtimes for **Lua, JavaScript and C#**.

**Project relevance:** those languages remain useful compatibility knowledge for `adapters/cfx`.

**Limit:** current FiveM runtimes are not a GTA VI scripting guarantee.

### TECH-007 — Cfx.re and Rockstar Games

**Classification:** `CONFIRMED`.

Cfx.re is part of Rockstar Games. Its public joining announcement explicitly scoped the partnership communication to **FiveM and RedM** and declined to provide information about the next GTA.

**Project relevance:** Cfx.re is highly relevant research context, but GTA VI assumptions still require separate evidence.

**Limit:** the acquisition/integration does not itself confirm a GTA VI FiveM-equivalent runtime.

## First-party sources

### Rockstar gameplay engineering

- [Rockstar Games — Senior Gameplay Programmer, Rockstar Australia](https://www.rockstargames.com/kr/careers/openings/position/7695704003)

Relevant public statement: the Gameplay Programming team builds and modifies core gameplay systems and control interfaces using a combination of C++ and game script; the role requires professional C++ game-development experience.

### Rockstar graphics engineering

- [Rockstar Games — Senior Graphics Programmer, Rockstar Australia](https://www.rockstargames.com/fr/careers/openings/position/7617658003)

Relevant public statements: rendering systems and related tools are built, optimized and modified using C++ and modern graphics APIs; HLSL is included among useful shader-programming skills.

### Rockstar production tooling

- [Rockstar Games — Animation Tools Programmer, Rockstar Toronto](https://www.rockstargames.com/intl/careers/openings/position/7632962003)
- [Rockstar Games — Senior Web Developer - Tools, Rockstar North](https://www.rockstargames.com/es/careers/openings/position/7739156003)

Relevant public statements: Rockstar tools supporting animation workflows require C++ and/or C# experience, while web production tools include React front ends and ASP.NET Core/.NET services.

### Rockstar online services

- [Rockstar Games — Full Stack Engineer (C#/React), Rockstar New York](https://www.rockstargames.com/br/careers/openings/position/7711703003)
- [Rockstar Games — Software Engineer (C#/.NET), Rockstar San Diego](https://www.rockstargames.com/careers/openings/position/7734679003)

Relevant public statements: Rockstar Online Services builds connected game services and tooling using C#, MSSQL, JavaScript/TypeScript and React, and builds scalable server-side features in .NET/C# and SQL-backed infrastructure.

### Cfx.re platform engineering and scripting

- [Rockstar Games — Senior Software Engineer, FiveM, Rockstar London](https://www.rockstargames.com/es/careers/openings/position/7806700003)
- [Cfx.re Documentation — Scripting Runtimes](https://docs.fivem.net/docs/scripting-manual/runtimes/)
- [Cfx.re — Cfx.re Officially Joins Rockstar Games](https://forum.cfx.re/t/cfx-re-officially-joins-rockstar-games/5158920)

The Rockstar role supports Cfx.re creator platforms including FiveM and RedM and requires substantial C++ development/debugging experience. Current Cfx.re documentation lists Lua, JavaScript and C# scripting runtimes. The Cfx.re joining announcement confirms the Rockstar relationship while explicitly avoiding claims about the next GTA.

## What this means for GTA VI

### Supported inference

It is reasonable to treat **C++ as strategically important knowledge** for understanding Rockstar's low-level game technology because current Rockstar gameplay, graphics and Cfx platform engineering roles all rely heavily on it.

It is also reasonable to expect Rockstar's production stack to remain multi-language: game code, scripts, shaders, tooling, web applications and online services solve different problems and publicly use different technologies.

These are `INFERENCE` statements for GTA VI, not public GTA VI implementation contracts.

### Not established

The public evidence above does **not** establish any of the following:

- that every part of GTA VI is written in C++;
- the exact implementation or syntax of Rockstar's `game script`;
- that `game script` is exposed to players or community-server developers;
- that GTA VI community servers will support C++, Lua, JavaScript, TypeScript or C#;
- that current FiveM resource manifests, natives, NUI, networking or entity semantics will carry forward unchanged;
- that a GTA VI Cfx.re runtime exists;
- that GTA VI exposes RAGE internals as a public development contract;
- that leaked source, filenames, debug symbols or private tooling represent the final shipping architecture.

Accordingly, `RT-004` (supported scripting languages/runtimes) remains `UNKNOWN` in `server/RUNTIME_REQUIREMENTS.md`.

## Policy for leaked material

Public discussion of the 2022 GTA VI intrusion can motivate research questions, but leaked or stolen source code, private tooling, internal services and unverifiable screenshots are **not admissible implementation evidence** for this repository.

This project will not:

- store leaked source code or proprietary internal files;
- copy internal Rockstar implementation details from stolen material;
- promote leaked filenames, symbols or scripts to `CONFIRMED` runtime contracts;
- design the GTA VI adapter around private or reverse-engineered service interfaces.

If a claim first appears through a leak but is later independently established by legitimate public first-party documentation, the public source — not the leak — becomes the project evidence.

## Project technology decision

The evidence does **not** justify rewriting the RP platform in C++.

Our architecture intentionally separates two concerns:

```text
future GTA VI / creator runtime
          |
          | runtime-specific bridge
          v
     adapters/gta6
          |
          | typed application contracts
          v
 game-agnostic RP domain
          |
          +-- characters
          +-- economy / ledger
          +-- inventory / ownership
          +-- jobs / factions
          +-- police / EMS
          +-- vehicles / properties
          `-- moderation / audit
```

The current project direction therefore remains:

- **TypeScript** for the game-agnostic RP domain, application services, tooling and web-facing interfaces;
- **PostgreSQL** for authoritative durable state;
- **Lua/JavaScript/C# knowledge** inside the Cfx research boundary because they are current public FiveM runtimes;
- **C++ knowledge** as strategically useful for Rockstar/Cfx low-level technology understanding and any future native bridge if a legitimate public GTA VI contract requires one;
- no production GTA VI adapter language decision until `RT-003` and `RT-004` are publicly confirmed.

## Decision rule

When a legitimate GTA VI community-server/runtime path is documented:

1. update `PLATFORM_STATUS.md` with the first-party evidence;
2. update the affected `RT-*` requirements;
3. compare the confirmed runtime against this technology baseline;
4. write an ADR selecting the adapter/runtime language;
5. implement a minimal conformance spike;
6. benchmark interoperability, latency, serialization and operational cost;
7. keep game-specific APIs out of `packages/*` regardless of adapter language.

Until then, the correct engineering state is **prepared but uncommitted**.
