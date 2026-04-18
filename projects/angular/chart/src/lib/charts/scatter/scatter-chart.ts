import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { ChartContext } from '../../core/chart-context';
import type { ChartDatum, ChartMargin } from '../../core/cartesian-context';
import { ScatterViewportContext } from '../../core/scatter-viewport-context';
import { computeScatterLayout, resolveScatterDomains, type ScatterPoint } from './scatter-layout';

const DEFAULT_MARGIN: ChartMargin = { top: 8, right: 8, bottom: 24, left: 40 };

export interface ScatterPointClickEvent {
  readonly seriesKey: string;
  readonly datumIndex: number;
  readonly x: number;
  readonly y: number;
  readonly datum: ChartDatum;
}

/**
 * Scatter chart — one dot per datum. Both axes are linear; color can
 * come from a fixed series key or per-row via `seriesKey` field. Point
 * radius optionally scales with `sizeKey`.
 */
@Component({
  selector: 'ui-scatter-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ScatterViewportContext],
  host: { class: 'relative block h-full w-full' },
  template: `
    <svg:svg
      class="block h-full w-full overflow-visible"
      [attr.viewBox]="viewBox()"
      preserveAspectRatio="none"
      role="img"
      [attr.aria-label]="ariaSummary()">
      <svg:defs>
        <svg:clipPath [attr.id]="clipPathId()">
          <svg:rect x="0" y="0" [attr.width]="innerWidth()" [attr.height]="innerHeight()" />
        </svg:clipPath>
      </svg:defs>
      <svg:g [attr.transform]="innerTransform()">
        <svg:g class="chart-scatter" [attr.clip-path]="'url(#' + clipPathId() + ')'">
          @for (p of layout().points; track p.datumIndex) {
            <svg:circle
              class="chart-scatter-point cursor-pointer transition-opacity hover:opacity-80"
              [attr.cx]="p.x"
              [attr.cy]="p.y"
              [attr.r]="p.radius"
              [attr.fill]="p.color"
              [attr.aria-label]="pointAriaLabel(p)"
              tabindex="0"
              (click)="emitClick(p)"
              (keydown.enter)="emitClick(p)"
              (keydown.space)="emitClick(p); $event.preventDefault()" />
          }
        </svg:g>
        <ng-content select="svg:g[ui-chart-brush]" />
      </svg:g>
    </svg:svg>
    <ng-content select="ui-chart-legend" />
    <ng-content select="ui-chart-zoom-controls" />
  `,
})
export class ScatterChart {
  private readonly root = inject(ChartContext);
  private readonly viewport = inject(ScatterViewportContext);

  readonly data = input.required<readonly ChartDatum[]>();
  readonly xKey = input.required<string>();
  readonly yKey = input.required<string>();
  /** Optional numeric field to drive point radius. */
  readonly sizeKey = input<string | undefined>(undefined);
  /** Optional field on each datum used as color key. */
  readonly seriesKey = input<string | undefined>(undefined);
  readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
  readonly minPointRadius = input<number>(3);
  readonly maxPointRadius = input<number>(12);
  readonly xDomain = input<readonly [number, number] | undefined>(undefined);
  readonly yDomain = input<readonly [number, number] | undefined>(undefined);

  readonly pointClick = output<ScatterPointClickEvent>();

  protected readonly innerWidth = computed(() =>
    Math.max(0, this.root.dimensions().width - this.margin().left - this.margin().right),
  );
  protected readonly innerHeight = computed(() =>
    Math.max(0, this.root.dimensions().height - this.margin().top - this.margin().bottom),
  );

  protected readonly resolvedDomains = computed(() =>
    resolveScatterDomains({
      data: this.data(),
      xKey: this.xKey(),
      yKey: this.yKey(),
      xDomain: this.xDomain(),
      yDomain: this.yDomain(),
    }),
  );

  protected readonly currentXDomain = computed(() => this.viewport.zoomXDomain() ?? this.resolvedDomains().xDomain);

  protected readonly currentYDomain = computed(() => this.viewport.zoomYDomain() ?? this.resolvedDomains().yDomain);

  protected readonly layout = computed(() =>
    computeScatterLayout({
      data: this.data(),
      xKey: this.xKey(),
      yKey: this.yKey(),
      sizeKey: this.sizeKey(),
      seriesKey: this.seriesKey(),
      seriesKeys: this.root.visibleSeriesKeys(),
      innerWidth: this.innerWidth(),
      innerHeight: this.innerHeight(),
      minPointRadius: this.minPointRadius(),
      maxPointRadius: this.maxPointRadius(),
      xDomain: this.currentXDomain(),
      yDomain: this.currentYDomain(),
    }),
  );

  protected readonly viewBox = computed(() => {
    const { width, height } = this.root.dimensions();
    return `0 0 ${Math.max(0, width)} ${Math.max(0, height)}`;
  });

  protected readonly innerTransform = computed(() => `translate(${this.margin().left},${this.margin().top})`);

  protected readonly clipPathId = computed(() => `${this.root.id()}-scatter-clip`);

  protected readonly ariaSummary = computed(() => `Scatter chart, ${this.data().length} points.`);

  constructor() {
    effect(() => {
      const domains = this.resolvedDomains();
      const layout = this.layout();
      this.viewport.innerWidth.set(this.innerWidth());
      this.viewport.innerHeight.set(this.innerHeight());
      this.viewport.fullXDomain.set(domains.xDomain);
      this.viewport.fullYDomain.set(domains.yDomain);
      this.viewport.xScale.set(layout.xScale);
      this.viewport.yScale.set(layout.yScale);
    });
  }

  protected pointAriaLabel(p: ScatterPoint): string {
    return `${p.seriesKey}: x=${p.rawX}, y=${p.rawY}`;
  }

  protected emitClick(p: ScatterPoint): void {
    this.pointClick.emit({
      seriesKey: p.seriesKey,
      datumIndex: p.datumIndex,
      x: p.rawX,
      y: p.rawY,
      datum: this.data()[p.datumIndex],
    });
  }
}
