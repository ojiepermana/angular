import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { DEFAULT_MATERIAL_THEME_CONFIG, MATERIAL_THEME_CONFIG, type ColorScheme, type ThemeName } from './theme.tokens';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly config = {
    ...DEFAULT_MATERIAL_THEME_CONFIG,
    ...(inject(MATERIAL_THEME_CONFIG, { optional: true }) ?? {}),
  };

  private readonly _scheme = signal<ColorScheme>(this.readPersistedScheme() ?? this.config.defaultScheme);
  private readonly _theme = signal<ThemeName>(this.config.defaultTheme);
  private readonly _systemPrefersDark = signal<boolean>(this.prefersDark());

  readonly scheme = this._scheme.asReadonly();
  readonly theme = this._theme.asReadonly();

  readonly isDark = computed(() => {
    const s = this._scheme();
    return s === 'system' ? this._systemPrefersDark() : s === 'dark';
  });

  constructor() {
    this.watchSystemScheme();

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

  private watchSystemScheme(): void {
    const mql = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mql) return;

    const listener = (event: MediaQueryListEvent): void => {
      this._systemPrefersDark.set(event.matches);
    };
    mql.addEventListener('change', listener);
    this.destroyRef.onDestroy(() => mql.removeEventListener('change', listener));
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
