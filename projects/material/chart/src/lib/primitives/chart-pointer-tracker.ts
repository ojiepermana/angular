import { Directive, inject } from '@angular/core';
import { ChartContext } from '../core/chart-context';
import { CartesianContext } from '../core/cartesian-context';
import { nearestCategoryIndex } from '../core/pointer-util';
import { CategoricalViewportContext } from '../core/categorical-viewport-context';

/**
 * Attach to a chart's `<svg:svg>` to publish pointer-driven active-point
 * state into the surrounding `ChartContext`.
 *
 * Computes the local (x, y) of the pointer relative to the inner plotting
 * area, resolves the nearest category, and updates
 * `ChartContext.activePoint`. Clears it on `pointerleave`.
 */
@Directive({
  selector: 'svg:svg[uiChartPointerTracker]',
  host: {
    '(pointermove)': 'onMove($event)',
    '(pointerleave)': 'onLeave()',
  },
})
export class ChartPointerTracker {
  private readonly root = inject(ChartContext);
  private readonly cart = inject(CartesianContext);
  private readonly viewport = inject(CategoricalViewportContext, { optional: true });

  protected onMove(event: PointerEvent): void {
    const target = event.currentTarget as SVGSVGElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const { width, height } = this.root.dimensions();
    // Map client coords → viewBox coords (SVG uses `0 0 width height`,
    // preserveAspectRatio="none" so axes scale independently).
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const viewX = (event.clientX - rect.left) * scaleX;
    const viewY = (event.clientY - rect.top) * scaleY;

    const margin = this.cart.margin();
    const localX = viewX - margin.left;
    const localY = viewY - margin.top;

    const index = nearestCategoryIndex(
      {
        categoryScale: this.cart.categoryScale,
        categories: this.cart.categories,
        orientation: this.cart.orientation,
      },
      localX,
      localY,
    );
    if (index < 0) {
      this.root.activePoint.set(null);
      return;
    }
    this.root.activePoint.set({
      index,
      datumIndex: (this.viewport?.zoomRange()?.startIndex ?? 0) + index,
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }

  protected onLeave(): void {
    this.root.activePoint.set(null);
  }
}
