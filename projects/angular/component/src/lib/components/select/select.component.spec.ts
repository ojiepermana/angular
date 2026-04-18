import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { describe, expect, it } from 'vitest';
import { SelectComponent } from './select.component';

@Component({
  imports: [SelectComponent, MatOption, FormsModule],
  template: `
    <ui-select placeholder="Choose" [(ngModel)]="value" aria-label="Plan">
      <mat-option value="free">Free</mat-option>
      <mat-option value="pro">Pro</mat-option>
    </ui-select>
  `,
})
class Host {
  value: string | null = null;
}

describe('SelectComponent', () => {
  it('renders a mat-form-field + mat-select trigger with the projected label', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-form-field')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('mat-select')).toBeTruthy();
  });

  it('propagates ngModel changes through to the wrapped select signal', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 'pro';
    fixture.detectChanges();
    await fixture.whenStable();
    // When value is non-null, mat-form-field flips the floating-label state.
    const field = fixture.nativeElement.querySelector('mat-form-field') as HTMLElement;
    expect(field).toBeTruthy();
    expect(fixture.componentInstance.value).toBe('pro');
  });
});
