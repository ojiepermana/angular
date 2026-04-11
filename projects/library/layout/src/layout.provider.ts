import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NG_LAYOUT_CONFIG } from './layout.token';
import { NgLayoutConfig } from './layout.types';

const defaultConfig: NgLayoutConfig = {
  defaultMode: 'vertical',
  defaultContainer: 'full',
};

export function provideNgLayout(config: Partial<NgLayoutConfig> = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NG_LAYOUT_CONFIG, useValue: { ...defaultConfig, ...config } },
  ]);
}
