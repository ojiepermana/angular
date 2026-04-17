import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { cn } from '../../core/cn/cn.util';
import { buttonVariants } from '../button/button.variants';

/**
 * Simple pagination. Emits the desired page via `(pageChange)` and reflects
 * the current page through the `page` model input.
 */
@Component({
  selector: 'ui-pagination, nav[ui-pagination]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'navigation',
    'aria-label': 'pagination',
    '[class]': 'classes()',
  },
  template: `
    <ul class="flex flex-row items-center gap-1">
      <li>
        <button
          type="button"
          [disabled]="page() <= 1 || null"
          [attr.aria-label]="'Go to previous page'"
          [class]="navClasses()"
          (click)="go(page() - 1)"
        >
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Previous</span>
        </button>
      </li>

      @for (p of pages(); track p.key) {
        <li>
          @if (p.kind === 'page') {
            <button
              type="button"
              [attr.aria-current]="p.value === page() ? 'page' : null"
              [class]="pageClasses(p.value === page())"
              (click)="go(p.value)"
            >
              {{ p.value }}
            </button>
          } @else {
            <span class="flex h-9 w-9 items-center justify-center" aria-hidden="true">…</span>
          }
        </li>
      }

      <li>
        <button
          type="button"
          [disabled]="page() >= total() || null"
          [attr.aria-label]="'Go to next page'"
          [class]="navClasses()"
          (click)="go(page() + 1)"
        >
          <span>Next</span>
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </li>
    </ul>
  `,
})
export class PaginationComponent {
  readonly page = model<number>(1);
  readonly total = input<number>(1);
  /** Number of sibling pages on each side of current. */
  readonly siblingCount = input<number>(1);
  readonly class = input<string>('');

  readonly pageChange = output<number>();

  protected readonly classes = computed(() =>
    cn('mx-auto flex w-full justify-center', this.class()),
  );

  protected readonly pages = computed(() => {
    const total = Math.max(1, this.total());
    const current = Math.min(Math.max(1, this.page()), total);
    const siblings = Math.max(0, this.siblingCount());
    const range: Array<{ key: string; kind: 'page' | 'ellipsis'; value: number }> = [];
    const start = Math.max(2, current - siblings);
    const end = Math.min(total - 1, current + siblings);

    range.push({ key: 'p-1', kind: 'page', value: 1 });
    if (start > 2) range.push({ key: 'e-start', kind: 'ellipsis', value: -1 });
    for (let i = start; i <= end; i++) range.push({ key: `p-${i}`, kind: 'page', value: i });
    if (end < total - 1) range.push({ key: 'e-end', kind: 'ellipsis', value: -1 });
    if (total > 1) range.push({ key: `p-${total}`, kind: 'page', value: total });
    return range;
  });

  protected navClasses(): string {
    return cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-1 pl-2.5 pr-2.5');
  }

  protected pageClasses(active: boolean): string {
    return cn(buttonVariants({ variant: active ? 'outline' : 'ghost', size: 'icon' }), 'h-9 w-9');
  }

  protected go(target: number): void {
    const total = Math.max(1, this.total());
    const next = Math.min(Math.max(1, target), total);
    if (next === this.page()) return;
    this.page.set(next);
    this.pageChange.emit(next);
  }
}
