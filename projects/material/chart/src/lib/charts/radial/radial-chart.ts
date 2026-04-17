import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ChartContext } from '../../core/chart-context';
import type { ChartDatum, ChartMargin } from '../../core/cartesian-context';
import { computeRadialLayout, type RadialBarRect } from './radial-layout';

const DEFAULT_MARGIN: ChartMargin = { top: 8, right: 8, bottom: 8, left: 8 };
const defaultRadialValueFormatter = (value: number): string => `${value}`;

export interface RadialBarClickEvent {
  readonly seriesKey: string;
  readonly name: string;
  readonly value: number;
  readonly datumIndex: number;
  readonly datum: ChartDatum;
}

@Component({
  selector: 'ui-radial-chart',
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
          @for (b of layout().bars; track b.seriesKey) {
            @if (showTrack()) {
              <svg:path class="chart-radial-track fill-muted" [attr.d]="b.backgroundPath" />
            }
            <svg:path
              class="chart-radial-bar cursor-pointer transition-opacity hover:opacity-80"
              [attr.d]="b.arcPath"
              [attr.fill]="b.color"
              [attr.aria-label]="barAriaLabel(b)"
              tabindex="0"
              (click)="emitClick(b)"
              (keydown.enter)="emitClick(b)"
              (keydown.space)="emitClick(b); $event.preventDefault()" />
            @if (showValueLabels()) {
              <svg:text
                class="chart-radial-value pointer-events-none fill-muted-foreground text-[10px]"
                [attr.x]="barLabelX(b)"
                [attr.y]="barLabelY(b)"
                [attr.text-anchor]="barLabelAnchor(b)"
                dominant-baseline="middle">
                {{ formatValueLabel(b) }}
              </svg:text>
            }
          }
        </svg:g>
      </svg:g>
    </svg:svg>
    <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <ng-content select="ui-radial-center" />
    </div>
    <ng-content select="ui-chart-legend" />
  `,
})
export class RadialChart {
  private readonly root = inject(ChartContext);

  readonly data = input.required<readonly ChartDatum[]>();
  readonly nameKey = input.required<string>();
  readonly valueKey = input.required<string>();
  readonly seriesKeys = input<readonly string[] | undefined>(undefined);
  readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
  readonly trackPadding = input<number>(4);
  readonly cornerRadius = input<number>(8);
  readonly startAngle = input<number>(-Math.PI / 2);
  readonly endAngle = input<number>((3 * Math.PI) / 2);
  readonly maxValue = input<number | undefined>(undefined);
  readonly showTrack = input<boolean>(true);
  readonly showValueLabels = input<boolean>(false);
  readonly valueLabelFormat = input<(value: number) => string>(defaultRadialValueFormatter);

  readonly barClick = output<RadialBarClickEvent>();

  protected readonly innerWidth = computed(() =>
    Math.max(0, this.root.dimensions().width - this.margin().left - this.margin().right),
  );
  protected readonly innerHeight = computed(() =>
    Math.max(0, this.root.dimensions().height - this.margin().top - this.margin().bottom),
  );

  protected readonly layout = computed(() =>
    computeRadialLayout({
      data: this.data(),
      nameKey: this.nameKey(),
      valueKey: this.valueKey(),
      seriesKeys: this.seriesKeys(),
      innerWidth: this.innerWidth(),
      innerHeight: this.innerHeight(),
      trackPadding: this.trackPadding(),
      startAngle: this.startAngle(),
      endAngle: this.endAngle(),
      cornerRadius: this.cornerRadius(),
      maxValue: this.maxValue(),
    }),
  );

  protected readonly viewBox = computed(() => {
    const { width, height } = this.root.dimensions();
    return `0 0 ${Math.max(0, width)} ${Math.max(0, height)}`;
  });

  protected readonly innerTransform = computed(() => `translate(${this.margin().left},${this.margin().top})`);
  protected readonly ariaSummary = computed(() => `Radial bar chart, ${this.data().length} tracks.`);

  protected barAriaLabel(b: RadialBarRect): string {
    return `${b.name}: ${b.value}`;
  }

  protected formatValueLabel(b: RadialBarRect): string {
    return this.valueLabelFormat()(b.value);
  }

  protected barLabelX(b: RadialBarRect): number {
    const radius = (b.innerRadius + b.outerRadius) / 2 + 10;
    return Math.sin(b.endAngle) * radius;
  }

  protected barLabelY(b: RadialBarRect): number {
    const radius = (b.innerRadius + b.outerRadius) / 2 + 10;
    return -Math.cos(b.endAngle) * radius;
  }

  protected barLabelAnchor(b: RadialBarRect): 'start' | 'end' {
    return this.barLabelX(b) >= 0 ? 'start' : 'end';
  }

  protected emitClick(b: RadialBarRect): void {
    this.barClick.emit({
      seriesKey: b.seriesKey,
      name: b.name,
      value: b.value,
      datumIndex: b.datumIndex,
      datum: this.data()[b.datumIndex],
    });
  }
}
