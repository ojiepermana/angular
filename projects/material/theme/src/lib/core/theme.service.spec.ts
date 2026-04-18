import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeService } from './theme.service';
import { MATERIAL_THEME_CONFIG } from './theme.tokens';

const SCHEME_KEY = 'theme-scheme-test';
const PALETTE_KEY = 'theme-palette-test';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.removeItem(SCHEME_KEY);
    localStorage.removeItem(PALETTE_KEY);
    document.documentElement.classList.remove('dark');
    delete document.documentElement.dataset['theme'];
  });

  it('reads persisted scheme and palette on startup', () => {
    localStorage.setItem(SCHEME_KEY, 'dark');
    localStorage.setItem(PALETTE_KEY, 'zinc');

    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_THEME_CONFIG,
          useValue: {
            defaultScheme: 'light',
            defaultTheme: 'neutral',
            schemeStorageKey: SCHEME_KEY,
            themeStorageKey: PALETTE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);

    expect(service.scheme()).toBe('dark');
    expect(service.theme()).toBe('zinc');
    expect(service.isDark()).toBe(true);
  });

  it('persists scheme and palette updates to the document and localStorage', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_THEME_CONFIG,
          useValue: {
            defaultScheme: 'light',
            defaultTheme: 'neutral',
            schemeStorageKey: SCHEME_KEY,
            themeStorageKey: PALETTE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(ThemeService);
    service.setScheme('dark');
    service.setTheme('stone');

    expect(localStorage.getItem(SCHEME_KEY)).toBe('dark');
    expect(localStorage.getItem(PALETTE_KEY)).toBe('stone');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.dataset['theme']).toBe('stone');
  });
});
