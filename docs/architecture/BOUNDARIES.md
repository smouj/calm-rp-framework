# Dependency Boundaries

## Allowed

```text
apps -> packages
adapters -> packages
packages/contracts -> packages/core
packages/domain-X -> packages/core + contracts
```

## Forbidden

```text
packages -> adapters
packages -> GTA/FiveM natives
packages -> NUI/browser globals
one domain context -> another context's database tables
```

## Runtime rule

Adapters translate between runtime concepts and domain commands/events. They do not own canonical balances, inventories, permissions or persistent ownership.

## Review question

For every new dependency ask: "Could this code still be tested if GTA VI integration disappeared tomorrow?" If not, it probably belongs behind an adapter.
