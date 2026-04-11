# Theme Library

Reusable theme state, theme controls, and shared styling tokens for `@ojiepermana/angular/theme`.

Layout runtime and shell components now live in `@ojiepermana/angular/layout`.

## Package Shape

`@ojiepermana/angular/theme` is intentionally a namespace marker and exports nothing.

Import from the secondary entry points instead:

- `@ojiepermana/angular/theme/service`
- `@ojiepermana/angular/theme/component`
- `@ojiepermana/angular/theme/directive`

Use `@ojiepermana/angular/layout` for layout state, layout controls, layout host mirroring, and shell components.
Use `@ojiepermana/angular/styles/index.css` for styles in consumer applications.

## What This Library Owns

- Global theme state with Angular signals through `ThemeService`
- Theme runtime DOM contract on `document.documentElement`
- Standalone theme controls for scheme, color, and appearance
- Shared semantic tokens and the Angular Material adapter layer
- Optional theme-only host mirroring through `ThemeHostDirective`

## Styling Rules

- Semantic tokens are the visual source of truth.
- Angular Material acts as the behavior layer and reads from shared semantic tokens.
- Appearance presets feed a role-token layer so shell, navigation, overlay, data, and control groups can change material treatment without duplicating per-component selectors.
- In application code, prefer Tailwind utility classes directly in templates.
- In library code, shared and cross-cutting styles belong in CSS token layers, utilities, or adapters.
- Dark mode must resolve through the global runtime contract and shared variables, not component-local dark-mode classes.
- The legacy `_*.css` files and the old `styles/overrides/` tree have been removed.

## Runtime Contract

When `ThemeService` is active, it writes the current state to `document.documentElement`.

- `.dark` is added when the resolved scheme is dark.
- `style.color-scheme` is set to the resolved browser scheme.
- `data-theme-scheme` stores the selected scheme: `light`, `dark`, or `system`.
- `data-theme-color` stores the active preset color.
- `data-theme-appearance` stores the active appearance preset.

`ThemeHostDirective` mirrors the same theme-only contract onto any host element with `ngtThemeHost`.

## Supported Values

- `ThemeScheme`: `light`, `dark`, `system`
- `ThemeColor`: `brand`, `blue`, `green`, `red`, `cyan`, `purple`, `orange`
- `ThemeAppearance`: `flat`, `glass`

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
- `NgThemeConfig`

`provideNgTheme()` currently defaults to:

- `defaultScheme: 'system'`
- `defaultColor: 'brand'`
- `defaultAppearance: 'flat'`

Use the optional `colors` config to limit the available color presets exposed by `ThemeService.colorOptions()` and `ColorPickerComponent`.

### Component Entry Point

Import from `@ojiepermana/angular/theme/component`.

- `AppearanceSwitcherComponent` with selector `appearance-switcher`. Toggles `flat` and `glass`.
- `ColorPickerComponent` with selector `color-picker`. Renders the configured preset list from `ThemeService.colorOptions()`.
- `SchemeSwitcherComponent` with selector `scheme-switcher`. Switches between `light`, `dark`, and `system`.

All built-in controls are standalone components with no required inputs.

### Directive Entry Point

Import from `@ojiepermana/angular/theme/directive`.

- `ThemeHostDirective` with selector `[ngtThemeHost]`. Mirrors the current theme contract onto the host element.

## Related Layout Package

Import from `@ojiepermana/angular/layout`.

- `LayoutService`
- `provideNgLayout`
- `NG_LAYOUT_CONFIG`
- `LayoutMode`
- `LayoutContainer`
- `NgLayoutConfig`
- `LayoutHostDirective` with selector `[ngtLayoutHost]`
- `LayoutVerticalComponent` with selector `vertical`
- `LayoutHorizontalComponent` with selector `horizontal`
- `LayoutContainerSwitcherComponent` with selector `layout-container-switcher`
- `LayoutModeSwitcherComponent` with selector `layout-mode-switcher`

## Active Stylesheet Bundles

The theme stylesheet source remains `projects/library/theme/styles/index.css` inside this workspace.

It imports the current structure in this order:

- `tokens/foundation.css`
- `tokens/semantic.css`
- `modes/dark.css`
- `presets/colors/index.css`
- `presets/appearances/index.css`
- `roles/index.css`
- `utilities/index.css`
- `adapters/material-ui/index.css`

Layout selectors now live in `projects/library/layout/styles/index.css` inside this workspace.

For applications that consume the published package, use the aggregate bundle at `projects/library/styles/index.css` in this workspace or `@ojiepermana/angular/styles/index.css` from the published package. The aggregate bundle imports theme first, then layout.

Preset coverage currently includes:

- Colors: `brand`, `blue`, `green`, `red`, `cyan`, `purple`, `orange`
- Appearances: `flat`, `glass`

## Usage

### 1. Register the Providers

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

### 2. Register the Shared Styles

Inside this workspace, a consuming application can wire the aggregate source bundle through its Angular build config:

```json
{
  "styles": ["projects/library/styles/index.css"]
}
```

For a package consumer, use the published aggregate bundle instead:

```css
@import '@ojiepermana/angular/styles/index.css';
@import 'tailwindcss';
```

### 3. Compose a Shell and Controls

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

### 4. Mirror Theme and Layout State to a Subtree

```html
<section ngtThemeHost ngtLayoutHost>
  <ng-content />
</section>
```

## Persistence

Theme state is persisted in `localStorage` per axis using fixed flat keys.

The theme package owns these keys:

- `theme-scheme`
- `theme-color`
- `theme-appearance`

The layout package owns:

- `layout-mode`
- `layout-container`

Legacy `ng-theme:v2:*` entries are migrated automatically to the flat keys when they are read by their owning runtime service.

## Notes for Contributors

- Do not add exports to `@ojiepermana/angular/theme` unless the package contract changes intentionally.
- Keep imports domain-based through the secondary entry points.
- Use `@ojiepermana/angular/layout` for layout runtime, layout controls, and shell components.
- Prefer Tailwind utility classes in templates before adding local or shared CSS.
- Put shared visual decisions in semantic tokens or shared stylesheets instead of Angular Material tokens.
- If a new theme axis or preset is added, update the types, service validation, styles, tests, and this README together.
