import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LucideMonitorCog, LucideMoonStar, LucideSun } from '@lucide/angular';
import { ThemeService } from '../../theme/theme.service';

@Component({
  selector: 'ngt-scheme-switcher',
  imports: [MatIconButton, MatTooltip, LucideSun, LucideMoonStar, LucideMonitorCog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      [attr.aria-label]="label()"
      [matTooltip]="label()"
      (click)="theme.toggleScheme()"
    >
      @switch (theme.scheme()) {
        @case ('light') {
          <svg lucideSun [absoluteStrokeWidth]="true"></svg>
        }
        @case ('dark') {
          <svg lucideMoonStar [absoluteStrokeWidth]="true"></svg>
        }
        @default {
          <svg lucideMonitorCog [absoluteStrokeWidth]="true"></svg>
        }
      }
    </button>
  `,
})
export class SchemeSwitcherComponent {
  protected theme = inject(ThemeService);

  label = computed(
    () =>
      ({
        light: 'Switch to Dark',
        dark: 'Switch to Light',
        system: 'Following System',
      })[this.theme.scheme()],
  );
}
