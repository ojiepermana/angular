import type { Type } from '@angular/core';

/**
 * Theme-aware color definition for a chart series.
 *
 * Either:
 * - a single `color` string (raw CSS color — hex, hsl, oklch, CSS var ref), or
 * - a `theme` map whose keys match the document color scheme (`light` / `dark`).
 *
 * Values are injected verbatim into a scoped `<style>` block as
 * `--color-<key>: <value>;`, so any valid CSS color works.
 *
 * Defaults reference the theme tokens from `@ojiepermana/material/theme`
 * (e.g. `'hsl(var(--chart-1))'`).
 */
export interface ChartSeriesConfig {
  /** Human-readable label (shown in legend, tooltip). */
  readonly label?: string;
  /** Optional icon component rendered next to the label. */
  readonly icon?: Type<unknown>;
  /** Raw color. Mutually exclusive with `theme`. */
  readonly color?: string;
  /** Theme-aware colors — keyed by color scheme. */
  readonly theme?: Readonly<Record<ChartThemeKey, string>>;
}

/** Supported color scheme keys. */
export type ChartThemeKey = 'light' | 'dark';

/** Map of series-key → config. */
export type ChartConfig = Readonly<Record<string, ChartSeriesConfig>>;

/** CSS selector under which a chart instance is scoped. */
export const CHART_DATA_ATTRIBUTE = 'data-chart';

/** Default color schemes supported by the generated `<style>` block. */
export const CHART_THEMES: ReadonlyArray<{
  readonly key: ChartThemeKey;
  readonly selector: string;
}> = [
  { key: 'light', selector: '' },
  { key: 'dark', selector: '.dark' },
];

/**
 * Generate the CSS rule-set for a chart instance: one `--color-<key>` per
 * series, scoped to the owning `[data-chart]` element, with optional dark
 * variant via `.dark [data-chart="…"]`.
 *
 * Series without any color are skipped (consumer can fall back to a default).
 *
 * @param chartId  Unique chart id (used as attribute value).
 * @param config   Series configuration map.
 */
export function buildChartCss(chartId: string, config: ChartConfig): string {
  const entries = Object.entries(config).filter(([, cfg]) => cfg.color || cfg.theme);
  if (entries.length === 0) {
    return '';
  }

  return CHART_THEMES.map(({ key, selector }) => {
    const vars = entries
      .map(([seriesKey, cfg]) => {
        const value = cfg.theme?.[key] ?? cfg.color;
        return value ? `  --color-${escapeCssIdent(seriesKey)}: ${value};` : '';
      })
      .filter(Boolean)
      .join('\n');

    if (!vars) {
      return '';
    }

    const scope = selector
      ? `${selector} [${CHART_DATA_ATTRIBUTE}="${chartId}"]`
      : `[${CHART_DATA_ATTRIBUTE}="${chartId}"]`;
    return `${scope} {\n${vars}\n}`;
  })
    .filter(Boolean)
    .join('\n');
}

/**
 * Escape a string so it is safe to use as a CSS custom-property identifier.
 * Allows `[A-Za-z0-9_-]`; everything else becomes `_`.
 */
function escapeCssIdent(input: string): string {
  return input.replace(/[^a-zA-Z0-9_-]/g, '_');
}

/** Resolve the `var(--color-<key>)` reference for a given series. */
export function seriesColorVar(seriesKey: string): string {
  return `var(--color-${seriesKey.replace(/[^a-zA-Z0-9_-]/g, '_')})`;
}
