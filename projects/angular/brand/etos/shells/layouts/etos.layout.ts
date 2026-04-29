import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LayoutService, type LayoutMode } from '@ojiepermana/angular/layout';
import { EmptyLayout } from './empty/empty';
import { HorizontalLayout } from './horizontal/horizontal';
import { VerticalLayout } from './vertical/vertical';

@Component({
  selector: 'etos-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyLayout, HorizontalLayout, VerticalLayout],
  host: {
    class: 'contents',
    '[attr.data-layout-mode]': 'resolvedMode()',
  },
  template: `
    @switch (resolvedMode()) {
      @case ('empty') {
        <empty />
      }
      @case ('horizontal') {
        <horizontal />
      }
      @default {
        <vertical />
      }
    }
  `,
})
export class EtosLayoutComponent {
  readonly mode = input<LayoutMode | null>(null);

  private readonly layout = inject(LayoutService);
  protected readonly resolvedMode = computed(() => this.mode() ?? this.layout.mode());
}
