import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { SkeletonComponent } from './skeleton.component';

@Component({
  imports: [SkeletonComponent],
  template: `<ui-skeleton [class]="c" />`,
})
class Host {
  c = 'h-4 w-24';
}

describe('SkeletonComponent', () => {
  it('applies base animation + user classes', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('ui-skeleton') as HTMLElement;
    expect(el.className).toContain('animate-pulse');
    expect(el.className).toContain('bg-muted');
    expect(el.className).toContain('h-4');
    expect(el.className).toContain('w-24');
  });

  it('is aria-hidden="true"', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('ui-skeleton') as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });
});
