import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CardComponent,
  CardContentComponent,
  CardDescriptionComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleComponent,
  ButtonComponent,
} from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-card-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageShellComponent,
    CardComponent,
    CardContentComponent,
    CardDescriptionComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleComponent,
    ButtonComponent,
  ],
  template: `
    <demo-page-shell title="Card" description="Container for related content, titles, descriptions and actions.">
      <section class="mb-10 grid gap-6 md:grid-cols-2">
        <ui-card class="block rounded-xl border border-border bg-card text-card-foreground shadow">
          <ui-card-header class="flex flex-col gap-1.5 p-6">
            <ui-card-title class="text-lg font-semibold leading-none tracking-tight">Account</ui-card-title>
            <ui-card-description class="text-sm text-muted-foreground">
              Manage your account settings.
            </ui-card-description>
          </ui-card-header>
          <ui-card-content class="p-6 pt-0 text-sm text-muted-foreground">
            Update your email, password, and profile information.
          </ui-card-content>
          <ui-card-footer class="flex items-center p-6 pt-0">
            <button ui-button>Save changes</button>
          </ui-card-footer>
        </ui-card>

        <ui-card class="block rounded-xl border border-border bg-card text-card-foreground shadow">
          <ui-card-header class="flex flex-col gap-1.5 p-6">
            <ui-card-title class="text-lg font-semibold leading-none tracking-tight">Billing</ui-card-title>
            <ui-card-description class="text-sm text-muted-foreground">
              Review invoices and payment methods.
            </ui-card-description>
          </ui-card-header>
          <ui-card-content class="p-6 pt-0 text-sm">Next invoice: $19.00 on May 1.</ui-card-content>
          <ui-card-footer class="flex items-center gap-2 p-6 pt-0">
            <button ui-button variant="outline">View invoices</button>
            <button ui-button variant="destructive">Cancel plan</button>
          </ui-card-footer>
        </ui-card>
      </section>
    </demo-page-shell>
  `,
})
export class CardPageComponent {}
