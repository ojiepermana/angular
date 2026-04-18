import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BreadcrumbComponent,
  BreadcrumbEllipsisComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbListComponent,
  BreadcrumbPageComponent as BreadcrumbPagePartComponent,
  BreadcrumbSeparatorComponent,
} from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-breadcrumb-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageShellComponent,
    RouterLink,
    BreadcrumbComponent,
    BreadcrumbEllipsisComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbListComponent,
    BreadcrumbPagePartComponent,
    BreadcrumbSeparatorComponent,
  ],
  template: `
    <demo-page-shell title="Breadcrumb" description="Hierarchical navigation trail with ellipsis and separator slots.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <nav ui-breadcrumb>
          <ol ui-breadcrumb-list>
            <li ui-breadcrumb-item><a ui-breadcrumb-link [routerLink]="'/'">Home</a></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><a ui-breadcrumb-link [routerLink]="'/ui/shadcn/button'">Components</a></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><span ui-breadcrumb-page>Breadcrumb</span></li>
          </ol>
        </nav>
      </section>

      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">With ellipsis</h2>
        <nav ui-breadcrumb>
          <ol ui-breadcrumb-list>
            <li ui-breadcrumb-item><a ui-breadcrumb-link [routerLink]="'/'">Home</a></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><span ui-breadcrumb-ellipsis></span></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><span ui-breadcrumb-page>Deep page</span></li>
          </ol>
        </nav>
      </section>
    </demo-page-shell>
  `,
})
export class BreadcrumbPageComponent {}
