import {
  type EnvironmentProviders,
  type Provider,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { type MaterialLayoutConfig, provideMaterialLayout } from '@ojiepermana/angular/layout';
import { DEFAULT_NAVIGATION_ID, NavigationService, type NavigationItem } from '@ojiepermana/angular/navigation';
import {
  type MaterialThemeConfig,
  type MaterialThemeFeature,
  provideMaterialTheme,
  withMaterialDefaults,
} from '@ojiepermana/angular/theme';
import { ETOS_BRAND_NAME, ETOS_LAYOUT_CONFIG, ETOS_THEME_CONFIG } from './etos-brand.config';

export interface EtosBrandOptions {
  readonly theme?: MaterialThemeConfig;
  readonly layout?: MaterialLayoutConfig;
  readonly navigation?: NavigationItem[];
  readonly navigationId?: string;
  readonly materialDefaults?: boolean;
}

export function provideEtosTheme(
  config: MaterialThemeConfig = {},
  ...features: MaterialThemeFeature[]
): EnvironmentProviders {
  return provideMaterialTheme(
    {
      ...ETOS_THEME_CONFIG,
      ...config,
      brand: ETOS_BRAND_NAME,
      'theme-brand': ETOS_BRAND_NAME,
    },
    ...features,
  );
}

export function provideEtosLayout(config: MaterialLayoutConfig = {}): EnvironmentProviders {
  return provideMaterialLayout({
    ...ETOS_LAYOUT_CONFIG,
    ...config,
  });
}

export function provideEtosBrand(options: EtosBrandOptions = {}): EnvironmentProviders {
  const providers: Array<EnvironmentProviders | Provider> = [
    provideEtosTheme(options.theme, ...(options.materialDefaults === false ? [] : [withMaterialDefaults()])),
    provideEtosLayout(options.layout),
  ];

  const navigation = options.navigation;
  if (navigation) {
    providers.push(
      provideEnvironmentInitializer(() => {
        inject(NavigationService).registerItems(options.navigationId ?? DEFAULT_NAVIGATION_ID, navigation);
      }),
    );
  }

  return makeEnvironmentProviders(providers);
}
