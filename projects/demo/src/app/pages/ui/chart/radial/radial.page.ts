import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartContainer, ChartTooltip, RadialCenter, RadialChart } from '@ojiepermana/material/chart';

import { PageShellComponent } from '../../../../core/page-shell/page-shell';
import { ChartDemoCardComponent } from '../_shared/chart-demo-card';
import { ChartPageBadgesComponent } from '../_shared/chart-page-badges';
import {
  BROWSER_CONFIG,
  BROWSER_DATA,
  RADIAL_SHAPE_DATA,
  RADIAL_SHAPE_MAX,
  RADIAL_STACKED_DATA,
  RADIAL_STACKED_TOTAL,
  RADIAL_TEXT_DATA,
  RADIAL_TEXT_MAX,
  VISITOR_CONFIG,
} from '../_shared/chart-datasets';

@Component({
  selector: 'demo-radial-chart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChartContainer,
    ChartDemoCardComponent,
    ChartPageBadgesComponent,
    ChartTooltip,
    PageShellComponent,
    RadialCenter,
    RadialChart,
  ],
  template: `
    <demo-page-shell
      title="Radial Charts"
      description="Radial compositions modeled after the shadcn gallery: per-browser concentric rings, inline labels, grid tracks, center copy, shaped partial arcs, and stacked desktop/mobile totals.">
      <demo-chart-page-badges demo-page-actions [labels]="pageBadges" />

      <section class="grid gap-6 xl:grid-cols-2">
        <demo-chart-card
          title="Radial Chart"
          description="January - June 2024"
          badge="Default"
          footerTrend="Trending up by 5.2% this month"
          footerMeta="Showing total visitors for the last 6 months"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="radial-default" aspect="aspect-square">
            <ui-radial-chart
              [data]="browserData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="browserSeries"
              [maxValue]="browserMax"
              [showTrack]="false"
              [cornerRadius]="4">
              <ui-chart-tooltip [data]="browserData" xKey="browser" valueKey="visitors" indicator="dot" />
            </ui-radial-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radial Chart - Label"
          description="January - June 2024"
          badge="Label"
          footerTrend="Trending up by 5.2% this month"
          footerMeta="Showing total visitors for the last 6 months"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="radial-label" aspect="aspect-square">
            <ui-radial-chart
              [data]="browserData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="browserSeries"
              [maxValue]="browserMax"
              [showTrack]="false"
              [cornerRadius]="4"
              [showValueLabels]="true"
              [valueLabelFormat]="browserLabelFormatter" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radial Chart - Grid"
          description="January - June 2024"
          badge="Grid"
          footerTrend="Trending up by 5.2% this month"
          footerMeta="Showing total visitors for the last 6 months"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="radial-grid" aspect="aspect-square">
            <ui-radial-chart
              [data]="browserData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="browserSeries"
              [maxValue]="browserMax"
              [cornerRadius]="4"
              [trackPadding]="2" />
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radial Chart - Text"
          description="January - June 2024"
          badge="Text"
          footerTrend="Trending up by 5.2% this month"
          footerMeta="Showing total visitors for the last 6 months"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="radial-text" aspect="aspect-square">
            <ui-radial-chart
              [data]="radialTextData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="radialTextSeries"
              [maxValue]="radialTextMax"
              [cornerRadius]="12"
              [trackPadding]="0">
              <ui-radial-center>
                <div class="text-center">
                  <div class="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
                    {{ radialTextValue }}
                  </div>
                  <div class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Visitors</div>
                </div>
              </ui-radial-center>
            </ui-radial-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radial Chart - Shape"
          description="January - June 2024"
          badge="Shape"
          footerTrend="Trending up by 5.2% this month"
          footerMeta="Showing total visitors for the last 6 months"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="browserConfig" chartId="radial-shape" aspect="aspect-square">
            <ui-radial-chart
              [data]="radialShapeData"
              nameKey="browser"
              valueKey="visitors"
              [seriesKeys]="radialShapeSeries"
              [maxValue]="radialShapeMax"
              [startAngle]="shapeStartAngle"
              [endAngle]="shapeEndAngle"
              [cornerRadius]="16"
              [trackPadding]="0">
              <ui-radial-center>
                <div class="text-center">
                  <div class="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
                    {{ radialShapeValue }}
                  </div>
                  <div class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Visitors</div>
                </div>
              </ui-radial-center>
            </ui-radial-chart>
          </ui-chart-container>
        </demo-chart-card>

        <demo-chart-card
          title="Radial Chart - Stacked"
          description="January - June 2024"
          badge="Stacked"
          footerTrend="Trending up by 5.2% this month"
          footerMeta="Showing total visitors for the last 6 months"
          chartClassName="mx-auto aspect-square max-w-[18rem]">
          <ui-chart-container [config]="visitorConfig" chartId="radial-stacked" aspect="aspect-square">
            <ui-radial-chart
              [data]="radialStackedData"
              nameKey="stream"
              valueKey="value"
              [seriesKeys]="radialStackedSeries"
              [maxValue]="radialStackedMax"
              [cornerRadius]="6"
              [trackPadding]="4">
              <ui-radial-center>
                <div class="text-center">
                  <div class="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                    {{ radialStackedTotal }}
                  </div>
                  <div class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Visitors</div>
                </div>
              </ui-radial-center>
            </ui-radial-chart>
          </ui-chart-container>
        </demo-chart-card>
      </section>
    </demo-page-shell>
  `,
})
export class RadialChartPageComponent {
  protected readonly browserConfig = BROWSER_CONFIG;
  protected readonly visitorConfig = VISITOR_CONFIG;
  protected readonly browserData = BROWSER_DATA;
  protected readonly browserSeries = BROWSER_DATA.map((item) => item.browser);
  protected readonly browserMax = Math.max(...BROWSER_DATA.map((item) => item.visitors));

  protected readonly radialTextData = RADIAL_TEXT_DATA;
  protected readonly radialTextSeries = RADIAL_TEXT_DATA.map((item) => item.browser);
  protected readonly radialTextMax = RADIAL_TEXT_MAX;
  protected readonly radialTextValue = RADIAL_TEXT_DATA[0].visitors.toLocaleString('en-US');

  protected readonly radialShapeData = RADIAL_SHAPE_DATA;
  protected readonly radialShapeSeries = RADIAL_SHAPE_DATA.map((item) => item.browser);
  protected readonly radialShapeMax = RADIAL_SHAPE_MAX;
  protected readonly radialShapeValue = RADIAL_SHAPE_DATA[0].visitors.toLocaleString('en-US');

  protected readonly radialStackedData = RADIAL_STACKED_DATA;
  protected readonly radialStackedSeries = RADIAL_STACKED_DATA.map((item) => item.stream);
  protected readonly radialStackedMax = Math.max(...RADIAL_STACKED_DATA.map((item) => item.value)) * 1.1;
  protected readonly radialStackedTotal = RADIAL_STACKED_TOTAL.toLocaleString('en-US');

  protected readonly shapeStartAngle = (-5 * Math.PI) / 6;
  protected readonly shapeEndAngle = (5 * Math.PI) / 6;
  protected readonly pageBadges = ['6 variants', 'Per-browser rings', 'Text + shape + stacked'] as const;

  protected readonly browserLabelFormatter = (_value: number, name: string): string =>
    BROWSER_CONFIG[name]?.label ?? name;
}
