# Layout Library

Runtime layout state, shell components, layout controls, and shell selectors for `@ojiepermana/angular/layout`.

## Package Shape

Import the public API from:

- `@ojiepermana/angular/layout`
- `@ojiepermana/angular/layout/styles/index.css`

For the combined theme and layout stylesheet bundle, use `@ojiepermana/angular/styles/index.css`.

## What This Library Owns

- Global layout state with Angular signals through `LayoutService`
- Layout runtime DOM contract on `document.documentElement`
- Optional subtree mirroring through `LayoutHostDirective`
- Reusable vertical and horizontal shell components
- Standalone layout controls for mode and container width
- Layout-owned shell selectors and layout state selectors

## Runtime Contract

When `LayoutService` is active, it writes the current state to `document.documentElement`.

- `data-layout-mode` stores the active shell mode.
- `data-layout-container` stores the active width mode.

`LayoutHostDirective` mirrors the same contract onto any host element with `ngtLayoutHost`.

## Supported Values

- `LayoutMode`: `vertical`, `horizontal`, `empty`
- `LayoutContainer`: `full`, `boxed`

## Public API

Import from `@ojiepermana/angular/layout`.

- `LayoutService`
- `provideNgLayout`
- `NG_LAYOUT_CONFIG`
- `LayoutMode`
- `LayoutContainer`
- `NgLayoutConfig`
- `LayoutHostDirective`
- `LayoutVerticalComponent`
- `LayoutHorizontalComponent`
- `LayoutContainerSwitcherComponent`
- `LayoutModeSwitcherComponent`

`provideNgLayout()` currently defaults to:

- `defaultMode: 'vertical'`
- `defaultContainer: 'full'`

## Styles

The layout stylesheet entry is `projects/library/layout/styles/index.css` inside this workspace and `@ojiepermana/angular/layout/styles/index.css` for package consumers.

It owns the `data-layout-*` selectors and the `horizontal` and `vertical` shell selectors.

Layout styles consume theme tokens. For application usage, prefer the aggregate stylesheet entry at `projects/library/styles/index.css` in this workspace or `@ojiepermana/angular/styles/index.css` from the published package.

## Usage

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
    provideNgTheme(),
    provideNgLayout({ defaultMode: 'vertical', defaultContainer: 'boxed' }),
  ],
};
```

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  LayoutContainerSwitcherComponent,
  LayoutModeSwitcherComponent,
  LayoutVerticalComponent,
} from '@ojiepermana/angular/layout';

@Component({
  selector: 'app-shell',
  imports: [LayoutContainerSwitcherComponent, LayoutModeSwitcherComponent, LayoutVerticalComponent],
  template: `
    <vertical>
      <nav navigation class="flex h-full w-full flex-col gap-3 px-4 py-5">
        <div class="flex items-center gap-1">
          <layout-mode-switcher />
          <layout-container-switcher />
        </div>
      </nav>
    </vertical>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {}
```

## Persistence

Layout state is persisted in `localStorage` using these flat keys:

- `layout-mode`
- `layout-container`

Legacy `ng-theme:v2:layout-mode` and `ng-theme:v2:layout-container` entries are migrated automatically when they are read.
