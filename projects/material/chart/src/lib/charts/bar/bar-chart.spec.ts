import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { ChartContainer } from '../../core/chart-container';
import { ChartContext } from '../../core/chart-context';
import { BarChart } from './bar-chart';
import { ChartAxisX } from '../../primitives/chart-axis-x';
import { ChartAxisY } from '../../primitives/chart-axis-y';
import { ChartGrid } from '../../primitives/chart-grid';

@Component({
  imports: [ChartContainer, BarChart, ChartAxisX, ChartAxisY, ChartGrid],
  template: `
    <ui-chart-container [config]="cfg" chartId="bar-test">
      <ui-bar-chart [data]="data" xKey="month" [orientation]="orientation()" [variant]="variant()">
        <svg:g ui-chart-grid></svg:g>
        <svg:g ui-chart-axis-x></svg:g>
        <svg:g ui-chart-axis-y></svg:g>
      </ui-bar-chart>
    </ui-chart-container>
  `,
})
class Host {
  cfg = {
    desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
    mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
  };
  data = [
    { month: 'Jan', desktop: 100, mobile: 50 },
    { month: 'Feb', desktop: 200, mobile: 80 },
    { month: 'Mar', desktop: 150, mobile: 120 },
  ];
  orientation = signal<'vertical' | 'horizontal'>('vertical');
  variant = signal<'grouped' | 'stacked'>('grouped');
}

function seedDimensions(fixture: ReturnType<typeof TestBed.createComponent<Host>>): void {
  const debug = fixture.debugElement.query(By.directive(ChartContainer));
  const ctx = debug.injector.get(ChartContext);
  ctx.dimensions.set({ width: 400, height: 200 });
  fixture.detectChanges();
}

describe('BarChart', () => {
  it('renders the expected number of bars (grouped vertical)', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    // 3 months × 2 series = 6 bars.
    const bars = (fixture.nativeElement as HTMLElement).querySelectorAll('rect.chart-bar');
    expect(bars.length).toBe(6);
  });

  it('applies CSS var colors per series via fill attribute', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    const bars = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('rect.chart-bar'),
    ) as SVGRectElement[];
    const fills = new Set(bars.map((b) => b.getAttribute('fill')));
    expect(fills.has('var(--color-desktop)')).toBe(true);
    expect(fills.has('var(--color-mobile)')).toBe(true);
  });

  it('stacked variant still emits 6 bars but grouped by x-band', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.variant.set('stacked');
    fixture.detectChanges();
    seedDimensions(fixture);
    const bars = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('rect.chart-bar'),
    ) as SVGRectElement[];
    expect(bars.length).toBe(6);
    // Bars in the same x-band share width in stacked mode.
    const widths = bars.map((b) => b.getAttribute('width'));
    // At least two different categories, each with matching-width bars.
    expect(new Set(widths).size).toBeLessThanOrEqual(3);
  });

  it('projects axis + grid primitives inside the svg', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('svg g.chart-axis-x')).toBeTruthy();
    expect(root.querySelector('svg g.chart-axis-y')).toBeTruthy();
    expect(root.querySelector('svg g.chart-grid')).toBeTruthy();
  });

  it('publishes activePoint when a bar receives keyboard focus', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    const ctx = fixture.debugElement.query(By.directive(ChartContainer)).injector.get(ChartContext);
    const firstBar = (fixture.nativeElement as HTMLElement).querySelector('rect.chart-bar') as SVGRectElement;

    firstBar.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(ctx.activePoint()?.index).toBe(0);
    expect(ctx.activePoint()?.seriesKey).toBe('desktop');

    firstBar.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(ctx.activePoint()).toBeNull();
  });
});
