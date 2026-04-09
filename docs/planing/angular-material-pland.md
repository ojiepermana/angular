# Plan: Angular Material Theme Library

## Overview

Library Angular yang menyediakan **multiple-axis theming system** untuk Angular Material + Tailwind CSS v4.1++ Setiap aplikasi cukup install library ini untuk mendapatkan theming yang konsisten.

---

## Nama Library

```
@ojiepermana/angular
```

---

## Goals

- Satu library, konsisten di semua aplikasi
- Support `theme-schemes` = `light | dark | system` (default: `system`)
- Support `theme-colors` = `brand | blue | green | red | cyan | purple | orange | ...` (default: `brand`)
- Support `theme-appearances` = `flat | glass` (default: `flat`)
- Support `layout-mode` = `vertical | horizontal | empty` (default: `vertical`)
- Support `layout-container` = `full | boxed` (default: `full`)
- Bisa extend / tambah color baru dari aplikasi consumer
- Persist preference ke `localStorage`
- Tree-shakeable, zero runtime overhead
- Compatible dengan Angular 21+ (Standalone API)

---

## HTML Attributes Summary

| Attribute           | Values                                                      | Default    | Keterangan                           |
| ------------------- | ----------------------------------------------------------- | ---------- | ------------------------------------ |
| `theme-schemes`     | `light \| dark \| system`                                   | `system`   | Mode terang / gelap / ikut OS        |
| `theme-colors`      | `brand \| blue \| green \| red \| cyan \| purple \| orange` | `brand`    | Palet warna utama                    |
| `theme-appearances` | `flat \| glass`                                             | `flat`     | Gaya visual (solid vs glassmorphism) |
| `layout-mode`       | `vertical \| horizontal \| empty`                           | `vertical` | Tata letak sidebar / navbar          |
| `layout-container`  | `full \| boxed`                                             | `full`     | Lebar container konten               |

---

## Arsitektur Library

```
libs/
└── ng-theme/
    ├── src/
    │   ├── lib/
    │   │   ├── theme.service.ts              ← core service (semua axis)
    │   │   ├── theme.types.ts                ← ThemeScheme, ThemeColor, dll
    │   │   ├── theme.token.ts                ← InjectionToken untuk config
    │   │   ├── theme.provider.ts             ← provideNgTheme() function
    │   │   ├── directives/
    │   │   │   └── theme-host.directive.ts    ← apply attributes ke host element
    │   │   └── components/
    │   │       ├── scheme-switcher/           ← light/dark/system toggle
    │   │       │   └── scheme-switcher.component.ts
    │   │       ├── color-picker/              ← color palette picker
    │   │       │   └── color-picker.component.ts
    │   │       ├── appearance-switcher/        ← flat/glass toggle
    │   │       │   └── appearance-switcher.component.ts
    │   │       ├── layout-mode-switcher/       ← vertical/horizontal/empty
    │   │       │   └── layout-mode-switcher.component.ts
    │   │       └── layout-container-switcher/  ← full/boxed toggle
    │   │           └── layout-container-switcher.component.ts
    │   ├── styles/
    │   │   ├── index.css                 ← entry point styles
    │   │   ├── _base.css                 ← reset & typography tokens
    │   │   ├── _colors.css               ← color palette per theme-colors
    │   │   ├── _schemes.css              ← light / dark / system vars
    │   │   ├── _appearances.css          ← flat / glass vars
    │   │   ├── _layout.css               ← layout-mode & layout-container vars
    │   │   └── overrides/
    │   │       ├── index.css             ← import semua overrides
    │   │       ├── _button.css
    │   │       ├── _form-field.css
    │   │       ├── _card.css
    │   │       ├── _table.css
    │   │       ├── _dialog.css
    │   │       ├── _tabs.css
    │   │       ├── _chips.css
    │   │       ├── _datepicker.css
    │   │       └── ... (per component)
    │   └── index.ts                      ← public API exports
    ├── package.json
    ├── ng-package.json
    └── README.md
```

---

## Phase 1 — Setup Library Project

### 1.1 Generate Library (NX atau Angular CLI)

