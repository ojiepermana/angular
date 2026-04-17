import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CartesianContext } from '../core/cartesian-context';
import { bandTicks, linearTicks, type ChartTick } from '../core/ticks';

/**
 * X axis for a cartesian chart. Reads scales from `CartesianContext`.
 *
 * Renders as `<svg:g>` — must be placed inside the owning chart's SVG.
 */
@Component({
  selector: 'svg:g[ui-chart-axis-x]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'chart-axis chart-axis-x text-muted-foreground',
    '[attr.transform]': 'transform()',
  },
  template: `
    <svg:line class="stroke-border" [attr.x1]="0" [attr.x2]="innerWidth()" y1="0" y2="0" />
    @for (t of ticks(); track t.value) {
      <svg:g [attr.transform]="'translate(' + t.offset + ',0)'">
        @if (tickLine()) {
          <svg:line class="stroke-border" y1="0" y2="6" />
        }
        <svg:text class="fill-current" y="18" text-anchor="middle" font-size="12">{{ t.label }}</svg:text>
      </svg:g>
    }
  `,
})
export class ChartAxisX {
  private readonly ctx = inject(CartesianContext);

  /** Approximate tick count for linear (value) scales. */
  readonly tickCount = input<number>(5);
  /** Show 6-px tick marks between the axis line and the labels. */
  readonly tickLine = input<boolean>(true);
  /** Formatter for numeric tick labels. */
  readonly tickFormat = input<(value: number) => string>((v) => String(v));

  protected readonly innerWidth = this.ctx.innerWidth;
  protected readonly transform = computed(() => `translate(0,${this.ctx.innerHeight()})`);

  protected readonly ticks = computed<ChartTick[]>(() => {
    const horizontal = this.ctx.orientation() === 'horizontal';
    if (horizontal) {
      const scale = this.ctx.valueScale();
      return scale ? linearTicks(scale, this.tickCount(), this.tickFormat()) : [];
    }
    const scale = this.ctx.categoryScale();
    return scale ? bandTicks(scale) : [];
  });
}
