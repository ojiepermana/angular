import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { SeparatorComponent } from './separator.component';

@Component({
  imports: [SeparatorComponent],
  template: `<ui-separator [orientation]="o" [decorative]="d" [class]="c" />`,
})
class Host {
  o: 'horizontal' | 'vertical' = 'horizontal';
  d = true;
  c = '';
}

describe('SeparatorComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement.querySelector('ui-separator') as HTMLElement };
  }

  it('renders with base classes (horizontal default)', () => {
    const { el } = render();
    expect(el.className).toContain('bg-border');
    expect(el.className).toContain('h-px');
    expect(el.className).toContain('w-full');
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('switches geometry when vertical', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.o = 'vertical';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('ui-separator') as HTMLElement;
    expect(el.className).toContain('w-px');
    expect(el.className).toContain('h-full');
  });

  it('sets role="none" when decorative (default)', () => {
    const { el } = render();
    expect(el.getAttribute('role')).toBe('none');
    expect(el.getAttribute('aria-orientation')).toBeNull();
  });

  it('sets role="separator" + aria-orientation when decorative=false', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.d = false;
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('ui-separator') as HTMLElement;
    expect(el.getAttribute('role')).toBe('separator');
    expect(el.getAttribute('aria-orientation')).toBe('horizontal');
  });
});
