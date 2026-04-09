import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgTheme } from '@ojiepermana/angular/theme/service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNgTheme({
      defaultLayoutMode: 'vertical',
      defaultLayoutContainer: 'boxed',
    }),
  ],
};
