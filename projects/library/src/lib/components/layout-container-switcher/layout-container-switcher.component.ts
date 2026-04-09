import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LucideExpand, LucideShrink } from '@lucide/angular';
import { ThemeService } from '../../theme/theme.service';

@Component({
  selector: 'ngt-layout-container-switcher',
  imports: [MatIconButton, MatTooltip, LucideExpand, LucideShrink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button [attr.aria-label]="label()" [matTooltip]="label()" (click)="toggle()">
      @if (theme.layoutContainer() === 'full') {
        <svg lucideExpand [absoluteStrokeWidth]="true"></svg>
      } @else {
        <svg lucideShrink [absoluteStrokeWidth]="true"></svg>
      }
    </button>
  `,
})
export class LayoutContainerSwitcherComponent {
  protected theme = inject(ThemeService);

  label = computed(() =>
    this.theme.layoutContainer() === 'full' ? 'Switch to Boxed' : 'Switch to Full',
  );

  toggle(): void {
    this.theme.setLayoutContainer(this.theme.layoutContainer() === 'full' ? 'boxed' : 'full');
  }
}
