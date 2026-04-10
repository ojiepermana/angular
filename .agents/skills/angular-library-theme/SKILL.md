---
name: angular-library-theme
description: 'Use when defining Angular Material override strategy, global theme variable mapping, or global dark-mode behavior in Angular. Triggers: material override strategy, theme variable mapping, global dark mode, theme host directive, scheme switcher, appearance token, theme stylesheet entry.'
---

# Angular Library Theme

Use this as a delta skill for Angular projects that already rely on the general Angular and Tailwind skills.

## Use this skill for

- Mapping semantic theme variables into Angular Material tokens
- Designing global light and dark scheme switching through root attributes or root variables
- Deciding where shared theme primitives and Material overrides should live
- Reviewing whether component styling leaks mode logic or hardcoded visual values

## Do not use this skill for

- General Angular component architecture, signals, routing, forms, or testing guidance
- Generic Tailwind component composition or responsive layout advice
- Broad public API design that should instead use `public-api-versioning`

## Instructions

1. Treat Angular Material as the behavior layer. Keep visual styling in shared theme variables and shared override stylesheets.
2. Keep dark-mode switching global. Components may expose state, but styling decisions must resolve through root-level variables rather than template-local `dark:` classes.
3. In application code, prefer Tailwind utility classes directly in templates for layout and visual composition.
4. In library code, choose the styling surface by scope: shared or global styling belongs in `.css` files or token layers, while small local cases may use inline class or style bindings, or local component styles, when that is clearer and more maintainable.
5. Use theme variables for surfaces, borders, shadows, focus rings, and state colors. Avoid raw visual values outside token definitions.
6. Put shared theme primitives in shared theme stylesheets or token layers.
7. Put Angular Material overrides in dedicated override stylesheets grouped by component or concern.
8. Prefer exposed Angular Material or MDC tokens and supported selectors before deep overrides.
9. Avoid `::ng-deep` unless no supported alternative exists and the reason is documented.
10. Use this skill together with `angular-developer` for Angular code patterns, `tailwind-design-system` for application-side utility composition, `design-token-governance` for token structure, and `public-api-versioning` for export design.

## Companion skills available in this workspace

- `material-harness-testing`
- `accessibility-audit`
- `design-token-governance`
- `public-api-versioning`
