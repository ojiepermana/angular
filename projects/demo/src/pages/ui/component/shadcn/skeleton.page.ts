import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-skeleton-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent, SkeletonComponent],
  template: `
    <ui-shell title="Skeleton" description="Shimmering placeholder while content loads.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <div class="flex items-center gap-4">
          <ui-skeleton class="h-12 w-12 rounded-full" />
          <div class="grid gap-2">
            <ui-skeleton class="h-4 w-62.5" />
            <ui-skeleton class="h-4 w-50" />
          </div>
        </div>
      </section>
    </ui-shell>
  `,
})
export class SkeletonPageComponent {}
