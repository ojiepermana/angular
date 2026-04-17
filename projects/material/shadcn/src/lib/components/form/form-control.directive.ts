import { Directive, OnInit, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormFieldContext } from './form-field.context';

/**
 * Attach to the native form control inside a `<ui-form-field>` to auto-wire:
 *  - `id` ↔ `<ui-form-label for>`
 *  - `aria-describedby` ↔ description + error message
 *  - `aria-invalid` ↔ control validity (after touch/dirty)
 *
 * @example
 * <ui-form-field>
 *   <ui-form-label>Email</ui-form-label>
 *   <input ui-input uiFormControl [formControl]="email" />
 *   <ui-form-description>We'll never share it.</ui-form-description>
 *   <ui-form-message />
 * </ui-form-field>
 */
@Directive({
  selector: '[uiFormControl]',
  host: {
    '[attr.id]': 'ctx.controlId',
    '[attr.aria-describedby]': 'ctx.describedBy()',
    '[attr.aria-invalid]': 'ctx.invalid() ? "true" : null',
  },
})
export class FormControlDirective implements OnInit {
  protected readonly ctx = inject(FormFieldContext);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  ngOnInit(): void {
    if (this.ngControl?.control) {
      this.ctx.control.set(this.ngControl.control);
    }
  }
}