```bash
# Dengan Angular CLI
ng generate library ng-theme
```

### 1.2 `package.json` Library

```json
{
  "name": "@ojiepermana/angular",
  "version": "1.0.0",
  "peerDependencies": {
    "@angular/core": ">=21.0.0",
    "@angular/material": ">=21.0.0",
    "tailwindcss": ">=4.0.0"
  },
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "default": "./fesm2022/ng-theme.mjs"
    },
    "./styles": "./styles/index.css",
    "./styles/overrides": "./styles/overrides/index.css"
  }
}
```

### 1.3 `ng-package.json`

```json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "src/index.ts",
    "styleIncludePaths": ["src/styles"]
  },
  "assets": ["src/styles/**/*.css"]
}
```

---

## Phase 2 — Core Types & Tokens

### 2.1 `theme.types.ts`

```typescript
export type ThemeScheme = 'light' | 'dark' | 'system';
export type ThemeColor = 'brand' | 'blue' | 'green' | 'red' | 'cyan' | 'purple' | 'orange';
export type ThemeAppearance = 'flat' | 'glass';
export type LayoutMode = 'vertical' | 'horizontal' | 'empty';
export type LayoutContainer = 'full' | 'boxed';

export interface NgThemeConfig {
  defaultScheme: ThemeScheme;
  defaultColor: ThemeColor;
  defaultAppearance: ThemeAppearance;
  defaultLayoutMode: LayoutMode;
  defaultLayoutContainer: LayoutContainer;
  storageKey?: string; // default: 'ng-theme'
  colors?: ThemeColor[]; // override list yang ditampilkan di picker
}
```

### 2.2 `theme.token.ts`

```typescript
import { InjectionToken } from '@angular/core';
import { NgThemeConfig } from './theme.types';

export const NG_THEME_CONFIG = new InjectionToken<NgThemeConfig>('NG_THEME_CONFIG', {
  factory: () => ({
    defaultScheme: 'system',
    defaultColor: 'brand',
    defaultAppearance: 'flat',
    defaultLayoutMode: 'vertical',
    defaultLayoutContainer: 'full',
    storageKey: 'ng-theme',
  }),
});
```

### 2.3 `theme.provider.ts`

```typescript
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NG_THEME_CONFIG } from './theme.token';
import { NgThemeConfig } from './theme.types';

export function provideNgTheme(config: Partial<NgThemeConfig>): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NG_THEME_CONFIG, useValue: { ...defaultConfig, ...config } },
  ]);
}

const defaultConfig: NgThemeConfig = {
  defaultScheme: 'system',
  defaultColor: 'brand',
  defaultAppearance: 'flat',
  defaultLayoutMode: 'vertical',
  defaultLayoutContainer: 'full',
  storageKey: 'ng-theme',
};
```

---

## Phase 3 — Theme Service

### 3.1 `theme.service.ts`

