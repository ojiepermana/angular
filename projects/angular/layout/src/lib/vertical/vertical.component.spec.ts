import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { MATERIAL_LAYOUT_CONFIG } from '../core/layout.tokens';
import { VerticalLayoutComponent } from './vertical.component';

@Component({
  imports: [VerticalLayoutComponent],
  template: `<vertical />`,
})
class HostComponent {}

describe('VerticalLayoutComponent', () => {
  beforeEach(() => {
    localStorage.removeItem('layout-mode');
    localStorage.removeItem('layout-width');
  });

  it('constrains the main area when layout width is fixed', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const host = root.querySelector('vertical');
    const main = root.querySelector('main');

    expect(host?.getAttribute('data-layout-width')).toBe('fixed');
    expect(host?.classList.contains('h-dvh')).toBe(true);
    expect(host?.classList.contains('w-full')).toBe(true);
    expect(host?.classList.contains('border')).toBe(false);
    expect(host?.classList.contains('border-border')).toBe(false);
    expect(host?.classList.contains('md:border')).toBe(false);
    expect(host?.classList.contains('md:border-border')).toBe(false);
    expect(host?.classList.contains('lg:border')).toBe(true);
    expect(host?.classList.contains('lg:border-border')).toBe(true);
    expect(host?.classList.contains('mx-auto')).toBe(false);
    expect(host?.classList.contains('md:mx-auto')).toBe(false);
    expect(host?.classList.contains('lg:mx-auto')).toBe(true);
    expect(host?.classList.contains('md:my-6')).toBe(false);
    expect(host?.classList.contains('lg:my-8')).toBe(true);
    expect(host?.classList.contains('md:w-[calc(100%-3rem)]')).toBe(false);
    expect(host?.classList.contains('lg:w-[calc(100%-4rem)]')).toBe(true);
    expect(main?.classList.contains('mx-auto')).toBe(false);
    expect(main?.classList.contains('md:mx-auto')).toBe(false);
    expect(main?.classList.contains('lg:mx-auto')).toBe(true);
    expect(main?.classList.contains('max-w-7xl')).toBe(false);
    expect(main?.classList.contains('md:max-w-7xl')).toBe(false);
    expect(main?.classList.contains('lg:max-w-7xl')).toBe(true);
  });

  it('keeps the main area fluid when configured for full width', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: MATERIAL_LAYOUT_CONFIG, useValue: { width: 'full' } }],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const host = root.querySelector('vertical');
    const main = root.querySelector('main');

    expect(host?.getAttribute('data-layout-width')).toBe('full');
    expect(host?.classList.contains('border')).toBe(false);
    expect(host?.classList.contains('border-border')).toBe(false);
    expect(host?.classList.contains('md:border')).toBe(false);
    expect(host?.classList.contains('md:border-border')).toBe(false);
    expect(host?.classList.contains('lg:border')).toBe(false);
    expect(host?.classList.contains('lg:border-border')).toBe(false);
    expect(host?.classList.contains('mx-auto')).toBe(false);
    expect(host?.classList.contains('md:mx-auto')).toBe(false);
    expect(host?.classList.contains('lg:mx-auto')).toBe(false);
    expect(main?.classList.contains('mx-auto')).toBe(false);
    expect(main?.classList.contains('md:mx-auto')).toBe(false);
    expect(main?.classList.contains('lg:mx-auto')).toBe(false);
    expect(main?.classList.contains('max-w-7xl')).toBe(false);
    expect(main?.classList.contains('md:max-w-7xl')).toBe(false);
    expect(main?.classList.contains('lg:max-w-7xl')).toBe(false);
  });
});
