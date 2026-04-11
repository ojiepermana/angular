import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NG_LAYOUT_CONFIG } from './layout.token';
import { LayoutContainer, LayoutMode } from './layout.types';

const STORAGE_KEYS = {
  'layout-mode': 'layout-mode',
  'layout-container': 'layout-container',
} as const;

type LayoutStorageAxis = keyof typeof STORAGE_KEYS;

const LEGACY_STORAGE_PREFIX = 'ng-theme:v2';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly config = inject(NG_LAYOUT_CONFIG);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private key(axis: LayoutStorageAxis): string {
    return STORAGE_KEYS[axis];
  }

  private legacyKey(axis: LayoutStorageAxis): string {
    return `${LEGACY_STORAGE_PREFIX}:${axis}`;
  }

  readonly mode = signal<LayoutMode>(
    this.readStored('layout-mode', this.config.defaultMode, this.isLayoutMode),
  );
  readonly container = signal<LayoutContainer>(
    this.readStored('layout-container', this.config.defaultContainer, this.isLayoutContainer),
  );

  constructor() {
    effect(() => {
      if (this.isBrowser) {
        this.applyToDOM();
      }
    });
  }

  setMode(value: LayoutMode): void {
    this.persist('layout-mode', value);
    this.mode.set(value);
  }

  setContainer(value: LayoutContainer): void {
    this.persist('layout-container', value);
    this.container.set(value);
  }

  private applyToDOM(): void {
    const element = document.documentElement;

    element.dataset['layoutMode'] = this.mode();
    element.dataset['layoutContainer'] = this.container();
  }

  private persist(axis: LayoutStorageAxis, value: string): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(this.key(axis), value);
    localStorage.removeItem(this.legacyKey(axis));
  }

  private readStored<T extends string>(
    axis: LayoutStorageAxis,
    fallback: T,
    isValid: (value: string) => value is T,
  ): T {
    if (!this.isBrowser) {
      return fallback;
    }

    const storedValue = localStorage.getItem(this.key(axis));

    if (storedValue && isValid(storedValue)) {
      return storedValue;
    }

    const legacyValue = localStorage.getItem(this.legacyKey(axis));

    if (legacyValue && isValid(legacyValue)) {
      localStorage.setItem(this.key(axis), legacyValue);
      localStorage.removeItem(this.legacyKey(axis));
      return legacyValue;
    }

    return fallback;
  }

  private isLayoutMode(value: string): value is LayoutMode {
    return value === 'vertical' || value === 'horizontal' || value === 'empty';
  }

  private isLayoutContainer(value: string): value is LayoutContainer {
    return value === 'full' || value === 'boxed';
  }
}
