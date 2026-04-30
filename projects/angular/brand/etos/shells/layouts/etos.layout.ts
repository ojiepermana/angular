import { ChangeDetectionStrategy, Component, computed, inject, input, type TemplateRef } from '@angular/core';
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
        <horizontal [brandTemplate]="layoutBrandTemplate()" [profileTemplate]="layoutProfileTemplate()" />
      }
      @default {
        <vertical
          [sidebarHeaderTemplate]="sidebarHeaderTemplate() ?? layoutBrandTemplate()"
          [sidebarFooterTemplate]="sidebarFooterTemplate() ?? layoutProfileTemplate()" />
      }
    }
  `,
})
export class EtosLayoutComponent {
  readonly mode = input<LayoutMode | null>(null);
  readonly sidebarHeaderTemplate = input<TemplateRef<unknown> | null>(null);
  readonly sidebarFooterTemplate = input<TemplateRef<unknown> | null>(null);
  readonly layoutBrandTemplate = input<TemplateRef<unknown> | null>(null);
  readonly layoutProfileTemplate = input<TemplateRef<unknown> | null>(null);

  private readonly layout = inject(LayoutService);
  protected readonly resolvedMode = computed(() => this.mode() ?? this.layout.mode());
}
