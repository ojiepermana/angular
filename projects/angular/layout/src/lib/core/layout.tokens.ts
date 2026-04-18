import { InjectionToken } from '@angular/core';

export const LAYOUT_MODES = ['vertical', 'horizontal'] as const;

export type LayoutMode = (typeof LAYOUT_MODES)[number];

export interface MaterialLayoutConfig {
  /** Initial layout mode. */
  readonly mode?: LayoutMode;
  /** @deprecated Use `mode` instead. */
  /** Initial layout mode. Defaults to `vertical`. */
  readonly defaultMode?: LayoutMode;
  /** localStorage key used to persist the layout mode. Set to `null` to disable persistence. */
  readonly storageKey?: string | null;
}

export interface ResolvedMaterialLayoutConfig {
  readonly defaultMode: LayoutMode;
  readonly storageKey: string | null;
}

export const MATERIAL_LAYOUT_CONFIG = new InjectionToken<MaterialLayoutConfig>('MATERIAL_LAYOUT_CONFIG');

export const DEFAULT_MATERIAL_LAYOUT_CONFIG: ResolvedMaterialLayoutConfig = {
  defaultMode: 'vertical',
  storageKey: 'layout-mode',
};
