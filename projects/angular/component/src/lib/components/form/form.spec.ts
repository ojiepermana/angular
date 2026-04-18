import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { FormControlDirective } from './form-control.directive';
import { FormDescriptionComponent } from './form-description.component';
import { FormFieldComponent } from './form-field.component';
import { FormLabelComponent } from './form-label.component';
import { FormMessageComponent } from './form-message.component';
import { InputComponent } from '../input/input.component';

@Component({
  imports: [
    FormFieldComponent,
    FormLabelComponent,
    FormDescriptionComponent,
    FormMessageComponent,
    FormControlDirective,
    InputComponent,
    ReactiveFormsModule,
  ],
  template: `
    <ui-form-field>
      <ui-form-label>Email</ui-form-label>
      <input ui-input uiFormControl [formControl]="email" />
      <ui-form-description>We'll never share your email.</ui-form-description>
      <ui-form-message />
    </ui-form-field>
  `,
})
class Host {
  email = new FormControl('', [Validators.required, Validators.email]);
}

describe('Form primitives', () => {
  it('wires label -> control via the shared context id', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('ui-form-label') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input[ui-input]') as HTMLInputElement;
    expect(input.id).toBeTruthy();
    expect(label.getAttribute('for')).toBe(input.id);
  });

  it('description and message expose ids that control can reference via aria-describedby', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const desc = fixture.nativeElement.querySelector('ui-form-description') as HTMLElement;
    const msg = fixture.nativeElement.querySelector('ui-form-message') as HTMLElement;
    expect(desc.getAttribute('id')).toBeTruthy();
    expect(msg.getAttribute('id')).toBeTruthy();
    expect(msg.getAttribute('role')).toBe('alert');
    expect(msg.getAttribute('aria-live')).toBe('polite');
  });

  it('renders the first validation error message when control is invalid + touched', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.email.markAsTouched();
    fixture.componentInstance.email.updateValueAndValidity();
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('ui-form-message') as HTMLElement;
    expect(msg.textContent).toContain('required');
  });
});
