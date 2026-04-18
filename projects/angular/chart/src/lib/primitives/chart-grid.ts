import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CartesianContext } from '../core/cartesian-context';
import { linearTicks } from '../core/ticks';

/**
 * Horizontal / vertical grid lines for the cartesian plotting area.
 *
 * Reads tick positions from `CartesianContext.valueScale`. Direction of the
 * grid lines follows `orientation`:
 *  - vertical   → horizontal grid lines (one per y-tick)
 *  - horizontal → vertical grid lines (one per x-tick)
 */
@Component({
  selector: 'svg:g[ui-chart-grid]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'chart-grid text-border',
  },
  template: `
    @for (t of ticks(); track t.value) {
      <svg:line
        class="stroke-border"
        stroke-dasharray="3 3"
        [attr.x1]="line(t.offset).x1"
        [attr.x2]="line(t.offset).x2"
        [attr.y1]="line(t.offset).y1"
        [attr.y2]="line(t.offset).y2" />
    }
  `,
})
export class ChartGrid {
  private readonly ctx = inject(CartesianContext);

  readonly tickCount = input<number>(5);

  protected readonly ticks = computed(() => {
    const scale = this.ctx.valueScale();
    return scale ? linearTicks(scale, this.tickCount()) : [];
  });

  protected readonly line = (offset: number) => {
    if (this.ctx.orientation() === 'vertical') {
      return { x1: 0, x2: this.ctx.innerWidth(), y1: offset, y2: offset };
    }
    return { x1: offset, x2: offset, y1: 0, y2: this.ctx.innerHeight() };
  };
}
