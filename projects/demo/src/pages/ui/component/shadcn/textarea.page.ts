import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabelComponent, TextareaComponent } from '@ojiepermana/angular/component';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-textarea-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, FormsModule, LabelComponent, TextareaComponent],
  template: `
    <demo-page-shell title="Textarea" description="Multiline text input. Works with ngModel / FormControl.">
      <section class="mb-10 grid max-w-md gap-2">
        <label ui-label>Your message</label>
        <textarea ui-textarea rows="4" placeholder="Type your message here…"></textarea>
      </section>

      <section class="mb-10 grid max-w-md gap-2">
        <label ui-label>Invalid</label>
        <textarea ui-textarea rows="3" aria-invalid="true" value="Too short"></textarea>
      </section>
    </demo-page-shell>
  `,
})
export class TextareaPageComponent {}
