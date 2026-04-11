import { TestBed } from '@angular/core/testing';
import { provideNgLayout } from './layout.provider';
import { LayoutService } from './layout.service';

function resetRootContract(): void {
  const root = document.documentElement;

  root.removeAttribute('data-layout-mode');
  root.removeAttribute('data-layout-container');
}

describe('LayoutService', () => {
  beforeEach(() => {
    localStorage.clear();
    resetRootContract();

    TestBed.configureTestingModule({
      providers: [
        provideNgLayout({
          defaultMode: 'vertical',
          defaultContainer: 'full',
        }),
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    resetRootContract();
  });

  it('applies the layout runtime contract to the document root', () => {
    const service = TestBed.inject(LayoutService);

    service.setMode('horizontal');
    service.setContainer('boxed');
    TestBed.flushEffects();

    const root = document.documentElement;

    expect(root.dataset['layoutMode']).toBe('horizontal');
    expect(root.dataset['layoutContainer']).toBe('boxed');
  });

  it('persists layout state under the flat localStorage keys', () => {
    const service = TestBed.inject(LayoutService);

    service.setMode('horizontal');
    service.setContainer('boxed');

    expect(localStorage.getItem('layout-mode')).toBe('horizontal');
    expect(localStorage.getItem('layout-container')).toBe('boxed');
  });

  it('migrates legacy versioned localStorage keys to the flat keys', () => {
    localStorage.setItem('ng-theme:v2:layout-mode', 'horizontal');
    localStorage.setItem('ng-theme:v2:layout-container', 'boxed');

    const service = TestBed.inject(LayoutService);

    expect(service.mode()).toBe('horizontal');
    expect(service.container()).toBe('boxed');
    expect(localStorage.getItem('layout-mode')).toBe('horizontal');
    expect(localStorage.getItem('layout-container')).toBe('boxed');
    expect(localStorage.getItem('ng-theme:v2:layout-mode')).toBeNull();
    expect(localStorage.getItem('ng-theme:v2:layout-container')).toBeNull();
  });
});
