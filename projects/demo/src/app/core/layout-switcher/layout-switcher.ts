import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LayoutService } from '@ojiepermana/angular/layout';
import { ButtonComponent } from '@ojiepermana/angular/component';

/**
 * Demo-only toolbar — switch between vertical and horizontal shells while
 * preserving the current canonical URL.
 */
@Component({
  selector: 'demo-layout-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  host: { class: 'inline-flex items-center gap-1' },
  template: `
    <button
      ui-button
      variant="ghost"
      size="sm"
      type="button"
      [attr.aria-pressed]="isVertical()"
      [class.bg-accent]="isVertical()"
      [class.text-primary]="isVertical()"
      (click)="setMode('vertical')">
      Vertical
    </button>
    <button
      ui-button
      variant="ghost"
      size="sm"
      type="button"
      [attr.aria-pressed]="!isVertical()"
      [class.bg-accent]="!isVertical()"
      [class.text-primary]="!isVertical()"
      (click)="setMode('horizontal')">
      Horizontal
    </button>
  `,
})
export class LayoutSwitcherComponent {
  private readonly layout = inject(LayoutService);

  protected readonly isVertical = computed(() => this.layout.mode() === 'vertical');

  protected setMode(mode: 'vertical' | 'horizontal'): void {
    this.layout.setMode(mode);
  }
}
