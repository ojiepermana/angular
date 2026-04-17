import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { describe, expect, it } from 'vitest';
import { CalendarComponent } from './calendar.component';

@Component({
  imports: [CalendarComponent],
  template: `<ui-calendar [(value)]="value" />`,
})
class Host {
  value: Date | null = new Date(2024, 0, 15);
}

describe('CalendarComponent', () => {
  it('renders a mat-calendar bound to the value signal', () => {
    TestBed.configureTestingModule({ providers: [provideNativeDateAdapter()] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-calendar')).toBeTruthy();
  });
});
