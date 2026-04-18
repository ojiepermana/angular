import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeService } from './theme.service';
import { MATERIAL_THEME_CONFIG } from './theme.tokens';

const MODE_KEY = 'theme-mode-test';
const COLOR_KEY = 'theme-color-test';
const STYLE_KEY = 'theme-style-test';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.removeItem(MODE_KEY);
    localStorage.removeItem(COLOR_KEY);
    localStorage.removeItem(STYLE_KEY);
    document.documentElement.classList.remove('dark');
    delete document.documentElement.dataset['mode'];
    delete document.documentElement.dataset['color'];
    delete document.documentElement.dataset['style'];
    delete document.documentElement.dataset['theme'];
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
            colorStorageKey: COLOR_KEY,
            styleStorageKey: STYLE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);

    expect(service.scheme()).toBe('dark');
    expect(service.mode()).toBe('dark');
    expect(service.color()).toBe('purple');
    expect(service.style()).toBe('soft');
    expect(service.isDark()).toBe(true);
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
    expect(localStorage.getItem(COLOR_KEY)).toBe('amber');
    expect(localStorage.getItem(STYLE_KEY)).toBe('brutal');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.dataset['mode']).toBe('dark');
    expect(document.documentElement.dataset['color']).toBe('amber');
    expect(document.documentElement.dataset['style']).toBe('brutal');
    expect(document.documentElement.dataset['theme']).toBe('amber');
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
