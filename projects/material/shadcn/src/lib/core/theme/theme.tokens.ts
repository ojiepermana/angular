import { InjectionToken } from '@angular/core';

export type ColorScheme = 'light' | 'dark' | 'system';

export type ThemeName = 'neutral' | 'zinc' | 'slate' | 'stone' | 'gray';

export interface NgShadcnConfig {
  /** Base color palette. Defaults to `neutral`. */
  readonly defaultTheme?: ThemeName;
  /** Initial color scheme. Defaults to `system`. */
  readonly defaultScheme?: ColorScheme;
  /** localStorage key used to persist the scheme. Set to `null` to disable persistence. */
  readonly storageKey?: string | null;
}

export const NG_SHADCN_CONFIG = new InjectionToken<NgShadcnConfig>('NG_SHADCN_CONFIG');

export const DEFAULT_NG_SHADCN_CONFIG: Required<NgShadcnConfig> = {
  defaultTheme: 'neutral',
  defaultScheme: 'system',
  storageKey: 'ng-shadcn.scheme',
};
