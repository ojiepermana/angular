import { Injectable, signal, type Signal } from '@angular/core';
import type { ScaleBand, ScaleLinear } from 'd3-scale';

/** A single row of chart data — one categorical key + N numeric series. */
export type ChartDatum = Readonly<Record<string, unknown>>;

/** Render-area margins inside the chart's SVG (px). */
export interface ChartMargin {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

/** Axis orientation for cartesian charts. */
export type ChartOrientation = 'vertical' | 'horizontal';

/** Primary axis scale — band for categorical, linear for numeric. */
export type CategoryScale = ScaleBand<string>;
export type ValueScale = ScaleLinear<number, number>;

/**
 * Cartesian plotting frame shared between a chart type (Bar, Line, Area…)
 * and its axis / grid primitives.
 *
 * The owning chart component provides an instance and publishes its scales;
 * descendants read them via signals and re-render when dimensions or data
 * change.
 */
@Injectable()
export class CartesianContext {
  /** Inner width (outer width − margin.left − margin.right). */
  readonly innerWidth = signal<number>(0);

  /** Inner height (outer height − margin.top − margin.bottom). */
  readonly innerHeight = signal<number>(0);

  /** Margins around the plotting area. */
  readonly margin = signal<ChartMargin>({ top: 8, right: 8, bottom: 24, left: 40 });

  /** Layout orientation (drives which axis holds the band scale). */
  readonly orientation = signal<ChartOrientation>('vertical');

  /** Band (categorical) scale. */
  readonly categoryScale = signal<CategoryScale | null>(null);

  /** Linear (numeric) scale. */
  readonly valueScale = signal<ValueScale | null>(null);

  /** Ordered category domain (e.g. x labels for vertical, y labels for horizontal). */
  readonly categories = signal<readonly string[]>([]);
}

/** Resolve the scale that maps to the X axis for a given orientation. */
export function xScale(
  ctx: Pick<CartesianContext, 'orientation' | 'categoryScale' | 'valueScale'>,
): Signal<CategoryScale | ValueScale | null> {
  return ctx.orientation() === 'vertical' ? ctx.categoryScale : ctx.valueScale;
}

/** Resolve the scale that maps to the Y axis for a given orientation. */
export function yScale(
  ctx: Pick<CartesianContext, 'orientation' | 'categoryScale' | 'valueScale'>,
): Signal<CategoryScale | ValueScale | null> {
  return ctx.orientation() === 'vertical' ? ctx.valueScale : ctx.categoryScale;
}
