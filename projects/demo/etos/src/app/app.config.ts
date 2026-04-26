import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { type EtosBrandOptions, provideEtosBrand } from '@ojiepermana/angular/etos';

import { AppNavigation } from './app.navigation';
import { routes } from './app.routes';

export const etosBrandConfig = {
  theme: {
    mode: 'light',
  },
  layout: {
    mode: 'vertical',
  },
  navigation: AppNavigation,
} satisfies EtosBrandOptions;

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideEtosBrand(etosBrandConfig)],
};
