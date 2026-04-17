# @ojiepermana/material/chart

Composable, theme-aware chart primitives for Angular, inspired by shadcn/ui Chart.
Built on selective D3 modules with Angular-rendered SVG output.

Status: **v1 complete (Phases 1-8)**.

## Included

- `ChartContainer`, `ChartConfig`, and scoped CSS variable theming per chart instance
- Primitives for axes, grid, crosshair, tooltip, legend, brush, and zoom controls
- Chart types: bar, line, area, pie/donut, radar, radial, and scatter/bubble
- Accessibility support with keyboard focus management, ARIA summaries, and live tooltip announcements
- Brush, wheel zoom, and pan support for line, area, and scatter charts

Latest verified library bundle size: about 24 KB gzipped.

## Quick Start

```ts
import {
  BarChart,
  ChartAxisX,
  ChartAxisY,
  ChartContainer,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  type ChartConfig,
} from '@ojiepermana/material/chart';

const config: ChartConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
};
```

```html
<ui-chart-container [config]="config" chartId="traffic-chart">
  <ui-bar-chart [data]="data" xKey="month">
    <svg:g ui-chart-grid></svg:g>
    <svg:g ui-chart-axis-x></svg:g>
    <svg:g ui-chart-axis-y></svg:g>
    <ui-chart-tooltip [data]="data" xKey="month" />
  </ui-bar-chart>
  <ui-chart-legend />
</ui-chart-container>
```

## Public Surface

The package exports:

- Core primitives such as `ChartContainer`, `ChartContext`, `ChartConfig`, and viewport helpers
- SVG primitives such as `ChartAxisX`, `ChartAxisY`, `ChartGrid`, `ChartCrosshair`, and `ChartBrush`
- Overlay primitives such as `ChartTooltip`, `ChartLegend`, and `ChartZoomControls`
- Chart families from `bar`, `line`, `area`, `pie`, `radar`, `radial`, and `scatter`

See [projects/material/chart/public-api.ts](projects/material/chart/public-api.ts) for the full export surface.

## Demo

The showcase page lives in [projects/demo/src/app/pages/ui/chart/chart.page.ts](projects/demo/src/app/pages/ui/chart/chart.page.ts) and is wired into the demo navigation under the UI section.

## Verification

Latest v1 verification covered:

- `npx ng build material`
- `npx ng test material --watch=false`
- `npx ng build demo`
- Browser checks for line brush/reset, area wheel zoom/reset, and scatter brush/reset
