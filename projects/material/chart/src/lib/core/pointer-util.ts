import type { CartesianContext } from './cartesian-context';

export interface ClientPoint {
  readonly clientX: number;
  readonly clientY: number;
}

/**
 * Given a pointer event's local (x, y) relative to the chart's inner group,
 * resolve the nearest category index along the categorical axis.
 *
 * @returns index into `ctx.categories()` (or −1 if no scale / no data).
 */
export function nearestCategoryIndex(
  ctx: Pick<CartesianContext, 'categoryScale' | 'categories' | 'orientation'>,
  localX: number,
  localY: number,
): number {
  const scale = ctx.categoryScale();
  const categories = ctx.categories();
  if (!scale || categories.length === 0) return -1;

  const isVertical = ctx.orientation() === 'vertical';
  const pointerAlong = isVertical ? localX : localY;

  const bandwidth = scale.bandwidth();
  // scale.step() is only defined for band scales; fall back to bandwidth.
  const step = (scale as unknown as { step?: () => number }).step?.() ?? bandwidth;

  let bestIndex = -1;
  let bestDelta = Infinity;
  for (let i = 0; i < categories.length; i++) {
    const base = scale(categories[i]) ?? 0;
    const center = base + bandwidth / 2;
    const delta = Math.abs(pointerAlong - center);
    if (delta < bestDelta) {
      bestDelta = delta;
      bestIndex = i;
    }
  }

  // Ignore clicks far outside any band (> 1 step away).
  if (bestDelta > step) {
    return -1;
  }
  return bestIndex;
}

/** Resolve the client-space center point of a focused or clicked SVG/HTML element. */
export function elementClientCenter(target: EventTarget | null): ClientPoint | null {
  const el = target as Element | null;
  if (!el || typeof el.getBoundingClientRect !== 'function') {
    return null;
  }
  const rect = el.getBoundingClientRect();
  return {
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
  };
}
