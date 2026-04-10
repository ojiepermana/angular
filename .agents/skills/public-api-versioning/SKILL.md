---
name: public-api-versioning
description: 'Use when reviewing or changing Angular library exports, barrels, entry points, deprecations, or versioning decisions. Triggers: public api, barrel export, secondary entry point, semver, deprecation, migration guide, breaking change, deep import.'
---

# Public API Versioning

Use this skill for Angular libraries that need stable exports, predictable versioning, and safe API evolution.

## Goals

- Keep the public surface intentional and maintainable
- Prevent accidental export leaks and deep-import coupling
- Make change impact clear for consumers

## Instructions

1. Treat every exported symbol as a contract with downstream consumers.
2. Group exports by domain through stable entry points when the library surface is broad enough to justify separation.
3. Avoid exposing implementation details, experimental helpers, or internal paths through public barrels.
4. Avoid encouraging deep imports from internal files. Consumers should import from supported entry points only.
5. Before removing or reshaping a public API, assess whether the change is breaking and apply semantic versioning accordingly.
6. Prefer deprecation periods, replacement guidance, and migration notes over abrupt removal when consumers are likely to be affected.
7. Keep naming, typing, and overload behavior consistent across related public APIs.
8. When an API change is necessary, update documentation, examples, and tests that represent consumer usage.
9. Add or keep smoke coverage for entry points so accidental export regressions are caught early.
10. If the workspace supports a root barrel and secondary entry points, define clearly which one is canonical for each API family.
