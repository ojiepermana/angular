import { TestBed } from '@angular/core/testing';

import { provideNgTheme } from './theme.provider';
import { ThemeService } from './theme.service';

function createMatchMedia(): typeof window.matchMedia {
  return vi.fn().mockImplementation(
    (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as MediaQueryList,
  );
}

function resetRootContract(): void {
  const root = document.documentElement;

  root.classList.remove('dark');
  root.removeAttribute('data-theme-scheme');
  root.removeAttribute('data-theme-color');
  root.removeAttribute('data-theme-appearance');
  root.removeAttribute('data-layout-mode');
  root.removeAttribute('data-layout-container');
  root.style.colorScheme = '';
}

describe('ThemeService', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: createMatchMedia(),
    });

    localStorage.clear();
    resetRootContract();

    TestBed.configureTestingModule({
      providers: [
        provideNgTheme({
          defaultScheme: 'system',
          defaultColor: 'brand',
          defaultAppearance: 'flat',
          defaultLayoutMode: 'vertical',
          defaultLayoutContainer: 'full',
          colors: ['brand', 'green'],
        }),
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    resetRootContract();
  });

  it('applies the runtime contract to the document root', () => {
    const service = TestBed.inject(ThemeService);

    service.setScheme('dark');
    service.setColor('green');
    service.setAppearance('glass');
    service.setLayoutMode('horizontal');
    service.setLayoutContainer('boxed');
    TestBed.flushEffects();

    const root = document.documentElement;

    expect(root.classList.contains('dark')).toBe(true);
    expect(root.dataset['themeScheme']).toBe('dark');
    expect(root.dataset['themeColor']).toBe('green');
    expect(root.dataset['themeAppearance']).toBe('glass');
    expect(root.dataset['layoutMode']).toBe('horizontal');
    expect(root.dataset['layoutContainer']).toBe('boxed');
    expect(root.style.colorScheme).toBe('dark');
  });

  it('limits color options to the configured preset list', () => {
    const service = TestBed.inject(ThemeService);

    expect(service.colorOptions().map((option) => option.value)).toEqual(['brand', 'green']);

    service.setColor('blue');
    TestBed.flushEffects();
    expect(service.color()).toBe('brand');

    service.setColor('green');
    TestBed.flushEffects();
    expect(service.color()).toBe('green');
  });

  it('persists theme state under the flat localStorage keys', () => {
    const service = TestBed.inject(ThemeService);

    service.setScheme('dark');
    service.setColor('green');
    service.setAppearance('glass');
    service.setLayoutMode('horizontal');
    service.setLayoutContainer('boxed');

    expect(localStorage.getItem('theme-scheme')).toBe('dark');
    expect(localStorage.getItem('theme-color')).toBe('green');
    expect(localStorage.getItem('theme-appearance')).toBe('glass');
    expect(localStorage.getItem('layout-mode')).toBe('horizontal');
    expect(localStorage.getItem('layout-container')).toBe('boxed');
  });

  it('migrates legacy versioned localStorage keys to the flat keys', () => {
    localStorage.setItem('ng-theme:v2:scheme', 'dark');
    localStorage.setItem('ng-theme:v2:color', 'green');
    localStorage.setItem('ng-theme:v2:appearance', 'glass');
    localStorage.setItem('ng-theme:v2:layout-mode', 'horizontal');
    localStorage.setItem('ng-theme:v2:layout-container', 'boxed');

    const service = TestBed.inject(ThemeService);

    expect(service.scheme()).toBe('dark');
    expect(service.color()).toBe('green');
    expect(service.appearance()).toBe('glass');
    expect(service.layoutMode()).toBe('horizontal');
    expect(service.layoutContainer()).toBe('boxed');

    expect(localStorage.getItem('theme-scheme')).toBe('dark');
    expect(localStorage.getItem('theme-color')).toBe('green');
    expect(localStorage.getItem('theme-appearance')).toBe('glass');
    expect(localStorage.getItem('layout-mode')).toBe('horizontal');
    expect(localStorage.getItem('layout-container')).toBe('boxed');

    expect(localStorage.getItem('ng-theme:v2:scheme')).toBeNull();
    expect(localStorage.getItem('ng-theme:v2:color')).toBeNull();
    expect(localStorage.getItem('ng-theme:v2:appearance')).toBeNull();
    expect(localStorage.getItem('ng-theme:v2:layout-mode')).toBeNull();
    expect(localStorage.getItem('ng-theme:v2:layout-container')).toBeNull();
  });
});
