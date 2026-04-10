import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LucideExpand, LucideShrink } from '@lucide/angular';
import { ThemeService } from '@ojiepermana/angular/theme/service';
import { ThemeLucideConfigDirective } from './theme-icon.directive';

@Component({
  selector: 'layout-container-switcher',
  imports: [MatIconButton, MatTooltip, LucideExpand, LucideShrink],
  hostDirectives: [ThemeLucideConfigDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="ngt-icon-button"
      type="button"
      mat-icon-button
      aria-label="Boxed layout container"
      [attr.aria-pressed]="theme.layoutContainer() === 'boxed'"
      [matTooltip]="label()"
      (click)="toggle()"
    >
      @if (theme.layoutContainer() === 'full') {
        <svg lucideExpand aria-hidden="true"></svg>
      } @else {
        <svg lucideShrink aria-hidden="true"></svg>
      }
    </button>
  `,
})
export class LayoutContainerSwitcherComponent {
  protected readonly theme = inject(ThemeService);

  protected readonly label = computed(() =>
    this.theme.layoutContainer() === 'boxed'
      ? 'Boxed layout container enabled'
      : 'Boxed layout container disabled',
  );

  toggle(): void {
    this.theme.setLayoutContainer(this.theme.layoutContainer() === 'full' ? 'boxed' : 'full');
  }
}
