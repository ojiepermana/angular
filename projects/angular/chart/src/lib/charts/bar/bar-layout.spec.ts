import { describe, expect, it } from 'vitest';
import { computeBarLayout } from './bar-layout';

const data = [
  { month: 'Jan', desktop: 100, mobile: 50 },
  { month: 'Feb', desktop: 200, mobile: 80 },
];

describe('computeBarLayout', () => {
  it('grouped vertical: produces one bar per (datum, series)', () => {
    const { bars, categories } = computeBarLayout({
      data,
      xKey: 'month',
      seriesKeys: ['desktop', 'mobile'],
      variant: 'grouped',
      orientation: 'vertical',
      innerWidth: 200,
      innerHeight: 100,
      bandPadding: 0.2,
      groupPadding: 0.05,
    });
    expect(bars).toHaveLength(4);
    expect(categories).toEqual(['Jan', 'Feb']);
    // Bars should sit within the inner area.
    for (const b of bars) {
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.y).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(200 + 0.01);
      expect(b.y + b.height).toBeLessThanOrEqual(100 + 0.01);
    }
    expect(bars[0].color).toBe('var(--color-desktop)');
  });

  it('stacked vertical: bars in the same category share an x-band', () => {
    const { bars } = computeBarLayout({
      data,
      xKey: 'month',
      seriesKeys: ['desktop', 'mobile'],
      variant: 'stacked',
      orientation: 'vertical',
      innerWidth: 200,
      innerHeight: 100,
      bandPadding: 0.2,
      groupPadding: 0.05,
    });
    const janBars = bars.filter((b) => b.category === 'Jan');
    expect(janBars).toHaveLength(2);
    expect(janBars[0].x).toBe(janBars[1].x);
    expect(janBars[0].width).toBe(janBars[1].width);
  });

  it('horizontal grouped: value maps to width, category to y', () => {
    const { bars } = computeBarLayout({
      data,
      xKey: 'month',
      seriesKeys: ['desktop'],
      variant: 'grouped',
      orientation: 'horizontal',
      innerWidth: 200,
      innerHeight: 100,
      bandPadding: 0.2,
      groupPadding: 0.05,
    });
    expect(bars).toHaveLength(2);
    // Bigger value → wider bar.
    expect(bars[1].width).toBeGreaterThan(bars[0].width);
    expect(bars[0].x).toBe(0);
  });

  it('empty series list yields no bars', () => {
    const { bars } = computeBarLayout({
      data,
      xKey: 'month',
      seriesKeys: [],
      variant: 'grouped',
      orientation: 'vertical',
      innerWidth: 200,
      innerHeight: 100,
      bandPadding: 0.2,
      groupPadding: 0.05,
    });
    expect(bars).toHaveLength(0);
  });
});
