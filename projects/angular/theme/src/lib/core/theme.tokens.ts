import { InjectionToken } from '@angular/core';

export const MODES = ['light', 'dark'] as const;

export type ThemeMode = (typeof MODES)[number];

export const COLOR_SCHEMES = ['light', 'dark', 'system'] as const;

export type ColorScheme = (typeof COLOR_SCHEMES)[number];

export const COLORS = ['blue', 'red', 'green', 'purple', 'amber'] as const;

export type ThemeColor = (typeof COLORS)[number];

export const STYLES = ['default', 'sharp', 'brutal', 'soft'] as const;

export type ThemeStyle = (typeof STYLES)[number];

export interface ThemeConfig {
  readonly mode: ThemeMode;
  readonly color: ThemeColor;
  readonly style: ThemeStyle;
}

export interface MaterialThemeConfig {
  /** Initial mode preference. Supports `system` for first-visit OS detection. */
  readonly mode?: ColorScheme;
  /** Initial brand color layer. */
  readonly color?: ThemeColor;
  /** Initial style personality layer. */
  readonly style?: ThemeStyle;
  /** @deprecated Use `mode` instead. */
  readonly defaultMode?: ColorScheme;
  /** @deprecated Use `color` instead. */
  readonly defaultColor?: ThemeColor;
  /** @deprecated Use `style` instead. */
  readonly defaultStyle?: ThemeStyle;
  /** @deprecated Use `defaultMode` instead. */
  readonly defaultScheme?: ColorScheme;
  /** @deprecated Use `defaultColor` instead. */
  readonly defaultTheme?: ThemeColor | string;
  /** @deprecated Use `modeStorageKey` instead. */
  readonly storageKey?: string | null;
  /** @deprecated Use `modeStorageKey` instead. */
  readonly schemeStorageKey?: string | null;
  /** @deprecated Use `colorStorageKey` instead. */
  readonly themeStorageKey?: string | null;
  /** localStorage key used to persist the mode preference. Set to `null` to disable persistence. */
  readonly modeStorageKey?: string | null;
  /** localStorage key used to persist the color layer. Set to `null` to disable persistence. */
  readonly colorStorageKey?: string | null;
  /** localStorage key used to persist the style layer. Set to `null` to disable persistence. */
  readonly styleStorageKey?: string | null;
}

export interface ResolvedMaterialThemeConfig {
  readonly defaultMode: ColorScheme;
  readonly defaultColor: ThemeColor;
  readonly defaultStyle: ThemeStyle;
  readonly modeStorageKey: string | null;
  readonly colorStorageKey: string | null;
  readonly styleStorageKey: string | null;
}

export const MATERIAL_THEME_CONFIG = new InjectionToken<MaterialThemeConfig>('MATERIAL_THEME_CONFIG');

export const DEFAULT_MATERIAL_THEME_CONFIG: ResolvedMaterialThemeConfig = {
  defaultMode: 'system',
  defaultColor: 'blue',
  defaultStyle: 'default',
  modeStorageKey: 'theme-mode',
  colorStorageKey: 'theme-color',
  styleStorageKey: 'theme-style',
};

export function isColorScheme(value: string | null | undefined): value is ColorScheme {
  return COLOR_SCHEMES.some((scheme) => scheme === value);
}

export function isThemeColor(value: string | null | undefined): value is ThemeColor {
  return COLORS.some((color) => color === value);
}

export function isThemeStyle(value: string | null | undefined): value is ThemeStyle {
  return STYLES.some((style) => style === value);
}
