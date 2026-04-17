import { scaleLinear, scaleBand } from 'd3-scale';
import type { ScalePoint } from 'd3-scale';
import { CartesianContext } from '../../core/cartesian-context';

/**
 * Publish a `scalePoint` from line/area layouts to the `CartesianContext`,
 * which expects a `scaleBand`. We adapt by building a band with zero padding
 * centered on the same positions, so axis ticks render at the correct
 * offsets.
 *
 * This keeps axes/grid primitives agnostic to whether the underlying chart
 * uses `scaleBand` (bar) or `scalePoint` (line/area).
 */
export function pointToBandAdapter(
  pointScale: ScalePoint<string>,
  range: [number, number],
): ReturnType<typeof scaleBand<string>> {
  return scaleBand<string>().domain(pointScale.domain()).range(range).padding(0);
}

/** Recreate a linear scale with the same domain/range (handy for effects). */
export function cloneLinear(
  scale: ReturnType<typeof scaleLinear<number, number>>,
): ReturnType<typeof scaleLinear<number, number>> {
  return scaleLinear<number, number>().domain(scale.domain()).range(scale.range());
}

export function provideCartesianFromLineLayout(
  ctx: CartesianContext,
  layout: {
    categoryScale: ScalePoint<string>;
    valueScale: ReturnType<typeof scaleLinear<number, number>>;
    categories: readonly string[];
  },
  orientation: 'vertical' | 'horizontal',
  innerWidth: number,
  innerHeight: number,
): void {
  const range: [number, number] = orientation === 'vertical' ? [0, innerWidth] : [0, innerHeight];
  ctx.orientation.set(orientation);
  ctx.innerWidth.set(innerWidth);
  ctx.innerHeight.set(innerHeight);
  ctx.categoryScale.set(pointToBandAdapter(layout.categoryScale, range));
  ctx.valueScale.set(cloneLinear(layout.valueScale));
  ctx.categories.set(layout.categories);
}
