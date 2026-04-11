# Theme Library

Reusable theme state, layout shells, theme controls, and shared CSS tokens for `@ojiepermana/angular`.

## Entry Points

The theme package is organized by domain-specific secondary entry points.

- `@ojiepermana/angular/theme` is intentionally empty and acts only as a namespace marker.
- `@ojiepermana/angular/theme/service` exports `ThemeService`, `provideNgTheme`, `NG_THEME_CONFIG`, and the theme types.
- `@ojiepermana/angular/theme/component` exports the built-in theme controls and `ThemeLucideConfigDirective`.
- `@ojiepermana/angular/theme/directive` exports `ThemeHostDirective`.
- `@ojiepermana/angular/theme/layout` exports `LayoutHorizontalComponent` and `LayoutVerticalComponent`.
- `@ojiepermana/angular/theme/styles/index.css` exports the shared stylesheet bundle.

Do not import theme APIs from `@ojiepermana/angular` root.
Do not import runtime APIs from `@ojiepermana/angular/theme` root.

## Requirements

This library currently targets the following peer dependencies:

- `@angular/common` `^21.2.0`
- `@angular/core` `^21.2.0`
- `@angular/material` `^21.0.0`
- `@angular/cdk` `^21.0.0`
- `@lucide/angular` `>=1.0.0`
- `tailwindcss` `>=4.0.0`

## Quick Start

Import the theme stylesheet bundle once in the consuming application:

```css
@import 'tailwindcss';
@import '@ojiepermana/angular/theme/styles/index.css';
```

Provide the theme configuration during application bootstrap:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgTheme } from '@ojiepermana/angular/theme/service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNgTheme({
      defaultLayoutMode: 'vertical',
      defaultLayoutContainer: 'boxed',
    }),
  ],
};
```

Use one of the layout shells and the built-in controls in your shell component:

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
      <nav navigation>
        <appearance-switcher />
        <layout-container-switcher />
        <scheme-switcher />
        <color-picker />
      </nav>
    </vertical>
  `,
})
export class AppShellComponent {}
```

## Public API

### Service Entry Point

Import from `@ojiepermana/angular/theme/service`.

- `ThemeService`
- `provideNgTheme(config?: Partial<NgThemeConfig>)`
- `NG_THEME_CONFIG`
- `ThemeScheme`
- `ThemeColor`
- `ThemeAppearance`
- `LayoutMode`
- `LayoutContainer`
- `NgThemeConfig`

`ThemeService` exposes signal-based state for:

- `scheme`
- `color`
- `appearance`
- `layoutMode`
- `layoutContainer`
- `resolvedScheme`

It also exposes setters for every axis plus `toggleScheme()`.

In the browser, the service persists values to `localStorage` with the default prefix `ng-theme` and mirrors the active state to `document.documentElement` using these attributes:

- `theme-schemes`
- `theme-colors`
- `theme-appearances`
- `layout-mode`
- `layout-container`

### Runtime Theme Attributes

These five attributes are the runtime contract between `ThemeService` and the stylesheet system.

| Attribute           | Purpose                                                     | Current Values                                              | Behavior                                                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme-schemes`     | Controls light and dark mode selection.                     | `light`, `dark`, `system`                                   | The default value is `system`, so the active scheme follows the current OS preference. When set to `light` or `dark`, the theme explicitly overrides the OS setting.                                       |
| `theme-colors`      | Controls the main color family used by the theme.           | `brand`, `blue`, `green`, `red`, `cyan`, `purple`, `orange` | This axis feeds the shared theme palette and Angular Material system tokens such as primary, secondary, and tertiary colors.                                                                               |
| `theme-appearances` | Controls the visual treatment of the interface.             | `flat`, `glass`                                             | This axis changes shared appearance variables and can affect the UI down to component level, including shells and Material-based elements such as cards, tables, buttons, and other overridden components. |
| `layout-mode`       | Controls how navigation is presented in the main shell.     | `vertical`, `horizontal`, `empty`                           | Use `vertical` for sidebar navigation and `horizontal` for top navigation. `empty` is available for views without a navigation shell.                                                                      |
| `layout-container`  | Controls how the main layout is placed inside the viewport. | `full`, `boxed`                                             | `full` stretches the shell to the browser edges. `boxed` constrains the shell and adds symmetric outer spacing so the layout reads as a centered container.                                                |

`ThemeService.resolvedScheme` exposes the effective light or dark result after the `system` value is resolved against the user's OS preference.

### Component Entry Point

Import from `@ojiepermana/angular/theme/component`.

