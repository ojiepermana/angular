import { scalePoint, scaleLinear } from 'd3-scale';
import { max as d3max } from 'd3-array';
import {
  line as d3line,
  area as d3area,
  stack as d3stack,
  stackOffsetExpand,
  curveMonotoneX,
  curveLinear,
  curveStep,
  type CurveFactory,
} from 'd3-shape';
import type { ChartDatum, ChartOrientation } from '../../core/cartesian-context';
import { seriesColorVar } from '../../core/chart-config';

/** Curve type shared by line & area charts. */
export type LineCurve = 'linear' | 'monotone' | 'step';

function curveFor(curve: LineCurve): CurveFactory {
  switch (curve) {
    case 'monotone':
      return curveMonotoneX;
    case 'step':
      return curveStep;
    case 'linear':
    default:
      return curveLinear;
  }
}

/** A single series ready to render as either a line or an area. */
export interface LineSeriesPath {
  readonly seriesKey: string;
  readonly color: string;
  readonly linePath: string;
  /** Optional area path — only populated when `computeAreaLayout` is used. */
  readonly areaPath?: string;
  /** Raw points for dots / active markers. */
  readonly points: readonly LinePoint[];
}

/** One resolved (x, y) point for a series. */
export interface LinePoint {
  readonly seriesKey: string;
  readonly datumIndex: number;
  readonly category: string;
  readonly value: number;
  readonly x: number;
  readonly y: number;
}

export interface CartesianBase {
  readonly data: readonly ChartDatum[];
  readonly xKey: string;
  readonly seriesKeys: readonly string[];
  readonly orientation: ChartOrientation;
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly curve: LineCurve;
}

export interface LineLayoutResult {
  readonly series: readonly LineSeriesPath[];
  readonly points: readonly LinePoint[];
  readonly categoryScale: ReturnType<typeof scalePoint<string>>;
  readonly valueScale: ReturnType<typeof scaleLinear<number, number>>;
  readonly categories: readonly string[];
}

export interface AreaLayoutResult extends LineLayoutResult {
  readonly stacked: boolean;
}

