import { Injectable, computed, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { DestroyRef } from '@angular/core';
import type { NavigationItem } from '../types/navigation.type';

/**
 * Signal-based global state untuk navigation (sidebar/topbar).
 * Providedn in root; komponen `ui-sidebar` / `ui-topbar` bisa membaca/menulis
 * state tanpa binding manual dari consumer.
 */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** Items terdaftar (untuk lookup active trail). Optional; komponen juga bisa
   *  pakai input lokal tanpa harus register ke service. */
  readonly items = signal<NavigationItem[]>([]);

  /** Sidebar collapsed (default ↔ thin) toggle untuk desktop. */
  readonly collapsed = signal<boolean>(false);

  /** Sheet drawer terbuka di mobile. */
  readonly mobileOpen = signal<boolean>(false);

  /** Set id grup / collapsable yang sedang terbuka. */
  readonly openGroups = signal<ReadonlySet<string>>(new Set<string>());

  /** URL aktif terakhir. Update otomatis dari Router `NavigationEnd`. */
  readonly activeUrl = signal<string>(this.router.url);

  /** Trail id item yang sedang match dengan URL aktif. */
  readonly activeTrail = computed<ReadonlySet<string>>(() => {
    const url = this.activeUrl();
    const trail = new Set<string>();
    const walk = (list: readonly NavigationItem[], ancestors: string[]): boolean => {
      let matched = false;
      for (const item of list) {
        const id = item.id ?? '';
        const link = 'link' in item ? item.link : undefined;
        let selfMatch = false;
        if (link) {
          selfMatch = url === link || url.startsWith(link + '/') || url.startsWith(link + '?');
        }
        const children = 'children' in item ? (item.children ?? []) : [];
        const childMatch = children.length > 0 && walk(children, [...ancestors, id]);
        if (selfMatch || childMatch) {
          trail.add(id);
          for (const a of ancestors) trail.add(a);
          matched = true;
        }
      }
      return matched;
    };
    walk(this.items(), []);
    return trail;
  });

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => this.activeUrl.set(e.urlAfterRedirects));
  }

  /** Register daftar items global (mis. dari app shell). */
  registerItems(items: NavigationItem[]): void {
    this.items.set(items);
  }

  /** Toggle sidebar collapsed (default ↔ thin). */
  toggleCollapsed(): void {
    this.collapsed.update((v) => !v);
  }

  setCollapsed(value: boolean): void {
    this.collapsed.set(value);
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
}
