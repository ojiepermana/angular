import { describe, expect, it } from 'vitest';
import { computeLineLayout, computeAreaLayout } from './line-layout';

const data = [
  { month: 'Jan', desktop: 100, mobile: 50 },
  { month: 'Feb', desktop: 200, mobile: 80 },
  { month: 'Mar', desktop: 150, mobile: 120 },
];

describe('computeLineLayout', () => {
  it('produces one series per seriesKey and N points per series', () => {
    const { series, points } = computeLineLayout({
      data,
      xKey: 'month',
      seriesKeys: ['desktop', 'mobile'],
      orientation: 'vertical',
      innerWidth: 300,
      innerHeight: 150,
      curve: 'linear',
    });
    expect(series).toHaveLength(2);
    expect(series[0].points).toHaveLength(3);
    expect(points).toHaveLength(6);
    expect(series[0].linePath).toMatch(/^M/);
    expect(series[0].color).toBe('var(--color-desktop)');
  });

  it('monotone curve produces a cubic path', () => {
    const { series } = computeLineLayout({
      data,
      xKey: 'month',
      seriesKeys: ['desktop'],
      orientation: 'vertical',
      innerWidth: 300,
      innerHeight: 150,
      curve: 'monotone',
    });
    expect(series[0].linePath).toMatch(/C/);
  });

  it('horizontal orientation swaps x and y roles', () => {
    const { series } = computeLineLayout({
      data,
      xKey: 'month',
      seriesKeys: ['desktop'],
      orientation: 'horizontal',
      innerWidth: 300,
      innerHeight: 150,
      curve: 'linear',
    });
    const ys = series[0].points.map((p) => p.y);
    expect(new Set(ys).size).toBe(3);
  });
});

describe('computeAreaLayout', () => {
  it('single (non-stacked) area provides line + area paths', () => {
    const { series } = computeAreaLayout({
      data,
      xKey: 'month',
      seriesKeys: ['desktop'],
      orientation: 'vertical',
      innerWidth: 300,
      innerHeight: 150,
      curve: 'linear',
      stacked: false,
    });
    expect(series[0].linePath).toMatch(/^M/);
    expect(series[0].areaPath).toMatch(/^M/);
    expect(series[0].areaPath!.length).toBeGreaterThan(series[0].linePath.length);
  });

  it('stacked area: emits the same number of series with area paths', () => {
    const { series, stacked } = computeAreaLayout({
      data,
      xKey: 'month',
      seriesKeys: ['desktop', 'mobile'],
      orientation: 'vertical',
      innerWidth: 300,
      innerHeight: 150,
      curve: 'linear',
      stacked: true,
    });
    expect(stacked).toBe(true);
    expect(series).toHaveLength(2);
    expect(series[0].areaPath).toBeTruthy();
    expect(series[1].areaPath).toBeTruthy();
  });
});
