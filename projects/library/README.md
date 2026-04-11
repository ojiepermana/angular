# Library

`@ojiepermana/angular` is the shared Angular library package for this workspace.

At the moment, the active public implementation in this package is the theme system under the `theme/*` secondary entry points. The root package itself is intentionally empty and acts only as a namespace boundary.

## Current Package Shape

- `@ojiepermana/angular` is intentionally empty.
- `@ojiepermana/angular/theme` is also intentionally empty and exists as a namespace marker.
- Public APIs currently live in these secondary entry points:
  - `@ojiepermana/angular/theme/service`
  - `@ojiepermana/angular/theme/component`
  - `@ojiepermana/angular/theme/directive`
  - `@ojiepermana/angular/theme/layout`
  - `@ojiepermana/angular/theme/styles/index.css`

Do not import library APIs from the root package.

## What Exists Today

The implemented library surface is the theme library.

It currently provides:

- signal-based theme state through `ThemeService`
- `provideNgTheme()` for bootstrap configuration
- a runtime theme contract based on `.dark` and `data-*` attributes
- built-in theme controls such as scheme, appearance, color, and layout switchers
- reusable layout shells for horizontal and vertical navigation
- a shared stylesheet bundle with semantic tokens, color presets, appearance presets, layout rules, utilities, and an internal Angular Material adapter layer

The theme styling model is Tailwind-first.

- use Tailwind utility classes in templates whenever possible
- use direct CSS for token layers, shared selectors, reusable utilities, and internal framework adapters
- treat Angular Material as a behavior layer, while semantic theme tokens remain the visual source of truth

## Requirements

The library currently targets:

- `@angular/common` `^21.2.0`
- `@angular/core` `^21.2.0`
- `@angular/material` `^21.0.0`
- `@angular/cdk` `^21.0.0`
- `@lucide/angular` `>=1.0.0`
- `tailwindcss` `>=4.0.0`

## Usage

Import the stylesheet bundle once in the consuming application:

```css
@import 'tailwindcss';
@import '@ojiepermana/angular/theme/styles/index.css';
```

Configure the theme provider during bootstrap:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgTheme } from '@ojiepermana/angular/theme/service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNgTheme({
      defaultScheme: 'system',
      defaultColor: 'brand',
      defaultAppearance: 'flat',
      defaultLayoutMode: 'vertical',
      defaultLayoutContainer: 'boxed',
      colors: ['brand', 'green', 'orange'],
    }),
  ],
};
```

Use the theme controls and layout shell from their secondary entry points:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AppearanceSwitcherComponent,
  ColorPickerComponent,
  LayoutContainerSwitcherComponent,
  SchemeSwitcherComponent,
} from '@ojiepermana/angular/theme/component';
import { LayoutVerticalComponent } from '@ojiepermana/angular/theme/layout';

@Component({
  selector: 'app-shell',
  imports: [
    AppearanceSwitcherComponent,
    ColorPickerComponent,
    LayoutContainerSwitcherComponent,
    LayoutVerticalComponent,
    SchemeSwitcherComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vertical>
      <nav navigation class="flex flex-col gap-4 p-4">
        <div class="flex items-center gap-2">
          <appearance-switcher />
          <layout-container-switcher />
          <scheme-switcher />
        </div>

        <color-picker />
      </nav>
    </vertical>
  `,
})
export class AppShellComponent {}
```

## Theme Entry Point Summary

### Service

Import from `@ojiepermana/angular/theme/service`.

- `ThemeService`
- `provideNgTheme()`
- `NG_THEME_CONFIG`
- `ThemeScheme`
- `ThemeColor`
- `ThemeColorOption`
- `ThemeAppearance`
- `LayoutMode`
- `LayoutContainer`
- `NgThemeConfig`

### Component

Import from `@ojiepermana/angular/theme/component`.

- `AppearanceSwitcherComponent`
- `ColorPickerComponent`
- `LayoutContainerSwitcherComponent`
- `LayoutModeSwitcherComponent`
- `SchemeSwitcherComponent`
- `ThemeLucideConfigDirective`

### Directive

Import from `@ojiepermana/angular/theme/directive`.

- `ThemeHostDirective`

### Layout

Import from `@ojiepermana/angular/theme/layout`.

- `LayoutHorizontalComponent`
- `LayoutVerticalComponent`

## Theme Runtime Contract

The active theme runtime contract is:

- `.dark`
- `data-theme-scheme`
- `data-theme-color`
- `data-theme-appearance`
- `data-layout-mode`
- `data-layout-container`

This contract is driven by `ThemeService` and mirrored by `ThemeHostDirective` when needed.

## Notes

- Angular framework version in this workspace is `21`.
- The root library package remains empty by design, and that is protected by the entrypoint tests.
- For theme-specific details, see `projects/library/theme/README.md`.
