export interface ChartIndexRange {
  readonly startIndex: number;
  readonly endIndex: number;
}

export type NumericDomain = readonly [number, number];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeIndexRange(start: number, end: number, maxCount: number): ChartIndexRange | null {
  if (maxCount <= 0) {
    return null;
  }
  const lo = clamp(Math.floor(Math.min(start, end)), 0, maxCount - 1);
  const hi = clamp(Math.floor(Math.max(start, end)), 0, maxCount - 1);
  return { startIndex: lo, endIndex: hi };
}

export function effectiveIndexRange(range: ChartIndexRange | null, maxCount: number): ChartIndexRange | null {
  if (maxCount <= 0) {
    return null;
  }
  return range
    ? normalizeIndexRange(range.startIndex, range.endIndex, maxCount)
    : { startIndex: 0, endIndex: maxCount - 1 };
}

export function indexRangeSize(range: ChartIndexRange | null, maxCount: number): number {
  const effective = effectiveIndexRange(range, maxCount);
  return effective ? effective.endIndex - effective.startIndex + 1 : 0;
}

export function sliceByIndexRange<T>(data: readonly T[], range: ChartIndexRange | null): readonly T[] {
  if (!range) {
    return data;
  }
  return data.slice(range.startIndex, range.endIndex + 1);
}

export function zoomIndexRange(
  current: ChartIndexRange | null,
  maxCount: number,
  anchorIndex: number,
  factor: number,
): ChartIndexRange | null {
  const base = effectiveIndexRange(current, maxCount);
  if (!base) {
    return null;
  }

  const currentSize = base.endIndex - base.startIndex + 1;
  const nextSize = clamp(Math.round(currentSize * factor), 2, maxCount);
  if (nextSize >= maxCount) {
    return null;
  }

  const boundedAnchor = clamp(anchorIndex, base.startIndex, base.endIndex);
  const ratio = currentSize <= 1 ? 0.5 : (boundedAnchor - base.startIndex) / (currentSize - 1);

  let start = Math.round(boundedAnchor - ratio * (nextSize - 1));
  start = clamp(start, 0, maxCount - nextSize);
  return { startIndex: start, endIndex: start + nextSize - 1 };
}

export function panIndexRange(
  current: ChartIndexRange | null,
  maxCount: number,
  deltaSteps: number,
): ChartIndexRange | null {
  const base = effectiveIndexRange(current, maxCount);
  if (!base) {
    return null;
  }
  const size = base.endIndex - base.startIndex + 1;
  if (size >= maxCount) {
    return null;
  }

  const start = clamp(base.startIndex + deltaSteps, 0, maxCount - size);
  return { startIndex: start, endIndex: start + size - 1 };
}

export function normalizeNumericDomain(a: number, b: number): NumericDomain {
  if (a === b) {
    return [a - 1, b + 1];
  }
  return a < b ? [a, b] : [b, a];
}

export function zoomNumericDomain(
  current: NumericDomain,
  full: NumericDomain,
  anchor: number,
  factor: number,
): NumericDomain {
  const currentWidth = current[1] - current[0];
  const fullWidth = full[1] - full[0];
  const nextWidth = clamp(currentWidth * factor, fullWidth / 50, fullWidth);
  if (nextWidth >= fullWidth) {
    return full;
  }

  const ratio = currentWidth === 0 ? 0.5 : (anchor - current[0]) / currentWidth;
  let start = anchor - ratio * nextWidth;
  start = clamp(start, full[0], full[1] - nextWidth);
  return [start, start + nextWidth];
}

export function panNumericDomain(current: NumericDomain, full: NumericDomain, delta: number): NumericDomain {
  const width = current[1] - current[0];
  const start = clamp(current[0] + delta, full[0], full[1] - width);
  return [start, start + width];
}
