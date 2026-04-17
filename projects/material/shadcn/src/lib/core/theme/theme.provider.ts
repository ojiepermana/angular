import { type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NG_SHADCN_CONFIG, type NgShadcnConfig } from './theme.tokens';

/**
 * Bootstrap ng-shadcn in a standalone Angular application.
 *
 * @example
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideAnimations(),
 *     provideNgShadcn({ defaultTheme: 'neutral', defaultScheme: 'system' }),
 *   ],
 * };
 */
export function provideNgShadcn(config: NgShadcnConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NG_SHADCN_CONFIG, useValue: config },
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
    },
  ]);
}
