import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LabelComponent } from './label.component';

@Component({
  imports: [LabelComponent],
  template: `<ui-label [for]="target" [class]="extra">Email</ui-label>`,
})
class Host {
  target = 'email';
  extra = '';
}

describe('LabelComponent', () => {
  it('renders projected content and applies base classes', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('ui-label') as HTMLElement;
    expect(label.textContent?.trim()).toBe('Email');
    expect(label.className).toContain('text-sm');
    expect(label.className).toContain('font-medium');
  });

  it('mirrors [for] into the for attribute', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('ui-label') as HTMLElement;
    expect(label.getAttribute('for')).toBe('email');
  });

  it('merges user class via cn()', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.extra = 'text-lg';
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('ui-label') as HTMLElement;
    expect(label.className).toContain('text-lg');
    // tailwind-merge should have stripped the conflicting text-sm
    expect(label.className).not.toContain('text-sm');
  });
});
