import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { libraryLucideConfigProvider } from '@ojiepermana/angular/internal';
import { LucideAppWindow, LucidePanelLeft, LucidePanelTop } from '@lucide/angular';
import { LayoutService } from './layout.service';

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
  providers: [libraryLucideConfigProvider],
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
      @switch (layout.mode()) {
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
      @for (option of options; track option.value) {
        <button
          type="button"
          mat-menu-item
          role="menuitemradio"
          [attr.aria-checked]="layout.mode() === option.value"
          (click)="layout.setMode(option.value)"
        >
          @switch (option.value) {
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
          <span>{{ option.label }}</span>
        </button>
      }
    </mat-menu>
  `,
})
export class LayoutModeSwitcherComponent {
  protected readonly layout = inject(LayoutService);

  protected readonly options = [
    { value: 'vertical' as const, label: 'Vertical Sidebar' },
    { value: 'horizontal' as const, label: 'Horizontal Navbar' },
  ];

  protected readonly currentOption = computed(
    () =>
      this.options.find((option) => option.value === this.layout.mode()) ?? {
        value: 'empty' as const,
        label: 'Content Only',
      },
  );
}
