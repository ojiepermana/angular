import { Injectable, computed, signal } from '@angular/core';
import type { ScaleLinear } from 'd3-scale';
import type { NumericDomain } from './viewport';

@Injectable()
export class ScatterViewportContext {
  readonly innerWidth = signal<number>(0);
  readonly innerHeight = signal<number>(0);
  readonly fullXDomain = signal<NumericDomain | null>(null);
  readonly fullYDomain = signal<NumericDomain | null>(null);
  readonly zoomXDomain = signal<NumericDomain | null>(null);
  readonly zoomYDomain = signal<NumericDomain | null>(null);
  readonly xScale = signal<ScaleLinear<number, number> | null>(null);
  readonly yScale = signal<ScaleLinear<number, number> | null>(null);

  readonly hasZoom = computed(() => this.zoomXDomain() !== null || this.zoomYDomain() !== null);

  resetZoom(): void {
    this.zoomXDomain.set(null);
    this.zoomYDomain.set(null);
  }
}
