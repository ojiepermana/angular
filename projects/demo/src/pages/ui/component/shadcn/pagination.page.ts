import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PaginationComponent } from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-pagination-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent, PaginationComponent],
  template: `
    <ui-shell title="Pagination" description="Compact page navigation with previous/next and ellipsis.">
      <section class="mb-10">
        <ui-pagination [(page)]="page" [total]="10" />
        <p class="mt-3 text-sm text-muted-foreground">Page: {{ page() }}</p>
      </section>
    </ui-shell>
  `,
})
export class PaginationPageComponent {
  protected readonly page = signal(1);
}
