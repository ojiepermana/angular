---
title: Etos Brand System
order: 1
description: Etos brand implementation boundary and design-system contract.
---

Etos is implemented under `projects/angular/etos`.

Consumers import the Etos brand through `@ojiepermana/angular/etos`.

Inside this repository, the demo app in `projects/demo/etos` uses `@ojiepermana/angular/etos` for TypeScript imports, but still imports `projects/angular/etos/themes/index.css` directly for global CSS because Angular resolves bare CSS package imports from the installed `node_modules/@ojiepermana/angular` package.

All Etos-specific theme CSS, layout shells, provider composition, and future brand customizations should live in that folder. Shared services, contracts, and primitives remain in the generic theme, layout, and navigation libraries.

Primary source files:

- `projects/angular/etos/core` for `provideEtosBrand` and defaults.
- `projects/angular/etos/themes` for Etos color, style, and layout CSS.
- `projects/angular/etos/layouts` for Etos-specific shell components.

The compatibility path `@ojiepermana/angular/theme/styles/etos.css` should not receive new Etos implementation work; it delegates to the brand umbrella stylesheet.
