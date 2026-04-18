import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideMaterialLayout } from '@ojiepermana/material/layout';
import { provideMaterialTheme, withMaterialDefaults } from '@ojiepermana/material/theme';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
    provideMaterialLayout({ defaultMode: 'vertical', storageKey: 'layout-mode' }),
    provideMaterialTheme(
      {
        defaultMode: 'system',
        defaultColor: 'blue',
        defaultStyle: 'default',
        modeStorageKey: 'theme-mode',
        colorStorageKey: 'theme-color',
        styleStorageKey: 'theme-style',
      },
      withMaterialDefaults(),
    ),
  ],
};
