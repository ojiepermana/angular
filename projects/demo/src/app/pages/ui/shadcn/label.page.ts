import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputComponent, LabelComponent } from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-label-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, InputComponent, LabelComponent],
  template: `
    <demo-page-shell title="Label" description="Renders an accessible label for a form control.">
      <section class="mb-10 grid max-w-md gap-2">
        <label ui-label for="email">Email</label>
        <input ui-input id="email" type="email" placeholder="you@example.com" />
      </section>
    </demo-page-shell>
  `,
})
export class LabelPageComponent {}
