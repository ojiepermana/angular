import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutService } from '@ojiepermana/angular/layout';
import { DEFAULT_NAVIGATION_ID, NavigationService, type NavigationItem } from '@ojiepermana/angular/navigation';
import { ThemeService } from '@ojiepermana/angular/theme';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideEtosBrand } from './etos-brand.provider';

describe('provideEtosBrand', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    delete document.documentElement.dataset['mode'];
    delete document.documentElement.dataset['theme'];
    document.documentElement.removeAttribute('theme-brand');
  });

  it('configures the shared theme and layout services with Etos defaults', () => {
    TestBed.configureTestingModule({
      providers: [
        provideEtosBrand({
          materialDefaults: false,
          theme: {
            mode: 'dark',
            modeStorageKey: null,
            brandStorageKey: null,
            colorStorageKey: null,
            styleStorageKey: null,
          },
          layout: {
            mode: 'horizontal',
            width: 'full',
            storageKey: null,
            widthStorageKey: null,
          },
        }),
      ],
    });

    const theme = TestBed.inject(ThemeService);
    const layout = TestBed.inject(LayoutService);
    TestBed.flushEffects();

    expect(theme.brand()).toBe('etos');
    expect(theme.mode()).toBe('dark');
    expect(layout.mode()).toBe('horizontal');
    expect(layout.width()).toBe('full');
    expect(document.documentElement.getAttribute('theme-brand')).toBe('etos');
  });

  it('can register Etos navigation through the shared navigation service', () => {
    const navigation: NavigationItem[] = [
      {
        id: 'etos-home',
        title: 'Home',
        type: 'basic',
        link: '/',
      },
    ];

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideEtosBrand({
          materialDefaults: false,
          navigation,
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

    const service = TestBed.inject(NavigationService);

    expect(service.getItems(DEFAULT_NAVIGATION_ID)()).toEqual(navigation);
  });

  it('inherits the shared wide layout width when no consumer width is provided', () => {
    TestBed.configureTestingModule({
      providers: [
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
            widthStorageKey: 'layout-width',
          },
        }),
      ],
    });

    const layout = TestBed.inject(LayoutService);
    TestBed.flushEffects();

    expect(layout.width()).toBe('wide');
    expect(localStorage.getItem('layout-width')).toBe('wide');
  });
});
