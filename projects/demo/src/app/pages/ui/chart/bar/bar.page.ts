import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BarChart,
  ChartAxisX,
  ChartAxisY,
  ChartContainer,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
} from '@ojiepermana/material/chart';

import { PageShellComponent } from '../../../../core/page-shell/page-shell';
import { ChartDemoCardComponent } from '../_shared/chart-demo-card';
import {
  DEFAULT_META,
  DEFAULT_TREND,
  INTERACTIVE_META,
  INTERACTIVE_VISITOR_DATA,
  MONTHLY_VISITOR_DATA,
  NEGATIVE_BAR_DATA,
  SINGLE_VISITOR_CONFIG,
  SINGLE_VISITOR_DATA,
  VISITOR_CONFIG,
} from '../_shared/chart-datasets';

@Component({
  selector: 'demo-bar-chart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BarChart,
    ChartAxisX,
    ChartAxisY,
    ChartContainer,
    ChartDemoCardComponent,
    ChartGrid,
    ChartLegend,
    ChartTooltip,
    PageShellComponent,
  ],
  template: `
    <demo-page-shell
      title="Bar Charts"
      description="Bar layouts modeled after the shadcn chart gallery: grouped, stacked, horizontal, active, mixed-color, and label-heavy variants.">
      <div demo-page-actions class="flex flex-wrap gap-2">
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          10 variants
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Grouped + stacked
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Negative + active states
        </span>
      </div>

      <section class="grid gap-6 xl:grid-cols-2">
        <demo-chart-card
          title="Bar Chart"
          description="January - June 2024"
          badge="Default"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="bar-default">
            <ui-bar-chart [data]="monthlyVisitorData" xKey="month">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
              <ui-chart-tooltip [data]="monthlyVisitorData" xKey="month" />
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Bar Chart - Horizontal"
          description="January - June 2024"
          badge="Horizontal"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="singleVisitorConfig" chartId="bar-horizontal">
            <ui-bar-chart [data]="singleVisitorData" xKey="month" orientation="horizontal">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Bar Chart - Multiple"
          description="January - June 2024"
          badge="Multiple"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="bar-multiple">
            <ui-bar-chart [data]="monthlyVisitorData" xKey="month">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Bar Chart - Stacked + Legend"
          description="January - June 2024"
          badge="Stacked"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="bar-stacked-legend">
            <ui-bar-chart [data]="monthlyVisitorData" xKey="month" variant="stacked">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-bar-chart>
            <ui-chart-legend />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Bar Chart - Label"
          description="January - June 2024"
          badge="Value labels"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="singleVisitorConfig" chartId="bar-label">
            <ui-bar-chart [data]="singleVisitorData" xKey="month" [showValueLabels]="true">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Bar Chart - Custom Label"
          description="January - June 2024"
          badge="Custom labels"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="singleVisitorConfig" chartId="bar-custom-label">
            <ui-bar-chart
              [data]="singleVisitorData"
              xKey="month"
              [showValueLabels]="true"
              [valueLabelFormat]="compactFormatter">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Bar Chart - Mixed"
          description="January - June 2024"
          badge="Mixed colors"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="singleVisitorConfig" chartId="bar-mixed">
            <ui-bar-chart [data]="singleVisitorData" xKey="month" colorKey="fill" [showValueLabels]="true">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Bar Chart - Active"
          description="January - June 2024"
          badge="Active state"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="singleVisitorConfig" chartId="bar-active">
            <ui-bar-chart
              [data]="singleVisitorData"
              xKey="month"
              [showValueLabels]="true"
              activeKey="month"
              activeValue="May">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Bar Chart - Negative"
          description="January - June 2024"
          badge="Negative"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="singleVisitorConfig" chartId="bar-negative">
            <ui-bar-chart [data]="negativeBarData" xKey="month" [showValueLabels]="true">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Bar Chart - Interactive"
          description="Last 3 months"
          badge="Interactive"
          [footerTrend]="defaultTrend"
          [footerMeta]="interactiveMeta">
          <div demo-card-toolbar class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div class="rounded-xl border border-border/60 bg-background/70 px-3 py-2">
              <div class="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Desktop</div>
              <div class="mt-1 font-semibold tabular-nums text-foreground">{{ interactiveDesktopTotal }}</div>
            </div>
            <div class="rounded-xl border border-border/60 bg-background/70 px-3 py-2">
              <div class="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Mobile</div>
              <div class="mt-1 font-semibold tabular-nums text-foreground">{{ interactiveMobileTotal }}</div>
            </div>
            <label
              class="col-span-2 flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-sm text-muted-foreground sm:col-span-2">
              <span>Range</span>
              <select class="rounded-md border border-border bg-background px-2 py-1 text-foreground">
                <option>Last 3 months</option>
              </select>
            </label>
          </div>

          <ui-chart-container [config]="visitorConfig" chartId="bar-interactive">
            <ui-bar-chart [data]="interactiveVisitorData" xKey="date">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
              <ui-chart-tooltip [data]="interactiveVisitorData" xKey="date" />
            </ui-bar-chart>
            <ui-chart-legend />
          </ui-chart-container>
        </demo-chart-card>
      </section>
    </demo-page-shell>
  `,
})
export class BarChartPageComponent {
  protected readonly visitorConfig = VISITOR_CONFIG;
  protected readonly singleVisitorConfig = SINGLE_VISITOR_CONFIG;
  protected readonly monthlyVisitorData = MONTHLY_VISITOR_DATA;
  protected readonly singleVisitorData = SINGLE_VISITOR_DATA;
  protected readonly interactiveVisitorData = INTERACTIVE_VISITOR_DATA;
  protected readonly negativeBarData = NEGATIVE_BAR_DATA;
  protected readonly defaultTrend = DEFAULT_TREND;
  protected readonly defaultMeta = DEFAULT_META;
  protected readonly interactiveMeta = INTERACTIVE_META;
  protected readonly compactFormatter = (value: number) => `${value}k`;
  protected readonly interactiveDesktopTotal = INTERACTIVE_VISITOR_DATA.reduce((sum, item) => sum + item.desktop, 0);
  protected readonly interactiveMobileTotal = INTERACTIVE_VISITOR_DATA.reduce((sum, item) => sum + item.mobile, 0);
}
