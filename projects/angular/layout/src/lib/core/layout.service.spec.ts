import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LayoutService } from './layout.service';
import { MATERIAL_LAYOUT_CONFIG } from './layout.tokens';

const STORAGE_KEY = 'layout-mode-test';

describe('LayoutService', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('reads the persisted layout mode on startup', () => {
    localStorage.setItem(STORAGE_KEY, 'horizontal');
    TestBed.configureTestingModule({
      providers: [{ provide: MATERIAL_LAYOUT_CONFIG, useValue: { mode: 'vertical', storageKey: STORAGE_KEY } }],
    });

    const service = TestBed.inject(LayoutService);

    expect(service.mode()).toBe('horizontal');
  });

  it('persists layout mode changes', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: MATERIAL_LAYOUT_CONFIG, useValue: { mode: 'vertical', storageKey: STORAGE_KEY } }],
    });

    const service = TestBed.inject(LayoutService);
    service.setMode('horizontal');
    TestBed.flushEffects();

    expect(service.mode()).toBe('horizontal');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('horizontal');
  });

  it('keeps legacy defaultMode config working for compatibility', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: MATERIAL_LAYOUT_CONFIG, useValue: { defaultMode: 'horizontal' } }],
    });

    const service = TestBed.inject(LayoutService);

    expect(service.mode()).toBe('horizontal');
  });
});
