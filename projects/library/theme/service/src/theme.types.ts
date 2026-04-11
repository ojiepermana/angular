export type ThemeScheme = 'light' | 'dark' | 'system';
export type ThemeColor = 'brand' | 'blue' | 'green' | 'red' | 'cyan' | 'purple' | 'orange';
export type ThemeAppearance = 'flat' | 'glass';

export interface ThemeColorOption {
  readonly value: ThemeColor;
  readonly label: string;
}

export interface NgThemeConfig {
  defaultScheme: ThemeScheme;
  defaultColor: ThemeColor;
  defaultAppearance: ThemeAppearance;
  /**
   * @deprecated Local storage keys are fixed and no longer configurable.
   */
  storageKey?: string;
  /**
   * @deprecated Local storage keys are fixed and no longer versioned.
   */
  storageVersion?: string;
  colors?: readonly ThemeColor[];
}
