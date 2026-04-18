import {
  inject,
  type EnvironmentProviders,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { LayoutService } from './layout.service';
import { MATERIAL_LAYOUT_CONFIG, type MaterialLayoutConfig } from './layout.tokens';

export function provideMaterialLayout(config: MaterialLayoutConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: MATERIAL_LAYOUT_CONFIG, useValue: config },
    provideEnvironmentInitializer(() => {
      inject(LayoutService);
    }),
  ]);
}
