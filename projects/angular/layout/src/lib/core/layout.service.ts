import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';
import {
  DEFAULT_MATERIAL_LAYOUT_CONFIG,
  MATERIAL_LAYOUT_CONFIG,
  isLayoutMode,
  isLayoutWidth,
  type LayoutMode,
  type LayoutWidth,
  type ResolvedMaterialLayoutConfig,
} from './layout.tokens';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly document = inject(DOCUMENT);
  private readonly config = this.resolveConfig();

  private readonly _mode = signal<LayoutMode>(this.readPersistedMode() ?? this.config.defaultMode);
  private readonly _width = signal<LayoutWidth>(this.readPersistedWidth() ?? this.config.defaultWidth);

  readonly mode = this._mode.asReadonly();
  readonly width = this._width.asReadonly();

  constructor() {
    effect(() => {
      this.persistMode(this._mode());
    });

    effect(() => {
      this.persistWidth(this._width());
    });
  }

  setMode(mode: LayoutMode): void {
    this._mode.set(mode);
  }

  toggleMode(): void {
    this._mode.update((mode) => (mode === 'vertical' ? 'horizontal' : 'vertical'));
  }

  setWidth(width: LayoutWidth): void {
    this._width.set(width);
  }

  toggleWidth(): void {
    this._width.update((width) => (width === 'fixed' ? 'full' : 'fixed'));
  }

  private resolveConfig(): ResolvedMaterialLayoutConfig {
    const config = inject(MATERIAL_LAYOUT_CONFIG, { optional: true }) ?? {};
    const configuredMode = config.mode ?? config.defaultMode;
    const configuredWidth = config.width;

    return {
      defaultMode: isLayoutMode(configuredMode) ? configuredMode : DEFAULT_MATERIAL_LAYOUT_CONFIG.defaultMode,
      defaultWidth: isLayoutWidth(configuredWidth) ? configuredWidth : DEFAULT_MATERIAL_LAYOUT_CONFIG.defaultWidth,
      storageKey: config.storageKey ?? DEFAULT_MATERIAL_LAYOUT_CONFIG.storageKey,
      widthStorageKey: config.widthStorageKey ?? DEFAULT_MATERIAL_LAYOUT_CONFIG.widthStorageKey,
    };
  }

  private readPersistedMode(): LayoutMode | null {
    const key = this.config.storageKey;
    if (!key) return null;
    try {
      const value = this.document.defaultView?.localStorage?.getItem(key);
      return isLayoutMode(value) ? value : null;
    } catch {
      return null;
    }
  }

  private readPersistedWidth(): LayoutWidth | null {
    const key = this.config.widthStorageKey;
    if (!key) return null;
    try {
      const value = this.document.defaultView?.localStorage?.getItem(key);
      return isLayoutWidth(value) ? value : null;
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

  private persistWidth(width: LayoutWidth): void {
    const key = this.config.widthStorageKey;
    if (!key) return;
    try {
      this.document.defaultView?.localStorage?.setItem(key, width);
    } catch {
      /* ignore */
    }
  }
}
