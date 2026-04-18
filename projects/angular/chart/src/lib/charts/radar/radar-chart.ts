import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ChartContext } from '../../core/chart-context';
import type { ChartDatum, ChartMargin } from '../../core/cartesian-context';
import { computeRadarLayout, type RadarCurve, type RadarGrid } from './radar-layout';

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
          @if (layout().grid !== 'none') {
            @for (level of layout().levels; track level.value; let levelIndex = $index) {
              @if (layout().grid === 'circle') {
                <svg:circle
                  class="chart-radar-level stroke-border"
                  [attr.fill]="gridFill()"
                  [attr.fill-opacity]="gridFillOpacity(levelIndex)"
                  stroke-dasharray="2 2"
                  cx="0"
                  cy="0"
                  [attr.r]="level.radius" />
              } @else {
                <svg:path
                  class="chart-radar-level stroke-border"
                  [attr.d]="level.path"
                  [attr.fill]="gridFill()"
                  [attr.fill-opacity]="gridFillOpacity(levelIndex)"
                  stroke-dasharray="2 2" />
              }
            }
          }
          @if (showAxes()) {
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
          }
          @for (s of layout().series; track s.seriesKey) {
            <svg:path
              class="chart-radar-series"
              [attr.d]="s.path"
              [attr.stroke]="s.color"
              [attr.fill]="linesOnly() ? 'none' : s.color"
              [attr.fill-opacity]="linesOnly() ? null : fillOpacity()"
              [attr.stroke-width]="strokeWidth()"
              stroke-linejoin="round" />
            @if (showDots()) {
              @for (p of s.points; track p.axis; let i = $index) {
                <svg:circle
                  class="chart-radar-dot cursor-pointer"
                  [attr.cx]="p.x"
                  [attr.cy]="p.y"
                  [attr.r]="dotRadius()"
                  [attr.fill]="s.color"
                  tabindex="0"
                  [attr.aria-label]="dotAriaLabel(s.seriesKey, p)"
                  (pointerenter)="setActive($event, s.seriesKey, i)"
                  (pointermove)="setActive($event, s.seriesKey, i)"
                  (pointerleave)="clearActive()"
                  (focus)="setActive($event, s.seriesKey, i)"
                  (blur)="clearActive()" />
              }
            }
          }
        </svg:g>
        <ng-content />
      </svg:g>
    </svg:svg>
    <ng-content select="ui-chart-tooltip" />
    <ng-content select="ui-chart-legend" />
  `,
})
export class RadarChart {
  private readonly root = inject(ChartContext);

  readonly data = input.required<readonly ChartDatum[]>();
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
  readonly grid = input<RadarGrid>('circle');
  readonly gridFilled = input<boolean>(false);
  readonly showAxes = input<boolean>(true);
  readonly linesOnly = input<boolean>(false);

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
      grid: this.grid(),
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

  protected gridFill(): string {
    return this.gridFilled() ? 'hsl(var(--muted))' : 'none';
  }

  protected gridFillOpacity(levelIndex: number): number | null {
    return this.gridFilled() ? Math.max(0.06, 0.18 - levelIndex * 0.02) : null;
  }

  protected dotAriaLabel(seriesKey: string, p: { axis: string; value: number }): string {
    const label = this.root.config()[seriesKey]?.label ?? seriesKey;
    return `${label} at ${p.axis}: ${p.value}`;
  }

  protected setActive(event: PointerEvent | FocusEvent, seriesKey: string, index: number): void {
    const clientX =
      event instanceof PointerEvent ? event.clientX : (event.target as Element).getBoundingClientRect().left;
    const clientY =
      event instanceof PointerEvent ? event.clientY : (event.target as Element).getBoundingClientRect().top;
    this.root.activePoint.set({ index, datumIndex: index, seriesKey, clientX, clientY });
  }

  protected clearActive(): void {
    this.root.activePoint.set(null);
  }
}
