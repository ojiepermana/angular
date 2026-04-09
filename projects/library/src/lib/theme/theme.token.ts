import { InjectionToken } from '@angular/core';
import { NgThemeConfig } from './theme.types';

export const NG_THEME_CONFIG = new InjectionToken<NgThemeConfig>('NG_THEME_CONFIG', {
  factory: () => ({
    defaultScheme: 'system',
    defaultColor: 'brand',
    defaultAppearance: 'flat',
    defaultLayoutMode: 'vertical',
    defaultLayoutContainer: 'full',
    storageKey: 'ng-theme',
  }),
});
