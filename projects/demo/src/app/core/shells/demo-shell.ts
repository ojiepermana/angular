import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LayoutService } from '@ojiepermana/material/layout';

import { HorizontalShellComponent } from './horizontal-shell';
import { VerticalShellComponent } from './vertical-shell';

@Component({
  selector: 'demo-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HorizontalShellComponent, VerticalShellComponent],
  host: { class: 'block h-dvh' },
  template: `
    @if (isVertical()) {
      <demo-vertical-shell />
    } @else {
      <demo-horizontal-shell />
    }
  `,
})
export class DemoShellComponent {
  private readonly layout = inject(LayoutService);

  protected readonly isVertical = computed(() => this.layout.mode() === 'vertical');
}
