# @ojiepermana/angular

Theme and layout primitives for Angular applications.

This package is organized around secondary entry points. The root TypeScript package is intentionally empty, so application code should not import APIs from `@ojiepermana/angular` directly.

## Current Package Shape

Use these entry points in application code:

- `@ojiepermana/angular/theme/service`
- `@ojiepermana/angular/theme/component`
- `@ojiepermana/angular/theme/directive`
- `@ojiepermana/angular/layout`
- `@ojiepermana/angular/styles/index.css`

Do not import consumer code from:

- `@ojiepermana/angular`
- `@ojiepermana/angular/internal`

## What The Library Provides

- Theme runtime state through `ThemeService` and `provideNgTheme()` for scheme, color, and appearance.
- Theme host mirroring through `ThemeHostDirective`.
- Theme controls through `AppearanceSwitcherComponent`, `ColorPickerComponent`, and `SchemeSwitcherComponent`.
- Layout runtime state through `LayoutService` and `provideNgLayout()` for shell mode and container width.
- Layout host mirroring through `LayoutHostDirective`.
- Reusable shell components through `LayoutVerticalComponent` and `LayoutHorizontalComponent`.
- Layout controls through `LayoutModeSwitcherComponent` and `LayoutContainerSwitcherComponent`.
- A combined stylesheet bundle through `@ojiepermana/angular/styles/index.css`.

## Requirements

The published package currently declares peer dependencies for:

- `@angular/common` `^21.2.0`
- `@angular/core` `^21.2.0`
- `@angular/cdk` `^21.0.0`
- `@angular/material` `^21.0.0`
- `@lucide/angular` `>=1.0.0`
- `tailwindcss` `>=4.0.0`

If you use the layout shells, your application should also already be using Angular Router because the shell components render `RouterOutlet`.

## Runtime Contract

### Theme Runtime

`ThemeService` writes these values to `document.documentElement`:

- `.dark` when the resolved scheme is dark.
- `style.color-scheme` with the resolved browser color scheme.
- `data-theme-scheme`
- `data-theme-color`
- `data-theme-appearance`

Theme persistence keys:

- `theme-scheme`
- `theme-color`
- `theme-appearance`

### Layout Runtime

`LayoutService` writes these values to `document.documentElement`:

- `data-layout-mode`
- `data-layout-container`

Layout persistence keys:

- `layout-mode`
- `layout-container`

Legacy `ng-theme:v2:*` keys are migrated automatically by the owning runtime service when they are read.

## Styling Model

- `@ojiepermana/angular/styles/index.css` is the canonical aggregate bundle for applications. It imports theme first, then layout.
- Consumer applications should import only `@ojiepermana/angular/styles/index.css`.
- Theme and layout stylesheet sources remain internal composition layers behind the aggregate bundle.
- Semantic tokens are the visual source of truth.
- Angular Material is the behavior layer and consumes the shared theme variables.

## Quick Start

### 1. Register Providers

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgLayout } from '@ojiepermana/angular/layout';
import { provideNgTheme } from '@ojiepermana/angular/theme/service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNgTheme({
      defaultScheme: 'system',
      defaultColor: 'brand',
      defaultAppearance: 'flat',
    }),
    provideNgLayout({
      defaultMode: 'vertical',
      defaultContainer: 'boxed',
    }),
  ],
};
```

### 2. Register Styles

```css
@import '@ojiepermana/angular/styles/index.css';
@import 'tailwindcss';
```

Use this aggregate import for consumer applications.

### 3. Compose A Shell

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  LayoutContainerSwitcherComponent,
  LayoutVerticalComponent,
} from '@ojiepermana/angular/layout';
import {
  AppearanceSwitcherComponent,
  ColorPickerComponent,
  SchemeSwitcherComponent,
} from '@ojiepermana/angular/theme/component';

@Component({
  selector: 'app-shell',
  imports: [
    AppearanceSwitcherComponent,
    ColorPickerComponent,
    LayoutContainerSwitcherComponent,
    LayoutVerticalComponent,
    SchemeSwitcherComponent,
  ],
  template: `
    <vertical>
      <nav navigation class="flex h-full w-full flex-col gap-6 px-4 py-5">
        <div class="flex items-center gap-1">
          <appearance-switcher />
          <layout-container-switcher />
          <scheme-switcher />
        </div>

        <color-picker />
      </nav>
    </vertical>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {}
```

### 4. Mirror Runtime State To A Subtree

```html
<section ngtThemeHost ngtLayoutHost>
  <ng-content />
</section>
```

## Entry Point Summary

### `@ojiepermana/angular/theme/service`

- `ThemeService`
- `provideNgTheme`
- `NG_THEME_CONFIG`
- `ThemeScheme`
- `ThemeColor`
- `ThemeColorOption`
- `ThemeAppearance`
- `NgThemeConfig`

### `@ojiepermana/angular/theme/component`

- `AppearanceSwitcherComponent`
- `ColorPickerComponent`
- `SchemeSwitcherComponent`

### `@ojiepermana/angular/theme/directive`

- `ThemeHostDirective`

### `@ojiepermana/angular/layout`

- `LayoutService`
- `provideNgLayout`
- `NG_LAYOUT_CONFIG`
- `LayoutMode`
- `LayoutContainer`
- `NgLayoutConfig`
- `LayoutHostDirective`
- `LayoutVerticalComponent`
- `LayoutHorizontalComponent`
- `LayoutModeSwitcherComponent`
- `LayoutContainerSwitcherComponent`

## Notes For Contributors

- Keep public imports domain-based through the documented secondary entry points.
- Document `@ojiepermana/angular/styles/index.css` as the consumer stylesheet entry point.
- Treat `@ojiepermana/angular/internal` as implementation-only. It exists so library entry points can share code without turning that code into a supported consumer contract.
- Do not add exports to `@ojiepermana/angular` unless the package contract changes intentionally.
- Keep the root README, theme README, layout README, and entrypoint smoke tests aligned whenever the public surface changes.
