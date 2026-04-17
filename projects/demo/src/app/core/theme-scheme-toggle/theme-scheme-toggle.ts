import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService } from '@ojiepermana/material/theme';
import { ButtonComponent } from '@ojiepermana/material/shadcn';

/**
 * Toggle between light/dark color schemes via `ThemeService`.
 */
@Component({
  selector: 'demo-theme-scheme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  host: { class: 'inline-flex' },
  template: `
    <button ui-button variant="ghost" size="icon" type="button" [attr.aria-label]="label()" (click)="toggle()">
      <span class="material-symbols-outlined text-lg">{{ icon() }}</span>
    </button>
  `,
})
export class ThemeSchemeToggleComponent {
  private readonly theme = inject(ThemeService);

  protected readonly icon = computed(() => (this.theme.isDark() ? 'light_mode' : 'dark_mode'));
  protected readonly label = computed(() => (this.theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'));

  protected toggle(): void {
    this.theme.setScheme(this.theme.isDark() ? 'light' : 'dark');
  }
}
