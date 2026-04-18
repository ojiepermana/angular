import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { By } from '@angular/platform-browser';
import { ChartContainer } from '../../core/chart-container';
import { ChartContext } from '../../core/chart-context';
import { RadialChart } from './radial-chart';

@Component({
  imports: [ChartContainer, RadialChart],
  template: `
    <ui-chart-container [config]="cfg" chartId="radial-test">
      <ui-radial-chart [data]="data" nameKey="name" valueKey="value" />
    </ui-chart-container>
  `,
})
class Host {
  cfg = {
    a: { label: 'A', color: 'hsl(var(--chart-1))' },
    b: { label: 'B', color: 'hsl(var(--chart-2))' },
    c: { label: 'C', color: 'hsl(var(--chart-3))' },
  };
  data = [
    { name: 'a', value: 90 },
    { name: 'b', value: 45 },
    { name: 'c', value: 10 },
  ];
}

describe('RadialChart', () => {
  it('renders one radial bar per datum', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const ctx = fixture.debugElement.query(By.directive(ChartContainer)).injector.get(ChartContext);
    ctx.dimensions.set({ width: 240, height: 240 });
    fixture.detectChanges();

    const bars = (fixture.nativeElement as HTMLElement).querySelectorAll('path.chart-radial-bar');
    expect(bars.length).toBe(3);
  });
});
