# Etos Brand

Etos implementation lives under `projects/angular/brand/etos`. Published consumers should use `@ojiepermana/angular/etos`.

This package is the Etos-specific layer on top of the shared Angular libraries. It owns the Etos brand defaults, shell composition, brand stylesheet, and Etos-only UI such as the profile/theme switcher.

Use this folder for Etos-specific implementation:

- `core/` contains brand defaults and provider composition.
- `component/` contains Etos-owned UI such as `EtosThemeSwitcherComponent`.
- `shells/` contains `EtosLayoutComponent` and the Etos empty, horizontal, and vertical shells.
- `themes/` contains Etos color, style, layout, and component-facing CSS.
- `navigation/`, `assets/`, and `docs/` can be added when Etos needs brand-specific behavior beyond shared primitives.

Shared services, types, and primitives stay in the generic libraries:

- `@ojiepermana/angular/theme`
- `@ojiepermana/angular/layout`
- `@ojiepermana/angular/navigation`

## Public entrypoint

Published consumers should import Etos through the short public entrypoint:

```ts
import {
  EtosLayoutComponent,
  EtosThemeSwitcherComponent,
  provideEtosBrand,
  provideEtosLayout,
  provideEtosTheme,
  type EtosBrandOptions,
  type EtosThemeSwitcherQuickAction,
  type EtosThemeSwitcherUserInfo,
} from '@ojiepermana/angular/etos';
```

`@ojiepermana/angular/etos` currently exports:

- `provideEtosBrand()` to apply the Etos theme and layout defaults together and optionally register navigation items.
- `provideEtosTheme()` to install only the Etos theme wrapper over the shared theme provider.
- `provideEtosLayout()` to install only the Etos layout wrapper over the shared layout provider.
- `EtosLayoutComponent` to render the Etos shell from the current layout mode.
- `EtosThemeSwitcherComponent` and related types for the profile/preferences UI.

## Provider setup

Etos ships with these defaults:

- Theme defaults to brand `etos` with light mode.
- Layout defaults to `vertical` mode with `wide` width.

Recommended provider configuration:

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { type EtosBrandOptions, provideEtosBrand } from '@ojiepermana/angular/etos';

import { AppNavigation } from './app.navigation';
import { routes } from './app.routes';

export const etosBrandConfig = {
  theme: {
    mode: 'light',
  },
  layout: {
    mode: 'vertical',
  },
  navigation: AppNavigation,
} satisfies EtosBrandOptions;

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideEtosBrand(etosBrandConfig)],
};
```

`provideEtosBrand()` accepts these Etos-specific options:

- `theme` merges into the shared Material theme config while keeping the Etos brand tokens.
- `layout` merges into the shared Material layout config while keeping the Etos layout defaults.
- `navigation` registers navigation items during application startup.
- `navigationId` targets a non-default navigation registry id when needed.
- `materialDefaults` defaults to `true`; set it to `false` to skip `withMaterialDefaults()`.

Use the granular providers when the consumer only needs one part of the Etos stack:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideEtosLayout, provideEtosTheme } from '@ojiepermana/angular/etos';

export const appConfig: ApplicationConfig = {
  providers: [provideEtosTheme(), provideEtosLayout({ mode: 'horizontal', width: 'wide' })],
};
```

## Using the brand theme

The Etos brand theme has two parts:

- TypeScript setup through one of the Etos providers.
- CSS setup through the Etos stylesheet so the `theme-brand="etos"` tokens are available at runtime.

App CSS should import the Etos package stylesheet before Tailwind:

```css
@import '@ojiepermana/angular/etos/styles';
@import 'tailwindcss';
@import '@ojiepermana/angular/theme/tailwind/theme.css';
```

## Using the layout shell

`EtosLayoutComponent` is the exported shell component for Etos. It resolves `empty`, `horizontal`, or `vertical` from its `mode` input or from `LayoutService` when the input is omitted.

This is the same composition pattern used by the Etos demo:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EtosLayoutComponent,
  type EtosThemeSwitcherQuickAction,
  EtosThemeSwitcherComponent,
  type EtosThemeSwitcherUserInfo,
} from '@ojiepermana/angular/etos';

