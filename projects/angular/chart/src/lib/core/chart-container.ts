import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartContext } from './chart-context';
import { ChartStyle } from './chart-style';
import { CHART_DATA_ATTRIBUTE, type ChartConfig } from './chart-config';

let chartIdCounter = 0;

/**
 * Root of every chart. Provides `ChartContext` to descendants, reflects the
 * chart id via `data-chart`, injects the per-instance CSS-variable
 * `<style>` block, and tracks its render-area dimensions via
 * `ResizeObserver`.
 *
 * Usage:
 * ```html
 * <ui-chart-container [config]="cfg">
 *   <ui-bar-chart [data]="data" />
 * </ui-chart-container>
 * ```
 */
@Component({
  selector: 'ui-chart-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChartContext],
  imports: [ChartStyle],
  host: {
    '[attr.data-chart]': 'ctx.id()',
    '[class]': 'hostClass()',
  },
  template: `
    <ui-chart-style />
    <ng-content />
  `,
})
export class ChartContainer {
  protected readonly ctx = inject(ChartContext);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  /** Series configuration. Required for color / label resolution. */
  readonly config = input.required<ChartConfig>();

  /**
   * Tailwind aspect-ratio utility for the container. Defaults to `aspect-video`
   * for cartesian charts; override with `aspect-square` for radial / pie layouts.
   */
  readonly aspect = input<string>('aspect-video');

  protected readonly hostClass = computed(() => `relative flex ${this.aspect()} justify-center text-xs`);

  /**
   * Optional explicit id override. When omitted, a stable auto-id is
   * generated (`chart-<n>`), unique across the document.
   */
  readonly chartId = input<string | null>(null);

  constructor() {
    const autoId = `chart-${++chartIdCounter}`;

    // Sync id + config into the shared context.
    effect(() => {
      this.ctx.id.set(this.chartId() ?? autoId);
    });
    effect(() => {
      this.ctx.config.set(this.config());
    });

    // Observe host size (browser only; client-only is a confirmed constraint).
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => this.observeSize());
    }
  }

  private observeSize(): void {
    const el = this.host.nativeElement;
    if (typeof ResizeObserver === 'undefined') {
      const rect = el.getBoundingClientRect();
      this.ctx.dimensions.set({ width: rect.width, height: rect.height });
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Avoid NgZone churn — dimensions signal drives CD on its own.
        this.zone.run(() => this.ctx.dimensions.set({ width, height }));
      }
    });
    observer.observe(el);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}

/**
 * Re-export the `data-chart` attribute constant for primitives that want to
 * target the same scope in their own templates.
 */
export { CHART_DATA_ATTRIBUTE };
