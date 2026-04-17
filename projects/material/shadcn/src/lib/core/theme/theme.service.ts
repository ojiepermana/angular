import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  DEFAULT_NG_SHADCN_CONFIG,
  NG_SHADCN_CONFIG,
  type ColorScheme,
  type ThemeName,
} from './theme.tokens';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly config = {
    ...DEFAULT_NG_SHADCN_CONFIG,
    ...(inject(NG_SHADCN_CONFIG, { optional: true }) ?? {}),
  };

  private readonly _scheme = signal<ColorScheme>(
    this.readPersistedScheme() ?? this.config.defaultScheme,
  );
  private readonly _theme = signal<ThemeName>(this.config.defaultTheme);

  readonly scheme = this._scheme.asReadonly();
  readonly theme = this._theme.asReadonly();

  readonly isDark = computed(() => {
    const s = this._scheme();
    if (s === 'system') {
      return this.prefersDark();
    }
    return s === 'dark';
  });

  constructor() {
    effect(() => {
      const root = this.document.documentElement;
      root.dataset['theme'] = this._theme();
      root.classList.toggle('dark', this.isDark());
      this.persistScheme(this._scheme());
    });
  }

  setScheme(scheme: ColorScheme): void {
    this._scheme.set(scheme);
  }

  setTheme(theme: ThemeName): void {
    this._theme.set(theme);
  }

  toggleScheme(): void {
    this._scheme.update((s) => (s === 'dark' ? 'light' : 'dark'));
  }

  private prefersDark(): boolean {
    const mql = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    return !!mql?.matches;
  }

  private readPersistedScheme(): ColorScheme | null {
    const key = this.config.storageKey;
    if (!key) return null;
    try {
      const v = this.document.defaultView?.localStorage?.getItem(key);
      return v === 'light' || v === 'dark' || v === 'system' ? v : null;
    } catch {
      return null;
    }
  }

  private persistScheme(scheme: ColorScheme): void {
    const key = this.config.storageKey;
    if (!key) return;
    try {
      this.document.defaultView?.localStorage?.setItem(key, scheme);
    } catch {
      /* ignore */
    }
  }
}
