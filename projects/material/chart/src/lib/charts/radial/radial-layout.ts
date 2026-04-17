import { arc as d3arc } from 'd3-shape';
import { max as d3max } from 'd3-array';
import type { ChartDatum } from '../../core/cartesian-context';
import { seriesColorVar } from '../../core/chart-config';

export interface RadialLayoutInput {
  readonly data: readonly ChartDatum[];
  readonly nameKey: string;
  readonly valueKey: string;
  readonly innerWidth: number;
  readonly innerHeight: number;
  /** Optional explicit series-key list (same length as data). */
  readonly seriesKeys?: readonly string[];
  /** Gap between concentric tracks (px). */
  readonly trackPadding: number;
  /** Start / end angle (radians). */
  readonly startAngle: number;
  readonly endAngle: number;
  readonly cornerRadius: number;
  readonly maxValue?: number;
}

export interface RadialBarRect {
  readonly seriesKey: string;
  readonly name: string;
  readonly value: number;
  readonly datumIndex: number;
  readonly color: string;
  readonly arcPath: string;
  readonly backgroundPath: string;
  readonly innerRadius: number;
  readonly outerRadius: number;
  readonly endAngle: number;
}

export interface RadialLayout {
  readonly centerX: number;
  readonly centerY: number;
  readonly outerRadius: number;
  readonly bars: readonly RadialBarRect[];
  readonly maxValue: number;
}

export function computeRadialLayout(input: RadialLayoutInput): RadialLayout {
  const {
    data,
    nameKey,
    valueKey,
    innerWidth,
    innerHeight,
    seriesKeys,
    trackPadding,
    startAngle,
    endAngle,
    cornerRadius,
  } = input;

  const outerRadius = Math.max(0, Math.min(innerWidth, innerHeight) / 2);
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;

  if (data.length === 0 || outerRadius === 0) {
    return { centerX, centerY, outerRadius, bars: [], maxValue: 0 };
  }

  const maxValue = input.maxValue ?? d3max(data, (d) => Number(d[valueKey] ?? 0)) ?? 1;
  const trackCount = data.length;
  const availableRadius = outerRadius - (trackCount - 1) * trackPadding;
  const trackThickness = availableRadius / trackCount;

  const bars: RadialBarRect[] = data.map((d, i) => {
    const inner = i * (trackThickness + trackPadding);
    const outer = inner + trackThickness;
    const value = Number(d[valueKey] ?? 0);
    const pct = maxValue === 0 ? 0 : value / maxValue;
    const sweep = (endAngle - startAngle) * pct;
    const valueEndAngle = startAngle + sweep;
    const key = seriesKeys?.[i] ?? String(d[nameKey] ?? i);

    const arcGen = d3arc<unknown>().innerRadius(inner).outerRadius(outer).cornerRadius(cornerRadius);

    return {
      seriesKey: key,
      name: String(d[nameKey] ?? key),
      value,
      datumIndex: i,
      color: seriesColorVar(key),
      arcPath: arcGen.startAngle(startAngle).endAngle(valueEndAngle)(null) ?? '',
      backgroundPath: arcGen.startAngle(startAngle).endAngle(endAngle)(null) ?? '',
      innerRadius: inner,
      outerRadius: outer,
      endAngle: valueEndAngle,
    };
  });

  return { centerX, centerY, outerRadius, bars, maxValue };
}
