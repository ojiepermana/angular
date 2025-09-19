import { Injectable, signal } from '@angular/core';

export type ThemeName = 'default' | 'red' | 'rose' | 'orange' | 'green' | 'blue' | 'yellow' | 'violet' | 'zinc' | 'slate' | 'stone';
export type ColorMode = 'light' | 'dark' | 'system';

/**
 * Enhanced Theme Service
 *
 * Manages both shadcn/ui themes and Angular Material integration
 * Provides seamless theme switching for both systems
 */
@Injectable({
  providedIn: 'root'
})
export class EnhancedThemeService {
  private readonly storageKey = 'op-theme';
  private readonly colorModeKey = 'op-color-mode';

  // Signals for reactive theme management
  currentTheme = signal<ThemeName>('default');
  colorMode = signal<ColorMode>('system');
  isDark = signal(false);

  private readonly availableThemes: ThemeName[] = [
    'default', 'red', 'rose', 'orange', 'green',
    'blue', 'yellow', 'violet', 'zinc', 'slate', 'stone'
  ];

  constructor() {
    this.initializeTheme();
    this.setupSystemColorModeListener();
  }

  /**
   * Set the theme and apply it to both shadcn/ui and Angular Material
   */
  setTheme(theme: ThemeName): void {
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.storageKey, theme);
  }

  /**
   * Set color mode (light/dark/system)
   */
  setColorMode(mode: ColorMode): void {
    this.colorMode.set(mode);
    this.applyColorMode(mode);
    localStorage.setItem(this.colorModeKey, mode);
  }

  /**
   * Toggle between light and dark mode
   */
  toggleColorMode(): void {
    const current = this.colorMode();
    if (current === 'system') {
      this.setColorMode('light');
    } else if (current === 'light') {
      this.setColorMode('dark');
    } else {
      this.setColorMode('light');
    }
  }

  /**
   * Get all available themes
   */
  getAvailableThemes(): ThemeName[] {
    return [...this.availableThemes];
  }

  /**
   * Get theme display name
   */
  getThemeDisplayName(theme: ThemeName): string {
    const names: Record<ThemeName, string> = {
      default: 'Default',
      red: 'Red',
      rose: 'Rose',
      orange: 'Orange',
      green: 'Green',
      blue: 'Blue',
      yellow: 'Yellow',
      violet: 'Violet',
      zinc: 'Zinc',
      slate: 'Slate',
      stone: 'Stone'
    };
    return names[theme];
  }

  private initializeTheme(): void {
    // Load saved theme or use default
    const savedTheme = localStorage.getItem(this.storageKey) as ThemeName;
    const savedColorMode = localStorage.getItem(this.colorModeKey) as ColorMode;

    if (savedTheme && this.availableThemes.includes(savedTheme)) {
      this.currentTheme.set(savedTheme);
    }

    if (savedColorMode) {
      this.colorMode.set(savedColorMode);
    }

    // Apply initial theme
    this.applyTheme(this.currentTheme());
    this.applyColorMode(this.colorMode());
  }

  private applyTheme(theme: ThemeName): void {
    const root = document.documentElement;

    // Remove existing theme attributes
    this.availableThemes.forEach(t => {
      if (t !== 'default') {
        root.removeAttribute(`data-theme`);
      }
    });

    // Apply new theme
    if (theme !== 'default') {
      root.setAttribute('data-theme', theme);
    }

    // Trigger Material theme update
    this.updateMaterialTheme(theme);
  }

  private applyColorMode(mode: ColorMode): void {
    const root = document.documentElement;

    let isDark = false;

    if (mode === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = mode === 'dark';
    }

    this.isDark.set(isDark);

    // Apply dark class for shadcn/ui
    root.classList.toggle('dark', isDark);

    // Update body color-scheme for Material
    document.body.style.colorScheme = isDark ? 'dark' : 'light';
  }

  private updateMaterialTheme(theme: ThemeName): void {
    // This method can be extended to dynamically update Material theme
    // For now, the CSS variables in material-shadcn-bridge.scss handle this

    // Dispatch custom event for components that need to respond to theme changes
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme, colorMode: this.colorMode(), isDark: this.isDark() }
    }));
  }

  private setupSystemColorModeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', () => {
      if (this.colorMode() === 'system') {
        this.applyColorMode('system');
      }
    });
  }
}
