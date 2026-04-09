import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NG_THEME_CONFIG } from './theme.token';
import {
  LayoutContainer,
  LayoutMode,
  ThemeAppearance,
  ThemeColor,
  ThemeScheme,
} from './theme.types';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private config = inject(NG_THEME_CONFIG);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private key(axis: string): string {
    return `${this.config.storageKey}:${axis}`;
  }

  scheme = signal<ThemeScheme>(this.load('scheme', this.config.defaultScheme));
  color = signal<ThemeColor>(this.load('color', this.config.defaultColor));
  appearance = signal<ThemeAppearance>(this.load('appearance', this.config.defaultAppearance));
  layoutMode = signal<LayoutMode>(this.load('layout-mode', this.config.defaultLayoutMode));
  layoutContainer = signal<LayoutContainer>(
    this.load('layout-container', this.config.defaultLayoutContainer),
  );

  resolvedScheme = computed<'light' | 'dark'>(() => {
    if (this.scheme() !== 'system') return this.scheme() as 'light' | 'dark';
    if (!this.isBrowser) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  constructor() {
    effect(() => {
      if (this.isBrowser) {
        this.applyToDOM();
      }
    });
  }

  setScheme(value: ThemeScheme): void {
    this.persist('scheme', value);
    this.scheme.set(value);
  }

  setColor(value: ThemeColor): void {
    this.persist('color', value);
    this.color.set(value);
  }

  setAppearance(value: ThemeAppearance): void {
    this.persist('appearance', value);
    this.appearance.set(value);
  }

  setLayoutMode(value: LayoutMode): void {
    this.persist('layout-mode', value);
    this.layoutMode.set(value);
  }

  setLayoutContainer(value: LayoutContainer): void {
    this.persist('layout-container', value);
    this.layoutContainer.set(value);
  }

  toggleScheme(): void {
    const next: ThemeScheme = this.scheme() === 'dark' ? 'light' : 'dark';
    this.setScheme(next);
  }

  private applyToDOM(): void {
    const element = document.documentElement;
    element.setAttribute('theme-schemes', this.scheme());
    element.setAttribute('theme-colors', this.color());
    element.setAttribute('theme-appearances', this.appearance());
    element.setAttribute('layout-mode', this.layoutMode());
    element.setAttribute('layout-container', this.layoutContainer());
  }

  private persist(axis: string, value: string): void {
    if (this.isBrowser) localStorage.setItem(this.key(axis), value);
  }

  private load<T extends string>(axis: string, fallback: T): T {
    if (!this.isBrowser) return fallback;
    return (localStorage.getItem(this.key(axis)) as T) ?? fallback;
  }
}