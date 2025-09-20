import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ThemeService } from '@ojiepermana/angular';

export type IconStyle = 'default' | 'filled' | 'outline' | 'minimal';
export type BorderStyle = 'rounded' | 'square' | 'circle' | 'pill' | 'none';

@Component({
  selector: 'dark-mode-toggle',
  imports: [],
  template: `
    <button
      (click)="toggleDarkMode()"
      [class]="getButtonClasses()"
      title="Toggle dark mode">

      <!-- Default Icons -->
      @if (iconStyle() === 'default') {
        <svg class="sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      }

      <!-- Filled Icons -->
      @if (iconStyle() === 'filled') {
        <svg class="sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      }

      <!-- Outline Icons -->
      @if (iconStyle() === 'outline') {
        <svg class="sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="6"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      }

      <!-- Minimal Icons -->
      @if (iconStyle() === 'minimal') {
        <svg class="sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z"/>
        </svg>
      }
    </button>
  `,
  styles: `
    .toggle-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 1px solid hsl(var(--border));
      background: hsl(var(--background));
      color: hsl(var(--foreground));
      cursor: pointer;
      transition: all 0.2s ease;
      overflow: hidden;
    }

    .toggle-btn:hover {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }

    /* Border Styles */
    .toggle-btn.rounded {
      border-radius: 0.5rem; /* 8px */
    }

    .toggle-btn.square {
      border-radius: 0;
    }

    .toggle-btn.circle {
      border-radius: 50%;
    }

    .toggle-btn.pill {
      border-radius: 9999px;
    }

    .toggle-btn.none {
      border: none;
      background: none;
      border-radius: 0.375rem; /* 6px - subtle rounded corners */
    }

    .sun-icon,
    .moon-icon {
      position: absolute;
      transition: all 0.3s ease;
    }

    /* Light mode - show sun, hide moon */
    .toggle-btn:not(.dark) .sun-icon {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .toggle-btn:not(.dark) .moon-icon {
      opacity: 0;
      transform: rotate(90deg) scale(0.8);
    }

    /* Dark mode - show moon, hide sun */
    .toggle-btn.dark .sun-icon {
      opacity: 0;
      transform: rotate(-90deg) scale(0.8);
    }

    .toggle-btn.dark .moon-icon {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DarkModeToggle {
  private readonly themeService = inject(ThemeService);

  // Configuration inputs
  iconStyle = input<IconStyle>('default');
  borderStyle = input<BorderStyle>('rounded');

  toggleDarkMode(): void {
    this.themeService.toggleMode();
  }

  isDarkMode(): boolean {
    return this.themeService.mode() === 'dark';
  }

  getButtonClasses(): string {
    const baseClasses = 'toggle-btn';
    const darkClass = this.isDarkMode() ? 'dark' : '';
    const borderClass = this.borderStyle();

    return [baseClasses, darkClass, borderClass].filter(Boolean).join(' ');
  }
}
