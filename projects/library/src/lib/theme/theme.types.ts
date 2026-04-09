export type ThemeScheme = 'light' | 'dark' | 'system';
export type ThemeColor = 'brand' | 'blue' | 'green' | 'red' | 'cyan' | 'purple' | 'orange';
export type ThemeAppearance = 'flat' | 'glass';
export type LayoutMode = 'vertical' | 'horizontal' | 'empty';
export type LayoutContainer = 'full' | 'boxed';

export interface NgThemeConfig {
  defaultScheme: ThemeScheme;
  defaultColor: ThemeColor;
  defaultAppearance: ThemeAppearance;
  defaultLayoutMode: LayoutMode;
  defaultLayoutContainer: LayoutContainer;
  storageKey?: string;
  colors?: ThemeColor[];
}
