import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BadgeComponent } from './badge.component';

@Component({
  imports: [BadgeComponent],
  template: `<ui-badge [variant]="v">Label</ui-badge>`,
})
class Host {
  v: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
}

describe('BadgeComponent', () => {
  for (const variant of ['default', 'secondary', 'destructive', 'outline'] as const) {
    it(`applies variant=${variant}`, () => {
      const fixture = TestBed.createComponent(Host);
      fixture.componentInstance.v = variant;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('ui-badge') as HTMLElement;
      // All variants share the base badge scaffolding.
      expect(el.className).toContain('inline-flex');
      expect(el.className).toContain('rounded-full');
      expect(el.textContent?.trim()).toBe('Label');
    });
  }

  it('carries destructive token when variant=destructive', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.v = 'destructive';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('ui-badge') as HTMLElement;
    expect(el.className).toContain('bg-destructive');
  });
});
