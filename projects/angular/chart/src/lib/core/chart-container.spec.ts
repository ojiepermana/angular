import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ChartContainer } from './chart-container';

@Component({
  imports: [ChartContainer],
  template: `
    <ui-chart-container [config]="cfg" chartId="test-chart">
      <span data-testid="slot">slot</span>
    </ui-chart-container>
  `,
})
class Host {
  cfg = {
    sales: { label: 'Sales', color: 'hsl(var(--chart-1))' },
    revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' },
  };
}

describe('ChartContainer', () => {
  it('reflects the chart id on the host and projects content', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const host = root.querySelector('ui-chart-container') as HTMLElement;

    expect(host.getAttribute('data-chart')).toBe('test-chart');
    expect(root.querySelector('[data-testid="slot"]')?.textContent).toBe('slot');
  });

  it('renders the scoped <style> block with per-series CSS vars', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const style = root.querySelector('ui-chart-style style') as HTMLStyleElement | null;

    expect(style).toBeTruthy();
    const css = style!.textContent ?? '';
    expect(css).toContain('[data-chart="test-chart"]');
    expect(css).toContain('--color-sales: hsl(var(--chart-1));');
    expect(css).toContain('--color-revenue: hsl(var(--chart-2));');
  });
});
