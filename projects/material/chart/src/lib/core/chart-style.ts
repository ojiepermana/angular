import { ChangeDetectionStrategy, Component, ElementRef, Renderer2, computed, effect, inject } from '@angular/core';
import { ChartContext } from './chart-context';
import { buildChartCss } from './chart-config';

/**
 * Emits a scoped `<style>` block mapping every series key in the current
 * `ChartConfig` to a `--color-<key>` CSS custom property, scoped to
 * `[data-chart="<id>"]`. Dark-mode values are scoped under `.dark`.
 *
 * Implemented as an empty component that injects a real `<style>` element
 * into its host via `Renderer2`. We avoid rendering `<style>` directly in a
 * template — Angular hoists those into component CSS and strips
 * interpolations from them.
 *
 * Consumers never instantiate this directly — `ChartContainer` renders it.
 */
@Component({
  selector: 'ui-chart-style',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class ChartStyle {
  private readonly ctx = inject(ChartContext);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private styleEl: HTMLStyleElement | null = null;

  protected readonly css = computed(() => buildChartCss(this.ctx.id(), this.ctx.config()));

  constructor() {
    effect(() => {
      const css = this.css();
      if (!this.styleEl) {
        this.styleEl = this.renderer.createElement('style');
        this.renderer.appendChild(this.host.nativeElement, this.styleEl);
      }
      this.styleEl!.textContent = css;
    });
  }
}
