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
              [attr.transform]="sliceTransform(s)"
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
                [attr.x]="s.centroid[0] + s.translateX"
                [attr.y]="s.centroid[1] + s.translateY">
                {{ s.value }}
              </svg:text>
            }
          }
        </svg:g>
      </svg:g>
    </svg:svg>
    <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <ng-content select="ui-pie-center" />
    </div>
    <ng-content select="ui-chart-tooltip" />
    <ng-content select="ui-chart-legend" />
  `,
})
export class PieChart {
  private readonly root = inject(ChartContext);

  readonly data = input.required<readonly ChartDatum[]>();
  readonly valueKey = input.required<string>();
  readonly nameKey = input.required<string>();
  readonly seriesKeys = input<readonly string[] | undefined>(undefined);
  readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
  readonly innerRadius = input<number>(0);
  readonly padAngle = input<number>(0.01);
  readonly cornerRadius = input<number>(0);
  readonly startAngle = input<number>(-Math.PI / 2);
  readonly endAngle = input<number>((3 * Math.PI) / 2);
  readonly showLabels = input<boolean>(false);
  readonly activeIndex = input<number | undefined>(undefined);
  readonly activeOffset = input<number>(12);

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
      activeIndex: this.activeIndex(),
      activeOffset: this.activeOffset(),
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

  protected sliceTransform(s: PieSliceRect): string | null {
    return s.translateX || s.translateY ? `translate(${s.translateX}, ${s.translateY})` : null;
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
