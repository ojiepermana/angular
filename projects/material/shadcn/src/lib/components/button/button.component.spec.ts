import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ButtonComponent } from './button.component';

@Component({
  imports: [ButtonComponent],
  template: ` <button ui-button [variant]="v" [size]="s" [class]="c">Click</button> `,
})
class Host {
  v: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' = 'default';
  s: 'default' | 'sm' | 'lg' | 'icon' = 'default';
  c = '';
}

describe('ButtonComponent', () => {
  function render(v = 'default', s = 'default') {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.v = v as Host['v'];
    fixture.componentInstance.s = s as Host['s'];
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  }

  for (const variant of [
    'default',
    'secondary',
    'destructive',
    'outline',
    'ghost',
    'link',
  ] as const) {
    it(`renders variant=${variant}`, () => {
      const btn = render(variant);
      expect(btn.getAttribute('data-variant')).toBe(variant);
      expect(btn.className).toContain('inline-flex');
    });
  }

  for (const size of ['default', 'sm', 'lg', 'icon'] as const) {
    it(`renders size=${size}`, () => {
      const btn = render('default', size);
      expect(btn.getAttribute('data-size')).toBe(size);
    });
  }

  it('merges user class via cn()', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.c = 'extra-utility-class';
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.className).toContain('extra-utility-class');
  });
});
