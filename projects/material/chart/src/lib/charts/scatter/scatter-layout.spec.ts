import { describe, expect, it } from 'vitest';
import { computeScatterLayout } from './scatter-layout';

describe('computeScatterLayout', () => {
  const data = [
    { x: 0, y: 0, size: 10 },
    { x: 10, y: 20, size: 20 },
    { x: 5, y: 10, size: 30 },
  ];

  it('maps data into inner-area coordinates', () => {
    const { points, xScale, yScale } = computeScatterLayout({
      data,
      xKey: 'x',
      yKey: 'y',
      seriesKeys: ['sample'],
      innerWidth: 100,
      innerHeight: 50,
      minPointRadius: 3,
      maxPointRadius: 8,
    });
    expect(points).toHaveLength(3);
    expect(xScale.range()).toEqual([0, 100]);
    expect(yScale.range()).toEqual([50, 0]);
    expect(points[0].x).toBe(0);
    expect(points[0].y).toBe(50); // y=0 maps to bottom
    expect(points[1].x).toBe(100);
    expect(points[1].y).toBe(0);
  });

  it('scales radii linearly when sizeKey is provided', () => {
    const { points } = computeScatterLayout({
      data,
      xKey: 'x',
      yKey: 'y',
      sizeKey: 'size',
      seriesKeys: ['sample'],
      innerWidth: 100,
      innerHeight: 50,
      minPointRadius: 3,
      maxPointRadius: 8,
    });
    const radii = points.map((p) => p.radius).sort((a, b) => a - b);
    expect(radii[0]).toBe(3);
    expect(radii[2]).toBe(8);
  });

  it('falls back to minPointRadius when sizeKey is omitted', () => {
    const { points } = computeScatterLayout({
      data,
      xKey: 'x',
      yKey: 'y',
      seriesKeys: ['sample'],
      innerWidth: 100,
      innerHeight: 50,
      minPointRadius: 4,
      maxPointRadius: 10,
    });
    expect(points.every((p) => p.radius === 4)).toBe(true);
  });
});
