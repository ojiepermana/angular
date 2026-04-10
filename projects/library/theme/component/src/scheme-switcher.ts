import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LucideMonitorCog, LucideMoonStar, LucideSun } from '@lucide/angular';
import { ThemeService } from '@ojiepermana/angular/theme/service';
import { ThemeLucideConfigDirective } from './theme-icon.directive';

@Component({
  selector: 'scheme-switcher',
  imports: [MatIconButton, MatTooltip, LucideSun, LucideMoonStar, LucideMonitorCog],
  hostDirectives: [ThemeLucideConfigDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="ngt-icon-button"
      type="button"
      mat-icon-button
      [attr.aria-label]="label()"
      [matTooltip]="tooltip()"
      (click)="theme.toggleScheme()"
    >
      @switch (theme.scheme()) {
        @case ('light') {
          <svg lucideSun aria-hidden="true"></svg>
        }
        @case ('dark') {
          <svg lucideMoonStar aria-hidden="true"></svg>
        }
        @default {
          <svg lucideMonitorCog aria-hidden="true"></svg>
        }
      }
    </button>
  `,
})
export class SchemeSwitcherComponent {
  protected readonly theme = inject(ThemeService);

  protected readonly label = computed(
    () =>
      ({
        light: 'Color scheme: light',
        dark: 'Color scheme: dark',
        system: 'Color scheme: system',
      })[this.theme.scheme()],
  );

  protected readonly tooltip = computed(
    () =>
      ({
        light: 'Switch to dark scheme',
        dark: 'Switch to light scheme',
        system: 'Switch to dark scheme',
      })[this.theme.scheme()],
  );
}
