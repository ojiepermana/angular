import type { ScaleBand, ScaleLinear } from 'd3-scale';

/** A tick descriptor for rendering axes. */
export interface ChartTick {
  readonly value: string | number;
  /** Offset (px) along the axis. For band scales this is the band center. */
  readonly offset: number;
  /** Display label. */
  readonly label: string;
}

/** Produce evenly-spaced ticks for a band (categorical) scale. */
export function bandTicks(scale: ScaleBand<string>): ChartTick[] {
  const half = scale.bandwidth() / 2;
  return scale.domain().map((value) => ({
    value,
    offset: (scale(value) ?? 0) + half,
    label: value,
  }));
}

/**
 * Produce ticks for a linear scale.
 *
 * @param scale      The linear scale.
 * @param count      Approximate number of ticks (hint, d3 may return fewer/more).
 * @param formatter  Label formatter.
 */
export function linearTicks(
  scale: ScaleLinear<number, number>,
  count = 5,
  formatter: (value: number) => string = (v) => String(v),
): ChartTick[] {
  return scale.ticks(count).map((value) => ({
    value,
    offset: scale(value),
    label: formatter(value),
  }));
}
