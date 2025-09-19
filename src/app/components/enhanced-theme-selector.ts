import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EnhancedThemeService, type ThemeName, type ColorMode } from '../services/enhanced-theme.service';

/**
 * Enhanced Theme Selector Component
 *
 * Provides UI for switching between themes and color modes
 * Integrates both shadcn/ui and Angular Material theming
 */
@Component({
  selector: 'enhanced-theme-selector',
  imports: [],
  template: `
    <div class="theme-selector p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <!-- Color Mode Toggle -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Color Mode</h3>
        <div class="flex gap-2">
          @for (mode of colorModes; track mode.value) {
            <button
              (click)="setColorMode(mode.value)"
              [class]="getColorModeButtonClass(mode.value)"
              class="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
            >
              {{ mode.icon }} {{ mode.label }}
            </button>
          }
        </div>
      </div>

      <!-- Theme Selection -->
      <div>
        <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Theme</h3>
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
          @for (theme of themes; track theme) {
            <button
              (click)="setTheme(theme)"
              [class]="getThemeButtonClass(theme)"
              class="theme-option p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105"
            >
              <div
                [class]="getThemePreviewClass(theme)"
                class="w-8 h-8 rounded-full mx-auto mb-2 shadow-sm"
              ></div>
              <span class="text-xs font-medium">{{ getThemeDisplayName(theme) }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Current Status -->
      <div class="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <div class="text-sm text-gray-600 dark:text-gray-300">
          <span class="font-medium">Current:</span>
          {{ getThemeDisplayName(themeService.currentTheme()) }}
          ({{ themeService.colorMode() }})
        </div>
      </div>
    </div>
  `,
  styles: `
    .theme-option {
      min-height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .theme-preview-default { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); }
    .theme-preview-red { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); }
    .theme-preview-rose { background: linear-gradient(135deg, #f43f5e 0%, #fb7185 100%); }
    .theme-preview-orange { background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); }
    .theme-preview-green { background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%); }
    .theme-preview-blue { background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); }
    .theme-preview-yellow { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); }
    .theme-preview-violet { background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); }
    .theme-preview-zinc { background: linear-gradient(135deg, #71717a 0%, #a1a1aa 100%); }
    .theme-preview-slate { background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%); }
    .theme-preview-stone { background: linear-gradient(135deg, #78716c 0%, #a8a29e 100%); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnhancedThemeSelectorComponent {
  themeService = inject(EnhancedThemeService);

  themes: ThemeName[] = this.themeService.getAvailableThemes();

  colorModes: Array<{ value: ColorMode; label: string; icon: string }> = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' }
  ];

  setTheme(theme: ThemeName): void {
    this.themeService.setTheme(theme);
  }

  setColorMode(mode: ColorMode): void {
    this.themeService.setColorMode(mode);
  }

  getThemeDisplayName(theme: ThemeName): string {
    return this.themeService.getThemeDisplayName(theme);
  }

  getThemeButtonClass(theme: ThemeName): string {
    const isActive = this.themeService.currentTheme() === theme;
    const baseClass = 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    const activeClass = 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';

    return isActive ? activeClass : baseClass;
  }

  getColorModeButtonClass(mode: ColorMode): string {
    const isActive = this.themeService.colorMode() === mode;
    const baseClass = 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600';
    const activeClass = 'bg-blue-500 text-white hover:bg-blue-600';

    return isActive ? activeClass : baseClass;
  }

  getThemePreviewClass(theme: ThemeName): string {
    return `theme-preview-${theme}`;
  }
}
