import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartContainer, ChartLegend, RadarChart } from '@ojiepermana/material/chart';

import { PageShellComponent } from '../../../../core/page-shell/page-shell';
import { ChartDemoCardComponent } from '../_shared/chart-demo-card';
import { ChartPageBadgesComponent } from '../_shared/chart-page-badges';
import { RADAR_MONTH_DATA, VISITOR_CONFIG } from '../_shared/chart-datasets';

@Component({
  selector: 'demo-radar-chart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChartContainer,
    ChartDemoCardComponent,
    ChartLegend,
    ChartPageBadgesComponent,
    PageShellComponent,
    RadarChart,
  ],
  template: `
    <demo-page-shell
      title="Radar Charts"
      description="Radar charts covering the shadcn-style variants: dots, lines-only views, polygon and circle grids, hidden axes, and filled backdrops.">
      <demo-chart-page-badges demo-page-actions [labels]="pageBadges" />

      <section class="grid gap-6 xl:grid-cols-2">
        <demo-chart-card
          title="Radar Chart"
          description="Desktop and mobile contribution by month"
          badge="Default"
          footerTrend="Desktop stays ahead across most months"
          footerMeta="Showing monthly visitors by device"
          chartClassName="mx-auto aspect-square max-w-[20rem]">
          <ui-chart-container [config]="visitorConfig" chartId="radar-default" aspect="aspect-square">
            <ui-radar-chart [data]="radarMonthData" axisKey="month" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radar Chart - Dots"
          description="Desktop and mobile contribution by month"
          badge="Dots"
          footerTrend="Point markers help track individual month changes"
          footerMeta="Showing monthly visitors by device"
          chartClassName="mx-auto aspect-square max-w-[20rem]">
          <ui-chart-container [config]="visitorConfig" chartId="radar-dots" aspect="aspect-square">
            <ui-radar-chart [data]="radarMonthData" axisKey="month" curve="cardinal" [dotRadius]="4" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radar Chart - Lines Only"
          description="Desktop and mobile contribution by month"
          badge="Lines only"
          footerTrend="Removing fills reduces overlap on dense comparisons"
          footerMeta="Showing monthly visitors by device"
          chartClassName="mx-auto aspect-square max-w-[20rem]">
          <ui-chart-container [config]="visitorConfig" chartId="radar-lines-only" aspect="aspect-square">
            <ui-radar-chart [data]="radarMonthData" axisKey="month" [linesOnly]="true" [showDots]="false" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radar Chart - Custom Label"
          description="Desktop and mobile contribution by month"
          badge="Custom labels"
          footerTrend="External labels keep the chart itself quieter"
          footerMeta="Showing monthly visitors by device"
          chartClassName="mx-auto aspect-square max-w-[20rem]">
          <ui-chart-container [config]="visitorConfig" chartId="radar-custom-label" aspect="aspect-square">
            <ui-radar-chart [data]="radarMonthData" axisKey="month" [showLabels]="false" [showDots]="false" />
          </ui-chart-container>

          <div demo-card-after class="mt-4 grid gap-2 sm:grid-cols-2">
            <div class="rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-sm">
              <div class="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Desktop peak</div>
              <div class="mt-1 font-medium text-foreground">February · 305</div>
            </div>
            <div class="rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-sm">
              <div class="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Mobile peak</div>
              <div class="mt-1 font-medium text-foreground">February · 200</div>
            </div>
          </div>
        </demo-chart-card>

        <demo-chart-card
          title="Radar Chart - Multiple"
          description="Desktop and mobile contribution by month"
          badge="Legend"
          footerTrend="Legend placement mirrors the shadcn comparison card"
          footerMeta="Showing monthly visitors by device"
          chartClassName="mx-auto aspect-square max-w-[20rem]">
          <ui-chart-container [config]="visitorConfig" chartId="radar-multiple" aspect="aspect-square">
            <ui-radar-chart [data]="radarMonthData" axisKey="month" />
            <ui-chart-legend />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radar Chart - Grid Custom"
          description="Desktop and mobile contribution by month"
          badge="Polygon grid"
          footerTrend="Polygon guides reinforce the angular geometry"
          footerMeta="Showing monthly visitors by device"
          chartClassName="mx-auto aspect-square max-w-[20rem]">
          <ui-chart-container [config]="visitorConfig" chartId="radar-grid-custom" aspect="aspect-square">
            <ui-radar-chart [data]="radarMonthData" axisKey="month" grid="polygon" curve="cardinal" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radar Chart - Grid None"
          description="Desktop and mobile contribution by month"
          badge="No grid"
          footerTrend="Minimal styling lets the series shapes lead"
          footerMeta="Showing monthly visitors by device"
          chartClassName="mx-auto aspect-square max-w-[20rem]">
          <ui-chart-container [config]="visitorConfig" chartId="radar-grid-none" aspect="aspect-square">
            <ui-radar-chart [data]="radarMonthData" axisKey="month" grid="none" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radar Chart - Grid Circle"
          description="Desktop and mobile contribution by month"
          badge="Circle grid"
          footerTrend="Circular guides create a softer visual rhythm"
          footerMeta="Showing monthly visitors by device"
          chartClassName="mx-auto aspect-square max-w-[20rem]">
          <ui-chart-container [config]="visitorConfig" chartId="radar-grid-circle" aspect="aspect-square">
            <ui-radar-chart [data]="radarMonthData" axisKey="month" grid="circle" [showAxes]="false" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radar Chart - Grid Circle Fill"
          description="Desktop and mobile contribution by month"
          badge="Circle fill"
          footerTrend="Filled circles help depth perception without overpowering the series"
          footerMeta="Showing monthly visitors by device"
          chartClassName="mx-auto aspect-square max-w-[20rem]">
          <ui-chart-container [config]="visitorConfig" chartId="radar-grid-circle-fill" aspect="aspect-square">
            <ui-radar-chart [data]="radarMonthData" axisKey="month" grid="circle" [gridFilled]="true" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radar Chart - Grid Fill"
          description="Desktop and mobile contribution by month"
          badge="Polygon fill"
          footerTrend="Filled polygon bands create a stronger sense of scale"
          footerMeta="Showing monthly visitors by device"
          chartClassName="mx-auto aspect-square max-w-[20rem]">
          <ui-chart-container [config]="visitorConfig" chartId="radar-grid-fill" aspect="aspect-square">
            <ui-radar-chart
              [data]="radarMonthData"
              axisKey="month"
              grid="polygon"
              [gridFilled]="true"
              curve="cardinal" />
          </ui-chart-container>
        </demo-chart-card>
      </section>
    </demo-page-shell>
  `,
})
export class RadarChartPageComponent {
  protected readonly visitorConfig = VISITOR_CONFIG;
  protected readonly radarMonthData = RADAR_MONTH_DATA;
  protected readonly pageBadges = ['10 variants', 'Circle + polygon grids', 'Filled + lines-only'] as const;
}
