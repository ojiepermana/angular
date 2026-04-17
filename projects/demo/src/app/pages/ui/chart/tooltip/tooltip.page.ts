import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BarChart,
  ChartAxisX,
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
  type ChartTooltipLabelFormatter,
  type ChartTooltipPayload,
  type ChartTooltipValueFormatter,
} from '@ojiepermana/material/chart';

import { PageShellComponent } from '../../../../core/page-shell/page-shell';
import { ChartDemoCardComponent } from '../_shared/chart-demo-card';
import { ChartPageBadgesComponent } from '../_shared/chart-page-badges';
import { DEFAULT_META, DEFAULT_TREND, EXERCISE_CONFIG, EXERCISE_DATA } from '../_shared/chart-datasets';

/** Tiny inline icon components consumed by `EXERCISE_CONFIG_WITH_ICONS`. */
@Component({
  selector: 'demo-tooltip-running-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="material-symbols-outlined text-[14px] leading-none">directions_run</span>`,
  host: { class: 'inline-flex items-center' },
})
export class DemoTooltipRunningIconComponent {}

@Component({
  selector: 'demo-tooltip-swimming-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="material-symbols-outlined text-[14px] leading-none">pool</span>`,
  host: { class: 'inline-flex items-center' },
})
export class DemoTooltipSwimmingIconComponent {}

