import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ChartContext } from '../core/chart-context';
import type { ChartDatum } from '../core/cartesian-context';
import { seriesColorVar } from '../core/chart-config';

/** Row of data fed to tooltip templates. */
export interface ChartTooltipRow {
  readonly seriesKey: string;
  readonly label: string;
  readonly value: unknown;
  readonly color: string;
}

/** Payload available to a user-supplied tooltip template. */
export interface ChartTooltipPayload {
  readonly category: string;
  readonly datum: ChartDatum;
  readonly rows: readonly ChartTooltipRow[];
}

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
 * Place as a child of a cartesian chart:
 * ```html
 * <ui-bar-chart ...>
 *   <svg:svg uiChartPointerTracker>...</svg>
 *   <ui-chart-tooltip />
 * </ui-bar-chart>
 * ```
 *
 * Customize via projected template:
 * ```html
 * <ui-chart-tooltip>
 *   <ng-template let-payload>...{{payload.category}}...</ng-template>
 * </ui-chart-tooltip>
 * ```
 */
@Component({
  selector: 'ui-chart-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: {
    class: 'pointer-events-none absolute inset-0 z-10',
    '[attr.aria-hidden]': '!visible()',
  },
  template: `
    @if (payload(); as p) {
      <div
        role="tooltip"
        class="pointer-events-none absolute min-w-32 max-w-72 -translate-x-1/2 -translate-y-full rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md"
        [style.left.px]="position().x"
        [style.top.px]="position().y">
        @if (customTpl(); as tpl) {
          <ng-container *ngTemplateOutlet="tpl; context: { $implicit: p }" />
        } @else {
          <div class="mb-1 font-medium">{{ p.category }}</div>
          <ul class="flex flex-col gap-1">
            @for (row of p.rows; track row.seriesKey) {
              <li class="flex items-center justify-between gap-4">
                <span class="flex items-center gap-2">
                  <span class="inline-block h-2 w-2 rounded-sm" [style.background]="row.color"></span>
                  <span class="text-muted-foreground">{{ row.label }}</span>
                </span>
                <span class="font-mono tabular-nums">{{ row.value }}</span>
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

    const tooltipRows: ChartTooltipRow[] = visibleKeys.map((k) => ({
      seriesKey: k,
      label: cfg[k]?.label ?? k,
      value: datum[k],
      color: seriesColorVar(k),
    }));
    return { category, datum, rows: tooltipRows };
  });

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
