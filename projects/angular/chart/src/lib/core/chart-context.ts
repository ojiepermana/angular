import { Injectable, signal, computed, type Signal } from '@angular/core';
import type { ChartConfig } from './chart-config';

/** Pixel dimensions of the chart render area. */
export interface ChartDimensions {
  readonly width: number;
  readonly height: number;
}

/** Active data point (for tooltip / crosshair) shared across primitives. */
export interface ChartActivePoint {
  readonly index: number;
  readonly datumIndex?: number;
  readonly seriesKey?: string;
  readonly clientX?: number;
  readonly clientY?: number;
}

/**
 * Shared chart state provided by `ChartContainer` to all nested chart
 * components (axes, grid, tooltip, legend, chart types).
 *
 * All state is exposed as signals so consumers can derive computed state
 * (scales, visible series, tooltip position) without manual subscriptions.
 */
@Injectable()
export class ChartContext {
  /** Stable instance id — used in the `data-chart` attribute and CSS scope. */
  readonly id = signal<string>('');

  /** User-provided series config. */
  readonly config = signal<ChartConfig>({});

  /** Measured render-area dimensions (ResizeObserver-driven). */
  readonly dimensions = signal<ChartDimensions>({ width: 0, height: 0 });

  /** Currently highlighted data point (tooltip / crosshair). */
  readonly activePoint = signal<ChartActivePoint | null>(null);

  /** Series keys the user has toggled off via legend. */
  readonly hiddenSeries = signal<ReadonlySet<string>>(new Set());

  /** Ordered list of series keys (from `config`). */
  readonly seriesKeys: Signal<readonly string[]> = computed(() => Object.keys(this.config()));

  /** Series keys currently visible (config order minus `hiddenSeries`). */
  readonly visibleSeriesKeys: Signal<readonly string[]> = computed(() => {
    const hidden = this.hiddenSeries();
    return this.seriesKeys().filter((k) => !hidden.has(k));
  });

  /** Toggle visibility of a series. */
  toggleSeries(key: string): void {
    this.hiddenSeries.update((set) => {
      const next = new Set(set);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }
}
