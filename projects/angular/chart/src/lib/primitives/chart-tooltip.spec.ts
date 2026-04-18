import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { ChartContainer } from '../core/chart-container';
import { ChartContext } from '../core/chart-context';
import { BarChart } from '../charts/bar/bar-chart';
import { ChartTooltip } from './chart-tooltip';
import { ChartCrosshair } from './chart-crosshair';

@Component({
  imports: [ChartContainer, BarChart, ChartTooltip, ChartCrosshair],
  template: `
    <ui-chart-container [config]="cfg" chartId="tooltip-test">
      <ui-bar-chart [data]="data" xKey="month">
        <svg:g ui-chart-crosshair></svg:g>
        <ui-chart-tooltip [data]="data" xKey="month" />
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
  ];
}

function bootstrap() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  const ctx = fixture.debugElement.query(By.directive(ChartContainer)).injector.get(ChartContext);
  ctx.dimensions.set({ width: 400, height: 200 });
  fixture.detectChanges();
  return { fixture, ctx };
}

describe('ChartTooltip + ChartCrosshair', () => {
  it('hidden by default (no activePoint)', () => {
    const { fixture } = bootstrap();
    const tip = (fixture.nativeElement as HTMLElement).querySelector('ui-chart-tooltip [role="tooltip"]');
    expect(tip).toBeNull();
  });

  it('renders tooltip rows for each visible series when activePoint is set', () => {
    const { fixture, ctx } = bootstrap();
    ctx.activePoint.set({ index: 1, clientX: 100, clientY: 100 });
    fixture.detectChanges();

    const tip = (fixture.nativeElement as HTMLElement).querySelector(
      'ui-chart-tooltip [role="tooltip"]',
    ) as HTMLElement;
    expect(tip).not.toBeNull();
    expect(tip.textContent).toContain('Feb');
    expect(tip.textContent).toContain('Desktop');
    expect(tip.textContent).toContain('200');
    expect(tip.textContent).toContain('Mobile');
    expect(tip.textContent).toContain('80');
  });

  it('crosshair line appears when activePoint is set', () => {
    const { fixture, ctx } = bootstrap();
    ctx.activePoint.set({ index: 0 });
    fixture.detectChanges();
    const line = (fixture.nativeElement as HTMLElement).querySelector('g.chart-crosshair line');
    expect(line).not.toBeNull();
  });

  it('shows the tooltip when a keyboard user focuses a bar', () => {
    const { fixture } = bootstrap();
    const firstBar = (fixture.nativeElement as HTMLElement).querySelector('rect.chart-bar') as SVGRectElement;

    firstBar.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    const tip = (fixture.nativeElement as HTMLElement).querySelector(
      'ui-chart-tooltip [role="tooltip"]',
    ) as HTMLElement;
    expect(tip).not.toBeNull();
    expect(tip.textContent).toContain('Jan');
  });
});
