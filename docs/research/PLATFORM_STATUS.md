# GTA VI RP / Community Server Platform Status

**Last verified:** 2026-08-30

This document is the project's source-of-truth snapshot for what is publicly confirmed versus what remains unknown. It must be updated before GTA VI-specific adapter work is approved.

## Confirmed

### GTA VI release and currently announced platforms

Rockstar Games currently lists **Grand Theft Auto VI** for **November 19, 2026** on **PlayStation 5** and **Xbox Series X|S**.

Official sources:

- https://www.rockstargames.com/VI
- https://support.rockstargames.com/articles/4QfG4FmZCf5W1gS8jy4UVT/grand-theft-auto-vi-platform-editions-and-versions

### Rockstar recognizes Cfx.re community servers for current GTA titles

Rockstar Support states that authorized Grand Theft Auto roleplay/community servers are supported through the **Cfx.re Platform Server (FXServer)** path for the current supported ecosystem.

Official sources:

- https://support.rockstargames.com/articles/LqoRbLhB9zJsqWt8LQFTK/i-found-an-unofficial-gta-multiplayer-server-will-i-get-in-trouble-for-playing-on-or-hosting-one-of-these-servers
- https://support.rockstargames.com/articles/76vEOw8QDFtbtIxObtR5xM/support-for-rockstar-games-authorized-roleplay-and-community-created-servers
- https://support.cfx.re/hc/en-us/sections/8856819954332-Community-Servers

### Rockstar has a published RP-server policy

Rockstar's public policy recognizes third-party RP servers as community-created experiences while reserving enforcement rights and identifying areas such as IP misuse, certain commercial exploitation, crypto assets and interference with official online services as enforcement priorities.

Official source:

- https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers

### Cfx.re is part of Rockstar Games

Cfx.re announced in 2023 that the team behind FiveM and RedM joined Rockstar Games. In that announcement, Cfx.re explicitly said the partnership was focused on **FiveM and RedM** and told users not to ask them about the next GTA.

Official source:

- https://forum.cfx.re/t/cfx-re-officially-joins-rockstar-games/5158920

## Not publicly confirmed for GTA VI

As of the verification date, this project has **no legitimate public source** confirming any of the following specifically for GTA VI:

- a FiveM-equivalent GTA VI client;
- a GTA VI Cfx.re product name;
- GTA VI community-server binaries;
- GTA VI dedicated-server hosting requirements;
- GTA VI RP APIs;
- GTA VI native-function documentation;
- GTA VI server scripting languages;
- GTA VI resource manifests;
- GTA VI synchronization/entity-ownership semantics;
- GTA VI web/NUI integration;
- GTA VI voice API;
- GTA VI server-side asset streaming/modding API;
- GTA VI anti-cheat hooks for community servers;
- GTA VI community-server authentication/identifier model;
- a GTA VI PC release/runtime suitable for current FiveM-style assumptions.

These items are requirements/unknowns, not TODOs that should be implemented speculatively.

## What current FiveM/RedM can tell us

The existing Cfx.re ecosystem is useful for studying **design patterns**:

- server-authoritative validation;
- client/server event boundaries;
- resource isolation;
- Lua/JavaScript/C# scripting patterns;
- web-based in-game UI patterns;
- entity ownership and synchronization concerns;
- server operations, permissions and moderation;
- common security mistakes in RP resources.

However, no current FiveM/RedM behavior is automatically a GTA VI contract.

## Project policy for rumors and leaks

Rumors, social-media claims, leaked material, private APIs and reverse-engineered Rockstar services must not be promoted to `Confirmed`.

Research entries should be classified as one of:

| State | Meaning |
| --- | --- |
| `CONFIRMED` | Public first-party Rockstar/Cfx.re documentation or announcement |
| `PUBLIC_OBSERVED` | Publicly observable current ecosystem behavior, not a GTA VI guarantee |
| `INFERENCE` | Reasoned planning assumption that must not become an adapter contract |
| `RUMOR` | Unverified; never used as an implementation dependency |
| `UNKNOWN` | Required information has not been publicly established |

## GTA VI integration unlock checklist

Before moving `adapters/gta6` beyond a placeholder, identify public answers for the minimum viable set below:

- [ ] legitimate community-server/runtime path
- [ ] supported host operating systems
- [ ] server lifecycle / binary distribution
- [ ] authentication and player identifiers
- [ ] client/server scripting model
- [ ] supported scripting languages/runtimes
- [ ] event/RPC mechanism
- [ ] entity creation and ownership
- [ ] synchronization/state replication
- [ ] persistence expectations
- [ ] UI/web-view mechanism
- [ ] voice integration path
- [ ] permissions/security model
- [ ] asset/resource packaging rules
- [ ] platform policy / monetization constraints
- [ ] development and production deployment workflow

When those answers become available, update this file first, then create the relevant ADRs and conformance tests.
