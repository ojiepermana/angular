/*
 * Public API Surface of library
 */

// Service & Provider
export { ThemeService } from './lib/theme/theme.service';
export { provideNgTheme } from './lib/theme/theme.provider';
export { NG_THEME_CONFIG } from './lib/theme/theme.token';

// Types
export type {
  ThemeScheme,
  ThemeColor,
  ThemeAppearance,
  LayoutMode,
  LayoutContainer,
  NgThemeConfig,
} from './lib/theme/theme.types';

// Components
export { SchemeSwitcherComponent } from './lib/components/scheme-switcher/scheme-switcher.component';
export { ColorPickerComponent } from './lib/components/color-picker/color-picker.component';
export { AppearanceSwitcherComponent } from './lib/components/appearance-switcher/appearance-switcher.component';
export { LayoutModeSwitcherComponent } from './lib/components/layout-mode-switcher/layout-mode-switcher.component';
export { LayoutContainerSwitcherComponent } from './lib/components/layout-container-switcher/layout-container-switcher.component';

// Directive
export { ThemeHostDirective } from './lib/directives/theme-host.directive';
