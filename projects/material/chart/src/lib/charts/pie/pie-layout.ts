import { arc as d3arc, pie as d3pie, type PieArcDatum } from 'd3-shape';
import type { ChartDatum } from '../../core/cartesian-context';
import { seriesColorVar } from '../../core/chart-config';

export interface PieLayoutInput {
  readonly data: readonly ChartDatum[];
  /** Field on each datum whose value is the slice's numeric magnitude. */
  readonly valueKey: string;
  /** Field on each datum whose value is the slice's categorical label. */
  readonly nameKey: string;
  /**
   * Ordered series keys used to resolve color (`var(--color-<key>)`).
   * Must have the same length as `data`. If omitted, falls back to
   * `nameKey` values.
   */
  readonly seriesKeys?: readonly string[];
  readonly innerWidth: number;
  readonly innerHeight: number;
  /** Inner radius for donut-style charts (0 = full pie). */
  readonly innerRadius: number;
  /** Gap between slices, in radians. */
  readonly padAngle: number;
  /** Corner radius for slices (px). */
  readonly cornerRadius: number;
  /** Starting angle in radians (default −π/2 = 12 o'clock). */
  readonly startAngle: number;
  /** Ending angle in radians (default 3π/2). */
  readonly endAngle: number;
  readonly activeIndex?: number;
  readonly activeOffset?: number;
}

export interface PieSliceRect {
  readonly seriesKey: string;
  readonly name: string;
  readonly value: number;
  readonly datumIndex: number;
  readonly color: string;
  readonly arcPath: string;
  readonly centroid: readonly [number, number];
  readonly startAngle: number;
  readonly endAngle: number;
  readonly translateX: number;
  readonly translateY: number;
}

export interface PieLayout {
  readonly slices: readonly PieSliceRect[];
  readonly centerX: number;
  readonly centerY: number;
  readonly outerRadius: number;
}

export function computePieLayout(input: PieLayoutInput): PieLayout {
  const {
    data,
    valueKey,
    nameKey,
    seriesKeys,
    innerWidth,
    innerHeight,
    innerRadius,
    padAngle,
    cornerRadius,
    startAngle,
    endAngle,
    activeIndex,
    activeOffset = 12,
  } = input;

  const outerRadius = Math.max(0, Math.min(innerWidth, innerHeight) / 2);
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;

  if (data.length === 0 || outerRadius === 0) {
    return { slices: [], centerX, centerY, outerRadius };
  }

  const pieGen = d3pie<ChartDatum>()
    .value((d) => Number(d[valueKey] ?? 0))
    .sort(null)
    .padAngle(padAngle)
    .startAngle(startAngle)
    .endAngle(endAngle);

  const arcGen = d3arc<PieArcDatum<ChartDatum>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(cornerRadius);

  const arcs = pieGen(data as ChartDatum[]);
  const slices: PieSliceRect[] = arcs.map((a, i) => {
    const d = a.data;
    const key = seriesKeys?.[i] ?? String(d[nameKey] ?? i);
    const centroid = arcGen.centroid(a) as [number, number];
    const magnitude = Math.hypot(centroid[0], centroid[1]) || 1;
    const isActive = i === activeIndex;
    return {
      seriesKey: key,
      name: String(d[nameKey] ?? key),
      value: Number(d[valueKey] ?? 0),
      datumIndex: i,
      color: seriesColorVar(key),
      arcPath: arcGen(a) ?? '',
      centroid,
      startAngle: a.startAngle,
      endAngle: a.endAngle,
      translateX: isActive ? (centroid[0] / magnitude) * activeOffset : 0,
      translateY: isActive ? (centroid[1] / magnitude) * activeOffset : 0,
    };
  });

  return { slices, centerX, centerY, outerRadius };
}
