# Plan: Angular Material Theme Library

## Overview

Library Angular yang menyediakan **dual-axis theming system** (mode × scheme) untuk Angular Material + Tailwind CSS v4. Setiap aplikasi cukup install library ini untuk mendapatkan theming yang konsisten.

---

## Nama Library

```
@ojiepermana/angular
```

---

## Goals

- Satu library, konsisten di semua aplikasi
- Support `data-theme` = `light | dark | system`
- Support `data-scheme` = `blue | green | red | cyan | purple | orange | ...`
- Bisa extend / tambah scheme baru dari aplikasi consumer
- Persist preference ke `localStorage`
- Tree-shakeable, zero runtime overhead
- Compatible dengan Angular 21+ (Standalone API)

---

## Arsitektur Library

```
libs/
└── ng-theme/
    ├── src/
    │   ├── lib/
    │   │   ├── theme.service.ts          ← core service (mode + scheme)
    │   │   ├── theme.types.ts            ← ThemeMode, ColorScheme types
    │   │   ├── theme.token.ts            ← InjectionToken untuk config
    │   │   ├── theme.provider.ts         ← provideNgTheme() function
    │   │   ├── directives/
    │   │   │   └── theme-host.directive.ts  ← apply data-* ke host element
    │   │   └── components/
    │   │       ├── theme-toggle/         ← mode toggle button
    │   │       │   ├── theme-toggle.component.ts
    │   │       │   └── theme-toggle.component.html
    │   │       └── scheme-picker/        ← color scheme picker
    │   │           ├── scheme-picker.component.ts
    │   │           └── scheme-picker.component.html
    │   ├── styles/
    │   │   ├── index.css                 ← entry point styles
    │   │   ├── _base.css                 ← reset & typography tokens
    │   │   ├── _scheme.css               ← color palette per scheme
    │   │   ├── _mode.css                 ← light / dark / system vars
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
ng generate library ng-theme --prefix=ngt

# Atau dengan NX
nx generate @nx/angular:library ng-theme --publishable --importPath=@your-org/ng-theme
```

### 1.2 `package.json` Library

```json
{
  "name": "@your-org/ng-theme",
  "version": "1.0.0",
  "peerDependencies": {
    "@angular/core": ">=17.0.0",
    "@angular/material": ">=17.0.0",
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
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'blue' | 'green' | 'red' | 'cyan' | 'purple' | 'orange';

export interface NgThemeConfig {
  defaultMode: ThemeMode;
  defaultScheme: ColorScheme;
  storageKey?: string; // default: 'ng-theme'
  schemes?: ColorScheme[]; // override list yang ditampilkan di picker
}
```

### 2.2 `theme.token.ts`

```typescript
import { InjectionToken } from '@angular/core';
import { NgThemeConfig } from './theme.types';

export const NG_THEME_CONFIG = new InjectionToken<NgThemeConfig>('NG_THEME_CONFIG', {
  factory: () => ({
    defaultMode: 'system',
    defaultScheme: 'blue',
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
  defaultMode: 'system',
  defaultScheme: 'blue',
  storageKey: 'ng-theme',
};
```

---

## Phase 3 — Theme Service

### 3.1 `theme.service.ts`

```typescript
import { Injectable, inject, signal, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NG_THEME_CONFIG } from './theme.token';
import { ThemeMode, ColorScheme } from './theme.types';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private config = inject(NG_THEME_CONFIG);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private storageMode = `${this.config.storageKey}:mode`;
  private storageScheme = `${this.config.storageKey}:scheme`;

  mode = signal<ThemeMode>(this.loadMode());
  scheme = signal<ColorScheme>(this.loadScheme());

  constructor() {
    effect(() => {
      if (this.isBrowser) {
        this.applyToDOM(this.mode(), this.scheme());
      }
    });
  }

  setMode(mode: ThemeMode): void {
    if (this.isBrowser) localStorage.setItem(this.storageMode, mode);
    this.mode.set(mode);
  }

  setScheme(scheme: ColorScheme): void {
    if (this.isBrowser) localStorage.setItem(this.storageScheme, scheme);
    this.scheme.set(scheme);
  }

  toggleMode(): void {
    const next: ThemeMode = this.mode() === 'dark' ? 'light' : 'dark';
    this.setMode(next);
  }

  /** Computed: resolves 'system' to actual 'light' | 'dark' */
  get resolvedMode(): 'light' | 'dark' {
    if (this.mode() !== 'system') return this.mode() as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyToDOM(mode: ThemeMode, scheme: ColorScheme): void {
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('data-scheme', scheme);
  }

  private loadMode(): ThemeMode {
    if (!this.isBrowser) return this.config.defaultMode;
    return (localStorage.getItem(this.storageMode) as ThemeMode) ?? this.config.defaultMode;
  }

  private loadScheme(): ColorScheme {
    if (!this.isBrowser) return this.config.defaultScheme;
    return (localStorage.getItem(this.storageScheme) as ColorScheme) ?? this.config.defaultScheme;
  }
}
```

