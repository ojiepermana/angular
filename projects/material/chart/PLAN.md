# Chart Library — Build Plan

Inspired by [shadcn/ui Chart](https://ui.shadcn.com/docs/components/radix/chart), built natively on Angular with D3.

Current status: **completed through Phase 8**.

---

## 1. Confirmed Decisions

| Area             | Decision                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Engine**       | D3.js (selective modules) — build primitives ourselves, SVG output                                                                         |
| **API style**    | Fully composable, mirror shadcn (`<ChartContainer>` + sub-components via content projection / DI)                                          |
| **Theming**      | Reuse `projects/material/theme` tokens; inject per-instance CSS vars (`--color-<key>`) from `ChartConfig`                                  |
| **Chart tokens** | Add `--chart-1`..`--chart-5` to theme (light + dark), shadcn palette                                                                       |
| **SSR**          | Not required (client-only)                                                                                                                 |
| **A11y target**  | WCAG AA full + keyboard nav per data point + ARIA live tooltip                                                                             |
| **Package**      | Secondary entry point `material/chart` (public-api at `projects/material/chart/public-api.ts`)                                             |
| **Prefix**       | `ui-` (konsisten dengan shadcn lib)                                                                                                        |
| **Testing**      | Vitest unit + component smoke (no visual regression in v1)                                                                                 |
| **Demo**         | `projects/demo/src/app/pages/ui/chart/` dengan semua varian                                                                                |
| **Animation**    | `d3-transition`                                                                                                                            |
| **D3 modules**   | `d3-scale`, `d3-shape`, `d3-array`, `d3-selection`, `d3-axis`, `d3-interpolate`, `d3-format`, `d3-time`, `d3-time-format`, `d3-transition` |

### Interactions (v1)

Hover tooltip + crosshair, legend click-to-toggle, entry animation, ResizeObserver responsive, data point click output. Brush/zoom/pan is implemented for Line, Area, and Scatter in Phase 8.

### Chart types (v1 scope)

Bar (vertical/horizontal/stacked), Line (single/multi), Area (single/stacked/gradient), Pie/Donut, Radar, Radial/Gauge, Scatter/Bubble.

---

## 2. Architecture Overview

### Component tree (mirror shadcn)

```
<ui-chart-container [config]="cfg">          ← provides ChartContext (DI), injects <ChartStyle>
  <ui-bar-chart [data]="data">                ← chart implementation (SVG root + scales)
    <ui-chart-grid/>                          ← optional primitives
    <ui-chart-x-axis/>
    <ui-chart-y-axis/>
    <ui-chart-tooltip>                        ← trigger (handles pointer events)
      <ui-chart-tooltip-content/>             ← presentation (projected)
    </ui-chart-tooltip>
    <ui-chart-legend>
      <ui-chart-legend-content/>
    </ui-chart-legend>
  </ui-bar-chart>
</ui-chart-container>
```

### Key internal pieces

- **`ChartContext` service** (provided by `ChartContainer`): holds `config` signal, `activeIndex` signal, `hiddenSeries` set, dimensions signal (ResizeObserver).
- **`ChartStyle` directive/component**: generates `<style>` with `[data-chart="<id>"] { --color-<key>: <value>; }` scoped per chart instance.
- **Scales registry** (per chart type): derives x/y/color scales from data + config, exposed as computed signals so sub-components (axis, grid, tooltip crosshair) consume the same scale.
- **`ChartConfig` type**:
  ```ts
  type ChartConfig = Record<
    string,
    {
      label?: string;
      icon?: Type<unknown>;
      color?: string; // raw color (hex/hsl/oklch)
      theme?: { light: string; dark: string }; // theme-aware
    }
  >;
  ```

### Folder layout

```
projects/material/chart/
├── ng-package.json
├── public-api.ts
├── README.md
└── src/lib/
    ├── core/
    │   ├── chart-config.ts            # ChartConfig type + utilities
    │   ├── chart-context.ts           # Context service (signals)
    │   ├── chart-style.ts             # CSS var injector
    │   ├── chart-container.ts         # Root <ui-chart-container>
    │   ├── scales/                    # scale factories (band/linear/time/point)
    │   ├── utils/                     # format, math, color helpers
    │   └── a11y/                      # keyboard nav directive
    ├── primitives/
    │   ├── chart-grid.ts
    │   ├── chart-axis-x.ts
    │   ├── chart-axis-y.ts
    │   ├── chart-tooltip.ts           # trigger
    │   ├── chart-tooltip-content.ts   # presentation
    │   ├── chart-legend.ts
    │   └── chart-legend-content.ts
    └── charts/
        ├── bar/
        ├── line/
        ├── area/
        ├── pie/
        ├── radar/
        ├── radial/
        └── scatter/
```

---

## 3. Phased Execution

### **Phase 1 — Foundation** _(checkpoint before Phase 2)_

1. `angular.json` entry for `material:chart` secondary library build config.
2. `projects/material/chart/{ng-package.json, public-api.ts, src/lib/}` scaffold.
3. Install selective D3 modules + types (`d3-scale`, `d3-shape`, `d3-array`, `d3-selection`, `d3-axis`, `d3-interpolate`, `d3-format`, `d3-time`, `d3-time-format`, `d3-transition`).
4. Add `--chart-1` … `--chart-5` tokens to `projects/material/theme/src/lib/styles/_base.css` (light + dark) — shadcn palette (OKLCH).
5. Implement `ChartConfig` type, `ChartContext` service (signals), `ChartStyle` directive.
6. Implement `ChartContainer` component: accepts `config` input, generates unique id, provides `ChartContext`, wires `ResizeObserver`, emits dimensions signal, renders `<ChartStyle>` + projected content.
7. Unit tests: `chart-style` CSS var generation, context initialization.

**Exit criteria**: `<ui-chart-container [config]>` renders, CSS vars reachable in devtools, dimensions signal updates on resize.

### **Phase 2 — Bar chart + axes/grid**

1. `ChartAxisX`, `ChartAxisY`, `ChartGrid` primitives (consume scales from context).
2. `BarChart` component: band scale X, linear scale Y, vertical/horizontal/stacked variants via input.
3. `d3-transition` draw-in animation (bars grow from baseline).
4. Unit: scale derivation; smoke: render with sample data.

### **Phase 3 — Line + Area charts**

1. `LineChart` (multi-series, `d3-shape.line`, path length animation for draw-in).
2. `AreaChart` (stacked via `d3-shape.stack`, gradient fill using `<linearGradient>` + CSS vars).
3. Share axis/grid primitives.

### **Phase 4 — Tooltip + Legend polish**

1. `ChartTooltip` (pointer tracking, crosshair line/rect, viewport-aware positioning).
2. `ChartTooltipContent` (default template — projected override supported).
3. `ChartLegend` + `ChartLegendContent` (click toggles `hiddenSeries` in context, charts react via signal).
4. ARIA live region for tooltip announcements.

### **Phase 5 — Pie/Donut + Radar + Radial + Scatter/Bubble**

1. `PieChart` (d3-shape.arc + pie, donut via innerRadius input).
2. `RadarChart` (radial linear + angle scale, `d3-shape.lineRadial`).
3. `RadialChart` / gauge (single- or multi-arc progress).
4. `ScatterChart` / bubble (linear x/y + size scale).

### **Phase 6 — Demo showcase**

1. `projects/demo/src/app/pages/ui/chart/` with one page per chart type + variants.
2. Update `navigation.data.ts` to include chart demos.
3. Document `ChartConfig` usage patterns in demo page source.

### **Phase 7 — Accessibility hardening**

1. Roving tabindex directive for data points (arrow keys move between points, Enter triggers click output).
2. `role="img"` + `aria-label` auto-summary per chart (e.g. "Bar chart. 6 categories. Values from X to Y.").
3. Contrast audit of chart tokens in both themes.
4. Screen reader pass (VoiceOver smoke test).

### **Phase 8 — Brush / Zoom / Pan** _(optional final phase)_

1. `ChartBrush` primitive (drag-to-select range, emits `brushRange` to context).
2. Zoom/pan via wheel + touch gestures on axis scales.
3. Only wire for Line/Area/Scatter in v1.

---

## 4. Risks & Mitigations

| Risk                                                    | Mitigation                                                                                                                                                                |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D3 + Angular change detection friction (D3 mutates DOM) | Keep D3 role strictly to **math/scales**; render SVG via Angular templates. Only use `d3-selection` inside effects for transitions that can't be expressed declaratively. |
| Tooltip positioning edge cases (viewport, scroll)       | Port shadcn tooltip logic; use `@angular/cdk/overlay` if needed (already in deps).                                                                                        |
| Bundle creep from D3                                    | Selective imports only; verify with `ng build --stats-json` after each phase. Target chart lib < 60kb gzipped.                                                            |
| A11y keyboard nav complexity                            | Isolate in reusable directive; apply same pattern across chart types.                                                                                                     |
| Stacked/grouped variants explosion of inputs            | Use discriminated union input `variant: 'grouped' \| 'stacked' \| 'percent'` instead of flag soup.                                                                        |

---

## 5. Success Criteria (v1 done = all of the below)

- [x] All chart types in scope render correctly with sample data
- [x] Composable API parity with shadcn (developer can swap any sub-component)
- [x] Theme tokens drive colors; dark mode works via existing theme toggle
- [x] Responsive (ResizeObserver) on all charts
- [x] Tooltip + Legend work across all applicable chart types
- [x] WCAG AA: keyboard nav, ARIA labels, contrast pass
- [x] Demo page for each chart type live in `projects/demo`
- [x] Unit + smoke tests green
- [x] Library builds via `ng build material` without errors
- [x] Bundle < 60kb gzipped (chart lib only)

---

## 6. Next Action

**v1 is complete.** Last verified state:

1. `npx ng build material` passes.
2. `npx ng test material --watch=false` passes.
3. `npx ng build demo` passes.
4. Chart library bundle is about `24069` bytes gzipped.

Follow-up work should be defined as a new scope, not as an unfinished v1 phase.
