import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { LucideAppWindow, LucidePanelLeft, LucidePanelTop } from '@lucide/angular';
import { ThemeService } from '@ojiepermana/angular/theme/service';

@Component({
  selector: 'ngt-layout-mode-switcher',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      [attr.aria-label]="'Layout: ' + theme.layoutMode()"
      [matTooltip]="'Layout: ' + theme.layoutMode()"
      [matMenuTriggerFor]="menu"
    >
      @switch (theme.layoutMode()) {
        @case ('vertical') {
          <svg lucidePanelLeft [absoluteStrokeWidth]="true"></svg>
        }
        @case ('horizontal') {
          <svg lucidePanelTop [absoluteStrokeWidth]="true"></svg>
        }
        @default {
          <svg lucideAppWindow [absoluteStrokeWidth]="true"></svg>
        }
      }
    </button>
    <mat-menu #menu="matMenu">
      @for (opt of options; track opt.value) {
        <button mat-menu-item (click)="theme.setLayoutMode(opt.value)">
          @switch (opt.value) {
            @case ('vertical') {
              <svg lucidePanelLeft [absoluteStrokeWidth]="true"></svg>
            }
            @case ('horizontal') {
              <svg lucidePanelTop [absoluteStrokeWidth]="true"></svg>
            }
            @default {
              <svg lucideAppWindow [absoluteStrokeWidth]="true"></svg>
            }
          }
          <span>{{ opt.label }}</span>
        </button>
      }
    </mat-menu>
  `,
})
export class LayoutModeSwitcherComponent {
  protected theme = inject(ThemeService);

  options = [
    { value: 'vertical' as const, label: 'Vertical Sidebar' },
    { value: 'horizontal' as const, label: 'Horizontal Navbar' },
    { value: 'empty' as const, label: 'No Layout' },
  ];
}