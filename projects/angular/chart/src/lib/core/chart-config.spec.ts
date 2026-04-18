import { describe, expect, it } from 'vitest';
import { buildChartCss, seriesColorVar } from './chart-config';

describe('buildChartCss', () => {
  it('returns empty string when no series has color', () => {
    expect(buildChartCss('abc', { a: { label: 'A' } })).toBe('');
  });

  it('emits scoped CSS vars for raw `color` entries', () => {
    const css = buildChartCss('chart-1', {
      sales: { color: 'hsl(var(--chart-1))' },
      revenue: { color: 'hsl(var(--chart-2))' },
    });
    expect(css).toContain('[data-chart="chart-1"]');
    expect(css).toContain('--color-sales: hsl(var(--chart-1));');
    expect(css).toContain('--color-revenue: hsl(var(--chart-2));');
  });

  it('emits a `[data-mode="dark"]` variant when theme map is provided', () => {
    const css = buildChartCss('c', {
      a: { theme: { light: '#fff', dark: '#000' } },
    });
    expect(css).toContain('[data-chart="c"] {\n  --color-a: #fff;\n}');
    expect(css).toContain('[data-mode="dark"] [data-chart="c"] {\n  --color-a: #000;\n}');
  });

  it('escapes unsafe characters in series keys', () => {
    const css = buildChartCss('c', { 'weird key!': { color: 'red' } });
    expect(css).toContain('--color-weird_key_: red;');
  });
});

describe('seriesColorVar', () => {
  it('produces `var(--color-<key>)`', () => {
    expect(seriesColorVar('sales')).toBe('var(--color-sales)');
  });
  it('escapes identifiers', () => {
    expect(seriesColorVar('a b')).toBe('var(--color-a_b)');
  });
});
