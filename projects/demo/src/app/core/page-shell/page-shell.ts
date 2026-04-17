import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NavigationService, type NavigationItem } from '@ojiepermana/material/navigation';

/**
 * Page wrapper (demo-only) — consistent padding, max-width, title, and
 * description. Uses `NavigationService.activeTrail` to derive breadcrumbs
 * automatically when caller does not pass explicit `title`.
 */
@Component({
  selector: 'demo-page-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full overflow-y-auto' },
  template: `
    <div class="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
      <header class="mb-8 flex flex-col gap-2">
        @if (crumbs().length > 0) {
          <nav class="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground" aria-label="breadcrumb">
            @for (c of crumbs(); track c.id; let last = $last) {
              <span [class.text-foreground]="last" [class.font-medium]="last">{{ c.title }}</span>
              @if (!last) {
                <span aria-hidden="true">/</span>
              }
            }
          </nav>
        }
        <h1 class="text-3xl font-bold tracking-tight text-foreground">{{ displayTitle() }}</h1>
        @if (description()) {
          <p class="max-w-prose text-sm text-muted-foreground">{{ description() }}</p>
        }
        <ng-content select="[demo-page-actions]" />
      </header>
      <ng-content />
    </div>
  `,
})
export class PageShellComponent {
  private readonly nav = inject(NavigationService);

  readonly title = input<string>('');
  readonly description = input<string>('');

  private readonly activeItems = computed<NavigationItem[]>(() => {
    const trail = this.nav.activeTrail();
    const flat: NavigationItem[] = [];
    const walk = (list: readonly NavigationItem[]) => {
      for (const item of list) {
        if (item.id && trail.has(item.id)) flat.push(item);
        const children = 'children' in item ? (item.children ?? []) : [];
        if (children.length) walk(children);
      }
    };
    walk(this.nav.items());
    return flat;
  });

  protected readonly crumbs = computed(() => this.activeItems().map((i) => ({ id: i.id ?? '', title: i.title ?? '' })));

  protected readonly displayTitle = computed(() => {
    if (this.title()) return this.title();
    const trail = this.activeItems();
    return trail.length > 0 ? (trail[trail.length - 1].title ?? 'Page') : 'Page';
  });
}
