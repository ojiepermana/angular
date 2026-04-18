import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { By } from '@angular/platform-browser';
import { ChartContainer } from '../../core/chart-container';
import { ChartContext } from '../../core/chart-context';
import { ScatterViewportContext } from '../../core/scatter-viewport-context';
import { ScatterChart } from './scatter-chart';

@Component({
  imports: [ChartContainer, ScatterChart],
  template: `
    <ui-chart-container [config]="cfg" chartId="scatter-test">
      <ui-scatter-chart [data]="data" xKey="x" yKey="y" />
    </ui-chart-container>
  `,
})
class Host {
  cfg = {
    sample: { label: 'Sample', color: 'hsl(var(--chart-1))' },
  };
  data = [
    { x: 0, y: 0 },
    { x: 10, y: 20 },
    { x: 5, y: 10 },
  ];
}

describe('ScatterChart', () => {
  it('renders one point per datum', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const ctx = fixture.debugElement.query(By.directive(ChartContainer)).injector.get(ChartContext);
    ctx.dimensions.set({ width: 240, height: 160 });
    fixture.detectChanges();

    const points = (fixture.nativeElement as HTMLElement).querySelectorAll('circle.chart-scatter-point');
    expect(points.length).toBe(3);
  });

  it('filters visible points when scatter zoom domains are narrowed', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const ctx = fixture.debugElement.query(By.directive(ChartContainer)).injector.get(ChartContext);
    ctx.dimensions.set({ width: 240, height: 160 });
    fixture.detectChanges();

    const viewport = fixture.debugElement.query(By.directive(ScatterChart)).injector.get(ScatterViewportContext);
    viewport.zoomXDomain.set([0, 6]);
    viewport.zoomYDomain.set([0, 12]);
    fixture.detectChanges();

    const points = (fixture.nativeElement as HTMLElement).querySelectorAll('circle.chart-scatter-point');
    expect(points.length).toBe(2);
  });
});
