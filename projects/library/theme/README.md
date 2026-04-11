# Theme Library

Reusable theme state, layout shells, theme controls, and shared styling tokens for `@ojiepermana/angular/theme`.

## Package Shape

`@ojiepermana/angular/theme` is intentionally a namespace marker and exports nothing.

Import from the secondary entry points instead:

- `@ojiepermana/angular/theme/service`
- `@ojiepermana/angular/theme/component`
- `@ojiepermana/angular/theme/directive`
- `@ojiepermana/angular/theme/layout`
- `@ojiepermana/angular/theme/styles/index.css`

## What This Library Owns

- Global theme state with Angular signals through `ThemeService`
- Runtime DOM contract on `document.documentElement`
- Reusable vertical and horizontal layout shells
- Standalone theme controls for scheme, color, appearance, and container mode
- Shared semantic tokens and the Angular Material adapter layer
- Optional host mirroring through `ThemeHostDirective`

## Styling Rules

- Semantic tokens are the visual source of truth.
- Angular Material acts as the behavior layer and reads from shared semantic tokens.
- Appearance presets feed a role-token layer so shell, navigation, overlay, data, and control groups can change material treatment without duplicating per-component selectors.
- In application code, prefer Tailwind utility classes directly in templates.
- In library code, shared and cross-cutting styles belong in CSS token layers, layout stylesheets, utilities, or adapters.
- Dark mode must resolve through the global runtime contract and shared variables, not component-local dark-mode classes.
- The legacy `_*.css` files and the old `styles/overrides/` tree have been removed.

## Runtime Contract

When `ThemeService` is active, it writes the current state to `document.documentElement`.

- `.dark` is added when the resolved scheme is dark.
- `style.color-scheme` is set to the resolved browser scheme.
- `data-theme-scheme` stores the selected scheme: `light`, `dark`, or `system`.
- `data-theme-color` stores the active preset color.
- `data-theme-appearance` stores the active appearance preset.
- `data-layout-mode` stores the active shell mode.
- `data-layout-container` stores the active width mode.

`ThemeHostDirective` mirrors the same contract onto any host element with `ngtThemeHost`.

## Supported Values

- `ThemeScheme`: `light`, `dark`, `system`
- `ThemeColor`: `brand`, `blue`, `green`, `red`, `cyan`, `purple`, `orange`
- `ThemeAppearance`: `flat`, `glass`
- `LayoutMode`: `vertical`, `horizontal`, `empty`
- `LayoutContainer`: `full`, `boxed`

## Public API

### Service Entry Point

Import from `@ojiepermana/angular/theme/service`.

- `ThemeService`
- `provideNgTheme`
- `NG_THEME_CONFIG`
- `ThemeScheme`
- `ThemeColor`
- `ThemeColorOption`
- `ThemeAppearance`
- `LayoutMode`
- `LayoutContainer`
- `NgThemeConfig`

`provideNgTheme()` currently defaults to:

- `defaultScheme: 'system'`
- `defaultColor: 'brand'`
- `defaultAppearance: 'flat'`
- `defaultLayoutMode: 'vertical'`
- `defaultLayoutContainer: 'full'`

Use the optional `colors` config to limit the available color presets exposed by `ThemeService.colorOptions()` and `ColorPickerComponent`.

### Component Entry Point

Import from `@ojiepermana/angular/theme/component`.

- `AppearanceSwitcherComponent` with selector `appearance-switcher`. Toggles `flat` and `glass`.
- `ColorPickerComponent` with selector `color-picker`. Renders the configured preset list from `ThemeService.colorOptions()`.
- `LayoutContainerSwitcherComponent` with selector `layout-container-switcher`. Toggles `full` and `boxed`.
- `LayoutModeSwitcherComponent` with selector `layout-mode-switcher`. Switches between `vertical` and `horizontal`, and shows `Content Only` when the current mode is `empty`.
- `SchemeSwitcherComponent` with selector `scheme-switcher`. Switches between `light`, `dark`, and `system`.
- `ThemeLucideConfigDirective` with selector `[themeLucideConfig]`. Provides the shared Lucide configuration used by the built-in controls.

All built-in controls are standalone components with no required inputs.

### Directive Entry Point

Import from `@ojiepermana/angular/theme/directive`.

- `ThemeHostDirective` with selector `[ngtThemeHost]`. Mirrors the current theme and layout contract onto the host element.

### Layout Entry Point

Import from `@ojiepermana/angular/theme/layout`.

- `LayoutVerticalComponent` with selector `vertical`. Projects sidebar content through `[navigation]`.
- `LayoutHorizontalComponent` with selector `horizontal`. Projects header content through `[headerBrand]`, `[headerNavigation]`, and `[headerActions]`.

Both shells set `data-layout-mode` on the host and render the route content through `RouterOutlet`.

## Active Stylesheet Bundle

The active stylesheet entry is `projects/library/theme/styles/index.css` inside this workspace and `@ojiepermana/angular/theme/styles/index.css` for package consumers.

It imports the current structure in this order:

- `tokens/foundation.css`
- `tokens/semantic.css`
- `modes/dark.css`
- `presets/colors/index.css`
- `presets/appearances/index.css`
- `roles/index.css`
- `layout/index.css`
- `utilities/index.css`
- `adapters/material-ui/index.css`

The role-token layer currently groups the active consumer surfaces into shell, navigation, sidebar chrome, container, overlay, data-surface, and control families.

Preset coverage currently includes:

- Colors: `brand`, `blue`, `green`, `red`, `cyan`, `purple`, `orange`
- Appearances: `flat`, `glass`

## Usage

### 1. Register the Provider

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgTheme } from '@ojiepermana/angular/theme/service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNgTheme({
      defaultLayoutMode: 'vertical',
      defaultLayoutContainer: 'boxed',
    }),
  ],
};
```

### 2. Register the Shared Styles

Inside this workspace, a consuming application can wire the source theme bundle through its Angular build config:

```json
{
  "styles": ["projects/library/theme/styles/index.css"]
}
```

For a package consumer, use the published stylesheet entry point instead:

```css
@import '@ojiepermana/angular/theme/styles/index.css';
@import 'tailwindcss';
```

### 3. Compose a Shell and Controls

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

### 4. Mirror Theme State to Any Subtree

```html
<section ngtThemeHost>
  <ng-content />
</section>
```

## Persistence

Theme state is persisted in `localStorage` per axis using fixed flat keys.

The persisted keys are:

- `theme-scheme`
- `theme-color`
- `theme-appearance`
- `layout-mode`
- `layout-container`

Legacy `ng-theme:v2:*` entries are migrated automatically to the flat keys when they are read.

## Notes for Contributors

- Do not add exports to `@ojiepermana/angular/theme` unless the package contract changes intentionally.
- Keep imports domain-based through the secondary entry points.
- Prefer Tailwind utility classes in templates before adding local or shared CSS.
- Put shared visual decisions in semantic tokens or shared stylesheets instead of Angular Material tokens.
- If a new theme axis or preset is added, update the types, service validation, styles, tests, and this README together.
