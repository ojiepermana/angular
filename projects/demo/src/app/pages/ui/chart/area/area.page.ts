import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AreaChart,
  ChartAxisX,
  ChartAxisY,
  ChartBrush,
  ChartContainer,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  ChartZoomControls,
} from '@ojiepermana/material/chart';

import { PageShellComponent } from '../../../../core/page-shell/page-shell';
import { ChartDemoCardComponent } from '../_shared/chart-demo-card';
import {
  DEFAULT_META,
  DEFAULT_TREND,
  INTERACTIVE_META,
  INTERACTIVE_VISITOR_DATA,
  MONTHLY_VISITOR_DATA,
  SINGLE_VISITOR_CONFIG,
  SINGLE_VISITOR_DATA,
  VISITOR_CONFIG,
} from '../_shared/chart-datasets';

@Component({
  selector: 'demo-area-chart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AreaChart,
    ChartAxisX,
    ChartAxisY,
    ChartBrush,
    ChartContainer,
    ChartDemoCardComponent,
    ChartGrid,
    ChartLegend,
    ChartTooltip,
    ChartZoomControls,
    PageShellComponent,
  ],
  template: `
    <demo-page-shell
      title="Area Charts"
      description="Area charts that match the shadcn demos: curve modes, stacked totals, normalized stacks, gradient fills, and an interactive zoomable panel.">
      <div demo-page-actions class="flex flex-wrap gap-2">
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          10 variants
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Stacked + 100%
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Gradient + zoom
        </span>
      </div>

      <section class="grid gap-6 xl:grid-cols-2">
        <demo-chart-card
          title="Area Chart"
          description="January - June 2024"
          badge="Default"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="area-default">
            <ui-area-chart [data]="monthlyVisitorData" xKey="month">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
              <ui-chart-tooltip [data]="monthlyVisitorData" xKey="month" />
            </ui-area-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Area Chart - Linear"
          description="January - June 2024"
          badge="Linear"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="area-linear">
            <ui-area-chart [data]="monthlyVisitorData" xKey="month" curve="linear">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-area-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Area Chart - Step"
          description="January - June 2024"
          badge="Step"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="area-step">
            <ui-area-chart [data]="monthlyVisitorData" xKey="month" curve="step">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-area-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Area Chart - Legend"
          description="January - June 2024"
          badge="Legend"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="area-legend">
            <ui-area-chart [data]="monthlyVisitorData" xKey="month" [showDots]="true">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-area-chart>
            <ui-chart-legend />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Area Chart - Stacked"
          description="January - June 2024"
          badge="Stacked"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="area-stacked">
            <ui-area-chart [data]="monthlyVisitorData" xKey="month" [stacked]="true">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-area-chart>
            <ui-chart-legend />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Area Chart - Stacked Expanded"
          description="January - June 2024"
          badge="100% stack"
          [footerTrend]="shareTrend"
          footerMeta="Showing share of total visitors by month">
          <ui-chart-container [config]="visitorConfig" chartId="area-expanded">
            <ui-area-chart [data]="monthlyVisitorData" xKey="month" [stacked]="true" [expanded]="true">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-area-chart>
            <ui-chart-legend />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Area Chart - Icons"
          description="January - June 2024"
          badge="Custom legend"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="area-icons">
            <ui-area-chart [data]="monthlyVisitorData" xKey="month" [showDots]="true">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-area-chart>
          </ui-chart-container>

          <div demo-card-after class="mt-4 grid gap-2 sm:grid-cols-2">
            <div class="flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-sm">
              <span
                class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--chart-1))/0.12] text-chart-1"
                >D</span
              >
              <div>
                <div class="font-medium text-foreground">Desktop</div>
                <div class="text-muted-foreground">Strongest lift in February</div>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-sm">
              <span
                class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--chart-2))/0.12] text-chart-2"
                >M</span
              >
              <div>
                <div class="font-medium text-foreground">Mobile</div>
                <div class="text-muted-foreground">Steady recovery through June</div>
              </div>
            </div>
          </div>
        </demo-chart-card>

        <demo-chart-card
          title="Area Chart - Gradient"
          description="January - June 2024"
          badge="Gradient"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="singleVisitorConfig" chartId="area-gradient">
            <ui-area-chart [data]="singleVisitorData" xKey="month" [showDots]="true">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-area-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Area Chart - Axes"
          description="January - June 2024"
          badge="Axes"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="singleVisitorConfig" chartId="area-axes">
            <ui-area-chart [data]="singleVisitorData" xKey="month" [gradient]="false" [showDots]="true" [dotRadius]="4">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-area-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Area Chart - Interactive"
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

          <ui-chart-container [config]="visitorConfig" chartId="area-interactive">
            <ui-area-chart [data]="interactiveVisitorData" xKey="date">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
              <svg:g ui-chart-brush></svg:g>
              <ui-chart-tooltip [data]="interactiveVisitorData" xKey="date" />
            </ui-area-chart>
            <ui-chart-legend />
            <ui-chart-zoom-controls />
          </ui-chart-container>
        </demo-chart-card>
      </section>
    </demo-page-shell>
  `,
})
export class AreaChartPageComponent {
  protected readonly visitorConfig = VISITOR_CONFIG;
  protected readonly singleVisitorConfig = SINGLE_VISITOR_CONFIG;
  protected readonly monthlyVisitorData = MONTHLY_VISITOR_DATA;
  protected readonly singleVisitorData = SINGLE_VISITOR_DATA;
  protected readonly interactiveVisitorData = INTERACTIVE_VISITOR_DATA;
  protected readonly defaultTrend = DEFAULT_TREND;
  protected readonly defaultMeta = DEFAULT_META;
  protected readonly interactiveMeta = INTERACTIVE_META;
  protected readonly shareTrend = 'Desktop share stays ahead even in lower-volume months';
  protected readonly interactiveDesktopTotal = INTERACTIVE_VISITOR_DATA.reduce((sum, item) => sum + item.desktop, 0);
  protected readonly interactiveMobileTotal = INTERACTIVE_VISITOR_DATA.reduce((sum, item) => sum + item.mobile, 0);
}
