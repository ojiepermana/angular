import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CartesianContext } from '../core/cartesian-context';
import { bandTicks, linearTicks, type ChartTick } from '../core/ticks';

/**
 * Y axis for a cartesian chart. Reads scales from `CartesianContext`.
 *
 * Renders as `<svg:g>` — must be placed inside the owning chart's SVG.
 */
@Component({
  selector: 'svg:g[ui-chart-axis-y]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'chart-axis chart-axis-y text-muted-foreground',
  },
  template: `
    <svg:line class="stroke-border" x1="0" x2="0" [attr.y1]="0" [attr.y2]="innerHeight()" />
    @for (t of ticks(); track t.value) {
      <svg:g [attr.transform]="'translate(0,' + t.offset + ')'">
        @if (tickLine()) {
          <svg:line class="stroke-border" x1="-6" x2="0" />
        }
        <svg:text class="fill-current" x="-8" dy="0.32em" text-anchor="end" font-size="12">{{ t.label }}</svg:text>
      </svg:g>
    }
  `,
})
export class ChartAxisY {
  private readonly ctx = inject(CartesianContext);

  readonly tickCount = input<number>(5);
  readonly tickLine = input<boolean>(true);
  readonly tickFormat = input<(value: number) => string>((v) => String(v));

  protected readonly innerHeight = this.ctx.innerHeight;

  protected readonly ticks = computed<ChartTick[]>(() => {
    const horizontal = this.ctx.orientation() === 'horizontal';
    if (horizontal) {
      const scale = this.ctx.categoryScale();
      return scale ? bandTicks(scale) : [];
    }
    const scale = this.ctx.valueScale();
    return scale ? linearTicks(scale, this.tickCount(), this.tickFormat()) : [];
  });
}
