# @ojiepermana/angular

Source workspace for `@ojiepermana/angular`, a modular Angular library built as
subpath packages plus build-time generators.

## What The Library Contains

- `@ojiepermana/angular/theme` — design tokens, theme styles, and Material theme helpers.
- `@ojiepermana/angular/component` — reusable UI components and shared primitives.
- `@ojiepermana/angular/layout` — layout primitives for page and app composition.
- `@ojiepermana/angular/navigation` — navigation components, core abstractions, and data helpers.
- `@ojiepermana/angular/chart` — chart primitives for data visualization.
- `@ojiepermana/angular/generator/api` — OpenAPI to Angular SDK generator.
- `@ojiepermana/angular/generator/guide` — Markdown to Angular routes/components generator.

Consumers should import from the subpath that matches the feature they use.

## Workspace Structure

- `projects/angular` — published library source.
- `projects/demo/library` — library showcase and documentation app.
- `projects/demo/etos` — integration/demo app.
- `config/` — generator config examples used during development.

## Development

This workspace uses Bun.

```bash
bun install
bun run build
bun run test
```
