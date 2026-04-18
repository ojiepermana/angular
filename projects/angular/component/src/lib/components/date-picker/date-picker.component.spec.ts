import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { describe, expect, it } from 'vitest';
import { DatePickerComponent } from './date-picker.component';

@Component({
  imports: [DatePickerComponent],
  template: `<ui-date-picker [(value)]="value" />`,
})
class Host {
  value: Date | null = null;
}

describe('DatePickerComponent', () => {
  it('renders a form field with date input and toggle button', () => {
    TestBed.configureTestingModule({ providers: [provideNativeDateAdapter()] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-form-field')).toBeTruthy();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.getAttribute('placeholder')).toBe('Pick a date');
  });
});
