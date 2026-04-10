import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LucideBlend, LucideLayoutDashboard } from '@lucide/angular';
import { ThemeService } from '@ojiepermana/angular/theme/service';
import { ThemeLucideConfigDirective } from './theme-icon.directive';

@Component({
  selector: 'appearance-switcher',
  imports: [MatIconButton, MatTooltip, LucideBlend, LucideLayoutDashboard],
  hostDirectives: [ThemeLucideConfigDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="ngt-icon-button"
      type="button"
      mat-icon-button
      aria-label="Glass appearance"
      [attr.aria-pressed]="theme.appearance() === 'glass'"
      [matTooltip]="label()"
      (click)="toggle()"
    >
      @if (theme.appearance() === 'flat') {
        <svg lucideLayoutDashboard aria-hidden="true"></svg>
      } @else {
        <svg lucideBlend aria-hidden="true"></svg>
      }
    </button>
  `,
})
export class AppearanceSwitcherComponent {
  protected readonly theme = inject(ThemeService);

  protected readonly label = computed(() =>
    this.theme.appearance() === 'glass' ? 'Glass appearance enabled' : 'Glass appearance disabled',
  );

  toggle(): void {
    this.theme.setAppearance(this.theme.appearance() === 'flat' ? 'glass' : 'flat');
  }
}