@Component({
  selector: 'app-pages',
  imports: [RouterLink, EtosLayoutComponent, EtosThemeSwitcherComponent],
  template: `
    <ng-template #layoutBrand>
      <a routerLink="/" class="flex min-w-0 items-center gap-3 px-2 py-1.5 transition-colors">
        <span class="text-sm font-semibold leading-none tracking-tight">Ojiepermana UI</span>
      </a>
    </ng-template>

    <ng-template #layoutPanel>
      <div class="flex h-full w-full min-w-0 items-center justify-start gap-3 px-2 py-0">
        <etos-theme-switcher [userInfo]="profileInfo" [quickActions]="quickActions" />

        <div class="min-w-0 flex flex-col gap-px">
          <span class="truncate text-sm font-semibold leading-none text-foreground">{{ profileName }}</span>
          <span class="truncate text-xs leading-none text-muted-foreground">{{ profileTitle }}</span>
        </div>
      </div>
    </ng-template>

    <etos-layout [layoutBrandTemplate]="layoutBrand" [layoutProfileTemplate]="layoutPanel" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pages {
  protected readonly profileName = 'Ojie Permana';
  protected readonly profileTitle = 'Etos design system navigator';
  protected readonly profileInfo = {
    name: this.profileName,
    subtitle: this.profileTitle,
    avatarSrc: '/avatar-ojie.svg',
    avatarAlt: 'Portrait of Ojie Permana',
  } satisfies EtosThemeSwitcherUserInfo;

  protected readonly quickActions = [
    { value: 'notifications', label: 'Notifications', icon: 'notifications' },
    { value: 'sign-out', label: 'Logout', icon: 'logout', tone: 'destructive' },
  ] satisfies readonly EtosThemeSwitcherQuickAction[];
}
```

Layout inputs:

- `mode`: optional explicit override for the active layout mode.
- `layoutBrandTemplate`: used in the horizontal brand area and as the default vertical sidebar header.
- `layoutProfileTemplate`: used in the horizontal profile area and as the default vertical sidebar footer.
- `sidebarHeaderTemplate`: optional vertical-only override for the sidebar header.
- `sidebarFooterTemplate`: optional vertical-only override for the sidebar footer.

That fallback behavior means a single `layoutBrandTemplate` and `layoutProfileTemplate` pair is enough for most consumers, while vertical layouts can still diverge when needed.

## Using the theme switcher

`EtosThemeSwitcherComponent` is exported from `@ojiepermana/angular/etos` and is intended to live inside the Etos shell profile area or any consumer-owned profile trigger.

Common inputs and output:

- `quickActions`: required array rendered in the popup footer. Pass `[]` if you only want the built-in theme and layout controls.
- `userInfo`: object input for `name`, `subtitle`, `avatarSrc`, and `avatarAlt`.
- `userName`, `userSubtitle`, `avatarSrc`, and `avatarAlt`: fallback inputs when `userInfo` is not supplied.
- `notificationShortcut`: configures the standalone notification trigger shown beside the avatar.
- `showNotificationShortcut`: legacy boolean shortcut for rendering the default notification button.
- `popoverSide`, `popoverAlign`, and `popoverSideOffset`: explicit popover placement overrides.
- `actionSelected`: emits the selected quick action or notification shortcut value.

The popup always exposes theme scheme, layout mode, and layout width controls. The quick action area is fully consumer-driven:

- Provide the action values and labels you need in `quickActions`.
- Handle actions such as logout in the app consumer through `(actionSelected)`.
- When `notificationShortcut.value` matches one of the `quickActions` values, the matching popup item is removed to avoid duplication.

Popover defaults now follow the active layout automatically:

- Vertical layout defaults to `side="top"` and `align="start"`.
- Horizontal and empty layouts default to `side="bottom"` and `align="end"`.

Only pass `popoverSide`, `popoverAlign`, or `popoverSideOffset` when you need to override those defaults.

Input shape examples:

```ts
profileInfo = {
  name: 'Ojie Permana',
  subtitle: 'Etos design system navigator',
  avatarSrc: '/avatar-ojie.svg',
  avatarAlt: 'Portrait of Ojie Permana',
};

notificationShortcut = {
  value: 'notifications',
  icon: 'notifications',
  ariaLabel: 'Open notifications for Ojie Permana',
};

quickActions = [
  { value: 'notifications', label: 'Notifications', icon: 'notifications' },
  { value: 'sign-out', label: 'Logout', icon: 'logout', tone: 'destructive' },
];
```

Example consumer-owned action handling:

```html
<etos-theme-switcher
  [userInfo]="profileInfo"
  [quickActions]="quickActions"
  (actionSelected)="onThemeSwitcherAction($event)" />
```

```ts
onThemeSwitcherAction(action: string): void {
  if (action === 'sign-out') {
    this.authService.logout();
  }
}
```

## Workspace usage in this repository

The Etos demo under `projects/demo/etos` already uses the short TypeScript entrypoint for provider setup and shell composition:

- `src/app/app.config.ts` imports `provideEtosBrand` and passes `navigation: AppNavigation`.
- `src/pages/pages.ts` imports `EtosLayoutComponent` and `EtosThemeSwitcherComponent` and wires `layoutBrandTemplate` plus `layoutProfileTemplate`.

For CSS, the workspace demo currently imports the Etos source stylesheet directly:

```css
@import '../../../angular/etos/themes/index.css';
@import 'tailwindcss';
@import '@ojiepermana/angular/theme/tailwind/theme.css';
```

That local CSS path is intentional while developing inside this monorepo. Angular resolves bare CSS package imports from `node_modules/@ojiepermana/angular`, while TypeScript imports in the demo resolve through `tsconfig.json` path aliases. After the package is built, published, and installed with the latest exports, consumers should use `@ojiepermana/angular/etos/styles`.

The older `@ojiepermana/angular/theme/styles/etos.css` path is kept only as a compatibility shim.
