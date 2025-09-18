import { Injectable, signal, computed, effect } from '@angular/core';

export type ThemeVariant = 'default' | 'red' | 'rose' | 'orange' | 'green' | 'blue' | 'yellow' | 'violet' | 'zinc' | 'slate' | 'stone';
export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _variant = signal<ThemeVariant>('default');
  private readonly _mode = signal<ThemeMode>('light');

  readonly variant = this._variant.asReadonly();
  readonly mode = this._mode.asReadonly();

  readonly theme = computed(() => ({
    variant: this._variant(),
    mode: this._mode()
  }));

  constructor() {
    // Load saved theme from localStorage
    this.loadSavedTheme();

    // Apply theme changes to document
    effect(() => {
      this.applyTheme(this._variant(), this._mode());
    });
  }

  setVariant(variant: ThemeVariant): void {
    this._variant.set(variant);
    this.saveTheme();
  }

  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
    this.saveTheme();
  }

  toggleMode(): void {
    const newMode = this._mode() === 'light' ? 'dark' : 'light';
    this.setMode(newMode);
  }

  resetToSystem(): void {
    // Reset to default theme and light mode
    this.setVariant('default');
    this.setMode('light');
  }

  getAvailableModes(): ThemeMode[] {
    return ['light', 'dark'];
  }

  getAvailableVariants(): ThemeVariant[] {
    return ['default', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet', 'zinc', 'slate', 'stone'];
  }

  private applyTheme(variant: ThemeVariant, mode: ThemeMode): void {
    console.log('Applying theme:', { variant, mode });

    // Set theme variant as data attribute
    if (variant === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', variant);
    }

    // Apply dark mode class
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('Dark mode class added');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Dark mode class removed');
    }

    console.log('Document element classes:', document.documentElement.classList.toString());
    console.log('Document element data-theme:', document.documentElement.getAttribute('data-theme'));
  }

  private saveTheme(): void {
    localStorage.setItem('theme-variant', this._variant());
    localStorage.setItem('theme-mode', this._mode());
  }

  private loadSavedTheme(): void {
    const savedVariant = localStorage.getItem('theme-variant') as ThemeVariant;
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;

    if (savedVariant && this.isValidVariant(savedVariant)) {
      this._variant.set(savedVariant);
    }

    if (savedMode && this.isValidMode(savedMode)) {
      this._mode.set(savedMode);
    }
  }

  private isValidVariant(variant: string): variant is ThemeVariant {
    return ['default', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet', 'zinc', 'slate', 'stone'].includes(variant);
  }

  private isValidMode(mode: string): mode is ThemeMode {
    return ['light', 'dark'].includes(mode);
  }
}
