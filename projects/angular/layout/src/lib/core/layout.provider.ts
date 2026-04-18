import { type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { MATERIAL_LAYOUT_CONFIG, type MaterialLayoutConfig } from './layout.tokens';

export function provideMaterialLayout(config: MaterialLayoutConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: MATERIAL_LAYOUT_CONFIG, useValue: config }]);
}
