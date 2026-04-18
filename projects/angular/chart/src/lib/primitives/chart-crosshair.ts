import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ChartContext } from '../core/chart-context';
import { CartesianContext } from '../core/cartesian-context';

/**
 * Crosshair primitive — a line drawn through the currently active data point
 * perpendicular to the categorical axis. Reads `activePoint` from
 * `ChartContext` and the scales from `CartesianContext`.
 *
 * Place inside a cartesian chart's SVG inner group.
 */
@Component({
  selector: 'svg:g[ui-chart-crosshair]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'chart-crosshair' },
  template: `
    @if (line(); as l) {
      <svg:line
        class="stroke-border"
        stroke-dasharray="3 3"
        [attr.x1]="l.x1"
        [attr.x2]="l.x2"
        [attr.y1]="l.y1"
        [attr.y2]="l.y2" />
    }
  `,
})
export class ChartCrosshair {
  private readonly root = inject(ChartContext);
  private readonly cart = inject(CartesianContext);

  protected readonly line = computed(() => {
    const active = this.root.activePoint();
    const scale = this.cart.categoryScale();
    const categories = this.cart.categories();
    if (!active || !scale || active.index < 0 || active.index >= categories.length) {
      return null;
    }
    const base = scale(categories[active.index]) ?? 0;
    const pos = base + scale.bandwidth() / 2;
    if (this.cart.orientation() === 'vertical') {
      return { x1: pos, x2: pos, y1: 0, y2: this.cart.innerHeight() };
    }
    return { x1: 0, x2: this.cart.innerWidth(), y1: pos, y2: pos };
  });
}
