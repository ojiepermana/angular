/*
 * Implementation surface for @ojiepermana/angular/etos
 *
 * Etos is a brand umbrella entrypoint. Etos-specific layout, theme,
 * navigation composition, and brand defaults live here while shared
 * primitives remain in @ojiepermana/angular/theme, /layout, and /navigation.
 */

export * from './core/etos-brand.config';
export * from './core/etos-brand.provider';
export * from './layouts/etos-empty-layout.component';
export * from './layouts/etos-horizontal-layout.component';
export * from './layouts/etos-layout.component';
export * from './layouts/etos-vertical-layout.component';

export const ETOS_BRAND_VERSION = '0.0.1';
