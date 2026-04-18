import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  type Type,
  computed,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { ChartContext } from '../core/chart-context';
import type { ChartDatum } from '../core/cartesian-context';
import { seriesColorVar } from '../core/chart-config';

/** Row of data fed to tooltip templates. */
export interface ChartTooltipRow {
  readonly seriesKey: string;
  readonly label: string;
  readonly value: unknown;
  readonly color: string;
  readonly icon?: Type<unknown>;
}

/** Payload available to a user-supplied tooltip template. */
export interface ChartTooltipPayload {
  readonly category: string;
  readonly datum: ChartDatum;
  readonly rows: readonly ChartTooltipRow[];
}

/** Indicator rendered beside each tooltip row. */
export type ChartTooltipIndicator = 'dot' | 'line' | 'dashed' | 'none';

/** Signature for the per-row value formatter (string output). */
export type ChartTooltipValueFormatter = (value: unknown, row: ChartTooltipRow, payload: ChartTooltipPayload) => string;

/** Signature for the tooltip header (label) formatter. */
export type ChartTooltipLabelFormatter = (label: string, payload: ChartTooltipPayload) => string;

/** Locate the chart container DOM in order to position the tooltip. */
function containerRect(el: HTMLElement): DOMRect | null {
  // Climb to the nearest `[data-chart]` (the ChartContainer host).
  let node: HTMLElement | null = el;
  while (node && !node.hasAttribute('data-chart')) {
    node = node.parentElement;
  }
  return node?.getBoundingClientRect() ?? null;
}

/**
 * Tooltip overlay — renders the default tooltip card (or a user-supplied
 * template) anchored to the currently active data point.
 *
 * Shadcn-compatible knobs:
 * - `indicator="line"` / `"none"` / `"dashed"` — swap the row glyph
 * - `hideLabel` — drop the header row
 * - `label="Activities"` — override the header text
 * - `labelKey="activities"` — resolve the header from `config[labelKey].label`
 * - `labelFormatter` — transform the header (e.g. ISO date → long date)
 * - `formatter` — format per-row values (e.g. `"380 kcal"`)
 * - `valueKey` — for pie/radial/radar, read row value from a single field
 * - Icons are picked up automatically from `config[key].icon`.
 */
@Component({
  selector: 'ui-chart-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NgComponentOutlet],
  host: {
    class: 'pointer-events-none absolute inset-0 z-10',
    '[attr.aria-hidden]': '!visible()',
  },
  template: `
    @if (payload(); as p) {
      <div
        role="tooltip"
        class="pointer-events-none absolute grid min-w-32 max-w-72 -translate-x-1/2 -translate-y-full gap-1.5 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs shadow-md"
        [style.left.px]="position().x"
        [style.top.px]="position().y">
        @if (customTpl(); as tpl) {
          <ng-container *ngTemplateOutlet="tpl; context: { $implicit: p }" />
        } @else {
          @if (!hideLabel() && headerText(p); as header) {
            <div class="font-medium">{{ header }}</div>
          }
          <ul class="grid gap-1.5">
            @for (row of p.rows; track row.seriesKey) {
              <li class="flex w-full flex-wrap items-stretch gap-2">
                <span class="flex flex-1 items-center gap-1.5">
                  @switch (indicator()) {
                    @case ('dot') {
                      <span
                        class="h-2.5 w-2.5 shrink-0 rounded-sm"
                        [style.background]="row.color"
                        [style.borderColor]="row.color"></span>
                    }
                    @case ('line') {
                      <span class="h-full min-h-4 w-1 shrink-0 rounded-sm" [style.background]="row.color"></span>
                    }
                    @case ('dashed') {
                      <span
                        class="h-0 w-3 shrink-0 self-center border-t-2 border-dashed"
                        [style.borderColor]="row.color"></span>
                    }
                  }
                  @if (row.icon; as icon) {
                    <span class="mr-1 inline-flex items-center text-muted-foreground">
                      <ng-container *ngComponentOutlet="icon" />
                    </span>
                  }
                  <span class="text-muted-foreground">{{ row.label }}</span>
                </span>
                <span class="font-mono font-medium tabular-nums text-foreground">
                  {{ formatRow(row, p) }}
                </span>
              </li>
            }
          </ul>
        }
      </div>
    }

    <!-- Live region — announces category changes to AT. -->
    <div class="sr-only" aria-live="polite" aria-atomic="true">
      @if (payload(); as p) {
        {{ p.category }}
      }
    </div>
  `,
})
export class ChartTooltip {
  private readonly root = inject(ChartContext);
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Data key on each datum whose value is the category label (x-axis). */
  readonly xKey = input<string | null>(null);
  /** Data source (optional — if omitted tooltip reads from chart data via activePoint.datumIndex). */
  readonly data = input<readonly ChartDatum[] | null>(null);
  /**
   * Optional key for per-datum value lookup (pie / radial / radar datasets
   * store values on a single field like `visitors` instead of one field per
   * series). When set and `activePoint.seriesKey` is active, the tooltip row
   * reads `datum[valueKey]` for its value.
   */
  readonly valueKey = input<string | null>(null);

