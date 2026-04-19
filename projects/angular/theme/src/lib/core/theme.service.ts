import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  COLOR_SCHEMES,
  DEFAULT_MATERIAL_THEME_CONFIG,
  MATERIAL_THEME_CONFIG,
  type ColorScheme,
  type ResolvedMaterialThemeConfig,
  type ThemeBrand,
  type ThemeColor,
  type ThemeConfig,
  type ThemeMode,
  type ThemeStyle,
  isThemeBrand,
  isColorScheme,
  isThemeColor,
  isThemeStyle,
} from './theme.tokens';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly config = this.resolveConfig();
  private readonly initialBrand = this.readPersistedBrand() ?? this.config.defaultBrand;

  private readonly _modePreference = signal<ColorScheme>(this.readPersistedMode() ?? this.config.defaultMode);
  private readonly _brand = signal<ThemeBrand | null>(this.initialBrand);
  private readonly _color = signal<ThemeColor>(
    this.initialBrand ? this.config.defaultColor : (this.readPersistedColor() ?? this.config.defaultColor),
  );
  private readonly _style = signal<ThemeStyle>(
    this.initialBrand ? this.config.defaultStyle : (this.readPersistedStyle() ?? this.config.defaultStyle),
  );
  private readonly _systemPrefersDark = signal<boolean>(this.prefersDark());

  readonly scheme = this._modePreference.asReadonly();
  readonly brand = this._brand.asReadonly();
  readonly color = this._color.asReadonly();
  readonly theme = this._color.asReadonly();
  readonly style = this._style.asReadonly();
  readonly mode = computed<ThemeMode>(() => this.resolveMode(this._modePreference()));
  readonly snapshot = computed<ThemeConfig>(() => ({
    mode: this.mode(),
    brand: this._brand(),
    color: this._color(),
    style: this._style(),
  }));

  readonly isDark = computed(() => this.mode() === 'dark');

  constructor() {
    this.watchSystemScheme();

    effect(() => {
      const root = this.document.documentElement;
      const mode = this.mode();
      const brand = this._brand();
      const color = this._color();
      const style = this._style();

      root.dataset['mode'] = mode;
      root.dataset['theme'] = brand ?? color;
      root.classList.toggle('dark', mode === 'dark');

      this.persistMode(this._modePreference());

      if (brand) {
        root.setAttribute('theme-brand', brand);
        root.removeAttribute('theme-color');
        root.removeAttribute('theme-style');
        delete root.dataset['color'];
        delete root.dataset['style'];

        this.persistBrand(brand);
        this.clearPersistedColor();
        this.clearPersistedStyle();
        return;
      }

      root.removeAttribute('theme-brand');
      root.setAttribute('theme-color', color);
      root.setAttribute('theme-style', style);
      root.dataset['color'] = color;
      root.dataset['style'] = style;

      this.clearPersistedBrand();
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

  setBrand(brand: ThemeBrand | null): void {
    this._brand.set(brand);
    this._color.set(this.config.defaultColor);
    this._style.set(this.config.defaultStyle);
  }

  setColor(color: ThemeColor): void {
    if (this._brand()) {
      this._brand.set(null);
    }
    this._color.set(color);
  }

  setTheme(theme: ThemeColor | string): void {
    if (isThemeColor(theme)) {
      this.setColor(theme);
    }
  }

  setStyle(style: ThemeStyle): void {
    if (this._brand()) {
      this._brand.set(null);
    }
    this._style.set(style);
  }

  setAll(config: Partial<ThemeConfig> & { readonly scheme?: ColorScheme }): void {
    if (config.scheme) {
      this.setScheme(config.scheme);
    }
    if (config.mode) {
      this.setMode(config.mode);
    }
    if (config.brand !== undefined) {
      this.setBrand(config.brand);
    }
    if (config.brand === undefined || config.brand === null) {
      if (config.color) {
        this.setColor(config.color);
      }
      if (config.style) {
        this.setStyle(config.style);
      }
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
    this._brand.set(this.config.defaultBrand);
    this._color.set(this.config.defaultColor);
    this._style.set(this.config.defaultStyle);
  }

  private resolveConfig(): ResolvedMaterialThemeConfig {
    const config = inject(MATERIAL_THEME_CONFIG, { optional: true }) ?? {};
    const configuredMode = config.mode ?? config.defaultMode ?? config.defaultScheme;
    const configuredBrand = config.brand ?? config['theme-brand'] ?? config.defaultBrand;
    const configuredColor = config.color ?? config.defaultColor ?? config.defaultTheme;
    const configuredStyle = config.style ?? config.defaultStyle;

    const defaultMode = isColorScheme(configuredMode) ? configuredMode : DEFAULT_MATERIAL_THEME_CONFIG.defaultMode;
    const defaultBrand = isThemeBrand(configuredBrand) ? configuredBrand : DEFAULT_MATERIAL_THEME_CONFIG.defaultBrand;
    const defaultColor = isThemeColor(configuredColor) ? configuredColor : DEFAULT_MATERIAL_THEME_CONFIG.defaultColor;
    const defaultStyle = isThemeStyle(configuredStyle) ? configuredStyle : DEFAULT_MATERIAL_THEME_CONFIG.defaultStyle;

    return {
      defaultMode,
      defaultBrand,
      defaultColor,
      defaultStyle,
      modeStorageKey:
        config.modeStorageKey ??
        config.schemeStorageKey ??
        config.storageKey ??
        DEFAULT_MATERIAL_THEME_CONFIG.modeStorageKey,
      brandStorageKey: config.brandStorageKey ?? DEFAULT_MATERIAL_THEME_CONFIG.brandStorageKey,
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
      return isColorScheme(value) ? value : null;
    } catch {
      return null;
    }
  }

  private readPersistedBrand(): ThemeBrand | null {
    const key = this.config.brandStorageKey;
    if (!key) return null;
    try {
      const value = this.document.defaultView?.localStorage?.getItem(key);
      return isThemeBrand(value) ? value : null;
    } catch {
      return null;
    }
  }

  private readPersistedColor(): ThemeColor | null {
    const key = this.config.colorStorageKey;
    if (!key) return null;
    try {
      const value = this.document.defaultView?.localStorage?.getItem(key);
      return isThemeColor(value) ? value : null;
    } catch {
      return null;
    }
  }

  private readPersistedStyle(): ThemeStyle | null {
    const key = this.config.styleStorageKey;
    if (!key) return null;
    try {
      const value = this.document.defaultView?.localStorage?.getItem(key);
      return isThemeStyle(value) ? value : null;
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

  private persistBrand(brand: ThemeBrand): void {
    const key = this.config.brandStorageKey;
    if (!key) return;
    try {
      this.document.defaultView?.localStorage?.setItem(key, brand);
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

  private clearPersistedBrand(): void {
    this.clearPersistedItem(this.config.brandStorageKey);
  }

  private clearPersistedColor(): void {
    this.clearPersistedItem(this.config.colorStorageKey);
  }

  private clearPersistedStyle(): void {
    this.clearPersistedItem(this.config.styleStorageKey);
  }

  private clearPersistedItem(key: string | null): void {
    if (!key) return;
    try {
      this.document.defaultView?.localStorage?.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}
