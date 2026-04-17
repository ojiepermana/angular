import { IsActiveMatchOptions, Params, QueryParamsHandling } from '@angular/router';

export type NavigationItemType =
  | 'aside'
  | 'basic'
  | 'collapsable'
  | 'divider'
  | 'group'
  | 'mega'
  | 'spacer';

export interface NavigationItemClasses {
  title?: string;
  subtitle?: string;
  icon?: string;
  wrapper?: string;
}

export interface NavigationItemBadge {
  title?: string;
  classes?: string;
}

export type NavigationVisibilityHandler = (item: NavigationItem) => boolean;
export type NavigationActionHandler = (item: NavigationItem) => void;

export interface NavigationItemBase {
  /** Unique identifier untuk item navigasi */
  id?: string;

  /** Judul/label yang ditampilkan */
  title?: string;

  /** Subtitle/deskripsi tambahan */
  subtitle?: string;

  /** Status aktif item */
  active?: boolean;

  /** Status disabled item */
  disabled?: boolean;

  /** Tooltip text saat hover */
  tooltip?: string;

  /** Custom CSS classes */
  classes?: NavigationItemClasses;

  /** Material Symbols icon name (ligature, e.g. `dashboard`, `menu_book`) */
  icon?: string;

  /** Badge configuration */
  badge?: NavigationItemBadge;

  /** Additional metadata */
  meta?: Record<string, unknown>;

  /** Function untuk hide/show item secara dinamis */
  isHidden?: NavigationVisibilityHandler;
}

export interface NavigationRoutableItemBase extends NavigationItemBase {
  /** Angular router link */
  link?: string;

  /** URL fragment (#anchor) */
  fragment?: string;

  /** Preserve fragment saat navigasi */
  preserveFragment?: boolean;

  /** Query parameters untuk routing */
  queryParams?: Params | null;

  /** Cara handle query params */
  queryParamsHandling?: QueryParamsHandling | null;

  /** Flag untuk external link */
  externalLink?: boolean;

  /** Target untuk external link */
  target?: '_blank' | '_self' | '_parent' | '_top' | string;

  /** Exact match untuk active route */
  exactMatch?: boolean;

  /** Options untuk active match detection */
  isActiveMatchOptions?: IsActiveMatchOptions;

  /** Custom action yang dipanggil saat item diklik */
  action?: NavigationActionHandler;
}

export interface NavigationBasicItem extends NavigationRoutableItemBase {
  type: 'basic';
  children?: never;
}

export interface NavigationAsideItem extends NavigationRoutableItemBase {
  type: 'aside';
  children: NavigationItem[];
}

export interface NavigationCollapsableItem extends NavigationRoutableItemBase {
  type: 'collapsable';
  children: NavigationItem[];
}

export interface NavigationGroupItem extends NavigationItemBase {
  type: 'group';
  children: NavigationItem[];
}

/**
 * Mega menu branch — dirender sebagai panel full-width multi-kolom pada topbar.
 * Children biasanya berupa `NavigationGroupItem` (per kolom) berisi `basic` items.
 */
export interface NavigationMegaItem extends NavigationItemBase {
  type: 'mega';
  /** Jumlah kolom saat viewport >= md (default: 4) */
  columns?: number;
  children: NavigationItem[];
}

export interface NavigationDividerItem extends NavigationItemBase {
  type: 'divider';
  children?: never;
}

export interface NavigationSpacerItem extends NavigationItemBase {
  type: 'spacer';
  children?: never;
}

export type NavigationBranchItem =
  | NavigationAsideItem
  | NavigationCollapsableItem
  | NavigationGroupItem
  | NavigationMegaItem;

export type NavigationLeafItem = NavigationBasicItem | NavigationDividerItem | NavigationSpacerItem;

export type NavigationItem = NavigationBranchItem | NavigationLeafItem;

/**
 * Navigation Item Interface
 *
 * Interface ini mendefinisikan struktur data untuk setiap item navigasi
 * Mendukung berbagai tipe item dan konfigurasi routing Angular
 */
export type NavigationStructuredItem = NavigationItem;

/**
 * Sidebar Appearance
 * - default: full width (lebar penuh) dengan label + icon
 * - thin: icon-only, expand overlay saat hover
 */
export type SidebarAppearance = 'default' | 'thin';

/**
 * Topbar Appearance
 * - default: horizontal dengan dropdown untuk collapsable
 * - megamenu: full-width panel multi-kolom untuk item `mega`
 */
export type TopbarAppearance = 'default' | 'megamenu';

/** Sidebar position */
export type SidebarPosition = 'left' | 'right';

/** Sidebar display mode */
export type SidebarMode = 'over' | 'side';

/* ------------------------------------------------------------------ */
/* Backward-compat aliases (sebelumnya bernama VerticalNavigation*)    */
/* ------------------------------------------------------------------ */
export type VerticalNavigationAppearance = SidebarAppearance;
export type VerticalNavigationMode = SidebarMode;
export type VerticalNavigationPosition = SidebarPosition;
