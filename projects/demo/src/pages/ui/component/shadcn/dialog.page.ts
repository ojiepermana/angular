import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ButtonComponent,
  DialogComponent,
  DialogDescriptionComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '@ojiepermana/angular/component';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-dialog-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageShellComponent,
    ButtonComponent,
    DialogComponent,
    DialogDescriptionComponent,
    DialogFooterComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
  ],
  template: `
    <demo-page-shell
      title="Dialog"
      description="Modal dialog rendered through CDK overlay, with focus trap and restore.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <button ui-button (click)="open.set(true)">Open dialog</button>

        <ui-dialog [(open)]="open">
          <ui-dialog-header>
            <ui-dialog-title>Delete this project?</ui-dialog-title>
            <ui-dialog-description>
              This action cannot be undone. This permanently deletes your project and removes it from our servers.
            </ui-dialog-description>
          </ui-dialog-header>
          <ui-dialog-footer>
            <button ui-button variant="outline" (click)="open.set(false)">Cancel</button>
            <button ui-button variant="destructive" (click)="open.set(false)">Delete</button>
          </ui-dialog-footer>
        </ui-dialog>
      </section>
    </demo-page-shell>
  `,
})
export class DialogPageComponent {
  protected readonly open = signal(false);
}
