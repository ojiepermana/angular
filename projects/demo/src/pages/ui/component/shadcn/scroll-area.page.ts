import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollAreaComponent, SeparatorComponent } from '@ojiepermana/angular/component';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-scroll-area-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, ScrollAreaComponent, SeparatorComponent],
  template: `
    <demo-page-shell title="Scroll Area" description="Styled native scrollbar for constrained lists.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <ui-scroll-area class="h-72 w-64 rounded-md border border-border">
          <div class="p-4 text-sm">
            <h4 class="mb-3 font-medium">Tags</h4>
            @for (i of items; track i) {
              <div>#{{ i }}</div>
              <ui-separator class="my-2" />
            }
          </div>
        </ui-scroll-area>
      </section>
    </demo-page-shell>
  `,
})
export class ScrollAreaPageComponent {
  protected readonly items = Array.from({ length: 40 }, (_, i) => i + 1);
}
