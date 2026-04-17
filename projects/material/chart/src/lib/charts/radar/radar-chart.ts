import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ChartContext } from '../../core/chart-context';
import type { ChartDatum, ChartMargin } from '../../core/cartesian-context';
import { computeRadarLayout, type RadarCurve } from './radar-layout';

const DEFAULT_MARGIN: ChartMargin = { top: 24, right: 24, bottom: 24, left: 24 };

@Component({
  selector: 'ui-radar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block h-full w-full' },
  template: `
    <svg:svg
      class="block h-full w-full overflow-visible"
      [attr.viewBox]="viewBox()"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      [attr.aria-label]="ariaSummary()">
      <svg:g [attr.transform]="innerTransform()">
        <svg:g class="chart-radar" [attr.transform]="'translate(' + layout().centerX + ',' + layout().centerY + ')'">
          <!-- Level rings -->
          @for (lvl of layout().levels; track $index) {
            <svg:circle
              class="chart-radar-level fill-none stroke-border"
              stroke-dasharray="2 2"
              cx="0"
              cy="0"
              [attr.r]="(($index + 1) * layout().radius) / layout().levels.length" />
          }
          <!-- Axes -->
          @for (axis of layout().axes; track axis.name) {
            <svg:line class="chart-radar-axis stroke-border" x1="0" y1="0" [attr.x2]="axis.x" [attr.y2]="axis.y" />
            @if (showLabels()) {
              <svg:text
                class="chart-radar-axis-label fill-muted-foreground text-[10px]"
                text-anchor="middle"
                dominant-baseline="middle"
                [attr.x]="axis.x * 1.12"
                [attr.y]="axis.y * 1.12">
                {{ axis.name }}
              </svg:text>
            }
          }
          <!-- Series -->
          @for (s of layout().series; track s.seriesKey) {
            <svg:path
              class="chart-radar-series"
              [attr.d]="s.path"
              [attr.stroke]="s.color"
              [attr.fill]="s.color"
              [attr.fill-opacity]="fillOpacity()"
              [attr.stroke-width]="strokeWidth()"
              stroke-linejoin="round" />
            @if (showDots()) {
              @for (p of s.points; track p.axis) {
                <svg:circle
                  class="chart-radar-dot"
                  [attr.cx]="p.x"
                  [attr.cy]="p.y"
                  [attr.r]="dotRadius()"
                  [attr.fill]="s.color" />
              }
            }
          }
        </svg:g>
        <ng-content />
      </svg:g>
    </svg:svg>
    <ng-content select="ui-chart-legend" />
  `,
})
export class RadarChart {
  private readonly root = inject(ChartContext);

  readonly data = input.required<readonly ChartDatum[]>();
  /** Field on each datum used as the axis label (one axis per row). */
  readonly axisKey = input.required<string>();
  readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
  readonly curve = input<RadarCurve>('linear');
  readonly levels = input<number>(4);
  readonly maxValue = input<number | undefined>(undefined);
  readonly strokeWidth = input<number>(2);
  readonly fillOpacity = input<number>(0.2);
  readonly showLabels = input<boolean>(true);
  readonly showDots = input<boolean>(true);
  readonly dotRadius = input<number>(3);

  protected readonly innerWidth = computed(() =>
    Math.max(0, this.root.dimensions().width - this.margin().left - this.margin().right),
  );
  protected readonly innerHeight = computed(() =>
    Math.max(0, this.root.dimensions().height - this.margin().top - this.margin().bottom),
  );

  protected readonly layout = computed(() =>
    computeRadarLayout({
      data: this.data(),
      axisKey: this.axisKey(),
      seriesKeys: this.root.visibleSeriesKeys(),
      innerWidth: this.innerWidth(),
      innerHeight: this.innerHeight(),
      maxValue: this.maxValue(),
      levels: this.levels(),
      curve: this.curve(),
    }),
  );

  protected readonly viewBox = computed(() => {
    const { width, height } = this.root.dimensions();
    return `0 0 ${Math.max(0, width)} ${Math.max(0, height)}`;
  });

  protected readonly innerTransform = computed(() => `translate(${this.margin().left},${this.margin().top})`);

  protected readonly ariaSummary = computed(() => {
    const keys = this.root.visibleSeriesKeys();
    return `Radar chart, ${this.data().length} axes, ${keys.length} series.`;
  });
}
