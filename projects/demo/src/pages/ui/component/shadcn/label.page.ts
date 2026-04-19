import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputComponent, LabelComponent } from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-label-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent, InputComponent, LabelComponent],
  template: `
    <ui-shell title="Label" description="Renders an accessible label for a form control.">
      <section class="mb-10 grid max-w-md gap-2">
        <label ui-label for="email">Email</label>
        <input ui-input id="email" type="email" placeholder="you@example.com" />
      </section>
    </ui-shell>
  `,
})
export class LabelPageComponent {}