```typescript
import { Injectable, inject, signal, effect, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NG_THEME_CONFIG } from './theme.token';
import {
  ThemeScheme,
  ThemeColor,
  ThemeAppearance,
  LayoutMode,
  LayoutContainer,
} from './theme.types';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private config = inject(NG_THEME_CONFIG);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private key(axis: string): string {
    return `${this.config.storageKey}:${axis}`;
  }

  // ── Signals ──────────────────────────────────────────────
  scheme = signal<ThemeScheme>(this.load('scheme', this.config.defaultScheme));
  color = signal<ThemeColor>(this.load('color', this.config.defaultColor));
  appearance = signal<ThemeAppearance>(this.load('appearance', this.config.defaultAppearance));
  layoutMode = signal<LayoutMode>(this.load('layout-mode', this.config.defaultLayoutMode));
  layoutContainer = signal<LayoutContainer>(
    this.load('layout-container', this.config.defaultLayoutContainer),
  );

  /** Computed: resolves 'system' to actual 'light' | 'dark' */
  resolvedScheme = computed<'light' | 'dark'>(() => {
    if (this.scheme() !== 'system') return this.scheme() as 'light' | 'dark';
    if (!this.isBrowser) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  constructor() {
    effect(() => {
      if (this.isBrowser) {
        this.applyToDOM();
      }
    });
  }

  // ── Setters ──────────────────────────────────────────────
  setScheme(value: ThemeScheme): void {
    this.persist('scheme', value);
    this.scheme.set(value);
  }

  setColor(value: ThemeColor): void {
    this.persist('color', value);
    this.color.set(value);
  }

  setAppearance(value: ThemeAppearance): void {
    this.persist('appearance', value);
    this.appearance.set(value);
  }

  setLayoutMode(value: LayoutMode): void {
    this.persist('layout-mode', value);
    this.layoutMode.set(value);
  }

  setLayoutContainer(value: LayoutContainer): void {
    this.persist('layout-container', value);
    this.layoutContainer.set(value);
  }

  toggleScheme(): void {
    const next: ThemeScheme = this.scheme() === 'dark' ? 'light' : 'dark';
    this.setScheme(next);
  }

  // ── Private ──────────────────────────────────────────────
  private applyToDOM(): void {
    const el = document.documentElement;
    el.setAttribute('theme-schemes', this.scheme());
    el.setAttribute('theme-colors', this.color());
    el.setAttribute('theme-appearances', this.appearance());
    el.setAttribute('layout-mode', this.layoutMode());
    el.setAttribute('layout-container', this.layoutContainer());
  }

  private persist(axis: string, value: string): void {
    if (this.isBrowser) localStorage.setItem(this.key(axis), value);
  }

  private load<T extends string>(axis: string, fallback: T): T {
    if (!this.isBrowser) return fallback;
    return (localStorage.getItem(this.key(axis)) as T) ?? fallback;
  }
}
```

---

## Phase 4 — Components

### 4.1 `scheme-switcher.component.ts` — Toggle light/dark/system

```typescript
@Component({
  selector: 'ngt-scheme-switcher',
  imports: [MatIconButton, MatIcon, MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button [matTooltip]="label()" (click)="theme.toggleScheme()">
      <mat-icon>{{ icon() }}</mat-icon>
    </button>
  `,
})
export class SchemeSwitcherComponent {
  theme = inject(ThemeService);

  icon = computed(
    () =>
      ({
        light: 'light_mode',
        dark: 'dark_mode',
        system: 'brightness_auto',
      })[this.theme.scheme()],
  );

