import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { ChartContainer } from '../core/chart-container';
import { ChartContext } from '../core/chart-context';
import { ChartLegend } from './chart-legend';

@Component({
  imports: [ChartContainer, ChartLegend],
  template: `
    <ui-chart-container [config]="cfg" chartId="legend-test">
      <ui-chart-legend />
    </ui-chart-container>
  `,
})
class Host {
  cfg = {
    desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
    mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
  };
}

describe('ChartLegend', () => {
  it('renders one button per series with labels from config', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('ui-chart-legend button'));
    expect(buttons).toHaveLength(2);
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(['Desktop', 'Mobile']);
    expect(buttons[0].className).toContain('min-h-11');
  });

  it('clicking an item toggles ChartContext.hiddenSeries and aria-pressed', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const ctx = fixture.debugElement.query(By.directive(ChartContainer)).injector.get(ChartContext);
    const firstBtn = (fixture.nativeElement as HTMLElement).querySelector(
      'ui-chart-legend button',
    ) as HTMLButtonElement;

    firstBtn.click();
    fixture.detectChanges();
    expect(ctx.hiddenSeries().has('desktop')).toBe(true);
    expect(firstBtn.getAttribute('aria-pressed')).toBe('false');

    firstBtn.click();
    fixture.detectChanges();
    expect(ctx.hiddenSeries().has('desktop')).toBe(false);
    expect(firstBtn.getAttribute('aria-pressed')).toBe('true');
  });
});
