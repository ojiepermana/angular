import { Injectable, inject, signal, computed, effect, DOCUMENT } from '@angular/core';

export type ThemeMode = 'light' | 'dark';
export type ThemeVariant = 'default' | 'business' | 'nature' | 'colorful';

export interface ThemeConfig {
  mode: ThemeMode;
  variant: ThemeVariant;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly documentElement = this.document.documentElement;

  // Storage keys
  private readonly THEME_MODE_KEY = 'theme-mode';
  private readonly THEME_VARIANT_KEY = 'theme-variant';

  // Reactive state
  private readonly _mode = signal<ThemeMode>(this.getStoredThemeMode());
  private readonly _variant = signal<ThemeVariant>(this.getStoredThemeVariant());

  // Public readonly signals
  readonly mode = this._mode.asReadonly();
  readonly variant = this._variant.asReadonly();

  // Computed current theme config
  readonly currentTheme = computed<ThemeConfig>(() => ({
    mode: this.mode(),
    variant: this.variant()
  }));

  // Computed theme classes for UI
  readonly themeClasses = computed(() => {
    const mode = this.mode();
    const variant = this.variant();
    return {
      'theme-dark': mode === 'dark',
      'theme-light': mode === 'light',
      [`theme-${variant}`]: variant !== 'default'
    };
  });

  constructor() {
    // Apply initial theme
    this.applyTheme();

    // Watch for changes and apply them
    effect(() => {
      this.applyTheme();
      this.saveThemeToStorage();
    });

    // Listen for system theme changes
    this.listenToSystemTheme();
  }

  /**
   * Set theme mode (light/dark)
   */
  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
  }

  /**
   * Set theme variant (default/business/nature/colorful)
   */
  setVariant(variant: ThemeVariant): void {
    this._variant.set(variant);
  }

  /**
   * Set complete theme configuration
   */
  setTheme(config: ThemeConfig): void {
    this._mode.set(config.mode);
    this._variant.set(config.variant);
  }

  /**
   * Toggle between light and dark mode
   */
  toggleMode(): void {
    const currentMode = this.mode();
    this.setMode(currentMode === 'light' ? 'dark' : 'light');
  }

  /**
   * Get if current mode is dark
   */
  isDark = computed(() => this.mode() === 'dark');

  /**
   * Get if current mode is light
   */
  isLight = computed(() => this.mode() === 'light');

  /**
   * Reset theme to system preference
   */
  resetToSystem(): void {
    const systemTheme = this.getSystemTheme();
    this.setMode(systemTheme);
    // Keep current variant
  }

  /**
   * Get all available theme variants
   */
  getAvailableVariants(): ThemeVariant[] {
    return ['default', 'business', 'nature', 'colorful'];
  }

  /**
   * Get all available theme modes
   */
  getAvailableModes(): ThemeMode[] {
    return ['light', 'dark'];
  }

  private applyTheme(): void {
    const mode = this.mode();
    const variant = this.variant();

    // Apply theme mode
    this.documentElement.setAttribute('data-theme-mode', mode);

    // Apply theme variant
    if (variant === 'default') {
      this.documentElement.removeAttribute('data-theme-variant');
    } else {
      this.documentElement.setAttribute('data-theme-variant', variant);
    }

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(mode);
  }

  private updateMetaThemeColor(mode: ThemeMode): void {
    const metaThemeColor = this.document.querySelector('meta[name="theme-color"]');
    const color = mode === 'dark' ? '#000000' : '#ffffff';

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      const meta = this.document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      this.document.head.appendChild(meta);
    }
  }

  private getStoredThemeMode(): ThemeMode {
    if (typeof localStorage === 'undefined') {
      return this.getSystemTheme();
    }

    const stored = localStorage.getItem(this.THEME_MODE_KEY) as ThemeMode;
    return stored || this.getSystemTheme();
  }

  private getStoredThemeVariant(): ThemeVariant {
    if (typeof localStorage === 'undefined') {
      return 'default';
    }

    const stored = localStorage.getItem(this.THEME_VARIANT_KEY) as ThemeVariant;
    return stored || 'default';
  }

  private saveThemeToStorage(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.THEME_MODE_KEY, this.mode());
    localStorage.setItem(this.THEME_VARIANT_KEY, this.variant());
  }

  private getSystemTheme(): ThemeMode {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private listenToSystemTheme(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      const hasStoredMode = localStorage.getItem(this.THEME_MODE_KEY);
      if (!hasStoredMode) {
        this.setMode(e.matches ? 'dark' : 'light');
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }
  }
}
