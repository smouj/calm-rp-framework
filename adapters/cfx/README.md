# Cfx.re Adapter Boundary

This directory is for compatibility experiments using documented/public Cfx.re behavior.

Rules:

- Cfx/FiveM natives stay here.
- Domain rules do not depend on resource/global state.
- Client events are requests, not authority.
- Any reusable concept should be represented as a neutral port/contract first.
- This adapter does not imply GTA VI compatibility.

Lua/CfxLua may be introduced here when a concrete integration slice requires it.
