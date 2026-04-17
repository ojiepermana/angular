import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { ChartContainer } from '../../core/chart-container';
import { ChartContext } from '../../core/chart-context';
import { CategoricalViewportContext } from '../../core/categorical-viewport-context';
import { LineChart } from './line-chart';
import { ChartAxisX } from '../../primitives/chart-axis-x';

@Component({
  imports: [ChartContainer, LineChart, ChartAxisX],
  template: `
    <ui-chart-container [config]="cfg" chartId="line-test">
      <ui-line-chart [data]="data" xKey="month">
        <svg:g ui-chart-axis-x></svg:g>
      </ui-line-chart>
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
}

function seedDimensions(fixture: ReturnType<typeof TestBed.createComponent<Host>>): void {
  const debug = fixture.debugElement.query(By.directive(ChartContainer));
  const ctx = debug.injector.get(ChartContext);
  ctx.dimensions.set({ width: 400, height: 200 });
  fixture.detectChanges();
}

describe('LineChart', () => {
  it('renders one <path> per series with correct stroke color', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    const paths = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('path.chart-line'),
    ) as SVGPathElement[];
    expect(paths).toHaveLength(2);
    const strokes = paths.map((p) => p.getAttribute('stroke'));
    expect(strokes).toEqual(expect.arrayContaining(['var(--color-desktop)', 'var(--color-mobile)']));
  });

  it('renders dots per point by default (N points × M series)', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    const dots = (fixture.nativeElement as HTMLElement).querySelectorAll('circle.chart-dot');
    // 3 months × 2 series = 6 dots
    expect(dots.length).toBe(6);
  });

  it('projects axis primitives into the svg', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    expect((fixture.nativeElement as HTMLElement).querySelector('svg g.chart-axis-x')).toBeTruthy();
  });

  it('publishes activePoint when a dot receives keyboard focus', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    const ctx = fixture.debugElement.query(By.directive(ChartContainer)).injector.get(ChartContext);
    const firstDot = (fixture.nativeElement as HTMLElement).querySelector('circle.chart-dot') as SVGCircleElement;

    firstDot.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(ctx.activePoint()?.index).toBe(0);
    expect(ctx.activePoint()?.seriesKey).toBe('desktop');
  });

  it('zooms the visible window when viewport zoomRange is set', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    const viewport = fixture.debugElement.query(By.directive(LineChart)).injector.get(CategoricalViewportContext);

    viewport.zoomRange.set({ startIndex: 1, endIndex: 2 });
    fixture.detectChanges();

    const dots = (fixture.nativeElement as HTMLElement).querySelectorAll('circle.chart-dot');
    expect(dots.length).toBe(4);
  });
});
