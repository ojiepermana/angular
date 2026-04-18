import { InjectionToken } from '@angular/core';

export const COLOR_SCHEMES = ['light', 'dark', 'system'] as const;

export type ColorScheme = 'light' | 'dark' | 'system';

export const THEME_NAMES = ['neutral', 'zinc', 'slate', 'stone', 'gray', 'etos'] as const;

export type ThemeName = 'neutral' | 'zinc' | 'slate' | 'stone' | 'gray' | 'etos';

export interface MaterialThemeConfig {
  /** Base color palette. Defaults to `neutral`. */
  readonly defaultTheme?: ThemeName;
  /** Initial color scheme. Defaults to `light`. */
  readonly defaultScheme?: ColorScheme;
  /** @deprecated Use `schemeStorageKey` instead. */
  readonly storageKey?: string | null;
  /** localStorage key used to persist the scheme. Set to `null` to disable persistence. */
  readonly schemeStorageKey?: string | null;
  /** localStorage key used to persist the palette. Set to `null` to disable persistence. */
  readonly themeStorageKey?: string | null;
}

export interface ResolvedMaterialThemeConfig {
  readonly defaultTheme: ThemeName;
  readonly defaultScheme: ColorScheme;
  readonly schemeStorageKey: string | null;
  readonly themeStorageKey: string | null;
}

export const MATERIAL_THEME_CONFIG = new InjectionToken<MaterialThemeConfig>('MATERIAL_THEME_CONFIG');

export const DEFAULT_MATERIAL_THEME_CONFIG: ResolvedMaterialThemeConfig = {
  defaultTheme: 'neutral',
  defaultScheme: 'light',
  schemeStorageKey: 'theme-scheme',
  themeStorageKey: 'theme-palette',
};
