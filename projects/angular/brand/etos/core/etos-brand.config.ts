import type { MaterialLayoutConfig } from '@ojiepermana/angular/layout';
import type { MaterialThemeConfig } from '@ojiepermana/angular/theme';

export const ETOS_BRAND_NAME = 'etos';

export const ETOS_THEME_CONFIG = {
  mode: 'light',
  brand: ETOS_BRAND_NAME,
} satisfies MaterialThemeConfig;

export const ETOS_LAYOUT_CONFIG = {
  mode: 'vertical',
} satisfies MaterialLayoutConfig;
