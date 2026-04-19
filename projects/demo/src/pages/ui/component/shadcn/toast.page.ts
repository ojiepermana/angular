import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent, ToastService } from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-toast-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent, ButtonComponent],
  template: `
    <ui-shell title="Toast" description="Lightweight transient message built on MatSnackBar.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Variants</h2>
        <div class="flex flex-wrap items-center gap-2">
          <button ui-button variant="outline" (click)="showDefault()">Default</button>
          <button ui-button variant="outline" (click)="showSuccess()">Success</button>
          <button ui-button variant="destructive" (click)="showError()">Destructive</button>
        </div>
      </section>
    </ui-shell>
  `,
})
export class ToastPageComponent {
  private readonly toast = inject(ToastService);

  protected showDefault(): void {
    this.toast.show({
      title: 'Event created',
      description: 'Friday, February 10, 2023 at 5:57 PM',
      action: 'Undo',
    });
  }

  protected showSuccess(): void {
    this.toast.success({ title: 'Saved', description: 'Your changes have been saved.' });
  }

  protected showError(): void {
    this.toast.error({ title: 'Failed to save', description: 'Network error. Please retry.' });
  }
}
