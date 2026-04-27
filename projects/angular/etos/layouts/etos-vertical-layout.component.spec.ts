import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideEtosBrand } from '../core/etos-brand.provider';
import { EtosVerticalLayoutComponent } from './etos-vertical-layout.component';

@Component({
  imports: [EtosVerticalLayoutComponent],
  template: `<etos-vertical-layout />`,
})
class HostComponent {}

@Component({
  imports: [EtosVerticalLayoutComponent],
  template: `
    <etos-vertical-layout>
      <a ui-sidebar-header href="/brand" class="test-brand-link">Brand</a>
      <button ui-sidebar-footer type="button" class="test-profile-trigger">Profile</button>
    </etos-vertical-layout>
  `,
})
class HostWithSlotsComponent {}

describe('EtosVerticalLayoutComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    delete document.documentElement.dataset['mode'];
    delete document.documentElement.dataset['theme'];
    document.documentElement.removeAttribute('theme-brand');
  });

  it('caps the fixed vertical shell without centering the main area inside it', () => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideRouter([]),
        provideEtosBrand({
          materialDefaults: false,
          theme: {
            modeStorageKey: null,
            brandStorageKey: null,
            colorStorageKey: null,
            styleStorageKey: null,
          },
          layout: {
            storageKey: null,
            widthStorageKey: null,
          },
        }),
      ],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const host = root.querySelector('etos-vertical-layout') as HTMLElement | null;
    const frame = host?.firstElementChild as HTMLElement | null;
    const main = root.querySelector('main');

    expect(host?.getAttribute('data-layout-width')).toBe('fixed');
    expect(frame?.classList.contains('etos-layout-frame')).toBe(true);
    expect(frame?.classList.contains('etos-layout-frame--vertical')).toBe(true);
    expect(frame?.classList.contains('etos-layout-frame--fixed')).toBe(true);
    expect(frame?.classList.contains('etos-layout-frame--vertical-fixed')).toBe(true);
    expect(main?.classList.contains('etos-layout-main')).toBe(true);
    expect(main?.classList.contains('etos-layout-main--fixed')).toBe(true);
    expect(main?.classList.contains('etos-layout-main--vertical-fixed')).toBe(true);
  });

  it('keeps the Etos vertical shell fluid when configured for full width', () => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideRouter([]),
        provideEtosBrand({
          materialDefaults: false,
          theme: {
            modeStorageKey: null,
            brandStorageKey: null,
            colorStorageKey: null,
            styleStorageKey: null,
          },
          layout: {
            width: 'full',
            storageKey: null,
            widthStorageKey: null,
          },
        }),
      ],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const host = root.querySelector('etos-vertical-layout') as HTMLElement | null;
    const frame = host?.firstElementChild as HTMLElement | null;
    const main = root.querySelector('main');

    expect(host?.getAttribute('data-layout-width')).toBe('full');
    expect(frame?.classList.contains('etos-layout-frame--fixed')).toBe(false);
    expect(frame?.classList.contains('etos-layout-frame--vertical-fixed')).toBe(false);
    expect(main?.classList.contains('etos-layout-main--fixed')).toBe(false);
    expect(main?.classList.contains('etos-layout-main--vertical-fixed')).toBe(false);
  });

  it('projects sidebar header and footer content into the vertical shell', () => {
    TestBed.configureTestingModule({
      imports: [HostWithSlotsComponent],
      providers: [
        provideRouter([]),
        provideEtosBrand({
          materialDefaults: false,
          theme: {
            modeStorageKey: null,
            brandStorageKey: null,
            colorStorageKey: null,
            styleStorageKey: null,
          },
          layout: {
            storageKey: null,
            widthStorageKey: null,
          },
        }),
      ],
    });

    const fixture = TestBed.createComponent(HostWithSlotsComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const sidebar = root.querySelector('ui-sidebar') as HTMLElement | null;

    expect(sidebar?.textContent).toContain('Brand');
    expect(sidebar?.textContent).toContain('Profile');
    expect(sidebar?.querySelector('.test-brand-link')).toBeTruthy();
    expect(sidebar?.querySelector('.test-profile-trigger')).toBeTruthy();
  });
});
