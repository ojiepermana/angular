import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ChartAxisX,
  ChartAxisY,
  ChartContainer,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  LineChart,
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
  selector: 'demo-line-chart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChartAxisX,
    ChartAxisY,
    ChartContainer,
    ChartDemoCardComponent,
    ChartGrid,
    ChartLegend,
    ChartTooltip,
    LineChart,
    PageShellComponent,
  ],
  template: `
    <demo-page-shell
      title="Line Charts"
      description="Line charts with the same visual rhythm as the shadcn gallery: curve modes, dot treatments, value labels, and the interactive comparison panel.">
      <div demo-page-actions class="flex flex-wrap gap-2">
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          10 variants
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Monotone + linear + step
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Dots + labels
        </span>
      </div>

      <section class="grid gap-6 xl:grid-cols-2">
        <demo-chart-card
          title="Line Chart"
          description="January - June 2024"
          badge="Default"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="line-default">
            <ui-line-chart [data]="monthlyVisitorData" xKey="month">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
              <ui-chart-tooltip [data]="monthlyVisitorData" xKey="month" />
            </ui-line-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Line Chart - Linear"
          description="January - June 2024"
          badge="Linear"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="line-linear">
            <ui-line-chart [data]="monthlyVisitorData" xKey="month" curve="linear">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-line-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Line Chart - Step"
          description="January - June 2024"
          badge="Step"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="line-step">
            <ui-line-chart [data]="monthlyVisitorData" xKey="month" curve="step">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-line-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Line Chart - Multiple"
          description="January - June 2024"
          badge="Multiple"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="line-multiple">
            <ui-line-chart [data]="monthlyVisitorData" xKey="month">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-line-chart>
            <ui-chart-legend />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Line Chart - Dots"
          description="January - June 2024"
          badge="Dots"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="line-dots">
            <ui-line-chart [data]="monthlyVisitorData" xKey="month" [dotRadius]="4">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-line-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Line Chart - Custom Dots"
          description="January - June 2024"
          badge="Custom dots"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="visitorConfig" chartId="line-custom-dots">
            <ui-line-chart
              [data]="monthlyVisitorData"
              xKey="month"
              [dotRadius]="4"
              dotStrokeColor="hsl(var(--background))"
              [dotStrokeWidth]="2">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-line-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Line Chart - Dots Colors"
          description="January - June 2024"
          badge="Dot colors"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="singleVisitorConfig" chartId="line-dot-colors">
            <ui-line-chart [data]="singleVisitorData" xKey="month" dotColorKey="dotTone" [dotRadius]="4">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-line-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Line Chart - Label"
          description="January - June 2024"
          badge="Value labels"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="singleVisitorConfig" chartId="line-label">
            <ui-line-chart [data]="singleVisitorData" xKey="month" [showValueLabels]="true">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-line-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Line Chart - Custom Label"
          description="January - June 2024"
          badge="Custom labels"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="singleVisitorConfig" chartId="line-custom-label">
            <ui-line-chart
              [data]="singleVisitorData"
              xKey="month"
              [showValueLabels]="true"
              [valueLabelFormat]="compactFormatter">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
            </ui-line-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Line Chart - Interactive"
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

          <ui-chart-container [config]="visitorConfig" chartId="line-interactive">
            <ui-line-chart [data]="interactiveVisitorData" xKey="date">
              <svg:g ui-chart-grid></svg:g>
              <svg:g ui-chart-axis-x></svg:g>
              <svg:g ui-chart-axis-y></svg:g>
              <ui-chart-tooltip [data]="interactiveVisitorData" xKey="date" />
            </ui-line-chart>
            <ui-chart-legend />
          </ui-chart-container>
        </demo-chart-card>
      </section>
    </demo-page-shell>
  `,
})
export class LineChartPageComponent {
  protected readonly visitorConfig = VISITOR_CONFIG;
  protected readonly singleVisitorConfig = SINGLE_VISITOR_CONFIG;
  protected readonly monthlyVisitorData = MONTHLY_VISITOR_DATA;
  protected readonly singleVisitorData = SINGLE_VISITOR_DATA;
  protected readonly interactiveVisitorData = INTERACTIVE_VISITOR_DATA;
  protected readonly defaultTrend = DEFAULT_TREND;
  protected readonly defaultMeta = DEFAULT_META;
  protected readonly interactiveMeta = INTERACTIVE_META;
  protected readonly compactFormatter = (value: number) => `${value}k`;
  protected readonly interactiveDesktopTotal = INTERACTIVE_VISITOR_DATA.reduce((sum, item) => sum + item.desktop, 0);
  protected readonly interactiveMobileTotal = INTERACTIVE_VISITOR_DATA.reduce((sum, item) => sum + item.mobile, 0);
}
