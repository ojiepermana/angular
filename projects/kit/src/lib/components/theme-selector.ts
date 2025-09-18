import { Component, inject } from '@angular/core';
import { ThemeService, type ThemeVariant } from '../services/theme.service';

@Component({
  selector: 'op-theme-selector',
  imports: [],
  template: `
    <div class="theme-selector">
      <div class="theme-controls">
        <label>
          Theme Variant:
          <select (change)="onVariantChange($event)" [value]="themeService.variant()">
            <option value="default">Default</option>
            <option value="red">Red</option>
            <option value="rose">Rose</option>
            <option value="orange">Orange</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="yellow">Yellow</option>
            <option value="violet">Violet</option>
          </select>
        </label>

        <button (click)="themeService.toggleMode()">
          {{ themeService.mode() === 'light' ? '🌙' : '☀️' }}
          {{ themeService.mode() === 'light' ? 'Dark' : 'Light' }}
        </button>
      </div>

      <div class="theme-preview">
        <p>Current: {{ themeService.variant() }} ({{ themeService.mode() }})</p>
      </div>
    </div>
  `,
  styles: `
    .theme-selector {
      padding: 1rem;
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius);
      background: hsl(var(--card));
      color: hsl(var(--card-foreground));
    }

    .theme-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    select {
      padding: 0.5rem;
      border: 1px solid hsl(var(--border));
      border-radius: calc(var(--radius) - 2px);
      background: hsl(var(--background));
      color: hsl(var(--foreground));
    }

    button {
      padding: 0.5rem 1rem;
      border: 1px solid hsl(var(--border));
      border-radius: calc(var(--radius) - 2px);
      background: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    button:hover {
      background: hsl(var(--secondary) / 0.8);
    }

    .theme-preview p {
      margin: 0;
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
    }
  `
})
export class OpThemeSelector {
  readonly themeService = inject(ThemeService);

  onVariantChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    console.log('Theme variant changed to:', target.value);
    this.themeService.setVariant(target.value as ThemeVariant);
  }
}
