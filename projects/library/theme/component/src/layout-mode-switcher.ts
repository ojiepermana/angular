import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { LucideAppWindow, LucidePanelLeft, LucidePanelTop } from '@lucide/angular';
import { ThemeService } from '@ojiepermana/angular/theme/service';
import { ThemeLucideConfigDirective } from './theme-icon.directive';

@Component({
  selector: 'layout-mode-switcher',
  imports: [
    MatIconButton,
    MatTooltip,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    LucidePanelLeft,
    LucidePanelTop,
    LucideAppWindow,
  ],
  hostDirectives: [ThemeLucideConfigDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="ngt-icon-button"
      type="button"
      mat-icon-button
      [attr.aria-label]="'Layout mode: ' + currentOption().label"
      [matTooltip]="'Layout mode: ' + currentOption().label"
      [matMenuTriggerFor]="menu"
    >
      @switch (theme.layoutMode()) {
        @case ('vertical') {
          <svg lucidePanelLeft aria-hidden="true"></svg>
        }
        @case ('horizontal') {
          <svg lucidePanelTop aria-hidden="true"></svg>
        }
        @default {
          <svg lucideAppWindow aria-hidden="true"></svg>
        }
      }
    </button>
    <mat-menu #menu="matMenu">
      @for (opt of options; track opt.value) {
        <button
          type="button"
          mat-menu-item
          role="menuitemradio"
          [attr.aria-checked]="theme.layoutMode() === opt.value"
          (click)="theme.setLayoutMode(opt.value)"
        >
          @switch (opt.value) {
            @case ('vertical') {
              <svg lucidePanelLeft aria-hidden="true"></svg>
            }
            @case ('horizontal') {
              <svg lucidePanelTop aria-hidden="true"></svg>
            }
            @default {
              <svg lucideAppWindow aria-hidden="true"></svg>
            }
          }
          <span>{{ opt.label }}</span>
        </button>
      }
    </mat-menu>
  `,
})
export class LayoutModeSwitcherComponent {
  protected readonly theme = inject(ThemeService);

  protected readonly options = [
    { value: 'vertical' as const, label: 'Vertical Sidebar' },
    { value: 'horizontal' as const, label: 'Horizontal Navbar' },
  ];

  protected readonly currentOption = computed(
    () =>
      this.options.find((option) => option.value === this.theme.layoutMode()) ?? {
        value: 'empty' as const,
        label: 'Content Only',
      },
  );
}
