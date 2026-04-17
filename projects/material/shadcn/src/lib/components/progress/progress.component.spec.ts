import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ProgressComponent } from './progress.component';

@Component({
  imports: [ProgressComponent],
  template: `<ui-progress [value]="v" [max]="m" [indeterminate]="ind" aria-label="Loading" />`,
})
class Host {
  v: number | null = 40;
  m = 100;
  ind = false;
}

describe('ProgressComponent', () => {
  it('sets progressbar role + aria-valuenow', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('ui-progress') as HTMLElement;
    expect(el.getAttribute('role')).toBe('progressbar');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    expect(el.getAttribute('aria-valuenow')).toBe('40');
    expect(el.getAttribute('data-state')).toBe('determinate');
    expect(el.getAttribute('aria-label')).toBe('Loading');
  });

  it('indeterminate drops aria-valuenow and flips data-state', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.ind = true;
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('ui-progress') as HTMLElement;
    expect(el.getAttribute('data-state')).toBe('indeterminate');
    expect(el.getAttribute('aria-valuenow')).toBeNull();
  });

  it('clamps out-of-range values to [0, max]', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.v = 250;
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('ui-progress') as HTMLElement;
    expect(el.getAttribute('aria-valuenow')).toBe('100');
  });

  it('indicator transform reflects progress', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const bar = fixture.nativeElement.querySelector('.ui-progress-indicator') as HTMLElement;
    expect(bar.style.transform).toBe('translateX(-60%)');
  });
});
