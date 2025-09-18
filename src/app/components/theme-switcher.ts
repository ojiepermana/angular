import { Component, inject, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ThemeService } from '../../../projects/kit/src/lib/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  imports: [TitleCasePipe],
  template: `
    <div class="theme-switcher p-6 border rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Theme Configuration</h3>

      <!-- Mode Switch -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Mode</label>
        <div class="flex gap-2">
          @for (mode of availableModes; track mode) {
            <button
              type="button"
              [class]="getButtonClass(mode === currentMode())"
              (click)="themeService.setMode(mode)"
            >
              {{ mode | titlecase }}
            </button>
          }
        </div>
      </div>

      <!-- Variant Switch -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Variant</label>
        <div class="flex gap-2 flex-wrap">
          @for (variant of availableVariants; track variant) {
            <button
              type="button"
              [class]="getButtonClass(variant === currentVariant())"
              (click)="themeService.setVariant(variant)"
            >
              {{ variant | titlecase }}
            </button>
          }
        </div>
      </div>

      <!-- Current Theme Display -->
      <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded">
        <h4 class="font-medium mb-2">Current Theme:</h4>
        <p>Mode: <strong>{{ currentMode() }}</strong></p>
        <p>Variant: <strong>{{ currentVariant() }}</strong></p>
      </div>

      <!-- Quick Actions -->
      <div class="mt-4 flex gap-2">
        <button
          type="button"
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          (click)="themeService.toggleMode()"
        >
          Toggle Mode
        </button>
        <button
          type="button"
          class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          (click)="themeService.resetToSystem()"
        >
          Reset to System
        </button>
      </div>
    </div>
  `,
  styles: [`
    .theme-switcher {
      background: var(--bg-primary);
      border-color: var(--border-primary);
      color: var(--text-primary);
    }

    .theme-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-primary);
      border-radius: 0.375rem;
      background: var(--bg-secondary);
      color: var(--text-primary);
      transition: all 0.2s;
    }

    .theme-btn:hover {
      background: var(--bg-tertiary);
    }

    .theme-btn.active {
      background: var(--btn-primary-bg);
      color: white;
      border-color: var(--btn-primary-bg);
    }
  `]
})
export class ThemeSwitcherComponent {
  readonly themeService = inject(ThemeService);

  readonly availableModes = this.themeService.getAvailableModes();
  readonly availableVariants = this.themeService.getAvailableVariants();

  readonly currentMode = this.themeService.mode;
  readonly currentVariant = this.themeService.variant;

  getButtonClass(isActive: boolean): string {
    return `theme-btn ${isActive ? 'active' : ''}`;
  }
}
