import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ComboboxComponent, type ComboboxOption } from './combobox.component';

@Component({
  imports: [ComboboxComponent],
  template: ` <ui-combobox [options]="options" [(value)]="value" placeholder="Pick a framework" /> `,
})
class Host {
  options: ComboboxOption<string>[] = [
    { value: 'ng', label: 'Angular' },
    { value: 'rx', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ];
  value: string | null = null;
}

describe('ComboboxComponent', () => {
  it('renders a role=combobox trigger showing the placeholder', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button[role=combobox]') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.textContent).toContain('Pick a framework');
  });

  it('opens the CDK overlay panel on click and exposes command input', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button[role=combobox]') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    const panel = document.getElementById('ui-combobox-panel');
    expect(panel).toBeTruthy();
    expect(panel!.querySelector('input[ui-command-input]')).toBeTruthy();
    fixture.destroy();
  });
});
