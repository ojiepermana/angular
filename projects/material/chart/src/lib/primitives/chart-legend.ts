import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ChartContext } from '../core/chart-context';
import { seriesColorVar } from '../core/chart-config';

/**
 * Legend — renders a list of series swatches. Clicking an item toggles
 * visibility via `ChartContext.toggleSeries`.
 *
 * Place as a child of `<ui-chart-container>`:
 * ```html
 * <ui-chart-container [config]="cfg">
 *   <ui-bar-chart ... />
 *   <ui-chart-legend />
 * </ui-chart-container>
 * ```
 */
@Component({
  selector: 'ui-chart-legend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block pt-3' },
  template: `
    <ul class="flex flex-wrap items-center justify-center gap-3 text-xs" aria-label="Toggle chart series visibility">
      @for (item of items(); track item.seriesKey) {
        <li>
          <button
            type="button"
            class="inline-flex min-h-11 items-center gap-2 rounded-md px-2.5 py-1.5 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            [class.opacity-50]="item.hidden"
            [attr.aria-pressed]="!item.hidden"
            [attr.aria-label]="(item.hidden ? 'Show ' : 'Hide ') + item.label"
            (click)="toggle(item.seriesKey)">
            <span class="inline-block h-2.5 w-2.5 rounded-sm" [style.background]="item.color"></span>
            <span class="text-muted-foreground">{{ item.label }}</span>
          </button>
        </li>
      }
    </ul>
  `,
})
export class ChartLegend {
  private readonly root = inject(ChartContext);

  protected readonly items = computed(() => {
    const cfg = this.root.config();
    const hidden = this.root.hiddenSeries();
    return this.root.seriesKeys().map((key) => ({
      seriesKey: key,
      label: cfg[key]?.label ?? key,
      color: seriesColorVar(key),
      hidden: hidden.has(key),
    }));
  });

  protected toggle(key: string): void {
    this.root.toggleSeries(key);
  }
}
