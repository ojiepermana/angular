import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeService } from './theme.service';
import { MATERIAL_THEME_CONFIG } from './theme.tokens';

const MODE_KEY = 'theme-mode-test';
const BRAND_KEY = 'theme-brand-test';
const COLOR_KEY = 'theme-color-test';
const STYLE_KEY = 'theme-style-test';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    delete document.documentElement.dataset['mode'];
    delete document.documentElement.dataset['color'];
    delete document.documentElement.dataset['style'];
    delete document.documentElement.dataset['theme'];
    document.documentElement.removeAttribute('theme-brand');
    document.documentElement.removeAttribute('theme-color');
    document.documentElement.removeAttribute('theme-style');
  });

  it('reads persisted mode, color, and style on startup', () => {
    localStorage.setItem(MODE_KEY, 'dark');
    localStorage.setItem(COLOR_KEY, 'purple');
    localStorage.setItem(STYLE_KEY, 'soft');

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_THEME_CONFIG,
          useValue: {
            mode: 'light',
            color: 'blue',
            style: 'default',
            modeStorageKey: MODE_KEY,
            brandStorageKey: BRAND_KEY,
            colorStorageKey: COLOR_KEY,
            styleStorageKey: STYLE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);

    expect(service.scheme()).toBe('dark');
    expect(service.mode()).toBe('dark');
    expect(service.brand()).toBeNull();
    expect(service.color()).toBe('purple');
    expect(service.style()).toBe('soft');
    expect(service.isDark()).toBe(true);
  });

  it('prefers the persisted brand and clears explicit color/style state', () => {
    localStorage.setItem(MODE_KEY, 'dark');
    localStorage.setItem(BRAND_KEY, 'etos');
    localStorage.setItem(COLOR_KEY, 'purple');
    localStorage.setItem(STYLE_KEY, 'soft');

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_THEME_CONFIG,
          useValue: {
            mode: 'light',
            color: 'blue',
            style: 'default',
            modeStorageKey: MODE_KEY,
            brandStorageKey: BRAND_KEY,
            colorStorageKey: COLOR_KEY,
            styleStorageKey: STYLE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();

    expect(service.scheme()).toBe('dark');
    expect(service.brand()).toBe('etos');
    expect(service.color()).toBe('blue');
    expect(service.style()).toBe('default');
    expect(document.documentElement.getAttribute('theme-brand')).toBe('etos');
    expect(document.documentElement.hasAttribute('theme-color')).toBe(false);
    expect(document.documentElement.hasAttribute('theme-style')).toBe(false);
    expect(document.documentElement.dataset['color']).toBeUndefined();
    expect(document.documentElement.dataset['style']).toBeUndefined();
    expect(document.documentElement.dataset['theme']).toBe('etos');
    expect(localStorage.getItem(BRAND_KEY)).toBe('etos');
    expect(localStorage.getItem(COLOR_KEY)).toBeNull();
    expect(localStorage.getItem(STYLE_KEY)).toBeNull();
  });

  it('persists updates to the document data attributes and localStorage', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_THEME_CONFIG,
          useValue: {
            defaultMode: 'light',
            defaultColor: 'blue',
            defaultStyle: 'default',
            modeStorageKey: MODE_KEY,
            brandStorageKey: BRAND_KEY,
            colorStorageKey: COLOR_KEY,
            styleStorageKey: STYLE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);
    service.setMode('dark');
    service.setColor('amber');
    service.setStyle('brutal');
    TestBed.flushEffects();

    expect(localStorage.getItem(MODE_KEY)).toBe('dark');
    expect(localStorage.getItem(BRAND_KEY)).toBeNull();
    expect(localStorage.getItem(COLOR_KEY)).toBe('amber');
    expect(localStorage.getItem(STYLE_KEY)).toBe('brutal');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.dataset['mode']).toBe('dark');
    expect(document.documentElement.dataset['color']).toBe('amber');
    expect(document.documentElement.dataset['style']).toBe('brutal');
    expect(document.documentElement.dataset['theme']).toBe('amber');
    expect(document.documentElement.getAttribute('theme-color')).toBe('amber');
    expect(document.documentElement.getAttribute('theme-style')).toBe('brutal');
    expect(document.documentElement.hasAttribute('theme-brand')).toBe(false);
  });

  it('switches to brand mode and clears explicit color/style attributes and storage', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_THEME_CONFIG,
          useValue: {
            defaultMode: 'light',
            defaultColor: 'green',
            defaultStyle: 'soft',
            modeStorageKey: MODE_KEY,
            brandStorageKey: BRAND_KEY,
            colorStorageKey: COLOR_KEY,
            styleStorageKey: STYLE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);
    service.setColor('amber');
    service.setStyle('brutal');
    service.setBrand('etos');
    TestBed.flushEffects();

    expect(service.brand()).toBe('etos');
    expect(service.color()).toBe('green');
    expect(service.style()).toBe('soft');
    expect(document.documentElement.getAttribute('theme-brand')).toBe('etos');
    expect(document.documentElement.hasAttribute('theme-color')).toBe(false);
    expect(document.documentElement.hasAttribute('theme-style')).toBe(false);
    expect(document.documentElement.dataset['color']).toBeUndefined();
    expect(document.documentElement.dataset['style']).toBeUndefined();
    expect(document.documentElement.dataset['theme']).toBe('etos');
    expect(localStorage.getItem(BRAND_KEY)).toBe('etos');
    expect(localStorage.getItem(COLOR_KEY)).toBeNull();
    expect(localStorage.getItem(STYLE_KEY)).toBeNull();
  });

  it('restores default color and style when the brand is cleared', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_THEME_CONFIG,
          useValue: {
            defaultMode: 'light',
            defaultColor: 'green',
            defaultStyle: 'soft',
            modeStorageKey: MODE_KEY,
            brandStorageKey: BRAND_KEY,
            colorStorageKey: COLOR_KEY,
            styleStorageKey: STYLE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);
    service.setBrand('etos');
    service.setBrand(null);
    TestBed.flushEffects();

    expect(service.brand()).toBeNull();
    expect(service.color()).toBe('green');
    expect(service.style()).toBe('soft');
    expect(document.documentElement.hasAttribute('theme-brand')).toBe(false);
    expect(document.documentElement.getAttribute('theme-color')).toBe('green');
    expect(document.documentElement.getAttribute('theme-style')).toBe('soft');
    expect(document.documentElement.dataset['color']).toBe('green');
    expect(document.documentElement.dataset['style']).toBe('soft');
    expect(document.documentElement.dataset['theme']).toBe('green');
    expect(localStorage.getItem(BRAND_KEY)).toBeNull();
    expect(localStorage.getItem(COLOR_KEY)).toBe('green');
    expect(localStorage.getItem(STYLE_KEY)).toBe('soft');
  });

  it('clears the active brand when setting an explicit color', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_THEME_CONFIG,
          useValue: {
            defaultMode: 'light',
            defaultColor: 'blue',
            defaultStyle: 'default',
            modeStorageKey: MODE_KEY,
            brandStorageKey: BRAND_KEY,
            colorStorageKey: COLOR_KEY,
            styleStorageKey: STYLE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);
    service.setBrand('etos');
    service.setColor('amber');
    TestBed.flushEffects();

    expect(service.brand()).toBeNull();
    expect(service.color()).toBe('amber');
    expect(service.style()).toBe('default');
    expect(document.documentElement.hasAttribute('theme-brand')).toBe(false);
    expect(document.documentElement.getAttribute('theme-color')).toBe('amber');
    expect(document.documentElement.getAttribute('theme-style')).toBe('default');
    expect(localStorage.getItem(BRAND_KEY)).toBeNull();
    expect(localStorage.getItem(COLOR_KEY)).toBe('amber');
    expect(localStorage.getItem(STYLE_KEY)).toBe('default');
  });

  it('keeps scheme and theme aliases working for compatibility', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_THEME_CONFIG,
          useValue: {
            defaultMode: 'light',
            defaultColor: 'blue',
            defaultStyle: 'default',
            modeStorageKey: MODE_KEY,
            brandStorageKey: BRAND_KEY,
            colorStorageKey: COLOR_KEY,
            styleStorageKey: STYLE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);
    service.setScheme('system');
    service.setTheme('green');

    expect(service.scheme()).toBe('system');
    expect(service.color()).toBe('green');
  });

  it('keeps legacy default config keys working for compatibility', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_THEME_CONFIG,
          useValue: {
            defaultMode: 'dark',
            defaultColor: 'green',
            defaultStyle: 'soft',
            brandStorageKey: BRAND_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);

    expect(service.scheme()).toBe('dark');
    expect(service.color()).toBe('green');
    expect(service.style()).toBe('soft');
  });
});
