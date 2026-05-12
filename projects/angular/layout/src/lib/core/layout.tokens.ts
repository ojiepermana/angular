import { InjectionToken } from '@angular/core';

export const LAYOUT_MODES = ['vertical', 'horizontal', 'empty'] as const;

export type LayoutMode = (typeof LAYOUT_MODES)[number];

export const LAYOUT_WIDTHS = ['full', 'container', 'wide'] as const;

export type LayoutWidth = (typeof LAYOUT_WIDTHS)[number];

/** @deprecated Use `container` instead. */
export type LegacyLayoutWidth = 'fixed';

export type ConfiguredLayoutWidth = LayoutWidth | LegacyLayoutWidth;

export interface MaterialLayoutConfig {
  /** Initial layout mode. */
  readonly mode?: LayoutMode;
  /** Initial layout width. */
  readonly width?: ConfiguredLayoutWidth;
  /** @deprecated Use `mode` instead. */
  /** Initial layout mode. Defaults to `vertical`. */
  readonly defaultMode?: LayoutMode;
  /** localStorage key used to persist the layout mode. Set to `null` to disable persistence. */
  readonly storageKey?: string | null;
  /** localStorage key used to persist the layout width. Set to `null` to disable persistence. */
  readonly widthStorageKey?: string | null;
}

export interface ResolvedMaterialLayoutConfig {
  readonly defaultMode: LayoutMode;
  readonly defaultWidth: LayoutWidth;
  readonly storageKey: string | null;
  readonly widthStorageKey: string | null;
}

export const MATERIAL_LAYOUT_CONFIG = new InjectionToken<MaterialLayoutConfig>('MATERIAL_LAYOUT_CONFIG');

export const DEFAULT_MATERIAL_LAYOUT_CONFIG: ResolvedMaterialLayoutConfig = {
  defaultMode: 'vertical',
  defaultWidth: 'wide',
  storageKey: 'layout-mode',
  widthStorageKey: 'layout-width',
};

export function isLayoutMode(value: string | null | undefined): value is LayoutMode {
  return LAYOUT_MODES.some((mode) => mode === value);
}

export function isLayoutWidth(value: string | null | undefined): value is LayoutWidth {
  return LAYOUT_WIDTHS.some((width) => width === value);
}

export function normalizeLayoutWidth(value: string | null | undefined): LayoutWidth | null {
  if (isLayoutWidth(value)) {
    return value;
  }

  if (value === 'fixed') {
    return 'container';
  }

  return null;
}
