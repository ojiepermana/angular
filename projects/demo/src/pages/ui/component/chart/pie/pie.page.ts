import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  PieCenter,
  PieChart,
  RadialCenter,
  RadialChart,
} from '@ojiepermana/angular/chart';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';
import { ChartDemoCardComponent } from '../_shared/chart-demo-card';
import { ChartPageBadgesComponent } from '../_shared/chart-page-badges';
import { BROWSER_CONFIG, BROWSER_DATA, BROWSER_TOTAL_VISITORS } from '../_shared/chart-datasets';

@Component({
  selector: 'demo-pie-chart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChartContainer,
    ChartDemoCardComponent,
    ChartLegend,
    ChartPageBadgesComponent,
    ChartTooltip,
    ShellLayoutComponent,
    PieCenter,
    PieChart,
    RadialCenter,
    RadialChart,
  ],
  template: `
    <ui-shell
      title="Pie Charts"
      description="Pie and donut compositions aligned with the shadcn gallery, including active slices, center copy, legends, and stacked radial rings.">
      <demo-chart-page-badges ui-shell-actions [labels]="pageBadges" />

      <section class="grid gap-6 xl:grid-cols-2">
        <demo-chart-card
          title="Pie Chart"
          description="Browser visitors distribution"
          badge="Default"
          footerTrend="Chrome remains the leading acquisition source"
          footerMeta="Showing total visitors by browser"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="pie-default" aspect="aspect-square">
            <ui-pie-chart [data]="browserData" nameKey="browser" valueKey="visitors" [seriesKeys]="browserSeriesKeys">
              <ui-chart-tooltip [data]="browserData" xKey="browser" valueKey="visitors" indicator="dot" />
            </ui-pie-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Pie Chart - Separator"
          description="Browser visitors distribution"
          badge="Separator"
          footerTrend="Cleaner rings for denser categories"
          footerMeta="Showing total visitors by browser"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="pie-separator" aspect="aspect-square">
            <ui-pie-chart
              [data]="browserData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="browserSeriesKeys"
              [padAngle]="0"
              [cornerRadius]="10" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Pie Chart - Label"
          description="Browser visitors distribution"
          badge="Labels"
          footerTrend="Largest slices carry labels directly"
          footerMeta="Showing total visitors by browser"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="pie-label" aspect="aspect-square">
            <ui-pie-chart
              [data]="browserData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="browserSeriesKeys"
              [showLabels]="true" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Pie Chart - Custom Label"
          description="Browser visitors distribution"
          badge="Custom label"
          footerTrend="Active slices can carry more visual weight"
          footerMeta="Showing total visitors by browser"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="pie-custom-label" aspect="aspect-square">
            <ui-pie-chart
              [data]="browserData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="browserSeriesKeys"
              [showLabels]="true"
              [activeIndex]="0"
              [activeOffset]="16" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Pie Chart - Label List"
          description="Browser visitors distribution"
          badge="Label list"
          footerTrend="Readable shares without crowding the arcs"
          footerMeta="Showing total visitors by browser"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="pie-label-list" aspect="aspect-square">
            <ui-pie-chart
              [data]="browserData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="browserSeriesKeys"
              [innerRadius]="54" />
          </ui-chart-container>

          <div demo-card-after class="mt-4 grid gap-2 sm:grid-cols-2">
            @for (item of browserShareList; track item.browser) {
              <div
                class="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-sm">
                <span class="flex items-center gap-2 text-foreground">
                  <span class="inline-block h-2.5 w-2.5 rounded-full" [style.background]="item.color"></span>
                  {{ item.label }}
                </span>
                <span class="font-medium tabular-nums text-muted-foreground">{{ item.share }}</span>
              </div>
            }
          </div>
        </demo-chart-card>

        <demo-chart-card
          title="Pie Chart - Legend"
          description="Browser visitors distribution"
          badge="Legend"
          footerTrend="Legend layout works better for compact pies"
          footerMeta="Showing total visitors by browser"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="pie-legend" aspect="aspect-square">
            <ui-pie-chart [data]="browserData" nameKey="browser" valueKey="visitors" [seriesKeys]="browserSeriesKeys" />
            <ui-chart-legend />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Pie Chart - Donut"
          description="Browser visitors distribution"
          badge="Donut"
          footerTrend="Inner radius improves scanability for labels and center content"
          footerMeta="Showing total visitors by browser"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="pie-donut" aspect="aspect-square">
            <ui-pie-chart
              [data]="browserData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="browserSeriesKeys"
              [innerRadius]="56" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Pie Chart - Donut Active"
          description="Browser visitors distribution"
          badge="Active slice"
          footerTrend="Pulling a slice forward works well for emphasis"
          footerMeta="Showing total visitors by browser"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="pie-donut-active" aspect="aspect-square">
            <ui-pie-chart
              [data]="browserData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="browserSeriesKeys"
              [innerRadius]="56"
              [activeIndex]="1"
              [activeOffset]="16" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Pie Chart - Donut Text"
          description="Browser visitors distribution"
          badge="Center text"
          footerTrend="Center copy can turn the donut into a compact KPI tile"
          footerMeta="Showing total visitors by browser"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="pie-donut-text" aspect="aspect-square">
            <ui-pie-chart
              [data]="browserData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="browserSeriesKeys"
              [innerRadius]="72">
              <ui-pie-center>
                <div class="text-center">
                  <div class="text-3xl font-semibold tracking-tight text-foreground">{{ browserTotalVisitors }}</div>
                  <div class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Total visitors</div>
                </div>
              </ui-pie-center>
            </ui-pie-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Pie Chart - Stacked"
          description="Concentric progress rings for the same browser split"
          badge="Stacked"
          footerTrend="Stacked radial rings are a good fit for comparative proportions"
          footerMeta="Showing total visitors by browser"
          chartClassName="mx-auto aspect-square max-w-[19rem]">
          <ui-chart-container [config]="browserConfig" chartId="pie-stacked" aspect="aspect-square">
            <ui-radial-chart
              [data]="browserData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="browserSeriesKeys"
              [maxValue]="browserMaxVisitors"
              [cornerRadius]="16"
              [trackPadding]="10">
              <ui-radial-center>
                <div class="text-center">
                  <div class="text-3xl font-semibold tracking-tight text-foreground">{{ browserTotalVisitors }}</div>
                  <div class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Combined traffic</div>
                </div>
              </ui-radial-center>
            </ui-radial-chart>
          </ui-chart-container>
        </demo-chart-card>
      </section>
    </ui-shell>
  `,
})
export class PieChartPageComponent {
  protected readonly browserConfig = BROWSER_CONFIG;
  protected readonly browserData = BROWSER_DATA;
  protected readonly browserTotalVisitors = BROWSER_TOTAL_VISITORS;
  protected readonly browserSeriesKeys = BROWSER_DATA.map((item) => item.browser);
  protected readonly browserMaxVisitors = Math.max(...BROWSER_DATA.map((item) => item.visitors));
  protected readonly browserShareList = BROWSER_DATA.map((item) => ({
    browser: item.browser,
    label: BROWSER_CONFIG[item.browser]?.label ?? item.browser,
    color: BROWSER_CONFIG[item.browser]?.color ?? 'hsl(var(--foreground))',
    share: `${Math.round((item.visitors / BROWSER_TOTAL_VISITORS) * 100)}%`,
  }));
  protected readonly pageBadges = ['10 variants', 'Pie + donut', 'Labels + center overlays'] as const;
}
