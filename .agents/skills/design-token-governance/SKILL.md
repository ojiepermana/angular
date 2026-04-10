---
name: design-token-governance
description: 'Use when defining, reviewing, or refactoring design tokens, CSS variables, semantic theme values, or light and dark mode mappings. Triggers: design token, css variable, theme token, semantic color, token naming, token governance, dark mode mapping.'
---

# Design Token Governance

Use this skill to keep an Angular design system consistent, scalable, and maintainable through stable tokens and variable layering.

## Goals

- Keep visual values centralized and reusable
- Prevent hardcoded design drift in components and templates
- Support global light and dark themes without component-level branching

## Instructions

1. Prefer semantic tokens over raw values in component code. Components should ask for intent, not literal colors or shadows.
2. Use clear token layers when the system needs them, such as foundation, semantic, and component tokens.
3. Name tokens by purpose rather than by one-off usage or temporary brand decisions.
4. Keep light and dark mode differences in the global token mapping layer instead of component templates.
5. Add tokens for full interaction coverage, including hover, focus, active, selected, disabled, error, and surface elevation states.
6. Reuse an existing token before creating a new one. New tokens should solve a repeatable design problem.
7. Avoid hardcoded visual values in templates, component styles, and override files unless the value is truly non-themable.
8. Document token ownership and intended usage so future changes do not break unrelated surfaces.
9. When a token must evolve, prefer deprecation and migration guidance over abrupt removal.
10. Review token changes across responsive layouts and both color schemes before considering the work complete.
