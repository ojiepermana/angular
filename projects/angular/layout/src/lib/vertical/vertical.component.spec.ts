import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ThemeService } from '@ojiepermana/angular/theme';
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
    localStorage.removeItem('theme-mode');
    localStorage.removeItem('theme-brand');
    localStorage.removeItem('theme-color');
    localStorage.removeItem('theme-style');
    document.documentElement.classList.remove('dark');
    delete document.documentElement.dataset['mode'];
    delete document.documentElement.dataset['color'];
    delete document.documentElement.dataset['style'];
    delete document.documentElement.dataset['theme'];
    document.documentElement.removeAttribute('theme-brand');
    document.documentElement.removeAttribute('theme-color');
    document.documentElement.removeAttribute('theme-style');
  });

  it('constrains the main area when layout width is fixed', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const host = root.querySelector('vertical') as HTMLElement | null;
    const frame = host?.firstElementChild as HTMLElement | null;
    const main = root.querySelector('main');
    const sidebar = root.querySelector('ui-sidebar') as HTMLElement | null;

    expect(host?.getAttribute('data-layout-width')).toBe('fixed');
    expect(host?.getAttribute('data-style')).toBe('default');
    expect(host?.style.borderWidth).toBe('');
    expect(frame?.style.borderWidth).toBe('var(--border-width)');
    expect(sidebar?.style.borderLeftWidth).toBe('var(--border-width)');
    expect(sidebar?.style.borderRightWidth).toBe('var(--border-width)');
    expect(host?.classList.contains('block')).toBe(true);
    expect(host?.classList.contains('h-dvh')).toBe(true);
    expect(host?.classList.contains('w-full')).toBe(true);
    expect(host?.classList.contains('box-border')).toBe(true);
    expect(host?.classList.contains('lg:p-8')).toBe(true);
    expect(host?.classList.contains('border')).toBe(false);
    expect(host?.classList.contains('border-border')).toBe(false);
    expect(host?.classList.contains('md:border')).toBe(false);
    expect(host?.classList.contains('md:border-border')).toBe(false);
    expect(host?.classList.contains('lg:border')).toBe(false);
    expect(host?.classList.contains('lg:border-border')).toBe(false);
    expect(host?.classList.contains('mx-auto')).toBe(true);
    expect(host?.classList.contains('md:mx-auto')).toBe(false);
    expect(host?.classList.contains('lg:mx-auto')).toBe(false);
    expect(host?.classList.contains('md:my-6')).toBe(false);
    expect(host?.classList.contains('lg:my-8')).toBe(false);
    expect(host?.classList.contains('md:w-[calc(100%-3rem)]')).toBe(false);
    expect(host?.classList.contains('lg:w-[calc(100%-4rem)]')).toBe(false);
    expect(host?.classList.contains('lg:rounded-lg')).toBe(false);
    expect(host?.classList.contains('lg:shadow-sm')).toBe(false);
    expect(frame?.classList.contains('flex')).toBe(true);
    expect(frame?.classList.contains('h-full')).toBe(true);
    expect(frame?.classList.contains('w-full')).toBe(true);
    expect(frame?.classList.contains('overflow-hidden')).toBe(true);
    expect(frame?.classList.contains('lg:mx-auto')).toBe(true);
    expect(frame?.classList.contains('lg:max-w-[97.5rem]')).toBe(true);
    expect(frame?.classList.contains('lg:border')).toBe(true);
    expect(frame?.classList.contains('lg:border-border')).toBe(true);
    expect(frame?.classList.contains('lg:rounded-lg')).toBe(true);
    expect(frame?.classList.contains('lg:shadow-sm')).toBe(true);
    expect(frame?.classList.contains('lg:my-8')).toBe(false);
    expect(main?.classList.contains('mx-auto')).toBe(false);
    expect(main?.classList.contains('md:mx-auto')).toBe(false);
    expect(main?.classList.contains('lg:mx-auto')).toBe(false);
    expect(main?.classList.contains('max-w-7xl')).toBe(false);
    expect(main?.classList.contains('md:max-w-7xl')).toBe(false);
    expect(main?.classList.contains('lg:max-w-7xl')).toBe(false);
  });

  it('keeps fixed shell spacing on host padding instead of outer margins', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host = (fixture.nativeElement as HTMLElement).querySelector('vertical') as HTMLElement | null;
    const frame = host?.firstElementChild as HTMLElement | null;

    expect(host?.classList.contains('lg:p-8')).toBe(true);
    expect(host?.classList.contains('lg:my-8')).toBe(false);
    expect(host?.classList.contains('mx-auto')).toBe(true);
    expect(host?.classList.contains('lg:mx-auto')).toBe(false);
    expect(frame?.classList.contains('h-full')).toBe(true);
    expect(frame?.classList.contains('lg:mx-auto')).toBe(true);
    expect(frame?.classList.contains('lg:my-8')).toBe(false);
  });

  it('keeps the main area fluid when configured for full width', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: MATERIAL_LAYOUT_CONFIG, useValue: { width: 'full' } }],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const host = root.querySelector('vertical') as HTMLElement | null;
    const frame = host?.firstElementChild as HTMLElement | null;
    const main = root.querySelector('main');
    const sidebar = root.querySelector('ui-sidebar') as HTMLElement | null;

    expect(host?.getAttribute('data-layout-width')).toBe('full');
    expect(host?.getAttribute('data-style')).toBe('default');
    expect(host?.style.borderWidth).toBe('');
    expect(frame?.style.borderWidth).toBe('');
    expect(sidebar?.style.borderLeftWidth).toBe('var(--border-width)');
    expect(sidebar?.style.borderRightWidth).toBe('var(--border-width)');
    expect(host?.classList.contains('border')).toBe(false);
    expect(host?.classList.contains('border-border')).toBe(false);
    expect(host?.classList.contains('md:border')).toBe(false);
    expect(host?.classList.contains('md:border-border')).toBe(false);
    expect(host?.classList.contains('lg:border')).toBe(false);
    expect(host?.classList.contains('lg:border-border')).toBe(false);
    expect(host?.classList.contains('mx-auto')).toBe(false);
    expect(host?.classList.contains('md:mx-auto')).toBe(false);
    expect(host?.classList.contains('lg:mx-auto')).toBe(false);
    expect(host?.classList.contains('box-border')).toBe(false);
    expect(host?.classList.contains('lg:p-8')).toBe(false);
    expect(main?.classList.contains('mx-auto')).toBe(false);
    expect(main?.classList.contains('md:mx-auto')).toBe(false);
    expect(main?.classList.contains('lg:mx-auto')).toBe(false);
    expect(main?.classList.contains('max-w-7xl')).toBe(false);
    expect(main?.classList.contains('md:max-w-7xl')).toBe(false);
    expect(main?.classList.contains('lg:max-w-7xl')).toBe(false);
    expect(host?.classList.contains('lg:rounded-lg')).toBe(false);
    expect(host?.classList.contains('lg:shadow-sm')).toBe(false);
    expect(frame?.classList.contains('lg:mx-auto')).toBe(false);
    expect(frame?.classList.contains('lg:max-w-[97.5rem]')).toBe(false);
    expect(frame?.classList.contains('lg:border')).toBe(false);
    expect(frame?.classList.contains('lg:border-border')).toBe(false);
    expect(frame?.classList.contains('lg:rounded-lg')).toBe(false);
    expect(frame?.classList.contains('lg:shadow-sm')).toBe(false);
  });

  it('reflects the active theme style on the host', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    TestBed.inject(ThemeService).setStyle('soft');
    fixture.detectChanges();

    const host = (fixture.nativeElement as HTMLElement).querySelector('vertical');

    expect(host?.getAttribute('data-style')).toBe('soft');
  });

  it('uses the persisted theme-style value on init', () => {
    localStorage.setItem('theme-style', 'sharp');

    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host = (fixture.nativeElement as HTMLElement).querySelector('vertical');

    expect(host?.getAttribute('data-style')).toBe('sharp');
  });
});
