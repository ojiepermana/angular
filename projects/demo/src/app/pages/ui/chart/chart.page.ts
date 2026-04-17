import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AreaChart,
  BarChart,
  ChartAxisX,
  ChartAxisY,
  ChartBrush,
  ChartContainer,
  ChartCrosshair,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  ChartZoomControls,
  LineChart,
  PieChart,
  RadarChart,
  RadialChart,
  ScatterChart,
  type ChartConfig,
} from '@ojiepermana/material/chart';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

const CHANNEL_CONFIG: ChartConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
  partner: { label: 'Partner', color: 'hsl(var(--chart-3))' },
};

const CHANNEL_DATA = [
  { month: 'Jan', desktop: 182, mobile: 126, partner: 74 },
  { month: 'Feb', desktop: 214, mobile: 158, partner: 88 },
  { month: 'Mar', desktop: 238, mobile: 173, partner: 96 },
  { month: 'Apr', desktop: 251, mobile: 184, partner: 104 },
  { month: 'May', desktop: 276, mobile: 206, partner: 128 },
  { month: 'Jun', desktop: 294, mobile: 219, partner: 141 },
] as const;

const LATENCY_CONFIG: ChartConfig = {
  api: { label: 'API', color: 'hsl(var(--chart-1))' },
  worker: { label: 'Worker', color: 'hsl(var(--chart-2))' },
  queue: { label: 'Queue', color: 'hsl(var(--chart-5))' },
};

const LATENCY_DATA = [
  { week: 'W1', api: 186, worker: 138, queue: 98 },
  { week: 'W2', api: 172, worker: 126, queue: 92 },
  { week: 'W3', api: 160, worker: 118, queue: 84 },
  { week: 'W4', api: 144, worker: 104, queue: 74 },
  { week: 'W5', api: 138, worker: 96, queue: 70 },
  { week: 'W6', api: 126, worker: 88, queue: 64 },
] as const;

const SHARE_CONFIG: ChartConfig = {
  chrome: { label: 'Chrome', color: 'hsl(var(--chart-1))' },
  safari: { label: 'Safari', color: 'hsl(var(--chart-2))' },
  firefox: { label: 'Firefox', color: 'hsl(var(--chart-3))' },
  edge: { label: 'Edge', color: 'hsl(var(--chart-5))' },
};

const SHARE_DATA = [
  { browser: 'chrome', visitors: 312 },
  { browser: 'safari', visitors: 228 },
  { browser: 'firefox', visitors: 176 },
  { browser: 'edge', visitors: 92 },
] as const;

const RADAR_CONFIG: ChartConfig = {
  product: { label: 'Product', color: 'hsl(var(--chart-1))' },
  growth: { label: 'Growth', color: 'hsl(var(--chart-2))' },
  ops: { label: 'Ops', color: 'hsl(var(--chart-3))' },
};

const RADAR_DATA = [
  { metric: 'Speed', product: 88, growth: 76, ops: 64 },
  { metric: 'Clarity', product: 74, growth: 92, ops: 70 },
  { metric: 'Scale', product: 82, growth: 64, ops: 88 },
  { metric: 'A11y', product: 68, growth: 58, ops: 86 },
  { metric: 'Resilience', product: 78, growth: 62, ops: 94 },
  { metric: 'Delight', product: 92, growth: 84, ops: 56 },
] as const;

const RADIAL_CONFIG: ChartConfig = {
  design: { label: 'Design', color: 'hsl(var(--chart-1))' },
  platform: { label: 'Platform', color: 'hsl(var(--chart-2))' },
  support: { label: 'Support', color: 'hsl(var(--chart-3))' },
  growth: { label: 'Growth', color: 'hsl(var(--chart-5))' },
};

const RADIAL_DATA = [
  { team: 'design', value: 74 },
  { team: 'platform', value: 91 },
  { team: 'support', value: 63 },
  { team: 'growth', value: 84 },
] as const;

const SCATTER_CONFIG: ChartConfig = {
  core: { label: 'Core', color: 'hsl(var(--chart-1))' },
  growth: { label: 'Growth', color: 'hsl(var(--chart-2))' },
  labs: { label: 'Labs', color: 'hsl(var(--chart-5))' },
};

