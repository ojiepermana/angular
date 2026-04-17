/*
 * Public API Surface of @ojiepermana/material/theme
 *
 * The single source of truth for design tokens, CSS variables, color schemes,
 * and the `ThemeService` shared by every `@ojiepermana/material/*` subpath
 * (shadcn, layout, navigation, ...).
 *
 * Usage:
 *   // app.config.ts
 *   import { provideMaterialTheme } from '@ojiepermana/material/theme';
 *
 *   // styles.css
 *   @import '@ojiepermana/material/theme/styles';
 *   @import 'tailwindcss';
 */

export * from './src/lib/core/theme.tokens';
export * from './src/lib/core/theme.service';
export * from './src/lib/core/theme.provider';
