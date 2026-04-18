import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { ChartContainer } from '../core/chart-container';
import { ChartContext } from '../core/chart-context';
import { ChartZoomControls } from './chart-zoom-controls';
import { LineChart } from '../charts/line/line-chart';
import { CategoricalViewportContext } from '../core/categorical-viewport-context';

@Component({
  imports: [ChartContainer, ChartZoomControls, LineChart],
  template: `
    <ui-chart-container [config]="cfg" chartId="zoom-controls-test">
      <ui-line-chart [data]="data" xKey="month">
        <ui-chart-zoom-controls />
      </ui-line-chart>
    </ui-chart-container>
  `,
})
class Host {
  cfg = {
    desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  };
  data = [
    { month: 'Jan', desktop: 100 },
    { month: 'Feb', desktop: 200 },
    { month: 'Mar', desktop: 150 },
  ];
}

describe('ChartZoomControls', () => {
  it('shows the current zoom range and reset action', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.debugElement.query(By.directive(ChartContainer)).injector.get(ChartContext);
    root.dimensions.set({ width: 400, height: 200 });
    fixture.detectChanges();

    const viewport = fixture.debugElement.query(By.directive(LineChart)).injector.get(CategoricalViewportContext);
    viewport.zoomRange.set({ startIndex: 1, endIndex: 2 });
    fixture.detectChanges();

    const controls = fixture.nativeElement as HTMLElement;
    expect(controls.textContent).toContain('Showing 2-3 of 3');
    expect(controls.textContent).toContain('Reset zoom');
  });
});
