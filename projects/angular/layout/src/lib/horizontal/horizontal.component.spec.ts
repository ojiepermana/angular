import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ThemeService } from '@ojiepermana/angular/theme';
import { beforeEach, describe, expect, it } from 'vitest';
import { MATERIAL_LAYOUT_CONFIG } from '../core/layout.tokens';
import { HorizontalLayoutComponent } from './horizontal.component';

@Component({
  imports: [HorizontalLayoutComponent],
  template: `
    <horizontal>
      <a ui-layout-brand href="/">Brand</a>
      <button ui-layout-profile type="button">Profile</button>
    </horizontal>
  `,
})
class HostComponent {}

describe('HorizontalLayoutComponent', () => {
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

  it('projects brand and profile content into the topbar', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-ui-topbar-slot="start"]')?.textContent).toContain('Brand');
    expect(root.querySelector('[data-ui-topbar-slot="nav"] [role="menubar"]')).toBeTruthy();
    expect(root.querySelector('[data-ui-topbar-slot="end"]')?.textContent).toContain('Profile');

    const host = root.querySelector('horizontal') as HTMLElement | null;
    const frame = host?.firstElementChild as HTMLElement | null;
    const topbar = root.querySelector('ui-topbar') as HTMLElement | null;
    const main = root.querySelector('main');
    expect(host?.getAttribute('data-layout-width')).toBe('fixed');
    expect(host?.getAttribute('data-style')).toBe('default');
    expect(host?.style.borderWidth).toBe('');
    expect(frame?.style.borderWidth).toBe('var(--border-width)');
    expect(topbar?.style.borderBottomWidth).toBe('var(--border-width)');
    expect(topbar?.style.height).toBe('var(--layout-topbar-height)');
    expect(topbar?.classList.contains('h-12')).toBe(false);
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
    expect(host?.classList.contains('mx-auto')).toBe(false);
    expect(host?.classList.contains('md:mx-auto')).toBe(false);
    expect(host?.classList.contains('lg:mx-auto')).toBe(false);
    expect(host?.classList.contains('my-4')).toBe(false);
    expect(host?.classList.contains('md:my-6')).toBe(false);
    expect(host?.classList.contains('lg:my-8')).toBe(false);
    expect(host?.classList.contains('max-w-7xl')).toBe(false);
    expect(host?.classList.contains('md:max-w-7xl')).toBe(false);
    expect(host?.classList.contains('lg:max-w-7xl')).toBe(false);
    expect(host?.classList.contains('lg:rounded-lg')).toBe(false);
    expect(host?.classList.contains('lg:shadow-sm')).toBe(false);
    expect(host?.classList.contains('h-[calc(100dvh-2rem)]')).toBe(false);
    expect(host?.classList.contains('md:h-[calc(100dvh-3rem)]')).toBe(false);
    expect(host?.classList.contains('lg:h-[calc(100dvh-4rem)]')).toBe(false);
    expect(host?.classList.contains('w-[calc(100%-2rem)]')).toBe(false);
    expect(host?.classList.contains('md:w-[calc(100%-3rem)]')).toBe(false);
    expect(host?.classList.contains('lg:w-[calc(100%-4rem)]')).toBe(false);
    expect(host?.classList.contains('px-4')).toBe(false);
    expect(frame?.classList.contains('flex')).toBe(true);
    expect(frame?.classList.contains('flex-col')).toBe(true);
    expect(frame?.classList.contains('h-full')).toBe(true);
    expect(frame?.classList.contains('w-full')).toBe(true);
    expect(frame?.classList.contains('overflow-hidden')).toBe(true);
    expect(frame?.classList.contains('lg:mx-auto')).toBe(false);
    expect(frame?.classList.contains('lg:max-w-7xl')).toBe(false);
    expect(frame?.classList.contains('lg:border')).toBe(true);
    expect(frame?.classList.contains('lg:border-border')).toBe(true);
    expect(frame?.classList.contains('lg:rounded-lg')).toBe(true);
    expect(frame?.classList.contains('lg:shadow-sm')).toBe(true);
    expect(frame?.classList.contains('lg:my-8')).toBe(false);
    expect(main?.classList.contains('mx-auto')).toBe(true);
    expect(main?.classList.contains('w-full')).toBe(true);
    expect(main?.classList.contains('max-w-7xl')).toBe(true);
  });

  it('keeps fixed shell spacing on host padding instead of outer margins', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host = (fixture.nativeElement as HTMLElement).querySelector('horizontal') as HTMLElement | null;
    const frame = host?.firstElementChild as HTMLElement | null;

    expect(host?.classList.contains('lg:p-8')).toBe(true);
    expect(host?.classList.contains('lg:my-8')).toBe(false);
    expect(host?.classList.contains('lg:mx-auto')).toBe(false);
    expect(frame?.classList.contains('h-full')).toBe(true);
    expect(frame?.classList.contains('lg:my-8')).toBe(false);
  });

  it('keeps the horizontal shell full width when configured', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: MATERIAL_LAYOUT_CONFIG, useValue: { width: 'full' } }],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host = (fixture.nativeElement as HTMLElement).querySelector('horizontal') as HTMLElement | null;
    const frame = host?.firstElementChild as HTMLElement | null;
    const topbar = (fixture.nativeElement as HTMLElement).querySelector('ui-topbar') as HTMLElement | null;
    const main = (fixture.nativeElement as HTMLElement).querySelector('main');

    expect(host?.getAttribute('data-layout-width')).toBe('full');
    expect(host?.getAttribute('data-style')).toBe('default');
    expect(host?.style.borderWidth).toBe('');
    expect(frame?.style.borderWidth).toBe('');
    expect(topbar?.style.borderBottomWidth).toBe('var(--border-width)');
    expect(host?.classList.contains('border')).toBe(false);
    expect(host?.classList.contains('border-border')).toBe(false);
    expect(host?.classList.contains('md:border')).toBe(false);
    expect(host?.classList.contains('md:border-border')).toBe(false);
    expect(host?.classList.contains('lg:border')).toBe(false);
    expect(host?.classList.contains('lg:border-border')).toBe(false);
    expect(host?.classList.contains('h-dvh')).toBe(true);
    expect(host?.classList.contains('w-full')).toBe(true);
    expect(host?.classList.contains('box-border')).toBe(false);
    expect(host?.classList.contains('my-4')).toBe(false);
    expect(host?.classList.contains('md:my-6')).toBe(false);
    expect(host?.classList.contains('mx-auto')).toBe(false);
    expect(host?.classList.contains('md:mx-auto')).toBe(false);
    expect(host?.classList.contains('lg:mx-auto')).toBe(false);
    expect(host?.classList.contains('max-w-7xl')).toBe(false);
    expect(host?.classList.contains('md:max-w-7xl')).toBe(false);
    expect(host?.classList.contains('lg:max-w-7xl')).toBe(false);
    expect(host?.classList.contains('lg:rounded-lg')).toBe(false);
    expect(host?.classList.contains('lg:shadow-sm')).toBe(false);
    expect(host?.classList.contains('px-4')).toBe(false);
    expect(host?.classList.contains('lg:p-8')).toBe(false);
    expect(frame?.classList.contains('lg:mx-auto')).toBe(false);
    expect(frame?.classList.contains('lg:max-w-7xl')).toBe(false);
    expect(frame?.classList.contains('lg:border')).toBe(false);
    expect(frame?.classList.contains('lg:border-border')).toBe(false);
    expect(frame?.classList.contains('lg:rounded-lg')).toBe(false);
    expect(frame?.classList.contains('lg:shadow-sm')).toBe(false);
    expect(main?.classList.contains('mx-auto')).toBe(false);
    expect(main?.classList.contains('w-full')).toBe(false);
    expect(main?.classList.contains('max-w-7xl')).toBe(false);
  });

  it('reflects the active theme style on the host', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    TestBed.inject(ThemeService).setStyle('soft');
    fixture.detectChanges();

    const host = (fixture.nativeElement as HTMLElement).querySelector('horizontal');

    expect(host?.getAttribute('data-style')).toBe('soft');
  });

  it('uses the persisted theme-style value on init', () => {
    localStorage.setItem('theme-style', 'sharp');

    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host = (fixture.nativeElement as HTMLElement).querySelector('horizontal');

    expect(host?.getAttribute('data-style')).toBe('sharp');
  });
});
