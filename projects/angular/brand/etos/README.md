# Etos Brand

Etos is isolated as a brand umbrella entrypoint under `projects/angular/brand/etos`.

Use this folder for Etos-specific implementation:

- `core/` contains Etos provider composition and brand defaults.
- `themes/` contains Etos color, style, layout, and component-facing CSS.
- `layouts/` contains Etos shell components.
- `navigation/`, `components/`, `assets/`, and `docs/` can be added when Etos needs brand-specific behavior beyond shared primitives.

Shared services, types, and primitives stay in the generic libraries:

- `@ojiepermana/angular/theme`
- `@ojiepermana/angular/layout`
- `@ojiepermana/angular/navigation`

## Package usage

Published consumers should import Etos through the short public entrypoint:

```ts
import { type EtosBrandOptions, EtosLayoutComponent, provideEtosBrand } from '@ojiepermana/angular/etos';

export const etosBrandConfig = {
  theme: { mode: 'light' },
  layout: { mode: 'vertical' },
} satisfies EtosBrandOptions;

export const appConfig = {
  providers: [provideEtosBrand(etosBrandConfig)],
};
```

```ts
@Component({
  imports: [EtosLayoutComponent],
  template: `<etos-layout />`,
})
export class Pages {}
```

App CSS should import the Etos package stylesheet before Tailwind:

```css
@import '@ojiepermana/angular/etos/styles';
@import 'tailwindcss';
@import '@ojiepermana/angular/theme/tailwind/theme.css';
```

## Workspace usage in this repository

The Etos demo under `projects/demo/etos` already uses the short TypeScript entrypoint:

- `src/app/app.config.ts` imports `provideEtosBrand` from `@ojiepermana/angular/etos`.
- `src/pages/pages.ts` imports `EtosLayoutComponent` from `@ojiepermana/angular/etos`.

For CSS, the workspace demo currently imports the Etos source stylesheet directly:

```css
@import '../../../angular/brand/etos/themes/index.css';
@import 'tailwindcss';
@import '@ojiepermana/angular/theme/tailwind/theme.css';
```

That local CSS path is intentional while developing inside this monorepo. Angular resolves bare CSS package imports from `node_modules/@ojiepermana/angular`, while TypeScript imports in the demo resolve through `tsconfig.json` path aliases. After the package is built, published, and installed with the latest exports, consumers should use `@ojiepermana/angular/etos/styles`.

The older `@ojiepermana/angular/theme/styles/etos.css` path is kept only as a compatibility shim.