  /** Indicator variant next to each row. Default `'dot'`. */
  readonly indicator = input<ChartTooltipIndicator>('dot');
  /** Hide the header label entirely. */
  readonly hideLabel = input<boolean>(false);
  /** Override the header label with a fixed string. Takes precedence over `labelKey`. */
  readonly label = input<string | null>(null);
  /**
   * Resolve the header label from `config[labelKey].label`. Useful when the
   * header should come from a config entry rather than the datum itself
   * (shadcn's "Custom label" variant).
   */
  readonly labelKey = input<string | null>(null);
  /** Transform the final header string (e.g. ISO date → long date). */
  readonly labelFormatter = input<ChartTooltipLabelFormatter | null>(null);
  /** Format each row's value (return string — HTML is not interpreted). */
  readonly formatter = input<ChartTooltipValueFormatter | null>(null);

  readonly customTpl = contentChild(TemplateRef<{ $implicit: ChartTooltipPayload }>);

  protected readonly visible = computed(() => this.root.activePoint() !== null);

  protected readonly payload = computed<ChartTooltipPayload | null>(() => {
    const active = this.root.activePoint();
    const rows = this.data();
    if (!active || !rows) return null;
    const dataIndex = active.datumIndex != null && active.datumIndex < rows.length ? active.datumIndex : active.index;
    if (dataIndex < 0 || dataIndex >= rows.length) return null;
    const cfg = this.root.config();
    const visibleKeys = this.root.visibleSeriesKeys();
    const datum = rows[dataIndex];
    const xKey = this.xKey();
    const category = xKey && xKey in datum ? String(datum[xKey]) : String(active.index);

    // When the active point targets a single series (pie/radial/radar hover),
    // collapse the tooltip to just that row.
    const activeSeriesKey = active.seriesKey && visibleKeys.includes(active.seriesKey) ? active.seriesKey : null;
    const keys = activeSeriesKey ? [activeSeriesKey] : visibleKeys;
    const valueKey = this.valueKey();

    const tooltipRows: ChartTooltipRow[] = keys.map((k) => {
      // For single-slice hover on pie/radial/radar the value lives on a
      // shared `valueKey` field, not on a per-series column.
      const rawValue = valueKey != null && activeSeriesKey === k ? datum[valueKey] : datum[k];
      return {
        seriesKey: k,
        label: cfg[k]?.label ?? k,
        value: rawValue,
        color: seriesColorVar(k),
        icon: cfg[k]?.icon,
      };
    });
    return { category, datum, rows: tooltipRows };
  });

  /** Resolve the header string honoring `label`, `labelKey`, then `labelFormatter`. */
  protected headerText(p: ChartTooltipPayload): string | null {
    if (this.hideLabel()) return null;
    const override = this.label();
    const labelKey = this.labelKey();
    const cfg = this.root.config();
    const fromKey = labelKey ? (cfg[labelKey]?.label ?? labelKey) : null;
    const raw = override ?? fromKey ?? p.category;
    const fmt = this.labelFormatter();
    return fmt ? fmt(raw, p) : raw;
  }

  /** Apply per-row value formatter (or stringify). */
  protected formatRow(row: ChartTooltipRow, p: ChartTooltipPayload): string {
    const fmt = this.formatter();
    if (fmt) return fmt(row.value, row, p);
    return row.value == null ? '' : String(row.value);
  }

  protected readonly position = computed(() => {
    const active = this.root.activePoint();
    if (!active || active.clientX == null || active.clientY == null) {
      return { x: 0, y: 0 };
    }
    // Map client coords → offset within the chart container (the element
    // marked with `data-chart`, which is our positioning ancestor).
    const rect = containerRect(this.host.nativeElement);
    if (!rect) return { x: 0, y: 0 };

    const tooltip = this.host.nativeElement.querySelector('[role="tooltip"]') as HTMLElement | null;
    const tooltipWidth = tooltip?.offsetWidth ?? 128;
    const tooltipHeight = tooltip?.offsetHeight ?? 0;
    const padding = 8;

    const minX = padding + tooltipWidth / 2;
    const maxX = Math.max(minX, rect.width - padding - tooltipWidth / 2);
    const x = Math.min(maxX, Math.max(minX, active.clientX - rect.left));

    // Y is the tooltip's bottom edge because the card is translated upward.
    const minY = padding + tooltipHeight;
    const y = Math.max(minY, active.clientY - rect.top - padding);

    return { x, y };
  });
}