function readNumber(datum: ChartDatum, key: string): number {
  const raw = datum[key];
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** Build category + value scales for point-based charts (line / area). */
export function buildCartesianScales(input: CartesianBase): {
  categories: readonly string[];
  categoryScale: ReturnType<typeof scalePoint<string>>;
  valueScale: ReturnType<typeof scaleLinear<number, number>>;
} {
  const { data, xKey, seriesKeys, orientation, innerWidth, innerHeight } = input;
  const isVertical = orientation === 'vertical';
  const categories = data.map((d) => String(d[xKey] ?? ''));

  const categoryScale = scalePoint<string>()
    .domain(categories)
    .range(isVertical ? [0, innerWidth] : [0, innerHeight])
    .padding(0.5);

  const maxValue = d3max(data, (d) => d3max(seriesKeys, (k) => readNumber(d, k)) ?? 0) ?? 0;

  const valueScale = scaleLinear<number, number>()
    .domain([0, maxValue === 0 ? 1 : maxValue])
    .nice()
    .range(isVertical ? [innerHeight, 0] : [0, innerWidth]);

  return { categories, categoryScale, valueScale };
}

/** Compute line-chart geometry. */
export function computeLineLayout(input: CartesianBase): LineLayoutResult {
  const { data, seriesKeys, orientation, curve } = input;
  const { categories, categoryScale, valueScale } = buildCartesianScales(input);
  const isVertical = orientation === 'vertical';

  const allPoints: LinePoint[] = [];
  const series: LineSeriesPath[] = [];

  for (const seriesKey of seriesKeys) {
    const points: LinePoint[] = data.map((d, datumIndex) => {
      const value = readNumber(d, seriesKey);
      const category = categories[datumIndex];
      const c = categoryScale(category) ?? 0;
      const v = valueScale(value);
      return {
        seriesKey,
        datumIndex,
        category,
        value,
        x: isVertical ? c : v,
        y: isVertical ? v : c,
      };
    });
    allPoints.push(...points);

    const generator = d3line<LinePoint>()
      .x((p) => p.x)
      .y((p) => p.y)
      .curve(curveFor(curve));

    series.push({
      seriesKey,
      color: seriesColorVar(seriesKey),
      linePath: generator(points) ?? '',
      points,
    });
  }

  return {
    series,
    points: allPoints,
    categoryScale,
    valueScale,
    categories,
  };
}

export interface AreaLayoutInput extends CartesianBase {
  readonly stacked: boolean;
  readonly expanded?: boolean;
}

/** Compute area-chart geometry (single or stacked). */
export function computeAreaLayout(input: AreaLayoutInput): AreaLayoutResult {
  if (input.stacked && input.seriesKeys.length > 0) {
    return computeStackedArea(input);
  }
  return computeSingleArea(input);
}

function computeSingleArea(input: AreaLayoutInput): AreaLayoutResult {
  const { data, seriesKeys, orientation, curve } = input;
  const { categories, categoryScale, valueScale } = buildCartesianScales(input);
  const isVertical = orientation === 'vertical';
  const baseline = isVertical ? valueScale(0) : valueScale(0);

  const allPoints: LinePoint[] = [];
  const series: LineSeriesPath[] = [];

  for (const seriesKey of seriesKeys) {
    const points: LinePoint[] = data.map((d, datumIndex) => {
      const value = readNumber(d, seriesKey);
      const category = categories[datumIndex];
      const c = categoryScale(category) ?? 0;
      const v = valueScale(value);
      return {
        seriesKey,
        datumIndex,
        category,
        value,
        x: isVertical ? c : v,
        y: isVertical ? v : c,
      };
    });
    allPoints.push(...points);

    const lineGen = d3line<LinePoint>()
      .x((p) => p.x)
      .y((p) => p.y)
      .curve(curveFor(curve));

    const areaGen = isVertical
      ? d3area<LinePoint>()
          .x((p) => p.x)
          .y0(baseline)
          .y1((p) => p.y)
          .curve(curveFor(curve))
      : d3area<LinePoint>()
          .y((p) => p.y)
          .x0(baseline)
          .x1((p) => p.x)
          .curve(curveFor(curve));

    series.push({
      seriesKey,
      color: seriesColorVar(seriesKey),
      linePath: lineGen(points) ?? '',
      areaPath: areaGen(points) ?? '',
      points,
    });
  }

  return {
    series,
    points: allPoints,
    categoryScale,
    valueScale,
    categories,
    stacked: false,
  };
}

function computeStackedArea(input: AreaLayoutInput): AreaLayoutResult {
  const { data, seriesKeys, orientation, innerWidth, innerHeight, xKey, curve, expanded } = input;
  const isVertical = orientation === 'vertical';
  const categories = data.map((d) => String(d[xKey] ?? ''));

  const categoryScale = scalePoint<string>()
    .domain(categories)
    .range(isVertical ? [0, innerWidth] : [0, innerHeight])
    .padding(0.5);

  const normalized = data.map((d) => {
    const out: Record<string, number> = {};
    for (const k of seriesKeys) out[k] = readNumber(d, k);
    return out;
  });

  const stackGenerator = d3stack<Record<string, number>, string>().keys(seriesKeys as string[]);
  if (expanded) {
    stackGenerator.offset(stackOffsetExpand);
  }
  const stackSeries = stackGenerator(normalized);

  const maxTotal = expanded ? 1 : (d3max(stackSeries[stackSeries.length - 1] ?? [], (p) => p[1]) ?? 0);
  const valueScale = scaleLinear<number, number>()
    .domain([0, maxTotal === 0 ? 1 : maxTotal])
    .range(isVertical ? [innerHeight, 0] : [0, innerWidth]);

  if (!expanded) {
    valueScale.nice();
  }

  const allPoints: LinePoint[] = [];
  const series: LineSeriesPath[] = stackSeries.map((layer) => {
    const seriesKey = layer.key;
    const points: LinePoint[] = layer.map((p, datumIndex) => {
      const category = categories[datumIndex];
      const c = categoryScale(category) ?? 0;
      const upper = valueScale(p[1]);
      return {
        seriesKey,
        datumIndex,
        category,
        value: p[1] - p[0],
        x: isVertical ? c : upper,
        y: isVertical ? upper : c,
      };
    });
    allPoints.push(...points);

    const lineGen = d3line<[number, number, number]>()
      .x(([x]) => x)
      .y(([, y]) => y)
      .curve(curveFor(curve));

    const areaGen = isVertical
      ? d3area<[number, number, number]>()
          .x(([x]) => x)
          .y0(([, , y0]) => y0)
          .y1(([, y1]) => y1)
          .curve(curveFor(curve))
      : d3area<[number, number, number]>()
          .y(([x]) => x)
          .x0(([, , x0]) => x0)
          .x1(([, x1]) => x1)
          .curve(curveFor(curve));

    const tuples: [number, number, number][] = layer.map((p, i) => {
      const c = categoryScale(categories[i]) ?? 0;
      return [c, valueScale(p[1]), valueScale(p[0])];
    });

    return {
      seriesKey,
      color: seriesColorVar(seriesKey),
      linePath: lineGen(tuples) ?? '',
      areaPath: areaGen(tuples) ?? '',
      points,
    };
  });

  return {
    series,
    points: allPoints,
    categoryScale,
    valueScale,
    categories,
    stacked: true,
  };
}
