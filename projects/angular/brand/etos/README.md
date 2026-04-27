# Etos Brand

Etos implementation lives under `projects/angular/brand/etos`. Published consumers should use `@ojiepermana/angular/etos`.

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
import {
  type EtosBrandOptions,
  EtosHorizontalLayoutComponent,
  EtosThemeSwitcherComponent,
  EtosVerticalLayoutComponent,
  provideEtosBrand,
} from '@ojiepermana/angular/etos';
import { LayoutService } from '@ojiepermana/angular/layout';

export const etosBrandConfig = {
  theme: {
    mode: 'light',
    style: 'default',
  },
  layout: {
    mode: 'vertical',
    width: 'fixed',
  },
} satisfies EtosBrandOptions;

export const appConfig = {
  providers: [provideEtosBrand(etosBrandConfig)],
};
```

`provideEtosBrand()` applies the Etos brand tokens and wires the shared `ThemeService` and `LayoutService` defaults for the app.

```ts
@Component({
  imports: [EtosHorizontalLayoutComponent, EtosThemeSwitcherComponent, EtosVerticalLayoutComponent],
  template: `
    @switch (layoutMode()) {
      @case ('horizontal') {
        <etos-horizontal-layout>
          <div ui-layout-profile>
            <etos-theme-switcher
              [userInfo]="profileInfo"
              [quickActions]="horizontalQuickActions"
              [notificationShortcut]="horizontalNotificationShortcut" />
          </div>
        </etos-horizontal-layout>
      }
      @default {
        <etos-vertical-layout>
          <div ui-sidebar-footer class="flex items-center gap-3">
            <etos-theme-switcher [userInfo]="profileInfo" [quickActions]="verticalQuickActions" popoverAlign="start" />

            <div class="flex flex-col gap-px">
              <span>Ojie Permana</span>
              <span>Etos design system navigator</span>
            </div>
          </div>
        </etos-vertical-layout>
      }
    }
  `,
})
export class Pages {
  protected readonly layoutMode = inject(LayoutService).mode;
  protected readonly profileInfo = {
    name: 'Ojie Permana',
    subtitle: 'Etos design system navigator',
    avatarSrc: '/avatar-ojie.svg',
    avatarAlt: 'Portrait of Ojie Permana',
  };
  protected readonly horizontalQuickActions = [
    { value: 'sign-out', label: 'Logout', icon: 'logout', tone: 'destructive' },
  ];
  protected readonly verticalQuickActions = [
    { value: 'notifications', label: 'Notifications', icon: 'notifications' },
    { value: 'sign-out', label: 'Logout', icon: 'logout', tone: 'destructive' },
  ];
  protected readonly horizontalNotificationShortcut = {
    value: 'notifications',
    icon: 'notifications',
    ariaLabel: 'Open notifications for Ojie Permana',
  };
}
```

## Using the brand theme

The Etos brand theme has two parts:

- TypeScript setup through `provideEtosBrand()` for theme and layout defaults.
- CSS setup through the Etos stylesheet so the `theme-brand="etos"` tokens are available at runtime.

App CSS should import the Etos package stylesheet before Tailwind:

```css
@import '@ojiepermana/angular/etos/styles';
@import 'tailwindcss';
@import '@ojiepermana/angular/theme/tailwind/theme.css';
```

Recommended provider configuration:

```ts
import { type EtosBrandOptions, provideEtosBrand } from '@ojiepermana/angular/etos';

export const etosBrandConfig = {
  theme: {
    mode: 'light',
    style: 'default',
  },
  layout: {
    mode: 'vertical',
    width: 'fixed',
  },
} satisfies EtosBrandOptions;

