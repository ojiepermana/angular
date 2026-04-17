import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { InputComponent } from './input.component';

@Component({
  imports: [InputComponent, FormsModule],
  template: `<input ui-input [(ngModel)]="value" placeholder="Email" />`,
})
class Host {
  value = '';
}

describe('InputComponent', () => {
  it('applies base Tailwind classes on the host input element', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.className).toContain('rounded-md');
    expect(input.className).toContain('border-input');
    expect(input.className).toContain('focus-visible:ring-ring');
    expect(input.getAttribute('placeholder')).toBe('Email');
  });

  it('integrates with ngModel through DefaultValueAccessor', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'hi';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.value).toBe('hi');
  });
});
