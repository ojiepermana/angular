import { InjectionToken } from '@angular/core';

export type ColorScheme = 'light' | 'dark' | 'system';

export type ThemeName = 'neutral' | 'zinc' | 'slate' | 'stone' | 'gray';

export interface MaterialThemeConfig {
  /** Base color palette. Defaults to `neutral`. */
  readonly defaultTheme?: ThemeName;
  /** Initial color scheme. Defaults to `system`. */
  readonly defaultScheme?: ColorScheme;
  /** localStorage key used to persist the scheme. Set to `null` to disable persistence. */
  readonly storageKey?: string | null;
}

export const MATERIAL_THEME_CONFIG = new InjectionToken<MaterialThemeConfig>(
  'MATERIAL_THEME_CONFIG',
);

export const DEFAULT_MATERIAL_THEME_CONFIG: Required<MaterialThemeConfig> = {
  defaultTheme: 'neutral',
  defaultScheme: 'system',
  storageKey: 'ojp-material.scheme',
};
