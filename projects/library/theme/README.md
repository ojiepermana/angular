# Theme Library

Reusable theme state, layout shells, theme controls, and shared styling tokens for `@ojiepermana/angular`.

## Entry Points

The theme package is intentionally split by responsibility.

- `@ojiepermana/angular/theme` is an empty namespace marker.
- `@ojiepermana/angular/theme/service` exports theme state, providers, tokens, and theme types.
- `@ojiepermana/angular/theme/component` exports the built-in controls and `ThemeLucideConfigDirective`.
- `@ojiepermana/angular/theme/directive` exports `ThemeHostDirective`.
- `@ojiepermana/angular/theme/layout` exports `LayoutHorizontalComponent` and `LayoutVerticalComponent`.
- `@ojiepermana/angular/theme/styles/index.css` exports the shared stylesheet bundle.

Do not import theme APIs from `@ojiepermana/angular` root.
Do not import runtime APIs from `@ojiepermana/angular/theme` root.

## Styling Contract

The current theme system is built around semantic tokens and a Tailwind-first authoring model.

- Semantic tokens are the source of truth for colors, surfaces, borders, radius, and focus state.
- `.dark` controls resolved dark mode.
- `data-*` attributes control the active scheme, color preset, appearance preset, layout mode, and layout container mode.
- Tailwind utility classes should be the default for template authoring.
- Direct CSS is reserved for token layers, layout selectors, reusable cross-template utilities, dashboard primitives, and the internal Angular Material adapter layer.

The stylesheet bundle also exposes semantic tokens through `@theme inline`, so utilities such as `bg-background`, `text-foreground`, and `border-border` can be mapped from the shared theme variables.

Legacy files under `styles/_*.css` and `styles/overrides/` are still present in the repository for migration reference, but they are not imported by `styles/index.css` anymore.

## Quick Start

Import the shared stylesheet bundle once in the consuming application:

```css
@import 'tailwindcss';
@import '@ojiepermana/angular/theme/styles/index.css';
```

Provide the theme configuration during bootstrap:

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

Use a layout shell and the built-in controls in an application shell:

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

## Service API

Import from `@ojiepermana/angular/theme/service`.

### Exports

- `ThemeService`
- `provideNgTheme(config?: Partial<NgThemeConfig>)`
- `NG_THEME_CONFIG`
- `ThemeScheme`
- `ThemeColor`
- `ThemeColorOption`
- `ThemeAppearance`
- `LayoutMode`
- `LayoutContainer`
- `NgThemeConfig`

### ThemeService State

`ThemeService` exposes signal-based state for:

- `scheme`
- `color`
- `appearance`
- `layoutMode`
- `layoutContainer`
- `resolvedScheme`
- `colorOptions`

It also exposes setters for each axis plus `toggleScheme()`, which cycles `light -> dark -> system -> light`.

Persistence uses the pattern `storageKey:storageVersion:axis`, with the default key prefix `ng-theme:v2:*`.

## Runtime Contract

The stylesheet bundle reads the following runtime contract from the root element.

| Selector                | Purpose                  | Values                                                      | Notes                                                                |
| ----------------------- | ------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------- |
| `.dark`                 | Resolved dark mode state | present or absent                                           | Applied from `ThemeService.resolvedScheme()`.                        |
| `data-theme-scheme`     | User preference source   | `light`, `dark`, `system`                                   | `system` follows the current OS preference.                          |
| `data-theme-color`      | Active color preset      | `brand`, `blue`, `green`, `red`, `cyan`, `purple`, `orange` | Restrict the built-in picker with `NgThemeConfig.colors`.            |
| `data-theme-appearance` | Active surface preset    | `flat`, `glass`                                             | Controls shell surfaces, elevated surfaces, and backdrops.           |
| `data-layout-mode`      | Navigation chrome state  | `vertical`, `horizontal`, `empty`                           | `empty` is a programmatic content-only mode that hides shell chrome. |
| `data-layout-container` | Shell placement mode     | `full`, `boxed`                                             | `boxed` constrains shell width and adds outer padding.               |

