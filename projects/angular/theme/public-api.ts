/*
 * Public API Surface of @ojiepermana/angular/theme
 *
 * The single source of truth for 3-layer design tokens, CSS variables,
 * and the `ThemeService` shared by every `@ojiepermana/angular/*` subpath
 * (shadcn, layout, navigation, ...).
 *
 * Usage:
 *   // app.config.ts
 *   import { provideMaterialTheme } from '@ojiepermana/angular/theme';
 *
 *   // styles.css
 *   @import '@ojiepermana/angular/theme/styles';
 *   @import 'tailwindcss';
 */

export * from './src/lib/core/theme.tokens';
export * from './src/lib/core/theme.service';
export * from './src/lib/core/theme.provider';
