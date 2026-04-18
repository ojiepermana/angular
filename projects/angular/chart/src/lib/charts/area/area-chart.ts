import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { ChartContext } from '../../core/chart-context';
import {
  CartesianContext,
  type ChartDatum,
  type ChartMargin,
  type ChartOrientation,
} from '../../core/cartesian-context';
import { CategoricalViewportContext } from '../../core/categorical-viewport-context';
import { computeAreaLayout, type LineCurve, type LinePoint, type LineSeriesPath } from '../line/line-layout';
import { provideCartesianFromLineLayout } from '../line/cartesian-adapter';
import { ChartPointerTracker } from '../../primitives/chart-pointer-tracker';
import { elementClientCenter } from '../../core/pointer-util';
import { sliceByIndexRange } from '../../core/viewport';

const DEFAULT_MARGIN: ChartMargin = { top: 8, right: 8, bottom: 24, left: 40 };

export interface AreaPointClickEvent {
  readonly seriesKey: string;
  readonly datumIndex: number;
  readonly category: string;
  readonly value: number;
  readonly datum: ChartDatum;
}

/**
 * Area chart — composable within `<ui-chart-container>`.
 *
 * - `stacked=true` stacks series along the value axis.
 * - `gradient=true` fills each area with a vertical linear-gradient from
 *   the series color (top) to transparent (bottom). The gradient is
 *   emitted as `<defs><linearGradient>` per series, unique per chart id.
 */
@Component({
  selector: 'ui-area-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartesianContext, CategoricalViewportContext],
  imports: [ChartPointerTracker],
  host: { class: 'relative block h-full w-full' },
  template: `
    <svg:svg
      uiChartPointerTracker
      class="block h-full w-full overflow-visible"
      [attr.viewBox]="viewBox()"
      preserveAspectRatio="none"
      role="img"
      [attr.aria-label]="ariaSummary()">
      @if (gradient()) {
        <svg:defs>
          @for (s of series(); track s.seriesKey) {
            <svg:linearGradient [attr.id]="gradientId(s.seriesKey)" x1="0" y1="0" x2="0" y2="1">
              <svg:stop offset="0%" [attr.stop-color]="s.color" stop-opacity="0.4" />
              <svg:stop offset="100%" [attr.stop-color]="s.color" stop-opacity="0" />
            </svg:linearGradient>
          }
        </svg:defs>
      }
      <svg:g [attr.transform]="innerTransform()">
        <ng-content select="svg\\:g[ui-chart-grid]" />
        <svg:g class="chart-areas">
          @for (s of series(); track s.seriesKey) {
            <svg:path
              class="chart-area"
              [attr.d]="s.areaPath"
              [attr.fill]="areaFill(s.seriesKey, s.color)"
              stroke="none" />
            <svg:path
              class="chart-area-stroke"
              [attr.d]="s.linePath"
              [attr.stroke]="s.color"
              [attr.stroke-width]="strokeWidth()"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round" />
            @if (showDots()) {
              @for (p of s.points; track p.datumIndex) {
                <svg:circle
                  class="chart-dot cursor-pointer outline-none"
                  [attr.cx]="p.x"
                  [attr.cy]="p.y"
                  [attr.r]="dotRadius()"
                  [attr.fill]="s.color"
                  [attr.aria-label]="pointAriaLabel(p)"
                  tabindex="0"
                  (focus)="setActivePoint($event, p)"
                  (blur)="clearActivePoint()"
                  (click)="emitClick(p)"
                  (keydown.enter)="emitClick(p)"
                  (keydown.space)="emitClick(p); $event.preventDefault()" />
              }
            }
          }
        </svg:g>
        <ng-content select="svg\\:g[ui-chart-axis-x]" />
        <ng-content select="svg\\:g[ui-chart-axis-y]" />
        <ng-content select="svg\\:g[ui-chart-crosshair]" />
        <ng-content select="svg:g[ui-chart-brush]" />
      </svg:g>
    </svg:svg>
    <ng-content select="ui-chart-tooltip" />
    <ng-content select="ui-chart-legend" />
    <ng-content select="ui-chart-zoom-controls" />
  `,
})
export class AreaChart {
  private readonly root = inject(ChartContext);
  private readonly cart = inject(CartesianContext);
  private readonly viewport = inject(CategoricalViewportContext);

