import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent, LabelComponent } from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-input-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, FormsModule, InputComponent, LabelComponent],
  template: `
    <demo-page-shell title="Input" description="Styled native input that works with ngModel and reactive forms.">
      <section class="mb-10 grid max-w-md gap-4">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Variants</h2>
        <div class="grid gap-2">
          <label ui-label>Email</label>
          <input ui-input type="email" placeholder="you@example.com" />
        </div>
        <div class="grid gap-2">
          <label ui-label>Invalid</label>
          <input ui-input aria-invalid="true" value="not-an-email" />
        </div>
        <div class="grid gap-2">
          <label ui-label>Disabled</label>
          <input ui-input disabled value="read-only" />
        </div>
        <div class="grid gap-2">
          <label ui-label>File</label>
          <input ui-input type="file" />
        </div>
      </section>
    </demo-page-shell>
  `,
})
export class InputPageComponent {}
