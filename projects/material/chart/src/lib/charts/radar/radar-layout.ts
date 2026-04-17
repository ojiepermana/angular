import { lineRadial, curveLinearClosed, curveCardinalClosed } from 'd3-shape';
import { max as d3max } from 'd3-array';
import type { ChartDatum } from '../../core/cartesian-context';
import { seriesColorVar } from '../../core/chart-config';

export type RadarCurve = 'linear' | 'cardinal';
export type RadarGrid = 'polygon' | 'circle' | 'none';

export interface RadarLayoutInput {
  readonly data: readonly ChartDatum[];
  readonly axisKey: string;
  readonly seriesKeys: readonly string[];
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly maxValue?: number;
  readonly levels: number;
  readonly curve: RadarCurve;
  readonly grid: RadarGrid;
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

export interface RadarLevel {
  readonly value: number;
  readonly radius: number;
  readonly path: string;
}

export interface RadarLayout {
  readonly centerX: number;
  readonly centerY: number;
  readonly radius: number;
  readonly axes: readonly RadarAxisInfo[];
  readonly levels: readonly RadarLevel[];
  readonly maxValue: number;
  readonly series: readonly RadarSeries[];
  readonly grid: RadarGrid;
}

export function computeRadarLayout(input: RadarLayoutInput): RadarLayout {
  const { data, axisKey, seriesKeys, innerWidth, innerHeight, levels, curve, grid } = input;
  const radius = Math.max(0, Math.min(innerWidth, innerHeight) / 2);
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;

  if (data.length === 0 || seriesKeys.length === 0 || radius === 0) {
    return { centerX, centerY, radius, axes: [], levels: [], maxValue: 0, series: [], grid };
  }

  const maxValue = input.maxValue ?? d3max(data, (d) => d3max(seriesKeys, (k) => Number(d[k] ?? 0)) ?? 0) ?? 1;

  const angleStep = (2 * Math.PI) / data.length;
  const angleFor = (i: number) => i * angleStep - Math.PI / 2;

  const axes: RadarAxisInfo[] = data.map((d, i) => {
    const angle = angleFor(i);
    return {
      name: String(d[axisKey] ?? i),
      angle,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  const levelValues: RadarLevel[] = Array.from({ length: levels }, (_, index) => {
    const value = ((index + 1) / levels) * maxValue;
    const levelRadius = ((index + 1) / levels) * radius;
    return {
      value,
      radius: levelRadius,
      path: polygonPath(
        axes.map((axis) => ({
          x: Math.cos(axis.angle) * levelRadius,
          y: Math.sin(axis.angle) * levelRadius,
        })),
      ),
    };
  });

  const curveFactory = curve === 'cardinal' ? curveCardinalClosed : curveLinearClosed;
  const radial = lineRadial<{ angle: number; value: number }>()
    .angle((point) => point.angle + Math.PI / 2)
    .radius((point) => (point.value / maxValue) * radius)
    .curve(curveFactory);

  const series: RadarSeries[] = seriesKeys.map((seriesKey) => {
    const points = data.map((datum, index) => {
      const value = Number(datum[seriesKey] ?? 0);
      const angle = angleFor(index);
      const pointRadius = (value / maxValue) * radius;
      return {
        axis: String(datum[axisKey] ?? index),
        value,
        x: Math.cos(angle) * pointRadius,
        y: Math.sin(angle) * pointRadius,
      };
    });
    return {
      seriesKey,
      color: seriesColorVar(seriesKey),
      path:
        radial(data.map((datum, index) => ({ angle: angleFor(index), value: Number(datum[seriesKey] ?? 0) }))) ?? '',
      points,
    };
  });

  return { centerX, centerY, radius, axes, levels: levelValues, maxValue, series, grid };
}

function polygonPath(points: readonly { readonly x: number; readonly y: number }[]): string {
  if (points.length === 0) {
    return '';
  }

  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ${rest.map((point) => `L ${point.x} ${point.y}`).join(' ')} Z`;
}
