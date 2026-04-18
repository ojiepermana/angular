import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { ChartContainer } from '../../core/chart-container';
import { ChartContext } from '../../core/chart-context';
import { CategoricalViewportContext } from '../../core/categorical-viewport-context';
import { AreaChart } from './area-chart';

@Component({
  imports: [ChartContainer, AreaChart],
  template: `
    <ui-chart-container [config]="cfg" chartId="area-test">
      <ui-area-chart [data]="data" xKey="month" [stacked]="stacked()" [gradient]="gradient()" [showDots]="true" />
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
  stacked = signal(false);
  gradient = signal(true);
}

function seedDimensions(fixture: ReturnType<typeof TestBed.createComponent<Host>>): void {
  const debug = fixture.debugElement.query(By.directive(ChartContainer));
  const ctx = debug.injector.get(ChartContext);
  ctx.dimensions.set({ width: 400, height: 200 });
  fixture.detectChanges();
}

describe('AreaChart', () => {
  it('renders one <path class="chart-area"> per series', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    const areas = (fixture.nativeElement as HTMLElement).querySelectorAll('path.chart-area');
    expect(areas.length).toBe(2);
  });

  it('gradient=true emits linearGradient defs referenced via url(#…)', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    const root = fixture.nativeElement as HTMLElement;
    const defs = root.querySelectorAll('linearGradient');
    expect(defs.length).toBe(2);
    const fills = Array.from(root.querySelectorAll('path.chart-area')).map((p) => p.getAttribute('fill'));
    expect(fills.every((f) => f && f.startsWith('url(#'))).toBe(true);
  });

  it('gradient=false paints the area with the raw series color', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.gradient.set(false);
    fixture.detectChanges();
    seedDimensions(fixture);
    const fills = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('path.chart-area')).map((p) =>
      p.getAttribute('fill'),
    );
    expect(fills).toEqual(expect.arrayContaining(['var(--color-desktop)', 'var(--color-mobile)']));
  });

  it('stacked=true still emits N area paths', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.stacked.set(true);
    fixture.detectChanges();
    seedDimensions(fixture);
    const areas = (fixture.nativeElement as HTMLElement).querySelectorAll('path.chart-area');
    expect(areas.length).toBe(2);
  });

  it('publishes activePoint when an area dot receives keyboard focus', () => {
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

  it('zooms the visible area window when viewport zoomRange is set', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    seedDimensions(fixture);
    const viewport = fixture.debugElement.query(By.directive(AreaChart)).injector.get(CategoricalViewportContext);

    viewport.zoomRange.set({ startIndex: 1, endIndex: 2 });
    fixture.detectChanges();

    const dots = (fixture.nativeElement as HTMLElement).querySelectorAll('circle.chart-dot');
    expect(dots.length).toBe(4);
  });
});
