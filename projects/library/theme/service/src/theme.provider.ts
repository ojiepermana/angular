import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NG_THEME_CONFIG } from './theme.token';
import { NgThemeConfig } from './theme.types';

const defaultConfig: NgThemeConfig = {
  defaultScheme: 'system',
  defaultColor: 'brand',
  defaultAppearance: 'flat',
};

export function provideNgTheme(config: Partial<NgThemeConfig> = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NG_THEME_CONFIG, useValue: { ...defaultConfig, ...config } },
  ]);
}