---

## Phase 4 — Components

### 4.1 `theme-toggle.component.ts`

```typescript
@Component({
  selector: 'ngt-theme-toggle',
  standalone: true,
  imports: [MatIconButton, MatIcon, MatTooltip],
  template: `
    <button mat-icon-button [matTooltip]="label()" (click)="theme.toggleMode()">
      <mat-icon>{{ icon() }}</mat-icon>
    </button>
  `,
})
export class ThemeToggleComponent {
  theme = inject(ThemeService);

  icon = computed(
    () =>
      ({
        light: 'light_mode',
        dark: 'dark_mode',
        system: 'brightness_auto',
      })[this.theme.mode()],
  );

  label = computed(
    () =>
      ({
        light: 'Switch to Dark',
        dark: 'Switch to Light',
        system: 'Following System',
      })[this.theme.mode()],
  );
}
```

### 4.2 `scheme-picker.component.ts`

```typescript
@Component({
  selector: 'ngt-scheme-picker',
  standalone: true,
  imports: [NgFor, MatTooltip],
  template: `
    <div class="flex items-center gap-2">
      @for (s of schemes; track s.value) {
        <button
          class="w-7 h-7 rounded-full transition-all ring-offset-2 ring-offset-surface"
          [style.background]="s.color"
          [class.ring-2]="theme.scheme() === s.value"
          [class.ring-primary]="theme.scheme() === s.value"
          [matTooltip]="s.label"
          (click)="theme.setScheme(s.value)"
        ></button>
      }
    </div>
  `,
})
export class SchemePickerComponent {
  theme = inject(ThemeService);

  schemes: { value: ColorScheme; label: string; color: string }[] = [
    { value: 'blue', label: 'Blue', color: '#1d4ed8' },
    { value: 'green', label: 'Green', color: '#16a34a' },
    { value: 'red', label: 'Red', color: '#dc2626' },
    { value: 'cyan', label: 'Cyan', color: '#0891b2' },
    { value: 'purple', label: 'Purple', color: '#9333ea' },
    { value: 'orange', label: 'Orange', color: '#ea580c' },
  ];
}
```

---

## Phase 5 — CSS Styles

### 5.1 `styles/index.css` (entry point library)

```css
/* Import urutan penting: scheme → mode → overrides */
@import './_base.css';
@import './_scheme.css';
@import './_mode.css';
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
export type { ThemeMode, ColorScheme, NgThemeConfig } from './lib/theme.types';

// Components (Standalone)
export { ThemeToggleComponent } from './lib/components/theme-toggle/theme-toggle.component';
export { SchemePickerComponent } from './lib/components/scheme-picker/scheme-picker.component';

// Directive
export { ThemeHostDirective } from './lib/directives/theme-host.directive';
```

---

## Phase 7 — Integrasi di Consumer App

### 7.1 Install

```bash
npm install @your-org/ng-theme
```

### 7.2 `styles.css` Consumer App

```css
@import 'tailwindcss';

/* Import semua theme styles dari library */
@import '@your-org/ng-theme/styles';

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
import { provideNgTheme } from '@your-org/ng-theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgTheme({
      defaultMode: 'system',
      defaultScheme: 'blue',
      storageKey: 'my-app-theme',
    }),
  ],
};
```

### 7.4 Usage di Component

```typescript
import { ThemeToggleComponent, SchemePickerComponent } from '@your-org/ng-theme';

@Component({
  standalone: true,
  imports: [ThemeToggleComponent, SchemePickerComponent],
  template: `
    <mat-toolbar>
      <span>My App</span>
      <span class="flex-1"></span>
      <ngt-scheme-picker />
      <ngt-theme-toggle />
    </mat-toolbar>
  `,
})
export class AppComponent {}
```

