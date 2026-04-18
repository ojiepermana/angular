import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent, LabelComponent } from '@ojiepermana/angular/component';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-checkbox-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, FormsModule, CheckboxComponent, LabelComponent],
  template: `
    <demo-page-shell
      title="Checkbox"
      description="Shadcn-styled checkbox built on mat-checkbox. Works with ngModel / FormControl.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">States</h2>
        <div class="flex flex-col gap-3">
          <label ui-label class="flex items-center gap-2">
            <ui-checkbox [(ngModel)]="agree" />
            <span>Accept terms and conditions</span>
          </label>
          <label ui-label class="flex items-center gap-2">
            <ui-checkbox [indeterminate]="true" />
            <span>Indeterminate</span>
          </label>
          <label ui-label class="flex items-center gap-2 opacity-60">
            <ui-checkbox [ngModel]="true" [disabled]="true" />
            <span>Disabled + checked</span>
          </label>
        </div>
        <p class="mt-3 text-sm text-muted-foreground">Agreed: {{ agree() ? 'yes' : 'no' }}</p>
      </section>
    </demo-page-shell>
  `,
})
export class CheckboxPageComponent {
  protected readonly agree = signal(false);
}
