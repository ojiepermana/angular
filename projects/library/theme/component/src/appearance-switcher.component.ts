import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LucideBlend, LucideLayoutDashboard } from '@lucide/angular';
import { ThemeService } from '@ojiepermana/angular/theme/service';

@Component({
  selector: 'ngt-appearance-switcher',
  imports: [MatIconButton, MatTooltip, LucideBlend, LucideLayoutDashboard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button [attr.aria-label]="label()" [matTooltip]="label()" (click)="toggle()">
      @if (theme.appearance() === 'flat') {
        <svg lucideLayoutDashboard [absoluteStrokeWidth]="true"></svg>
      } @else {
        <svg lucideBlend [absoluteStrokeWidth]="true"></svg>
      }
    </button>
  `,
})
export class AppearanceSwitcherComponent {
  protected theme = inject(ThemeService);

  label = computed(() =>
    this.theme.appearance() === 'flat' ? 'Switch to Glass' : 'Switch to Flat',
  );

  toggle(): void {
    this.theme.setAppearance(this.theme.appearance() === 'flat' ? 'glass' : 'flat');
  }
}