| Export                             | Selector                                       | Behavior                                                                                                        |
| ---------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `AppearanceSwitcherComponent`      | `<appearance-switcher />`                      | Toggles `flat` and `glass` appearance modes.                                                                    |
| `ColorPickerComponent`             | `<color-picker />`                             | Renders the built-in theme palette buttons for `brand`, `blue`, `green`, `red`, `cyan`, `purple`, and `orange`. |
| `LayoutContainerSwitcherComponent` | `<layout-container-switcher />`                | Toggles the layout container between `full` and `boxed`.                                                        |
| `LayoutModeSwitcherComponent`      | `<layout-mode-switcher />`                     | Opens a menu for `vertical`, `horizontal`, and `empty` layout modes.                                            |
| `SchemeSwitcherComponent`          | `<scheme-switcher />`                          | Calls `ThemeService.toggleScheme()` and reflects the current scheme icon.                                       |
| `ThemeLucideConfigDirective`       | `hostDirectives: [ThemeLucideConfigDirective]` | Provides Lucide config with `absoluteStrokeWidth: true` and `strokeWidth: 1.35`.                                |

### Directive Entry Point

Import from `@ojiepermana/angular/theme/directive`.

- `ThemeHostDirective` mirrors the current theme attributes onto any host element with `ngtThemeHost`.

Example:

```html
<section ngtThemeHost class="appearance-shell">Preview content</section>
```

### Layout Entry Point

Import from `@ojiepermana/angular/theme/layout`.

| Export                      | Selector       | Content Slots                                            | Notes                                                                                                |
| --------------------------- | -------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `LayoutHorizontalComponent` | `<horizontal>` | `[headerBrand]`, `[headerNavigation]`, `[headerActions]` | Applies `layout-mode="horizontal"` and renders child routes inside its internal `<router-outlet />`. |
| `LayoutVerticalComponent`   | `<vertical>`   | `[navigation]`                                           | Applies `layout-mode="vertical"` and renders child routes inside its internal `<router-outlet />`.   |

`LayoutMode` also supports `empty`, but there is currently no dedicated empty shell component in this package.

## Theme Configuration

`NgThemeConfig` defines the initial state for the theme service.

| Option                   | Default    | Supported Values / Notes                                                                                                                |
| ------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultScheme`          | `system`   | `light`, `dark`, `system`. The default follows the active OS theme until the user explicitly chooses a fixed mode.                      |
| `defaultColor`           | `brand`    | `brand`, `blue`, `green`, `red`, `cyan`, `purple`, `orange`. This selects the primary color family used across the theme system.        |
| `defaultAppearance`      | `flat`     | `flat`, `glass`. This controls the visual surface style that is propagated through shared appearance variables and component overrides. |
| `defaultLayoutMode`      | `vertical` | `vertical`, `horizontal`, `empty`. This controls whether navigation is rendered as a sidebar, a top bar, or omitted.                    |
| `defaultLayoutContainer` | `full`     | `full`, `boxed`. `full` reaches the viewport edges, while `boxed` applies a centered container with outer spacing.                      |
| `storageKey`             | `ng-theme` | Prefix used for persisted values in `localStorage`                                                                                      |
| `colors`                 | optional   | Present in the exported config type. The packaged `ColorPickerComponent` currently renders the fixed built-in palette list above.       |

## Styling Model

The stylesheet bundle in `styles/index.css` imports files in this order:

1. `_base.css`
2. `_colors.css`
3. `_schemes.css`
4. `_appearances.css`
5. `_layout.css`
6. `overrides/index.css`

The override aggregator in `styles/overrides/index.css` then forwards to the grouped override bundles under `styles/overrides/`. The current grouped bundle is `styles/overrides/material-ui/index.css`.

Those layers provide the following responsibilities:

- `_base.css` maps the theme palette into Angular Material system tokens, defines shared utility classes, and sets baseline host display rules for `<horizontal>` and `<vertical>`.
- `_colors.css` defines the supported palette values for the `theme-colors` attribute.
- `_schemes.css` controls `color-scheme` for `light`, `dark`, and `system`.
- `_appearances.css` maps `flat` and `glass` into shared `--appearance-*` variables.
- `_layout.css` defines the layout shell variables and the structure for horizontal, vertical, full, and boxed layouts.
- `overrides/index.css` is the override aggregator for grouped stylesheet bundles.
- `overrides/material-ui/index.css` loads the Angular Material override bundle.

The `material-ui` override bundle currently includes overrides for:

- badge
- button
- card
- checkbox
- chips
- datepicker
- dialog
- expansion
- form-field
- input
- list
- menu
- paginator
- progress
- radio
- select
- sidenav
- slide-toggle
- snackbar
- stepper
- table
- tabs
- toolbar
- tooltip
- tree

## Authoring Notes

- Keep imports domain-based and use the narrowest public entry point available.
- Keep shared theme primitives in `styles/_*.css` and grouped override bundles under `styles/overrides/*/`.
- Angular Material override files currently live in `styles/overrides/material-ui/*.css`.
- Use `@lucide/angular` for library icons. The built-in controls already standardize icon configuration through `ThemeLucideConfigDirective`.
- Component source filenames in this library omit the `.component` suffix, for example `appearance-switcher.ts`, `horizontal.ts`, and `vertical.ts`.
