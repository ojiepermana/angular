import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { libraryLucideConfigProvider } from '@ojiepermana/angular/internal';
import { LucideExpand, LucideShrink } from '@lucide/angular';
import { LayoutService } from './layout.service';

@Component({
  selector: 'layout-container-switcher',
  imports: [MatIconButton, MatTooltip, LucideExpand, LucideShrink],
  providers: [libraryLucideConfigProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="ngt-icon-button"
      type="button"
      mat-icon-button
      aria-label="Boxed layout container"
      [attr.aria-pressed]="layout.container() === 'boxed'"
      [matTooltip]="label()"
      (click)="toggle()"
    >
      @if (layout.container() === 'full') {
        <svg lucideExpand aria-hidden="true"></svg>
      } @else {
        <svg lucideShrink aria-hidden="true"></svg>
      }
    </button>
  `,
})
export class LayoutContainerSwitcherComponent {
  protected readonly layout = inject(LayoutService);

  protected readonly label = computed(() =>
    this.layout.container() === 'boxed'
      ? 'Boxed layout container enabled'
      : 'Boxed layout container disabled',
  );

  toggle(): void {
    this.layout.setContainer(this.layout.container() === 'full' ? 'boxed' : 'full');
  }
}