When `ThemeHostDirective` is attached to a custom container, the same runtime contract is mirrored onto that host.

## Component API

Import from `@ojiepermana/angular/theme/component`.

| Export                             | Selector                                       | Behavior                                                                                                                                                            |
| ---------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppearanceSwitcherComponent`      | `<appearance-switcher />`                      | Toggles between `flat` and `glass`.                                                                                                                                 |
| `ColorPickerComponent`             | `<color-picker />`                             | Renders only the color presets exposed by `ThemeService.colorOptions()`.                                                                                            |
| `LayoutContainerSwitcherComponent` | `<layout-container-switcher />`                | Toggles between `full` and `boxed`.                                                                                                                                 |
| `LayoutModeSwitcherComponent`      | `<layout-mode-switcher />`                     | Opens a menu for the supported shell layouts: `vertical` and `horizontal`. If layout state is set to `empty` elsewhere, the button reflects that as `Content Only`. |
| `SchemeSwitcherComponent`          | `<scheme-switcher />`                          | Opens a menu for `light`, `dark`, and `system`.                                                                                                                     |
| `ThemeLucideConfigDirective`       | `hostDirectives: [ThemeLucideConfigDirective]` | Standardizes Lucide icons with `absoluteStrokeWidth: true` and `strokeWidth: 1.35`.                                                                                 |

## Layouts And Directive

Import `ThemeHostDirective` from `@ojiepermana/angular/theme/directive`.

```html
<section ngtThemeHost class="appearance-shell rounded-3xl p-6">Preview content</section>
```

Import layout shells from `@ojiepermana/angular/theme/layout`.

| Export                      | Selector       | Content Slots                                            | Notes                                                                                                              |
| --------------------------- | -------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `LayoutHorizontalComponent` | `<horizontal>` | `[headerBrand]`, `[headerNavigation]`, `[headerActions]` | Sets `data-layout-mode="horizontal"` on the shell host and renders routes inside its internal `<router-outlet />`. |
| `LayoutVerticalComponent`   | `<vertical>`   | `[navigation]`                                           | Sets `data-layout-mode="vertical"` on the shell host and renders routes inside its internal `<router-outlet />`.   |

`LayoutMode` still includes `empty` for content-only screens. There is no dedicated empty layout component; instead, the runtime contract hides shell chrome when the active mode is set to `empty`.

## Stylesheet Architecture

The bundle imported by `@ojiepermana/angular/theme/styles/index.css` is organized as follows:

1. `styles/tokens/foundation.css`
2. `styles/tokens/semantic.css`
3. `styles/modes/dark.css`
4. `styles/presets/colors/*`
5. `styles/presets/appearances/*`
6. `styles/layout/index.css`
7. `styles/utilities/index.css`
8. `styles/_demo-dashboard.css`
9. `styles/adapters/material-ui/index.css`

Responsibilities:

- `tokens/foundation.css` defines shared radius, shadow, layout, and theme exposure through `@theme inline`.
- `tokens/semantic.css` defines the light-mode semantic token contract.
- `modes/dark.css` overrides semantic tokens for dark mode.
- `presets/colors/*` defines color presets through `data-theme-color`.
- `presets/appearances/*` defines flat and glass surface presets through `data-theme-appearance`.
- `layout/index.css` defines the shell structure and the `full`, `boxed`, and `empty` layout behaviors.
- `utilities/index.css` contains low-level shared utilities such as `appearance-shell`, `focus-ring`, and compatibility aliases.
- `_demo-dashboard.css` contains demo-only dashboard primitives that still consume the shared semantic tokens.
- `adapters/material-ui/index.css` maps semantic tokens into Angular Material internals and applies adapter-level overrides.

## Authoring Notes

- Keep imports domain-based and use the narrowest public entry point available.
- In templates, prefer Tailwind utility classes for layout, spacing, typography, and interactive states.
- Use direct CSS only when the style belongs in a token layer, shared selector rule, reusable utility, or framework adapter.
- Library icons must use `@lucide/angular`, and every Lucide icon should keep `absoluteStrokeWidth` enabled.
- Component source filenames in this library omit the `.component` suffix.