---

## Phase 8 — Extend Scheme dari Consumer App

Consumer bisa tambah scheme baru tanpa modifikasi library:

### `custom-scheme.css` di consumer app

```css
@layer material-base {
  [data-scheme='brand'] {
    --scheme-primary-light: #0f766e;
    --scheme-on-primary-light: #ffffff;
    --scheme-primary-container-light: #ccfbf1;
    --scheme-on-primary-container-light: #134e4a;
    --scheme-primary-dark: #5eead4;
    --scheme-on-primary-dark: #134e4a;
    --scheme-primary-container-dark: #0f766e;
    --scheme-on-primary-container-dark: #ccfbf1;

    --scheme-secondary-light: #7c3aed;
    --scheme-on-secondary-light: #ffffff;
    --scheme-secondary-container-light: #ede9fe;
    --scheme-on-secondary-container-light: #4c1d95;
    --scheme-secondary-dark: #c4b5fd;
    --scheme-on-secondary-dark: #4c1d95;
    --scheme-secondary-container-dark: #6d28d9;
    --scheme-on-secondary-container-dark: #ede9fe;
  }
}
```

### Extend type di consumer app

```typescript
// types/theme.d.ts
import '@your-org/ng-theme';

declare module '@your-org/ng-theme' {
  interface ColorSchemeMap {
    brand: 'brand';
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

### 9.2 Publish ke Private Registry (Verdaccio / GitHub Packages / Nexus)

```bash
# Login
npm login --registry=https://your-registry.com

# Publish
cd dist/ng-theme
npm publish --registry=https://your-registry.com
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

| Phase | Task                                           | Status |
| ----- | ---------------------------------------------- | ------ |
| 1     | Setup library project structure                | ⬜     |
| 1     | Konfigurasi `ng-package.json` & `package.json` | ⬜     |
| 2     | Buat `theme.types.ts`                          | ⬜     |
| 2     | Buat `theme.token.ts` (InjectionToken)         | ⬜     |
| 2     | Buat `theme.provider.ts` (`provideNgTheme`)    | ⬜     |
| 3     | Implementasi `ThemeService` dengan signals     | ⬜     |
| 3     | SSR-safe (cek `isPlatformBrowser`)             | ⬜     |
| 3     | Persist ke `localStorage`                      | ⬜     |
| 4     | Buat `ThemeToggleComponent`                    | ⬜     |
| 4     | Buat `SchemePickerComponent`                   | ⬜     |
| 5     | Buat `_scheme.css` (semua palette)             | ⬜     |
| 5     | Buat `_mode.css` (light / dark / system)       | ⬜     |
| 5     | Buat semua `overrides/_*.css` per component    | ⬜     |
| 6     | Export public API di `index.ts`                | ⬜     |
| 7     | Test integrasi di satu consumer app            | ⬜     |
| 8     | Test extend scheme custom                      | ⬜     |
| 9     | Build & publish ke private registry            | ⬜     |

---

## Dependency Requirements

| Package             | Version    | Keterangan                         |
| ------------------- | ---------- | ---------------------------------- |
| `@angular/core`     | `>=17.0.0` | Signals API                        |
| `@angular/material` | `>=17.0.0` | MDC-based components               |
| `tailwindcss`       | `>=4.0.0`  | CSS-first config, `@layer` support |
| `ng-packagr`        | `>=17.0.0` | Library build tool                 |

---

## Catatan Penting

1. **SSR / Universal** — semua DOM manipulation di `ThemeService` harus guard dengan `isPlatformBrowser()`
2. **Cascade order** — pastikan `_scheme.css` di-import SEBELUM `_mode.css` agar variable inheritance benar
3. **`@layer material-base`** — wajib agar Tailwind utilities bisa override Material styles
4. **Angular CDK overlay** — beberapa Material component (dialog, select, menu) render di `body` via CDK overlay, pastikan `data-theme` dan `data-scheme` di-set pada `document.documentElement` bukan hanya di component host
5. **Prebuilt theme tidak dipakai** — library ini menggantikan prebuilt theme sepenuhnya via CSS variables, jangan import `@angular/material/prebuilt-themes/*.css`
