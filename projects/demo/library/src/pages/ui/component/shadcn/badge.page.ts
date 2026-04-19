import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeComponent } from '@ojiepermana/angular/component';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-badge-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, BadgeComponent],
  template: `
    <demo-page-shell title="Badge" description="Small pill for statuses, counts, and metadata.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Variants</h2>
        <div class="flex flex-wrap items-center gap-2">
          <ui-badge>Default</ui-badge>
          <ui-badge variant="secondary">Secondary</ui-badge>
          <ui-badge variant="destructive">Destructive</ui-badge>
          <ui-badge variant="outline">Outline</ui-badge>
        </div>
      </section>
    </demo-page-shell>
  `,
})
export class BadgePageComponent {}
