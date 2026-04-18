import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertComponent, AlertDescriptionComponent, AlertTitleComponent } from '@ojiepermana/angular/component';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-alert-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, AlertComponent, AlertTitleComponent, AlertDescriptionComponent],
  template: `
    <demo-page-shell
      title="Alert"
      description="Displays a callout for user attention. Default and destructive variants.">
      <section class="mb-10 grid gap-4">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Variants</h2>
        <ui-alert variant="default">
          <ui-alert-title>Heads up!</ui-alert-title>
          <ui-alert-description>You can add components to your app using the CLI.</ui-alert-description>
        </ui-alert>
        <ui-alert variant="destructive">
          <ui-alert-title>Something went wrong</ui-alert-title>
          <ui-alert-description>Your session has expired. Please log in again.</ui-alert-description>
        </ui-alert>
      </section>
    </demo-page-shell>
  `,
})
export class AlertPageComponent {}
