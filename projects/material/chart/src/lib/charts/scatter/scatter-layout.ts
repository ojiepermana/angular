import { scaleLinear, type ScaleLinear } from 'd3-scale';
import { extent as d3extent } from 'd3-array';
import type { ChartDatum } from '../../core/cartesian-context';
import { seriesColorVar } from '../../core/chart-config';
import type { NumericDomain } from '../../core/viewport';

export interface ScatterLayoutInput {
  readonly data: readonly ChartDatum[];
  readonly xKey: string;
  readonly yKey: string;
  readonly sizeKey?: string;
  readonly seriesKey?: string;
  readonly seriesKeys: readonly string[];
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly minPointRadius: number;
  readonly maxPointRadius: number;
  readonly xDomain?: readonly [number, number];
  readonly yDomain?: readonly [number, number];
}

export interface ScatterPoint {
  readonly seriesKey: string;
  readonly color: string;
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  readonly datumIndex: number;
  readonly rawX: number;
  readonly rawY: number;
  readonly rawSize: number;
}

export interface ScatterLayout {
  readonly points: readonly ScatterPoint[];
  readonly xScale: ScaleLinear<number, number>;
  readonly yScale: ScaleLinear<number, number>;
  readonly xDomain: NumericDomain;
  readonly yDomain: NumericDomain;
}

function nice(extent: [number, number] | [undefined, undefined]): [number, number] {
  const [lo, hi] = extent;
  if (lo === undefined || hi === undefined) return [0, 1];
  if (lo === hi) return [lo - 1, hi + 1];
  return [lo, hi];
}

export function resolveScatterDomains(
  input: Pick<ScatterLayoutInput, 'data' | 'xKey' | 'yKey' | 'xDomain' | 'yDomain'>,
): { xDomain: NumericDomain; yDomain: NumericDomain } {
  const xValues = input.data.map((d) => Number(d[input.xKey] ?? 0));
  const yValues = input.data.map((d) => Number(d[input.yKey] ?? 0));
  return {
    xDomain: (input.xDomain ?? nice(d3extent(xValues) as [number, number])) as NumericDomain,
    yDomain: (input.yDomain ?? nice(d3extent(yValues) as [number, number])) as NumericDomain,
  };
}

export function computeScatterLayout(input: ScatterLayoutInput): ScatterLayout {
  const { data, xKey, yKey, sizeKey, seriesKey, seriesKeys, innerWidth, innerHeight, minPointRadius, maxPointRadius } =
    input;

  const xValues = data.map((d) => Number(d[xKey] ?? 0));
  const yValues = data.map((d) => Number(d[yKey] ?? 0));
  const sizeValues = sizeKey ? data.map((d) => Number(d[sizeKey] ?? 0)) : [];

  const { xDomain, yDomain } = resolveScatterDomains(input);

  const xScale = scaleLinear()
    .domain(xDomain as [number, number])
    .range([0, innerWidth]);
  const yScale = scaleLinear()
    .domain(yDomain as [number, number])
    .range([innerHeight, 0]);

  let sizeScale: ScaleLinear<number, number> | null = null;
  if (sizeKey && sizeValues.length > 0) {
    const [sLo, sHi] = d3extent(sizeValues) as [number, number];
    sizeScale = scaleLinear()
      .domain([sLo ?? 0, sHi ?? 1])
      .range([minPointRadius, maxPointRadius]);
  }

  const fallbackKey = seriesKeys[0] ?? 'value';

  const points: ScatterPoint[] = data.flatMap((d, i) => {
    const key = seriesKey ? String(d[seriesKey] ?? fallbackKey) : fallbackKey;
    const sz = sizeKey ? Number(d[sizeKey] ?? 0) : 0;
    const rawX = xValues[i];
    const rawY = yValues[i];
    if (rawX < xDomain[0] || rawX > xDomain[1] || rawY < yDomain[0] || rawY > yDomain[1]) {
      return [];
    }
    return [
      {
        seriesKey: key,
        color: seriesColorVar(key),
        x: xScale(rawX),
        y: yScale(rawY),
        radius: sizeScale ? sizeScale(sz) : minPointRadius,
        datumIndex: i,
        rawX,
        rawY,
        rawSize: sz,
      },
    ];
  });

  return { points, xScale, yScale, xDomain, yDomain };
}
