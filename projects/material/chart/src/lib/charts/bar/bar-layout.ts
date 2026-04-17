import { scaleBand, scaleLinear } from 'd3-scale';
import { max as d3max } from 'd3-array';
import { stack as d3stack, type Series, type SeriesPoint } from 'd3-shape';
import type { ChartDatum, ChartOrientation } from '../../core/cartesian-context';
import { seriesColorVar } from '../../core/chart-config';

/** Bar-chart layout variant. */
export type BarVariant = 'grouped' | 'stacked';

/** A single bar rectangle ready to render. */
export interface BarRect {
  readonly key: string; // unique per cell for @for tracking
  readonly seriesKey: string;
  readonly datumIndex: number;
  readonly category: string;
  readonly value: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly color: string;
}

/** Inputs required to compute bar-chart geometry. */
export interface BarLayoutInput {
  readonly data: readonly ChartDatum[];
  readonly xKey: string;
  readonly seriesKeys: readonly string[];
  readonly variant: BarVariant;
  readonly orientation: ChartOrientation;
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly bandPadding: number;
  readonly groupPadding: number;
}

/** Computed layout: bars + scales. */
export interface BarLayoutResult {
  readonly bars: readonly BarRect[];
  readonly categoryScale: ReturnType<typeof scaleBand<string>>;
  readonly valueScale: ReturnType<typeof scaleLinear<number, number>>;
  readonly categories: readonly string[];
}

/** Read a numeric value from a datum, tolerating strings. */
function readNumber(datum: ChartDatum, key: string): number {
  const raw = datum[key];
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw === 'string') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** Build all bar rectangles for the given config. */
export function computeBarLayout(input: BarLayoutInput): BarLayoutResult {
  const { data, xKey, seriesKeys, variant, orientation, innerWidth, innerHeight, bandPadding, groupPadding } = input;

  const categories = data.map((d) => String(d[xKey] ?? ''));
  const isVertical = orientation === 'vertical';

  const categoryScale = scaleBand<string>()
    .domain(categories)
    .range(isVertical ? [0, innerWidth] : [0, innerHeight])
    .padding(bandPadding);

  const valueScale = scaleLinear<number, number>();

  if (variant === 'stacked' && seriesKeys.length > 0) {
    return stackedLayout({
      data,
      xKey,
      seriesKeys,
      orientation,
      innerWidth,
      innerHeight,
      categoryScale,
      valueScale,
      categories,
    });
  }

  return groupedLayout({
    data,
    xKey,
    seriesKeys,
    orientation,
    innerWidth,
    innerHeight,
    categoryScale,
    valueScale,
    groupPadding,
    categories,
  });
}

// ---------- Grouped ----------

interface GroupedInput {
  data: readonly ChartDatum[];
  xKey: string;
  seriesKeys: readonly string[];
  orientation: ChartOrientation;
  innerWidth: number;
  innerHeight: number;
  categoryScale: ReturnType<typeof scaleBand<string>>;
  valueScale: ReturnType<typeof scaleLinear<number, number>>;
  groupPadding: number;
  categories: readonly string[];
}

function groupedLayout(input: GroupedInput): BarLayoutResult {
  const {
    data,
    xKey,
    seriesKeys,
    orientation,
    innerWidth,
    innerHeight,
    categoryScale,
    valueScale,
    groupPadding,
    categories,
  } = input;

  const isVertical = orientation === 'vertical';
  const maxValue = d3max(data, (d) => d3max(seriesKeys, (k) => readNumber(d, k)) ?? 0) ?? 0;

  valueScale
    .domain([0, maxValue === 0 ? 1 : maxValue])
    .nice()
    .range(isVertical ? [innerHeight, 0] : [0, innerWidth]);

  const subScale = scaleBand<string>()
    .domain(seriesKeys as string[])
    .range([0, categoryScale.bandwidth()])
    .padding(groupPadding);

  const bars: BarRect[] = [];
  data.forEach((datum, datumIndex) => {
    const category = categories[datumIndex];
    const bandStart = categoryScale(category) ?? 0;
    seriesKeys.forEach((seriesKey) => {
      const value = readNumber(datum, seriesKey);
      const sub = subScale(seriesKey) ?? 0;
      const color = seriesColorVar(seriesKey);

      const rect: BarRect = isVertical
        ? {
            key: `${datumIndex}-${seriesKey}`,
            seriesKey,
            datumIndex,
            category,
            value,
            x: bandStart + sub,
            y: valueScale(value),
            width: subScale.bandwidth(),
            height: innerHeight - valueScale(value),
            color,
          }
        : {
            key: `${datumIndex}-${seriesKey}`,
            seriesKey,
            datumIndex,
            category,
            value,
            x: 0,
            y: bandStart + sub,
            width: valueScale(value),
            height: subScale.bandwidth(),
            color,
          };
      bars.push(rect);
    });
  });

  return { bars, categoryScale, valueScale, categories };
}

// ---------- Stacked ----------

interface StackedInput {
  data: readonly ChartDatum[];
  xKey: string;
  seriesKeys: readonly string[];
  orientation: ChartOrientation;
  innerWidth: number;
  innerHeight: number;
  categoryScale: ReturnType<typeof scaleBand<string>>;
  valueScale: ReturnType<typeof scaleLinear<number, number>>;
  categories: readonly string[];
}

function stackedLayout(input: StackedInput): BarLayoutResult {
  const { data, seriesKeys, orientation, innerWidth, innerHeight, categoryScale, valueScale, categories } = input;

  const isVertical = orientation === 'vertical';
  const normalized = data.map((d) => {
    const out: Record<string, number> = {};
    for (const k of seriesKeys) {
      out[k] = readNumber(d, k);
    }
    return out;
  });

  const series: Series<Record<string, number>, string>[] = d3stack<Record<string, number>, string>().keys(
    seriesKeys as string[],
  )(normalized);

  const maxTotal = d3max(series[series.length - 1] ?? [], (p) => p[1]) ?? 0;
  valueScale
    .domain([0, maxTotal === 0 ? 1 : maxTotal])
    .nice()
    .range(isVertical ? [innerHeight, 0] : [0, innerWidth]);

  const bars: BarRect[] = [];
  series.forEach((layer) => {
    const seriesKey = layer.key;
    const color = seriesColorVar(seriesKey);
    layer.forEach((point: SeriesPoint<Record<string, number>>, datumIndex: number) => {
      const [lower, upper] = point;
      const value = upper - lower;
      const category = categories[datumIndex];
      const bandStart = categoryScale(category) ?? 0;

      const rect: BarRect = isVertical
        ? {
            key: `${datumIndex}-${seriesKey}`,
            seriesKey,
            datumIndex,
            category,
            value,
            x: bandStart,
            y: valueScale(upper),
            width: categoryScale.bandwidth(),
            height: valueScale(lower) - valueScale(upper),
            color,
          }
        : {
            key: `${datumIndex}-${seriesKey}`,
            seriesKey,
            datumIndex,
            category,
            value,
            x: valueScale(lower),
            y: bandStart,
            width: valueScale(upper) - valueScale(lower),
            height: categoryScale.bandwidth(),
            color,
          };
      bars.push(rect);
    });
  });

  return { bars, categoryScale, valueScale, categories };
}
