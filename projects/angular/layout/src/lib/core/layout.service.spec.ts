import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LayoutService } from './layout.service';
import { MATERIAL_LAYOUT_CONFIG } from './layout.tokens';

const MODE_STORAGE_KEY = 'layout-mode-test';
const WIDTH_STORAGE_KEY = 'layout-width-test';

describe('LayoutService', () => {
  beforeEach(() => {
    localStorage.removeItem('layout-mode');
    localStorage.removeItem('layout-width');
    localStorage.removeItem(MODE_STORAGE_KEY);
    localStorage.removeItem(WIDTH_STORAGE_KEY);
  });

  it('reads the persisted layout preferences on startup', () => {
    localStorage.setItem(MODE_STORAGE_KEY, 'horizontal');
    localStorage.setItem(WIDTH_STORAGE_KEY, 'full');
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_LAYOUT_CONFIG,
          useValue: {
            mode: 'vertical',
            width: 'container',
            storageKey: MODE_STORAGE_KEY,
            widthStorageKey: WIDTH_STORAGE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(LayoutService);

    expect(service.mode()).toBe('horizontal');
    expect(service.width()).toBe('full');
  });

  it('persists layout preference changes', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_LAYOUT_CONFIG,
          useValue: {
            mode: 'vertical',
            width: 'container',
            storageKey: MODE_STORAGE_KEY,
            widthStorageKey: WIDTH_STORAGE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(LayoutService);
    service.setMode('horizontal');
    service.setWidth('full');
    TestBed.flushEffects();

    expect(service.mode()).toBe('horizontal');
    expect(service.width()).toBe('full');
    expect(localStorage.getItem(MODE_STORAGE_KEY)).toBe('horizontal');
    expect(localStorage.getItem(WIDTH_STORAGE_KEY)).toBe('full');
  });

  it('defaults layout width to wide and persists it', () => {
    TestBed.configureTestingModule({});

    const service = TestBed.inject(LayoutService);

    expect(service.width()).toBe('wide');

    TestBed.flushEffects();

    expect(localStorage.getItem('layout-width')).toBe('wide');
  });

  it('maps persisted legacy fixed width to container and rewrites storage', () => {
    localStorage.setItem(WIDTH_STORAGE_KEY, 'fixed');
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_LAYOUT_CONFIG,
          useValue: {
            mode: 'vertical',
            storageKey: MODE_STORAGE_KEY,
            widthStorageKey: WIDTH_STORAGE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(LayoutService);

    expect(service.width()).toBe('container');

    TestBed.flushEffects();

    expect(localStorage.getItem(WIDTH_STORAGE_KEY)).toBe('container');
  });

  it('cycles layout width through wide, full, and container', () => {
    TestBed.configureTestingModule({});

    const service = TestBed.inject(LayoutService);

    expect(service.width()).toBe('wide');

    service.toggleWidth();
    expect(service.width()).toBe('full');

    service.toggleWidth();
    expect(service.width()).toBe('container');

    service.toggleWidth();
    expect(service.width()).toBe('wide');
  });

  it('supports empty layout mode from persistence and explicit updates', () => {
    localStorage.setItem(MODE_STORAGE_KEY, 'empty');
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MATERIAL_LAYOUT_CONFIG,
          useValue: {
            mode: 'vertical',
            storageKey: MODE_STORAGE_KEY,
          },
        },
      ],
    });

    const service = TestBed.inject(LayoutService);

    expect(service.mode()).toBe('empty');

    service.setMode('empty');
    TestBed.flushEffects();

    expect(localStorage.getItem(MODE_STORAGE_KEY)).toBe('empty');
  });

  it('keeps legacy defaultMode config working for compatibility', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: MATERIAL_LAYOUT_CONFIG, useValue: { defaultMode: 'horizontal' } }],
    });

    const service = TestBed.inject(LayoutService);

    expect(service.mode()).toBe('horizontal');
  });

  it('applies configured layout width when provided', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: MATERIAL_LAYOUT_CONFIG, useValue: { width: 'wide' } }],
    });

    const service = TestBed.inject(LayoutService);

    expect(service.width()).toBe('wide');
  });
});
