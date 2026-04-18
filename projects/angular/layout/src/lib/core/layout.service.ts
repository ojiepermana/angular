import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';
import {
  DEFAULT_MATERIAL_LAYOUT_CONFIG,
  LAYOUT_MODES,
  MATERIAL_LAYOUT_CONFIG,
  type LayoutMode,
  type ResolvedMaterialLayoutConfig,
} from './layout.tokens';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly document = inject(DOCUMENT);
  private readonly config = this.resolveConfig();

  private readonly _mode = signal<LayoutMode>(this.readPersistedMode() ?? this.config.defaultMode);

  readonly mode = this._mode.asReadonly();

  constructor() {
    effect(() => {
      this.persistMode(this._mode());
    });
  }

  setMode(mode: LayoutMode): void {
    this._mode.set(mode);
  }

  toggleMode(): void {
    this._mode.update((mode) => (mode === 'vertical' ? 'horizontal' : 'vertical'));
  }

  private resolveConfig(): ResolvedMaterialLayoutConfig {
    const config = inject(MATERIAL_LAYOUT_CONFIG, { optional: true }) ?? {};
    return {
      defaultMode: config.mode ?? config.defaultMode ?? DEFAULT_MATERIAL_LAYOUT_CONFIG.defaultMode,
      storageKey: config.storageKey ?? DEFAULT_MATERIAL_LAYOUT_CONFIG.storageKey,
    };
  }

  private readPersistedMode(): LayoutMode | null {
    const key = this.config.storageKey;
    if (!key) return null;
    try {
      const value = this.document.defaultView?.localStorage?.getItem(key);
      return LAYOUT_MODES.some((mode) => mode === value) ? (value as LayoutMode) : null;
    } catch {
      return null;
    }
  }

  private persistMode(mode: LayoutMode): void {
    const key = this.config.storageKey;
    if (!key) return;
    try {
      this.document.defaultView?.localStorage?.setItem(key, mode);
    } catch {
      /* ignore */
    }
  }
}
