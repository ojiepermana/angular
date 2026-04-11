import {
  DestroyRef,
  Injectable,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NG_THEME_CONFIG } from './theme.token';
import { ThemeAppearance, ThemeColor, ThemeColorOption, ThemeScheme } from './theme.types';

const THEME_COLOR_OPTIONS: readonly ThemeColorOption[] = [
  { value: 'brand', label: 'Brand' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
] as const;

const STORAGE_KEYS = {
  scheme: 'theme-scheme',
  color: 'theme-color',
  appearance: 'theme-appearance',
} as const;

type ThemeStorageAxis = keyof typeof STORAGE_KEYS;

const LEGACY_STORAGE_PREFIX = 'ng-theme:v2';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly config = inject(NG_THEME_CONFIG);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly mediaQuery = this.isBrowser
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;
  private readonly systemPrefersDark = signal(this.mediaQuery?.matches ?? false);

  private key(axis: ThemeStorageAxis): string {
    return STORAGE_KEYS[axis];
  }

  private legacyKey(axis: ThemeStorageAxis): string {
    return `${LEGACY_STORAGE_PREFIX}:${axis}`;
  }

  readonly scheme = signal<ThemeScheme>(
    this.readStored('scheme', this.config.defaultScheme, this.isThemeScheme),
  );
  readonly color = signal<ThemeColor>(
    this.readStored('color', this.config.defaultColor, this.isThemeColor),
  );
  readonly appearance = signal<ThemeAppearance>(
    this.readStored('appearance', this.config.defaultAppearance, this.isThemeAppearance),
  );
  readonly colorOptions = computed<readonly ThemeColorOption[]>(() => {
    const allowedColors = this.config.colors?.filter(this.isThemeColor) ?? [];

    if (allowedColors.length === 0) {
      return THEME_COLOR_OPTIONS;
    }

    const allowedSet = new Set(allowedColors);

    return THEME_COLOR_OPTIONS.filter((option) => allowedSet.has(option.value));
  });

  readonly resolvedScheme = computed<'light' | 'dark'>(() => {
    if (this.scheme() !== 'system') return this.scheme() as 'light' | 'dark';
    return this.systemPrefersDark() ? 'dark' : 'light';
  });

  constructor() {
    if (this.mediaQuery) {
      const syncSystemPreference = (event: MediaQueryListEvent): void => {
        this.systemPrefersDark.set(event.matches);
      };

      this.mediaQuery.addEventListener('change', syncSystemPreference);
      this.destroyRef.onDestroy(() => {
        this.mediaQuery?.removeEventListener('change', syncSystemPreference);
      });
    }

    effect(() => {
      if (this.isBrowser) {
        this.applyToDOM();
      }
    });
  }

  setScheme(value: ThemeScheme): void {
    this.persist('scheme', value);
    this.scheme.set(value);
  }

  setColor(value: ThemeColor): void {
    if (!this.colorOptions().some((option) => option.value === value)) {
      return;
    }

    this.persist('color', value);
    this.color.set(value);
  }

  setAppearance(value: ThemeAppearance): void {
    this.persist('appearance', value);
    this.appearance.set(value);
  }

  toggleScheme(): void {
    const next: ThemeScheme =
      this.scheme() === 'light' ? 'dark' : this.scheme() === 'dark' ? 'system' : 'light';
    this.setScheme(next);
  }

  private applyToDOM(): void {
    const element = document.documentElement;

    element.classList.toggle('dark', this.resolvedScheme() === 'dark');
    element.dataset['themeScheme'] = this.scheme();
    element.dataset['themeColor'] = this.color();
    element.dataset['themeAppearance'] = this.appearance();
    element.style.colorScheme = this.resolvedScheme();
  }

  private persist(axis: ThemeStorageAxis, value: string): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(this.key(axis), value);
    localStorage.removeItem(this.legacyKey(axis));
  }

  private readStored<T extends string>(
    axis: ThemeStorageAxis,
    fallback: T,
    isValid: (value: string) => value is T,
  ): T {
    if (!this.isBrowser) return fallback;

    const storedValue = localStorage.getItem(this.key(axis));

    if (storedValue && isValid(storedValue)) {
      return storedValue;
    }

    const legacyValue = localStorage.getItem(this.legacyKey(axis));

    if (legacyValue && isValid(legacyValue)) {
      localStorage.setItem(this.key(axis), legacyValue);
      localStorage.removeItem(this.legacyKey(axis));
      return legacyValue;
    }

    return fallback;
  }

  private isThemeScheme(value: string): value is ThemeScheme {
    return value === 'light' || value === 'dark' || value === 'system';
  }

  private isThemeColor(value: string): value is ThemeColor {
    return (
      value === 'brand' ||
      value === 'blue' ||
      value === 'green' ||
      value === 'red' ||
      value === 'cyan' ||
      value === 'purple' ||
      value === 'orange'
    );
  }

  private isThemeAppearance(value: string): value is ThemeAppearance {
    return value === 'flat' || value === 'glass';
  }
}