  label = computed(
    () =>
      ({
        light: 'Switch to Dark',
        dark: 'Switch to Light',
        system: 'Following System',
      })[this.theme.scheme()],
  );
}
```

### 4.2 `color-picker.component.ts` — Pilih color palette

```typescript
@Component({
  selector: 'ngt-color-picker',
  imports: [MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-2">
      @for (c of colors; track c.value) {
        <button
          class="w-7 h-7 rounded-full transition-all ring-offset-2 ring-offset-surface"
          [style.background]="c.preview"
          [class.ring-2]="theme.color() === c.value"
          [class.ring-primary]="theme.color() === c.value"
          [matTooltip]="c.label"
          (click)="theme.setColor(c.value)"
        ></button>
      }
    </div>
  `,
})
export class ColorPickerComponent {
  theme = inject(ThemeService);

  colors: { value: ThemeColor; label: string; preview: string }[] = [
    { value: 'brand', label: 'Brand', preview: '#6366f1' },
    { value: 'blue', label: 'Blue', preview: '#1d4ed8' },
    { value: 'green', label: 'Green', preview: '#16a34a' },
    { value: 'red', label: 'Red', preview: '#dc2626' },
    { value: 'cyan', label: 'Cyan', preview: '#0891b2' },
    { value: 'purple', label: 'Purple', preview: '#9333ea' },
    { value: 'orange', label: 'Orange', preview: '#ea580c' },
  ];
}
```

### 4.3 `appearance-switcher.component.ts` — Toggle flat/glass

```typescript
@Component({
  selector: 'ngt-appearance-switcher',
  imports: [MatIconButton, MatIcon, MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button [matTooltip]="label()" (click)="toggle()">
      <mat-icon>{{ icon() }}</mat-icon>
    </button>
  `,
})
export class AppearanceSwitcherComponent {
  theme = inject(ThemeService);

  icon = computed(() => (this.theme.appearance() === 'flat' ? 'dashboard' : 'blur_on'));

  label = computed(() =>
    this.theme.appearance() === 'flat' ? 'Switch to Glass' : 'Switch to Flat',
  );

  toggle(): void {
    this.theme.setAppearance(this.theme.appearance() === 'flat' ? 'glass' : 'flat');
  }
}
```

### 4.4 `layout-mode-switcher.component.ts` — Vertical/Horizontal/Empty

```typescript
@Component({
  selector: 'ngt-layout-mode-switcher',
  imports: [MatIconButton, MatIcon, MatTooltip, MatMenu, MatMenuItem, MatMenuTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      [matTooltip]="'Layout: ' + theme.layoutMode()"
      [matMenuTriggerFor]="menu"
    >
      <mat-icon>{{ icon() }}</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      @for (opt of options; track opt.value) {
        <button mat-menu-item (click)="theme.setLayoutMode(opt.value)">
          <mat-icon>{{ opt.icon }}</mat-icon>
          <span>{{ opt.label }}</span>
        </button>
      }
    </mat-menu>
  `,
})
export class LayoutModeSwitcherComponent {
  theme = inject(ThemeService);

  options: { value: LayoutMode; label: string; icon: string }[] = [
    { value: 'vertical', label: 'Vertical Sidebar', icon: 'view_sidebar' },
    { value: 'horizontal', label: 'Horizontal Navbar', icon: 'view_day' },
    { value: 'empty', label: 'No Layout', icon: 'fullscreen' },
  ];

  icon = computed(
    () =>
      ({
        vertical: 'view_sidebar',
        horizontal: 'view_day',
        empty: 'fullscreen',
      })[this.theme.layoutMode()],
  );
}
```

### 4.5 `layout-container-switcher.component.ts` — Full/Boxed

```typescript
@Component({
  selector: 'ngt-layout-container-switcher',
  imports: [MatIconButton, MatIcon, MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button [matTooltip]="label()" (click)="toggle()">
      <mat-icon>{{ icon() }}</mat-icon>
    </button>
  `,
})
export class LayoutContainerSwitcherComponent {
  theme = inject(ThemeService);

  icon = computed(() => (this.theme.layoutContainer() === 'full' ? 'fit_screen' : 'crop_free'));

  label = computed(() =>
    this.theme.layoutContainer() === 'full' ? 'Switch to Boxed' : 'Switch to Full',
  );

  toggle(): void {
    this.theme.setLayoutContainer(this.theme.layoutContainer() === 'full' ? 'boxed' : 'full');
  }
}
```

---

## Phase 5 — CSS Styles

### 5.1 `styles/index.css` (entry point library)

```css
/* Import urutan penting: colors → schemes → appearances → layout → overrides */
@import './_base.css';
@import './_colors.css';
@import './_schemes.css';
@import './_appearances.css';
@import './_layout.css';
@import './overrides/index.css';
```

### 5.2 `styles/overrides/index.css`

```css
@import './_button.css';
@import './_form-field.css';
@import './_input.css';
@import './_select.css';
@import './_card.css';
@import './_table.css';
@import './_dialog.css';
@import './_tabs.css';
@import './_chips.css';
@import './_checkbox.css';
@import './_radio.css';
@import './_slide-toggle.css';
@import './_menu.css';
@import './_list.css';
@import './_toolbar.css';
@import './_sidenav.css';
@import './_paginator.css';
@import './_stepper.css';
@import './_expansion.css';
@import './_badge.css';
@import './_tooltip.css';
@import './_snackbar.css';
@import './_datepicker.css';
@import './_progress.css';
@import './_tree.css';
```

---

## Phase 6 — Public API

### 6.1 `src/index.ts`

```typescript
// Service & Provider
export { ThemeService } from './lib/theme.service';
export { provideNgTheme } from './lib/theme.provider';
export { NG_THEME_CONFIG } from './lib/theme.token';

// Types
export type {
  ThemeScheme,
  ThemeColor,
  ThemeAppearance,
  LayoutMode,
  LayoutContainer,
  NgThemeConfig,
} from './lib/theme.types';

// Components (Standalone)
export { SchemeSwitcherComponent } from './lib/components/scheme-switcher/scheme-switcher.component';
export { ColorPickerComponent } from './lib/components/color-picker/color-picker.component';
export { AppearanceSwitcherComponent } from './lib/components/appearance-switcher/appearance-switcher.component';
export { LayoutModeSwitcherComponent } from './lib/components/layout-mode-switcher/layout-mode-switcher.component';
export { LayoutContainerSwitcherComponent } from './lib/components/layout-container-switcher/layout-container-switcher.component';

// Directive
export { ThemeHostDirective } from './lib/directives/theme-host.directive';
```

---

## Phase 7 — Integrasi di Consumer App

### 7.1 Install

```bash
npm install @ojiepermana/angular
```

### 7.2 `styles.css` Consumer App

```css
@import 'tailwindcss';

/* Import semua theme styles dari library */
@import '@ojiepermana/angular/styles';

/* Optional: override theme styles lokal */
@import './overrides-local.css';

/* Sync ke Tailwind utilities */
@theme inline {
  --color-primary: var(--mat-sys-primary);
  --color-on-primary: var(--mat-sys-on-primary);
  --color-secondary: var(--mat-sys-secondary);
  --color-surface: var(--mat-sys-surface);
  --color-background: var(--mat-sys-background);
  --color-error: var(--mat-sys-error);
  --color-outline: var(--mat-sys-outline);
}
```

### 7.3 `app.config.ts` Consumer App

```typescript
import { provideNgTheme } from '@ojiepermana/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgTheme({
      defaultScheme: 'system',
      defaultColor: 'brand',
      defaultAppearance: 'flat',
      defaultLayoutMode: 'vertical',
      defaultLayoutContainer: 'full',
      storageKey: 'my-app-theme',
    }),
  ],
};
```

### 7.4 Usage di Component

```typescript
import {
  SchemeSwitcherComponent,
  ColorPickerComponent,
  AppearanceSwitcherComponent,
  LayoutModeSwitcherComponent,
  LayoutContainerSwitcherComponent,
} from '@ojiepermana/angular';

