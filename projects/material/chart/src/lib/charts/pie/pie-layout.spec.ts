import { describe, expect, it } from 'vitest';
import { computePieLayout } from './pie-layout';

describe('computePieLayout', () => {
  const data = [
    { name: 'chrome', visitors: 275 },
    { name: 'safari', visitors: 200 },
    { name: 'firefox', visitors: 187 },
  ];

  it('produces one slice per datum with a non-empty arc path', () => {
    const layout = computePieLayout({
      data,
      valueKey: 'visitors',
      nameKey: 'name',
      innerWidth: 200,
      innerHeight: 200,
      innerRadius: 0,
      padAngle: 0,
      cornerRadius: 0,
      startAngle: -Math.PI / 2,
      endAngle: (3 * Math.PI) / 2,
    });
    expect(layout.slices).toHaveLength(3);
    expect(layout.slices[0].arcPath.length).toBeGreaterThan(0);
    expect(layout.outerRadius).toBe(100);
  });

  it('slice sweep is proportional to its value', () => {
    const layout = computePieLayout({
      data,
      valueKey: 'visitors',
      nameKey: 'name',
      innerWidth: 200,
      innerHeight: 200,
      innerRadius: 0,
      padAngle: 0,
      cornerRadius: 0,
      startAngle: -Math.PI / 2,
      endAngle: (3 * Math.PI) / 2,
    });
    const total = 275 + 200 + 187;
    const sweepFor = (idx: number) => layout.slices[idx].endAngle - layout.slices[idx].startAngle;
    expect(sweepFor(0)).toBeCloseTo((275 / total) * 2 * Math.PI, 4);
    expect(sweepFor(1)).toBeCloseTo((200 / total) * 2 * Math.PI, 4);
  });

  it('uses seriesKey from nameKey by default for color var', () => {
    const layout = computePieLayout({
      data,
      valueKey: 'visitors',
      nameKey: 'name',
      innerWidth: 200,
      innerHeight: 200,
      innerRadius: 0,
      padAngle: 0,
      cornerRadius: 0,
      startAngle: -Math.PI / 2,
      endAngle: (3 * Math.PI) / 2,
    });
    expect(layout.slices[0].color).toBe('var(--color-chrome)');
    expect(layout.slices[0].seriesKey).toBe('chrome');
  });
});