@Component({
  selector: 'demo-tooltip-chart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BarChart,
    ChartAxisX,
    ChartContainer,
    ChartDemoCardComponent,
    ChartPageBadgesComponent,
    ChartTooltip,
    PageShellComponent,
  ],
  template: `
    <demo-page-shell
      title="Tooltip Charts"
      description="Nine tooltip treatments modeled on the shadcn tooltip gallery: indicator variants, header overrides, value formatters, icon support, and a fully custom template with a summed total row.">
      <demo-chart-page-badges demo-page-actions [labels]="pageBadges" />

      <section class="grid gap-6 xl:grid-cols-2">
        <!-- 1. Default -->
        <demo-chart-card
          title="Tooltip - Default"
          description="Default tooltip with ChartTooltipContent."
          badge="Default"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="config" chartId="tooltip-default">
            <ui-bar-chart [data]="data" xKey="day">
              <svg:g ui-chart-axis-x></svg:g>
              <ui-chart-tooltip [data]="data" xKey="day" />
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <!-- 2. Line Indicator -->
        <demo-chart-card
          title="Tooltip - Line Indicator"
          description="Tooltip with line indicator."
          badge="Line indicator"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="config" chartId="tooltip-line">
            <ui-bar-chart [data]="data" xKey="day">
              <svg:g ui-chart-axis-x></svg:g>
              <ui-chart-tooltip [data]="data" xKey="day" indicator="line" />
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <!-- 3. No Indicator -->
        <demo-chart-card
          title="Tooltip - No Indicator"
          description="Tooltip with no indicator."
          badge="No indicator"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="config" chartId="tooltip-no-indicator">
            <ui-bar-chart [data]="data" xKey="day">
              <svg:g ui-chart-axis-x></svg:g>
              <ui-chart-tooltip [data]="data" xKey="day" indicator="none" />
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <!-- 4. Custom label -->
        <demo-chart-card
          title="Tooltip - Custom Label"
          description="Tooltip with custom label from chartConfig."
          badge="Custom label"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="configWithUmbrella" chartId="tooltip-custom-label">
            <ui-bar-chart [data]="data" xKey="day">
              <svg:g ui-chart-axis-x></svg:g>
              <ui-chart-tooltip [data]="data" xKey="day" labelKey="activities" />
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <!-- 5. Label Formatter -->
        <demo-chart-card
          title="Tooltip - Label Formatter"
          description="Tooltip with label formatter."
          badge="Label formatter"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="config" chartId="tooltip-label-formatter">
            <ui-bar-chart [data]="data" xKey="date">
              <svg:g ui-chart-axis-x></svg:g>
              <ui-chart-tooltip [data]="data" xKey="date" [labelFormatter]="longDateFormatter" />
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <!-- 6. No Label -->
        <demo-chart-card
          title="Tooltip - No Label"
          description="Tooltip with no label."
          badge="No label"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="config" chartId="tooltip-no-label">
            <ui-bar-chart [data]="data" xKey="day">
              <svg:g ui-chart-axis-x></svg:g>
              <ui-chart-tooltip [data]="data" xKey="day" [hideLabel]="true" />
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <!-- 7. Formatter -->
        <demo-chart-card
          title="Tooltip - Formatter"
          description="Tooltip with custom value formatter."
          badge="Formatter"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="config" chartId="tooltip-formatter">
            <ui-bar-chart [data]="data" xKey="day">
              <svg:g ui-chart-axis-x></svg:g>
              <ui-chart-tooltip [data]="data" xKey="day" [hideLabel]="true" [formatter]="kcalFormatter" />
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <!-- 8. Icons -->
        <demo-chart-card
          title="Tooltip - Icons"
          description="Tooltip with icons."
          badge="Icons"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="configWithIcons" chartId="tooltip-icons">
            <ui-bar-chart [data]="data" xKey="day">
              <svg:g ui-chart-axis-x></svg:g>
              <ui-chart-tooltip [data]="data" xKey="day" indicator="none" />
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>

        <!-- 9. Advanced custom template (with total row) -->
        <demo-chart-card
          title="Tooltip - Advanced"
          description="Fully custom template — adds a Total row summing every active series."
          badge="Custom template"
          [footerTrend]="defaultTrend"
          [footerMeta]="defaultMeta">
          <ui-chart-container [config]="config" chartId="tooltip-advanced">
            <ui-bar-chart [data]="data" xKey="day">
              <svg:g ui-chart-axis-x></svg:g>
              <ui-chart-tooltip [data]="data" xKey="day">
                <ng-template let-payload>
                  <ul class="grid gap-1.5">
                    @for (row of payload.rows; track row.seriesKey) {
                      <li class="flex items-center justify-between gap-3">
                        <span class="text-muted-foreground">{{ row.label }}</span>
                        <span class="font-mono font-medium tabular-nums text-foreground">
                          {{ row.value }}<span class="ml-1 font-sans text-muted-foreground">kcal</span>
                        </span>
                      </li>
                    }
                    <li
                      class="mt-1 flex items-center justify-between gap-3 border-t border-border/60 pt-1.5 text-foreground">
                      <span class="text-muted-foreground">Total</span>
                      <span class="font-mono font-medium tabular-nums">
                        {{ totalOf(payload) }}<span class="ml-1 font-sans text-muted-foreground">kcal</span>
                      </span>
                    </li>
                  </ul>
                </ng-template>
              </ui-chart-tooltip>
            </ui-bar-chart>
          </ui-chart-container>
        </demo-chart-card>
      </section>
    </demo-page-shell>
  `,
})
export class TooltipChartPageComponent {
  protected readonly config: ChartConfig = EXERCISE_CONFIG;
  protected readonly configWithUmbrella: ChartConfig = {
    activities: { label: 'Activities' },
    ...EXERCISE_CONFIG,
  };
  protected readonly configWithIcons: ChartConfig = {
    running: { ...EXERCISE_CONFIG['running'], icon: DemoTooltipRunningIconComponent },
    swimming: { ...EXERCISE_CONFIG['swimming'], icon: DemoTooltipSwimmingIconComponent },
  };
  protected readonly data = EXERCISE_DATA;
  protected readonly defaultTrend = DEFAULT_TREND;
  protected readonly defaultMeta = DEFAULT_META;
  protected readonly pageBadges = ['9 variants', 'Indicator + label knobs', 'Icons + custom template'] as const;

  /** ISO date → "July 16, 2024". */
  protected readonly longDateFormatter: ChartTooltipLabelFormatter = (label) => {
    const parsed = new Date(label);
    if (Number.isNaN(parsed.getTime())) return label;
    return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  /** 380 → "380 kcal". */
  protected readonly kcalFormatter: ChartTooltipValueFormatter = (value) => `${value} kcal`;

  /** Sum all numeric row values — used by the Advanced template. */
  protected totalOf(payload: ChartTooltipPayload): number {
    return payload.rows.reduce((sum, row) => {
      const n = typeof row.value === 'number' ? row.value : Number(row.value);
      return Number.isFinite(n) ? sum + n : sum;
    }, 0);
  }
}