@Component({
  imports: [
    SchemeSwitcherComponent,
    ColorPickerComponent,
    AppearanceSwitcherComponent,
    LayoutModeSwitcherComponent,
    LayoutContainerSwitcherComponent,
  ],
  template: `
    <mat-toolbar>
      <span>My App</span>
      <span class="flex-1"></span>
      <ngt-color-picker />
      <ngt-appearance-switcher />
      <ngt-layout-mode-switcher />
      <ngt-layout-container-switcher />
      <ngt-scheme-switcher />
    </mat-toolbar>
  `,
})
export class AppComponent {}
```

---

## Phase 8 — Extend Color dari Consumer App

Consumer bisa tambah color baru tanpa modifikasi library:

### `custom-color.css` di consumer app

```css
@layer material-base {
  [theme-colors='brand'] {
    --color-primary-light: #6366f1;
    --color-on-primary-light: #ffffff;
    --color-primary-container-light: #e0e7ff;
    --color-on-primary-container-light: #3730a3;
    --color-primary-dark: #a5b4fc;
    --color-on-primary-dark: #3730a3;
    --color-primary-container-dark: #4f46e5;
    --color-on-primary-container-dark: #e0e7ff;

    --color-secondary-light: #7c3aed;
    --color-on-secondary-light: #ffffff;
    --color-secondary-container-light: #ede9fe;
    --color-on-secondary-container-light: #4c1d95;
    --color-secondary-dark: #c4b5fd;
    --color-on-secondary-dark: #4c1d95;
    --color-secondary-container-dark: #6d28d9;
    --color-on-secondary-container-dark: #ede9fe;
  }
}
```

### Extend type di consumer app

```typescript
// types/theme.d.ts
import '@ojiepermana/angular';

