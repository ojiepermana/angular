import {
  inject,
  type EnvironmentProviders,
  type Provider,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ThemeService } from './theme.service';
import { MATERIAL_THEME_CONFIG, type MaterialThemeConfig } from './theme.tokens';

/**
 * Opaque feature unit consumed by {@link provideMaterialTheme}. Mirrors
 * Angular's router/http feature pattern so add-ons can be composed without
 * widening the primary provider signature.
 */
export interface MaterialThemeFeature {
  readonly providers: Provider[];
}

/**
 * Bootstrap the shared theme for any `@ojiepermana/angular/*` entry point.
 *
 * By default wires up the theme config token and eagerly initializes `ThemeService`
 * so root theme attributes are applied during bootstrap. Opt in
 * to Angular Material defaults (ripple / form-field) via
 * {@link withMaterialDefaults}.
 * Supports shorthand `mode`, `color`, and `style` config keys.
 *
 * @example
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideAnimations(),
 *     provideMaterialTheme(
 *       {
 *         mode: 'system',
 *         color: 'blue',
 *         style: 'soft',
 *       },
 *       withMaterialDefaults(),
 *     ),
 *   ],
 * };
 */
export function provideMaterialTheme(
  config: MaterialThemeConfig = {},
  ...features: MaterialThemeFeature[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: MATERIAL_THEME_CONFIG, useValue: config },
    provideEnvironmentInitializer(() => {
      inject(ThemeService);
    }),
    ...features.flatMap((f) => f.providers),
  ]);
}

/**
 * Opt-in Angular Material defaults tuned for the shared theme layer:
 *
 * - Disables the global Material ripple.
 * - Forces `appearance: 'outline'` + `subscriptSizing: 'dynamic'` on every
 *   `mat-form-field`.
 *
 * Only apply when your app actually renders Angular Material components.
 */
export function withMaterialDefaults(): MaterialThemeFeature {
  return {
    providers: [
      { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
      },
    ],
  };
}
