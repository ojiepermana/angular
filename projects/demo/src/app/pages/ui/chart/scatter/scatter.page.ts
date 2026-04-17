import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartBrush, ChartContainer, ChartLegend, ChartZoomControls, ScatterChart } from '@ojiepermana/material/chart';

import { PageShellComponent } from '../../../../core/page-shell/page-shell';
import { ChartDemoCardComponent } from '../_shared/chart-demo-card';
import { SCATTER_BASIC_CONFIG, SCATTER_BASIC_DATA, SCATTER_CONFIG, SCATTER_DATA } from '../_shared/chart-datasets';

@Component({
  selector: 'demo-scatter-chart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChartBrush,
    ChartContainer,
    ChartDemoCardComponent,
    ChartLegend,
    ChartZoomControls,
    PageShellComponent,
    ScatterChart,
  ],
  template: `
    <demo-page-shell
      title="Scatter Charts"
      description="Four scatter variants chosen to fit the current primitive set: a minimal distribution plot, grouped points, bubble sizing, and a brush-and-zoom example.">
      <div demo-page-actions class="flex flex-wrap gap-2">
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          4 variants
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Bubble sizing
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Brush + zoom
        </span>
      </div>

      <section class="grid gap-6 xl:grid-cols-2">
        <demo-chart-card
          title="Scatter Chart"
          description="A minimal point distribution for a single sample set"
          badge="Basic"
          footerTrend="Density rises in the upper-right quadrant"
          footerMeta="Showing eight sample points across a simple x/y range">
          <ui-chart-container [config]="scatterBasicConfig" chartId="scatter-basic">
            <ui-scatter-chart [data]="scatterBasicData" xKey="x" yKey="y" [minPointRadius]="5" [maxPointRadius]="5" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Scatter Chart - Multiple"
          description="Colored clusters for core, growth, and labs segments"
          badge="Grouped"
          footerTrend="Growth and labs occupy the upper-value space"
          footerMeta="Showing x/y correlation across three segments">
          <ui-chart-container [config]="scatterConfig" chartId="scatter-multiple">
            <ui-scatter-chart
              [data]="scatterData"
              xKey="x"
              yKey="y"
              seriesKey="cluster"
              [minPointRadius]="6"
              [maxPointRadius]="6" />
            <ui-chart-legend />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Scatter Chart - Bubble"
          description="Bubble size reflects revenue while color represents segment"
          badge="Bubble"
          footerTrend="Larger opportunities cluster where x and y both accelerate"
          footerMeta="Showing revenue-weighted x/y opportunity points">
          <ui-chart-container [config]="scatterConfig" chartId="scatter-bubble">
            <ui-scatter-chart
              [data]="scatterData"
              xKey="x"
              yKey="y"
              sizeKey="revenue"
              seriesKey="cluster"
              [minPointRadius]="6"
              [maxPointRadius]="16" />
            <ui-chart-legend />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Scatter Chart - Interactive"
          description="Use brushing to isolate regions and zoom into clusters"
          badge="Interactive"
          footerTrend="The densest cluster lives in the upper-right window"
          footerMeta="Drag to brush a region, scroll to zoom, and reset when needed">
          <ui-chart-container [config]="scatterConfig" chartId="scatter-interactive">
            <ui-scatter-chart
              [data]="scatterData"
              xKey="x"
              yKey="y"
              sizeKey="revenue"
              seriesKey="cluster"
              [minPointRadius]="6"
              [maxPointRadius]="16">
              <svg:g ui-chart-brush></svg:g>
            </ui-scatter-chart>
            <ui-chart-legend />
            <ui-chart-zoom-controls />
          </ui-chart-container>
        </demo-chart-card>
      </section>
    </demo-page-shell>
  `,
})
export class ScatterChartPageComponent {
  protected readonly scatterConfig = SCATTER_CONFIG;
  protected readonly scatterBasicConfig = SCATTER_BASIC_CONFIG;
  protected readonly scatterData = SCATTER_DATA;
  protected readonly scatterBasicData = SCATTER_BASIC_DATA;
}
