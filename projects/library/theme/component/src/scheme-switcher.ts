import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { LucideMonitorCog, LucideMoonStar, LucideSun } from '@lucide/angular';
import { ThemeService } from '@ojiepermana/angular/theme/service';
import { ThemeLucideConfigDirective } from './theme-icon.directive';

@Component({
  selector: 'scheme-switcher',
  imports: [
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatTooltip,
    LucideSun,
    LucideMoonStar,
    LucideMonitorCog,
  ],
  hostDirectives: [ThemeLucideConfigDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="ngt-icon-button"
      type="button"
      mat-icon-button
      [attr.aria-label]="'Color scheme: ' + currentOption().label"
      [matTooltip]="'Color scheme: ' + currentOption().label"
      [matMenuTriggerFor]="menu"
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

    <mat-menu #menu="matMenu">
      @for (option of options; track option.value) {
        <button
          type="button"
          mat-menu-item
          role="menuitemradio"
          [attr.aria-checked]="theme.scheme() === option.value"
          (click)="theme.setScheme(option.value)"
        >
          @switch (option.value) {
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
          <span>{{ option.label }}</span>
        </button>
      }
    </mat-menu>
  `,
})
export class SchemeSwitcherComponent {
  protected readonly theme = inject(ThemeService);

  protected readonly options = [
    { value: 'light' as const, label: 'Light' },
    { value: 'dark' as const, label: 'Dark' },
    { value: 'system' as const, label: 'System' },
  ];

  protected readonly currentOption = computed(
    () => this.options.find((option) => option.value === this.theme.scheme()) ?? this.options[2],
  );
}
