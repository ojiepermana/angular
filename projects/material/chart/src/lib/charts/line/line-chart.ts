import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { ChartContext } from '../../core/chart-context';
import {
  CartesianContext,
  type ChartDatum,
  type ChartMargin,
  type ChartOrientation,
} from '../../core/cartesian-context';
import { CategoricalViewportContext } from '../../core/categorical-viewport-context';
import { computeLineLayout, type LineCurve, type LinePoint, type LineSeriesPath } from './line-layout';
import { provideCartesianFromLineLayout } from './cartesian-adapter';
import { ChartPointerTracker } from '../../primitives/chart-pointer-tracker';
import { elementClientCenter } from '../../core/pointer-util';
import { sliceByIndexRange } from '../../core/viewport';

const DEFAULT_MARGIN: ChartMargin = { top: 8, right: 8, bottom: 24, left: 40 };
const defaultLineValueFormatter = (value: number): string => `${value}`;

/** Emitted when a data point is activated (click or keyboard). */
export interface LinePointClickEvent {
  readonly seriesKey: string;
  readonly datumIndex: number;
  readonly category: string;
  readonly value: number;
  readonly datum: ChartDatum;
}

@Component({
  selector: 'ui-line-chart',
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
      <svg:g [attr.transform]="innerTransform()">
        <ng-content select="svg\\:g[ui-chart-grid]" />
        <svg:g class="chart-lines">
          @for (s of series(); track s.seriesKey) {
            <svg:path
              class="chart-line"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.stroke]="s.color"
              [attr.stroke-width]="strokeWidth()"
              [attr.d]="s.linePath" />
            @if (showDots()) {
              @for (p of s.points; track p.datumIndex) {
                <svg:circle
                  class="chart-dot cursor-pointer outline-none"
                  [attr.cx]="p.x"
                  [attr.cy]="p.y"
                  [attr.r]="dotRadius()"
                  [attr.fill]="dotFill(p, s.color)"
                  [attr.stroke]="dotStrokeColor()"
                  [attr.stroke-width]="dotStrokeWidth() || null"
                  [attr.aria-label]="pointAriaLabel(p)"
                  tabindex="0"
                  (focus)="setActivePoint($event, p)"
                  (blur)="clearActivePoint()"
                  (click)="emitClick(p)"
                  (keydown.enter)="emitClick(p)"
                  (keydown.space)="emitClick(p); $event.preventDefault()" />
                @if (showValueLabels()) {
                  <svg:text
                    class="chart-line-value pointer-events-none fill-muted-foreground text-[10px]"
                    [attr.x]="labelX(p)"
                    [attr.y]="labelY(p)"
                    [attr.text-anchor]="labelAnchor()"
                    dominant-baseline="middle">
                    {{ formatValueLabel(p) }}
                  </svg:text>
                }
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
export class LineChart {
  private readonly root = inject(ChartContext);
  private readonly cart = inject(CartesianContext);
  private readonly viewport = inject(CategoricalViewportContext);

  readonly data = input.required<readonly ChartDatum[]>();
  readonly xKey = input.required<string>();
  readonly orientation = input<ChartOrientation>('vertical');
  readonly curve = input<LineCurve>('monotone');
  readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
  readonly strokeWidth = input<number>(2);
  readonly showDots = input<boolean>(true);
  readonly dotRadius = input<number>(3);
  readonly dotColorKey = input<string | undefined>(undefined);
  readonly dotStrokeColor = input<string | undefined>(undefined);
  readonly dotStrokeWidth = input<number>(0);
  readonly showValueLabels = input<boolean>(false);
  readonly valueLabelFormat = input<(value: number) => string>(defaultLineValueFormatter);

  readonly pointClick = output<LinePointClickEvent>();

  protected readonly innerWidth = computed(() =>
    Math.max(0, this.root.dimensions().width - this.margin().left - this.margin().right),
  );
  protected readonly innerHeight = computed(() =>
    Math.max(0, this.root.dimensions().height - this.margin().top - this.margin().bottom),
  );

  protected readonly visibleStartIndex = computed(() => this.viewport.zoomRange()?.startIndex ?? 0);
  protected readonly visibleData = computed(() => sliceByIndexRange(this.data(), this.viewport.zoomRange()));

  protected readonly layout = computed(() =>
    computeLineLayout({
      data: this.visibleData(),
      xKey: this.xKey(),
      seriesKeys: this.root.visibleSeriesKeys(),
      orientation: this.orientation(),
      innerWidth: this.innerWidth(),
      innerHeight: this.innerHeight(),
      curve: this.curve(),
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
    return `Line chart, ${this.visibleData().length} points, ${keys.length} series: ${keys.join(', ')}.`;
  });

  constructor() {
    effect(() => {
      const layout = this.layout();
      this.viewport.dataCount.set(this.data().length);
      provideCartesianFromLineLayout(this.cart, layout, this.orientation(), this.innerWidth(), this.innerHeight());
      this.cart.margin.set(this.margin());
    });
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

  protected dotFill(point: LinePoint, fallbackColor: string): string {
    const colorKey = this.dotColorKey();
    if (!colorKey) {
      return fallbackColor;
    }

    const datum = this.visibleData()[point.datumIndex];
    const raw = datum?.[colorKey];
    if (typeof raw !== 'string' || raw.length === 0) {
      return fallbackColor;
    }

    if (
      raw.startsWith('var(') ||
      raw.startsWith('#') ||
      raw.startsWith('rgb') ||
      raw.startsWith('hsl') ||
      raw.includes('(')
    ) {
      return raw;
    }

    return `var(--color-${raw.replace(/[^a-zA-Z0-9_-]/g, '_')})`;
  }

  protected formatValueLabel(point: LinePoint): string {
    return this.valueLabelFormat()(point.value);
  }

  protected labelX(point: LinePoint): number {
    return this.orientation() === 'vertical' ? point.x : point.x + this.dotRadius() + 6;
  }

  protected labelY(point: LinePoint): number {
    return this.orientation() === 'vertical' ? point.y - this.dotRadius() - 8 : point.y;
  }

  protected labelAnchor(): 'middle' | 'start' {
    return this.orientation() === 'vertical' ? 'middle' : 'start';
  }

  protected pointAriaLabel(p: LinePoint): string {
    const label = this.root.config()[p.seriesKey]?.label ?? p.seriesKey;
    return `${label} at ${p.category}: ${p.value}`;
  }
}
