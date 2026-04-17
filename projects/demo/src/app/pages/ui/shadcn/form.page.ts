import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonComponent,
  FormControlDirective,
  FormDescriptionComponent,
  FormFieldComponent,
  FormLabelComponent,
  FormMessageComponent,
  InputComponent,
} from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageShellComponent,
    ReactiveFormsModule,
    ButtonComponent,
    FormControlDirective,
    FormDescriptionComponent,
    FormFieldComponent,
    FormLabelComponent,
    FormMessageComponent,
    InputComponent,
  ],
  template: `
    <demo-page-shell
      title="Form"
      description="Composable form-field — wires id, aria-describedby, and aria-invalid automatically.">
      <section class="mb-10 max-w-md">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <form class="flex flex-col gap-4" (ngSubmit)="submit()">
          <ui-form-field>
            <ui-form-label>Email</ui-form-label>
            <input ui-input uiFormControl type="email" [formControl]="email" placeholder="you@example.com" />
            <ui-form-description>We'll never share your email.</ui-form-description>
            <ui-form-message />
          </ui-form-field>

          <ui-form-field>
            <ui-form-label>Username</ui-form-label>
            <input ui-input uiFormControl [formControl]="username" placeholder="shadcn" />
            <ui-form-message />
          </ui-form-field>

          <div>
            <button ui-button type="submit">Submit</button>
          </div>
        </form>
      </section>
    </demo-page-shell>
  `,
})
export class FormPageComponent {
  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected readonly username = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  protected submit(): void {
    this.email.markAsTouched();
    this.username.markAsTouched();
  }
}
