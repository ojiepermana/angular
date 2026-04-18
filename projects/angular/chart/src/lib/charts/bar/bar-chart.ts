import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { ChartContext } from '../../core/chart-context';
import {
  CartesianContext,
  type ChartDatum,
  type ChartMargin,
  type ChartOrientation,
} from '../../core/cartesian-context';
import { computeBarLayout, type BarRect, type BarVariant } from './bar-layout';
import { ChartPointerTracker } from '../../primitives/chart-pointer-tracker';
import { elementClientCenter } from '../../core/pointer-util';

const DEFAULT_MARGIN: ChartMargin = { top: 8, right: 8, bottom: 24, left: 40 };
const defaultBarValueFormatter = (value: number): string => `${value}`;

/** Event emitted when a user clicks a bar. */
export interface BarClickEvent {
  readonly seriesKey: string;
  readonly datumIndex: number;
  readonly category: string;
  readonly value: number;
  readonly datum: ChartDatum;
}

/**
 * Bar chart — composable within `<ui-chart-container>`.
 *
 * Layout variants (via inputs):
 * - `orientation`: `'vertical'` (default) or `'horizontal'`
 * - `variant`:     `'grouped'`  (default) or `'stacked'`
 */
@Component({
  selector: 'ui-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartesianContext],
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
        <svg:g class="chart-bars">
          @for (bar of bars(); track bar.key) {
            <svg:rect
              class="chart-bar cursor-pointer outline-none transition-opacity hover:opacity-80"
              [attr.x]="bar.x"
              [attr.y]="bar.y"
              [attr.width]="bar.width"
              [attr.height]="bar.height"
              [attr.rx]="cornerRadius()"
              [attr.ry]="cornerRadius()"
              [attr.fill]="bar.color"
              [attr.opacity]="barOpacity(bar)"
              [attr.stroke]="bar.active ? 'hsl(var(--foreground))' : null"
              [attr.stroke-width]="bar.active ? 1.5 : null"
              [attr.aria-label]="barAriaLabel(bar)"
              tabindex="0"
              (focus)="setActivePoint($event, bar)"
              (blur)="clearActivePoint()"
              (click)="emitClick(bar)"
              (keydown.enter)="emitClick(bar)"
              (keydown.space)="emitClick(bar); $event.preventDefault()" />
            @if (showValueLabels() && bar.height > 0 && bar.width > 0) {
              <svg:text
                class="chart-bar-value pointer-events-none fill-muted-foreground text-[10px]"
                [attr.x]="barLabelX(bar)"
                [attr.y]="barLabelY(bar)"
                [attr.text-anchor]="barLabelAnchor(bar)"
                dominant-baseline="middle">
                {{ formatValueLabel(bar) }}
              </svg:text>
            }
          }
        </svg:g>
        <ng-content select="svg\\:g[ui-chart-axis-x]" />
        <ng-content select="svg\\:g[ui-chart-axis-y]" />
        <ng-content select="svg\\:g[ui-chart-crosshair]" />
        <ng-content />
      </svg:g>
    </svg:svg>
    <ng-content select="ui-chart-tooltip" />
    <ng-content select="ui-chart-legend" />
  `,
})
export class BarChart {
  private readonly root = inject(ChartContext);
  private readonly cart = inject(CartesianContext);

  readonly data = input.required<readonly ChartDatum[]>();
  readonly xKey = input.required<string>();
  readonly orientation = input<ChartOrientation>('vertical');
  readonly variant = input<BarVariant>('grouped');
  readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
  readonly bandPadding = input<number>(0.2);
  readonly groupPadding = input<number>(0.05);
  readonly cornerRadius = input<number>(4);
  readonly colorKey = input<string | undefined>(undefined);
  readonly activeKey = input<string | undefined>(undefined);
  readonly activeValue = input<string | number | undefined>(undefined);
  readonly showValueLabels = input<boolean>(false);
  readonly valueLabelFormat = input<(value: number) => string>(defaultBarValueFormatter);

  readonly barClick = output<BarClickEvent>();

  protected readonly innerWidth = computed(() =>
    Math.max(0, this.root.dimensions().width - this.margin().left - this.margin().right),
  );

  protected readonly innerHeight = computed(() =>
    Math.max(0, this.root.dimensions().height - this.margin().top - this.margin().bottom),
  );

  protected readonly layout = computed(() =>
    computeBarLayout({
      data: this.data(),
      xKey: this.xKey(),
      seriesKeys: this.root.visibleSeriesKeys(),
      variant: this.variant(),
      orientation: this.orientation(),
      innerWidth: this.innerWidth(),
      innerHeight: this.innerHeight(),
      bandPadding: this.bandPadding(),
      groupPadding: this.groupPadding(),
      colorKey: this.colorKey(),
      activeKey: this.activeKey(),
      activeValue: this.activeValue(),
    }),
  );

  protected readonly bars = computed<readonly BarRect[]>(() => this.layout().bars);

  protected readonly viewBox = computed(() => {
    const { width, height } = this.root.dimensions();
    return `0 0 ${Math.max(0, width)} ${Math.max(0, height)}`;
  });

  protected readonly innerTransform = computed(() => `translate(${this.margin().left},${this.margin().top})`);

  protected readonly ariaSummary = computed(() => {
    const keys = this.root.visibleSeriesKeys();
    const n = this.data().length;
    return `Bar chart, ${n} categories, ${keys.length} series: ${keys.join(', ')}.`;
  });

  constructor() {
    effect(() => {
      const layout = this.layout();
      this.cart.orientation.set(this.orientation());
      this.cart.margin.set(this.margin());
      this.cart.innerWidth.set(this.innerWidth());
      this.cart.innerHeight.set(this.innerHeight());
      this.cart.categoryScale.set(layout.categoryScale);
      this.cart.valueScale.set(layout.valueScale);
      this.cart.categories.set(layout.categories);
    });
  }

  protected emitClick(bar: BarRect): void {
    this.barClick.emit({
      seriesKey: bar.seriesKey,
      datumIndex: bar.datumIndex,
      category: bar.category,
      value: bar.value,
      datum: this.data()[bar.datumIndex],
    });
  }

  protected setActivePoint(event: FocusEvent, bar: BarRect): void {
    const center = elementClientCenter(event.currentTarget);
    this.root.activePoint.set({
      index: bar.datumIndex,
      seriesKey: bar.seriesKey,
      clientX: center?.clientX,
      clientY: center?.clientY,
    });
  }

  protected clearActivePoint(): void {
    this.root.activePoint.set(null);
  }

  protected barOpacity(bar: BarRect): number {
    return this.activeKey() && this.activeValue() !== undefined ? (bar.active ? 1 : 0.42) : 1;
  }

  protected formatValueLabel(bar: BarRect): string {
    return this.valueLabelFormat()(bar.value);
  }

  protected barLabelX(bar: BarRect): number {
    if (this.orientation() === 'vertical') {
      return bar.x + bar.width / 2;
    }

    return bar.value >= 0 ? bar.x + bar.width + 6 : bar.x - 6;
  }

  protected barLabelY(bar: BarRect): number {
    if (this.orientation() === 'vertical') {
      return bar.value >= 0 ? bar.y - 8 : bar.y + bar.height + 10;
    }

    return bar.y + bar.height / 2;
  }

  protected barLabelAnchor(bar: BarRect): 'middle' | 'start' | 'end' {
    if (this.orientation() === 'vertical') {
      return 'middle';
    }

    return bar.value >= 0 ? 'start' : 'end';
  }

  protected barAriaLabel(bar: BarRect): string {
    const label = this.root.config()[bar.seriesKey]?.label ?? bar.seriesKey;
    return `${label} in ${bar.category}: ${bar.value}`;
  }
}
