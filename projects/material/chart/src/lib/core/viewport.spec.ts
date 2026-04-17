import { describe, expect, it } from 'vitest';
import { effectiveIndexRange, panIndexRange, panNumericDomain, zoomIndexRange, zoomNumericDomain } from './viewport';

describe('viewport helpers', () => {
  it('effectiveIndexRange falls back to the full dataset when null', () => {
    expect(effectiveIndexRange(null, 6)).toEqual({ startIndex: 0, endIndex: 5 });
  });

  it('zoomIndexRange shrinks the visible window around the anchor', () => {
    expect(zoomIndexRange(null, 10, 5, 0.5)).toEqual({ startIndex: 3, endIndex: 7 });
  });

  it('panIndexRange moves a zoomed window without changing its size', () => {
    expect(panIndexRange({ startIndex: 2, endIndex: 5 }, 10, 2)).toEqual({ startIndex: 4, endIndex: 7 });
  });

  it('zoomNumericDomain zooms around the anchor value', () => {
    expect(zoomNumericDomain([0, 100], [0, 100], 75, 0.5)).toEqual([37.5, 87.5]);
  });

  it('panNumericDomain clamps the shifted domain inside the full bounds', () => {
    expect(panNumericDomain([20, 40], [0, 100], -15)).toEqual([5, 25]);
    expect(panNumericDomain([20, 40], [0, 100], 90)).toEqual([80, 100]);
  });
});
