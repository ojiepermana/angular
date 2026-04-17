import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { By } from '@angular/platform-browser';
import { ChartContainer } from '../../core/chart-container';
import { ChartContext } from '../../core/chart-context';
import { RadarChart } from './radar-chart';

@Component({
  imports: [ChartContainer, RadarChart],
  template: `
    <ui-chart-container [config]="cfg" chartId="radar-test">
      <ui-radar-chart [data]="data" axisKey="axis" />
    </ui-chart-container>
  `,
})
class Host {
  cfg = {
    a: { label: 'A', color: 'hsl(var(--chart-1))' },
    b: { label: 'B', color: 'hsl(var(--chart-2))' },
  };
  data = [
    { axis: 'speed', a: 80, b: 60 },
    { axis: 'power', a: 50, b: 90 },
    { axis: 'range', a: 70, b: 40 },
  ];
}

describe('RadarChart', () => {
  it('renders one radar path per visible series', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const ctx = fixture.debugElement.query(By.directive(ChartContainer)).injector.get(ChartContext);
    ctx.dimensions.set({ width: 240, height: 240 });
    fixture.detectChanges();

    const paths = (fixture.nativeElement as HTMLElement).querySelectorAll('path.chart-radar-series');
    expect(paths.length).toBe(2);
  });
});