const SCATTER_DATA = [
  { x: 12, y: 26, revenue: 18, cluster: 'core' },
  { x: 18, y: 42, revenue: 24, cluster: 'core' },
  { x: 26, y: 54, revenue: 38, cluster: 'growth' },
  { x: 34, y: 72, revenue: 46, cluster: 'growth' },
  { x: 42, y: 68, revenue: 52, cluster: 'growth' },
  { x: 48, y: 36, revenue: 28, cluster: 'labs' },
  { x: 56, y: 58, revenue: 42, cluster: 'labs' },
  { x: 64, y: 82, revenue: 58, cluster: 'labs' },
] as const;

@Component({
  selector: 'demo-chart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AreaChart,
    BarChart,
    ChartAxisX,
    ChartAxisY,
    ChartBrush,
    ChartContainer,
    ChartCrosshair,
    ChartGrid,
    ChartLegend,
    ChartTooltip,
    ChartZoomControls,
    LineChart,
    PageShellComponent,
    PieChart,
    RadarChart,
    RadialChart,
    ScatterChart,
  ],
  template: `
    <demo-page-shell
      title="Charts"
      description="Composable chart primitives for Angular: cartesian, polar, themed through scoped CSS variables, with opt-in axes, grid, tooltips, legends, and custom overlays.">
      <div demo-page-actions class="flex flex-wrap gap-2">
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Cartesian + Polar
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Theme Scoped
        </span>
        <span
          class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Brush / Zoom / Pan
        </span>
      </div>

      <section
        class="relative mb-10 overflow-hidden rounded-4xl border border-border/70 bg-linear-to-br from-background via-background to-muted/40 p-6 shadow-sm md:p-8">
        <div
          class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent"></div>
        <div class="grid gap-8 lg:grid-cols-[1.5fr_0.85fr] lg:items-end">
          <div>
            <p class="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Chart Atelier</p>
            <h2 class="max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              A single demo surface for every chart family now living in the library.
            </h2>
            <p class="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              The page is arranged like a control board: cartesian narratives first, polar systems after that, and a
              scatter field for exploratory data. The goal is to show real composition, not isolated screenshots.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div class="rounded-2xl border border-border/70 bg-background/80 p-4 backdrop-blur-sm">
              <div class="text-2xl font-semibold text-foreground">7</div>
              <p class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Chart families</p>
            </div>
            <div class="rounded-2xl border border-border/70 bg-background/80 p-4 backdrop-blur-sm">
              <div class="text-2xl font-semibold text-foreground">2</div>
              <p class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Systems: cartesian + polar</p>
            </div>
            <div class="rounded-2xl border border-border/70 bg-background/80 p-4 backdrop-blur-sm">
              <div class="text-2xl font-semibold text-foreground">Live</div>
              <p class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Legend and tooltip interactions
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Cartesian System</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Axes, grid, crosshair, layered overlays
            </h2>
          </div>
          <p class="max-w-md text-right text-sm text-muted-foreground">
            These examples lean into the composable primitives introduced in earlier phases.
          </p>
        </div>

        <div class="grid gap-6 xl:grid-cols-2">
          <article class="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
            <header class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Revenue Pulse</h3>
                <p class="mt-1 max-w-xl text-sm text-muted-foreground">
                  Grouped bars with grid, crosshair, default tooltip, and a shared legend.
                </p>
              </div>
              <span
                class="rounded-full border border-border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Bar / grouped
              </span>
            </header>

            <div class="mt-5 rounded-[1.35rem] border border-border/60 bg-linear-to-br from-background to-muted/25 p-3">
              <ui-chart-container [config]="channelConfig" chartId="demo-chart-revenue-bar">
                <ui-bar-chart [data]="channelData" xKey="month">
                  <svg:g ui-chart-grid></svg:g>
                  <svg:g ui-chart-axis-x></svg:g>
                  <svg:g ui-chart-axis-y></svg:g>
                  <svg:g ui-chart-crosshair></svg:g>
                  <ui-chart-tooltip [data]="channelData" xKey="month" />
                </ui-bar-chart>
                <ui-chart-legend />
              </ui-chart-container>
            </div>
          </article>

          <article class="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
            <header class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Latency Descent</h3>
                <p class="mt-1 max-w-xl text-sm text-muted-foreground">
                  Drag across the plot to brush a focused time window, use the wheel to zoom, and drag on touch to pan.
                </p>
              </div>
              <span
                class="rounded-full border border-border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Line / brush + zoom
              </span>
            </header>

            <div class="mt-5 rounded-[1.35rem] border border-border/60 bg-linear-to-br from-background to-muted/25 p-3">
              <ui-chart-container [config]="latencyConfig" chartId="demo-chart-latency-line">
                <ui-line-chart [data]="latencyData" xKey="week">
                  <svg:g ui-chart-grid></svg:g>
                  <svg:g ui-chart-axis-x></svg:g>
                  <svg:g ui-chart-axis-y></svg:g>
                  <svg:g ui-chart-brush></svg:g>
                  <ui-chart-zoom-controls />
                </ui-line-chart>
                <ui-chart-legend />
              </ui-chart-container>
            </div>
          </article>

          <article class="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
            <header class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Contribution Canopy</h3>
                <p class="mt-1 max-w-xl text-sm text-muted-foreground">
                  The same viewport interaction also works on area charts. Brush a subset, then wheel in for tighter
                  inspection.
                </p>
              </div>
              <span
                class="rounded-full border border-border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Area / brush + zoom
              </span>
            </header>

            <div class="mt-5 rounded-[1.35rem] border border-border/60 bg-linear-to-br from-background to-muted/25 p-3">
              <ui-chart-container [config]="channelConfig" chartId="demo-chart-contribution-area">
                <ui-area-chart [data]="channelData" xKey="month" [stacked]="true" [showDots]="true">
                  <svg:g ui-chart-grid></svg:g>
                  <svg:g ui-chart-axis-x></svg:g>
                  <svg:g ui-chart-axis-y></svg:g>
                  <svg:g ui-chart-brush></svg:g>
                  <ui-chart-zoom-controls />
                </ui-area-chart>
                <ui-chart-legend />
              </ui-chart-container>
            </div>
          </article>

          <article class="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
            <header class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Channel Mix Board</h3>
                <p class="mt-1 max-w-xl text-sm text-muted-foreground">
                  Horizontal stacked bars are useful when labels grow wider or the goal is direct part-to-whole
                  comparison.
                </p>
              </div>
              <span
                class="rounded-full border border-border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Bar / horizontal stacked
              </span>
            </header>

            <div class="mt-5 rounded-[1.35rem] border border-border/60 bg-linear-to-br from-background to-muted/25 p-3">
              <ui-chart-container [config]="channelConfig" chartId="demo-chart-horizontal-bar">
                <ui-bar-chart [data]="channelData" xKey="month" orientation="horizontal" variant="stacked">
                  <svg:g ui-chart-grid></svg:g>
                  <svg:g ui-chart-axis-x></svg:g>
                  <svg:g ui-chart-axis-y></svg:g>
                </ui-bar-chart>
                <ui-chart-legend />
              </ui-chart-container>
            </div>
          </article>
        </div>
      </section>

      <section class="mb-12">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Polar System</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight text-foreground">Slices, spokes, tracks</h2>
          </div>
          <p class="max-w-md text-right text-sm text-muted-foreground">
            Polar layouts read differently, so this section gives each one its own stage.
          </p>
        </div>

        <div class="grid gap-6 xl:grid-cols-3">
          <article class="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
            <header class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Traffic Share</h3>
                <p class="mt-1 text-sm text-muted-foreground">
                  Donut summary of browser distribution with an overlaid center metric.
                </p>
              </div>
              <span
                class="rounded-full border border-border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Pie / donut
              </span>
            </header>

            <div
              class="relative mt-5 rounded-[1.35rem] border border-border/60 bg-linear-to-br from-background to-muted/25 p-3">
              <ui-chart-container [config]="shareConfig" chartId="demo-chart-share-donut">
                <ui-pie-chart [data]="shareData" nameKey="browser" valueKey="visitors" [innerRadius]="56" />
              </ui-chart-container>
              <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                  >Monthly audience</span
                >
                <span class="mt-1 text-2xl font-semibold text-foreground">{{ totalShareVisitors }}</span>
              </div>
            </div>

            <div class="mt-4 grid gap-2 text-sm">
              @for (item of shareData; track item.browser) {
                <div
                  class="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-3 py-2">
                  <span class="text-muted-foreground">{{ shareConfig[item.browser]?.label }}</span>
                  <span class="font-medium tabular-nums text-foreground">{{ item.visitors }}</span>
                </div>
              }
            </div>
          </article>

          <article class="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
            <header class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Team Signal Radar</h3>
                <p class="mt-1 text-sm text-muted-foreground">
                  Three operating modes on one six-axis radar with visible legend control.
                </p>
              </div>
              <span
                class="rounded-full border border-border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Radar
              </span>
            </header>

            <div class="mt-5 rounded-[1.35rem] border border-border/60 bg-linear-to-br from-background to-muted/25 p-3">
              <ui-chart-container [config]="radarConfig" chartId="demo-chart-radar">
                <ui-radar-chart [data]="radarData" axisKey="metric" curve="cardinal" />
                <ui-chart-legend />
              </ui-chart-container>
            </div>
          </article>

          <article class="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
            <header class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Capacity Rings</h3>
                <p class="mt-1 text-sm text-muted-foreground">
                  Radial bars compress four team loads into one concentric read.
                </p>
              </div>
              <span
                class="rounded-full border border-border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Radial bar
              </span>
            </header>

            <div class="mt-5 rounded-[1.35rem] border border-border/60 bg-linear-to-br from-background to-muted/25 p-3">
              <ui-chart-container [config]="radialConfig" chartId="demo-chart-radial">
                <ui-radial-chart [data]="radialData" nameKey="team" valueKey="value" />
              </ui-chart-container>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
              @for (item of radialData; track item.team) {
                <div class="rounded-xl border border-border/60 bg-background/70 px-3 py-2">
                  <div class="text-muted-foreground">{{ radialConfig[item.team]?.label }}</div>
                  <div class="mt-1 font-medium tabular-nums text-foreground">{{ item.value }}%</div>
                </div>
              }
            </div>
          </article>
        </div>
      </section>

      <section>
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Exploration Field</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight text-foreground">Scatter as a planning surface</h2>
          </div>
          <p class="max-w-md text-right text-sm text-muted-foreground">
            Here point size encodes ARR and color encodes stream ownership. Drag a rectangle to zoom both axes.
          </p>
        </div>

        <article class="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
          <div class="grid gap-5 lg:grid-cols-[1fr_16rem]">
            <div class="rounded-[1.35rem] border border-border/60 bg-linear-to-br from-background to-muted/25 p-3">
              <ui-chart-container [config]="scatterConfig" chartId="demo-chart-scatter">
                <ui-scatter-chart [data]="scatterData" xKey="x" yKey="y" sizeKey="revenue" seriesKey="cluster">
                  <svg:g ui-chart-brush></svg:g>
                  <ui-chart-zoom-controls />
                </ui-scatter-chart>
              </ui-chart-container>
            </div>

            <aside class="grid gap-3 self-start">
              <div class="rounded-2xl border border-border/60 bg-background/80 p-4">
                <h3 class="text-sm font-semibold text-foreground">Encoding</h3>
                <p class="mt-2 text-sm text-muted-foreground">X = maturity, Y = urgency, radius = ARR exposure.</p>
              </div>
              <div class="rounded-2xl border border-border/60 bg-background/80 p-4">
                <h3 class="text-sm font-semibold text-foreground">Streams</h3>
                <div class="mt-3 grid gap-2 text-sm">
                  <div class="flex items-center justify-between gap-3">
                    <span class="flex items-center gap-2 text-muted-foreground">
                      <span class="h-2.5 w-2.5 rounded-full bg-chart-1"></span>
                      Core
                    </span>
                    <span class="font-medium text-foreground">Stability</span>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="flex items-center gap-2 text-muted-foreground">
                      <span class="h-2.5 w-2.5 rounded-full bg-chart-2"></span>
                      Growth
                    </span>
                    <span class="font-medium text-foreground">Expansion</span>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="flex items-center gap-2 text-muted-foreground">
                      <span class="h-2.5 w-2.5 rounded-full bg-chart-5"></span>
                      Labs
                    </span>
                    <span class="font-medium text-foreground">Experiment</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </section>
    </demo-page-shell>
  `,
})
export class ChartPageComponent {
  protected readonly channelConfig = CHANNEL_CONFIG;
  protected readonly channelData = CHANNEL_DATA;

  protected readonly latencyConfig = LATENCY_CONFIG;
  protected readonly latencyData = LATENCY_DATA;

  protected readonly shareConfig = SHARE_CONFIG;
  protected readonly shareData = SHARE_DATA;
  protected readonly totalShareVisitors = SHARE_DATA.reduce((sum, item) => sum + item.visitors, 0);

  protected readonly radarConfig = RADAR_CONFIG;
  protected readonly radarData = RADAR_DATA;

  protected readonly radialConfig = RADIAL_CONFIG;
  protected readonly radialData = RADIAL_DATA;

  protected readonly scatterConfig = SCATTER_CONFIG;
  protected readonly scatterData = SCATTER_DATA;
}
