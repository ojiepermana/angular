import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  COLOR_SCHEMES,
  COLORS,
  DEFAULT_MATERIAL_THEME_CONFIG,
  MATERIAL_THEME_CONFIG,
  STYLES,
  type ColorScheme,
  type ResolvedMaterialThemeConfig,
  type ThemeColor,
  type ThemeConfig,
  type ThemeMode,
  type ThemeStyle,
  isColorScheme,
  isThemeColor,
  isThemeStyle,
} from './theme.tokens';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly config = this.resolveConfig();

  private readonly _modePreference = signal<ColorScheme>(this.readPersistedMode() ?? this.config.defaultMode);
  private readonly _color = signal<ThemeColor>(this.readPersistedColor() ?? this.config.defaultColor);
  private readonly _style = signal<ThemeStyle>(this.readPersistedStyle() ?? this.config.defaultStyle);
  private readonly _systemPrefersDark = signal<boolean>(this.prefersDark());

  readonly scheme = this._modePreference.asReadonly();
  readonly color = this._color.asReadonly();
  readonly theme = this._color.asReadonly();
  readonly style = this._style.asReadonly();
  readonly mode = computed<ThemeMode>(() => this.resolveMode(this._modePreference()));
  readonly snapshot = computed<ThemeConfig>(() => ({
    mode: this.mode(),
    color: this._color(),
    style: this._style(),
  }));

  readonly isDark = computed(() => this.mode() === 'dark');

  constructor() {
    this.watchSystemScheme();

    effect(() => {
      const root = this.document.documentElement;
      const mode = this.mode();
      const color = this._color();
      const style = this._style();

      root.dataset['mode'] = mode;
      root.dataset['color'] = color;
      root.dataset['style'] = style;
      root.dataset['theme'] = color;
      root.classList.toggle('dark', mode === 'dark');

      this.persistMode(this._modePreference());
      this.persistColor(color);
      this.persistStyle(style);
    });
  }

  setMode(mode: ThemeMode): void {
    this._modePreference.set(mode);
  }

  setScheme(scheme: ColorScheme): void {
    this._modePreference.set(scheme);
  }

  setColor(color: ThemeColor): void {
    this._color.set(color);
  }

  setTheme(theme: ThemeColor | string): void {
    if (isThemeColor(theme)) {
      this._color.set(theme);
    }
  }

  setStyle(style: ThemeStyle): void {
    this._style.set(style);
  }

  setAll(config: Partial<ThemeConfig> & { readonly scheme?: ColorScheme }): void {
    if (config.scheme) {
      this.setScheme(config.scheme);
    }
    if (config.mode) {
      this.setMode(config.mode);
    }
    if (config.color) {
      this.setColor(config.color);
    }
    if (config.style) {
      this.setStyle(config.style);
    }
  }

  toggleScheme(): void {
    this.toggleMode();
  }

  toggleMode(): void {
    this.setMode(this.mode() === 'dark' ? 'light' : 'dark');
  }

  reset(): void {
    this._modePreference.set(this.config.defaultMode);
    this._color.set(this.config.defaultColor);
    this._style.set(this.config.defaultStyle);
  }

  private resolveConfig(): ResolvedMaterialThemeConfig {
    const config = inject(MATERIAL_THEME_CONFIG, { optional: true }) ?? {};

    const defaultMode = isColorScheme(config.defaultMode ?? config.defaultScheme)
      ? (config.defaultMode ?? config.defaultScheme)!
      : DEFAULT_MATERIAL_THEME_CONFIG.defaultMode;
    const defaultColor = isThemeColor(config.defaultColor ?? config.defaultTheme)
      ? ((config.defaultColor ?? config.defaultTheme) as ThemeColor)
      : DEFAULT_MATERIAL_THEME_CONFIG.defaultColor;
    const defaultStyle = isThemeStyle(config.defaultStyle)
      ? config.defaultStyle
      : DEFAULT_MATERIAL_THEME_CONFIG.defaultStyle;

    return {
      defaultMode,
      defaultColor,
      defaultStyle,
      modeStorageKey:
        config.modeStorageKey ??
        config.schemeStorageKey ??
        config.storageKey ??
        DEFAULT_MATERIAL_THEME_CONFIG.modeStorageKey,
      colorStorageKey:
        config.colorStorageKey ?? config.themeStorageKey ?? DEFAULT_MATERIAL_THEME_CONFIG.colorStorageKey,
      styleStorageKey: config.styleStorageKey ?? DEFAULT_MATERIAL_THEME_CONFIG.styleStorageKey,
    };
  }

  private resolveMode(mode: ColorScheme): ThemeMode {
    return mode === 'system' ? (this._systemPrefersDark() ? 'dark' : 'light') : mode;
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

  private readPersistedMode(): ColorScheme | null {
    const key = this.config.modeStorageKey;
    if (!key) return null;
    try {
      const value = this.document.defaultView?.localStorage?.getItem(key);
      return COLOR_SCHEMES.some((scheme) => scheme === value) ? (value as ColorScheme) : null;
    } catch {
      return null;
    }
  }

  private readPersistedColor(): ThemeColor | null {
    const key = this.config.colorStorageKey;
    if (!key) return null;
    try {
      const value = this.document.defaultView?.localStorage?.getItem(key);
      return COLORS.some((color) => color === value) ? (value as ThemeColor) : null;
    } catch {
      return null;
    }
  }

  private readPersistedStyle(): ThemeStyle | null {
    const key = this.config.styleStorageKey;
    if (!key) return null;
    try {
      const value = this.document.defaultView?.localStorage?.getItem(key);
      return STYLES.some((style) => style === value) ? (value as ThemeStyle) : null;
    } catch {
      return null;
    }
  }

  private persistMode(mode: ColorScheme): void {
    const key = this.config.modeStorageKey;
    if (!key) return;
    try {
      this.document.defaultView?.localStorage?.setItem(key, mode);
    } catch {
      /* ignore */
    }
  }

  private persistColor(color: ThemeColor): void {
    const key = this.config.colorStorageKey;
    if (!key) return;
    try {
      this.document.defaultView?.localStorage?.setItem(key, color);
    } catch {
      /* ignore */
    }
  }

  private persistStyle(style: ThemeStyle): void {
    const key = this.config.styleStorageKey;
    if (!key) return;
    try {
      this.document.defaultView?.localStorage?.setItem(key, style);
    } catch {
      /* ignore */
    }
  }
}