  readonly data = input.required<readonly ChartDatum[]>();
  readonly xKey = input.required<string>();
  readonly orientation = input<ChartOrientation>('vertical');
  readonly stacked = input<boolean>(false);
  readonly expanded = input<boolean>(false);
  readonly gradient = input<boolean>(true);
  readonly curve = input<LineCurve>('monotone');
  readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
  readonly strokeWidth = input<number>(2);
  readonly showDots = input<boolean>(false);
  readonly dotRadius = input<number>(3);

  readonly pointClick = output<AreaPointClickEvent>();

  protected readonly innerWidth = computed(() =>
    Math.max(0, this.root.dimensions().width - this.margin().left - this.margin().right),
  );
  protected readonly innerHeight = computed(() =>
    Math.max(0, this.root.dimensions().height - this.margin().top - this.margin().bottom),
  );

  protected readonly visibleStartIndex = computed(() => this.viewport.zoomRange()?.startIndex ?? 0);

  protected readonly visibleData = computed(() => sliceByIndexRange(this.data(), this.viewport.zoomRange()));

  protected readonly layout = computed(() =>
    computeAreaLayout({
      data: this.visibleData(),
      xKey: this.xKey(),
      seriesKeys: this.root.visibleSeriesKeys(),
      orientation: this.orientation(),
      innerWidth: this.innerWidth(),
      innerHeight: this.innerHeight(),
      curve: this.curve(),
      stacked: this.stacked(),
      expanded: this.expanded(),
    }),
  );

  protected readonly series = computed<readonly LineSeriesPath[]>(() => this.layout().series);

  protected readonly viewBox = computed(() => {
    const { width, height } = this.root.dimensions();
    return `0 0 ${Math.max(0, width)} ${Math.max(0, height)}`;
  });

  protected readonly innerTransform = computed(() => `translate(${this.margin().left},${this.margin().top})`);

  protected readonly ariaSummary = computed(() => {
    const keys = this.root.visibleSeriesKeys();
    return `Area chart, ${this.visibleData().length} points, ${keys.length} series: ${keys.join(', ')}.`;
  });

  constructor() {
    effect(() => {
      const layout = this.layout();
      this.viewport.dataCount.set(this.data().length);
      provideCartesianFromLineLayout(this.cart, layout, this.orientation(), this.innerWidth(), this.innerHeight());
      this.cart.margin.set(this.margin());
    });
  }

  protected gradientId(seriesKey: string): string {
    return `${this.root.id()}-grad-${seriesKey.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  }

  protected areaFill(seriesKey: string, color: string): string {
    return this.gradient() ? `url(#${this.gradientId(seriesKey)})` : color;
  }

  protected emitClick(p: LinePoint): void {
    const datumIndex = this.visibleStartIndex() + p.datumIndex;
    this.pointClick.emit({
      seriesKey: p.seriesKey,
      datumIndex,
      category: p.category,
      value: p.value,
      datum: this.data()[datumIndex],
    });
  }

  protected setActivePoint(event: FocusEvent, p: LinePoint): void {
    const center = elementClientCenter(event.currentTarget);
    const datumIndex = this.visibleStartIndex() + p.datumIndex;
    this.root.activePoint.set({
      index: p.datumIndex,
      datumIndex,
      seriesKey: p.seriesKey,
      clientX: center?.clientX,
      clientY: center?.clientY,
    });
  }

  protected clearActivePoint(): void {
    this.root.activePoint.set(null);
  }

  protected pointAriaLabel(p: LinePoint): string {
    const label = this.root.config()[p.seriesKey]?.label ?? p.seriesKey;
    return `${label} at ${p.category}: ${p.value}`;
  }
}
