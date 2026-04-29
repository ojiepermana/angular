import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { DestroyRef } from '@angular/core';
import type { NavigationItem, SidebarAppearance } from '../types/navigation.type';

/** Default registry key used when no id is specified. */
export const DEFAULT_NAVIGATION_ID = 'main';
const SIDEBAR_APPEARANCE_STORAGE_KEY = 'sidebar-appearance';

function isSidebarAppearance(value: string | null | undefined): value is SidebarAppearance {
  return value === 'default' || value === 'thin';
}

/**
 * Signal-based global state untuk navigation (sidebar/topbar).
 *
 * Items disimpan dalam registry ber-key. Key default adalah `'main'`.
 * Komponen `ui-sidebar` / `ui-topbar` memilih registry via input `navigationId`.
 */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly persistedSidebarAppearance = this.readPersistedSidebarAppearance();

  /** Internal version counter — incremented on every registry mutation. */
  private readonly _version = signal(0);

  /** Internal map of registered navigation trees. */
  private readonly _registry = new Map<string, NavigationItem[]>();
  private readonly _sidebarAppearance = signal<SidebarAppearance>(this.persistedSidebarAppearance ?? 'default');
  private readonly _hasStoredSidebarAppearance = signal(this.persistedSidebarAppearance !== null);

  /**
   * Backward-compatible accessor — returns items for the default (`'main'`) key.
   * Prefer `getItems(id)` when working with named registries.
   */
  readonly items = computed(() => this.getItems(DEFAULT_NAVIGATION_ID)());

  /** Sidebar appearance preference (`default` or `thin`). */
  readonly sidebarAppearance = this._sidebarAppearance.asReadonly();
  readonly hasStoredSidebarAppearance = this._hasStoredSidebarAppearance.asReadonly();

  /** Sidebar collapsed (default ↔ thin) toggle untuk desktop. */
  readonly collapsed = computed(() => this._sidebarAppearance() === 'thin');

  /** Sheet drawer terbuka di mobile. */
  readonly mobileOpen = signal<boolean>(false);

  /** Set id grup / collapsable yang sedang terbuka. */
  readonly openGroups = signal<ReadonlySet<string>>(new Set<string>());

  /** URL aktif terakhir. Update otomatis dari Router `NavigationEnd`. */
  readonly activeUrl = signal<string>(this.router.url);

  /** Trail id item yang sedang match dengan URL aktif (across ALL registries). */
  readonly activeTrail = computed<ReadonlySet<string>>(() => {
    this._version(); // track changes
    const url = this.activeUrl();
    const trail = new Set<string>();
    const walk = (list: readonly NavigationItem[], ancestors: string[]): boolean => {
      let matched = false;
      for (const item of list) {
        const id = item.id;
        const link = 'link' in item ? item.link : undefined;
        let selfMatch = false;
        if (link) {
          selfMatch = url === link || url.startsWith(link + '/') || url.startsWith(link + '?');
        }
        const children = 'children' in item ? (item.children ?? []) : [];
        const nextAncestors = id ? [...ancestors, id] : ancestors;
        const childMatch = children.length > 0 && walk(children, nextAncestors);
        if (selfMatch || childMatch) {
          if (id) trail.add(id);
          for (const a of ancestors) trail.add(a);
          matched = true;
        }
      }
      return matched;
    };
    for (const items of this._registry.values()) {
      walk(items, []);
    }
    return trail;
  });

  constructor() {
    effect(() => {
      if (!this._hasStoredSidebarAppearance()) {
        return;
      }

      this.persistSidebarAppearance(this._sidebarAppearance());
    });

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => this.activeUrl.set(e.urlAfterRedirects));
  }

  /**
   * Register items di registry.
   *
   * Overload:
   * - `registerItems(items)` → key `'main'`
   * - `registerItems(id, items)` → key spesifik
   */
  registerItems(items: NavigationItem[]): void;
  registerItems(id: string, items: NavigationItem[]): void;
  registerItems(idOrItems: string | NavigationItem[], maybeItems?: NavigationItem[]): void {
    const [id, items] = typeof idOrItems === 'string' ? [idOrItems, maybeItems!] : [DEFAULT_NAVIGATION_ID, idOrItems];
    this._registry.set(id, items);
    this._version.update((v) => v + 1);
  }

  /** Remove a named registry entry. */
  removeItems(id: string): void {
    this._registry.delete(id);
    this._version.update((v) => v + 1);
  }

  /**
   * Computed yang mengembalikan items untuk key tertentu.
   * Reactive terhadap perubahan registry.
   */
  getItems(id: string): () => readonly NavigationItem[] {
    return computed(() => {
      this._version(); // track changes
      return this._registry.get(id) ?? [];
    });
  }

  setSidebarAppearance(value: SidebarAppearance): void {
    this._sidebarAppearance.set(value);
    this._hasStoredSidebarAppearance.set(true);
  }

  toggleSidebarAppearance(currentAppearance: SidebarAppearance = this._sidebarAppearance()): void {
    this.setSidebarAppearance(currentAppearance === 'thin' ? 'default' : 'thin');
  }

  /** Toggle sidebar collapsed (default ↔ thin). */
  toggleCollapsed(): void {
    this.toggleSidebarAppearance();
  }

  setCollapsed(value: boolean): void {
    this.setSidebarAppearance(value ? 'thin' : 'default');
  }

  openMobile(): void {
    this.mobileOpen.set(true);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  isGroupOpen(id: string): boolean {
    return this.openGroups().has(id);
  }

  toggleGroup(id: string): void {
    const next = new Set(this.openGroups());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.openGroups.set(next);
  }

  setGroupOpen(id: string, open: boolean): void {
    const next = new Set(this.openGroups());
    if (open) next.add(id);
    else next.delete(id);
    this.openGroups.set(next);
  }

  /** Apakah id termasuk dalam active trail saat ini. */
  isActive(id: string | undefined): boolean {
    return !!id && this.activeTrail().has(id);
  }

  private readPersistedSidebarAppearance(): SidebarAppearance | null {
    try {
      const value = this.doc.defaultView?.localStorage?.getItem(SIDEBAR_APPEARANCE_STORAGE_KEY);
      return isSidebarAppearance(value) ? value : null;
    } catch {
      return null;
    }
  }

  private persistSidebarAppearance(value: SidebarAppearance): void {
    try {
      this.doc.defaultView?.localStorage?.setItem(SIDEBAR_APPEARANCE_STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  }
}
