import { Injectable, inject, signal, effect, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NG_THEME_CONFIG } from './theme.token';
import {
  ThemeScheme,
  ThemeColor,
  ThemeAppearance,
  LayoutMode,
  LayoutContainer,
} from './theme.types';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private config = inject(NG_THEME_CONFIG);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private key(axis: string): string {
    return `${this.config.storageKey}:${axis}`;
  }

  // ── Signals ──────────────────────────────────────────────
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

  // ── Setters ──────────────────────────────────────────────
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

  // ── Private ──────────────────────────────────────────────
  private applyToDOM(): void {
    const el = document.documentElement;
    el.setAttribute('theme-schemes', this.scheme());
    el.setAttribute('theme-colors', this.color());
    el.setAttribute('theme-appearances', this.appearance());
    el.setAttribute('layout-mode', this.layoutMode());
    el.setAttribute('layout-container', this.layoutContainer());
  }

  private persist(axis: string, value: string): void {
    if (this.isBrowser) localStorage.setItem(this.key(axis), value);
  }

  private load<T extends string>(axis: string, fallback: T): T {
    if (!this.isBrowser) return fallback;
    return (localStorage.getItem(this.key(axis)) as T) ?? fallback;
  }
}