declare module '@ojiepermana/angular' {
  interface ThemeColorMap {
    teal: 'teal';
  }
}
```

---

## Phase 9 — Build & Publish

### 9.1 Build Library

```bash
# Angular CLI
ng build ng-theme

# NX
nx build ng-theme
```

### 9.2 Publish ke npm (Public)

```bash
# Login ke npm
npm login

# Publish (public scoped package)
cd dist/ng-theme
npm publish --access public
```

### 9.3 Versioning (Semantic)

```
1.0.0  → Initial release
1.1.0  → Tambah scheme baru (minor)
1.1.1  → Bugfix CSS override (patch)
2.0.0  → Breaking: ubah API ThemeService (major)
```

---

## Checklist Per Phase

| Phase | Task                                                  | Status |
| ----- | ----------------------------------------------------- | ------ |
| 1     | Setup library project structure                       | ⬜     |
| 1     | Konfigurasi `ng-package.json` & `package.json`        | ⬜     |
| 2     | Buat `theme.types.ts`                                 | ⬜     |
| 2     | Buat `theme.token.ts` (InjectionToken)                | ⬜     |
| 2     | Buat `theme.provider.ts` (`provideNgTheme`)           | ⬜     |
| 3     | Implementasi `ThemeService` dengan signals            | ⬜     |
| 3     | SSR-safe (cek `isPlatformBrowser`)                    | ⬜     |
| 3     | Persist ke `localStorage`                             | ⬜     |
| 4     | Buat `SchemeSwitcherComponent` (light/dark/system)    | ⬜     |
| 4     | Buat `ColorPickerComponent` (color palette)           | ⬜     |
| 4     | Buat `AppearanceSwitcherComponent` (flat/glass)       | ⬜     |
| 4     | Buat `LayoutModeSwitcherComponent` (vert/horiz/empty) | ⬜     |
| 4     | Buat `LayoutContainerSwitcherComponent` (full/boxed)  | ⬜     |
| 5     | Buat `_colors.css` (semua palette)                    | ⬜     |
| 5     | Buat `_schemes.css` (light / dark / system)           | ⬜     |
| 5     | Buat `_appearances.css` (flat / glass)                | ⬜     |
| 5     | Buat `_layout.css` (layout-mode & layout-container)   | ⬜     |
| 5     | Buat semua `overrides/_*.css` per component           | ⬜     |
| 6     | Export public API di `index.ts`                       | ⬜     |
| 7     | Test integrasi di satu consumer app                   | ⬜     |
| 8     | Test extend color custom                              | ⬜     |
| 9     | Build & publish ke npm (public)                       | ⬜     |

---

## Dependency Requirements

| Package             | Version    | Keterangan                         |
| ------------------- | ---------- | ---------------------------------- |
| `@angular/core`     | `>=21.0.0` | Signals API                        |
| `@angular/material` | `>=21.0.0` | MDC-based components               |
| `tailwindcss`       | `>=4.0.0`  | CSS-first config, `@layer` support |
| `ng-packagr`        | `>=21.0.0` | Library build tool                 |

---

## Catatan Penting

1. **SSR / Universal** — semua DOM manipulation di `ThemeService` harus guard dengan `isPlatformBrowser()`
2. **Cascade order** — pastikan `_colors.css` di-import SEBELUM `_schemes.css` agar variable inheritance benar
3. **`@layer material-base`** — wajib agar Tailwind utilities bisa override Material styles
4. **Angular CDK overlay** — beberapa Material component (dialog, select, menu) render di `body` via CDK overlay, pastikan semua attributes (`theme-schemes`, `theme-colors`, `theme-appearances`, `layout-mode`, `layout-container`) di-set pada `document.documentElement` bukan hanya di component host
5. **Prebuilt theme tidak dipakai** — library ini menggantikan prebuilt theme sepenuhnya via CSS variables, jangan import `@angular/material/prebuilt-themes/*.css`
6. **Appearances** — `glass` appearance menggunakan `backdrop-filter: blur()` dan transparansi, pastikan browser support & performance di mobile
7. **Layout** — `layout-mode` dan `layout-container` hanya mengontrol CSS variables / class; implementasi layout structure tetap di sisi consumer app atau layout component library
