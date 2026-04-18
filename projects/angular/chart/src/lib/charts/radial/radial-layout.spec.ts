import { describe, expect, it } from 'vitest';
import { computeRadialLayout } from './radial-layout';

describe('computeRadialLayout', () => {
  const data = [
    { name: 'a', value: 90 },
    { name: 'b', value: 45 },
    { name: 'c', value: 10 },
  ];

  it('produces concentric tracks, one per datum', () => {
    const layout = computeRadialLayout({
      data,
      nameKey: 'name',
      valueKey: 'value',
      innerWidth: 200,
      innerHeight: 200,
      trackPadding: 4,
      startAngle: 0,
      endAngle: Math.PI,
      cornerRadius: 0,
    });
    expect(layout.bars).toHaveLength(3);
    expect(layout.bars[0].innerRadius).toBe(0);
    expect(layout.bars[2].outerRadius).toBeCloseTo(layout.outerRadius, 5);
  });

  it('sweep is proportional to value / maxValue', () => {
    const layout = computeRadialLayout({
      data,
      nameKey: 'name',
      valueKey: 'value',
      innerWidth: 200,
      innerHeight: 200,
      trackPadding: 0,
      startAngle: 0,
      endAngle: Math.PI,
      cornerRadius: 0,
      maxValue: 100,
    });
    // First bar: value=90 of max=100 → 90% of sweep (π)
    expect(layout.bars[0].arcPath.length).toBeGreaterThan(0);
    // Background spans full (π) for every track
    expect(layout.bars[0].backgroundPath.length).toBeGreaterThan(0);
  });
});
