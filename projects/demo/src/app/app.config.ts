import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { NavigationService } from '@ojiepermana/angular/navigation';
import {
  type MaterialThemeConfig,
  ThemeService,
  provideMaterialTheme,
  withMaterialDefaults,
} from '@ojiepermana/angular/theme';

import { AppNavigation } from './app.navigation';
import { routes } from './app.routes';

export const themeConfig = {
  mode: 'light',
  color: 'blue',
  style: 'default',
} satisfies MaterialThemeConfig;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideMaterialTheme(themeConfig, withMaterialDefaults()),
    provideEnvironmentInitializer(() => {
      void inject(ThemeService).snapshot();
      inject(NavigationService).registerItems(AppNavigation);
    }),
  ],
};
