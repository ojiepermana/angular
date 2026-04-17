import { Injectable, computed, signal } from '@angular/core';
import type { ChartIndexRange } from './viewport';

@Injectable()
export class CategoricalViewportContext {
  readonly dataCount = signal<number>(0);
  readonly brushRange = signal<ChartIndexRange | null>(null);
  readonly zoomRange = signal<ChartIndexRange | null>(null);

  readonly hasZoom = computed(() => {
    const range = this.zoomRange();
    const count = this.dataCount();
    return !!range && count > 0 && (range.startIndex > 0 || range.endIndex < count - 1);
  });

  resetZoom(): void {
    this.brushRange.set(null);
    this.zoomRange.set(null);
  }
}
