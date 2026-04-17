import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageShellComponent } from '../../core/page-shell/page-shell';

/**
 * Generic placeholder — derives title/description from the active nav trail.
 * Used for docs, Material, and CDK routes that don't have a bespoke demo yet.
 */
@Component({
  selector: 'demo-generic-placeholder-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent],
  template: `
    <demo-page-shell description="This section is coming soon. The demo focuses on shadcn components first.">
      <section class="rounded-lg border border-dashed border-border bg-muted/20 p-10 text-center">
        <p class="text-sm text-muted-foreground">Content for this page is not implemented yet.</p>
        <p class="mt-2 text-xs text-muted-foreground">
          Explore the <span class="font-medium text-foreground">shadcn/ui</span> group for working showcases.
        </p>
      </section>
    </demo-page-shell>
  `,
})
export class GenericPlaceholderPageComponent {}
