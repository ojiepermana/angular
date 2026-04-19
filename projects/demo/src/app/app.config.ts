import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import { type MaterialLayoutConfig, provideMaterialLayout } from '@ojiepermana/angular/layout';
import { provideRouter } from '@angular/router';
import { NavigationService } from '@ojiepermana/angular/navigation';
import { type MaterialThemeConfig, provideMaterialTheme, withMaterialDefaults } from '@ojiepermana/angular/theme';

import { AppNavigation } from './app.navigation';
import { routes } from './app.routes';

export const themeConfig = {
  mode: 'light',
  brand: 'etos',
} satisfies MaterialThemeConfig;

export const layoutConfig = {
  mode: 'vertical',
} satisfies MaterialLayoutConfig;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideMaterialLayout(layoutConfig),
    provideMaterialTheme(themeConfig, withMaterialDefaults()),
    provideEnvironmentInitializer(() => {
      inject(NavigationService).registerItems(AppNavigation);
    }),
  ],
};
