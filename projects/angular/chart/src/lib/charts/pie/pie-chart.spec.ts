import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { By } from '@angular/platform-browser';
import { ChartContainer } from '../../core/chart-container';
import { ChartContext } from '../../core/chart-context';
import { PieChart } from './pie-chart';

@Component({
  imports: [ChartContainer, PieChart],
  template: `
    <ui-chart-container [config]="cfg" chartId="pie-test">
      <ui-pie-chart [data]="data" nameKey="name" valueKey="visitors" />
    </ui-chart-container>
  `,
})
class Host {
  cfg = {
    chrome: { label: 'Chrome', color: 'hsl(var(--chart-1))' },
    safari: { label: 'Safari', color: 'hsl(var(--chart-2))' },
    firefox: { label: 'Firefox', color: 'hsl(var(--chart-3))' },
  };
  data = [
    { name: 'chrome', visitors: 275 },
    { name: 'safari', visitors: 200 },
    { name: 'firefox', visitors: 187 },
  ];
}

describe('PieChart', () => {
  it('renders one slice per datum', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const ctx = fixture.debugElement.query(By.directive(ChartContainer)).injector.get(ChartContext);
    ctx.dimensions.set({ width: 240, height: 240 });
    fixture.detectChanges();

    const slices = (fixture.nativeElement as HTMLElement).querySelectorAll('path.chart-slice');
    expect(slices.length).toBe(3);
  });
});
