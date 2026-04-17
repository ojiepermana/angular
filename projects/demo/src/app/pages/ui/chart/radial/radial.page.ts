import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartContainer, RadialCenter, RadialChart } from '@ojiepermana/material/chart';

import { PageShellComponent } from '../../../../core/page-shell/page-shell';
import { ChartDemoCardComponent } from '../_shared/chart-demo-card';
import {
  RADIAL_MULTI_DATA,
  RADIAL_PROGRESS_CONFIG,
  RADIAL_SINGLE_DATA,
  RADIAL_STACKED_DATA,
} from '../_shared/chart-datasets';

@Component({
  selector: 'demo-radial-chart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartContainer, ChartDemoCardComponent, PageShellComponent, RadialCenter, RadialChart],
  template: `
    <demo-page-shell
      title="Radial Charts"
      description="Radial progress compositions modeled after the shadcn gallery, including labels, center text, shaped partial arcs, and stacked tracks.">
      <div demo-page-actions class="flex flex-wrap gap-2">
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          6 variants
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Full + partial arcs
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Center overlays
        </span>
      </div>

      <section class="grid gap-6 xl:grid-cols-2">
        <demo-chart-card
          title="Radial Chart"
          description="Progress toward the current desktop target"
          badge="Default"
          footerTrend="Desktop progress is pacing ahead of forecast"
          footerMeta="Showing completion against a 200 visitor target"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="radialConfig" chartId="radial-default">
            <ui-radial-chart
              [data]="radialSingleData"
              nameKey="stream"
              valueKey="value"
              [seriesKeys]="desktopSeries"
              [maxValue]="radialSingleMax" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radial Chart - Label"
          description="Progress toward the current desktop target"
          badge="Labels"
          footerTrend="End labels make progress readable at a glance"
          footerMeta="Showing completion against a 200 visitor target"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="radialConfig" chartId="radial-label">
            <ui-radial-chart
              [data]="radialSingleData"
              nameKey="stream"
              valueKey="value"
              [seriesKeys]="desktopSeries"
              [maxValue]="radialSingleMax"
              [showValueLabels]="true"
              [valueLabelFormat]="percentageFormatter" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radial Chart - Grid"
          description="Progress toward the current desktop target"
          badge="Grid"
          footerTrend="Track rings create a clear before-versus-after baseline"
          footerMeta="Showing completion against a 200 visitor target"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="radialConfig" chartId="radial-grid">
            <ui-radial-chart
              [data]="radialSingleData"
              nameKey="stream"
              valueKey="value"
              [seriesKeys]="desktopSeries"
              [maxValue]="radialSingleMax"
              [cornerRadius]="18"
              [trackPadding]="10" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radial Chart - Text"
          description="Progress toward the current desktop target"
          badge="Center text"
          footerTrend="Center copy turns the ring into a compact KPI tile"
          footerMeta="Showing completion against a 200 visitor target"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="radialConfig" chartId="radial-text">
            <ui-radial-chart
              [data]="radialSingleData"
              nameKey="stream"
              valueKey="value"
              [seriesKeys]="desktopSeries"
              [maxValue]="radialSingleMax">
              <ui-radial-center>
                <div class="text-center">
                  <div class="text-4xl font-semibold tracking-tight text-foreground">63%</div>
                  <div class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Desktop goal</div>
                </div>
              </ui-radial-center>
            </ui-radial-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radial Chart - Shape"
          description="Four concentric tracks in a partial-arc layout"
          badge="Shape"
          footerTrend="Partial arcs create a stronger dashboard feel"
          footerMeta="Showing relative progress across four streams"
          chartClassName="mx-auto aspect-square max-w-[18rem]"
          panelClassName="rounded-[1.35rem] border border-border/60 bg-linear-to-br from-[hsl(var(--chart-1))/0.08] via-background to-[hsl(var(--chart-2))/0.08] p-3">
          <ui-chart-container [config]="radialConfig" chartId="radial-shape">
            <ui-radial-chart
              [data]="radialMultiData"
              nameKey="stream"
              valueKey="value"
              [seriesKeys]="radialMultiSeries"
              [maxValue]="radialShapeMax"
              [startAngle]="shapeStartAngle"
              [endAngle]="shapeEndAngle"
              [cornerRadius]="14"
              [trackPadding]="10">
              <ui-radial-center>
                <div
                  class="rounded-full border border-border/70 bg-background/80 px-4 py-2 text-center shadow-sm backdrop-blur-sm">
                  <div class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Signal</div>
                  <div class="mt-1 text-xl font-semibold text-foreground">Stable</div>
                </div>
              </ui-radial-center>
            </ui-radial-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radial Chart - Stacked"
          description="Two primary traffic streams in concentric rings"
          badge="Stacked"
          footerTrend="Desktop substantially outpaces mobile in the current window"
          footerMeta="Showing relative progress against a 1500 visitor target"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="radialConfig" chartId="radial-stacked">
            <ui-radial-chart
              [data]="radialStackedData"
              nameKey="stream"
              valueKey="value"
              [seriesKeys]="radialStackedSeries"
              [maxValue]="radialStackedMax"
              [cornerRadius]="14"
              [trackPadding]="12">
              <ui-radial-center>
                <div class="text-center">
                  <div class="text-3xl font-semibold tracking-tight text-foreground">{{ radialStackedTotal }}</div>
                  <div class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Combined visitors</div>
                </div>
              </ui-radial-center>
            </ui-radial-chart>
          </ui-chart-container>
        </demo-chart-card>
      </section>
    </demo-page-shell>
  `,
})
export class RadialChartPageComponent {
  protected readonly radialConfig = RADIAL_PROGRESS_CONFIG;
  protected readonly radialSingleData = RADIAL_SINGLE_DATA;
  protected readonly radialMultiData = RADIAL_MULTI_DATA;
  protected readonly radialStackedData = RADIAL_STACKED_DATA;
  protected readonly desktopSeries = ['desktop'];
  protected readonly radialMultiSeries = RADIAL_MULTI_DATA.map((item) => item.stream);
  protected readonly radialStackedSeries = RADIAL_STACKED_DATA.map((item) => item.stream);
  protected readonly radialSingleMax = 200;
  protected readonly radialShapeMax = 160;
  protected readonly radialStackedMax = 1500;
  protected readonly radialStackedTotal = RADIAL_STACKED_DATA.reduce((sum, item) => sum + item.value, 0);
  protected readonly percentageFormatter = (value: number) => `${Math.round((value / this.radialSingleMax) * 100)}%`;
  protected readonly shapeStartAngle = (-5 * Math.PI) / 6;
  protected readonly shapeEndAngle = (5 * Math.PI) / 6;
}
