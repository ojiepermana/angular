import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ChartContext } from '../../core/chart-context';
import type { ChartDatum, ChartMargin } from '../../core/cartesian-context';
import { computePieLayout, type PieSliceRect } from './pie-layout';

const DEFAULT_MARGIN: ChartMargin = { top: 8, right: 8, bottom: 8, left: 8 };

export interface PieSliceClickEvent {
  readonly seriesKey: string;
  readonly name: string;
  readonly value: number;
  readonly datumIndex: number;
  readonly datum: ChartDatum;
}

/**
 * Pie / Donut chart — composable within `<ui-chart-container>`.
 *
 * Each row of `data` is a single slice. Colors are resolved from the
 * container's `config`: either by the row's `nameKey` value (default) or
 * by an explicit `seriesKeys` array.
 *
 * Set `innerRadius > 0` for a donut.
 */
@Component({
  selector: 'ui-pie-chart',
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
        <svg:g [attr.transform]="'translate(' + layout().centerX + ',' + layout().centerY + ')'">
          @for (s of layout().slices; track s.seriesKey) {
            <svg:path
              class="chart-slice cursor-pointer transition-opacity hover:opacity-80"
              [attr.d]="s.arcPath"
              [attr.fill]="s.color"
              [attr.aria-label]="sliceAriaLabel(s)"
              tabindex="0"
              (click)="emitClick(s)"
              (keydown.enter)="emitClick(s)"
              (keydown.space)="emitClick(s); $event.preventDefault()" />
          }
          @if (showLabels()) {
            @for (s of layout().slices; track s.seriesKey) {
              <svg:text
                class="chart-slice-label fill-foreground text-[10px]"
                text-anchor="middle"
                dominant-baseline="middle"
                [attr.x]="s.centroid[0]"
                [attr.y]="s.centroid[1]">
                {{ s.value }}
              </svg:text>
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
export class PieChart {
  private readonly root = inject(ChartContext);

  readonly data = input.required<readonly ChartDatum[]>();
  /** Field on each datum whose value is the slice's numeric magnitude. */
  readonly valueKey = input.required<string>();
  /** Field on each datum whose value is the slice's label. */
  readonly nameKey = input.required<string>();
  /** Optional explicit series-key list (same length as data) for coloring. */
  readonly seriesKeys = input<readonly string[] | undefined>(undefined);
  readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
  readonly innerRadius = input<number>(0);
  readonly padAngle = input<number>(0.01);
  readonly cornerRadius = input<number>(0);
  readonly startAngle = input<number>(-Math.PI / 2);
  readonly endAngle = input<number>((3 * Math.PI) / 2);
  readonly showLabels = input<boolean>(false);

  readonly sliceClick = output<PieSliceClickEvent>();

  protected readonly innerWidth = computed(() =>
    Math.max(0, this.root.dimensions().width - this.margin().left - this.margin().right),
  );
  protected readonly innerHeight = computed(() =>
    Math.max(0, this.root.dimensions().height - this.margin().top - this.margin().bottom),
  );

  protected readonly layout = computed(() =>
    computePieLayout({
      data: this.data(),
      valueKey: this.valueKey(),
      nameKey: this.nameKey(),
      seriesKeys: this.seriesKeys(),
      innerWidth: this.innerWidth(),
      innerHeight: this.innerHeight(),
      innerRadius: this.innerRadius(),
      padAngle: this.padAngle(),
      cornerRadius: this.cornerRadius(),
      startAngle: this.startAngle(),
      endAngle: this.endAngle(),
    }),
  );

  protected readonly viewBox = computed(() => {
    const { width, height } = this.root.dimensions();
    return `0 0 ${Math.max(0, width)} ${Math.max(0, height)}`;
  });

  protected readonly innerTransform = computed(() => `translate(${this.margin().left},${this.margin().top})`);

  protected readonly ariaSummary = computed(() => `Pie chart, ${this.data().length} slices.`);

  protected sliceAriaLabel(s: PieSliceRect): string {
    return `${s.name}: ${s.value}`;
  }

  protected emitClick(s: PieSliceRect): void {
    this.sliceClick.emit({
      seriesKey: s.seriesKey,
      name: s.name,
      value: s.value,
      datumIndex: s.datumIndex,
      datum: this.data()[s.datumIndex],
    });
  }
}
