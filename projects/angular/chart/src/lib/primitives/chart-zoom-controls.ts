import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CategoricalViewportContext } from '../core/categorical-viewport-context';
import { ScatterViewportContext } from '../core/scatter-viewport-context';

function formatNumber(value: number): string {
  return Math.abs(value) >= 10 ? value.toFixed(0) : value.toFixed(1);
}

@Component({
  selector: 'ui-chart-zoom-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground' },
  template: `
    <p>{{ hint() }}</p>

    @if (status(); as currentStatus) {
      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-full border border-border bg-background px-2.5 py-1 font-medium text-foreground">
          {{ currentStatus }}
        </span>
        <button
          type="button"
          class="inline-flex min-h-11 items-center rounded-md border border-border bg-background px-3 text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          (click)="resetZoom()">
          Reset zoom
        </button>
      </div>
    }
  `,
})
export class ChartZoomControls {
  private readonly categorical = inject(CategoricalViewportContext, { optional: true });
  private readonly scatter = inject(ScatterViewportContext, { optional: true });

  protected readonly status = computed(() => {
    if (this.categorical?.hasZoom()) {
      const range = this.categorical.zoomRange();
      const count = this.categorical.dataCount();
      if (!range) {
        return null;
      }
      return `Showing ${range.startIndex + 1}-${range.endIndex + 1} of ${count}`;
    }

    if (this.scatter?.hasZoom()) {
      const xDomain = this.scatter.zoomXDomain() ?? this.scatter.fullXDomain();
      const yDomain = this.scatter.zoomYDomain() ?? this.scatter.fullYDomain();
      if (!xDomain || !yDomain) {
        return null;
      }
      return `X ${formatNumber(xDomain[0])}-${formatNumber(xDomain[1])} · Y ${formatNumber(yDomain[0])}-${formatNumber(yDomain[1])}`;
    }

    return null;
  });

  protected readonly hint = computed(() => {
    if (this.scatter) {
      return 'Drag to brush a region. Use the wheel to zoom and one-finger touch drag to pan while zoomed.';
    }
    return 'Drag to select a category range. Use the wheel to zoom and one-finger touch drag to pan while zoomed.';
  });

  protected resetZoom(): void {
    this.categorical?.resetZoom();
    this.scatter?.resetZoom();
  }
}