export const appConfig = {
  providers: [provideEtosBrand(etosBrandConfig)],
};
```

From there, switch between `EtosHorizontalLayoutComponent` and `EtosVerticalLayoutComponent` based on the current `LayoutService.mode()` value, as shown above.

## Using the theme switcher

`EtosThemeSwitcherComponent` is exported from `@ojiepermana/angular/etos` and can be mounted in either the horizontal topbar or the vertical sidebar footer.

Common inputs:

- `userInfo`: object input for the user display data: `name`, `subtitle`, `avatarSrc`, and `avatarAlt`.
- `quickActions`: required array of action items rendered in the popup footer.
- `notificationShortcut`: object input for the standalone notification trigger shown beside the avatar in horizontal mode.
- `popoverAlign` and `popoverSide`: override the popover anchor position.
- `showNotificationShortcut`: legacy boolean shortcut for rendering the default notification button. Prefer `notificationShortcut` when the data should come from the parent.

Horizontal usage:

```html
<div ui-layout-profile class="etos-profile-trigger gap-2 px-0 py-0">
  <etos-theme-switcher
    [userInfo]="profileInfo"
    [quickActions]="horizontalQuickActions"
    [notificationShortcut]="horizontalNotificationShortcut" />
</div>
```

In this mode the trigger shows only the avatar or initials plus the standalone notification shortcut.

Vertical usage:

```html
<div ui-sidebar-footer class="flex h-full w-full min-w-0 items-center justify-start gap-3 px-0 py-0">
  <etos-theme-switcher [userInfo]="profileInfo" [quickActions]="verticalQuickActions" popoverAlign="start" />

  <div class="min-w-0 flex flex-col gap-px">
    <span class="truncate text-sm font-semibold leading-none text-foreground">Ojie Permana</span>
    <span class="truncate text-xs leading-none text-muted-foreground">Etos design system navigator</span>
  </div>
</div>
```

Use `popoverAlign="start"` in the vertical sidebar so the popup opens toward the content area instead of clipping against the left viewport edge.

Input shape examples:

```ts
profileInfo = {
  name: 'Ojie Permana',
  subtitle: 'Etos design system navigator',
  avatarSrc: '/avatar-ojie.svg',
  avatarAlt: 'Portrait of Ojie Permana',
};

horizontalNotificationShortcut = {
  value: 'notifications',
  icon: 'notifications',
  ariaLabel: 'Open notifications for Ojie Permana',
};

verticalQuickActions = [
  { value: 'notifications', label: 'Notifications', icon: 'notifications' },
  { value: 'sign-out', label: 'Logout', icon: 'logout', tone: 'destructive' },
];
```

The popup always exposes theme scheme, layout mode, and layout width controls. The quick action area is fully consumer-driven:

- Provide the action values and labels you need in `quickActions`.
- Handle actions such as logout in the app consumer through `(actionSelected)`.
- When `notificationShortcut.value` matches one of the `quickActions` values, the matching popup item is removed to avoid duplication.

Example consumer-owned action handling:

```html
<etos-theme-switcher
  [userInfo]="profileInfo"
  [quickActions]="verticalQuickActions"
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

The Etos demo under `projects/demo/etos` already uses the short TypeScript entrypoint:

- `src/app/app.config.ts` imports `provideEtosBrand` from `@ojiepermana/angular/etos`.
- `src/pages/pages.ts` imports `EtosHorizontalLayoutComponent`, `EtosVerticalLayoutComponent`, and `EtosThemeSwitcherComponent` from `@ojiepermana/angular/etos`.

For CSS, the workspace demo currently imports the Etos source stylesheet directly:

```css
@import '../../../angular/etos/themes/index.css';
@import 'tailwindcss';
@import '@ojiepermana/angular/theme/tailwind/theme.css';
```

That local CSS path is intentional while developing inside this monorepo. Angular resolves bare CSS package imports from `node_modules/@ojiepermana/angular`, while TypeScript imports in the demo resolve through `tsconfig.json` path aliases. After the package is built, published, and installed with the latest exports, consumers should use `@ojiepermana/angular/etos/styles`.

The older `@ojiepermana/angular/theme/styles/etos.css` path is kept only as a compatibility shim.
