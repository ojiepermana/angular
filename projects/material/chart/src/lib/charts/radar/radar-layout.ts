import { lineRadial, curveLinearClosed, curveCardinalClosed } from 'd3-shape';
import { max as d3max } from 'd3-array';
import type { ChartDatum } from '../../core/cartesian-context';
import { seriesColorVar } from '../../core/chart-config';

export type RadarCurve = 'linear' | 'cardinal';

export interface RadarLayoutInput {
  readonly data: readonly ChartDatum[];
  readonly axisKey: string;
  readonly seriesKeys: readonly string[];
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly maxValue?: number;
  readonly levels: number;
  readonly curve: RadarCurve;
}

export interface RadarAxisInfo {
  readonly name: string;
  readonly angle: number;
  readonly x: number;
  readonly y: number;
}

export interface RadarSeries {
  readonly seriesKey: string;
  readonly color: string;
  readonly path: string;
  readonly points: readonly { readonly x: number; readonly y: number; readonly value: number; readonly axis: string }[];
}

export interface RadarLayout {
  readonly centerX: number;
  readonly centerY: number;
  readonly radius: number;
  readonly axes: readonly RadarAxisInfo[];
  readonly levels: readonly number[];
  readonly maxValue: number;
  readonly series: readonly RadarSeries[];
}

export function computeRadarLayout(input: RadarLayoutInput): RadarLayout {
  const { data, axisKey, seriesKeys, innerWidth, innerHeight, levels, curve } = input;
  const radius = Math.max(0, Math.min(innerWidth, innerHeight) / 2);
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;

  if (data.length === 0 || seriesKeys.length === 0 || radius === 0) {
    return { centerX, centerY, radius, axes: [], levels: [], maxValue: 0, series: [] };
  }

  const maxValue = input.maxValue ?? d3max(data, (d) => d3max(seriesKeys, (k) => Number(d[k] ?? 0)) ?? 0) ?? 1;

  const angleStep = (2 * Math.PI) / data.length;
  const angleFor = (i: number) => i * angleStep - Math.PI / 2;

  const axes: RadarAxisInfo[] = data.map((d, i) => {
    const a = angleFor(i);
    return {
      name: String(d[axisKey] ?? i),
      angle: a,
      x: Math.cos(a) * radius,
      y: Math.sin(a) * radius,
    };
  });

  const levelValues = Array.from({ length: levels }, (_, i) => ((i + 1) / levels) * maxValue);

  const curveFactory = curve === 'cardinal' ? curveCardinalClosed : curveLinearClosed;
  const radial = lineRadial<{ angle: number; value: number }>()
    .angle((p) => p.angle + Math.PI / 2)
    .radius((p) => (p.value / maxValue) * radius)
    .curve(curveFactory);

  const series: RadarSeries[] = seriesKeys.map((k) => {
    const points = data.map((d, i) => {
      const value = Number(d[k] ?? 0);
      const a = angleFor(i);
      const r = (value / maxValue) * radius;
      return {
        axis: String(d[axisKey] ?? i),
        value,
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
      };
    });
    return {
      seriesKey: k,
      color: seriesColorVar(k),
      path: radial(data.map((d, i) => ({ angle: angleFor(i), value: Number(d[k] ?? 0) }))) ?? '',
      points,
    };
  });

  return { centerX, centerY, radius, axes, levels: levelValues, maxValue, series };
}
