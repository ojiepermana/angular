import { describe, expect, it } from 'vitest';
import { computeRadarLayout } from './radar-layout';

describe('computeRadarLayout', () => {
  const data = [
    { axis: 'speed', a: 80, b: 60 },
    { axis: 'power', a: 50, b: 90 },
    { axis: 'range', a: 70, b: 40 },
  ];

  it('produces one axis per datum and one series per key', () => {
    const layout = computeRadarLayout({
      data,
      axisKey: 'axis',
      seriesKeys: ['a', 'b'],
      innerWidth: 200,
      innerHeight: 200,
      levels: 4,
      curve: 'linear',
    });
    expect(layout.axes).toHaveLength(3);
    expect(layout.series).toHaveLength(2);
    expect(layout.series[0].points).toHaveLength(3);
    expect(layout.series[0].path).toMatch(/^M/);
  });

  it('scales points so max value lands on the outer ring', () => {
    const layout = computeRadarLayout({
      data,
      axisKey: 'axis',
      seriesKeys: ['a'],
      innerWidth: 200,
      innerHeight: 200,
      levels: 4,
      curve: 'linear',
      maxValue: 100,
    });
    const { radius } = layout;
    // Axis 0 has value 80 at angle -π/2 → point ~ (0, -0.8 * radius)
    const p0 = layout.series[0].points[0];
    expect(Math.abs(p0.x)).toBeLessThan(1e-6);
    expect(p0.y).toBeCloseTo(-0.8 * radius, 4);
  });
});
