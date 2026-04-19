import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TabsTriggerComponent,
} from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-tabs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent, TabsComponent, TabsContentComponent, TabsListComponent, TabsTriggerComponent],
  template: `
    <ui-shell title="Tabs" description="Horizontal tab set with keyboard-roving focus and active panel.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <ui-tabs value="account" class="w-full max-w-xl">
          <ui-tabs-list
            class="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            <button ui-tabs-trigger value="account">Account</button>
            <button ui-tabs-trigger value="password">Password</button>
            <button ui-tabs-trigger value="billing" [disabled]="true">Billing</button>
          </ui-tabs-list>
          <ui-tabs-content value="account" class="mt-4 rounded-md border border-border p-4 text-sm">
            Make changes to your account here. Click save when you're done.
          </ui-tabs-content>
          <ui-tabs-content value="password" class="mt-4 rounded-md border border-border p-4 text-sm">
            Change your password here. After saving, you'll be logged out.
          </ui-tabs-content>
          <ui-tabs-content value="billing" class="mt-4 rounded-md border border-border p-4 text-sm">
            Billing settings.
          </ui-tabs-content>
        </ui-tabs>
      </section>
    </ui-shell>
  `,
})
export class TabsPageComponent {}
